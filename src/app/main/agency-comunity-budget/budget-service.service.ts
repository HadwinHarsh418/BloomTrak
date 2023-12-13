import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BudgetServiceService {
  apiUrl:any;
  constructor(private _http: HttpClient,) { 
      this.apiUrl = environment.baseApiUrl
    }

  getBudget(data): Observable<any> {
    return this._http.get(`${this.apiUrl}getAgencyBudget?id=${data}`)
  }
  getBudgetById(data): Observable<any> {
    return this._http.get(`${this.apiUrl}getAgencyBudgetById?id=${data}`)
  }
  addBudget(data): Observable<any> {
    return this._http.post(`${this.apiUrl}addAgencyBudget`,data)
  }
  updateBudget(data): Observable<any> {
    return this._http.put(`${this.apiUrl}editAgencyBudget`,data)
  }
  deleteBudget(data): Observable<any> {
    return this._http.post(`${this.apiUrl}deleteAgencyBudget?id=${data}`,'')
  }
}