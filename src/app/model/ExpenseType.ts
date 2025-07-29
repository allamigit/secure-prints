
import { ExpenseCategory } from "@models/ExpenseCategory";
import { ExpenseSubcategory } from "@models/ExpenseSubcategory";

export class ExpenseType {

    expenseCategory: ExpenseCategory;
    expenseSubcategories: ExpenseSubcategory[];

    constructor() {
        this.expenseCategory = new ExpenseCategory();
        this.expenseSubcategories = [];
    }

}