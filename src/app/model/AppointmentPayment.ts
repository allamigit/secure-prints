
export class AppointmentPayment {

    appointmentId: string;
    serviceAmount: number;
    bciAmount: number;
    paymentStatusCode: number;
    paymentMethodCode: number;
    paymentDate: string;
    paymentComment: string;
    paymentReconcileDate: string;
    paymentUpdate: boolean;

    constructor() {
        this.appointmentId = '';
        this.serviceAmount = 0;
        this.bciAmount = 0;
        this.paymentStatusCode = 0;
        this.paymentMethodCode = 0;
        this.paymentDate = '';
        this.paymentComment = '';
        this.paymentReconcileDate = '';
        this.paymentUpdate = true;
    }

}