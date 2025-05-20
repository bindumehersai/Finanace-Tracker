
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from 'date-fns';
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Chart, registerables } from 'chart.js';
import { Transaction } from '@/types/finance';

Chart.register(...registerables);

interface DetailedFinanceChartProps {
  transactions: Transaction[];
}

const DetailedFinanceChart: React.FC<DetailedFinanceChartProps> = ({ transactions }) => {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(new Date().setMonth(new Date().getMonth() - 12)));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [chartType, setChartType] = useState<'monthly' | 'weekly' | 'yearly'>('monthly');
  const [viewMode, setViewMode] = useState<'income' | 'expense' | 'both'>('both');
  
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Generate chart data based on date range and view mode
  useEffect(() => {
    if (!chartRef.current || !startDate || !endDate) return;

    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;
    
    // Filter transactions by date range
    const filteredTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
    
    // Format data based on chart type
    let labels: string[] = [];
    let incomeData: number[] = [];
    let expenseData: number[] = [];
    
    if (chartType === 'monthly') {
      // Get all months between start and end date
      const monthLabels = [];
      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        monthLabels.push(`${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`);
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
      
      labels = monthLabels;
      
      // Initialize data arrays with zeros
      incomeData = new Array(labels.length).fill(0);
      expenseData = new Array(labels.length).fill(0);
      
      // Fill data
      filteredTransactions.forEach(transaction => {
        const date = new Date(transaction.date);
        const monthYear = `${months[date.getMonth()]} ${date.getFullYear()}`;
        const index = labels.indexOf(monthYear);
        
        if (index !== -1) {
          if (transaction.type === 'income') {
            incomeData[index] += transaction.amount;
          } else {
            expenseData[index] += transaction.amount;
          }
        }
      });
    } else if (chartType === 'yearly') {
      // Get all years between start and end date
      const startYear = startDate.getFullYear();
      const endYear = endDate.getFullYear();
      
      for (let year = startYear; year <= endYear; year++) {
        labels.push(year.toString());
      }
      
      // Initialize data arrays with zeros
      incomeData = new Array(labels.length).fill(0);
      expenseData = new Array(labels.length).fill(0);
      
      // Fill data
      filteredTransactions.forEach(transaction => {
        const date = new Date(transaction.date);
        const year = date.getFullYear().toString();
        const index = labels.indexOf(year);
        
        if (index !== -1) {
          if (transaction.type === 'income') {
            incomeData[index] += transaction.amount;
          } else {
            expenseData[index] += transaction.amount;
          }
        }
      });
    } else if (chartType === 'weekly') {
      // Create week labels (last 12 weeks max)
      const weeksToShow = Math.min(12, Math.ceil((endDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000)));
      
      for (let i = 0; i < weeksToShow; i++) {
        const weekStart = new Date(endDate);
        weekStart.setDate(weekStart.getDate() - (i + 1) * 7);
        const weekEnd = new Date(endDate);
        weekEnd.setDate(weekEnd.getDate() - i * 7 - 1);
        
        labels.unshift(`${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d')}`);
      }
      
      // Initialize data arrays with zeros
      incomeData = new Array(labels.length).fill(0);
      expenseData = new Array(labels.length).fill(0);
      
      // Fill data
      filteredTransactions.forEach(transaction => {
        const transactionDate = new Date(transaction.date);
        
        for (let i = 0; i < labels.length; i++) {
          const weekStart = new Date(endDate);
          weekStart.setDate(weekStart.getDate() - (labels.length - i) * 7);
          const weekEnd = new Date(endDate);
          weekEnd.setDate(weekEnd.getDate() - (labels.length - i - 1) * 7 - 1);
          
          if (transactionDate >= weekStart && transactionDate <= weekEnd) {
            if (transaction.type === 'income') {
              incomeData[i] += transaction.amount;
            } else {
              expenseData[i] += transaction.amount;
            }
            break;
          }
        }
      });
    }

    // Create datasets based on view mode
    const datasets = [];
    
    if (viewMode === 'both' || viewMode === 'income') {
      datasets.push({
        label: 'Income',
        data: incomeData,
        backgroundColor: 'rgba(124, 58, 237, 0.7)',
        borderColor: 'rgba(124, 58, 237, 1)',
        borderWidth: 1,
      });
    }
    
    if (viewMode === 'both' || viewMode === 'expense') {
      datasets.push({
        label: 'Expenses',
        data: expenseData,
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
      });
    }

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets,
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return '₹' + value;
              }
            }
          }
        },
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.dataset.label || '';
                const value = context.raw;
                return `${label}: ₹${value}`;
              }
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index',
        },
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [startDate, endDate, chartType, viewMode, transactions]);

  return (
    <Card className="bg-gradient-to-b from-white to-purple-50 border-purple-100">
      <CardHeader className="border-b border-purple-100">
        <CardTitle className="text-purple-800">Detailed Financial Analysis</CardTitle>
        <CardDescription>Select date range and view options to analyze your finances</CardDescription>
        
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Start Date</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[180px] justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 pointer-events-auto">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">End Date</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[180px] justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 pointer-events-auto">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Time Period</span>
            <Select value={chartType} onValueChange={(value: 'monthly' | 'weekly' | 'yearly') => setChartType(value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">View Mode</span>
            <Select value={viewMode} onValueChange={(value: 'income' | 'expense' | 'both') => setViewMode(value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="both">Income & Expense</SelectItem>
                <SelectItem value="income">Income Only</SelectItem>
                <SelectItem value="expense">Expense Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[400px] w-full">
          <canvas ref={chartRef}></canvas>
        </div>
      </CardContent>
    </Card>
  );
};

export default DetailedFinanceChart;
