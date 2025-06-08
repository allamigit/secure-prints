import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { AppointmentTime } from '@models/AppointmentTime';
import { AppointmentRequest } from '@models/AppointmentRequest';
import { ApiResponse } from '@models/ApiResponse';

@Injectable({
  providedIn: 'root'
})
export class AppointmentInformationService {

  private requestUrl = '';

  constructor(private http: HttpClient) { }

    generateAppointmentTimes(selectedDate: any): Observable<AppointmentTime[]> {
      this.requestUrl = environment.apiUrl + 'times-list?selectedDate=' + selectedDate;
      return this.http.get<AppointmentTime[]>(this.requestUrl);
    }
  
    scheduleAppointment(appointmentRequest: AppointmentRequest): Observable<ApiResponse> {
      this.requestUrl = environment.apiUrl + 'schedule-appointment';
      return this.http.post<ApiResponse>(this.requestUrl, appointmentRequest);
    }

  }
