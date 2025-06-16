
import { Timestamp } from "rxjs";

export class AppointmentInformation {

    appointmentId: string;
    customerFirstName: string;
    customerLastName: string;
    customerEmail: string;
    customerPhone: string;
    serviceCode: string;
    bciReasonCode: string;
    bciReasonDescription: string;
    fbiReasonCode: string;
    fbiReasonDescription: string;
    appointmentTimestamp: string;
    appointmentStatusCode: number;
    orderTimestamp: string;
    resheduleTimestamp: string;
    cancelTimestamp: string;
    completeTimestamp: string;

    constructor() {
        this.appointmentId = '';
        this.customerFirstName = '';
        this.customerLastName = '';
        this.customerEmail = '';
        this.customerPhone = '';
        this.serviceCode = '';
        this.bciReasonCode = '';
        this.bciReasonDescription = '';
        this.fbiReasonCode = '';
        this.fbiReasonDescription = '';
        this.appointmentTimestamp = '';
        this.appointmentStatusCode = 0;
        this.orderTimestamp = '';
        this.resheduleTimestamp = '';
        this.cancelTimestamp = '';
        this.completeTimestamp = '';
    }

}