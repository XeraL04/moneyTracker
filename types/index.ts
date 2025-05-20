export interface Category{
    id: string;
    name: string;
    color: string;
}

export interface Expense{
    id: string;
    categoryId: string;
    amount: number;
    description: string;
    date: string;
}

export interface ExpenseWithCategory extends Expense{
    category: Category;
}