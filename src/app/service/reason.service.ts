
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { Reason } from '@models/Reason';
import { ApiStatus } from '@models/ApiStatus';

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

  refreshReasonList(): Observable<ApiStatus> {
    this.requestUrl = environment.apiUrl + 'refresh-reason-list';
    return this.http.get<ApiStatus>(this.requestUrl, { withCredentials: true });
  }

  importReasonDataFile(fileName: string): Observable<ApiStatus> {
    this.requestUrl = environment.apiUrl + 'import-reason-data-file?fileName=' + fileName;
    return this.http.post<ApiStatus>(this.requestUrl, {}, { withCredentials: true });
  }

}
