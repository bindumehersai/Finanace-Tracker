
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryTotal } from '@/types/finance';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface ExpenseChartProps {
  data: CategoryTotal[];
}

const ExpenseChart: React.FC<ExpenseChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return;

    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Colors for different categories
    const backgroundColors = [
      'rgba(255, 99, 132, 0.7)',
      'rgba(54, 162, 235, 0.7)',
      'rgba(255, 206, 86, 0.7)',
      'rgba(75, 192, 192, 0.7)',
      'rgba(153, 102, 255, 0.7)',
      'rgba(255, 159, 64, 0.7)',
      'rgba(255, 99, 132, 0.7)',
      'rgba(54, 162, 235, 0.7)',
      'rgba(255, 206, 86, 0.7)',
      'rgba(75, 192, 192, 0.7)',
      'rgba(153, 102, 255, 0.7)',
    ];

    const sortedData = [...data].sort((a, b) => b.amount - a.amount);

    chartInstance.current = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: sortedData.map(item => item.category),
        datasets: [{
          data: sortedData.map(item => item.amount),
          backgroundColor: backgroundColors.slice(0, sortedData.length),
          borderWidth: 1,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              boxWidth: 12,
              padding: 15,
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw as number;
                const total = (context.chart.data.datasets[0].data as number[]).reduce((a, b) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ₹${value} (${percentage}%)`;
              }
            }
          }
        },
        animation: {
          animateRotate: true,
          animateScale: true
        },
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  if (data.length === 0) {
    return (
      <Card className="bg-gradient-to-b from-white to-purple-50 border-purple-100">
        <CardHeader className="border-b border-purple-100">
          <CardTitle className="text-purple-800">Expenses by Category</CardTitle>
        </CardHeader>
        <CardContent className="h-72 flex items-center justify-center">
          <p className="text-muted-foreground">No expense data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-b from-white to-purple-50 border-purple-100">
      <CardHeader className="border-b border-purple-100">
        <CardTitle className="text-purple-800">Expenses by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <canvas ref={chartRef}></canvas>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseChart;
