
import React from 'react';
import { Button } from "@/components/ui/button";
import { CreditCard, BarChart } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface HeaderProps {
  openTransactionForm: () => void;
  openBudgetForm: () => void;
}

const Header: React.FC<HeaderProps> = ({ openTransactionForm, openBudgetForm }) => {
  return (
    <header className="bg-gradient-to-r from-purple-500 via-blue-500 to-teal-400 shadow-lg py-4 px-4 md:px-6 flex justify-between items-center sticky top-0 z-10">
      <div className="flex items-center">
        <div className="bg-white rounded-full h-8 w-8 flex items-center justify-center mr-3">
          <span className="text-purple-600 font-bold text-lg">₹</span>
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-white">Spendly</h1>
      </div>
      <div className="flex space-x-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              size="sm" 
              onClick={openTransactionForm} 
              variant="outline" 
              className="bg-white/20 text-white hover:bg-white/30 border-white/30"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add a new transaction</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              size="sm" 
              onClick={openBudgetForm} 
              className="bg-white/90 text-purple-600 hover:bg-white"
            >
              <BarChart className="mr-2 h-4 w-4" />
              Manage Budgets
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Manage your budgets</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
};

export default Header;
