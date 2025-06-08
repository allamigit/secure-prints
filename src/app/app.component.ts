
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Company } from '@models/Company';
import { CompanyService } from '@services/company.service';
import { FormsModule } from '@angular/forms';

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

  constructor(private router: Router, private companyService: CompanyService) { }
  
  ngOnInit(): void {
    this.companyService.getCompanyDetails().subscribe(data => this.company = data);
  }

}
