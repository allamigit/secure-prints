
import { ExpenseCategory } from "./ExpenseCategory";
import { ExpenseSubcategoryTotal } from "./ExpenseSubcategoryTotal";

export interface ExpenseReport {

    expenseCategory: ExpenseCategory;
    expenseSubcategoriesTotal: ExpenseSubcategoryTotal[];
    
}