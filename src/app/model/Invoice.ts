
export class Invoice {

    invoiceId: number;
    invoiceNumber: string;
    invoicePayeeName: string;
    invoiceDate: string;
    invoiceDueDate: string;
    expenseCategoryCode: number;
    expenseSubcategoryCode: number;
    invoiceAmount: number;
    invoicePaymentStatusCode: number;
    invoicePaymentDate: string;
    invoicePaymentMethodCode: number;
    invoiceComments: string;
    invoiceDocumentFileName: string;
    invoiceReconcileDate: string;

    constructor() {
        this.invoiceId = 0;
        this.invoiceNumber = '';
        this.invoicePayeeName = '';
        this.invoiceDate = '';
        this.invoiceDueDate = '';
        this.expenseCategoryCode = 0;
        this.expenseSubcategoryCode = 0;
        this.invoiceAmount = 0;
        this.invoicePaymentStatusCode = 0;
        this.invoicePaymentDate = '';
        this.invoicePaymentMethodCode = 0;
        this.invoiceComments = '';
        this.invoiceDocumentFileName = '';
        this.invoiceReconcileDate = '';
    }

}