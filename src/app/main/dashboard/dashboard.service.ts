import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { environment } from 'environments/environment';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class DashboardService {
  // Public
  public apiData: any;
  public onApiDataChanged: BehaviorSubject<any>;
  private saveSubject = new BehaviorSubject<boolean>(false);

  
  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    this.onApiDataChanged = new BehaviorSubject({});
     }

  /**
   * Resolver
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise<void>((resolve, reject) => {
      Promise.all([this.getApiData()]).then(() => {
        resolve();
      }, reject);
    });
  }

  /**
   * Get Api Data
   */
  getApiData(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get('api/dashboard-data').subscribe((response: any) => {
        this.apiData = response;
        this.onApiDataChanged.next(this.apiData);
        resolve(this.apiData);
      }, reject);
    });
  }

  getSaveSubject() {
    return this.saveSubject.asObservable();
  }

  setSaveSubject(value: boolean) {
    this.saveSubject.next(value);
  }

 
  getDashboardData(user_role,id,forCp?): Observable<any>{
    let dshbrdApi = user_role == '1' ? 'CMdashboard' : user_role == '3' || user_role == 8 ? 'MGdashboardStatus' : 'AGdashboardStatus'
   if(user_role == '5'){
    return this._httpClient.get(`${environment.baseApiUrl}USRdashboardShift?id=${id}&for_as=${forCp ?? ''}`,);
  //  }else if(user_role == '4'){
  //   return this._httpClient.get(`${environment.baseApiUrl}UsrCMdashboardShift/${id}`,);
   }else if(user_role == '6'){
    return this._httpClient.get(`${environment.baseApiUrl}dashboard`,);
   }
    return this._httpClient.get(`${environment.baseApiUrl}${dshbrdApi}`);
  }

  // getTodaysData(): Observable<any>{
  //   return this._httpClient.get(`${environment.baseApiUrl}todayBooking`);
  // }

  getMemoData(): Observable<any>{
    return this._httpClient.get(`${environment.baseApiUrl}getMemo`);
  }

  getPermissionByAdminRole(): Observable<any>{
    if(localStorage.getItem('Bloom-admin-auth-token'))
    return this._httpClient.get(`${environment.baseApiUrl}getPermissionByAdminRole`);
  }

  getRonMonths(id:any): Observable<any>{
    return this._httpClient.get(`${environment.baseApiUrl}getRonMonths?community_id=${id}`);
  }

  monthSpDownDashboard(community_id:any): Observable<any>{
    return this._httpClient.get(`${environment.baseApiUrl}monthSpDownDashboard?community_id=${community_id ?? ''}`);
  }

  yearSpDownDashboard(community_id:any,month:any): Observable<any>{
    return this._httpClient.get(`${environment.baseApiUrl}yearSpDownDashboard?community_id=${community_id ?? ''}&month=${month ?? ''}`);
  }

  updateMemoData(data): Observable<any>{
    return this._httpClient.post(`${environment.baseApiUrl}updateMemo`, data);
  }

  // getAllHolidays(): Observable<any> {
  //   return this._httpClient.get(`${environment.baseApiUrl}getAllHolidays`)
  // }

  updateHoliday(encdates): Observable<any> {
    return this._httpClient.post(`${environment.baseApiUrl}updateHoliday`, encdates);
  }
}
