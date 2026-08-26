
import { AppointmentInformation } from "@models/AppointmentInformation";
import { AppointmentResponse } from "@models/AppointmentResponse";


export class Appointment {

    appointmentInformation: AppointmentInformation;
    appointmentResponse: AppointmentResponse;

    constructor() {
        this.appointmentInformation = new AppointmentInformation();
        this.appointmentResponse = new AppointmentResponse();
    }
   
}