
import { ExpenseCategory } from "@models/ExpenseCategory";
import { ExpenseSubcategoryTotal } from "@models/ExpenseSubcategoryTotal";

export interface ExpenseReport {

    expenseCategory: ExpenseCategory;
    expenseSubcategoriesTotal: ExpenseSubcategoryTotal[];
    
}