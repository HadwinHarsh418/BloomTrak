import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class NotificationsService {
  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
  }


  getNotification(id?:any): Observable<any> {
    return this._httpClient.get(`${environment.baseApiUrl}getNotificationDetailsById/${id}`);
  }

  addNotification(data): Observable<any> {
    return this._httpClient.post(`${environment.baseApiUrl}addNotification`, data);
  }

  getNotificationReadCount(data): Observable<any> {
    return this._httpClient.get(`${environment.baseApiUrl}getNotificationReadCount/${data}`);
  }

  deleteNotification(data): Observable<any> {
    return this._httpClient.post(`${environment.baseApiUrl}delNotification`, data);
  }
  updateNotificationDetailsById(data): Observable<any> {
    return this._httpClient.get(`${environment.baseApiUrl}updateNotificationDetailsById/${data}`);
  }

}
