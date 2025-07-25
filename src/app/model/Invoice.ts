
export class Invoice {

    invoiceNumber: string;
    invoiceClientName: string;
    invoiceDate: string;
    invoiceDueDate: string;
    invoiceAmount: number;
    invoicePaymentStatusCode: number;
    invoicePaymentDate: string;
    invoicePaymentMethodCode: number;
    invoiceComments: string;
    invoiceDocumentFileName: string;
    invoiceReconcileDate: string;

    constructor() {
        this.invoiceNumber = '';
        this.invoiceClientName = '';
        this.invoiceDate = '';
        this.invoiceDueDate = '';
        this.invoiceAmount = 0;
        this.invoicePaymentStatusCode = 0;
        this.invoicePaymentDate = '';
        this.invoicePaymentMethodCode = 0;
        this.invoiceComments = '';
        this.invoiceDocumentFileName = '';
        this.invoiceReconcileDate = '';
    }

}