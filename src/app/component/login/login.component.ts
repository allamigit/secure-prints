
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
  errorMessage: string | undefined = '';

  constructor(private router: Router, private userService: UserService) { }

  onKeyDown(event: KeyboardEvent) {
  if (event.key == 'Escape') {
    this.router.navigate(['/home']);
  }
}
  onUsernameEntry() {
    this.errorMessage = '';
    this.userName = (document.getElementById('user-name') as HTMLInputElement).value;
  }

  onUserPasswordEntry() {
    this.errorMessage = '';
    this.userPassword = (document.getElementById('user-password') as HTMLInputElement).value;
  }

  clickLogin() {
    this.userService.userLogin(this.userName, this.userPassword)
      .subscribe(
        data => {
          this.apiStatus = data;
          localStorage.setItem('name', this.apiStatus.responseMessage.substring(0, this.apiStatus.responseMessage.indexOf(',')));
          this.errorMessage = '';
          this.router.navigate(['/home']);
        }, 
        error => {
          this.apiStatus = error.error;
          this.errorMessage = this.apiStatus?.responseMessage;
        });
  }

}
