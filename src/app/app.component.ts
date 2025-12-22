
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
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {
  title = 'SecurePrints';

  company!: Company;
  currentYear: number = new Date().getFullYear();
  apiStatus?: ApiStatus;
  isLoggedIn: boolean = false;
  userFullAccess: boolean = false;
  currentUser: any;

  constructor(private router: Router, private companyService: CompanyService, private userService: UserService) { 
    this.router.events.subscribe((event) => {
      if(event instanceof NavigationEnd) {
        window.scrollTo(0, 0); // Scroll to top
      }
    }); 
  }
  
  ngOnInit(): void {
    this.companyService.getCompanyDetails(1).subscribe(data => this.company = data);
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => this.isUserLoggedIn());
  }

  openEmail() {
    window.open('https://secure-prints.awsapps.com/mail', '_blank');
  }

  isUserLoggedIn() {
    this.userService.isUserLoggedIn().subscribe(data => this.isLoggedIn = data);
    this.currentUser = localStorage.getItem('name')?.toString();
    this.userFullAccess = localStorage.getItem('rx')?.toString() == 'true' ? true : false;
  }

  clickLogout() {
    window.location.reload();
    this.userService.userLogout().subscribe(data => this.apiStatus = data);
    this.isLoggedIn = false;
    localStorage.removeItem('name');
    localStorage.removeItem('user');
    localStorage.removeItem('rx');
    this.router.navigate(['/home']);
  }

}
