
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { AppointmentInformationService } from '@services/appointment-information.service';
import { AppointmentTime } from '@models/AppointmentTime';
import { ApiResponse } from '@models/ApiResponse';
import { ApiStatus } from '@models/ApiStatus';

@Component({
  selector: 'app-reschedule-cancel',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './reschedule-cancel.component.html',
  styleUrls: ['./reschedule-cancel.component.css']
})

export class RescheduleCancelComponent implements OnInit {

  appointmentId: string = '';
  action: string = '';
  timeList: AppointmentTime[] = [];
  apiResponse!: ApiResponse;
  apiStatus!: ApiStatus;
  appointmentDate: string = '';
  appointmentTimestamp: string = '';
  bciReasonCode: string = '';
  bciReasonDescription: string = '';
  fbiReasonCode: string = '';
  fbiReasonDescription: string = '';
  confirmation: string = '';

  admin: boolean = false;
  notFound: boolean = false;
  showAction: boolean = false;
  showReschedule: boolean = false;
  showConfirm: boolean = false;
  showCancel: boolean = false;
  showConfirmation: boolean = false;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private appointmentInformationService: AppointmentInformationService) { }

  ngOnInit(): void {
    this.appointmentId = this.activatedRoute.snapshot.params['appointmentId'];
    this.action = this.activatedRoute.snapshot.params['action'];
    if(this.appointmentId) {
      this.clickSearch();
      this.admin = true;
    }
    if(this.action == 'R') {
       this.clickReschedule();
    } else if(this.action == 'C') {
      this.clickCancel();
    }
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  }

  onIdInput() {
    this.notFound = false;
    this.showAction = false;
    this.showReschedule = false;
    this.showConfirm = false;
    this.showCancel = false;
    this.showConfirmation = false;
  }

  clickSearch() {
    this.reset();
    this.showConfirmation = false;

    if(this.appointmentId != '') {
      this.appointmentInformationService.findAppointment(this.appointmentId)
        .subscribe(data => {
            this.notFound = !data; 
            this.showAction = data;
        });
    }
  }

  /**
   * Reschedule Appointment
   */
  clickReschedule() {
    this.showReschedule = true;
    this.showCancel = false;
    this.confirmation = 'Reschedule';
  }

  /**
   * Select Appointment Date
   */
  selectAppointmentDate() {
    this.appointmentTimestamp = '';
    this.appointmentDate = (document.getElementById('appointment-date') as HTMLInputElement).value;
    if(this.appointmentDate != '') {
      this.appointmentInformationService.generateAppointmentTimes(this.appointmentDate).subscribe(data => this.timeList = data);
    } 
  }
  
  /**
   * Select Appointment Time
   */
  selectAppointmentTime(item: any) {
    this.appointmentTimestamp = item.appointmentTimestamp;
    if(this.appointmentTimestamp != '') this.showConfirm = true; else this.showConfirm = false;
  }

  /**
   * Confirm Reschedule Appointment
   */
  clickConfirm() {
    this.appointmentInformationService.rescheduleAppointment(this.appointmentId, this.appointmentTimestamp)
      .subscribe(
        data => this.apiResponse = data,
        error => this.apiResponse = error.error
      );

    this.reset();
  }

  /**
   * Cancel Appointment
   */
  clickCancel() {
    this.showReschedule = false;
    this.showCancel = true;
    this.confirmation = 'Cancel';
  }

  /**
   * Confirm Cancel Appointment
   */
  clickYes() {
    this.appointmentInformationService.cancelAppointment(this.appointmentId)
      .subscribe(
        data => this.apiResponse = data,
        error => this.apiResponse = error.error
      );

    this.reset();
  }

  reset() {
    this.notFound = false;
    this.showAction = false;
    this.showReschedule = false;
    this.showConfirm = false;
    this.showCancel = false;
    this.showConfirmation = true;
    this.appointmentDate = '';
  }

  reload() {
    if(this.admin) window.close();
    this.reset();
    this.showConfirmation = false;
    this.appointmentId = '';
  }

}
