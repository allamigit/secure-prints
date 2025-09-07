
import { ExpenseReport } from "@models/ExpenseReport";

export interface ExpenseFullReport {

    startDate: string;
    endDate: string;
    expenseReportAll: ExpenseReport[];
    expenseReportProcessed: ExpenseReport[];

}