
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  description: string;
  date: string;
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
  period: 'monthly' | 'yearly';
}

export interface FinanceData {
  transactions: Transaction[];
  budgets: Budget[];
  hasOnboarded: boolean;
}

export interface SummaryData {
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
  budgetRemaining: number;
}

export interface CategoryTotal {
  category: string;
  amount: number;
}

export interface ChartData {
  expensesByCategory: CategoryTotal[];
  incomeVsExpenseByMonth: {
    labels: string[];
    incomeData: number[];
    expenseData: number[];
  };
}

export const DEFAULT_CATEGORIES = {
  income: [
    'Salary',
    'Freelance',
    'Investments',
    'Gifts',
    'Other'
  ],
  expense: [
    'Housing',
    'Food',
    'Utilities',
    'Transportation',
    'Entertainment',
    'Healthcare',
    'Shopping',
    'Education',
    'Personal',
    'Debt',
    'Other'
  ]
};
