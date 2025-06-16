import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { AppointmentInformation } from '@models/AppointmentInformation';
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

    scheduleAppointment(appointmentRequest: AppointmentRequest): Observable<ApiResponse> {
      this.requestUrl = environment.apiUrl + 'schedule-appointment';
      return this.http.post<ApiResponse>(this.requestUrl, appointmentRequest);
    }

    generateAppointmentTimes(selectedDate: any): Observable<AppointmentTime[]> {
      this.requestUrl = environment.apiUrl + 'times-list?selectedDate=' + selectedDate;
      return this.http.get<AppointmentTime[]>(this.requestUrl);
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

    completeAppointment(appointmentId: string, paymentMethodName: string): Observable<ApiResponse> {
      this.requestUrl = environment.apiUrl + 'complete-appointment?appointmentId=' + appointmentId + '&paymentMethodName=' + paymentMethodName;
      return this.http.post<ApiResponse>(this.requestUrl, {}, { withCredentials: true });
    }

    getAppointmentDetails(appointmentId: string): Observable<ApiResponse> {
      this.requestUrl = environment.apiUrl + 'appointment?appointmentId=' + appointmentId;
      return this.http.get<ApiResponse>(this.requestUrl, { withCredentials: true });
    }

    getAllAppointments(startDate: string, endDate: string, showByAppointmentDate: boolean): Observable<AppointmentInformation[]> {
      this.requestUrl = environment.apiUrl + 'all-appointments?startDate=' + startDate + '&endDate=' + endDate + '&showByAppointmentDate=' + showByAppointmentDate;
      return this.http.get<AppointmentInformation[]>(this.requestUrl, { withCredentials: true });
    }

  }
