import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, RouterLinkWithHref } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil, first } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { AuthenticationService } from 'app/auth/service';
import { CoreConfigService } from '@core/services/config.service';
import { Role, User } from 'app/auth/models';
import { TranslateService } from '@ngx-translate/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DataService } from 'app/auth/service/data.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-auth-login-v2',
  templateUrl: './auth-login-v2.component.html',
  styleUrls: ['./auth-login-v2.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AuthLoginV2Component implements OnInit {
  //  Public
  public coreConfig: any;
  public loginForm: FormGroup;
  public loading = false;
  public submitted = false;
  public returnUrl: string;
  public error = '';
  public passwordTextType: boolean;
  public cnfrmpasswordTextType: boolean;
  public mainlogo = '';
  loadingSecurityData: boolean;

  // Private
  private _unsubscribeAll: Subject<any>;
  is_captcha: boolean;
  isRecaptcha: boolean;
  showAuthTokenModal: boolean = false;
  sixDigitCode: any;
  loggedUser: User;

  ip_address: string = "";
  current_city: string = "";
  deviceInfo: any;
  antiphishing: boolean;
  encodedemail: string = '';
  roles: any[] = [
    // { id:0, label1: ''},
    { id: 3, name: Role.Admin, label: 'Management Company' },
    { id: 1, name: Role.Community, label: 'Community' },
    { id: 2, name: Role.Agency, label: 'Agency' },
    { id: 4, name: Role.User, label: 'User' },
    { id: 6, name: Role.SuperAdmin, label: 'Admin' },
    { id: 7, name: Role.Community, label: 'Clock In-Out' },
    // { id:5, name: Role.Management},
  ];
  data1: any;
  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   */
  constructor(
    private _coreConfigService: CoreConfigService,
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private dataservice: DataService,
    private translateService: TranslateService,
    private _authenticationService: AuthenticationService,
    private toastr: ToastrManager,
    private deviceService: DeviceDetectorService,

  ) {
    this.mainlogo = this._coreConfigService.mainLogo;

    this._unsubscribeAll = new Subject();

    // Configure the layout
    this._coreConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        menu: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        customizer: false,
        enableLocalStorage: false
      }
    };
    // this.getCurrentIP();
    if (!this.dataservice.geodata) {
      this.dataservice.getGeoDevData();
    }
    if (!this.dataservice.devicedata) {
      this.dataservice.getDeviceData();
    }
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  resolved(captchaResponse: string) {
    this.is_captcha = false;
    this.isRecaptcha = true;
    this.error = '';
  }

  /**
   * Toggle password
   */
  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  togglecnfrmPasswordTextType() {
    this.cnfrmpasswordTextType = !this.cnfrmpasswordTextType;
  }

  onSubmit() {
    this.submitted = true;
    let locData: any = this.dataservice.getgeoDevObject();
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    // if (!this.isRecaptcha && location.href.indexOf('localhost:4200') == -1) {
    //   this.is_captcha = true;
    //   this.translateService.get('login.captchaReq').subscribe(
    //     res => {
    //       this.error = res;
    //     }
    //   )
    //   return;
    // }
    // Login
    this.loading = true;
    localStorage.clear()
    this._authenticationService
      .login(this.f.email.value, this.f.password.value, this.f.user_role.value, false, locData)
      .pipe(first())
      .subscribe(
        data => {
          if (!data.error && data.body && data.body && data.body.token) {
            if (!data.body.id) { return; }
            if (data.body?.community || data.body?.agency || data.body?.management) {
              this.data1 = data.body?.community || data.body?.management || data.body?.agency;
            }
            sessionStorage.setItem("Token", data.body.token)
            let cUser: User = {
              email: data.body.email,
              is_locked: data.body.is_locked,
              locked_at: data.body.locked_at,
              com_id: this.data1,
              user_role: data.body.user_role,
              prmsn: data.body.permissions[0]?.name,
              prmsnId: data.body.permissions[0]?.role_id,
              sponsor_name: data.body.sponsor_name,
              token: data.body.token,
              username: data.body.username,
              avatar: data.body.profile_picture ? data.body[0].profile_picture : 'assets/images/avatars/10.png',
              profile_picture: data.body.profile_picture,
              wrong_login_attempts: data.body.wrong_login_attempts,
              _id: data.body._id,
              id: data.body.id,
              two_fa_actived: data.body.two_fa_actived ? data.body[0].two_fa_actived : '0',
              isAdmin: data.body.isAdmin,
              is_identity_approved: data.body.is_identity_approved,
              is_identified: data.body.is_identified,
              discriminatory_zone: data.body.discriminatory_zone,
              dscm_zone_name: data.body.dscm_zone_name,
              is_vip: data.body.is_vip,
              antiPhishingActive: data.body.antiPhishingActive,
              stepper: data.body.stepper,
            }
            if (data.body.permissions[0]?.role_id || data.body.user_role) {
              switch (parseInt(data.body.user_role || data.body.permissions[0]?.role_id)) {
                case 1:
                  cUser.role = Role.Community;
                  break;
                case 2:
                  cUser.role = Role.Agency;
                  break;
                case 3:
                  cUser.role = Role.Admin;
                  break;
                case 4:
                  cUser.role = Role.communityUser;
                  break;
                case 5:
                  cUser.role = Role.User;
                  break;
                case 6:
                  cUser.role = Role.SuperAdmin;
                  break;
                case 7:
                  cUser.role = Role.ClockIn;
                  break;
                case 8:
                  cUser.role = Role.Management;
                  break;
                case 15:
                  cUser.role = Role.User;
                  break;
                case 16:
                  cUser.role = Role.Community;
                  break;
                case 17:
                  cUser.role = Role.Agency;
                  break;
                case 18:
                  cUser.role = Role.User;
                  break;
                case 19:
                  cUser.role = Role.User;
                  break;
                case 20:
                  cUser.role = Role.User;
                  break;
                case 21:
                  cUser.role = Role.Community;
                  break;
                case 22:
                  cUser.role = Role.User;
                  break;
                case 23:
                  cUser.role = Role.User;
                  break;
                case 24:
                  cUser.role = Role.SuperAdmin;
                  break;
                default:
                  cUser.role = Role.Community;
                  break;
              }
            }
            this.loading = false;
            if (!cUser.antiPhishingActive) {
              this.loggedUser = cUser;
              // this.encodedemail = `${this.loggedUser.email.substr(0, 3)}
              //                     ***${this.loggedUser.email.substr(
              //   this.loggedUser.email.indexOf('@')
              // )}`
              this.toCheckAuht()
            } else {
              this.loggedUser = cUser;
              this._authenticationService.tempToken = cUser.token;
              this.antiphishing = true;
            }
          } else {
            this.toastr.errorToastr(data.msg)
            // this.error = data.msg;
            let validVal = [1, '1', true, 'true'];
            if (data.to_complete_identity && validVal.includes(data.to_complete_identity)) {
              this.dataservice.opentIdentificaitonModal.next({ user_id: data.user_id });
            }
            this.loading = false;
          }
        },
        error => {
          this.translateService.get('COMMONERRORS.somethingError').subscribe(
            resp => {
              this.error = resp;
            }
          );
          // this.error = error;
          this.loading = false;
        }
      );
  }

  toCheckAuht() {
    if (this.loggedUser.two_fa_actived === '0' || location.href.indexOf('localhost:4200') > -1) {
      let locData: any = {};
      locData = this.dataservice.getgeoDevObject();
      this.loggedUser = this.loggedUser;
      locData.userID = this.loggedUser._id;
      this._authenticationService.tempToken = this.loggedUser.token;
      this.loginLogs(locData);
      this._router.navigate(['/dashboard']);
        this._authenticationService.setLogin(this.loggedUser);
    }
    else {
      this._authenticationService.tempToken = this.loggedUser.token;
      this.loggedUser = this.loggedUser;
      this.showAuthTokenModal = true;
    }
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // redirect to home if already logged in
    if (this._authenticationService.currentUserValue) {
      this._router.navigate(['/dashboard']);
    }
    this.loginForm = this._formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', Validators.compose([Validators.required])],
      user_role: ['3', [Validators.required]],
      // cnfmpassword: ['', Validators.compose([Validators.required])] },
      // { 
      //   validators: this.password.bind(this)
      // }
    });



    // get return url from route parameters or default to '/'
    this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';

    // Subscribe to config changes
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });
  }

  password(formGroup: FormGroup) {
    const { value: password } = formGroup.get('password');
    const { value: cnfmpassword } = formGroup.get('cnfmpassword');
    return password === cnfmpassword ? null : { passwordNotMatch: true };
  }


  closeAntiMModal() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('modal-open');
    this.antiphishing = false;
  }

  verifyAntiPhising() {
    if (this.sixDigitCode && this.sixDigitCode.length == 6) {
      this.loadingSecurityData = true;
      let data = {
        user_id: this.loggedUser._id,
        srcode: this.sixDigitCode,
        ip_data: this.dataservice.getgeoDevObject()
      }
      this._authenticationService.verifyAntiPhising(data).subscribe(res => {
        if (res['error'] == false) {
          this.toastr.successToastr(res.msg);
          this.antiphishing = false;
          this.toCheckAuht()
        } else {
          // this._authenticationService.errorToaster(res);
        }
        this.sixDigitCode = '';
        this.loadingSecurityData = false;
      }, error => {
        this.loadingSecurityData = false;
        this.sixDigitCode = '';
      }
      );
    } else {
      this.translateService.get('G2FA.enterValid').subscribe(
        res => {
          this.toastr.errorToastr(res);
        }
      );
    }
  }

  closeAuthMModal() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('modal-open');
    this.showAuthTokenModal = false;
  }

  changedSixdigit() {
    this.sixDigitCode = this.sixDigitCode.trim().length > 6
      ? this.sixDigitCode.trim().substr(0, 6) : this.sixDigitCode.trim();
  }


  verifyGoogleAuth() {
    if (this.sixDigitCode && this.sixDigitCode.length == 6) {
      this.loadingSecurityData = true;
      let data = {
        user_id: this.loggedUser._id,
        srcode: this.sixDigitCode
      }
      this._authenticationService.verifyTwoFA(data).subscribe(res => {
        if (res['error'] == false) {
          this.toastr.successToastr(res.msg);
          this.showAuthTokenModal = false;
          let locData: any = this.dataservice.getgeoDevObject();
          locData.userID = this.loggedUser._id;
          this.loginLogs(locData);
          this._authenticationService.setLogin(this.loggedUser);
          this._router.navigate(['/dashboard/ecommerce']);
        } else {
          // this._authenticationService.errorToaster(res);
        }
        this.sixDigitCode = '';
        this.loadingSecurityData = false;
      }, error => {
        this.loadingSecurityData = false;
        this.sixDigitCode = '';
      }
      );
    } else {
      this.translateService.get('G2FA.enterValid').subscribe(
        res => {
          this.toastr.errorToastr(res);
        }
      );
    }
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }


  loginLogs(data) {
    this.dataservice.loginLog(data).subscribe(response => {
      if (response['error'] == false) {
      } else {
      }
      this._authenticationService.tempToken = null;
    }, error => { })
  }
}
