
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { ApiStatus } from '@models/ApiStatus';

@Injectable({
  providedIn: 'root'
})

export class ContactUsService {

  constructor(private http: HttpClient) { }
  
}
