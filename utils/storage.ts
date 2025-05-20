import AsyncStorage from '@react-native-async-storage/async-storage';
import { Category, Expense } from '@/types';

// Keys for AsyncStorage
const CATEGORIES_KEY = 'expense_tracker_categories';
const EXPENSES_KEY = 'expense_tracker_expenses';

// Default categories
const defaultCategories: Category[] = [
  { id: '1', name: 'Food', color: '#FF9500' },
  { id: '2', name: 'Transport', color: '#5856D6' },
  { id: '3', name: 'Shopping', color: '#FF2D55' },
  { id: '4', name: 'Entertainment', color: '#5AC8FA' },
  { id: '5', name: 'Bills', color: '#007AFF' },
];

// Initialize default categories if none exist
export const initializeStorage = async (): Promise<void> => {
  try {
    const categories = await AsyncStorage.getItem(CATEGORIES_KEY);
    if (!categories) {
      await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(defaultCategories));
    }

    const expenses = await AsyncStorage.getItem(EXPENSES_KEY);
    if (!expenses) {
      await AsyncStorage.setItem(EXPENSES_KEY, JSON.stringify([]));
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
};

// Get all categories
export const getCategories = async (): Promise<Category[]> => {
  try {
    const categoriesJSON = await AsyncStorage.getItem(CATEGORIES_KEY);
    return categoriesJSON ? JSON.parse(categoriesJSON) : [];
  } catch (error) {
    console.error('Error getting categories:', error);
    return [];
  }
};

// Add a new category
export const addCategory = async (category: Omit<Category, 'id'>): Promise<Category | null> => {
  try {
    const categories = await getCategories();
    const newCategory = {
      ...category,
      id: Date.now().toString(),
    };
    
    const updatedCategories = [...categories, newCategory];
    await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(updatedCategories));
    return newCategory;
  } catch (error) {
    console.error('Error adding category:', error);
    return null;
  }
};

// Delete a category
export const deleteCategory = async (categoryId: string): Promise<boolean> => {
  try {
    const categories = await getCategories();
    const updatedCategories = categories.filter(cat => cat.id !== categoryId);
    await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(updatedCategories));
    
    // Remove all expenses for this category
    const expenses = await getExpenses();
    const updatedExpenses = expenses.filter(exp => exp.categoryId !== categoryId);
    await AsyncStorage.setItem(EXPENSES_KEY, JSON.stringify(updatedExpenses));
    
    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    return false;
  }
};

// Get all expenses
export const getExpenses = async (): Promise<Expense[]> => {
  try {
    const expensesJSON = await AsyncStorage.getItem(EXPENSES_KEY);
    return expensesJSON ? JSON.parse(expensesJSON) : [];
  } catch (error) {
    console.error('Error getting expenses:', error);
    return [];
  }
};

// Add a new expense
export const addExpense = async (expense: Omit<Expense, 'id'>): Promise<Expense | null> => {
  try {
    const expenses = await getExpenses();
    const newExpense = {
      ...expense,
      id: Date.now().toString(),
    };
    
    const updatedExpenses = [...expenses, newExpense];
    await AsyncStorage.setItem(EXPENSES_KEY, JSON.stringify(updatedExpenses));
    return newExpense;
  } catch (error) {
    console.error('Error adding expense:', error);
    return null;
  }
};

// Delete an expense
export const deleteExpense = async (expenseId: string): Promise<boolean> => {
  try {
    const expenses = await getExpenses();
    const updatedExpenses = expenses.filter(exp => exp.id !== expenseId);
    await AsyncStorage.setItem(EXPENSES_KEY, JSON.stringify(updatedExpenses));
    return true;
  } catch (error) {
    console.error('Error deleting expense:', error);
    return false;
  }
};

// Get expenses by category
export const getExpensesByCategory = async (categoryId: string): Promise<Expense[]> => {
  try {
    const expenses = await getExpenses();
    return expenses.filter(exp => exp.categoryId === categoryId);
  } catch (error) {
    console.error('Error getting expenses by category:', error);
    return [];
  }
};

// Get total spending
export const getTotalSpending = async (): Promise<number> => {
  try {
    const expenses = await getExpenses();
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  } catch (error) {
    console.error('Error calculating total spending:', error);
    return 0;
  }
};

// Get spending by category
export const getSpendingByCategory = async (): Promise<Record<string, number>> => {
  try {
    const expenses = await getExpenses();
    return expenses.reduce((acc, expense) => {
      const { categoryId, amount } = expense;
      acc[categoryId] = (acc[categoryId] || 0) + amount;
      return acc;
    }, {} as Record<string, number>);
  } catch (error) {
    console.error('Error calculating spending by category:', error);
    return {};
  }
};