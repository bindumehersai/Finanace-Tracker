
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Budget, Transaction } from "@/types/finance";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface BudgetMeterProps {
  budgets: Budget[];
  expenses: Transaction[];
}

const BudgetMeter: React.FC<BudgetMeterProps> = ({ budgets, expenses }) => {
  if (budgets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Budget Tracking</CardTitle>
        </CardHeader>
        <CardContent className="py-6">
          <div className="text-center text-muted-foreground">
            <p>No budgets set yet.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get expenses by category
  const expensesByCategory: Record<string, number> = {};
  expenses.forEach((transaction) => {
    if (transaction.type === "expense") {
      expensesByCategory[transaction.category] = (expensesByCategory[transaction.category] || 0) + transaction.amount;
    }
  });

  // Calculate total budget
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalExpenses = expenses
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate overall budget usage percentage
  const overallUsagePercentage = Math.min(
    Math.round((totalExpenses / totalBudget) * 100),
    100
  );

  // Format currency helper
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getBudgetStatusColor = (usagePercentage: number): string => {
    if (usagePercentage >= 100) return "text-destructive";
    if (usagePercentage >= 80) return "text-budget";
    return "text-income";
  };

  const getProgressColor = (usagePercentage: number): string => {
    if (usagePercentage >= 100) return "bg-destructive";
    if (usagePercentage >= 80) return "bg-budget";
    return "bg-income";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Tracking</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall budget summary */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="font-medium">Overall Budget</p>
            <p className={getBudgetStatusColor(overallUsagePercentage)}>
              {formatCurrency(totalExpenses)} / {formatCurrency(totalBudget)} ({overallUsagePercentage}%)
            </p>
          </div>
          <Progress 
            value={overallUsagePercentage} 
            className={`h-2 ${getProgressColor(overallUsagePercentage)}`}
          />
        </div>

        {/* Budget warnings */}
        {overallUsagePercentage >= 90 && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Budget Warning</AlertTitle>
            <AlertDescription>
              You've used {overallUsagePercentage}% of your total budget. Consider adjusting your spending.
            </AlertDescription>
          </Alert>
        )}

        {/* Individual budgets */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Category Budgets</h3>
          
          {budgets.map((budget) => {
            const spent = expensesByCategory[budget.category] || 0;
            const percentage = Math.min(Math.round((spent / budget.amount) * 100), 100);
            
            return (
              <div key={budget.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm">{budget.category}</p>
                  <p className={`text-sm ${getBudgetStatusColor(percentage)}`}>
                    {formatCurrency(spent)} / {formatCurrency(budget.amount)} ({percentage}%)
                  </p>
                </div>
                <Progress 
                  value={percentage} 
                  className={`h-1.5 ${getProgressColor(percentage)}`}
                />
                
                {percentage >= 80 && percentage < 100 && (
                  <p className="text-xs text-budget">
                    Warning: You've used {percentage}% of your {budget.category} budget
                  </p>
                )}
                
                {percentage >= 100 && (
                  <p className="text-xs text-destructive">
                    Alert: You've exceeded your {budget.category} budget
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetMeter;
