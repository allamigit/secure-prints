import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ReportService } from '@services/report.service';
import { FinancialReport } from '@models/FinancialReport';
import { ExpenseFullReport } from '@models/ExpenseFullReport';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './report.component.html'
})

export class ReportComponent {

  financialReport!: FinancialReport;
  expenseFullReport!: ExpenseFullReport;
  startDate: string = '';
  endDate: string = '';
  showReport: boolean = false;
  expenseAll: number = 0;
  expenseProcessed: number = 0;
  yearList: number[] = [];

  constructor(private router: Router, private reportService: ReportService) { }

  ngOnInit(): void {
    let today = new Date();
    let currentYear = today.getFullYear()
    let i = 0;
    for(let y = 2025; y <= currentYear; y++) {
      this.yearList[i] = y;
      i++;
    }
  }

  onStartDateEntry() {
    this.startDate = (document.getElementById('start-date') as HTMLInputElement).value;
  }

  onEndDateEntry() {
    this.endDate = (document.getElementById('end-date') as HTMLInputElement).value;
  }

  selectYear(event: Event) {
    let year = (event.target as HTMLSelectElement).value;
    if(year != '0') {
      this.startDate = `${year}-01-01`;
      this.endDate = `${year}-12-31`;
      this.clickGenerateReport();
    } else {
      this.startDate = '';
      this.endDate = '';
      window.location.reload();
    }
  }

  clickGenerateReport() {
    this.reportService.generateFinancialReport(this.startDate, this.endDate).subscribe(
      data => {
        this.financialReport = data; 
        this.startDate = this.financialReport.startDate;
        this.endDate = this.financialReport.endDate;
        this.expenseAll = Math.abs(this.financialReport.revenueAll.bankFees) + Math.abs(this.financialReport.revenueAll.totalExpense);
        this.expenseProcessed = Math.abs(this.financialReport.revenueProcessed.bankFees) + Math.abs(this.financialReport.revenueProcessed.totalExpense);
      });
    this.reportService.generateExpenseReport(this.startDate, this.endDate).subscribe(data => this.expenseFullReport = data);
    this.showReport = true;
  }

  clickResetReport() {
    this.startDate = '';
    this.endDate = '';
    this.showReport = false;
    this.expenseAll = 0;
    this.expenseProcessed = 0;
    (document.getElementById('year') as HTMLInputElement).value = '0';
    window.location.reload();
  }

}
