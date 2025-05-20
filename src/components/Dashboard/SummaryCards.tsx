
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
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  const savingsRate = totalIncome > 0 
    ? Math.round((totalSavings / totalIncome) * 100) 
    : 0;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="card-shadow card-hover bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
        <CardContent className="p-6 flex items-center">
          <div className="bg-green-500/20 p-3 rounded-full mr-4">
            <Wallet className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-green-800">Total Income</p>
            <h3 className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</h3>
          </div>
        </CardContent>
      </Card>
      
      <Card className="card-shadow card-hover bg-gradient-to-br from-red-50 to-rose-100 border-red-200">
        <CardContent className="p-6 flex items-center">
          <div className="bg-red-500/20 p-3 rounded-full mr-4">
            <CreditCard className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-red-800">Total Expenses</p>
            <h3 className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</h3>
          </div>
        </CardContent>
      </Card>
      
      <Card className="card-shadow card-hover bg-gradient-to-br from-blue-50 to-sky-100 border-blue-200">
        <CardContent className="p-6 flex items-center">
          <div className="bg-blue-500/20 p-3 rounded-full mr-4">
            <PiggyBank className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-blue-800">Total Savings</p>
            <h3 className="text-2xl font-bold text-blue-600">
              {formatCurrency(totalSavings)}
              <span className="text-xs ml-1 font-normal">({savingsRate}%)</span>
            </h3>
          </div>
        </CardContent>
      </Card>
      
      <Card className="card-shadow card-hover bg-gradient-to-br from-amber-50 to-yellow-100 border-amber-200">
        <CardContent className="p-6 flex items-center">
          <div className="bg-amber-500/20 p-3 rounded-full mr-4">
            <Percent className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-amber-800">Budget Remaining</p>
            <h3 className="text-2xl font-bold text-amber-600">{formatCurrency(budgetRemaining)}</h3>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryCards;
