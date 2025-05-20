
import React from 'react';
import { Button } from "@/components/ui/button";

interface HeaderProps {
  openTransactionForm: () => void;
  openBudgetForm: () => void;
}

const Header: React.FC<HeaderProps> = ({ openTransactionForm, openBudgetForm }) => {
  return (
    <header className="bg-white shadow-sm py-3 px-4 md:px-6 flex justify-between items-center sticky top-0 z-10">
      <div className="flex items-center">
        <h1 className="text-xl md:text-2xl font-bold">Personal Finance Tracker</h1>
      </div>
      <div className="flex space-x-2">
        <Button size="sm" onClick={openTransactionForm} variant="outline">
          Add Transaction
        </Button>
        <Button size="sm" onClick={openBudgetForm}>
          Manage Budgets
        </Button>
      </div>
    </header>
  );
};

export default Header;
