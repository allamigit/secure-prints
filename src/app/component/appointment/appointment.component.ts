import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { AppointmentInformationService } from '@services/appointment-information.service';
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

  appointmentList: AppointmentInformation[] = [];
  apiResponse?: ApiResponse; 
  startDate: string = '';
  endDate: string = '';
  paymentMethodName: string = '';
  showByAppointmentDate: boolean = true;
  showPaymentMethod: boolean = false;

  constructor(private router: Router, private appointmentInformationService: AppointmentInformationService) { }

  formatTimestamp(strTimestamp: string): string {
    let strDate = strTimestamp.substring(5, 7) + '/' + strTimestamp.substring(8, 10) + '/' + strTimestamp.substring(0, 4);
    let strTime = strTimestamp.substring(11, 16);
    return strDate + ' - ' + strTime;
  }

  getDate(strTimestamp: string): string {
    let strDate = strTimestamp.substring(5, 7) + '/' + strTimestamp.substring(8, 10) + '/' + strTimestamp.substring(0, 4);
    return strDate;
  }

  clickSearch() {
    this.startDate = (document.getElementById('start-date') as HTMLInputElement).value;
    this.endDate = (document.getElementById('end-date') as HTMLInputElement).value;
    this.appointmentInformationService.getAllAppointments(this.startDate, this.endDate, this.showByAppointmentDate)
      .subscribe(data => this.appointmentList = data);
  }

  clickComplete() {
    this.showPaymentMethod = true;
  }

  clickPaymentMethod(item: any, event: Event) {
    this.paymentMethodName = (event.target as HTMLSelectElement).value;
    this.appointmentInformationService.completeAppointment(item.appointmentId, this.paymentMethodName)
      .subscribe(data => this.apiResponse = data, error => this.apiResponse = error.error);
    this.showPaymentMethod = false;
  }

}
