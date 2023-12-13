import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CoreConfigService } from '@core/services/config.service';
import { Patterns } from 'app/auth/helpers/patterns';
import { Role } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { Page } from 'app/utils/models';
import { ApiService } from 'app/auth/service/api.service';
import { DataService } from 'app/auth/service/data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  private _unsubscribeAll: Subject<any>;

  formData!: FormGroup;
  btnShow: boolean = false
  tempUserId: any;
  loginForm: FormGroup;
  public coreConfig: any;
  error: boolean = false;
  loading: boolean = false;
  currentUser: any;
  tempAddId: any;
  public page = new Page();
  searchSub: any = null;
  loadingList: boolean;
  searchStr: string = '';
  public rows = [];
  minDate: string;


  constructor(
    private _coreConfigService: CoreConfigService,
    private fb: FormBuilder,
    private rout: Router,
    private api: ApiService,
    private _authenticationService: AuthenticationService,
    private dataService: DataService,
    private toastr: ToastrManager,
    private authService: AuthenticationService
  ) {

    this._authenticationService.currentUser.subscribe((x: any) => {
      if(x && x.id){
        this.currentUser = x
      }
    })
    this._unsubscribeAll = new Subject()
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
  }

  ngOnInit(): void {
    // Subscribe to config changes
    this.getDate()
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });

    this.formData = this.fb.group({
      agency_name: ['', Validators.required],
      agency_phone: ['', [Validators.required, Validators.pattern(Patterns.number)]],
      agency_email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(Patterns.password)]],
      agency_website: ['', Validators.required],
      DOB: ['', Validators.required],
    })
    // this.formData = this.fb.group({
    //   community_name: ['', Validators.required],
    //   community_address1: ['', Validators.required],
    //   community_phone_no: ['', [Validators.required, Validators.pattern(Patterns.number)]],
    //   password: ['', [Validators.required, Validators.pattern(Patterns.password)]],
    // })
    
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', Validators.required]
    });

  }

  // setPage(pageInfo) {
  //   if (this.searchSub) {
  //     this.searchSub.unsubscribe();
  //     this.searchSub = null;
  //   }
  //   this.page.pageNumber = pageInfo.offset;
  //   let data = {
  //     pageNo: this.page.pageNumber,
  //     limitNum: this.page.size,
  //   };
  //   this.loadingList = true;
  //   // let community_id = (this.currentUser.role == Role.Community) ? this.currentUser.id : null;
  //   this.searchSub = this.dataService.getAgency(this.searchStr, this.page.pageNumber, this.page.size, community_id).subscribe(
  //     res => {
  //       if (!res.error) {
  //         this.rows = res.body;
  //         if (!res.pagination) {
  //           this.page.size = res.body.length;
  //           this.page.totalElements = res.body.length;
  //           this.page.pageNumber = res.body.pageNumber;
  //           this.page.totalPages = res.body.totalPages;

  //         }
  //         else {
  //           this.page = res.pagination
  //         this.page.pageNumber = res.pagination.pageNumber
  //         }
  //       } else {
  //         this._authenticationService.errorToaster(data)
  //       }
  //       this.loadingList = false;
  //     }, error => {
  //       this.loadingList = false;
  //     }
  //   )
  // }

  get controls() {
    return this.formData.controls
  }

  // submitted() {
  //   for (let item of Object.keys(this.controls)) {
  //     this.controls[item].markAsDirty()
  //   }
  //   if (this.formData.invalid) {
  //     return;
  //   }
  //   else {
  //     this.btnShow = true;
  //     let body1={
  //       community_name: this.formData.value.community_name,
  //       community_phone_no: this.formData.value.community_phone_no.replace(/\D/g, ''),
  //       community_address1: this.formData.value.community_address1,
  //       password: this.formData.value.password,
  //   }
  //     this.api.register(body1).subscribe((res: any) => {
  //       if (!res.error) {

  //         let cUser = res.body[0]
  //         if (cUser.user_role) {
  //           switch (parseInt(cUser.user_role)) {
  //             case 1:
  //               cUser.role = Role.Community;
  //               break;
  //             case 2:
  //               cUser.role = Role.Agency;
  //               break;
  //             case 3:
  //               cUser.role = Role.Admin;
  //               break;
  //             case 4:
  //               cUser.role = Role.User;
  //               break;
  //             default:
  //               cUser.role = Role.Community;
  //               break;
  //           }
  //         }
  //         this.authService.setLogin(cUser)
  //         this.tost.successToastr(res.msg)
  //         this.tempUserId = res.body[0].id
  //         this.rout.navigateByUrl('setup')
  //       } else {
  //         this.tost.errorToastr(res.msg);
  //       }
  //       this.btnShow = false;
  //     },
  //       (err) => {
  //         this.btnShow = false;
  //         this.api.genericErrorToaster();

  //       })
  //   }

  // }

  submitted() {
    for (let item of Object.keys(this.controls)) {
      this.controls[item].markAsDirty()
    }
    if (this.formData.invalid) {
      return;
    }
    else {
      //let data = { ...this.formData.value, ...{ community_id: this.tempAddId } }
      this.btnShow = true;
      let body1={
        agency_name: this.formData.value.agency_name,
        password: this.formData.value.password,
        agency_website: this.formData.value.agency_website,
        agency_phone: this.formData.value.agency_phone.replace(/\D/g, ''),
        agency_email: this.formData.value.agency_email,
        DOB: this.formData.value.DOB,
      }
      this.btnShow = true;
      this.dataService.addAgency(body1).subscribe((res: any) => {
        if (!res.error) {
          this.toastr.successToastr(res.msg);
          this.rout.navigateByUrl('');
          this.tempAddId = res.body[0]
          // this.setPage({ offset: 0 })
        } else {
          this.toastr.errorToastr(res.msg);
        }
        this.btnShow = false;
      },
        (err) => {
          this.btnShow = false;
          this.dataService.genericErrorToaster();

        })
    }
  }
  get f() {
    return this.loginForm.controls;
  }

  getDate() {
    let todayDate: any = new Date();
    let toDate: any = todayDate.getDate();
    if (toDate < 10) {
      toDate = '0' + toDate
    }
    let month = todayDate.getMonth() + 1;
    if (month < 10) {
      month = '0' + month;
    }
    let year = todayDate.getFullYear();
    this.minDate = year + '-' + month + '-' + toDate
  }
  


}
