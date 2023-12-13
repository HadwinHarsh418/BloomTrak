import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'environments/environment';
import { UserBalance } from 'app/auth/models';

@Injectable({ providedIn: 'root' })
export class UserBalanceService {

   currentUserBalance: UserBalance;
  /**
   *
   * @param {HttpClient} _http
   */
  constructor(private _http: HttpClient) {
      this.resetBalance();
  }

  /**
   * Get user balance by user_id
   */
   getUserBalance(user_id: number) {
    return this._http.post<any>(`${environment.baseApiUrl}getUserBalance`, {user_id});
   }

   resetBalance() {
    this.currentUserBalance = {
        balance:0, totalActiveCapital:0, totalCapitalGain:0, totalNetCapital:0, totalPendingCapital:0,
        pending_cap_withdrawal : 0, available_balance : 0, frozen_bonus : 0, frozen_balance : 0, 
        walletBalance : 0, profitiability_bonus : 0, profitiability_extra_bonus : 0, todayBonus:0
    }
   }
}
