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


  getNotification(): Observable<any> {
    return this._httpClient.get(`${environment.baseApiUrl}notification`);
  }

  addNotification(data): Observable<any> {
    return this._httpClient.post(`${environment.baseApiUrl}addNotification`, data);
  }

  deleteNotification(data): Observable<any> {
    return this._httpClient.post(`${environment.baseApiUrl}delNotification`, data);
  }

}
