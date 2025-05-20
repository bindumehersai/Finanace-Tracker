
import React, { useState, useEffect } from 'react';
import { useFinanceData } from '@/hooks/useFinanceData';
import Header from '@/components/Layout/Header';
import Sidebar from '@/components/Layout/Sidebar';
import SummaryCards from '@/components/Dashboard/SummaryCards';
import ExpenseChart from '@/components/Dashboard/ExpenseChart';
import IncomeExpenseChart from '@/components/Dashboard/IncomeExpenseChart';
import DetailedFinanceChart from '@/components/Dashboard/DetailedFinanceChart';
import TransactionList from '@/components/Transactions/TransactionList';
import BudgetMeter from '@/components/Budget/BudgetMeter';
import BudgetForm from '@/components/Budget/BudgetForm';
import TransactionForm from '@/components/Transactions/TransactionForm';
import OnboardingGuide from '@/components/Common/OnboardingGuide';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);
  const [isBudgetFormOpen, setIsBudgetFormOpen] = useState(false);
  
  const {
    data,
    isLoading,
    getSummaryData,
    getChartData,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addBudget,
    updateBudget,
    deleteBudget,
    completeOnboarding,
  } = useFinanceData();

  // Only show onboarding when data is loaded and user hasn't completed onboarding
  const showOnboarding = !isLoading && !data.hasOnboarded;

  // Callbacks
  const handleOpenTransactionForm = () => {
    setIsTransactionFormOpen(true);
  };

  const handleOpenBudgetForm = () => {
    setIsBudgetFormOpen(true);
  };

  const handleCompleteOnboarding = () => {
    completeOnboarding();
  };

  // Compute summary and chart data
  const summaryData = getSummaryData();
  const chartData = getChartData();
  
  // Filter expenses for budget tracking
  const expenses = data.transactions.filter(t => t.type === 'expense');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-100 to-blue-100">
        <div className="flex flex-col items-center">
          <div className="bg-white rounded-full h-20 w-20 flex items-center justify-center mb-4 shadow-lg">
            <span className="text-purple-600 font-bold text-4xl">₹</span>
          </div>
          <h1 className="text-2xl font-bold text-purple-800 mb-4">Spendly</h1>
          <p className="text-purple-600">Loading your finance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <Header
        openTransactionForm={handleOpenTransactionForm}
        openBudgetForm={handleOpenBudgetForm}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-transparent">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <SummaryCards data={summaryData} />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ExpenseChart data={chartData.expensesByCategory} />
                <IncomeExpenseChart data={chartData.incomeVsExpenseByMonth} />
              </div>
              
              <DetailedFinanceChart transactions={data.transactions} />
              
              <BudgetMeter
                budgets={data.budgets}
                expenses={expenses}
              />
            </div>
          )}
          
          {activeTab === 'transactions' && (
            <TransactionList
              transactions={data.transactions}
              onAddTransaction={addTransaction}
              onUpdateTransaction={updateTransaction}
              onDeleteTransaction={deleteTransaction}
            />
          )}
          
          {activeTab === 'budget' && (
            <div className="space-y-6">
              <BudgetMeter
                budgets={data.budgets}
                expenses={expenses}
              />
              <div className="text-center">
                <button
                  onClick={handleOpenBudgetForm}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Manage Budgets
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'expenses' && (
            <div className="space-y-6">
              <ExpenseChart data={chartData.expensesByCategory} />
              <DetailedFinanceChart transactions={data.transactions.filter(t => t.type === 'expense')} />
              <TransactionList
                transactions={data.transactions.filter(t => t.type === 'expense')}
                onAddTransaction={addTransaction}
                onUpdateTransaction={updateTransaction}
                onDeleteTransaction={deleteTransaction}
              />
            </div>
          )}
          
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <DetailedFinanceChart transactions={data.transactions} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ExpenseChart data={chartData.expensesByCategory} />
                <IncomeExpenseChart data={chartData.incomeVsExpenseByMonth} />
              </div>
              <BudgetMeter
                budgets={data.budgets}
                expenses={expenses}
              />
            </div>
          )}
        </main>
      </div>
      
      {/* Dialogs */}
      <TransactionForm
        isOpen={isTransactionFormOpen}
        onClose={() => setIsTransactionFormOpen(false)}
        onSave={addTransaction}
      />
      
      <BudgetForm
        isOpen={isBudgetFormOpen}
        onClose={() => setIsBudgetFormOpen(false)}
        budgets={data.budgets}
        onAddBudget={addBudget}
        onUpdateBudget={updateBudget}
        onDeleteBudget={deleteBudget}
      />
      
      <OnboardingGuide
        isOpen={showOnboarding}
        onComplete={handleCompleteOnboarding}
      />
    </div>
  );
};

export default Index;
