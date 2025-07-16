
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { UserService } from '@services/user.service';
import { ApiStatus } from '@models/ApiStatus';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './login.component.html'
})

export class LoginComponent {

  apiStatus?: ApiStatus;
  userName: string = '';
  userPassword: string = '';
  newPassword: string = '';
  errorMessage: string | undefined = '';
  isValidLogin: boolean = false;

  constructor(private router: Router, private userService: UserService) { }

  onKeyDown(event: KeyboardEvent) {
  if (event.key == 'Escape') {
    this.router.navigate(['/home']);
  }
}
  onUsernameEntry() {
   this.errorMessage = '';
   this.isValidLogin = false;
   this.userName = (document.getElementById('user-name') as HTMLInputElement).value;
  }

  onUserPasswordEntry() {
    this.errorMessage = '';
    this.isValidLogin = false;
    this.userPassword = (document.getElementById('user-password') as HTMLInputElement).value;
  }

  onNewPasswordEntry() {
    this.errorMessage = '';
    this.newPassword = (document.getElementById('new-password') as HTMLInputElement).value;
  }

  clickLogin() {
    this.userService.userLogin(this.userName, this.userPassword)
      .subscribe(
        data => {
          this.apiStatus = data;
          this.errorMessage = '';
          this.isValidLogin = true;
          if(this.userPassword != 'user1234') {
            localStorage.setItem('name', this.apiStatus.responseMessage.substring(0, this.apiStatus.responseMessage.indexOf(',')));
            this.router.navigate(['/home']); 
          }
        }, 
        error => {
          this.apiStatus = error.error;
          this.errorMessage = this.apiStatus?.responseMessage;
          this.isValidLogin = false;
        });
  }

  clickSaveNewPassword() {
    this.userService.changeUserPassword(this.userPassword, this.newPassword).subscribe(
      data => {
        this.apiStatus = data;
        this.userPassword = this.newPassword;
      });
  }

}
