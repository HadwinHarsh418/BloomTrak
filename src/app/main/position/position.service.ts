import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PositionService {
  apiUrl:any;
  constructor( private _http: HttpClient ) { 
    this.apiUrl = environment.baseApiUrl
  }

  getPosition(community_id,searchStr?:any): Observable<any> {
    return this._http.get(`${this.apiUrl}getPosition?community_id=${community_id}&searchStr=${searchStr}`)
  }

  deletedPosition(community_id): Observable<any> {
    return this._http.put(`${this.apiUrl}deletedPosition?community_id=${community_id}`,'')
  }
  
  
  addPosition(body:any):Observable<any>{
    return this._http.post(`${this.apiUrl}addPosition`,body)
  }

  editPosition(body:any):Observable<any>{
    return this._http.post(`${this.apiUrl}editPosition`,body)
  }
}
