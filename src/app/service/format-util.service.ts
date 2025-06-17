import { Injectable } from '@angular/core';
import { AppointmentInformation } from '@models/AppointmentInformation';
import { AppointmentTime } from '@models/AppointmentTime';
import { AppointmentRequest } from '@models/AppointmentRequest';
import { ApiResponse } from '@models/ApiResponse';

@Injectable({
  providedIn: 'root'
})

export class FormatUtilService {

  constructor() { }

  formatTimestamp(strTimestamp: string): string {
    let strDate = strTimestamp.substring(5, 7) + '/' + strTimestamp.substring(8, 10) + '/' + strTimestamp.substring(0, 4);
    let strTime = strTimestamp.substring(11, 16);
    return strDate + ' - ' + strTime;
  }

  getDate(strTimestamp: string): string {
    let strDate = strTimestamp.substring(5, 7) + '/' + strTimestamp.substring(8, 10) + '/' + strTimestamp.substring(0, 4);
    return strDate;
  }

}
