import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmedValidator } from 'app/auth/helpers/mustMacth';
import { Patterns } from 'app/auth/helpers/patterns';
import { AuthenticationService } from 'app/auth/service';
import { ApiService } from 'app/auth/service/api.service';
import { DataService } from 'app/auth/service/data.service';
import { Page } from 'app/utils/models';
import { StaticServiceService } from 'app/utils/static-service.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
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

  public isDropdownDisabled = false;

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
    singleSelection: true,
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
    singleSelection: false,
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
  comId: any;
  comConf: boolean;

  
  
  constructor(
    private fb: FormBuilder,
    private _authenticationService: AuthenticationService,
    private tost: ToastrManager,
    private dataService: DataService,
    private api: ApiService,
    private loctn : Location,
    private phoneService : StaticServiceService
  ) { 
    this.phoneUsd = this.phoneService.phoneUsdCode
    this._authenticationService.currentUser.subscribe((x: any) => {
      this.currentUser = x
      this.crrntUsrId.push(this.currentUser?.role == 'Admin' ?  x?._id : x?.id)
    });
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
    this.formData = this.fb.group({
      DOB: [''],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required, Validators.pattern(Patterns.number)]],
      addUsrRl: this.currentUser.role != 'Admin' ?  ['', Validators.required] : [''],
      community_id: [''],
      agency_id: [''],
      hourly_rate: [''],
      management_Co: [''],
      management_co_user: ['',Validators.required],
      password: ['',Validators.compose([Validators.required, Validators.pattern(Patterns.password)])],
      cnfrmpassword:  ['', [Validators.required]]
    }, { 
      validator: ConfirmedValidator('password', 'cnfrmpassword')
    },
    )
    if(this.currentUser.role != 'Admin')
    {
     this.formData.controls['management_co_user'].clearValidators();
    //  this.formData.controls['community_id'].clearValidators();
     this.formData.controls['hourly_rate'].clearValidators();
     this.formData.updateValueAndValidity();
    }
    if(this.currentUser.role == 'Admin')
    {
     this.formData.controls['management_co_user'].setValidators(Validators.required);
    //  this.formData.controls['community_id'].setValidators(Validators.required);
     this.formData.controls['hourly_rate'].setValidators(Validators.required);
     this.formData.updateValueAndValidity();
    //  this.manaDetls()
    }

    // if(this.currentUser.role == 'Agency')
    // {
    //  this.formData.controls['DOB'].clearValidators();
    // this.formData.updateValueAndValidity();
    // }
    // if(this.currentUser.role != 'Agency')
    // {
    //  this.formData.controls['DOB'].setValidators(Validators.required);
    //  this.formData.updateValueAndValidity();
    // }
    // if(this.currentUser.role == 'Agency')
    // {
    //  this.formData.controls['DOB'].clearValidators();
    //  this.formData.updateValueAndValidity();
    // }
    // if(this.currentUser.role != 'Agency')
    // {
    //  this.formData.controls['DOB'].setValidators(Validators.required);
    //  this.formData.updateValueAndValidity();
    // }


    this.contentHeader = {
      headerTitle: this.currentUser.role == 'Agency' ? 'Agency Personnel' : 'Add User',
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
            name: this.currentUser.role == 'Agency' ? 'Agency Personnel' : 'User',
            isLink: true,
            link: '/user'
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
  
  submitted() {
    for (let item of Object.keys(this.controls)) {
      this.controls[item].markAsDirty()
    }
    if (this.formData.invalid) {
      return;
    }
    if ( this.controls.cnfrmpassword.status == "INVALID") {
      return;
    }

    if (this.currentUser.role == "SuperAdmin") {
      if (this.formData.value.community_id) {
        this.formData.value.community_id?.forEach(element => {
          this.submitId.push(this.currentUser.role == 'Admin' ? element.cp_id : element.id )
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
            isAdmin: this.currentUser.prmsnId,
            role_assign: this.formData.value.addUsrRl,
            username: this.slctSrtNm +'-'+ this.formData.value.username,
            hourly_rate: parseFloat( this.formData.value.hourly_rate),
            community_id: this.formData.value.community_id ? this.submitId : '',
            password: this.formData.value.password,
            management_Co: this.formData.value.management_Co ,
            management_co_user:  this.formData.value.management_co_user ,
            management_id : this.currentUser.id,
            country_code:this.selectedDataValue? this.selectedDataValue : ''
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
            isAdmin:this.currentUser.prmsnId,
            role_assign: this.formData.value.addUsrRl,
            username: this.slctSrtNm +'-'+ this.formData.value.username,
            // PIN_code: this.formData.value.PIN_code,
            hourly_rate: parseFloat( this.formData.value.hourly_rate),
            community_id: this.formData.value.community_id ? this.submitId : '',
            password: this.formData.value.password,
            management_Co: this.formData.value.management_Co ,
            management_co_user:  this.formData.value.management_co_user ,
            management_id : '',
            country_code:this.selectedDataValue? this.selectedDataValue : ''
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
         isAdmin: this.currentUser.prmsnId,
         role_assign: this.formData.value.addUsrRl,
          // PIN_code: this.formData.value.PIN_code,
          management_Co: this.formData.value.management_Co ,
          management_co_user:  this.formData.value.management_co_user ,
          agency_id: this.formData.value.agency_id ? this.submitId2 : '',
          password: this.formData.value.password,
        username: this.slctSrtNm +'-'+ this.formData.value.username,
          // isAdmin : '5',
          country_code:this.selectedDataValue? this.selectedDataValue : ''
        }
      }
    }
    else if (this.currentUser.role == 'Agency') {
      this.data4 = {
        phone_number: this.formData.value.phone_number?.replace(/\D/g, ''),
        email: this.formData.value.email,
        first_name: this.formData.value.first_name,
        last_name: this.formData.value.last_name,
        DOB: this.formData.value.DOB,
        username: this.slctSrtNm +'-'+ this.formData.value.username,
        // PIN_code: this.formData.value.PIN_code,
        management_Co: this.formData.value.management_Co ,
        management_co_user:  this.formData.value.management_co_user ,
        password: this.formData.value.password,
        agency_id: this.crrntUsrId,
        role_assign: this.formData.value.addUsrRl,
        isAdmin : '5',
        country_code:this.selectedDataValue? this.selectedDataValue : ''
      }
    } else if (this.currentUser.role == 'Community' || this.currentUser.role == 'Community User') {
      this.data5 = {
        phone_number: this.formData.value.phone_number?.replace(/\D/g, ''),
        email: this.formData.value.email,
        first_name: this.formData.value.first_name,
        last_name: this.formData.value.last_name,
        DOB: this.formData.value.DOB,
        username: this.slctSrtNm +'-'+ this.formData.value.username,
        hourly_rate : parseFloat( this.formData.value.hourly_rate),
        password: this.formData.value.password,
        management_co_user:  this.formData.value.management_co_user ,
        community_id: [this.currentUser.id],
        country_code:this.selectedDataValue? this.selectedDataValue : '',
        isAdmin: '4',
        role_assign: this.formData.value.addUsrRl,

      }
    }
    else if (this.currentUser.role == 'Admin') {
      if (this.formData.value.community_id) {
        this.formData.value.community_id?.forEach(element => {
          this.submitId.push( element.cp_id )
        }); 
      }
      this.data5 = {
        phone_number: this.formData.value.phone_number?.replace(/\D/g, ''),
        email: this.formData.value.email,
        first_name: this.formData.value.first_name,
        last_name: this.formData.value.last_name,
        DOB: this.formData.value.DOB,
        username: this.slctSrtNm +'-'+ this.formData.value.username,
        community_id: this.submitId,
        hourly_rate : parseFloat( this.formData.value.hourly_rate),
        password: this.formData.value.password,
        management_co_user:  this.formData.value.management_co_user ,
        country_code:this.selectedDataValue? this.selectedDataValue : '',
        management_id : this.currentUser.id
      }
    }
    this.btnShow = true;

    let body = this.currentUser.role == "SuperAdmin" ? this.formData.value.community_id ? this.data : this.data1 : this.currentUser.role == "Community" || this.currentUser.role == 'Community User' ? this.data5 : this.currentUser.role == "Admin" ? this.data5 : this.data4
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
      if(this.currentUser.prmsnId == '1'){
        this.onItemSelect(this.currentUser.com_id || this.currentUser.id,1)
      }else if(this.currentUser.prmsnId == '2'){
        this.onItemSelect( this.currentUser.id,1)
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
      if(this.currentUser.id && this.currentUser.com_id){
        let data = {
          userId : this.currentUser.id,
          mangId : this.currentUser.com_id
        }
        this.dataService.getManagementUserCommunities(data).subscribe((res: any) => {
          if (!res.error) {
            // this.mangComs = res.body[1].userAvailableCommunities
            this.cmmntNames = res.body[0].user_added_communities.sort(function(a, b){
              if(a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
              if(a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
              return 0;
          })  ;
          } else {
            this.tost.errorToastr(res.msg);
          }
        },
          (err) => {
            this.dataService.genericErrorToaster();
          })
      }
      else{
        this.dataService.getMNMGcommunity(this.currentUser.id).subscribe((response: any) => {
          if (response['error'] == false) {
            this.cmmntNames = response.body.sort(function(a, b){
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
    if(this.currentUser.role == 'SuperAdmin'){
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

      // someMethod() {
      //   this.isDropdownDisabled = true;
      // }

      getRoles(){
        // let comunity_id=this.currentUser.id
    let id =this.currentUser.prmsnId
        let data = {
          prms : (id == '1' || this.comConf) ? 'community_id' : (id == '2' || !this.comConf) ? 'agency_id' : 'null',
           id : this.comId || this.currentUser.id
        }
        this.dataService.getRole(data).subscribe((res:any)=>{
          if(!res.error){
            this.data1 = res.body.sort(function(a, b){
              if(a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
              if(a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
              return 0;
          });;
          
            // if(this.currentUser.prmsnId =='2'){
            //   this.data1 = this.data1.filter(i=>{
            //     if(i.name == 'Agency User'){
            //       return i
            //     }
            //   })
            //   this.formData.patchValue({
            //     addUsrRl: this.data1
            //   })
            //   this.someMethod()
            // }
          }else{
          this.tost.errorToastr('Something went wrong please try again later')
          }
        },err=>{
          this.dataService.genericErrorToaster()
        })
    }

    onItemSelect(e,no){
      this.comId = e
      if(no ==1){
        if(this.currentUser.user_role == 3){
          this.cmmntNames.filter(i=>{
            if(e == i.cp_id){
              this.slctSrtNm =   i.community_short_name
              this.comConf = false
            }
          })
        }
        else if(this.currentUser.user_role == 2){
          this.dataService.getAgenciesByID(this.currentUser.id).subscribe((res: any) => {
            this.slctSrtNm =  res.body[0].sort_name
            this.comConf = false
        })
        }
        else{
          this.allCommunity.filter(i=>{
               if(e == i.id){
              this.comConf = true
                 this.slctSrtNm =   i.sort_name
               }
             })
        }
      }else{
        this.dataService.getAgenciesByID(e).subscribe((res: any) => {
          this.slctSrtNm =  res.body[0]?.sort_name
      })
      this.comConf = false
      }
  
      this.getRoles()
    }

    // manaDetls(){
    //   this.dataService.getManagementById(this.currentUser.id).subscribe((res: any) => {
    //    console.log(res);
    //       this.slctSrtNm = res.body[0].short_name
    //   })
    // }
  
}
