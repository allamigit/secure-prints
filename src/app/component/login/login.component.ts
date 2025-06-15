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
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {

  apiStatus?: ApiStatus;
  userName: string = '';
  userPassword: string = '';
  errorMessage: string | undefined = '';
  disableLoginButton: boolean = false;

  constructor(private router: Router, private userService: UserService) { }

  onUsernameEntry() {
    this.errorMessage = '';
    this.userName = (document.getElementById('user-name') as HTMLInputElement).value;
    if(this.userName == '') this.disableLoginButton = false;
  }

  onUserPasswordEntry() {
    this.errorMessage = '';
    this.userPassword = (document.getElementById('user-password') as HTMLInputElement).value;
    if(this.userName == '' && this.userPassword == '') this.disableLoginButton = true; else this.disableLoginButton = false;
  }

  clickLogin() {
    this.userService.userLogin(this.userName, this.userPassword)
      .subscribe(
        data => {
          this.apiStatus = data;
          this.errorMessage = '';
          this.router.navigate(['/home']);
        }, 
        error => {
          this.apiStatus = error.error;
          this.disableLoginButton = false;
          this.errorMessage = this.apiStatus?.responseMessage;
        });
  }

}
