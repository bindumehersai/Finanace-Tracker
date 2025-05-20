
import { useState, useEffect, useCallback } from "react";
import { FinanceData, Transaction, Budget, SummaryData, CategoryTotal, ChartData } from "@/types/finance";
import { toast } from "sonner";
import { useToast } from "@/components/ui/use-toast";

const STORAGE_KEY = "spendly-finance-tracker";

// Default empty state
const DEFAULT_DATA: FinanceData = {
  transactions: [],
  budgets: [],
  hasOnboarded: false,
};

export function useFinanceData() {
  const [data, setData] = useState<FinanceData>(DEFAULT_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const { toast: uiToast } = useToast();

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        setData(JSON.parse(savedData));
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      toast.error("Failed to load your financial data");
      uiToast({
        title: "Error loading data",
        description: "We couldn't load your saved data. Starting with empty data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [uiToast]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (error) {
        console.error("Error saving data to localStorage:", error);
        toast.error("Failed to save your financial data");
      }
    }
  }, [data, isLoading]);

  // Calculate summary data
  const getSummaryData = useCallback((): SummaryData => {
    const totalIncome = data.transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = data.transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalBudget = data.budgets.reduce((sum, b) => sum + b.amount, 0);

    return {
      totalIncome,
      totalExpenses,
      totalSavings: totalIncome - totalExpenses,
      budgetRemaining: Math.max(totalBudget - totalExpenses, 0),
    };
  }, [data]);

  // Generate chart data
  const getChartData = useCallback((): ChartData => {
    // Get expenses by category
    const expensesByCategory: Record<string, number> = {};
    data.transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
      });

    // Transform to array for chart
    const expensesByCategoryArray: CategoryTotal[] = Object.keys(expensesByCategory).map(
      (category) => ({
        category,
        amount: expensesByCategory[category],
      })
    );

    // Get income vs expense by month (all 12 months)
    const months: Record<string, { income: number; expense: number }> = {};
    
    // Get date 12 months ago
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
    
    // Initialize months
    for (let i = 0; i < 12; i++) {
      const monthDate = new Date(twelveMonthsAgo);
      monthDate.setMonth(twelveMonthsAgo.getMonth() + i);
      const monthKey = `${monthDate.getFullYear()}-${(monthDate.getMonth() + 1).toString().padStart(2, '0')}`;
      months[monthKey] = { income: 0, expense: 0 };
    }
    
    // Fill with data
    data.transactions.forEach((t) => {
      const transactionMonth = t.date.substring(0, 7); // YYYY-MM format
      
      if (months[transactionMonth]) {
        if (t.type === "income") {
          months[transactionMonth].income += t.amount;
        } else {
          months[transactionMonth].expense += t.amount;
        }
      }
    });
    
    // Format for chart
    const labels = Object.keys(months).map((monthKey) => {
      const [year, month] = monthKey.split('-');
      return new Date(parseInt(year), parseInt(month) - 1).toLocaleString('default', { month: 'short' });
    });
    
    const incomeData = Object.values(months).map((m) => m.income);
    const expenseData = Object.values(months).map((m) => m.expense);

    return {
      expensesByCategory: expensesByCategoryArray,
      incomeVsExpenseByMonth: {
        labels,
        incomeData,
        expenseData,
      },
    };
  }, [data]);

  // CRUD operations for transactions
  const addTransaction = useCallback((transaction: Omit<Transaction, "id">) => {
    setData((prev) => ({
      ...prev,
      transactions: [
        ...prev.transactions,
        { ...transaction, id: crypto.randomUUID() },
      ],
    }));
    toast.success("Transaction added successfully");
  }, []);

  const updateTransaction = useCallback((updatedTransaction: Transaction) => {
    setData((prev) => ({
      ...prev,
      transactions: prev.transactions.map((t) =>
        t.id === updatedTransaction.id ? updatedTransaction : t
      ),
    }));
    toast.success("Transaction updated successfully");
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((t) => t.id !== id),
    }));
    toast.success("Transaction deleted");
  }, []);

  // CRUD operations for budgets
  const addBudget = useCallback((budget: Omit<Budget, "id">) => {
    setData((prev) => ({
      ...prev,
      budgets: [...prev.budgets, { ...budget, id: crypto.randomUUID() }],
    }));
    toast.success("Budget added successfully");
  }, []);

  const updateBudget = useCallback((updatedBudget: Budget) => {
    setData((prev) => ({
      ...prev,
      budgets: prev.budgets.map((b) =>
        b.id === updatedBudget.id ? updatedBudget : b
      ),
    }));
    toast.success("Budget updated successfully");
  }, []);

  const deleteBudget = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      budgets: prev.budgets.filter((b) => b.id !== id),
    }));
    toast.success("Budget removed");
  }, []);

  // Complete onboarding
  const completeOnboarding = useCallback(() => {
    setData((prev) => ({
      ...prev,
      hasOnboarded: true,
    }));
  }, []);

  return {
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
  };
}
