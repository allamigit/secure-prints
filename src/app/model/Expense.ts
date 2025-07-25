
export class Expense {

    expenseId: number;
    expenseVendorName: string;
    expenseReferenceNumber: string;
    expenseReferenceDate: string;
    expenseCategoryCode: number;
    expenseSubcategoryCode: number;
    expenseDescription: string;
    expenseAmount: number;
    expensePaymentStatusCode: number;
    expensePaymentDate: string;
    expensePaymentMethodCode: number;
    expenseDocumentFileName: string;
    expenseReconcileDate: string;
    expenseUpdate?: boolean;

    constructor() {
        this.expenseId = 0;
        this.expenseVendorName = '';
        this.expenseReferenceNumber = '';
        this.expenseReferenceDate = '';
        this.expenseCategoryCode = 0;
        this.expenseSubcategoryCode = 0;
        this.expenseDescription = '';
        this.expenseAmount = 0;
        this.expensePaymentStatusCode = 0;
        this.expensePaymentDate = '';
        this.expensePaymentMethodCode = 0;
        this.expenseDocumentFileName = '';
        this.expenseReconcileDate = '';
    }

}