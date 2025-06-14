import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { LoginService } from '@services/login.service';
import { ApiStatus } from '@models/ApiStatus';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})

export class AdminComponent {

  apiStatus?: ApiStatus;

  constructor(private router: Router, private loginService: LoginService) { }
  
  clickLogout() {
    this.loginService.userLogout().subscribe(data => this.apiStatus = data);
    this.router.navigate(['/home']);
  }

}
