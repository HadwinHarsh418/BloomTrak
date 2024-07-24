import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CoreConfigService } from '@core/services/config.service';
import { Patterns } from 'app/auth/helpers/patterns';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { ApiService } from 'app/auth/service/api.service';
import { DataService } from 'app/auth/service/data.service';
import { Page } from 'app/utils/models';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {  IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss']
})
export class SetupComponent implements OnInit {
  searchSub: any = null;
  currenUserId: any;
  public page = new Page();
  loadingList: boolean;
  searchStr: string = '';
  public rows = [];
  formData!: FormGroup;
  editFormData!: FormGroup;
  allCommunity: any = [];
  btnShow: boolean = false;
  allAgenciesID: any = [];
  currentUser: any;
  id: { id: any; };
  minDate: string;

  private _unsubscribeAll: Subject<any>;
  public coreConfig: any;
  Primary!: FormGroup;
  Servey!: FormGroup;
  radioData!: FormGroup
  managementServey!: FormGroup;
  loading: boolean = false
  activeTab: number = 1
  radioErr: boolean = false;
  error: boolean = false;
  getDetail: any[] = []
  dpw:boolean = false;

  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'mg_name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    closeDropDownOnSelection: true,
    itemsShowLimit: 3,
    allowSearchFilter: true
  };
  getMangemntId_names: any =[];
  drpForm!: FormGroup;
  getMangemntId: any = []
  manag: any =[]

  constructor(
    private _coreConfigService: CoreConfigService,
    private fb: FormBuilder,
    private api: ApiService,
    private tost: ToastrManager,
    private auth: AuthenticationService,
    private router: Router,
    private dataService: DataService,
    private _authenticationService: AuthenticationService,

  ) {

    // this.currentUser = this.auth.currentUserValue;
    // this.auth.currentUser.subscribe(res => {
    //   this.currentUser = res;
    //   this.activeTab = this.currentUser?.stepper || 1;
    // })

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
    // this.getMangemntId_name()
    // this.getCommunityById()
    // this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
    //   this.coreConfig = config;
    // });

    // this.activeTab = this.currentUser?.stepper || 1;

    // this.Primary = this.fb.group({
    //   primary_contact_name: ['', Validators.required],
    //   primary_contact_title: ['', Validators.required],
    //   primary_contact_phone: ['', [Validators.required, Validators.pattern(Patterns.number)]],
    //   primary_contact_email: ['', [Validators.required, Validators.email]],
    //   id: this.currentUser?.id || ''

    // })

 

    // this.managementServey = this.fb.group({
    //   management_company_name: ['', Validators.required],
    //   management_company_address: ['', Validators.required],
    //   management_company_phone: ['', Validators.required],
    //   management_company_email: ['', [Validators.required, Validators.email]],
    //   management_company_contact_person: ['', Validators.required],
    //   id: this.currentUser?.id || ''

    // })

    // this.radioData = this.fb.group({
    //   single_community: ['', Validators.required],
    //   id: this.currentUser?.id
    // })

    // this.drpForm = this.fb.group({

    // })

  }


  get controls() {
    return this.Primary.controls
  }

  // get sc() {
  //   return this.Servey.controls
  // }

  get mc() {
    return this.managementServey.controls
  }

  get f() {
    return this.radioData.controls;
  }





  primarySubmit() {
    for (let item of Object.keys(this.controls)) {
      this.controls[item].markAsDirty()
    }
    if (this.Primary.invalid) {
      return;
    }
    else {
      this.btnShow = true;
      let body1={
        primary_contact_name: this.Primary.value.primary_contact_name,
        primary_contact_phone: this.Primary.value.primary_contact_phone.replace(/\D/g, ''),
        primary_contact_email: this.Primary.value.primary_contact_email,
        primary_contact_title: this.Primary.value.primary_contact_title,
        id: this.currentUser?.id || '',
    }
      this.api.updatePrimaryContact(body1).subscribe((res: any) => {
        if (!res.error) {
          this.tost.successToastr(res.msg)
          this.btnShow = false;
          this.updateStepper(res.body.stepper);
          this.activeTab = 2
        }
        else {
          this.tost.errorToastr(res.msg)
          this.btnShow = false;
        }
      }, (err: any) => {
        this.api.genericErrorToaster()
        this.btnShow = false;
      })

    }
  }

  // serveySubmit() {
  //   for (let item of Object.keys(this.sc)) {
  //     this.sc[item].markAsDirty()
  //   }
  //   this.btnShow = true;
  //   let body1={
  //     survey_compliance_name: this.Servey.value.survey_compliance_name,
  //     survey_compliance_phone: this.Servey.value.survey_compliance_phone.replace(/\D/g, ''),
  //     survey_compliance_title: this.Servey.value.survey_compliance_title,
  //     survey_compliance_email: this.Servey.value.survey_compliance_email,
  //     id: this.currentUser?.id || ''
  // }
  //   this.api.updateSurveyCompliance(body1).subscribe((res: any) => {
  //     if (!res.error) {
  //       this.tost.successToastr(res.msg)
  //       this.btnShow = false;
  //       this.updateStepper(res.body.stepper);
  //       this.activeTab = 3
  //     } else {
  //       this.tost.errorToastr(res.msg)
  //       this.btnShow = false;
  //     }
  //   },
  //     (err: any) => {
  //       this.api.genericErrorToaster()
  //       this.btnShow = false;
  //     })
  // }

  managementSubmit() {

    for (let item of Object.keys(this.mc)) {
      this.mc[item].markAsDirty()
    }
    this.btnShow = true;
    let body1={
      management_company_name: this.managementServey.value.management_company_name,
      management_company_phone: this.managementServey.value.management_company_phone.replace(/\D/g, ''),
      management_company_address: this.managementServey.value.management_company_address,
      management_company_email: this.managementServey.value.management_company_email,
      management_company_contact_person: this.managementServey.value.management_company_contact_person.replace(/\D/g, ''),
      id: this.currentUser?.id || ''
  }
    this.api.updateManagementCompany(body1).subscribe((res: any) => {
      if (!res.error) {
        this.tost.successToastr(res.msg)
        this.updateStepper(res.body.stepper);
        this.btnShow = false;
      }
      else {
        this.tost.errorToastr(res.msg)
        this.btnShow = false;
      }
    },
      (err: any) => {
        this.api.genericErrorToaster()
        this.btnShow = false;
      })
  }
  
  radioData1() {
    for (let item of Object.keys(this.f)) {
      this.f[item].markAsDirty()
    }
    this.btnShow = true
    if(this.radioData.value.single_community == '1'){
    this.dpw = true;
    }
    this.api.updateSingleCommunity(this.radioData.value).subscribe((res: any) => {
      if (!res.error) {
        this.tost.successToastr(res.msg);
        this.activeTab = 3;
        this.updateStepper(res.body.stepper);
        this.router.navigate(['/dashboard'])
        this.btnShow = false
      } else {
        this.tost.errorToastr(res.msg)
        this.btnShow = false
      }
    },
      (err: any) => {
        this.api.genericErrorToaster()
        this.btnShow = false
      })



  }



  updateStepper(stepper: any) {
    let user = this.currentUser;
    user.stepper = parseInt(stepper);
    this.auth.updateTokenValue(user);
  }

  getCommunityById() {
    let id = this.currentUser?.id
    this.api.getcommunityById(id).subscribe((res: any) => {
      this.getDetail = res.body
      if (!res.error && this.getDetail?.length ) {

        this.Primary.patchValue({
          primary_contact_name: this.getDetail[0].primary_contact_name,
          primary_contact_title: this.getDetail[0].primary_contact_title,
          primary_contact_phone: this.getDetail[0].primary_contact_phone,
          primary_contact_email: this.getDetail[0].primary_contact_email,
        })

        // this.Servey.patchValue({
        //   survey_compliance_name: this.getDetail[0].survey_compliance_name,
        //   survey_compliance_title: this.getDetail[0].survey_compliance_title,
        //   survey_compliance_phone: this.getDetail[0].survey_compliance_phone,
        //   survey_compliance_email: this.getDetail[0].survey_compliance_email,
        // })

        this.managementServey.patchValue({
          management_company_name: this.getDetail[0].management_company_name,
          management_company_address: this.getDetail[0].management_company_address,
          management_company_phone: this.getDetail[0].management_company_phone,
          management_company_email: this.getDetail[0].management_company_email,
          management_company_contact_person: this.getDetail[0].management_company_contact_person,
        })

        
      }
    },
      (err) => {
        this.api.genericErrorToaster()
      })
  }

  getMangemntId_name() {
    this.dataService.getManagementNames().subscribe(res => {
      if (!res.error) {
        this.getMangemntId_names = res.body
      } else {
        this._authenticationService.errorToaster(res);
      }
      this.btnShow = false;
    }, error => {
      this.dataService.genericErrorToaster();
      this.btnShow = false;
    });
}
get dp() {
  return this.drpForm.controls
}

// drpForm1(modal){
//   for (let item of Object.keys(this.dp)) {
//     this.dp[item].markAsDirty()
//   }
//   if (this.drpForm.invalid) {
//     return;
//   }
//   this.getMangemntId.forEach(element => {
//     this.manag.push(element.id)
//   });
//   let data ={ id : this.tempCmntyId , management_id: this.manag}
//   this.dataService.updateManagementId(data).subscribe((res: any) => {
//     if (!res.error) {
//       this.btnShow = false;
//       this.toastr.successToastr(res.msg);
//       this.closeded(modal)        
//       this.setPage({ offset: 0 })
//     }
//   },
//     (err: any) => {
//       this.btnShow = false;
//       this.dataService.genericErrorToaster()
//       this.activeTab = 3
//     })

// }
}
