import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { AppointmentInformationService } from '@services/appointment-information.service';
import { FormatUtilService } from '@services/format-util.service';
import { AppointmentInformation } from '@models/AppointmentInformation';
import { ApiResponse } from '@models/ApiResponse';
import { ApiStatus } from '@models/ApiStatus';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})

export class AppointmentComponent {

  selectedAppointmentId: string = '';
  appointmentList: AppointmentInformation[] = [];
  apiResponse!: ApiResponse; 
  startDate: string = '';
  endDate: string = '';
  paymentMethodName: string = '';
  showPaymentMethod: boolean = false;
  showConfirmation: boolean = false;

  constructor(private router: Router, private appointmentInformationService: AppointmentInformationService, private formatUtilService: FormatUtilService) { }

  formatTimestamp(strTimestamp: string): string {
    return this.formatUtilService.formatTimestamp(strTimestamp);
  }

  getDate(strTimestamp: string): string {
    return this.formatUtilService.getDate(strTimestamp);
  }

  clickSearch() {
    this.startDate = (document.getElementById('start-date') as HTMLInputElement).value;
    this.endDate = (document.getElementById('end-date') as HTMLInputElement).value;
    this.appointmentInformationService.getAllAppointments(this.startDate, this.endDate)
      .subscribe(data => this.appointmentList = data);
  }

  clickComplete(item: any) {
    this.selectedAppointmentId = item.appointmentId;
    this.showPaymentMethod = !this.showPaymentMethod;
    if(!this.showPaymentMethod) this.selectedAppointmentId = '';
  }

  clickPaymentMethod(event: Event) {
    this.paymentMethodName = (event.target as HTMLSelectElement).value;
    this.appointmentInformationService.completeAppointment(this.selectedAppointmentId, this.paymentMethodName)
      .subscribe(
        data => this.apiResponse = data, 
        error => this.apiResponse = error.error
      );
    this.showPaymentMethod = false;
    this.showConfirmation = true;
    //this.selectedAppointmentId = '';
  }

  clickAppointmentId() {
    this.showConfirmation = false;
    this.selectedAppointmentId = '';
  }

}
