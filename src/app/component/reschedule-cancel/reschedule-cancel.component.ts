
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, ActivatedRoute, NavigationEnd } from '@angular/router';
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
  templateUrl: './reschedule-cancel.component.html'
})

export class RescheduleCancelComponent implements OnInit {

  appointmentId: string = '';
  customerFirstName: string = '';
  customerLastName: string = '';
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
  fname: boolean = false;
  lname: boolean = false;


  constructor(private router: Router, private activatedRoute: ActivatedRoute, private appointmentInformationService: AppointmentInformationService) { 
    this.router.events.subscribe((event) => {
      if(event instanceof NavigationEnd) {
        window.scrollTo(0, 0); // Scroll to top
      }
    });
  }

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

  onFirstNameEntry() {
    if(this.customerFirstName.length == 0) this.fname = true; else this.fname = false;
  }

  onLastNameEntry() {
    if(this.customerLastName.length == 0) this.lname = true; else this.lname = false;
  }

  onIdInput() {
    this.notFound = false;
    this.showAction = false;
    this.showReschedule = false;
    this.showConfirm = false;
    this.showCancel = false;
    this.showConfirmation = false;
    this.customerFirstName = '';
    this.customerLastName = '';
  }

  onNameInput() {
    this.customerFirstName = (document.getElementById('first-name') as HTMLInputElement).value;
    this.customerLastName = (document.getElementById('last-name') as HTMLInputElement).value;
    if(this.customerFirstName.length == 0 && this.customerLastName.length > 0) this.fname = true; else this.fname = false;
    if(this.customerFirstName.length > 0 && this.customerLastName.length == 0) this.lname = true; else this.lname = false;
    this.notFound = false;
    this.showAction = false;
    this.showReschedule = false;
    this.showConfirm = false;
    this.showCancel = false;
    this.showConfirmation = false;
    this.appointmentId = '';
  }

  clickSearch() {
    this.reset();
    this.showConfirmation = false;

    if(this.appointmentId != '') {
      this.appointmentInformationService.findAppointmentById(this.appointmentId)
        .subscribe(data => {
            this.notFound = !data;
            this.showAction = !this.notFound;
        });
    } else if(this.customerFirstName != '' && this.customerLastName != '') {
      this.appointmentInformationService.findAppointmentByCustomerName(this.customerFirstName, this.customerLastName)
        .subscribe(data => {
          this.appointmentId = data;
            this.notFound = this.appointmentId == null ? true : false;
            this.showAction = !this.notFound;
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
    this.customerFirstName = '';
    this.customerLastName = '';
  }

}
