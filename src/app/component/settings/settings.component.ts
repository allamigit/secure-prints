
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
  userList: User[] = [];
  currentUser: string | null = localStorage.getItem('user');
  apiStatus!: ApiStatus;
  alertType: string = '';
  responseMessage: string = '';
  fileName: string = '';
  userName?: string = '';
  userPassword: string = '';
  userFullName: string = '';
  userStatus: boolean = true;
  newUserName: string = '';
  newUserPassword: string = '';
  newUserFullName: string = '';
  newUserStatus: boolean = true;
  companyName: string = '';
  companyAddress1: string = '';
  companyAddress2: string = '';
  companyPhone: string = '';
  companyEmail: string = '';
  startDate: string = '';
  endDate: string = '';
  formattedPhone: string = '';
  loadingButton: boolean = false;
  showChangePassword: boolean = false;

  constructor(private router: Router, private userService: UserService, private companyService: CompanyService, private reasonService: ReasonService) { }

  ngOnInit(): void {
    this.selectUser();
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
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if(file.type == 'text/plain') this.fileName = file.name; else this.fileName = '';
    this.loadingButton = false;
  }

  onStartDateEntry() {
    this.startDate = (document.getElementById('start-date') as HTMLInputElement).value;
  }

  onEndDateEntry() {
    this.endDate = (document.getElementById('end-date') as HTMLInputElement).value;
  }

  hideAddUserAlert() {
    (document.getElementById('add-user-alert') as HTMLInputElement).hidden = true;
    window.location.reload();
  }

  hideUserAlert() {
    (document.getElementById('user-alert') as HTMLInputElement).hidden = true;
    window.location.reload();
  }

  hideAlert() {
    (document.getElementById('alert') as HTMLInputElement).hidden = true;
  }

  selectUser() {
    this.userService.getAllUsers().subscribe(data => this.userList = data);
  }

  selectCompany() {
    this.companyService.getCompanyDetails(1).subscribe(data => {
      this.companyName = data.companyName;
      this.companyAddress1 = data.companyAddress1;
      this.companyAddress2 = data.companyAddress2;
      this.companyPhone = data.companyPhone;
      this.companyEmail = data.companyEmail;
      this.startDate = data.companyHolidayStartDate;
      this.endDate = data.companyHolidayEndDate;
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
    this.company.companyHolidayStartDate = this.startDate;
    this.company.companyHolidayEndDate = this.endDate;
    this.companyService.updateCompanyDetails(this.company).subscribe(
      data => {
        this.apiStatus = data;
        window.location.reload();
    });    
  }

  clickAddUser() {
    this.user = new User();
    this.user.userFullName = this.newUserFullName;
    this.user.userName = this.newUserName;
    this.user.userPassword = this.newUserPassword;
    this.user.userStatus = this.newUserStatus;
    this.userService.addUser(this.user).subscribe(
      data => {
        this.apiStatus = data;
        this.alertType = 'alert alert-success';
        this.responseMessage = this.apiStatus.responseMessage;
        (document.getElementById('add-user-alert') as HTMLInputElement).hidden = false;
        setTimeout(this.hideAddUserAlert, 3500);
      },
      error => {
        this.apiStatus = error.error;
        this.alertType = 'alert alert-danger';
        this.responseMessage = this.apiStatus.responseMessage;
        (document.getElementById('add-user-alert') as HTMLInputElement).hidden = false;
        setTimeout(this.hideAddUserAlert, 4000);
      });
  }

  clickReset() {
    this.newUserFullName = '';
    this.newUserName = '';
    this.newUserPassword = '';
    this.newUserStatus = true;
  }

  clickSaveUser(user: User) {
    this.userName = user.userName;
    this.userFullName = user.userFullName;
    this.userStatus = (document.getElementById('active-user') as HTMLInputElement).checked;
    this.userService.updateUserDetails(user).subscribe(
      data => {
        this.apiStatus = data;
        this.alertType = 'alert alert-success';
        this.responseMessage = this.apiStatus.responseMessage;
        (document.getElementById('user-alert') as HTMLInputElement).hidden = false;
        setTimeout(this.hideUserAlert, 3500);
    });
  }

  clickChangePassword() {
    this.showChangePassword = true;
  }

  clickCancelChangePassword() {
    this.userPassword = '';
    this.showChangePassword = false;
  }

  clickSavePassword(oldPassword: string, newPassword: string) {
    this.userName = localStorage.getItem('user')?.toString();
    this.userService.changeUserPassword(oldPassword, newPassword).subscribe(
      data => {
        this.apiStatus = data;
        this.userPassword = '';
        this.showChangePassword = false;
        this.alertType = 'alert alert-success';
        this.responseMessage = this.apiStatus.responseMessage;
        (document.getElementById('user-alert') as HTMLInputElement).hidden = false;
        setTimeout(this.hideUserAlert, 3500);
      },
      error => {
        this.apiStatus = error.error;
        this.alertType = 'alert alert-danger';
        this.responseMessage = this.apiStatus.responseMessage;
        (document.getElementById('user-alert') as HTMLInputElement).hidden = false;
        setTimeout(this.hideUserAlert, 4000);
    });
  }

  clickResetPassword(username: string) {
    this.userName = username;
    this.userService.resetUserPassword(username, 'user1234').subscribe(
      data => {
        this.apiStatus = data;
        this.alertType = 'alert alert-success';
        this.responseMessage = this.apiStatus.responseMessage;
        (document.getElementById('user-alert') as HTMLInputElement).hidden = false;
        setTimeout(this.hideUserAlert, 3500);
    });
  }

  clickRefreshReasonList() {
    this.reasonService.refreshReasonList().subscribe(
      data => {
        this.apiStatus = data;
        this.alertType = 'alert alert-success';
        this.responseMessage = this.apiStatus.responseMessage;
        (document.getElementById('alert') as HTMLInputElement).hidden = false;
        setTimeout(this.hideAlert, 3500);
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
        setTimeout(this.hideAlert, 3500);
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
