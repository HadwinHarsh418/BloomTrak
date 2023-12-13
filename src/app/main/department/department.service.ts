import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'environments/environment';
@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
apiUrl:any;
  constructor(private _http: HttpClient,) { 
      this.apiUrl = environment.baseApiUrl
    }

  getDepartmentListing(id,isf?): Observable<any> {
    return this._http.get(`${this.apiUrl}getDepartment?community_id=${id}&is_for=${isf}`)
  }

  addDepartment(body:any):Observable<any>{
    return this._http.post(`${this.apiUrl}addDepartment`,body)
  }

  editDepartment(data):Observable<any>{
    return this._http.post(`${this.apiUrl}editDepartment`,data)
  }

  
  deletedDepartment(data):Observable<any>{
    return this._http.put(`${this.apiUrl}deletedDepartment?id=${data}`,'')
  }

}
