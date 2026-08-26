
import { AppointmentInformation } from "@models/AppointmentInformation";
import { AppointmentPayment } from "@models/AppointmentPayment";

export interface Payment {

    appointmentPayment: AppointmentPayment[];
    appointmentInformation: AppointmentInformation[];

}