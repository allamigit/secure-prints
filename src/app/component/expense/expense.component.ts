
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ExpenseService } from '@services/expense.service';
import { Expense } from '@models/Expense';
import { ExpenseSubcategory } from '@models/ExpenseSubcategory';
import { ApiStatus } from '@models/ApiStatus';
import { Subscription } from 'rxjs';
import { AppUtilService } from '@services/app-util.service';
import { ExpenseType } from '@models/ExpenseType';
import { ExpenseTypeName } from '@models/ExpenseTypeName';

@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './expense.component.html'
})

export class ExpenseComponent {

      selectedExpenseId: number = 0;
      originalExpenseList: Expense[] = [];
      expenseList: Expense[] = [];
      expense!: Expense;
      expnseTypName!: ExpenseTypeName;
      expenseType: any;
      expenseTypeList: ExpenseType[] = [];
      expenseSubcategoryList: ExpenseSubcategory[] = [];
      apiStatus!: ApiStatus; 
      startDate: string = '';
      endDate: string = '';
      selectedDate: string[] = [];
      paymentMethodName: string = '';
      alertType: string = '';
      responseMessage: string = '';
      modalTitle: string = '';
      saveButton: string = '';
      subcategoryName: string = '';
      showNonReconciled: boolean = false;
      pollSub!: Subscription;
      eProcessed: number = 0; ePending: number = 0; eRefund: number = 0; eReconciled: number = 0; eTotal: number = 0;
  
      expId: number = 0;
      refNumber: string = '';
      refDate: string = '';
      vendorName: string = '';
      catCode: number = 0;
      subcatCode: number = 0;
      expDescription: string = '';
      expAmount: number = 0;
      pymtStatusCode: number = 0;
      pymtDate: string = '';
      pymtMethodCode: number = 0;
      reconcileDate: string = '';

  constructor(private router: Router, private expenseService: ExpenseService, private appUtilService: AppUtilService) { }

  ngOnInit(): void {
    this.expenseService.generateExpenseTypeList().subscribe(data => this.expenseTypeList = data);
  }

  ngOnDestroy(): void {
    if (this.pollSub) this.pollSub.unsubscribe();
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    if (!/[0-9.-]/.test(event.key)) {
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

  hideAlert() {
    (document.getElementById('alert') as HTMLInputElement).hidden = true;
  }

  getPaymentMethodName(code: number) {
    return this.appUtilService.getPaymentMethodName(code);
  }

  getPaymentStatusName(code: number) {
    return this.appUtilService.getPaymentStatusName(code);
  }

  clickFilterSwitch() {
    if((document.getElementById('switch-check') as HTMLInputElement).checked) {
      this.showNonReconciled = true;
    } else {
      this.showNonReconciled = false;
    }
    this.clickView();
  }

  clickView() {
    if(this.startDate != '' && this.endDate == '') {
      this.endDate = this.startDate;
    } else if(this.startDate == '' && this.endDate != '') {
      this.startDate = this.endDate;
    }
    this.selectedDate = [];
    this.eProcessed = 0, this.ePending = 0, this.eRefund = 0, this.eReconciled = 0, this.eTotal = 0;
    this.expenseService.getAllExpenses(this.startDate, this.endDate, this.showNonReconciled)
      .subscribe(data => {
        this.expenseList = data;
        this.expenseList = this.expenseList.filter(item => item.expensePaymentStatusCode != 203);
        for(let i = 0; i < this.expenseList.length; i++) {
          switch(this.expenseList[i].expensePaymentStatusCode) {
            case 201: this.ePending += this.expenseList[i].expenseAmount; 
                      break;
            case 202: this.eProcessed += this.expenseList[i].expenseAmount; 
                      break;
            case 204: this.eRefund += this.expenseList[i].expenseAmount; 
          }
          if(this.expenseList[i].expenseReconcileDate != null) {
            this.eReconciled += this.expenseList[i].expenseAmount; 
          }
          this.eTotal = this.eProcessed + this.ePending + this.eRefund;
        }  
        this.originalExpenseList = this.expenseList;
      });    
  }

  clickReset() {
    this.startDate = '';
    this.endDate = '';
    (document.getElementById('switch-check') as HTMLInputElement).checked = false;
    this.clickView();
  }

  clickAddExpense() {
    this.modalTitle = 'Add New Expense';
    this.saveButton = 'Add Expense';
    this.resetFields();
  }

  clickSaveExpense() {
    this.assignFields();
    if(this.modalTitle == 'Add New Expense') {
      this.expense = new Expense();
      this.expenseService.addExpenseDetails(this.expense).subscribe(
        data => {
          this.apiStatus = data;
        }, error => {
          this.apiStatus = error.error;
        });
    } else {
      this.expenseService.updateExpenseDetails(this.expense).subscribe(
        data => {
          this.apiStatus = data;
        }, error => {
          this.apiStatus = error.error;
        });
    }
    this.resetFields();
  }

  selectReconcile(expenseId: number, idx: number) {
    this.expenseService.reconcileExpense(expenseId, this.selectedDate[idx])
      .subscribe(
        data => {
          this.apiStatus = data;
          this.clickView();
        }, 
        error => {
          this.apiStatus = error.error;
          this.clickView();
        });
        
  }

  selectRefund(expenseId: number, idx: number) {
    this.expenseService.refundExpense(expenseId, this.selectedDate[idx])
      .subscribe(
        data => {
          this.apiStatus = data;
          this.alertType = 'msg-success';
          this.responseMessage = this.apiStatus.responseMessage;
          this.clickView();
          (document.getElementById('alert') as HTMLInputElement).hidden = false;
          setTimeout(this.hideAlert, 4000);
        }, 
        error => {
          this.apiStatus = error.error;
          this.alertType = 'msg-fail';
          this.responseMessage = this.apiStatus.responseMessage;
          this.clickView();
          (document.getElementById('alert') as HTMLInputElement).hidden = false;
          setTimeout(this.hideAlert, 4000);
        });
  }

  clickReference(item: Expense) {
    //this.resetFields();
    this.modalTitle = 'Update Expense';
    this.saveButton = 'Save Changes';
    this.expId = item.expenseId;
    this.refNumber = item.expenseReferenceNumber;
    this.refDate = item.expenseReferenceDate;
    this.vendorName = item.expenseVendorName;
    this.catCode = item.expenseCategoryCode;
    this.subcatCode = item.expenseSubcategoryCode;
    this.expDescription = item.expenseDescription;
    this.expAmount = item.expenseAmount;
    this.pymtStatusCode = item.expensePaymentStatusCode;
    this.pymtDate = item.expensePaymentDate;
    this.pymtMethodCode = item.expensePaymentMethodCode;
    this.reconcileDate = item.expenseReconcileDate;
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

  clickSubcategoryName() {
    this.subcategoryName = '';
    (document.getElementById('exp-subcategory') as HTMLInputElement).value = this.subcatCode.toString();
    //(document.getElementById('exp-subcategory') as HTMLSelectElement).click();
  }

  selectExpenseCategory(event: Event) {
    this.catCode = Number((event.target as HTMLSelectElement).value);
    this.expenseType = this.expenseTypeList.find(item => item.expenseCategory.categoryCode == this.catCode);
    this.expenseSubcategoryList = this.expenseType.expenseSubcategories;
  }

  selectExpenseSubcategory(event: Event) {
    this.subcatCode = Number((event.target as HTMLSelectElement).value);
  }

  selectPaymentStatus(event: Event) {
    this.pymtStatusCode = Number((event.target as HTMLSelectElement).value);
  }

  selectPaymentMethod(event: Event) {
    this.pymtMethodCode = Number((event.target as HTMLSelectElement).value);
  }

  reset() {
    this.selectedExpenseId = 0;
    this.clickView();
  }

  resetFields() {
    this.expId = 0;
    this.refNumber = '';
    this.refDate = '';
    this.vendorName = '';
    this.catCode = 0;
    this.subcatCode = 0;
    this.expDescription = '';
    this.expAmount = 0;
    this.pymtStatusCode = 0;
    this.pymtDate = '';
    this.pymtMethodCode = 0;
    this.reconcileDate = '';
    this.subcategoryName = '';
    /*(document.getElementById('exp-category') as HTMLInputElement).value = "0";
    (document.getElementById('exp-subcategory') as HTMLInputElement).value = "0";
    (document.getElementById('pymt-status') as HTMLInputElement).value = "0";
    (document.getElementById('pymt-method') as HTMLInputElement).value = "0";
    this.expenseSubcategoryList = [];*/
  }

  assignFields() {
    this.expense.expenseReferenceNumber = this.refNumber;
    this.expense.expenseReferenceDate = this.refDate;
    this.expense.expenseVendorName = this.vendorName;
    this.expense.expenseCategoryCode = this.catCode;
    this.expense.expenseSubcategoryCode = this.subcatCode;
    this.expense.expenseDescription = this.expDescription;
    this.expense.expenseAmount = this.expAmount;
    this.expense.expensePaymentStatusCode = this.pymtStatusCode;
    this.expense.expensePaymentDate = this.pymtDate;
    this.expense.expensePaymentMethodCode = this.pymtMethodCode;
    this.expense.expenseReconcileDate = this.reconcileDate;
  }

}
