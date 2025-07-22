
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ServiceType } from '@models/ServiceType';
import { Reason } from '@models/Reason';
import { AppointmentTime } from '@models/AppointmentTime';
import { AppointmentRequest } from '@models/AppointmentRequest';
import { ApiResponse } from '@models/ApiResponse';
import { ReasonService } from '@services/reason.service';
import { AppointmentInformationService } from '@services/appointment-information.service';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './schedule.component.html'
})

export class ScheduleComponent {
  
  formattedPhone = '';
  serviceType: ServiceType[] = [
    {serviceCode: '', serviceName: ''},
    {serviceCode: 'BCI', serviceName: 'BCI Background Check'},
    {serviceCode: 'FBI', serviceName: 'FBI Background Check'},
    {serviceCode: 'BCI_FBI', serviceName: 'BCI and FBI Background Check'}
  ];
  serviceCode: string = '';
  serviceName: string | undefined= '';
  bciReasonList: Reason[] = [];
  fbiReasonList: Reason[] = [];
  timeList: AppointmentTime[] = [];
  appointmentRequest!: AppointmentRequest;
  apiResponse!: ApiResponse;
  appointmentDate: string = '';
  appointmentTimestamp: string = '';
  bciReasonCode: string = '';
  bciReasonDescription: string = '';
  fbiReasonCode: string = '';
  fbiReasonDescription: string = '';
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phone: string = '';
  searchText: string = '';
  fname: boolean = false;
  lname: boolean = false;
  cphone: boolean = false;
  step1: boolean = true;
  step2: boolean = false;
  step3: boolean = false;
  step4: boolean = false;
  step5: boolean = false;

  constructor(private router: Router, private reasonService: ReasonService, private appointmentInformationService: AppointmentInformationService) {
    this.router.events.subscribe((event) => {
      if(event instanceof NavigationEnd) {
        window.scrollTo(0, 0); // Scroll to top
      }
    });
   }
  
  ngOnInit(): void {
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  }

  onPhoneEntry(event: Event) {
    const raw = (event.target as HTMLInputElement).value.replace(/\D/g, '');
    const match = raw.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (match) {
      this.formattedPhone = !match[2]
        ? match[1]
        : `(${match[1]}) ${match[2]}${match[3] ? '-' + match[3] : ''}`;
    }
    if(this.formattedPhone.length == 0) this.cphone = false;
  }

  onFirstNameEntry() {
    if(this.firstName.length == 0) this.fname = true; else this.fname = false;
  }

  onLastNameEntry() {
    if(this.lastName.length == 0) this.lname = true; else this.lname = false;
  }

  onBciDescriptionEntry() {
    this.step3 = false;
    if(this.bciReasonCode == 'NO ORC') {
      this.bciReasonDescription = (document.getElementById('bci-description') as HTMLInputElement).value;
      if(this.bciReasonDescription != '') this.step3 = true;
    }
  }

  onFbiDescriptionEntry() {
    this.step3 = false;
    if(this.fbiReasonCode == 'NO ORC') {
      this.fbiReasonDescription = (document.getElementById('fbi-description') as HTMLInputElement).value;
      if(this.fbiReasonDescription != '') this.step3 = true;
    }
  }

  filteredBciReasonList(): any[] {
  if(this.searchText == '') return this.bciReasonList;
  const lower = this.searchText.toLowerCase();
  return this.bciReasonList.filter(item =>
    item.reasonCode.toLowerCase().includes(lower) ||
    item.reasonDescription.toLowerCase().includes(lower)
    );
  }

  filteredFbiReasonList(): any[] {
  if(this.searchText == '') return this.fbiReasonList;
  const lower = this.searchText.toLowerCase();
  return this.fbiReasonList.filter(item =>
    item.reasonCode.toLowerCase().includes(lower) ||
    item.reasonDescription.toLowerCase().includes(lower)
    );
  }

  /**
   * Step #1: Select Service Type
   */
  selectServiceCode(event: Event) {
    this.serviceCode = (event.target as HTMLSelectElement).value;
    this.serviceName = this.serviceType.find(item => item.serviceCode == this.serviceCode)?.serviceName;
    if(this.serviceCode != '') {
      this.step2 = true;
      if(this.serviceCode == "BCI" || this.serviceCode == "BCI_FBI") this.reasonService.getReasonList('BCI').subscribe(data => this.bciReasonList = data);
      if(this.serviceCode == "FBI" || this.serviceCode == "BCI_FBI") this.reasonService.getReasonList('FBI').subscribe(data => this.fbiReasonList = data);
    } else {
      window.location.reload();
    }
  }

  /**
   * Step #2: Select BCI Reason
   */
  selectBciReason(item: any) {
    this.step3 = false;
    this.bciReasonCode = item.reasonCode;
    this.bciReasonDescription = item.reasonDescription;
    if((this.serviceCode == 'BCI' && this.bciReasonCode != '' && this.bciReasonCode != 'NO ORC') 
      || (this.serviceCode == 'BCI_FBI' && this.fbiReasonCode != '' && this.fbiReasonCode != 'NO ORC')
      || (this.bciReasonCode == 'NO ORC' && this.bciReasonDescription != ' ')) {
        this.step3 = true;
        this.searchText = '';
    }
  }

  /**
   * Step #2: Select FBI Reason
   */
  selectFbiReason(item: any) {
    this.step3 = false;
    this.fbiReasonCode = item.reasonCode;
    this.fbiReasonDescription = item.reasonDescription;
    if((this.serviceCode == 'FBI' && this.fbiReasonCode != '' && this.fbiReasonCode != 'NO ORC') 
      || (this.serviceCode == 'BCI_FBI' && this.bciReasonCode != '' && this.bciReasonCode != 'NO ORC')
      || (this.fbiReasonCode == 'NO ORC' && this.fbiReasonDescription != ' ')) {
        this.step3 = true;
        this.searchText = '';
    }
  }

  /**
   * Step #3: Select Appointment Date
   */
  selectAppointmentDate() {
    this.appointmentTimestamp = '';
    this.appointmentDate = (document.getElementById('appointment-date') as HTMLInputElement).value;
    if(this.appointmentDate != '') {
      this.appointmentInformationService.generateAppointmentTimes(this.appointmentDate).subscribe(data => this.timeList = data);
    } 
  }
  
  /**
   * Step #3: Select Appointment Time
   */
  selectAppointmentTime(item: any) {
    this.appointmentTimestamp = item.appointmentTimestamp;
    if(this.appointmentTimestamp != '') this.step4 = true;
  }

  /**
   * Step #4: Personal Information
   */
  getPersonalInfo() {
    this.fname = false;
    this.lname = false;
    this.firstName = (document.getElementById('first-name') as HTMLInputElement).value;
    this.lastName = (document.getElementById('last-name') as HTMLInputElement).value;
    this.email = (document.getElementById('email') as HTMLInputElement).value;
    this.phone = (document.getElementById('phone') as HTMLInputElement).value;
    if(this.firstName == '') this.fname = true;
    if(this.lastName == '') this.lname = true;
    if(this.phone != '' && this.phone.length < 14) this.cphone = true; else this.cphone = false;
  }

  /**
   * Click Schedule Button
   */
  clickSchedule() {
    this.getPersonalInfo();

    if(!this.fname && !this.lname && !this.cphone) {
      this.appointmentRequest = new AppointmentRequest();
      this.appointmentRequest.customerFirstName = this.firstName;
      this.appointmentRequest.customerLastName = this.lastName;
      this.appointmentRequest.customerEmail = this.email;
      this.appointmentRequest.customerPhone = this.phone;
      this.appointmentRequest.serviceName = this.serviceName;
      this.appointmentRequest.bciReasonCode = this.bciReasonCode;
      this.appointmentRequest.bciReasonDescription = this.bciReasonDescription;
      this.appointmentRequest.fbiReasonCode = this.fbiReasonCode;
      this.appointmentRequest.fbiReasonDescription = this.fbiReasonDescription;
      this.appointmentRequest.appointmentTimestamp = this.appointmentTimestamp;
      this.appointmentRequest.userName = localStorage.getItem('user')?.toString();

      this.appointmentInformationService.scheduleAppointment(this.appointmentRequest)
          .subscribe(
              data => this.apiResponse = data, 
              error => this.apiResponse = error.error
          );

      this.step1 = false;
      this.step2 = false;
      this.step3 = false;
      this.step4 = false;
      this.step5 = true;
      window.scrollTo(0, 0);
    }
  }

  /**
   * Click Schedule Another Appointment Button
   */
  clickScheduleAnotherAppointment() {
    this.serviceCode = '';
    this.serviceName = '';
    this.appointmentDate = '';
    this.appointmentTimestamp = '';
    this.bciReasonCode = '';
    this.bciReasonDescription = '';
    this.fbiReasonCode = '';
    this.fbiReasonDescription = '';
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.phone = '';
    this.searchText = '';
    this.fname = false;
    this.lname = false;
    this.cphone = false;
    this.step1 = true;
    this.step2 = false;
    this.step3 = false;
    this.step4 = false;
    this.step5 = false;
    this.router.navigate(['/schedule']);
  }

}
