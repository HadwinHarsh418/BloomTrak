import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { environment } from 'environments/environment';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class MyAccountService {
  apiUrl: any;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    this.apiUrl = environment.baseApiUrl
  }
  getDepartmentListing(id,isf): Observable<any> {
    return this._httpClient.get(`${this.apiUrl}getDepartment?community_id=${id}&is_for=${isf}`)
  }
}
