import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ReportService } from '@services/report.service';
import { FinancialReport } from '@models/FinancialReport';
import { ExpenseFullReport } from '@models/ExpenseFullReport';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
    for(let y = currentYear; y >= 2025; y--) {
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
  }

  async exportReport() {

    const tableIds = [
      'table-revenue',
      'table-expenses-all',
      'table-expenses-processed'
    ];

    const pdf = new jsPDF('l', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const logo = new Image();
    logo.src = 'assets/logo-secure-prints.png';

    const headerHeight = 25;
    const margin = 10;

    /* ================= HEADER FUNCTION ================= */
    const drawHeader = (title: string) => {
      pdf.addImage(logo, 'PNG', margin, 10, 42, 8);

      pdf.setFontSize(14);
      pdf.text(title, pageWidth / 2, 18, { align: 'center' });

      pdf.setLineWidth(0.5);
      pdf.line(margin, headerHeight, pageWidth - margin, headerHeight);
    };

    /* ================= FOOTER FUNCTION ================= */
    const drawFooter = (page: number, total: number) => {
      pdf.setFontSize(10);
      pdf.text(
        `Page ${page} of ${total}`,
        pageWidth / 2,
        pageHeight - 8,
        { align: 'center' }
      );
    };

    /* ================= TABLE PAGES ================= */
    for (let i = 0; i < tableIds.length; i++) {

      const element = document.getElementById(tableIds[i]);
      if (!element) continue;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (i > 0) pdf.addPage();

      drawHeader('Financial Report');

      pdf.addImage(
        imgData,
        'PNG',
        margin,
        headerHeight + 5,
        imgWidth,
        imgHeight
      );
    }

    /* ================= FOOTERS ================= */
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      drawFooter(i, totalPages);
    }

    /* ================= OPEN PDF ================= */
    window.open(pdf.output('bloburl'), '_blank');
  }

}
