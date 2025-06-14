import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { AppointmentTime } from '@models/AppointmentTime';
import { AppointmentRequest } from '@models/AppointmentRequest';
import { ApiResponse } from '@models/ApiResponse';
import { ApiStatus } from '@models/ApiStatus';

@Injectable({
  providedIn: 'root'
})

export class AppointmentInformationService {

  private requestUrl = '';
  private apiResponse?: ApiResponse;

  constructor(private http: HttpClient) { }

    generateAppointmentTimes(selectedDate: any): Observable<AppointmentTime[]> {
      this.requestUrl = environment.apiUrl + 'times-list?selectedDate=' + selectedDate;
      return this.http.get<AppointmentTime[]>(this.requestUrl);
    }
  
    scheduleAppointment(appointmentRequest: AppointmentRequest): Observable<ApiResponse> {
      this.requestUrl = environment.apiUrl + 'schedule-appointment';
      return this.http.post<ApiResponse>(this.requestUrl, appointmentRequest);
    }

    getAppointmentDetails(appointmentId: string): Observable<ApiResponse> {
      this.requestUrl = environment.apiUrl + 'appointment?appointmentId=' + appointmentId;
      return this.http.get<ApiResponse>(this.requestUrl);
    }

    findAppointment(appointmentId: string): Observable<boolean> {
      this.requestUrl = environment.apiUrl + 'find-appointment?appointmentId=' + appointmentId;
      return this.http.get<boolean>(this.requestUrl);
    }

    rescheduleAppointment(appointmentId: string, appointmentTimestamp: string): Observable<ApiResponse> {
      this.requestUrl = environment.apiUrl + 'reschedule-appointment?appointmentId=' + appointmentId + "&appointmentTimestamp=" + appointmentTimestamp;
      return this.http.patch<ApiResponse>(this.requestUrl, ApiResponse);
    }

    cancelAppointment(appointmentId: string): Observable<ApiResponse> {
      this.requestUrl = environment.apiUrl + 'cancel-appointment?appointmentId=' + appointmentId;
      return this.http.patch<ApiResponse>(this.requestUrl, ApiResponse);
    }

  }
