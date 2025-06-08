
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { Company } from '@models/Company';

@Injectable({
  providedIn: 'root'
})

export class CompanyService {

  private requestUrl = '';

  constructor(private http: HttpClient) { }

  getCompanyDetails(): Observable<Company> {
    this.requestUrl = environment.apiUrl + 'company?companyId=1';
    return this.http.get<Company>(this.requestUrl);
  }

}
