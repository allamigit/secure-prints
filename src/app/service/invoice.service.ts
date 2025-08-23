
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { ApiStatus } from '@models/ApiStatus';
import { Invoice } from '@models/Invoice';

@Injectable({
  providedIn: 'root'
})

export class InvoiceService {

  private requestUrl = '';

  constructor(private http: HttpClient) { }

  addInvoiceDetails(invoice: Invoice): Observable<ApiStatus> {
    this.requestUrl = environment.apiUrl + 'invoice/add-invoice';
    return this.http.post<ApiStatus>(this.requestUrl, invoice, { withCredentials: true });
  }

  getInvoiceDetails(invoiceId: number): Observable<Invoice> {
    this.requestUrl = environment.apiUrl + 'invoice/invoice-details?invoiceId=' + invoiceId;
    return this.http.get<Invoice>(this.requestUrl, { withCredentials: true });
  }

  getAllInvoices(startDate: string, endDate: string, showNonReconciled: boolean): Observable<Invoice[]> {
    this.requestUrl = environment.apiUrl + 'invoice/all-invoices?startDate=' + startDate + '&endDate=' + endDate + '&showNonReconciled=' + showNonReconciled;
    return this.http.get<Invoice[]>(this.requestUrl, { withCredentials: true });
  }

  updateInvoiceDetails(invoice: Invoice): Observable<ApiStatus> {
    this.requestUrl = environment.apiUrl + 'invoice/update-invoice';
    return this.http.put<ApiStatus>(this.requestUrl, invoice, { withCredentials: true });
  }
  
  reconcileInvoice(invoiceId: number, invoiceReconcileDate: string): Observable<ApiStatus> {
    this.requestUrl = environment.apiUrl + 'invoice/reconcile-invoice?invoiceId=' + invoiceId + '&invoiceReconcileDate=' + invoiceReconcileDate;
    return this.http.patch<ApiStatus>(this.requestUrl, ApiStatus, { withCredentials: true });
  }
  
  getInvoiceDueDate(invoiceDate: string): Observable<string> {
    this.requestUrl = environment.apiUrl + 'invoice/due-date?invoiceDate=' + invoiceDate;
    return this.http.get<string>(this.requestUrl);
  }

}
