
export class AppointmentResponse {

    appointmentId: string;
    orderTimestamp: string;
    serviceName: string;
    bciReasonCode: string;
    bciReasonDescription: string;
    fbiReasonCode: string;
    fbiReasonDescription: string;
    appointmentTimestamp: string;
    appointmentStatus: string;
    statusTimestamp: string;
    statusHistory: string[];
    canComplete: boolean;

    constructor() {
        this.appointmentId = '';
        this.orderTimestamp = '';
        this.serviceName = '';
        this.bciReasonCode = '';
        this.bciReasonDescription = '';
        this.fbiReasonCode = '';
        this.fbiReasonDescription = '';
        this.appointmentTimestamp = '';
        this.appointmentStatus = '';
        this.statusTimestamp = '';
        this.statusHistory = [];
        this.canComplete = false;
    }

}