import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfirmedValidator } from 'app/auth/helpers/mustMacth';
import { Patterns } from 'app/auth/helpers/patterns';
import { AuthenticationService, UserService } from 'app/auth/service';
import { ApiService } from 'app/auth/service/api.service';
import { DataService } from 'app/auth/service/data.service';
import { Page } from 'app/utils/models';
import { StaticServiceService } from 'app/utils/static-service.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-add-management-user',
  templateUrl: './add-management-user.component.html',
  styleUrls: ['./add-management-user.component.scss']
})
export class AddManagementUserComponent implements OnInit {
  formData!: FormGroup;
  currentUser: any;
  crrntUsrId: any[] = []
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
  public contentHeader: object;
  allCommunity: any = [];
  searchStr: string = '';
  public page = new Page();
  rows2: any = []
  cmmntNames: any= [];
  allAgenciesID: any = [];
  rows1: any = []
  mngmNames: any= [];
  passwordTextType2: boolean = false;
  passwordTextType1: boolean = false;
  @ViewChild('searchStrInput', { static: true }) searchStrInput: ElementRef;

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

  dropdownSettings4: IDropdownSettings = {
    singleSelection: true,
    idField: 'cp_id',
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
    maxHeight:250
  };

  CmntdropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    closeDropDownOnSelection: true,
    itemsShowLimit: 3,
    allowSearchFilter: true,
    maxHeight:250
  };
  phoneUsd: { name: string; flag: string; code: string; dial_code: string; }[];
  selectedDataValue  = "+1";
  slctSrtNm: any;
  prmsUsrId: any;
  currenUserId: any;
  mgArr: any;
  cmntArr: any;
  agnArr: any;
  userName: any;
  dataRoles: any[];
  currentRout: string;

  constructor(
    private fb: FormBuilder,
    private _authenticationService: AuthenticationService,
    private tost: ToastrManager,
    private dataService: DataService,
    private api: ApiService,
    private loctn : Location,
    private phoneService : StaticServiceService,
    private aCtRoute : ActivatedRoute,
    private userService : UserService
  ) { 
    this.phoneUsd = this.phoneService.phoneUsdCode
    this._authenticationService.currentUser.subscribe((x: any) => {
      this.currentUser = x
      this.crrntUsrId.push(this.currentUser?.role == 'Admin' ?  x?._id : x?.id)
    });
    this.currentRout = window.location.href;
    this.aCtRoute.params.subscribe(
      res => {
        if (res.id) {
          this.prmsUsrId = res;
          this.EditUser(this.prmsUsrId)
        }
      }
    )
  }
  mapCountry_selected(data){
    return this.selectedDataValue = data.dial_code;
  }

 ngOnInit(): void {
    this.getDate()
    this.getCommunityId()
    this.getCmmntNm()
    this.getagenciesID()
    this.getManagementNames()
    this.getRoles()
    let validtr = (this.currentUser?.role != 'Admin' || this.currentUser?.user_role ==3) ? [Validators.required] : ['']
    this.formData = this.fb.group({
      DOB: [''],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required, Validators.pattern(Patterns.number)]],
      addUsrRl: ['', validtr],
      community_id: [''],
      agency_id: [''],
      // hourly_rate: ['',Validators.required],
      management_Co: [''],
      // management_co_user: ['',Validators.required],
      password: ['',Validators.compose([Validators.required, Validators.pattern(Patterns.password)])],
      cnfrmpassword:  ['', [Validators.required]]
    }, { 
      validator: ConfirmedValidator('password', 'cnfrmpassword')
    },
    )
    if(this.currentUser?.role != 'Admin')
    {
    //  this.formData.controls['management_co_user'].clearValidators();
    //  this.formData.controls['community_id'].clearValidators();
    //  this.formData.controls['hourly_rate'].clearValidators();
     this.formData.updateValueAndValidity();
    }
    if(this.currentUser?.role == 'Admin')
    {
    //  this.formData.controls['management_co_user'].setValidators(Validators.required);
    //  this.formData.controls['community_id'].setValidators(Validators.required);
    //  this.formData.controls['hourly_rate'].setValidators(Validators.required);
     this.formData.updateValueAndValidity();
     this.manaDetls()
    }

    // if(this.currentUser?.role == 'Agency')
    // {
    //  this.formData.controls['DOB'].clearValidators();
    // this.formData.updateValueAndValidity();
    // }
    // if(this.currentUser?.role != 'Agency')
    // {
    //  this.formData.controls['DOB'].setValidators(Validators.required);
    //  this.formData.updateValueAndValidity();
    // }
    // if(this.currentUser?.role == 'Agency')
    // {
    //  this.formData.controls['DOB'].clearValidators();
    //  this.formData.updateValueAndValidity();
    // }
    // if(this.currentUser?.role != 'Agency')
    // {
    //  this.formData.controls['DOB'].setValidators(Validators.required);
    //  this.formData.updateValueAndValidity();
    // }


    this.contentHeader = {
      headerTitle: this.prmsUsrId?.id ? 'Edit Management User' : 'Add Management User',
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
            name: 'Management User',
            isLink: true,
            link: '/management-user'
          }
        ]
      }
    };
  }


  uncheckDropdown1() {
    if (this.formData.value.community_id) {
      this.formData.get('agency_id').reset()
    }
  }
  multiuncheckDropdown1() {
    this.formData.get('agency_id').reset()
  }
  uncheckDropdown2() {
    if (this.formData.value.agency_id) {
      this.formData.get('community_id').reset()
    }
  }
  multiuncheckDropdown2() {
    this.formData.get('community_id').reset()
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

get controls() {
    return this.formData.controls;
  }
  dateErrorFxn(){
    let date = new Date();
    let inputDate = new Date(this.formData.value.DOB)
    return date < inputDate ? true : false;
}
  
  submitted() { 
    if(this.dateErrorFxn()){
      this.tost.errorToastr('Please select valid date!')
      return;
    }
    for (let item of Object.keys(this.controls)) {
      this.controls[item].markAsDirty()
    }
    if (this.formData.invalid) {
      return;
    }
    if ( this.controls.cnfrmpassword.status == "INVALID") {
      return;
    }

    if (this.currentUser?.role == "SuperAdmin") {
      if (this.formData.value.community_id) {
        this.formData.value.community_id?.forEach(element => {
          this.submitId.push(this.currentUser?.role == 'Admin' ? element.cp_id : element.id )
        }); 
      } else {
        this.formData.value.agency_id?.forEach(element => {
          this.submitId2.push(element.id)
        });
      }

      if (this.formData.value.community_id) {
        if(this.formData.value.management_co_user == '0'){
          // let ids:any[] = [];
          // this.formData.value.addUsrRl.map(i=>{
          //   if(i.id){
          //     ids.push(i.id)
          //   }
          // })
          this.data = {
            phone_number: this.formData.value.phone_number?.replace(/\D/g, ''),
            email: this.formData.value.email,
            first_name: this.formData.value.first_name,
            last_name: this.formData.value.last_name,
            DOB: this.formData.value.DOB,
            isAdmin: this.formData.value.addUsrRl[0].id,
            username: this.slctSrtNm +'-'+ this.formData.value.username.replace(' ','').trim(),
            // hourly_rate: parseFloat( this.formData.value.hourly_rate),
            community_id: this.formData.value.community_id ? this.submitId : '',
            password: this.formData.value.password,
            management_Co: this.formData.value.management_Co ,
            // management_co_user:  this.formData.value.management_co_user ,
            management_id : this.currentUser?.id,
            country_code:this.selectedDataValue? this.selectedDataValue : '',
          }
        }else{
          // let ids:any[] = [];
          // this.formData.value.addUsrRl.map(i=>{
          //   if(i.id){
          //     ids.push(i.id)
          //   }
          // })
          this.data = {
            phone_number: this.formData.value.phone_number?.replace(/\D/g, ''),
            email: this.formData.value.email,
            first_name: this.formData.value.first_name,
            last_name: this.formData.value.last_name,
            DOB: this.formData.value.DOB,
            // isAdmin: this.formData.value.addUsrRl[0].id,
            username: this.slctSrtNm +'-'+ this.formData.value.username.replace(' ','').trim(),
            // PIN_code: this.formData.value.PIN_code,
            // hourly_rate: parseFloat( this.formData.value.hourly_rate),
            // community_id: this.formData.value.community_id ? this.submitId : '',
            password: this.formData.value.password,
            management_Co: this.formData.value.management_Co ,
            // management_co_user:  this.formData.value.management_co_user ,
            management_id : '',
            country_code:this.selectedDataValue? this.selectedDataValue : '', 
        isAdmin : '8',
        roles_assign: this.formData.value.addUsrRl??'',
          }
        }
      
      }
      else if (this.formData.value.agency_id) {
        // let ids:any[] = [];
        // this.formData.value.addUsrRl.map(i=>{
        //   if(i.id){
        //     ids.push(i.id)
        //   }
        // })
        this.data1 = {
          phone_number: this.formData.value.phone_number?.replace(/\D/g, ''),
          email: this.formData.value.email,
          first_name: this.formData.value.first_name,
          last_name: this.formData.value.last_name,
          DOB: this.formData.value.DOB,         
         isAdmin: this.formData.value.addUsrRl[0].id,
          // PIN_code: this.formData.value.PIN_code,
          management_Co: this.formData.value.management_Co ,
          // management_co_user:  this.formData.value.management_co_user ,
          agency_id: this.formData.value.agency_id ? this.submitId2 : '',
          password: this.formData.value.password,
        username: this.slctSrtNm +'-'+ this.formData.value.username.replace(' ','').trim(),
          // isAdmin : '5',
          country_code:this.selectedDataValue? this.selectedDataValue : ''
        }
      }
    }
    else if (this.currentUser?.role == 'Agency') {
      this.data4 = {
        phone_number: this.formData.value.phone_number?.replace(/\D/g, ''),
        email: this.formData.value.email,
        first_name: this.formData.value.first_name,
        last_name: this.formData.value.last_name,
        DOB: this.formData.value.DOB,
        // PIN_code: this.formData.value.PIN_code,
        management_Co: this.formData.value.management_Co ,
        // management_co_user:  this.formData.value.management_co_user ,
        password: this.formData.value.password,
        agency_id: this.crrntUsrId,
        isAdmin : '5',
        country_code:this.selectedDataValue? this.selectedDataValue : ''
      }
    } else if (this.currentUser?.role == 'Community') {
      this.data5 = {
        phone_number: this.formData.value.phone_number?.replace(/\D/g, ''),
        email: this.formData.value.email,
        first_name: this.formData.value.first_name,
        last_name: this.formData.value.last_name,
        DOB: this.formData.value.DOB,
        username: this.slctSrtNm +'-'+ this.formData.value.username.replace(' ','').trim(),
        // hourly_rate : parseFloat( this.formData.value.hourly_rate),
        password: this.formData.value.password,
        // management_co_user:  this.formData.value.management_co_user ,
        community_id: [this.currentUser?.id],
        country_code:this.selectedDataValue? this.selectedDataValue : '',
        roles_assign: this.formData.value.addUsrRl,

      }
    }
    else if (this.currentUser?.role == 'Admin') {

      this.data5 = {
        phone_number: this.formData.value.phone_number?.replace(/\D/g, ''),
        email: this.formData.value.email,
        first_name: this.formData.value.first_name,
        last_name: this.formData.value.last_name,
        DOB: this.formData.value.DOB,
        username: this.slctSrtNm +'-'+ this.formData.value.username.replace(' ','').trim(),
        // community_id:this.formData.value.community_id.map(i=>i.cp_id),
        // hourly_rate : parseFloat( this.formData.value.hourly_rate),
        password: this.formData.value.password,
        // management_co_user:  this.formData.value.management_co_user ,
        country_code:this.selectedDataValue? this.selectedDataValue : '',
        management_id : this.currentUser?.id,
        isAdmin : '8',
        roles_assign: this.formData.value.addUsrRl??'',
      }
      if(!this.currentRout.includes('add-managementUser')) this.data5.community_id = this.formData.value.community_id.map(i=>i.cp_id)
    }
    this.btnShow = true;

    let body = this.currentUser?.role == "SuperAdmin" ? this.formData.value.community_id ? this.data : this.data1 : this.currentUser?.role == "Community" ? this.data5 : this.currentUser?.role == "Admin" ? this.data5 : this.data4
    this.dataService.addUser(body).subscribe((res: any) => {
      if (!res.error) {
        this.tost.successToastr(res.msg)
        this.submitId = []
        this.submitId2 = []
        this.btnShow = false;
        this.loctn.back()
      } else {
        this.btnShow = false;
        this.submitId = []
        this.submitId2 = []
        this.tost.errorToastr(res.msg)
      }
    },
      (err) => {
        this.btnShow = false;
        this.submitId = []
        this.submitId2 = []
        this.api.genericErrorToaster()

      })
  }
  findInvalidControls() {
    const invalid = [];
    const controls = this.formData.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            invalid.push(name);
        }
    }
    return invalid;
}

  EditUser(row: any) {
    this.getagenciesID()
    this.getCommunityId()
    this.getManagementNames()
    this.getCmmntNm()
    this.userEdit = row?.id
    let is_for = 'user'
    this.userService.getUserById(row?.id, is_for).subscribe((res: any) => {
      this.currenUserId = res.body[0]?.linked_with
      this.userName = res.body[0].username
      if(res.body[0]?.linked_with?.length == 0){
      this.currenUserId = res?.body[0]
        this.mgArr= (this.mngmNames.filter(p=>p?.mg_name === this.currenUserId?.mg_name))
        this.formData.patchValue({
          DOB: this.currenUserId?.DOB,
          first_name: this.currenUserId?.first_name,
          username: this.currenUserId?.username,
          last_name: this.currenUserId?.last_name,
          email: this.currenUserId?.email,
          // hourly_rate: this.currenUserId?.hourly_rate,
          phone_number: this.currenUserId?.phone_number,
          PIN_code: this.currenUserId?.PIN_code,
          management_Co: this.mgArr,
          // management_co_user: this.currenUserId?.management_co_user,
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
          this.formData.get('phone_number').setValue(this.formData.value.phone_number)
        }, 100)
      }
      for(let i = 0; i < res.body.length; i++){
      if (!res.error) {
        this.formData.patchValue({
          DOB: res.body[i].DOB,
          first_name: res.body[i].first_name,
          last_name: res.body[i].last_name,
          email: res.body[i].email,
          // hourly_rate: res.body[i]?.hourly_rate,
          phone_number: res.body[i].phone_number,
          PIN_code: res.body[i].PIN_code,
          management_Co: this.mgArr,
          // management_co_user: res.body[i].management_co_user,
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

  goBack(){
    this.loctn.back()
  }

  getCommunityId() {
    this.dataService.getCommunityId().subscribe((response: any) => {
      if (response['error'] == false) {
        this.allCommunity = response.body.sort(function(a, b){
          if(a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
          if(a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
          return 0;
      });
      if(this.currentUser?.prmsnId == '1'){
        this.onItemSelect(this.currentUser?.id)
      }
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

  getagenciesID() {
    this.dataService.agenciesID().subscribe((response: any) => {
      if (response['error'] == false) {
        this.allAgenciesID = response.body.sort(function(a, b){
          if(a.agency_name.toUpperCase() < b.agency_name.toUpperCase()) { return -1; }
          if(a.agency_name.toUpperCase() > b.agency_name.toUpperCase()) { return 1; }
          return 0;
      });
        //this.toastr.successToastr(response.msg);
      } else if (response['error'] == true) {
        this.tost.errorToastr(response.msg);
      }
    },
      (err) => {
        this.dataService.genericErrorToaster();
      })
  }

  getManagementNames(){
    if(this.currentUser?.role == 'SuperAdmin'){
      this.dataService.getManagementNames().subscribe(res => {
        if (!res.error) {
          this.mngmNames = res.body.sort(function(a, b){
            if(a.mg_name.toUpperCase() < b.mg_name.toUpperCase()) { return -1; }
            if(a.mg_name.toUpperCase() > b.mg_name.toUpperCase()) { return 1; }
            return 0;
        });
          // this.rows1.forEach(element => {
          //   this.mngmNames.push(element)
          // });
          // console.log('Management Names',this.mngmNames)
        }})}
      }
     
      getRoles(){
        // let comunity_id=this.currentUser?.id
        let data = {
          prms : (this.currentUser?.prmsnId == '1') ? 'community_id' :this.currentUser?.user_role == 3 ? 'management_id': this.currentUser?.prmsnId == '2' ? 'agency_id' : 'agency_id',
           id : this.currentUser?.prmsnId == '6' ? null : this.currentUser?.id
        }
        
        this.dataService.getRole(this.currentUser?.user_role == 6 ? '': data).subscribe((res:any)=>{
          if(!res.error){
            this.dataRoles = res.body.sort(function(a, b){
              if(a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
              if(a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
              return 0;
          });;
          }else{
          this.tost.errorToastr('Something went wrong please try again later')
          }
        },err=>{
          this.dataService.genericErrorToaster()
        })
    }

    onItemSelect(e){
   this.allCommunity.filter(i=>{
        if(e == i.id){
          this.slctSrtNm =   i.sort_name
        }
      })
    }

    manaDetls(){
      this.dataService.getManagementById(this.currentUser?.id).subscribe((res: any) => {
      this.slctSrtNm = res.body[0].short_name
      })
    }
}
