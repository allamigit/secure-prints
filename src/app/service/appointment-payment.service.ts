
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class AppointmentPaymentService {

  constructor(private http: HttpClient) { }
  
}
