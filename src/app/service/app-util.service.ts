
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AppUtilService {

  serviceName: string = '';
  paymentStatusName: string = '';
  paymentMethodName: string = '';

  constructor() { }

  getServiceName(code: string): string {
    switch(code) {
      case 'BCI': this.serviceName = 'BCI Background Check';
                break;
      case 'FBI': this.serviceName = 'FBI Background Check';
                break;
      case 'BCI_FBI': this.serviceName = 'BCI and FBI Background Check';
    }
    return this.serviceName;
  }

  getPaymentStatusName(code: number): string {
    switch(code) {
      case 201: this.paymentStatusName = 'Pending';
                break;
      case 202: this.paymentStatusName = 'Processed';
                break;
      case 203: this.paymentStatusName = 'Cancelled';
                break;
      case 204: this.paymentStatusName = 'Refunded';
    }
    return this.paymentStatusName;
  }

  getPaymentMethodName(code: number): string {    
    switch(code) {
      case 301: this.paymentMethodName = 'Credit/Debit Card';
                break;
      case 302: this.paymentMethodName = 'Cash';
                break;
      case 303: this.paymentMethodName = 'Zelle';
                break;
      case 304: this.paymentMethodName = 'Check';
                break;
      case 305: this.paymentMethodName = 'Direct Deposit';
                break;
      default: this.paymentMethodName = '-';
    }
    return this.paymentMethodName;
  }

}
