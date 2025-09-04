
import { Revenue } from "./Revenue";

export interface FinancialReport {

    startDate: string;
    endDate: string;
    revenueAll: Revenue;
    revenueProcessed: Revenue;
    
}