import { Component } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ContactUsService } from '@services/contact-us.service';
import { AppointmentInformationService } from '@services/appointment-information.service';
import { ContactEmail } from '@models/ContactEmail';
import { ApiStatus } from '@models/ApiStatus';
import { CompanyService } from '@services/company.service';
import { Company } from '@models/Company';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './contact-us.component.html'
})

export class ContactUsComponent {

  customerName: string = '';
  customerEmail: string = '';
  messageText: string = '';
  messageLength: number = 0;
  reqName: string = 'is-invalid';
  reqEmail: string = 'is-invalid';
  reqMessage: string = 'is-invalid';
  contactEmail!: ContactEmail;
  apiStatus!: ApiStatus
  company!: Company;
  alertType: string = '';
  responseMessage: string = '';

  constructor(private router: Router, private contactUsService: ContactUsService, private appointmentInformationService: AppointmentInformationService, private companyService: CompanyService) {
    this.router.events.subscribe((event) => {
      if(event instanceof NavigationEnd) {
        window.scrollTo(0, 0); // Scroll to top
      }
    });
  }

  ngOnInit(): void {
    this.companyService.getCompanyDetails(1).subscribe(data => this.company = data);
  }

  hideAlert() {
    (document.getElementById('alert') as HTMLInputElement).hidden = true;
  }

  onCustomerNameEntry() {
    if(this.customerName.length == 0) this.reqName = 'is-invalid'; else this.reqName = '';
  }

  onCustomerEmailEntry() {
    if(this.customerEmail.length == 0 || !this.customerEmail.includes('@') || !this.customerEmail.includes('.')) this.reqEmail = 'is-invalid'; else this.reqEmail = '';
  }

  onMessageTextEntry() {
    this.messageLength = this.messageText.length;
    if(this.messageLength == 0) this.reqMessage = 'is-invalid'; else this.reqMessage = '';
  }

  formatCustomerName() {
    this.appointmentInformationService.formatName(this.customerName).subscribe(data => this.customerName = data);
  }

  sendContactEmail() {
    this.contactEmail = new ContactEmail();
    this.contactEmail.name = this.customerName;
    this.contactEmail.emailTo = this.customerEmail;
    this.contactEmail.messageText = this.messageText;
    this.contactUsService.sendContactEmail(this.contactEmail).subscribe(
      data => {
        this.apiStatus = data;
        this.alertType = 'msg-success';
        this.responseMessage = this.apiStatus.responseMessage; 
        (document.getElementById('alert') as HTMLInputElement).hidden = false;
        setTimeout(this.hideAlert, 5000);
      }, error => {
        this.apiStatus = error.error;
        this.alertType = 'msg-fail';
        this.responseMessage = this.apiStatus.responseMessage; 
        (document.getElementById('alert') as HTMLInputElement).hidden = false;
        setTimeout(this.hideAlert, 5000);
      });
  }

  validaeRequiedFields(): boolean {
    if(this.customerName == '') this.reqName = 'is-invalid'; else this.reqName = '';
    if(this.customerEmail == '' || !this.customerEmail.includes('@') || !this.customerEmail.includes('.')) this.reqEmail = 'is-invalid'; else this.reqEmail = '';
    if(this.messageText == '') this.reqMessage = 'is-invalid'; else this.reqMessage = '';

    return this.reqName == '' && this.reqEmail == '' && this.reqMessage == '';
  }

  clickResetForm() {
    this.customerName = '';
    this.customerEmail = '';
    this.messageText = '';
    this.messageLength = 0;
    this.reqName = 'is-invalid';
    this.reqEmail = 'is-invalid';
    this.reqMessage = 'is-invalid';
    (document.getElementById('message-text') as HTMLInputElement).style.height = '140px';
    window.scrollTo(0, 0); // Scroll to top
  }

}
