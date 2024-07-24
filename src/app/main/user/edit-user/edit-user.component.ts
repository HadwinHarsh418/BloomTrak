import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Patterns } from 'app/auth/helpers/patterns';
import { AuthenticationService, UserService } from 'app/auth/service';
import { ApiService } from 'app/auth/service/api.service';
import { DataService } from 'app/auth/service/data.service';
import { Page } from 'app/utils/models';
import { StaticServiceService } from 'app/utils/static-service.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  editFormData!: FormGroup;
  forgotPassword!: FormGroup;
  currentUser: any;
  crrntUsrId: any[] = []
  formData!: FormGroup;
  submitId: any = []
  submitId2: any = []
  data: any;
  data1: any;
  data2: any;
  data3: any;
  data4: any;
  userEdit: any;
  data5: any;
  data6: any;
  btnShow: boolean = false;
  minDate: string;
  currenUserId: any = []
  public contentHeader: object;
  prmsUsrId: any;
  allAgenciesID: any = [];
  allCommunity: any = [];
  searchStr: string = '';
  public page = new Page();
  cmmntNames: any= [];
  selectedDataValue  = "+1";
  public passwordTextType: boolean;


  dropdownSettings2: IDropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'mg_name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    closeDropDownOnSelection: true,
    itemsShowLimit: 3,
    allowSearchFilter: true
  };

  dropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'id',
    textField: 'community_name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    closeDropDownOnSelection: true,
    itemsShowLimit: 3,
    allowSearchFilter: true
  };

  dropdownSettings1: IDropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'agency_name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    closeDropDownOnSelection: true,
    itemsShowLimit: 3,
    allowSearchFilter: true,
    maxHeight : 350
  };
  mngmNames: any= []
  cmntArr: any =[]
  agnArr: any = []
  mgArr: any =[]
  phoneUsd: { name: string; flag: string; code: string; dial_code: string; }[];
  olpasswordTextType: boolean;
  cfpasswordTextType: boolean;
  comRoles: any;
  admRoles: any;
  public passwordTextType2: boolean;
  slctSrtNm: any;

  constructor(
    private fb: FormBuilder,
    private _authenticationService: AuthenticationService,
    private dataService: DataService,
    private tost: ToastrManager,
    private api: ApiService,
    private userService: UserService,
    private loctn : Location,
    private aCtRoute: ActivatedRoute,
    private _userService: UserService,
    private phoneService : StaticServiceService

  ) { 
    this.phoneUsd = this.phoneService.phoneUsdCode

    this.aCtRoute.params.subscribe(
      res => {
        if (res.id) {
          
          this.prmsUsrId = res;
          this.EditUser(this.prmsUsrId)
        }
      }
    )

    this._authenticationService.currentUser.subscribe((x: any) => {
      this.currentUser = x;
      this.currentUser?.user_role == 5  ? this.currentUser.role = 'Agency' : ''
      this.currentUser?.user_role == 5  ? this.currentUser.role = 'Agency' : ''
      this.crrntUsrId.push(this.currentUser?.role == 'Admin' ?  x?._id : x?.id)
    });
  }

  ngOnInit(): void {
    this.getagenciesID()
    this.getCommunityId()
    this.getCmmntNm()
    this.mgnmntNames()
    this.getDate()
    this.getRoles()
    this.editFormData = this.fb.group({
      DOB: [''],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      username: [''],
      // hourly_rate: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required, Validators.pattern(Patterns.number)]],
      // PIN_code: ['', Validators.required],
      community_id: [''],
      agency_id: [''],
      management_Co: [''],
      management_co_user: ['',Validators.required],
      // isAdmin: ['',Validators.required],
    })

    // if(this.currentUser?.role == 'Agency')
    // {
    //  this.editFormData.controls['DOB'].clearValidators();
    //  this.editFormData.updateValueAndValidity();
    // }
    // if(this.currentUser?.role != 'Agency')
    // {
    //  this.editFormData.controls['DOB'].setValidators(Validators.required);
    //  this.editFormData.updateValueAndValidity();
    // }

    this.forgotPassword = this.fb.group({
      password: ['',Validators.compose([Validators.required, Validators.pattern(Patterns.password)])],
      confPassword: ['',Validators.compose([Validators.required, Validators.pattern(Patterns.password)])],
      newPassword: ['',Validators.compose([Validators.required, Validators.pattern(Patterns.password)])],
      id: this.prmsUsrId.id
    })

    // if(this.currentUser?.role == 'Agency')
    // {
    //  this.editFormData.controls['DOB'].clearValidators();
    //  this.editFormData.updateValueAndValidity();
    // }
    // if(this.currentUser?.role != 'Agency')
    // {
    //  this.editFormData.controls['DOB'].setValidators(Validators.required);
    //  this.editFormData.updateValueAndValidity();
    // }

    this.contentHeader = {
      headerTitle: this.currentUser?.role == 'Agency' ? 'Edit Agency Personnel' : 'Edit User',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Home',
            isLink: true,
            link: '/'
          },
          {
            name: this.currentUser?.role == 'Agency' ? 'Agency Personnel' :this.currentUser?.user_role == 6   ?  '':'User',
            isLink: true,
            link: this.currentUser?.user_role == 5 ? '/agency-personnel' :this.currentUser?.user_role == 2 ?'/agency-personnel':this.currentUser?.user_role == 6 ?'': '/user'
          }
        ]
      }
    };
  }

  togglePasswordTextType2() {
    this.passwordTextType2 = !this.passwordTextType2;
  }

  uncheckDropdown4() {
    if (this.editFormData.value.community_id) {
      this.editFormData.get('agency_id').reset()
    }
  }
  multiuncheckDropdown4() {
    this.editFormData.get('agency_id').reset()
  }
  uncheckDropdown3() {
    if (this.editFormData.value.agency_id) {
      this.editFormData.get('community_id').reset()
    }
  }
  multiuncheckDropdown3() {
    this.editFormData.get('community_id').reset()
  }

  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  oldPasswordTextType() {
    this.olpasswordTextType = !this.olpasswordTextType;
  }

  cnfrPasswordTextType() {
    this.cfpasswordTextType = !this.cfpasswordTextType;
  }




  get ec() {
    return this.editFormData.controls;
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
  dateErrorFxn(){
    let date = new Date();
    let inputDate = new Date(this.editFormData?.value?.DOB)
    return date < inputDate ? true : false;
}

  editSubmitted() {
    if(this.dateErrorFxn()){
      this.tost.errorToastr('Please select valid date!')
      return;
    }
    for (let item of Object.keys(this.ec)) {
      this.ec[item].markAsDirty()
    }
      if(this.currentUser?.role == 'SuperAdmin' || this.currentUser?.role == 'Community' ||
      this.currentUser?.role == 'Agency' || this.currentUser?.role == 'Community User'
      ){
        if (!this.editFormData.value.phone_number ||
          !this.editFormData.value.email ||
          !this.editFormData.value.first_name ||
          !this.editFormData.value.last_name) {
          return;
        }
      }else{
        if (!this.editFormData.value.phone_number ||
          !this.editFormData.value.email ||
          !this.editFormData.value.first_name ||
          !this.editFormData.value.last_name || !this.editFormData.value.management_co_user) {
          return;
        }
      }
  

    if (this.currentUser?.role == "SuperAdmin" || this.currentUser?.role == "Admin") {
      if (this.editFormData.value?.community_id?.length) {
        this.editFormData.value.community_id.forEach(element => {
          this.submitId.push(element.id)
        });
      } else if (this.editFormData.value?.agency_id?.length) {
        this.editFormData.value?.agency_id.forEach(element => {
          this.submitId2.push(element.id)
        });
      }
      if (this.editFormData.value.community_id?.length) {
        this.data2 = {
          phone_number: this.editFormData.value.phone_number?.replace(/\D/g, ''),
          email: this.editFormData.value.email,
          first_name: this.editFormData.value.first_name,
          last_name: this.editFormData.value.last_name,
          DOB: this.editFormData.value.DOB,
          // username: this.slctSrtNm +'-'+ this.editFormData.value.username.replace(' ','').trim(),
          // hourly_rate : parseFloat( this.formData?.value?.hourly_rate),
          // PIN_code: this.editFormData.value.PIN_code,
          management_Co: this.editFormData.value.management_Co ,
          management_co_user:  this.editFormData.value.management_co_user ,
          community_id: this.submitId,
        // isAdmin: this.editFormData.value.isAdmin ,

        }
      }
      else if (this.editFormData.value.agency_id?.length) {
        this.data3 = {
          phone_number: this.editFormData.value.phone_number?.replace(/\D/g, ''),
          email: this.editFormData.value.email,
          first_name: this.editFormData.value.first_name,
          last_name: this.editFormData.value.last_name,
          DOB: this.editFormData.value.DOB,
          PIN_code: this.editFormData.value.PIN_code,
          management_Co: this.editFormData.value.management_Co ,
          management_co_user:  this.editFormData.value.management_co_user ,
          // username: this.slctSrtNm +'-'+ this.editFormData.value.username.replace(' ','').trim(),
          agency_id: this.submitId2,
        // isAdmin: this.editFormData.value.isAdmin ,

        }
      }

    } else if (this.currentUser?.role == 'Agency') {
      this.data4 = {
        phone_number: this.editFormData.value.phone_number?.replace(/\D/g, ''),
        email: this.editFormData.value.email,
        first_name: this.editFormData.value.first_name,
        last_name: this.editFormData.value.last_name,
        DOB: this.editFormData.value.DOB,
        PIN_code: this.editFormData.value.PIN_code,
        management_Co: this.editFormData.value.management_Co ,
        // username: this.slctSrtNm +'-'+ this.editFormData.value.username.replace(' ','').trim(),
        management_co_user:  this.editFormData.value.management_co_user ,
        id: this.userEdit
      }
    } else if (this.currentUser?.role == 'Community' || this.currentUser?.role =='Community User') {
      this.data6 = {
        phone_number: this.editFormData.value.phone_number?.replace(/\D/g, ''),
        email: this.editFormData.value.email,
        first_name: this.editFormData.value.first_name,
        last_name: this.editFormData.value.last_name,
        DOB: this.editFormData.value.DOB,
        // username: this.slctSrtNm +'-'+ this.editFormData.value.username.replace(' ','').trim(),
        // hourly_rate : parseFloat( this.editFormData?.value?.hourly_rate),
        PIN_code: this.editFormData.value.PIN_code,
        management_Co: this.editFormData.value.management_Co ,
        // isAdmin: this.editFormData.value.isAdmin ,
        management_co_user:  this.editFormData.value.management_co_user ,
        id:this.userEdit,
        role : this.editFormData.value.isAdmin == 15 ? 'scheduler' : 'communityAdmin'
      }
    }
    this.btnShow = true;
    let is_for = this.currentUser?.role == 'Agency' ? 'agency' : this.currentUser?.role == 'Community' || this.currentUser?.role == 'Community User' ? 'agency' : 'superAdmin'
    this.dataService.editUser(this.currentUser?.role == 'SuperAdmin' || this.currentUser?.role == 'Admin' ? { ...this.editFormData.value.community_id?.length ? this.data2 : this.data3, ...{ id: this.userEdit } } : this.currentUser?.role == 'Community' || this.currentUser?.role == 'Community User' ? this.data6 : this.data4, is_for,this.currentUser?.role).subscribe((res: any) => {
      if (!res.error) {
        // this.currenUserId = ''
        // this.tost.successToastr(res.msg)
        setTimeout(() => {
          if(!this.forgotPassword.value.password.length){
             this.tost.successToastr(res.msg)
             this.loctn.back()
          }else{
            this.upadtePassword()
          }
          
        }, 200);
        this.btnShow = false;
      } else {
        this.btnShow = false;
        this.tost.errorToastr(res.msg)
      }
    },
      (err) => {
        this.btnShow = false;
        this.api.genericErrorToaster()
      })
  }

  get fp() {
    return this.forgotPassword.controls;
  }

  upadtePassword() {
    // for (let item of Object.keys(this.fp)) {
    //   this.fp[item].markAsDirty()
    // }
    // if (this.forgotPassword.invalid) {
    //   return;
    // }
    this._userService.updateUserPassword(this.forgotPassword.value).subscribe(response => {
      if (!response.error) {
        this.tost.successToastr(response.msg)
        this.forgotPassword.reset()
        this.loctn.back()

      }
      else{
        this.tost.errorToastr(response.msg)
        return
      }
    }
    );
    // this.loctn.back()
    
  }

  goBack(){
    this.loctn.back()
  }

  getagenciesID() {
    this.dataService.agenciesID().subscribe((response: any) => {
      if (response['error'] == false) {
        this.allAgenciesID = response.body.sort(function(a, b){
          if(a.agency_name.toUpperCase() < b.agency_name.toUpperCase()) { return -1; }
          if(a.agency_name.toUpperCase() > b.agency_name.toUpperCase()) { return 1; }
          return 0;
      })  ;
        //this.toastr.successToastr(response.msg);
      } else if (response['error'] == true) {
        this.tost.errorToastr(response.msg);
      }
    },
      (err) => {
        this.dataService.genericErrorToaster();
      })
  }

  getCommunityId() {
    this.dataService.getCommunityId().subscribe((response: any) => {
      if (response['error'] == false) {
        this.allCommunity = response.body.sort(function(a, b){
          if(a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
          if(a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
          return 0;
      })  ;
        //this.toastr.successToastr(response.msg);
      } else if (response['error'] == true) {
        this.tost.errorToastr(response.msg);
      }
    }, (err) => {
      this.dataService.genericErrorToaster();

    })
  }
 
  getCmmntNm(){
    this.dataService.getMNMGcommunity(this.currentUser?.id).subscribe((res: any) => {
      if (!res.error) {
        this.cmmntNames = res.body.sort(function(a, b){
          if(a.community_name < b.community_name) { return -1; }
          if(a.community_name > b.community_name) { return 1; }
          return 0;
      })  
        // this.rows2.forEach(element => {
        //   this.cmmntNames.push(element)
        // });
      }
    },
      (err) => {
        this.dataService.genericErrorToaster();
      })
  }

  mgnmntNames(){
         this.dataService.getManagementNames().subscribe(res => {
        if (!res.error) {
          this.mngmNames = res.body.sort(function(a, b){
            if(a.mg_name.toUpperCase() < b.mg_name.toUpperCase()) { return -1; }
            if(a.mg_name.toUpperCase() > b.mg_name.toUpperCase()) { return 1; }
            return 0;
        });
        
        } else {
          this.dataService.genericErrorToaster()
        }
      }, error => {
        this.dataService.genericErrorToaster(error)
      }
      )
  }

   EditUser(row: any) {
    this.getagenciesID()
    this.getCommunityId()
    this.mgnmntNames()
    this.getCmmntNm()
    this.userEdit = row?.id
    let is_for = 'user'
    this.userService.getUserById(row?.id, is_for).subscribe((res: any) => {
      this.currenUserId = res.body[0]?.linked_with;
      
      this.slctSrtNm = res.body[0].username
      if(res.body[0]?.linked_with?.length == 0){
      this.currenUserId = res?.body[0]
        this.mgArr= (this.mngmNames.filter(p=>p?.mg_name === this.currenUserId?.mg_name))
        this.editFormData.patchValue({
          DOB: this.currenUserId?.DOB,
          first_name: this.currenUserId?.first_name,
          // username: this.currenUserId?.username,
          last_name: this.currenUserId?.last_name,
          email: this.currenUserId?.email,
          // hourly_rate: this.currenUserId?.hourly_rate,
          phone_number: this.currenUserId?.phone_number,
          PIN_code: this.currenUserId?.PIN_code,
          management_Co: this.mgArr,
          management_co_user: this.currenUserId?.management_co_user,
          community_id: this.cmntArr,
          agency_id: this.agnArr,
        });
      }
      for(let i = 0; i < res.body[0].linked_with.length; i++){
        if(this.currentUser?.role == 'SuperAdmin'){
          let allAssigned = [];
          this.currenUserId.forEach(rate => {allAssigned.push(rate.community_name)});
          this.cmntArr = this.allCommunity.filter(item => allAssigned.includes(item.community_name));
          // this.cmntArr.push(this.allCommunity.filter(p=>p.community_name === this.currenUserId[i].community_name))
        }else{
          // this.cmntArr.push(this.cmmntNames.filter(p=>p.community_name === this.currenUserId[i].community_name))
          let allAssigned = [];
          this.currenUserId.forEach(rate => {allAssigned.push(rate.community_name)});
          this.cmntArr = this.cmmntNames.filter(item => allAssigned.includes(item.community_name));
        }
        this.agnArr= (this.allAgenciesID.filter(p=>p.agency_name === this.currenUserId[i].agency_name))
        this.mgArr= (this.mngmNames.filter(p=>p.mg_name === this.currenUserId[i].mg_name))

        setTimeout(() => {
          this.editFormData.get('phone_number').setValue(this.editFormData.value.phone_number)
        }, 100)
      }
      for(let i = 0; i < res.body.length; i++){
      if (!res.error) {
        this.editFormData.patchValue({
          DOB: res.body[i].DOB,
          first_name: res.body[i].first_name,
          last_name: res.body[i].last_name,
          email: res.body[i].email,
          // hourly_rate: res.body[i]?.hourly_rate,
          phone_number: res.body[i].phone_number,
          PIN_code: res.body[i].PIN_code,
          management_Co: this.mgArr,
          management_co_user: res.body[i].management_co_user,
          community_id: this.cmntArr,
          agency_id: this.agnArr,
          isAdmin: res.body[i]?.isAdmin,

        });
      }}
    },
      (err) => {
        this.dataService.genericErrorToaster()
      })
  }

  getRoles(){
    this.dataService.getAllRole().subscribe((res:any)=>{
      if(!res.err){
        this.admRoles = res.body.sort(function(a, b){
          if(a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
          if(a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
          return 0;
      });
        this.comRoles = res.body.filter(i=>{
             if(i.disable == 0)
             return i
        });
      }else{
      this.tost.errorToastr('Something went wrong please try again leter')
      }
    },err=>{
      this.dataService.genericErrorToaster()
    })
}

onItemSelect(e){
this.allCommunity.filter(i=>{
    if(e  == i.id){
      this.slctSrtNm =   i.sort_name
    }
  })
    
}
ngOnDestroy(): void{
  this.currentUser?.user_role == 5  ? this.currentUser.role = 'User' : ''
}

}
