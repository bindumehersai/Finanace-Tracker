
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface IncomeExpenseChartProps {
  data: {
    labels: string[];
    incomeData: number[];
    expenseData: number[];
  };
}

const IncomeExpenseChart: React.FC<IncomeExpenseChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current || data.labels.length === 0) return;

    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [
          {
            label: 'Income',
            data: data.incomeData,
            backgroundColor: 'rgba(124, 58, 237, 0.7)',
            borderColor: 'rgba(124, 58, 237, 1)',
            borderWidth: 1,
            barPercentage: 0.6,
            categoryPercentage: 0.7,
          },
          {
            label: 'Expenses',
            data: data.expenseData,
            backgroundColor: 'rgba(239, 68, 68, 0.7)',
            borderColor: 'rgba(239, 68, 68, 1)',
            borderWidth: 1,
            barPercentage: 0.6,
            categoryPercentage: 0.7,
          }
        ]
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
  }, [data]);

  if (data.labels.length === 0) {
    return (
      <Card className="bg-gradient-to-b from-white to-blue-50 border-blue-100">
        <CardHeader className="border-b border-blue-100">
          <CardTitle className="text-blue-800">Income vs. Expenses (6 Months)</CardTitle>
        </CardHeader>
        <CardContent className="h-72 flex items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-b from-white to-blue-50 border-blue-100">
      <CardHeader className="border-b border-blue-100">
        <CardTitle className="text-blue-800">Income vs. Expenses (6 Months)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <canvas ref={chartRef}></canvas>
        </div>
      </CardContent>
    </Card>
  );
};

export default IncomeExpenseChart;
