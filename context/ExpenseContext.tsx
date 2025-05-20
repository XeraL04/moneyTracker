import { Category, Expense, ExpenseWithCategory } from "@/types";
import * as storage from "@/utils/storage";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface ExpenseContextType {
  categories: Category[];
  expenses: Expense[];
  isLoading: boolean;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  deleteExpense: (expenseId: string) => Promise<void>;
  totalSpending: number;
  categoryTotals: Record<string, number>;
  getExpensesWithCategories: () => ExpenseWithCategory[];
  getCategoryById: (id: string) => Category | undefined;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalSpending, setTotalSpending] = useState(0);
  const [categoryTotals, setCategoryTotals] = useState<Record<string, number>>({});

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        await storage.initializeStorage();
        
        const loadedCategories = await storage.getCategories();
        setCategories(loadedCategories);
        
        const loadedExpenses = await storage.getExpenses();
        setExpenses(loadedExpenses);
        
        // Calculate totals
        const total = loadedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        setTotalSpending(total);
        
        // Calculate category totals
        const catTotals = loadedExpenses.reduce((acc, expense) => {
          const { categoryId, amount } = expense;
          acc[categoryId] = (acc[categoryId] || 0) + amount;
          return acc;
        }, {} as Record<string, number>);
        setCategoryTotals(catTotals);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  const addCategoryHandler = async (category: Omit<Category, 'id'>) => {
    const newCategory = await storage.addCategory(category);
    if (newCategory) {
      setCategories(prev => [...prev, newCategory]);
    }
  };

  const deleteCategoryHandler = async (categoryId: string) => {
    const success = await storage.deleteCategory(categoryId);
    if (success) {
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
      
      // Also remove expenses with this category
      const updatedExpenses = expenses.filter(exp => exp.categoryId !== categoryId);
      setExpenses(updatedExpenses);
      
      // Update totals
      const total = updatedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      setTotalSpending(total);
      
      // Update category totals
      const catTotals = updatedExpenses.reduce((acc, expense) => {
        const { categoryId, amount } = expense;
        acc[categoryId] = (acc[categoryId] || 0) + amount;
        return acc;
      }, {} as Record<string, number>);
      setCategoryTotals(catTotals);
    }
  };

  const addExpenseHandler = async (expense: Omit<Expense, 'id'>) => {
    const newExpense = await storage.addExpense(expense);
    if (newExpense) {
      setExpenses(prev => [...prev, newExpense]);
      
      // Update total spending
      setTotalSpending(prev => prev + newExpense.amount);
      
      // Update category total
      setCategoryTotals(prev => ({
        ...prev,
        [newExpense.categoryId]: (prev[newExpense.categoryId] || 0) + newExpense.amount
      }));
    }
  };

  const deleteExpenseHandler = async (expenseId: string) => {
    const expenseToDelete = expenses.find(e => e.id === expenseId);
    if (!expenseToDelete) return;
    
    const success = await storage.deleteExpense(expenseId);
    if (success) {
      setExpenses(prev => prev.filter(exp => exp.id !== expenseId));
      
      // Update total spending
      setTotalSpending(prev => prev - expenseToDelete.amount);
      
      // Update category total
      setCategoryTotals(prev => ({
        ...prev,
        [expenseToDelete.categoryId]: (prev[expenseToDelete.categoryId] || 0) - expenseToDelete.amount
      }));
    }
  };

  const getExpensesWithCategories = (): ExpenseWithCategory[] => {
    return expenses.map(expense => {
      const category = categories.find(cat => cat.id === expense.categoryId) || {
        id: 'unknown',
        name: 'Unknown',
        color: '#CCCCCC'
      };
      return { ...expense, category };
    });
  };

  const getCategoryById = (id: string) => {
    return categories.find(cat => cat.id === id);
  };

  const value = {
    categories,
    expenses,
    isLoading,
    addCategory: addCategoryHandler,
    deleteCategory: deleteCategoryHandler,
    addExpense: addExpenseHandler,
    deleteExpense: deleteExpenseHandler,
    totalSpending,
    categoryTotals,
    getExpensesWithCategories,
    getCategoryById
  };

  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>;
}

export function useExpenses() {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
}