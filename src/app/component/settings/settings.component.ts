
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { UserService } from '@services/user.service';
import { CompanyService } from '@services/company.service';
import { ReasonService } from '@services/reason.service';
import { Company } from '@models/Company';
import { User } from '@models/User';
import { Reason } from '@models/Reason';
import { ApiStatus } from '@models/ApiStatus';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './settings.component.html'
})

export class SettingsComponent {

  user!: User;
  company!: Company;
  reason!: Reason;
  apiStatus!: ApiStatus;
  alertType: string = '';
  responseMessage: string = '';
  fileName: string = '';
  userName: string = '';
  userPassword: string = '';
  userFullName: string = '';
  userStatus: boolean = true;
  companyName: string = '';
  companyAddress1: string = '';
  companyAddress2: string = '';
  companyPhone: string = '';
  companyEmail: string = '';
  formattedPhone: string = '';
  loadingButton: boolean = false;

  constructor(private router: Router, private userService: UserService, private companyService: CompanyService, private reasonService: ReasonService) { }

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
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if(file.type == 'text/plain') this.fileName = file.name; else this.fileName = '';
    this.loadingButton = false;
  }

  hideAlert() {
    (document.getElementById('alert') as HTMLInputElement).hidden = true;
  }

  selectUser() {
    this.userService.getAllUsers().subscribe(data => {
      this.userName = data.userName;
      this.userPassword = data.userPassword;
      this.userFullName = data.userFullName;
      this.userStatus = data.userStatus;
    });
  }

  selectCompany() {
    this.companyService.getCompanyDetails(1).subscribe(data => {
      this.companyName = data.companyName;
      this.companyAddress1 = data.companyAddress1;
      this.companyAddress2 = data.companyAddress2;
      this.companyPhone = data.companyPhone;
      this.companyEmail = data.companyEmail;
    });
  }

  clickSaveCompany() {
    this.company = new Company();
    this.company.companyId = 1;
    this.company.companyName = this.companyName;
    this.company.companyAddress1 = this.companyAddress1;
    this.company.companyAddress2 = this.companyAddress2;
    this.company.companyPhone = this.companyPhone;
    this.company.companyEmail = this.companyEmail;
    this.companyService.updateCompanyDetails(this.company).subscribe(data => {
      this.apiStatus = data;
      window.location.reload();
    });    
  }

  clickRefreshReasonList() {
    this.reasonService.refreshReasonList().subscribe(
      data => {
        this.apiStatus = data;
        this.alertType = 'alert alert-success';
        this.responseMessage = this.apiStatus.responseMessage;
        (document.getElementById('alert') as HTMLInputElement).hidden = false;
        setTimeout(this.hideAlert, 4000);
      });
  }

  clickImportReasonDataFile() {
    this.loadingButton = true;
    this.reasonService.importReasonDataFile(this.fileName).subscribe(
      data => {
        this.apiStatus = data;
        this.alertType = 'alert alert-success';
        this.responseMessage = this.apiStatus.responseMessage;
        this.loadingButton = false;
        this.fileName = '';
        (document.getElementById('alert') as HTMLInputElement).hidden = false;
        setTimeout(this.hideAlert, 4000);
      },
      error => {
        this.apiStatus = error.error;
        this.alertType = 'alert alert-danger';
        this.responseMessage = this.apiStatus.responseMessage;
        this.loadingButton = false;
        this.fileName = '';
        (document.getElementById('alert') as HTMLInputElement).hidden = false;
        setTimeout(this.hideAlert, 4000);
      });
  }

}
