
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { AppointmentInformationService } from '@services/appointment-information.service';
import { Appointment } from '@models/Appointment';
import { ApiResponse } from '@models/ApiResponse';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './appointment.component.html'
})

export class AppointmentComponent {

  selectedAppointmentId: string = '';
  currentTimestamp: Date = new Date();
  originalAppointmentList: Appointment[] = [];
  appointmentList: Appointment[] = [];
  apiResponse!: ApiResponse; 
  startDate: string = '';
  endDate: string = '';
  paymentMethodName: string = '';
  showPaymentMethod: boolean = false;
  showConfirmation: boolean = false;
  showDetails: boolean = false;

  constructor(private router: Router, private appointmentInformationService: AppointmentInformationService) { }

  onStartDateEntry() {
    this.startDate = (document.getElementById('start-date') as HTMLInputElement).value;
    console.log(this.startDate);
  }

  onEndDateEntry() {
    this.endDate = (document.getElementById('end-date') as HTMLInputElement).value;
    console.log(this.endDate);
  }

  getDate(strTimestamp: string): Date {
    return new Date(strTimestamp);
  }

  getStatusDate(strTimestamp: string): string {
    return strTimestamp.substring(0, 10);
  }

  applyFilter(): any[] {
    return this.appointmentList.filter(item =>
      item.appointmentResponse.appointmentStatus == "Scheduled" ||
      item.appointmentResponse.appointmentStatus == "Rescheduled"
      );
  }

  clickFilterSwitch() {
    if((document.getElementById('switch-check') as HTMLInputElement).checked) {
      this.appointmentList = this.applyFilter();
    } else {
      this.appointmentList = this.originalAppointmentList;
    }
  }

  clickView() {
    this.appointmentInformationService.getAllAppointments(this.startDate, this.endDate)
      .subscribe(data => {
        this.appointmentList = [];
        const infoArray: any = data.appointmentInformation;
        const responseArray: any = data.appointmentResponse;
        for (let i = 0; i < infoArray.length; i++) {
          this.appointmentList.push({
            appointmentInformation: infoArray[i],
            appointmentResponse: responseArray[i]
          });
        }
        this.originalAppointmentList = this.appointmentList;
        this.clickFilterSwitch();      
      });    
  }

  clickReset() {
    this.startDate = '';
    this.endDate = '';
    this.clickView();
  }

  selectComplete(item: any) {
    this.selectedAppointmentId = item.appointmentInformation.appointmentId;
    this.showPaymentMethod = !this.showPaymentMethod;
    if(!this.showPaymentMethod) this.selectedAppointmentId = '';
  }

  selectReschedule(item: any) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['reschedule-cancel', item.appointmentInformation.appointmentId, 'R'])
    );
    window.open(url, '_blank');
  }

  selectCancel(item: any) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['reschedule-cancel', item.appointmentInformation.appointmentId, 'C'])
    );
    window.open(url, '_blank');
  }

  selectPaymentMethod(event: Event) {
    this.paymentMethodName = (event.target as HTMLSelectElement).value;
  }

  clickComplete() {
    this.appointmentInformationService.completeAppointment(this.selectedAppointmentId, this.paymentMethodName)
      .subscribe(
        data => {
          this.apiResponse = data;
          this.showPaymentMethod = false;
          this.showConfirmation = true;
        }, 
        error => {
          this.apiResponse = error.error;
          this.showPaymentMethod = false;
          this.showConfirmation = true;
        });
  }

  clickAppointmentId(item: any) {
    this.selectedAppointmentId = item.appointmentInformation.appointmentId;
    this.showDetails = !this.showDetails;
    if(!this.showDetails) this.selectedAppointmentId = '';
  }

  reset() {
    this.showConfirmation = false;
    this.showDetails = false;
    this.selectedAppointmentId = '';
    this.clickView();
  }

}
