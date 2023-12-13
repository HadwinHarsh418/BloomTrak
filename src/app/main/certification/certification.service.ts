import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CertificationService {
  apiUrl:any;
  constructor(private _http: HttpClient,) { 
      this.apiUrl = environment.baseApiUrl
    }

  getCertificationListing(data): Observable<any> {
    return this._http.get(`${this.apiUrl}getCertification?isAdmin=${data.usrRole}&community_id=${data.comId}`)
  }
  
  deletedCertification(data): Observable<any> {
    return this._http.put(`${this.apiUrl}deletedCertification?id=${data}`,'')
  }

  addCertifications(body:any):Observable<any>{
    return this._http.post(`${this.apiUrl}addCertification`,body)
  }
  editCertifications(body:any):Observable<any>{
    return this._http.post(`${this.apiUrl}editCertification`,body)
  }
}
