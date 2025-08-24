
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { ApiStatus } from '@models/ApiStatus';
import { ContactEmail } from '@models/ContactEmail';

@Injectable({
  providedIn: 'root'
})

export class ContactUsService {

  private requestUrl = '';

  constructor(private http: HttpClient) { }

  sendContactEmail(contactEmail: ContactEmail): Observable<ApiStatus> {
    this.requestUrl = environment.apiUrl + 'aws/send-contact-email';
    return this.http.post<ApiStatus>(this.requestUrl, contactEmail);
  }

}
