import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EncryptionService } from 'app/utils/encryption/encryption.service';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class SettingsService {
 /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient, private _encryptionService: EncryptionService) {
  }
  getProtection(): Observable<any> {
    return this._httpClient.get(`${environment.baseApiUrl}getProtection`).pipe(map(data => {
      return this._encryptionService.getDecode(data);
    }))
  }

  addProtection(data): Observable<any> {
    // let term = (id) ? 'editFaq' : 'addFaq';
    let enc = this._encryptionService.encode(JSON.stringify(data));
    return this._httpClient.post(`${environment.baseApiUrl}protection`, { enc })
      .pipe(
        map(data => {
          return this._encryptionService.getDecode(data);
        })
      );
  }

  updateAgencyProfile(data): Observable<any>{
    return this._httpClient.post(`${environment.baseApiUrl}updateAgencyProfile`,data)
  }

  editAgencies(data): Observable<any>{
    return this._httpClient.post(`${environment.baseApiUrl}editAgencies`,data)
  }

}
