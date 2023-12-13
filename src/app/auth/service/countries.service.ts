import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'environments/environment';
import { EncryptionService } from 'app/utils/encryption/encryption.service';

@Injectable({ providedIn: 'root' })
export class CountriesService {

  countryList: CountryModel[] = [];
  /**
   *
   * @param {HttpClient} _http
   */
  constructor(
    private _http: HttpClient,
    private encryptionService: EncryptionService,
  ) {
    // this.setCountry();
  }

  /**
   * Get user balance by user_id
   */
  // getCountries() {
  //   return this._http.get<any>(`${environment.baseApiUrl}country`);
  // }

  // setCountry() {
  //   this.getCountries().subscribe(res => {
  //     let data = this.encryptionService.getDecode(res);

  //     if (!data.error && data.body) {
  //       this.countryList = res.body;
  //     }
  //   }
  //   );
  // }

  getCountryIdByName(name: string) {
    let picked = this.countryList.filter(item => item.name.toLocaleLowerCase() == name.toLocaleLowerCase());
    return (picked && picked.length > 0) ? picked[0].id : '';
  }

  getCountryNameByID(id: number) {
    let picked = this.countryList.filter(item => item.id == id);
    return (picked && picked.length > 0) ? picked[0].name : '';
  }

}


export class CountryModel {
  id?: number;
  iso_code?: string;
  name?: string;
}