
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { InvoiceService } from '@services/invoice.service';
import { ApiStatus } from '@models/ApiStatus';
import { Subscription } from 'rxjs';
import { Invoice } from '@models/Invoice';
import { ExpenseTypeName } from '@models/ExpenseTypeName';
import { ExpenseType } from '@models/ExpenseType';
import { ExpenseSubcategory } from '@models/ExpenseSubcategory';
import { ExpenseService } from '@services/expense.service';
import { AppUtilService } from '@services/app-util.service';

declare var bootstrap: any;

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './invoice.component.html'
})

export class InvoiceComponent {

      originalInvoiceList: Invoice[] = [];
      invoiceList: Invoice[] = [];
      invoice!: Invoice;
      expnseTypName!: ExpenseTypeName;
      expenseType: any;
      expenseTypeList: ExpenseType[] = [];
      expenseSubcategoryList: ExpenseSubcategory[] = [];
      expenseTypeList2: ExpenseType[] = [];
      apiStatus!: ApiStatus; 
      startDate: string = '';
      endDate: string = '';
      selectedDate: string[] = [];
      paymentMethodName: string = '';
      alertType: string = '';
      responseMessage: string = '';
      modalTitle: string = '';
      saveButton: string = '';
      subcategoryName: string = 'BCI Service Fees';
      showNonReconciled: boolean = false;
      showAll: boolean = true;
      invoiceModal: any;
      expenseTypeModal: any;
      keyword: string = '';
      userFullAccess: boolean = localStorage.getItem('rx')?.toString() == 'true' ? true : false;
      pollSub!: Subscription;
      reqInvNumber: string = 'is-invalid';
      reqPayeeName: string = '';
      reqInvDate: string = 'is-invalid';
      reqInvDueDate: string = 'is-invalid';
      reqCategory: string = '';
      reqSubcategory: string = '';
      reqInvAmount: string = 'is-invalid';
      reqPymtStatus: string = 'is-invalid';
      reqPymtDate: string = '';
      reqPymtMethod: string = '';
      eProcessed: number = 0; ePending: number = 0; eReconciled: number = 0; eTotal: number = 0;
      yearList: number[] = [];
  
      invId: number | null = null;
      invNumber: string = '';
      payeeName: string = 'Ohio AG';
      invDate: string = '';
      invDueDate: string = '';
      catCode: number = 1000;
      subcatCode: number = 1005;
      invAmount: number = 0;
      pymtStatusCode: number = 0;
      pymtDate: string = '';
      pymtMethodCode: number = 0;
      invComments: string = '';
      reconcileDate: string = '';

  constructor(private router: Router, private invoiceService: InvoiceService, private expenseService: ExpenseService, private appUtilService: AppUtilService) { }

  ngOnInit(): void {
    this.expenseService.generateExpenseTypeList().subscribe(
      data => {
        this.expenseTypeList = data;
        this.expenseTypeList2 = this.expenseTypeList;
      });

    let today = new Date();
    let currentYear = today.getFullYear()
    let i = 0;
    for(let y = currentYear; y >= 2025; y--) {
      this.yearList[i] = y;
      i++;
    }
  }

  ngAfterViewInit() {
    this.invoiceModal = new bootstrap.Modal(document.getElementById('invoice-modal'));
    this.expenseTypeModal = new bootstrap.Modal(document.getElementById('expense-type-modal'));
  }

  ngOnDestroy(): void {
    if (this.pollSub) this.pollSub.unsubscribe();
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    if (!/[0-9.]/.test(event.key)) {
      event.preventDefault();
    }
  }

  onStartDateEntry() {
    this.startDate = (document.getElementById('start-date') as HTMLInputElement).value;
  }

  onEndDateEntry() {
    this.endDate = (document.getElementById('end-date') as HTMLInputElement).value;
  }

  onSelectedDateEntry(idx: number) {
    this.selectedDate[idx] = (document.getElementsByName('selected-date')[idx] as HTMLInputElement).value;
  }

  onInvoiceNumberEntry() {
    if(this.invNumber == '') this.reqInvNumber = 'is-invalid'; else this.reqInvNumber = '';
  }

  onPayeeNameEntry() {
    if(this.payeeName == '') this.reqPayeeName = 'is-invalid'; else this.reqPayeeName = '';
  }

  onInvoiceDateEntry() {
    if(this.invDate == '') {
      this.reqInvDate = 'is-invalid';
      this.invDueDate = '';
     } else {
      this.reqInvDate = '';
      this.invoiceService.getInvoiceDueDate(this.invDate).subscribe(data => this.invDueDate = data);
    }
  }

  onInvoiceDueDateEntry() {
    if(this.invDate == '') this.reqInvDueDate = 'is-invalid'; else this.reqInvDueDate = '';
  }

  onInvoiceAmountEntry() {
    if(this.invAmount == 0) this.reqInvAmount = 'is-invalid'; else this.reqInvAmount = '';
  }

  onKeywordEntry() {
    if(this.keyword == '') this.expenseTypeList2 = this.expenseTypeList;
  }

  hideAlert() {
    (document.getElementById('alert') as HTMLInputElement).hidden = true;
  }

  getPaymentMethodName(code: number) {
    return this.appUtilService.getPaymentMethodName(code);
  }

  getPaymentStatusName(code: number) {
    return this.appUtilService.getPaymentStatusName(code);
  }

  openInvoiceModal() {
    this.invoiceModal.show();
    this.expenseTypeModal.hide();
  }

  openExpenseTypeModal() {
    this.keyword = '';
    this.subcategoryName = '';
    this.invoiceModal.hide();
    this.expenseTypeModal.show();
    this.clickSearchKeyword();    
  }

  clickSubcategoryName(selectedSubcategoryName: string) {
    this.subcategoryName = selectedSubcategoryName;
    this.expenseService.getExpenseTypeCode(selectedSubcategoryName).subscribe(
      data => {
        this.catCode = data.categoryCode;
        this.subcatCode = data.subcategoryCode;
      });
  }

  clickSelectExpenseType() {
    this.expenseType = this.expenseTypeList.find(item => item.expenseCategory.categoryCode == this.catCode);
    this.expenseSubcategoryList = this.expenseType.expenseSubcategories;
    (document.getElementById('exp-category') as HTMLInputElement).value = this.catCode.toString();
    (document.getElementById('exp-subcategory') as HTMLInputElement).value = this.subcatCode.toString();
    this.openInvoiceModal();
  }

  clickSearchKeyword() {
    this.expenseService.searchExpenseTypeList(this.keyword).subscribe(data => this.expenseTypeList2 = data);
  }

  clickFilterSwitch() {
    if((document.getElementById('switch-check') as HTMLInputElement).checked) {
      this.showNonReconciled = true;
    } else {
      this.showNonReconciled = false;
    }
    this.clickView();
  }

  clickAllSwitch() {
    if((document.getElementById('switch-check-all') as HTMLInputElement).checked) {
      this.showAll = true;
    } else {
      this.showAll = false;
    }
    this.clickView();
  }

  selectYear(event: Event) {
    let year = (event.target as HTMLSelectElement).value;
    if(year != '0') {
      this.startDate = `${year}-01-01`;
      this.endDate = `${year}-12-31`;
      this.clickView();
    } else {
      this.startDate = '';
      this.endDate = '';
      window.location.reload();
    }
  }

  clickView() {
    if(this.startDate != '' && this.endDate == '') {
      this.endDate = this.startDate;
    } else if(this.startDate == '' && this.endDate != '') {
      this.startDate = this.endDate;
    } else if(this.startDate == '' && this.endDate == '') {
      let today = new Date();
      let yyyy = today.getFullYear();
      this.startDate = `${yyyy}-01-01`;
      this.endDate = `${yyyy}-12-31`;
    }
    
    this.selectedDate = [];
    this.eProcessed = 0, this.ePending = 0, this.eReconciled = 0, this.eTotal = 0;
    this.invoiceService.getAllInvoices(this.startDate, this.endDate, this.showNonReconciled)
      .subscribe(data => {
        this.invoiceList = data;
        this.originalInvoiceList = this.invoiceList;
        if(!this.showAll) this.invoiceList = this.invoiceList.filter(item => item.invoicePaymentStatusCode != 203);
        for(let i = 0; i < this.invoiceList.length; i++) {
          switch(this.invoiceList[i].invoicePaymentStatusCode) {
            case 201: this.ePending += this.invoiceList[i].invoiceAmount; 
                      break;
            case 202: this.eProcessed += this.invoiceList[i].invoiceAmount; 
          }
          if(this.invoiceList[i].invoiceReconcileDate != null) {
            this.eReconciled += this.invoiceList[i].invoiceAmount; 
          }
          this.eTotal = this.eProcessed + this.ePending;
        }  
      });    
  }

  clickReset() {
    this.startDate = '';
    this.endDate = '';
    (document.getElementById('switch-check') as HTMLInputElement).checked = false;
    (document.getElementById('switch-check-all') as HTMLInputElement).checked = true;
    (document.getElementById('year') as HTMLInputElement).value = '0';
    window.location.reload();
  }

  clickAddInvoice() {
    this.modalTitle = 'Add New Invoice';
    this.saveButton = 'Add Invoice';
    this.resetFields();
    this.expenseType = this.expenseTypeList.find(item => item.expenseCategory.categoryCode == this.catCode);
    this.expenseSubcategoryList = this.expenseType.expenseSubcategories;
    (document.getElementById('exp-category') as HTMLInputElement).value = this.catCode.toString();
    (document.getElementById('exp-subcategory') as HTMLInputElement).value = this.subcatCode.toString();
  }

  clickSaveInvoice() {
    this.assignFields();
    if(this.modalTitle == 'Add New Invoice') {
      this.invoiceService.addInvoiceDetails(this.invoice).subscribe(
        data => {
          this.apiStatus = data;
          this.clickView();
          (document.getElementById('alert') as HTMLInputElement).hidden = false;
          this.alertType = 'msg-success';
          this.responseMessage = data.responseMessage;
          setTimeout(this.hideAlert, 4000);
        }, error => {
          this.apiStatus = error.error;
          (document.getElementById('alert') as HTMLInputElement).hidden = false;
          this.alertType = 'msg-fail';
          this.responseMessage = this.apiStatus.responseMessage;
          setTimeout(this.hideAlert, 4000);
        });
    } else {
      window.scrollTo(0, 0);
      this.invoiceService.updateInvoiceDetails(this.invoice).subscribe(
        data => {
          this.apiStatus = data;
          this.clickView();
          (document.getElementById('alert') as HTMLInputElement).hidden = false;
          this.alertType = 'msg-success';
          this.responseMessage = data.responseMessage;
          setTimeout(this.hideAlert, 4000);
        }, error => {
          this.apiStatus = error.error;
          (document.getElementById('alert') as HTMLInputElement).hidden = false;
          this.alertType = 'msg-fail';
          this.responseMessage = this.apiStatus.responseMessage;
          setTimeout(this.hideAlert, 4000);
        });
    }
    this.resetFields();
  }

  selectReconcile(invoiceId: any, idx: number) {
    this.invoiceService.reconcileInvoice(invoiceId, this.selectedDate[idx])
      .subscribe(
        data => {
          this.apiStatus = data;
          this.clickView();
        }, 
        error => {
          this.apiStatus = error.error;
          this.clickView();
          (document.getElementById('alert') as HTMLInputElement).hidden = false;
          this.alertType = 'msg-fail';
          this.responseMessage = this.apiStatus.responseMessage;
          setTimeout(this.hideAlert, 4000);
        });
        
  }

  clickInvoiceNumber(item: Invoice) {
    this.modalTitle = 'Update Invoice';
    this.saveButton = 'Save Changes';
    this.invId = item.invoiceId;
    this.invNumber = item.invoiceNumber;
    this.payeeName = item.invoicePayeeName;
    this.invDate = item.invoiceDate;
    this.invDueDate = item.invoiceDueDate;
    this.catCode = item.expenseCategoryCode;
    this.subcatCode = item.expenseSubcategoryCode;
    this.invAmount = item.invoiceAmount;
    this.pymtStatusCode = item.invoicePaymentStatusCode;
    this.pymtDate = item.invoicePaymentDate;
    this.pymtMethodCode = item.invoicePaymentMethodCode;
    this.invComments = item.invoiceComments;
    this.reconcileDate = item.invoiceReconcileDate;
    this.expenseService.getExpenseTypeName(this.catCode, this.subcatCode).subscribe(
      data => {
        this.expnseTypName = data; 
        this.subcategoryName = data.subcategoryName;
      });
    
    (document.getElementById('exp-category') as HTMLInputElement).value = this.catCode.toString();
    this.expenseType = this.expenseTypeList.find(item => item.expenseCategory.categoryCode == this.catCode);
    this.expenseSubcategoryList = this.expenseType.expenseSubcategories;
    (document.getElementById('pymt-status') as HTMLInputElement).value = this.pymtStatusCode.toString();
    (document.getElementById('pymt-method') as HTMLInputElement).value = this.pymtMethodCode.toString();
  }

  showSubcategoryName() {
    this.subcategoryName = '';
    (document.getElementById('exp-subcategory') as HTMLInputElement).value = this.subcatCode.toString();
  }

  selectExpenseCategory(event: Event) {
    this.catCode = Number((event.target as HTMLSelectElement).value);
    if(this.catCode == 0) {
      this.reqCategory = 'is-invalid'; 
      this.reqSubcategory = 'is-invalid';
      this.subcatCode = 0;
      this.expenseSubcategoryList = [];
    } else {
      this.reqCategory = '';
      this.expenseType = this.expenseTypeList.find(item => item.expenseCategory.categoryCode == this.catCode);
      this.expenseSubcategoryList = this.expenseType.expenseSubcategories;
    }
  }

  selectExpenseSubcategory(event: Event) {
    this.subcatCode = Number((event.target as HTMLSelectElement).value);
    if(this.subcatCode == 0) this.reqSubcategory = 'is-invalid'; else this.reqSubcategory = '';
  }

  selectPaymentStatus(event: Event) {
    this.pymtStatusCode = Number((event.target as HTMLSelectElement).value);
    if(this.pymtStatusCode == 0) this.reqPymtStatus = 'is-invalid'; else this.reqPymtStatus = '';
    if(this.pymtStatusCode == 201) {
      this.pymtDate = '';
      this.pymtMethodCode = 0;
      this.reconcileDate = '';
      (document.getElementById('pymt-method') as HTMLInputElement).value = "0";
      this.reqPymtDate = '';
      this.reqPymtMethod = '';
    }
    if(this.pymtStatusCode == 202) {
      let today = new Date();
      let yyyy = today.getFullYear();
      let mm = String(today.getMonth() + 1).padStart(2, '0');
      let dd = String(today.getDate()).padStart(2, '0');
      this.pymtDate = `${yyyy}-${mm}-${dd}`;
      if(this.pymtMethodCode == 0) this.reqPymtMethod = 'is-invalid';
    }
  }

  selectPaymentMethod(event: Event) {
    this.pymtMethodCode = Number((event.target as HTMLSelectElement).value);
    if(this.pymtStatusCode == 202 && this.pymtMethodCode == 0) this.reqPymtMethod = 'is-invalid'; else this.reqPymtMethod = '';
  }

  checkPaymentDate(event: Event) {
    let dt = (event.target as HTMLSelectElement).value;
    if(this.pymtStatusCode == 202 && dt == '') this.reqPymtDate = 'is-invalid'; else this.reqPymtDate = '';
  }

  getDueDateFlag(invoiceDueDate: string, invoicePaymentStatusCode: number): string {
    let currentDate = new Date();
    let dueDate = new Date(invoiceDueDate);
    let diffMs = dueDate.getTime() - currentDate.getTime();
    let diffDays = Math.ceil(diffMs / 86400000);
    let dueFlag = '🟢';
    if(diffDays < 7) dueFlag = '🟡';
    if(diffDays < 4) dueFlag = '🟠';
    if(diffDays <= 0) dueFlag = '🔴';
    if(invoicePaymentStatusCode == 202) dueFlag = '🧾';
    if(invoicePaymentStatusCode == 203) dueFlag = '❌️';
    return dueFlag;
  }

  resetFields() {
    this.invId = null;
    this.invNumber = '';
    this.payeeName = 'Ohio AG';
    this.invDate = '';
    this.invDueDate = '';
    this.catCode = 1000;
    this.subcatCode = 1005;
    this.invAmount = 0;
    this.pymtStatusCode = 0;
    this.pymtDate = '';
    this.pymtMethodCode = 0;
    this.invComments = '';
    this.reconcileDate = '';
    this.subcategoryName = 'BCI Service Fees';
    this.expenseSubcategoryList = [];

    this.reqInvNumber = 'is-invalid';
    this.reqPayeeName = '';
    this.reqInvDate = 'is-invalid';
    this.reqInvDueDate = 'is-invalid';
    this.reqCategory = '';
    this.reqSubcategory = '';
    this.reqInvAmount = 'is-invalid';
    this.reqPymtStatus = 'is-invalid';
    this.reqPymtDate = '';
    this.reqPymtMethod = '';
    (document.getElementById('exp-category') as HTMLInputElement).value = "0";
    (document.getElementById('exp-subcategory') as HTMLInputElement).value = "0";
    (document.getElementById('pymt-status') as HTMLInputElement).value = "0";
    (document.getElementById('pymt-method') as HTMLInputElement).value = "0";
  }

  assignFields() {
    if(!this.invoice) {
      this.invoice = new Invoice();
    }
    if(this.modalTitle == 'Update Invoice') this.invoice.invoiceId = this.invId; else this.invoice.invoiceId = null;
    this.invoice.invoiceNumber = this.invNumber;
    this.invoice.invoicePayeeName = this.payeeName;
    this.invoice.invoiceDate = this.invDate;
    this.invoice.invoiceDueDate = this.invDueDate;
    this.invoice.expenseCategoryCode = this.catCode;
    this.invoice.expenseSubcategoryCode = this.subcatCode;
    this.invoice.invoiceAmount = this.invAmount;
    this.invoice.invoicePaymentStatusCode = this.pymtStatusCode;
    this.invoice.invoicePaymentDate = this.pymtDate;
    this.invoice.invoicePaymentMethodCode = this.pymtMethodCode;
    this.invoice.invoiceComments = this.invComments;
    this.invoice.invoiceReconcileDate = this.reconcileDate;
  }

  validaeRequiedFields(): boolean {
    if(this.invNumber == '') this.reqInvNumber = 'is-invalid'; else this.reqInvNumber = '';
    if(this.payeeName == '') this.reqPayeeName = 'is-invalid'; else this.reqPayeeName = '';
    if(this.invDate == '') this.reqInvDate = 'is-invalid'; else this.reqInvDate = '';
    if(this.invDueDate == '') this.reqInvDueDate = 'is-invalid'; else this.reqInvDueDate = '';
    if(this.catCode == 0) this.reqCategory = 'is-invalid'; else this.reqCategory = '';
    if(this.subcatCode == 0) this.reqSubcategory = 'is-invalid'; else this.reqSubcategory = '';
    if(this.invAmount == 0) this.reqInvAmount = 'is-invalid'; else this.reqInvAmount = '';
    if(this.pymtStatusCode == 0) this.reqPymtStatus = 'is-invalid'; else this.reqPymtStatus = '';

    return this.invNumber != '' && this.payeeName != '' && this.invDate != '' && this.invDueDate != '' && this.catCode != 0 && 
           this.subcatCode != 0 && this.invAmount != 0 && this.pymtStatusCode != 0 && this.reqPymtDate == '' && this.reqPymtMethod == '';
  }

}
