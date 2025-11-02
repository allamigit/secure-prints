
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { AppointmentPayment } from '@models/AppointmentPayment';
import { ApiStatus } from '@models/ApiStatus';
import { Payment } from '@models/Payment';

@Injectable({
  providedIn: 'root'
})

export class AppointmentPaymentService {

  private requestUrl = '';

  constructor(private http: HttpClient) { }

  getPaymentDetails(appointmentId: string): Observable<AppointmentPayment> {
    this.requestUrl = environment.apiUrl + 'payment/payment-details?appointmentId=' + appointmentId;
    return this.http.get<AppointmentPayment>(this.requestUrl, { withCredentials: true });
  }

  getAllPayments(startDate: string, endDate: string, showNonReconciled: boolean): Observable<Payment> {
    this.requestUrl = environment.apiUrl + 'payment/all-payments?startDate=' + startDate + '&endDate=' + endDate + '&showNonReconciled=' + showNonReconciled;
    return this.http.get<Payment>(this.requestUrl, { withCredentials: true });
  }

  /*updatePaymentDetails(appointmentPayment: AppointmentPayment): Observable<ApiStatus> {
    this.requestUrl = environment.apiUrl + 'payment/update-payment';
    return this.http.put<ApiStatus>(this.requestUrl, appointmentPayment, { withCredentials: true });
  }*/
  
  updatePaymentDetails(appointmentId: string, serviceAmount: number, paymentMethodCode: number, paymentComment: string): Observable<ApiStatus> {
    this.requestUrl = environment.apiUrl + 'payment/update-amount-comment?appointmentId=' + appointmentId + '&serviceAmount=' + serviceAmount + '&paymentMethodCode=' + paymentMethodCode + '&paymentComment=' + paymentComment;
    return this.http.patch<ApiStatus>(this.requestUrl, ApiStatus, { withCredentials: true });
  }

  reconcilePayment(appointmentId: string, paymentReconcileDate: string): Observable<ApiStatus> {
    this.requestUrl = environment.apiUrl + 'payment/reconcile-payment?appointmentId=' + appointmentId + '&paymentReconcileDate=' + paymentReconcileDate;
    return this.http.patch<ApiStatus>(this.requestUrl, ApiStatus, { withCredentials: true });
  }

  refundPayment(appointmentId: string, paymentRefundDate: string): Observable<ApiStatus> {
    this.requestUrl = environment.apiUrl + 'payment/refund-payment?appointmentId=' + appointmentId + '&paymentRefundDate=' + paymentRefundDate;
    return this.http.post<ApiStatus>(this.requestUrl, {}, { withCredentials: true });
  }

}
