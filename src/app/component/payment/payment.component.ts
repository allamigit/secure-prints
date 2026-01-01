
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
    paymentMethodCode: number[] = [];
    paymentReconcileDate: string[] = [];
    alertType: string = '';
    responseMessage: string = '';
    serviceAmount: number[] = [];
    paymentComment: string[] = [];
    showDetails: boolean = false;
    showNonReconciled: boolean = false;
    showAll: boolean = true;
    userFullAccess: boolean = localStorage.getItem('rx')?.toString() == 'true' ? true : false;
    pollSub!: Subscription;
    sProcessed: number = 0; sPending: number = 0; sRefund: number = 0; sReconciled: number = 0; sTotal: number = 0;
    bProcessed: number = 0; bPending: number = 0; bRefund: number = 0; bReconciled: number = 0; bTotal: number = 0;
    yearList: number[] = [];
  
  constructor(private router: Router, private appointmentPaymentService: AppointmentPaymentService, private appUtilService: AppUtilService) { }

  ngOnInit(): void {
    /*this.pollSub = interval(6000).subscribe(() => {
      if(this.paymentList.length != 0) this.clickView();
    });*/

    let today = new Date();
    let currentYear = today.getFullYear()
    let i = 0;
    for(let y = currentYear; y >= 2025; y--) {
      this.yearList[i] = y;
      i++;
    }
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

  onReconcileDateEntry(idx: number) {
    this.selectedDate[idx] = this.paymentReconcileDate[idx];
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

  clickAllSwitch() {
    if((document.getElementById('switch-check-all') as HTMLInputElement).checked) {
      this.showAll = true;
    } else {
      this.showAll = false;
    }
    this.clickView();
  }

  selectYear(event: Event) {
    let year = (event.target as HTMLSelectElement).value;
    if(year != '0') {
      this.startDate = `${year}-01-01`;
      this.endDate = `${year}-12-31`;
      this.clickView();
    } else {
      this.startDate = '';
      this.endDate = '';
      window.location.reload();
    }
  }

  clickView() {
    if(this.startDate != '' && this.endDate == '') {
      this.endDate = this.startDate;
    } else if(this.startDate == '' && this.endDate != '') {
      this.startDate = this.endDate;
    } else if(this.startDate == '' && this.endDate == '') {
      let today = new Date();
      let yyyy = today.getFullYear();
      this.startDate = `${yyyy}-01-01`;
      this.endDate = `${yyyy}-12-31`;
    }
    
    this.selectedDate = [];
    this.sProcessed = 0, this.sPending = 0, this.sRefund = 0, this.sReconciled = 0, this.sTotal = 0;
    this.bProcessed = 0, this.bPending = 0, this.bRefund = 0, this.bReconciled = 0, this.bTotal = 0;
    this.appointmentPaymentService.getAllPayments(this.startDate, this.endDate, this.showNonReconciled)
      .subscribe(data => {
        this.paymentList = data;
        this.originalPaymentList = this.paymentList;
        if(!this.showAll) {
          this.paymentList.appointmentPayment = this.paymentList.appointmentPayment.filter(item => item.paymentStatusCode != 203);
          this.paymentList.appointmentInformation = this.paymentList.appointmentInformation.filter(item => item.appointmentStatusCode != 103);
        }
        for(let i = 0; i < this.paymentList.appointmentPayment.length; i++) {
          this.serviceAmount[i] = this.paymentList.appointmentPayment[i].serviceAmount;
          this.paymentMethodCode[i] = this.paymentList.appointmentPayment[i].paymentMethodCode;
          this.paymentComment[i] = this.paymentList.appointmentPayment[i].paymentComment;
          this.paymentReconcileDate[i] = this.paymentList.appointmentPayment[i].paymentReconcileDate;
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
      });    
  }

  clickReset() {
    this.startDate = '';
    this.endDate = '';
    (document.getElementById('switch-check') as HTMLInputElement).checked = false;
    (document.getElementById('switch-check-all') as HTMLInputElement).checked = true;
    (document.getElementById('year') as HTMLInputElement).value = '0';
    window.location.reload();
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
    this.showDetails = item.appointmentId == this.selectedAppointmentId ? !this.showDetails : true;
    this.selectedAppointmentId = this.showDetails ? item.appointmentId : '';
  }

  reset() {
    this.showDetails = false;
    this.selectedAppointmentId = '';
    this.clickView();
  }

  clickSave(appointmentId: string, idx: number) {
    window.scrollTo(0, 0);
    this.appointmentPaymentService.updatePaymentDetails(appointmentId, this.serviceAmount[idx], this.paymentMethodCode[idx], this.paymentComment[idx]).subscribe(
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
