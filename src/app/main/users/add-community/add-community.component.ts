import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmedValidator } from 'app/auth/helpers/mustMacth';
import { Patterns } from 'app/auth/helpers/patterns';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { Page } from 'app/utils/models';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrManager } from 'ng6-toastr-notifications';
import StatesJson from 'assets/states.json';
import { StaticServiceService } from 'app/utils/static-service.service';


@Component({
  selector: 'app-add-community',
  templateUrl: './add-community.component.html',
  styleUrls: ['./add-community.component.scss']
})
export class AddCommunityComponent implements OnInit {
  States:any = StatesJson;

  @ViewChild('fileInput') elfile: ElementRef;
  fileToUpload:any;
  public passwordTextType: boolean;
  public passwordTextType2: boolean;
  
  formData!: FormGroup;
  btnShow: boolean = false;
  searchSub: any = null;
  public page = new Page();
  loadingList: boolean;
  currentUser: any;
  searchStr: string = '';
  public rows = [];
  tempCmntyId: any;
  public contentHeader: object;
  getMangemntId_names: any =[]
  mngList: boolean = false;
  state:any;
  dropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'id',
    textField: 'mg_name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    closeDropDownOnSelection: true,
    itemsShowLimit: 3,
    allowSearchFilter: true
  };

  cancellation_period: any = [
    { hour: '02' },
    { hour: '03' },
    { hour: '04' },
    { hour: '06' },
    { hour: '12' },
    { hour: '24' },
  ]
  phoneUsd: { name: string; flag: string; code: string; dial_code: string; }[];
  selectedDataValue: any;
  usrExst: boolean;

  constructor(
    private dataService: DataService,
    private toastr: ToastrManager,
    private fb: FormBuilder,
    private _authenticationService: AuthenticationService,
    private loctn : Location,
    private phoneService : StaticServiceService

  ) {
    this.phoneUsd = this.phoneService.phoneUsdCode
    this._authenticationService.currentUser.subscribe((x: any) => {
      this.currentUser = x
      
    });
   }

  ngOnInit(): void {
    this.getMangemntId_name()
    this.state = this.States

    this.formData = this.fb.group({
      community_name: ['', Validators.required],
      community_address1: ['', Validators.required],
      community_email: ['', [ Validators.email]],
      community_address2: ['',],
      community_website: ['',[Validators.required]],
      city: ['', Validators.required],
      zipcode: ['', Validators.required],
      single_community: [''],
      state: ['', Validators.required],
      cancellation_period: ['', Validators.required],
      sort_name: ['', [Validators.required, Validators.pattern(Patterns.sort_name)]],
      username: ['', [Validators.required, Validators.pattern(/[a-zA-Z]+/)]],
      getMangemntId: [''],
      community_phone_no: ['', [Validators.required, Validators.pattern(Patterns.number)]],
      password: ['', [ Validators.pattern(Patterns.password)]],
      primary_contact_firstname: ['', Validators.required],
      primary_contact_lastname: ['', Validators.required],
      primary_contact_title: ['', Validators.required],
      primary_contact_phone: ['', [Validators.required, Validators.pattern(Patterns.number)]],
      primary_contact_email: ['', [Validators.required, Validators.email]],
      cnfrmpassword:  ['']
    }, { 
      validator: ConfirmedValidator('password', 'cnfrmpassword')
    },
    )

    this.contentHeader = {
      headerTitle: 'Add Community ',
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
            name: 'Communities ',
            isLink: true,
            link: '/community'
          }
        ]
      }
    };
  }

  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  togglePasswordTextType2() {
    this.passwordTextType2 = !this.passwordTextType2;
  }

  mapCountry_selected(data){
    return this.selectedDataValue = data.dial_code;
  }
  get controls() {
    return this.formData.controls;
  }

  getMangemntId_name() {
    this.dataService.getManagementNames().subscribe(res => {
      if (!res.error) {
        this.getMangemntId_names = res.body.sort(function(a, b){
          if(a.mg_name.toUpperCase() < b.mg_name.toUpperCase()) { return -1; }
          if(a.mg_name.toUpperCase() > b.mg_name.toUpperCase()) { return 1; }
          return 0;
      })
      } else {
        this._authenticationService.errorToaster(res);
      }
      this.btnShow = false;
    }, error => {
      this.dataService.genericErrorToaster();
      this.btnShow = false;
    });
}

shortNm(val){
  let data ={
    is_for : 'community',
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

  onFileInput(files: any) {
    if (files.length === 0) {
      return;
    }
    let type = files[0].type;
    this.fileToUpload = files[0];
  }

  async uploadEmpList():Promise<boolean>{
    let formdata = new FormData();
    formdata.append('report',this.fileToUpload);
    formdata.append('community_id', String(this.tempCmntyId));
    try{
      const res:any = await this.dataService.importEmployees(formdata);
      if (!res.error) {
        this.toastr.successToastr(res.msg)
        return true;
      } else {
        this.toastr.errorToastr(res.msg)
        return false;
      }
    }
    catch(e){
      this.toastr.errorToastr('Someting went wrong. Please try later')
      return false;
    }
  }

  submitted() {
    for (let item of Object.keys(this.controls)) {
      this.controls[item].markAsDirty()
    }
    if (this.formData.invalid) { 
      return;
    }
    if ( this.usrExst) { 
      return;
    }
    else {
      this.btnShow = true;
      let body1 = {
        community_name: this.formData.value.community_name,
        community_address1: this.formData.value.community_address1,
        community_address2: this.formData.value.community_address2,
        community_phone_no: this.formData.value.community_phone_no.replace(/\D/g, ''),
        password: this.formData.value.password,
        sort_name: this.formData.value.sort_name,
        username: this.formData.value.username.replace(' ','').trim(),
        city: this.formData.value.city,
        cancellation_period: this.formData.value.cancellation_period,
        state: this.formData.value.state,
        // getMangemntId: this.formData.value.getMangemntId,
        // single_community: this.formData.value.single_community,
        zipcode: this.formData.value.zipcode,
        community_website: this.formData.value.community_website,
        community_email: this.formData.value.community_email,
        primary_contact_firstname: this.formData.value.primary_contact_firstname,
        primary_contact_lastname: this.formData.value.primary_contact_lastname,
        primary_contact_title: this.formData.value.primary_contact_title,
        primary_contact_phone: this.formData.value.primary_contact_phone.replace(/\D/g, ''),
        primary_contact_email: this.formData.value.primary_contact_email,
        country_code:this.selectedDataValue? this.selectedDataValue : ''
        // approval: this.formData.value.approval,
      }

      this.dataService.register({ ...body1, ...{ approval: '1' } }).subscribe(async(res: any) => {
        if (!res.error) {
          this.tempCmntyId = res.body[0].id
          if(this.fileToUpload){
            let isFileUploaded = await this.uploadEmpList();
          }
          this.btnShow = false;
          this.toastr.successToastr(res.msg);
          setTimeout(() => {
            this.callSglCmnt( this.tempCmntyId)
          }, 500);
          this.loctn.back()
        
        } else {
          this.btnShow = false;
          this.toastr.errorToastr(res.msg);
        }
      },
        (err) => {
          this.btnShow = false;
          this.dataService.genericErrorToaster();
        })
      
    }
  }

  callSglCmnt(registerId){
    let data ={
      id: registerId,
      single_community : this.currentUser?.user_role == '3' ? '1' :  this.formData.value.single_community
    }

    this.dataService.updateSinleCOm(data).subscribe((res:any)=>{
      
    })

    
    let data2 ={
      id: registerId,
      management_id :[this.currentUser?.user_role == '3' ? this.currentUser?.id :this.formData.value.getMangemntId[0].id]
    }
  
    this.dataService.updateManagementId(data2).subscribe((res:any)=>{
      
    })
  }

  goBack(){
    this.loctn.back()
  }

 
chngEnvt(e){
  
  let evntVla = e.target.value
  if(evntVla == 1){
    this.mngList = true
  }else{
     this.controls['getMangemntId'].setValue('');
    this.controls['getMangemntId'].disable();
    this.mngList = false
    
  }
}
}
