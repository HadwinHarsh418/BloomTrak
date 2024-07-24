import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmedValidator } from 'app/auth/helpers/mustMacth';
import { Patterns } from 'app/auth/helpers/patterns';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import StatesJson from 'assets/states.json';
import { StaticServiceService } from 'app/utils/static-service.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-add-agency',
  templateUrl: './add-agency.component.html',
  styleUrls: ['./add-agency.component.scss']
})
export class AddAgencyComponent implements OnInit {
  States:any = StatesJson;
  formData!: FormGroup;
  btnShow: boolean = false;
  passwordTextType2: boolean = false;
  passwordTextType1: boolean = false;
  searchSub: any = null;
  loadingList: boolean;
  currentUser: any;
  submitId2: any =[]
  searchStr: string = '';
  public rows = [];
  tempCmntyId: any;
  tempAddId: any;
  state:any;
  slctSrtNm: any;
  cmmntNames: any= [];


  public contentHeader: object;
  phoneUsd: { name: string; flag: string; code: string; dial_code: string; }[];
  selectedDataValue: any;
  allCommunity: any=[];
  usrExst: boolean;
  slctSrtNm1: any;
  constructor(
    private dataService: DataService,
    private toastr: ToastrManager,
    private fb: FormBuilder,
    private _authenticationService: AuthenticationService,
    private loctn : Location,
    private phoneService : StaticServiceService
  ) {
    this._authenticationService.currentUser.subscribe((x: any) => {
      this.currentUser = x
    });
    this.phoneUsd = this.phoneService.phoneUsdCode
   
   }
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

  ngOnInit(): void {
    this.state = this.States
    this.getCommunityId()
    this.formData = this.fb.group({
      agency_name: ['', [Validators.required]],
      agency_phone: ['', [Validators.required, Validators.pattern(Patterns.number)]],
      agency_email: ['', [ Validators.email]],
      password: ['', [ Validators.pattern(Patterns.password)]],
      agency_website: ['',[ Validators.required]],
      state: ['',[ Validators.required]],
      username: ['',[ Validators.required]],
      agency_type:['',Validators.required],
      sort_name: ['', [Validators.required, Validators.pattern(Patterns.sort_name)]],
      // hourly_rate: ['',[ Validators.required]],
      address1: ['',[ Validators.required]],
      show_shift_user: ['1',[ Validators.required]],
      address2: [''],
      approval: [''],
      city: ['',[ Validators.required]],
      zipcode: ['',[ Validators.required]],
      agency_contact_firstname: ['',[ Validators.required]],
      community_id: ['',[ Validators.required]],
      agency_contact_lastname: ['',[ Validators.required]],
      agency_contact_person_title: ['',[ Validators.required]],
      agency_contact_cell_number: ['', [Validators.required, Validators.pattern(Patterns.number)]],
      agency_contact_email_address: ['', [Validators.required, Validators.email]],
      cnfrmpassword:  ['']
    }, { 
      validator: ConfirmedValidator('password', 'cnfrmpassword')
    },
    )

    this.contentHeader = {
      headerTitle: 'Add Agency ',
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
            name: 'Agency ',
            isLink: true,
            link: '/agency'
          }
        ]
      }
    };

    if(this.currentUser?.role != 'Admin' && this.currentUser?.user_role != 8) 
    {
     this.formData.controls['community_id'].clearValidators();
     this.formData.controls['approval'].clearValidators();
     this.formData.updateValueAndValidity();
    }
    if(this.currentUser?.role == 'Admin' || this.currentUser?.user_role == 8)
    {
     this.formData.controls['community_id'].setValidators(Validators.required);
    //  this.formData.controls['approval'].setValidators(Validators.required);
     this.formData.updateValueAndValidity();
    }

  }
  mapCountry_selected(data){
    return this.selectedDataValue = data.dial_code;
  }
  get controls() {
    return this.formData.controls;
  }

  submitted( ) {
    for (let item of Object.keys(this.controls)) {
      this.controls[item].markAsDirty()
    }
    if (this.formData.invalid || this.usrExst) {
      this.toastr.errorToastr('Form Invalid')
      return;
    }
      //let data = { ...this.formData.value, ...{ community_id: this.tempAddId } }
      if(this.currentUser?.role == 'SuperAdmin'){
        this.formData.value.community_id?.forEach(element => {
          this.submitId2.push(element.id)
        });
      }
      this.btnShow = true;
      if(this.currentUser?.role == 'SuperAdmin'){
        this.formData.value.community_id?.forEach(element => {
          this.submitId2.push(element.id)
        });
      }
    
      let body1 = {
        agency_name: this.formData.value.agency_name,
        password: this.formData.value.password,
        agency_website: this.formData.value.agency_website,
        agency_phone: this.formData.value.agency_phone.replace(/\D/g, ''),
        agency_email: this.formData.value.agency_email,
        address1: this.formData.value.address1,
        address2: this.formData.value.address2,
        city: this.formData.value.city,
        username: this.formData.value.username.replace(' ','').trim(),
        agency_type: this.formData.value.agency_type,
        sort_name: this.formData.value.sort_name,
        // hourly_rate: parseFloat(this.formData.value.hourly_rate),
        show_shift_user: this.formData.value.show_shift_user,
        state: this.formData.value.state,
        zipcode: this.formData.value.zipcode,
        agency_contact_firstname: this.formData.value.agency_contact_firstname,
        agency_contact_lastname: this.formData.value.agency_contact_lastname,
        agency_contact_person_title: this.formData.value.agency_contact_person_title,
        agency_contact_cell_number: this.formData.value.agency_contact_cell_number.replace(/\D/g, ''),
        agency_contact_email_address: this.formData.value.agency_contact_email_address,
        community_id: this.currentUser?.role == 'Community' ? [this.currentUser?.id] : this.currentUser?.user_role == 3  ? this.formData.value.community_id.map(i=>i.cp_id) : this.currentUser?.user_role == 8 ? this.formData.value.community_id.map(i=>i.community_id) : this.submitId2,
        country_code:this.selectedDataValue? this.selectedDataValue : '',
        approval : this.currentUser?.role == 'SuperAdmin' ? '1' : '0'
      }
      this.btnShow = true;
      this.dataService.addAgency(body1).subscribe((res: any) => {
        if (!res.error) {
          this.toastr.successToastr(res.msg);
          this.tempAddId = res.body[0]
          this.loctn.back()
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

  goBack(){
    this.loctn.back()
  }

  getCommunityId() {
    if(this.currentUser?.prmsnId == '6'){
    this.dataService.getCommunityId().subscribe((response: any) => {
      if (response['error'] == false) {
        this.allCommunity = response.body.sort(function(a, b){
          if(a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
          if(a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
          return 0;
      });
        //this.toastr.successToastr(response.msg);
      } else if (response['error'] == true) {
        this.toastr.errorToastr(response.msg);
      }
    }, (err) => {
      this.dataService.genericErrorToaster();

    })
  }
  else if(this.currentUser?.prmsnId == '1'){
    this.dataService.getcommunityById(this.currentUser?.id).subscribe((res: any) => {
        this.slctSrtNm = res.body[0]?.sort_name
    })
  }
  else{
    this.getCmmntNm()
  }
  }

  getCmmntNm(){
    if(this.currentUser?.id && this.currentUser?.com_id){
      let data = {
        userId : this.currentUser?.id,
        mangId : this.currentUser?.com_id
      }
      this.dataService.getManagementUserCommunities(data).subscribe((res: any) => {
        if (!res.error) {
          let d = res?.body[0].user_added_communities.concat(res?.body[1].userAvailableCommunities);
          // this.mangComs = res.body[1].userAvailableCommunities
          let e=[]
          let c =[]
          d.forEach(element => {
            if(!e.includes(element.community_id)){
              e.push(element.community_id)
              c.push(element)
            }
          });
          this.allCommunity = c.sort(function(a, b){
            if(a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
            if(a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
            return 0;
        })  ;
        } else {
          this.toastr.errorToastr(res.msg);
        }
      },
        (err) => {
          this.dataService.genericErrorToaster();
        })
    }
    else{
      this.dataService.getMNMGcommunity(this.currentUser?.id).subscribe((response: any) => {
        if (response['error'] == false) {
          this.cmmntNames = response.body.sort(function(a, b){
            if(a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
            if(a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
            return 0;
        })  ;
        } else if (response['error'] == true) {
          this.toastr.errorToastr(response.msg);
        }
      }, (err) => {
        this.dataService.genericErrorToaster();
  
      })
    }
}

  onItemSelect(e){
    if(this.currentUser?.user_role == 3){
      this.cmmntNames.filter(i=>{
        if(e == i.cp_id){
          this.slctSrtNm =   i.community_short_name
        }
      })
    }
    else if(this.currentUser?.user_role == 8){
      this.cmmntNames.filter(i=>{
           if(e == i.community_id){
             this.slctSrtNm1 =   i.sort_name            
           }
         })
    }
    
    else{
      this.allCommunity.filter(i=>{
           if(e == i.id){
             this.slctSrtNm =   i.sort_name
           }
         })
    }
  }

  shortNm(val){
    let data ={
      is_for : 'agency',
      sort_name : val
    }
    this.dataService.checkShortName(data).subscribe((res:any) => {
      if (!res.error) {
        if(res.body?.length){
          this.usrExst = true
          // this.formData.get('sort_name').setValue('')
        }
        else{
          this.usrExst = false
        }
      } else {
        this._authenticationService.errorToaster(res);
      }
      this.btnShow = false;
    }, error => {
      this.dataService.genericErrorToaster();
      this.btnShow = false;
    });
  }

}
