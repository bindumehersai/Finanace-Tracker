
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Budget, DEFAULT_CATEGORIES } from '@/types/finance';
import { PlusCircle, Pencil, Trash2 } from "lucide-react";

interface BudgetFormProps {
  isOpen: boolean;
  onClose: () => void;
  budgets: Budget[];
  onAddBudget: (budget: Omit<Budget, "id">) => void;
  onUpdateBudget: (budget: Budget) => void;
  onDeleteBudget: (id: string) => void;
}

const BudgetForm: React.FC<BudgetFormProps> = ({
  isOpen,
  onClose,
  budgets,
  onAddBudget,
  onUpdateBudget,
  onDeleteBudget
}) => {
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [editingBudgetId, setEditingBudgetId] = useState<string | null>(null);

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setAmount('');
    setCategory('');
    setPeriod('monthly');
    setEditingBudgetId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const budgetData = {
      amount: parseFloat(amount),
      category,
      period,
    };

    if (!isNaN(budgetData.amount) && budgetData.amount > 0 && category) {
      if (editingBudgetId) {
        onUpdateBudget({ ...budgetData, id: editingBudgetId });
      } else {
        onAddBudget(budgetData);
      }
      resetForm();
    }
  };

  const handleEdit = (budget: Budget) => {
    setAmount(budget.amount.toString());
    setCategory(budget.category);
    setPeriod(budget.period);
    setEditingBudgetId(budget.id);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this budget?")) {
      onDeleteBudget(id);
      if (editingBudgetId === id) {
        resetForm();
      }
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Get categories that don't already have budgets
  const availableCategories = DEFAULT_CATEGORIES.expense.filter(
    cat => !budgets.some(b => b.category === cat) || cat === category
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Budgets</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              value={category} 
              onValueChange={setCategory}
              disabled={availableCategories.length === 0 && !editingBudgetId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {availableCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Budget Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="0"
              step="0.01"
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="period">Period</Label>
            <Select value={period} onValueChange={(value) => setPeriod(value as 'monthly' | 'yearly')}>
              <SelectTrigger>
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={availableCategories.length === 0 && !editingBudgetId}
          >
            {editingBudgetId ? 'Update Budget' : 'Add Budget'}
          </Button>
        </form>
        
        <div className="mt-6 border-t pt-4">
          <h3 className="text-md font-medium mb-2">Current Budgets</h3>
          
          {budgets.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No budgets set yet</p>
          ) : (
            <div className="overflow-y-auto max-h-64">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {budgets.map((budget) => (
                    <TableRow key={budget.id}>
                      <TableCell>{budget.category}</TableCell>
                      <TableCell>
                        {formatCurrency(budget.amount)}
                        <span className="text-xs text-muted-foreground ml-1">
                          ({budget.period})
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(budget)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(budget.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BudgetForm;
