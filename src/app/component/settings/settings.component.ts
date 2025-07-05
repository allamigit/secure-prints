
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { UserService } from '@services/user.service';
import { CompanyService } from '@services/company.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './settings.component.html'
})

export class SettingsComponent {

  constructor(private router: Router, private userService: UserService, private companyService: CompanyService) { }

}
