
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, PiggyBank, CreditCard, Percent } from "lucide-react";
import { SummaryData } from '@/types/finance';

interface SummaryCardsProps {
  data: SummaryData;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ data }) => {
  const { totalIncome, totalExpenses, totalSavings, budgetRemaining } = data;
  
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  const savingsRate = totalIncome > 0 
    ? Math.round((totalSavings / totalIncome) * 100) 
    : 0;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="card-shadow card-hover">
        <CardContent className="p-6 flex items-center">
          <div className="bg-income/10 p-3 rounded-full mr-4">
            <Wallet className="h-6 w-6 text-income" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Income</p>
            <h3 className="text-2xl font-bold text-income">{formatCurrency(totalIncome)}</h3>
          </div>
        </CardContent>
      </Card>
      
      <Card className="card-shadow card-hover">
        <CardContent className="p-6 flex items-center">
          <div className="bg-expense/10 p-3 rounded-full mr-4">
            <CreditCard className="h-6 w-6 text-expense" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
            <h3 className="text-2xl font-bold text-expense">{formatCurrency(totalExpenses)}</h3>
          </div>
        </CardContent>
      </Card>
      
      <Card className="card-shadow card-hover">
        <CardContent className="p-6 flex items-center">
          <div className="bg-savings/10 p-3 rounded-full mr-4">
            <PiggyBank className="h-6 w-6 text-savings" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Savings</p>
            <h3 className="text-2xl font-bold text-savings">
              {formatCurrency(totalSavings)}
              <span className="text-xs ml-1 font-normal">({savingsRate}%)</span>
            </h3>
          </div>
        </CardContent>
      </Card>
      
      <Card className="card-shadow card-hover">
        <CardContent className="p-6 flex items-center">
          <div className="bg-budget/10 p-3 rounded-full mr-4">
            <Percent className="h-6 w-6 text-budget" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Budget Remaining</p>
            <h3 className="text-2xl font-bold text-budget">{formatCurrency(budgetRemaining)}</h3>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryCards;
