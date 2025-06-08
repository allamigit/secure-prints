import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { Reason } from '@models/Reason';

@Injectable({
  providedIn: 'root'
})

export class ReasonService {

  private requestUrl = '';

  constructor(private http: HttpClient) { }

  getReasonList(listType: string): Observable<Reason[]> {
    this.requestUrl = environment.apiUrl + 'reason-list?listType=' + listType;
    return this.http.get<Reason[]>(this.requestUrl);
  }

}
