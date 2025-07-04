
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

  updateCompanyDetails(company: Company): Observable<Company> {
    this.requestUrl = environment.apiUrl + 'update-company';
    return this.http.put<Company>(this.requestUrl, company, { withCredentials: true });
  }

  getCompanyDetails(companyId: number): Observable<Company> {
    this.requestUrl = environment.apiUrl + 'company?companyId=' + companyId;
    return this.http.get<Company>(this.requestUrl);
  }

}
