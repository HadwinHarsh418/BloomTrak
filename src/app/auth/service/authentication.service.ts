import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ToastrManager } from 'ng6-toastr-notifications';
import { environment } from 'environments/environment';
import { User, Role } from 'app/auth/models';
import { EncryptionService } from 'app/utils/encryption/encryption.service';
import { UserBalanceService } from './user-balance.service';
import { CoreTranslationService } from '@core/services/translation.service';
import { Router } from '@angular/router';
// import { DataService } from './data.service';
import { map } from 'rxjs/operators';
import * as localforage from 'localforage';

const TOKEN_KEY = 'Bloom-admin-auth-token';


@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  //public
  public currentUser: Observable<User>;

  //private
  private currentUserSubject: BehaviorSubject<User>;
  public profilePicUpdate = new BehaviorSubject<boolean>(false);
  UserPermissions:any;

  loggedOut: boolean;
  tempToken: string = '';
  private channel = new BroadcastChannel('logout-channel');
  public logoutTokenKey = 'logout-token';
  private logoutSubject = new BehaviorSubject<void>(null);
  logoutObservable$ = this.logoutSubject.asObservable();

  /**
   *
   * @param {HttpClient} _http
   * @param {ToastrService} _toastrService
   * @param {UserBalanceService} _userBalanceService
   */
  constructor(
    private _http: HttpClient,
    private encryptionService: EncryptionService,
    private _userBalanceService: UserBalanceService,
    public toastr: ToastrManager,
    private _coreTranslationService: CoreTranslationService,
    private _router : Router,
    // private dataService: DataService
  ) {
    this.checkToken();
    this.channel.onmessage = (event) => {
      if (event.data) {
        // Logout event received from another tab
        this.logoutSubject.next();
        window.location.reload()
      }
    };
  }

  triggerLogout() {
    // Generate a unique token for logout
    const logoutToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    // Store the logout token
    localforage.setItem(this.logoutTokenKey, logoutToken);

    // Broadcast the logout event to other tabs
    this.channel.postMessage(logoutToken);
  }

  checkToken() {
    let locToken = this.encryptionService.decode(localStorage.getItem(TOKEN_KEY));
    if (locToken) {
      this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(locToken));
      this.currentUser = this.currentUserSubject.asObservable();
    } else {
      this.currentUserSubject = new BehaviorSubject<User>(null);
      this.currentUser = this.currentUserSubject.asObservable();
    }
  }

  updateTokenValue(updatedUser: any) {
    if (updatedUser && updatedUser.token) {
      localStorage.setItem(TOKEN_KEY, this.encryptionService.encode(JSON.stringify(updatedUser)));
      this.currentUserSubject.next(updatedUser);
    }
  }

  // getter: currentUserValue
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  /**
   *  Confirms if user is admin
   */
  get isAdmin() {
    return this.currentUser && this.currentUserSubject.value.role === Role.Admin;
  }

  /**
   * User login
   *
   * @param email
   * 
   * @param password
   * @returns user
   */
  login(email: string, password: string, user_role: any,  adminLogin = false,loginManagement = false, ipdata = null) {
    let data:any = {
      "password": password.trim(),
      "adminLogin": adminLogin,
      "loginManagement": loginManagement,
      "user_role": user_role,
      'ip_data': ipdata
    }
    
    let url = '';
    // if( user_role == '3')  { 
    //   url = 'loginManagement';
    //   data.email = email.trim();
    // } else if( user_role == '6')  { 
    //   url = 'admLogin';
    //   data.email = email.trim();
    // } else {
    //   data.email = email.trim();
    //   url = 'login';
    // }
    if(email.indexOf('@') > -1) {
      data.email = email.trim();
    } else {
      data.username = email.trim();
    }
      url = 'login';
    
    let enc_data = this.encryptionService.encrypt(JSON.stringify(data));
    return this._http
      .post<any>(`${environment.baseApiUrl}${url}`, data)
      // .pipe(
      //   map(user => {
      //     return this.encryptionService.getDecode(user);
      //   })
      // );
  }

  // addDevice(data): Observable<any> {
  //   // let enc_data = this.encryptionService.encrypt(JSON.stringify(data));
  //   return this._http.post(`${environment.baseApiUrl}addDevice`, data)
  // }
  addSafariToken(data): Observable<any> {
    // let enc_data = this.encryptionService.encrypt(JSON.stringify(data));
    return this._http.post(`${environment.baseApiUrl}addWebPush`, data)
  }
  verifyTwoFA(data): Observable<any> {
    let enc_data = this.encryptionService.encrypt(JSON.stringify(data));
    return this._http.post(`${environment.baseApiUrl}twoFactAuthVerify`, { enc: enc_data })
  }

  verifyAntiPhising(data): Observable<any> {
    let enc_data = this.encryptionService.encrypt(JSON.stringify(data));
    return this._http.post(`${environment.baseApiUrl}verifyAntiPhising`, { enc: enc_data })
  }
  
  /**
   * User logout
   *
   */
  logout() {
    // remove user from local storage to log user out
    if(localStorage.getItem('safariKeys')){
      this.clearSafariKeys()
    }
    localStorage.removeItem('safariKeys');
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem('Token');
    this.triggerLogout()
    // notify
    this.currentUserSubject.next(null);
    // clearBalance stored balance
    this._userBalanceService.resetBalance();
    // set logout flag
    this.loggedOut = true;
    // this.dataService.UserPermissions = null;
    this._router.navigate(['/']);

  }

  clearSafariKeys(){
    this.removeSafariToken(localStorage.getItem('safariKeys')).subscribe()
  }

  setLogin(user) {
    if (user && user.token) {
      localStorage.setItem(TOKEN_KEY, this.encryptionService.encode(JSON.stringify(user)));
      this.currentUserSubject.next(user);
      this.loggedOut = false;
    }
  }

  errorToaster(data: any, toToast = true) {
    if (data.error && data.msg) {
      if (data.auth == false) {
        if (!this.loggedOut) {
          // show toaster for session out;
          if (toToast) {
            this._coreTranslationService.getTransalate('COMMONERRORS.SESSIONOUT').subscribe(
              res => {

                this.toastr.errorToastr(res);
              }
            );
          }
        }
        this.loggedOut = true;
      } else {
        // show default retuned error;
        if (toToast) {
          this.toastr.errorToastr(data.msg);
        }
      }
    }
  }

  getPermissionByAdminRole() {
    if(localStorage.getItem('Bloom-admin-auth-token'))
    return this._http.get(`${environment.baseApiUrl}getPermissionByAdminRole`)
  }

  getCMAccessToByDate(id){
    return this._http.get(`${environment.baseApiUrl}getCMAccessToByDate?community_id=${id}`);
  }
  removeSafariToken(id){
    let d = JSON.parse(id)
    return this._http.delete(`${environment.baseApiUrl}deleteWebPush/${d.keys.p256dh}`);
  }

}
