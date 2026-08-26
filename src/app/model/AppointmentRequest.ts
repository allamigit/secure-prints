
export class AppointmentRequest {

   customerFirstName: string;
   customerLastName: string;
   customerEmail?: string;
   customerPhone?: string;
   serviceName: string | undefined;
   bciReasonCode: string;
   bciReasonDescription?: string;
   fbiReasonCode: string;
   fbiReasonDescription?: string;
   appointmentTimestamp: string;
   userName?: string | undefined;

   constructor() {
        this.customerFirstName = '';
        this.customerLastName = '';
        this.customerEmail = '';
        this.customerPhone = '';
        this.serviceName = '';
        this.bciReasonCode = '';
        this.bciReasonDescription = '';
        this.fbiReasonCode = '';
        this.fbiReasonDescription = '';
        this.appointmentTimestamp = '';
   }

}