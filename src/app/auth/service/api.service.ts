import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AssignmentPattern } from 'typescript';
import { ToastrManager } from 'ng6-toastr-notifications';
import { environment } from 'environments/environment';


@Injectable({ providedIn: 'root' })
export class ApiService {
 

  constructor(private _http: HttpClient, 
    private toaster: ToastrManager,
    private location: Location, private router: Router) {
    
  }

  register(data:any): Observable<any> {
    return this._http.post(`${environment.baseApiUrl}register`, data);
  }

  addManagement(data:any): Observable<any> {
    return this._http.post(`${environment.baseApiUrl}addManagement`, data);
  }

  updatePrimaryContact(data:any): Observable<any> {
    return this._http.post(`${environment.baseApiUrl}updatePrimaryContact`, data);
  }


  login(data:any): Observable<any> {
    return this._http.post(`${environment.baseApiUrl}login`, data);
  }

  genericErrorToaster(Msg:string = '') {
    let error = Msg || 'Oops! something went wrong, please try again later.'
    this.toaster.errorToastr(error);

  }

  updateSurveyCompliance(data:any): Observable<any> {
    return this._http.post(`${environment.baseApiUrl}updateSurveyCompliance`, data);
  }

  updateManagementCompany(data:any): Observable<any> {
    return this._http.post(`${environment.baseApiUrl}updateManagementCompany`, data);
  }

  updateSingleCommunity(data:any): Observable<any> {
    return this._http.post(`${environment.baseApiUrl}updateSingleCommunity`, data);
  }
  
  
  getcommunityById(data:any): Observable<any> {
    return this._http.get(`${environment.baseApiUrl}getcommunityById?id=${data}`);
  }

  
  getCurrentStatusReport(data:any,start_date,end_date): Observable<any> {
    return this._http.get(`${environment.baseApiUrl}currentStatusReport?id=${data}&start_date=${start_date}&end_date=${end_date}`);
  }

  reportingGetVendor(data:any,start_date,end_date): Observable<any> {
    return this._http.get(`${environment.baseApiUrl}reportingGetVendor?community_id=${data}&start_date=${start_date}&end_date=${end_date}`);
  }

  notFinalReport(data:any,start_date,end_date): Observable<any> {
    return this._http.get(`${environment.baseApiUrl}notFinalReport?community_id=${data}&start_date=${start_date}&end_date=${end_date}`);
  }

  monthlySpendReport(data:any,start_date,end_date): Observable<any> {
    return this._http.get(`${environment.baseApiUrl}monthlySpendReport?community_id=${data}&start_date=${start_date}&end_date=${end_date}`);
  }

  monthlyDepReport(data:any,slctDprt,start_date,end_date): Observable<any> {
    return this._http.get(`${environment.baseApiUrl}monthlyDepReport?community_id=${data}&department=${slctDprt}&start_date=${start_date}&end_date=${end_date}`);
  }

  VarianceReports(data:any,slctDprt,start_date,end_date): Observable<any> {
    return this._http.get(`${environment.baseApiUrl}VarianceReports?community_id=${data}&department=${slctDprt}&start_date=${start_date}&end_date=${end_date}`);
  }

  reciptIdReports(data:any): Observable<any> {
    return this._http.get(`${environment.baseApiUrl}reciptIdReports?receipt_id=${data}`);
  }

  reciptReports(data:any,slctDprt,start_date,end_date): Observable<any> {
    return this._http.get(`${environment.baseApiUrl}reciptReports?community_id=${data}&department=${slctDprt}&start_date=${start_date}&end_date=${end_date}`);
  }

  spendTrendReport(data:any,start_date,end_date,slctDprt): Observable<any> {
    return this._http.get(`${environment.baseApiUrl}spendTrendReport?community_id=${data}&start_date=${start_date}&end_date=${end_date}&department=${slctDprt}`);
  }

  // comparativePeriodDate(data:any,start_date,end_date): Observable<any> {
  //   return this._http.get(`${environment.baseApiUrl}comparativePeriodDate?community_id=${data}&start_date=${start_date}&end_date=${end_date}`);
  // }
  comparativePeriodDate(data:any,slctDprt,current_start_date,current_end_date,comparative_period_start_date,comparative_period_end_date): Observable<any> {
    return this._http.get(`${environment.baseApiUrl}comparativePeriodDate?community_id=${data}&department=${slctDprt}&start_date=${current_start_date}&end_date=${current_end_date}&start_date2=${comparative_period_start_date}&end_date2=${comparative_period_end_date}`);
  }

   
  agencyDetailTimeReport(data:any,start_date,end_date,agency_id): Observable<any> {
    return this._http.get(`${environment.baseApiUrl}agencyDetailTimeReport?id=${data}&start_date=${start_date}&end_date=${end_date}&agency_id=${agency_id}`);
  }

  
  getAgencyPositionReport(data:any,start_date,end_date): Observable<any> {
    return this._http.get(`${environment.baseApiUrl}agencyPositionReport?id=${data}&start_date=${start_date}&end_date=${end_date}`);
  }


  trendAnalysisReport(data:any,current_start_date,current_end_date,comparative_period_start_date,comparative_period_end_date): Observable<any> {
    return this._http.get(`${environment.baseApiUrl}trendAnalysisReport?id=${data}&current_start_date=${current_start_date}&current_end_date=${current_end_date}&comparative_period_start_date=${comparative_period_start_date}&comparative_period_end_date=${comparative_period_end_date}`);
  }

  


}