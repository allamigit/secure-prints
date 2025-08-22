import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ReportService } from '@services/report.service';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './report.component.html'
})

export class ReportComponent {

  constructor(private router: Router, private reportService: ReportService) { }

}
