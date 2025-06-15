
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Company } from '@models/Company';
import { CompanyService } from '@services/company.service';
import { UserService } from '@services/user.service';
import { ApiStatus } from '@models/ApiStatus';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'SecurePrints';

  company!: Company;
  currentYear: number = new Date().getFullYear();
  apiStatus?: ApiStatus;
  isLoggedIn: boolean = false;

  constructor(private router: Router, private companyService: CompanyService, private userService: UserService) { }
  
  ngOnInit(): void {
    this.companyService.getCompanyDetails().subscribe(data => this.company = data);
    //this.isUserLoggedIn();
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.urlAfterRedirects == '/home') {
          this.isUserLoggedIn();
        }
      });
  }

  isUserLoggedIn() {
    this.userService.isUserLoggedIn().subscribe(data => this.isLoggedIn = data);
  }

  clickLogout() {
    this.userService.userLogout().subscribe(data => this.apiStatus = data);
    this.isLoggedIn = false;
  }


}
