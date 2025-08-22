
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { ApiStatus } from '@models/ApiStatus';

@Injectable({
  providedIn: 'root'
})

export class ReportService {

  constructor(private http: HttpClient) { }

}
