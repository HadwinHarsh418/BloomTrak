import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmedValidator } from 'app/auth/helpers/mustMacth';
import { Patterns } from 'app/auth/helpers/patterns';
import { ApiService } from 'app/auth/service/api.service';
import { DataService } from 'app/auth/service/data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import StatesJson from 'assets/states.json';
import { StaticServiceService } from 'app/utils/static-service.service';

@Component({
  selector: 'app-add2-management',
  templateUrl: './add2-management.component.html',
  styleUrls: ['./add2-management.component.scss']
})
export class Add2ManagementComponent implements OnInit {
  States:any = StatesJson;
  formData!: FormGroup;
  btnShow: boolean = false;
  public contentHeader: object;
  state:any;
  phoneUsd: { name: string; flag: string; code: string; dial_code: string; }[];
  selectedDataValue: any;
  usrExst: boolean;
  passwordTextType2: boolean = false;
  passwordTextType1: boolean = false;

  constructor(
    private fb: FormBuilder,
    private tost: ToastrManager,
    private dataService: DataService,
    private api: ApiService,
    private loctn: Location,
    private phoneService : StaticServiceService
  ) { 
    this.phoneUsd = this.phoneService.phoneUsdCode
  }

  ngOnInit(): void {
    this.state = this.States

    this.formData = this.fb.group({
      mg_name: ['', [Validators.required]],
      mg_phone: ['', [Validators.required,Validators.pattern(Patterns.number)]],
      mg_email: ['', [Validators.email]],
      username: ['', [Validators.required]],
      contact_email: ['', [Validators.required,Validators.email]],
      contact_person: ['', [Validators.required,Validators.pattern(Patterns.number)]],
      contact_person_firstname: ['', [Validators.required]],
      contact_person_lastname: ['', [Validators.required]],
      contact_person_title: ['', [Validators.required]],
      state: ['', [Validators.required]],
      sort_name: ['', [Validators.required, Validators.pattern(Patterns.sort_name)]],
      mg_address1: ['', [Validators.required]],
      mg_address2: [''],
      zipcode: ['', [Validators.required]],
      website: ['', [Validators.required]],
      city: ['', [Validators.required]],
      password: ['', [Validators.pattern(Patterns.password)]],
      approval: ['1'],
      cnfrmpassword:  ['', ]
    }, { 
      validator: ConfirmedValidator('password', 'cnfrmpassword')
    },
    )

    this.contentHeader = {
      headerTitle: 'Add Management Company ',
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
            name: 'Management Company ',
            isLink: true,
            link: '/management'
          }
        ]
      }
    };
  }
  mapCountry_selected(data){
    return this.selectedDataValue = data.dial_code;
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
    let body1={
      mg_name: this.formData.value.mg_name,
       mg_email: this.formData.value. mg_email,
      password: this.formData.value.password,
      username: this.formData.value.username.replace(' ','').trim(),
      short_name: this.formData.value.sort_name,
      approval: '1',
      contact_person_firstname: this.formData.value.contact_person_firstname,
      contact_person_lastname: this.formData.value.contact_person_lastname,
      contact_person_title: this.formData.value.contact_person_title,
      contact_email: this.formData.value.contact_email,
      mg_address1: this.formData.value.mg_address1,
      mg_address2: this.formData.value.mg_address2,
      city: this.formData.value.city,
      state: this.formData.value.state,
      zipcode: this.formData.value.zipcode,
      website: this.formData.value.website,
      mg_phone: this.formData.value.mg_phone.replace(/\D/g, ''),
      contact_person: this.formData.value.contact_person.replace(/\D/g, ''),
      country_code:this.selectedDataValue? this.selectedDataValue : ''
    }
    this.btnShow = true;
    this.dataService.addManagement(body1).subscribe((res: any) => {
      if (!res.error) {
        this.tost.successToastr(res.msg)
        this.btnShow = false;
        this.loctn.back()
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

  goBack(){
    this.loctn.back()
  }

  shortNm(val){
    let data ={
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
      } 
      this.btnShow = false;
    }, error => {
      this.dataService.genericErrorToaster();
      this.btnShow = false;
    });
  }
  
}
