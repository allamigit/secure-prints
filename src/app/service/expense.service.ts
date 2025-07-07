
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { Expense } from '@models/Expense';
import { ApiStatus } from '@models/ApiStatus';
import { ExpenseType } from '@models/ExpenseType';
import { ExpenseCode } from '@models/ExpenseCode';

@Injectable({
  providedIn: 'root'
})

export class ExpenseService {

  private requestUrl = '';

  constructor(private http: HttpClient) { }
  
  addExpenseDetails(expense: Expense): Observable<ApiStatus> {
    this.requestUrl = environment.apiUrl + 'expense/add-expense';
    return this.http.post<ApiStatus>(this.requestUrl, expense, { withCredentials: true });
  }

  getExpenseDetails(expenseId: number): Observable<Expense> {
    this.requestUrl = environment.apiUrl + 'expense/expense-details?expenseId=' + expenseId;
    return this.http.get<Expense>(this.requestUrl, { withCredentials: true });
  }

  getAllExpenses(startDate: string, endDate: string, showNonReconciled: boolean): Observable<Expense[]> {
    this.requestUrl = environment.apiUrl + 'expense/all-expenses?startDate=' + startDate + '&endDate=' + endDate + '&showNonReconciled=' + showNonReconciled;
    return this.http.get<Expense[]>(this.requestUrl, { withCredentials: true });
  }

  updateExpenseDetails(expense: Expense): Observable<ApiStatus> {
    this.requestUrl = environment.apiUrl + 'expense/update-expense';
    return this.http.put<ApiStatus>(this.requestUrl, expense, { withCredentials: true });
  }
  
  reconcileExpense(expenseId: number, expenseReconcileDate: string): Observable<ApiStatus> {
    this.requestUrl = environment.apiUrl + 'expense/reconcile-expense?expenseId=' + expenseId + '&expenseReconcileDate=' + expenseReconcileDate;
    return this.http.patch<ApiStatus>(this.requestUrl, ApiStatus, { withCredentials: true });
  }

  refundExpense(expenseId: number, expenseRefundDate: string): Observable<ApiStatus> {
    this.requestUrl = environment.apiUrl + 'expense/refund-expense?expenseId=' + expenseId + '&expenseRefundDate=' + expenseRefundDate;
    return this.http.post<ApiStatus>(this.requestUrl, {}, { withCredentials: true });
  }

  generateExpenseTypeList(): Observable<ExpenseType[]> {
    this.requestUrl = environment.apiUrl + 'expense/expense-type-list';
    return this.http.get<ExpenseType[]>(this.requestUrl, { withCredentials: true });
  }

  searchExpenseTypeList(keyword: string): Observable<ExpenseType[]> {
    this.requestUrl = environment.apiUrl + 'expense/search-expense-type-list?keyword=' + keyword;
    return this.http.get<ExpenseType[]>(this.requestUrl, { withCredentials: true });
  }

  getExpenseCode(subcategoryName: string): Observable<ExpenseCode> {
    this.requestUrl = environment.apiUrl + 'expense/get-expense-code?subcategoryName=' + subcategoryName;
    return this.http.get<ExpenseCode>(this.requestUrl, { withCredentials: true });
  }

}
