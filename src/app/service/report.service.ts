
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { FinancialReport } from '@models/FinancialReport';
import { ExpenseFullReport } from '@models/ExpenseFullReport';

@Injectable({
  providedIn: 'root'
})

export class ReportService {

  private requestUrl = '';

  constructor(private http: HttpClient) { }

  generateFinancialReport(startDate: string, endDate: string): Observable<FinancialReport> {
    this.requestUrl = environment.apiUrl + 'report/financial-report?startDate=' + startDate + '&endDate=' + endDate;
    return this.http.get<FinancialReport>(this.requestUrl, { withCredentials: true });    
  }

  generateExpenseReport(startDate: string, endDate: string): Observable<ExpenseFullReport> {
    this.requestUrl = environment.apiUrl + 'report/expense-report?startDate=' + startDate + '&endDate=' + endDate;
    return this.http.get<ExpenseFullReport>(this.requestUrl, { withCredentials: true });    
  }

}
