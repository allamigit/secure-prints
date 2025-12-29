
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

  focusPassword(): void {
    (document.getElementById('user-password') as HTMLInputElement).focus();
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
            this.userService.getUserDetails(this.userName).subscribe(
              user => {
                window.location.reload();
                localStorage.setItem('name', user.userFullName);
                localStorage.setItem('user', user.userName);
                localStorage.setItem('rx', user.userFullAccess.toString());
              }
            )        
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
