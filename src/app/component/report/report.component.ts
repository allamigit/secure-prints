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

  constructor(private router: Router, private reportService: ReportService) { }

  onStartDateEntry() {
    this.startDate = (document.getElementById('start-date') as HTMLInputElement).value;
  }

  onEndDateEntry() {
    this.endDate = (document.getElementById('end-date') as HTMLInputElement).value;
  }

  clickGenerateReport() {
    this.reportService.generateFinancialReport(this.startDate, this.endDate).subscribe(
      data => {
        this.financialReport = data; 
        this.startDate = this.financialReport.startDate;
        this.endDate = this.financialReport.endDate;
        this.expenseAll = this.financialReport.revenueAll.bankFees + this.financialReport.revenueAll.totalExpense
        this.expenseProcessed = this.financialReport.revenueProcessed.bankFees + this.financialReport.revenueProcessed.totalExpense
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
  }

}
