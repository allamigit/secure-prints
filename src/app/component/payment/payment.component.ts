
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { AppointmentPaymentService } from '@services/appointment-payment.service';
import { ApiStatus } from '@models/ApiStatus';
import { Subscription } from 'rxjs';
import { AppUtilService } from '@services/app-util.service';
import { Payment } from '@models/Payment';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './payment.component.html'
})

export class PaymentComponent {

    selectedAppointmentId: string = '';
    originalPaymentList!: Payment;
    paymentList!: Payment;
    apiStatus!: ApiStatus; 
    startDate: string = '';
    endDate: string = '';
    fullName: string = '';
    selectedDate: string[] = [];
    paymentMethodName: string = '';
    alertType: string = '';
    responseMessage: string = '';
    serviceAmount: number[] = [];
    paymentComment: string[] = [];
    showDetails: boolean = false;
    showNonReconciled: boolean = false;
    pollSub!: Subscription;
    sProcessed: number = 0; sPending: number = 0; sRefund: number = 0; sReconciled: number = 0; sTotal: number = 0;
    bProcessed: number = 0; bPending: number = 0; bRefund: number = 0; bReconciled: number = 0; bTotal: number = 0;
  
  constructor(private router: Router, private appointmentPaymentService: AppointmentPaymentService, private appUtilService: AppUtilService) { }

  ngOnInit(): void {
    /*this.pollSub = interval(6000).subscribe(() => {
      if(this.paymentList.length != 0) this.clickView();
    });*/
  }

  ngOnDestroy(): void {
    if (this.pollSub) this.pollSub.unsubscribe();
  }

  onStartDateEntry() {
    this.startDate = (document.getElementById('start-date') as HTMLInputElement).value;
  }

  onEndDateEntry() {
    this.endDate = (document.getElementById('end-date') as HTMLInputElement).value;
  }

  onSelectedDateEntry(idx: number) {
    this.selectedDate[idx] = (document.getElementsByName('selected-date')[idx] as HTMLInputElement).value;
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    if (!/[0-9.]/.test(event.key)) {
      event.preventDefault();
    }
  }

  hideAlert() {
    (document.getElementById('alert') as HTMLInputElement).hidden = true;
  }

  getServiceName(code: string) {
    return this.appUtilService.getServiceName(code);
  }

  getPaymentMethodName(code: number) {
    return this.appUtilService.getPaymentMethodName(code);
  }

  getPaymentStatusName(code: number) {
    return this.appUtilService.getPaymentStatusName(code);
  }

  clickFilterSwitch() {
    if((document.getElementById('switch-check') as HTMLInputElement).checked) {
      this.showNonReconciled = true;
    } else {
      this.showNonReconciled = false;
    }
    this.clickView();
  }

  clickView() {
    if(this.startDate != '' && this.endDate == '') {
      this.endDate = this.startDate;
    } else if(this.startDate == '' && this.endDate != '') {
      this.startDate = this.endDate;
    }
    this.selectedDate = [];
    this.sProcessed = 0, this.sPending = 0, this.sRefund = 0, this.sReconciled = 0, this.sTotal = 0;
    this.bProcessed = 0, this.bPending = 0, this.bRefund = 0, this.bReconciled = 0, this.bTotal = 0;
    this.appointmentPaymentService.getAllPayments(this.startDate, this.endDate, this.showNonReconciled)
      .subscribe(data => {
        this.paymentList = data;
        this.paymentList.appointmentPayment = this.paymentList.appointmentPayment.filter(item => item.paymentStatusCode != 203);
        for(let i = 0; i < this.paymentList.appointmentPayment.length; i++) {
          this.serviceAmount[i] = this.paymentList.appointmentPayment[i].serviceAmount;
          this.paymentComment[i] = this.paymentList.appointmentPayment[i].paymentComment
          switch(this.paymentList.appointmentPayment[i].paymentStatusCode) {
            case 201: this.sPending += this.paymentList.appointmentPayment[i].serviceAmount; 
                      this.bPending += this.paymentList.appointmentPayment[i].bciAmount; 
                      break;
            case 202: this.sProcessed += this.paymentList.appointmentPayment[i].serviceAmount; 
                      this.bProcessed += this.paymentList.appointmentPayment[i].bciAmount; 
                      break;
            case 204: this.sRefund += this.paymentList.appointmentPayment[i].serviceAmount; 
                      this.bRefund += this.paymentList.appointmentPayment[i].bciAmount;
          }
          if(this.paymentList.appointmentPayment[i].paymentReconcileDate != null) {
            this.sReconciled += this.paymentList.appointmentPayment[i].serviceAmount; 
            this.bReconciled += this.paymentList.appointmentPayment[i].bciAmount;
          }
          this.sTotal = this.sProcessed + this.sPending + this.sRefund;
          this.bTotal = this.bProcessed + this.bPending + this.bRefund;
        }  
        this.originalPaymentList = this.paymentList;
      });    
  }

  clickReset() {
    this.startDate = '';
    this.endDate = '';
    (document.getElementById('switch-check') as HTMLInputElement).checked = false;
    this.clickView();
  }

  selectReconcile(appointmentId: string, idx: number) {
    this.appointmentPaymentService.reconcilePayment(appointmentId, this.selectedDate[idx])
      .subscribe(
        data => {
          this.apiStatus = data;
          this.clickView();
        }, 
        error => {
          this.apiStatus = error.error;
          this.clickView();
        });
        
  }

  selectRefund(appointmentId: string, idx: number) {
    this.appointmentPaymentService.refundPayment(appointmentId, this.selectedDate[idx])
      .subscribe(
        data => {
          this.apiStatus = data;
          this.alertType = 'msg-success';
          this.responseMessage = this.apiStatus.responseMessage;
          this.clickView();
          (document.getElementById('alert') as HTMLInputElement).hidden = false;
          setTimeout(this.hideAlert, 4000);
        }, 
        error => {
          this.apiStatus = error.error;
          this.alertType = 'msg-fail';
          this.responseMessage = this.apiStatus.responseMessage;
          this.clickView();
          (document.getElementById('alert') as HTMLInputElement).hidden = false;
          setTimeout(this.hideAlert, 4000);
        });
  }

  clickAppointmentId(item: any) {
    if(item.appointmentId == this.selectedAppointmentId) {
      this.showDetails = !this.showDetails; 
     } else this.showDetails = true;  
    if(!this.showDetails) this.selectedAppointmentId = ''; else this.selectedAppointmentId = item.appointmentId;
  }

  reset() {
    this.showDetails = false;
    this.selectedAppointmentId = '';
    this.clickView();
  }

  clickSave(appointmentId: string, idx: number) {
    this.appointmentPaymentService.updateServiceAmountAndComment(appointmentId, this.serviceAmount[idx], this.paymentComment[idx]).subscribe(
      data => {
        this.apiStatus = data;
        this.alertType = 'msg-success';
        this.responseMessage = this.apiStatus.responseMessage;
        this.clickView();
        (document.getElementById('alert') as HTMLInputElement).hidden = false;
        setTimeout(this.hideAlert, 4000);
      }, 
      error => {
        this.apiStatus = error.error;
        this.alertType = 'msg-fail';
        this.responseMessage = this.apiStatus.responseMessage;
        this.clickView();
        (document.getElementById('alert') as HTMLInputElement).hidden = false;
        setTimeout(this.hideAlert, 4000);
      });
      
      this.reset();
  }

}
