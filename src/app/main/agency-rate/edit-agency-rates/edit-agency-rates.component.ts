import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { PositionService } from 'app/main/position/position.service';
import { Page } from 'app/utils/models';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-edit-agency-rates',
  templateUrl: './edit-agency-rates.component.html',
  styleUrls: ['./edit-agency-rates.component.scss']
})
export class EditAgencyRatesComponent implements OnInit {
  public contentHeader: object;
  formData!: FormGroup
  btnShow : boolean = false;
  isDisabled : boolean = true;
  currentUser: any;
  searchStr: string;
  public page = new Page();
  agencyListingData: any;
  data: any;
  comdata:any;
  ags: any;
  postnListingData: any;

  constructor(
   private fb : FormBuilder ,
   private aCtRoute : ActivatedRoute,
   private loct :Location,
   private _authenticationService  :AuthenticationService,
   private dataService : DataService,
   private tost :ToastrManager,
   private positionApi :PositionService
  ) { 
    this.aCtRoute.params.subscribe(
      res => {
        if (res) {
          this.getAgencyRatesById(res);
        }
      }
    )

    this._authenticationService.currentUser.subscribe((x: any) => {
      this.currentUser = x
    });
    this.getPosition()
  }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Edit Agency Rates',
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
            name: 'Agency Rates',
            isLink: false,
            link: ''
          }
        ]
      }
    };

    this.formData = this.fb.group({
      agency_id: ['', [Validators.required]],
      community_id:['',[Validators.required]],
      position: ['', [Validators.required]],
      // rate: ['', [Validators.required]],
      // date_type: ['', [Validators.required]],
      // rate_type: ['', [Validators.required]],
      t_7a_3p_WDN:['',[Validators.required]],
      t_3p_11p_WDN:['',[Validators.required]],
      t_11p_7a_WDN:['',[Validators.required]],
      t_7a_7p_WDN:['',[Validators.required]],
      t_7p_7a_WDN:['',[Validators.required]],
      t_7p_7a_WEN:['',[Validators.required]],
      t_7a_7p_WEN:['',[Validators.required]],
      t_11p_7a_WEN:['',[Validators.required]],
      t_3p_11p_WEN:['',[Validators.required]],
      t_7a_3p_WEN:['',[Validators.required]],
      t_7p_7a_WEH:['',[Validators.required]],
      t_7a_7p_WEH:['',[Validators.required]],
      t_11p_7a_WEH:['',[Validators.required]],
      t_3p_11p_WEH:['',[Validators.required]],
      t_7a_3p_WEH:['',[Validators.required]],
      t_7p_7a_WDH:['',[Validators.required]],
      t_7a_7p_WDH:['',[Validators.required]],
      t_11p_7a_WDH:['',[Validators.required]],
      t_3p_11p_WDH:['',[Validators.required]],
      t_7a_3p_WDH:['',[Validators.required]],
     
    }
    )
    if(this.formData.value != 'community_id')
    {
     this.formData.controls['community_id'].clearValidators();
     this.formData.updateValueAndValidity();
    }
    if(this.formData.value == 'community_id')
    {
     this.formData.controls['community_id'].setValidators(Validators.required);
     this.formData.updateValueAndValidity();
    }
  }
  get controls(){
    return this.formData.controls
  }

  ptchVal(){
    this.formData.patchValue({
      position: this.data.position,
      rate: this.data.rate,
      community_id:this.data.community_id,
      agency_id: this.data.agency_id ,
      // rate_type: this.data.rate_type,
      t_7a_3p_WDN: this.data.t_7a_3p_WDN,
      t_3p_11p_WDN: this.data.t_3p_11p_WDN,
      t_11p_7a_WDN: this.data.t_11p_7a_WDN,
      t_7a_7p_WDN: this.data.t_7a_7p_WDN,
      t_7p_7a_WDN: this.data.t_7p_7a_WDN,
      t_7p_7a_WEN: this.data.t_7p_7a_WEN,
      t_7a_7p_WEN: this.data.t_7a_7p_WEN,
      t_11p_7a_WEN: this.data.t_11p_7a_WEN,
      t_3p_11p_WEN: this.data.t_3p_11p_WEN,
      t_7a_3p_WEN: this.data.t_7a_3p_WEN,
      t_7p_7a_WEH: this.data.t_7p_7a_WEH,
      t_7a_7p_WEH: this.data.t_7a_7p_WEH,
      t_11p_7a_WEH: this.data.t_11p_7a_WEH,
      t_3p_11p_WEH: this.data.t_3p_11p_WEH,
      t_7a_3p_WEH: this.data.t_7a_3p_WEH,
      t_7p_7a_WDH: this.data.t_7p_7a_WDH,
      t_7a_7p_WDH: this.data.t_7a_7p_WDH,
      t_11p_7a_WDH: this.data.t_11p_7a_WDH,
      t_3p_11p_WDH: this.data.t_3p_11p_WDH,
      t_7a_3p_WDH: this.data.t_7a_3p_WDH,

    });
  }

  submitted(){
    for (let item of Object.keys(this.controls)) {
      this.controls[item].markAsDirty()
    }
    if (this.formData.invalid) {
      return;
    }
    let data ={
      id:this.data.id,
      position: this.formData.value.position,
      community_id: this.currentUser.user_role == 6 ? this.formData.value.community : this.currentUser.id,
      // rate: this.formData.value.rate,
      agency_id: this.formData.value.agency_id ,
      // rate_type: this.data.rate_type,
      t_7a_3p_WDN: this.formData.value.t_7a_3p_WDN,
      t_3p_11p_WDN: this.formData.value.t_3p_11p_WDN,
      t_11p_7a_WDN: this.formData.value.t_11p_7a_WDN,
      t_7a_7p_WDN: this.formData.value.t_7a_7p_WDN,
      t_7p_7a_WDN: this.formData.value.t_7p_7a_WDN,
      t_7p_7a_WEN: this.formData.value.t_7p_7a_WEN,
      t_7a_7p_WEN: this.formData.value.t_7a_7p_WEN,
      t_11p_7a_WEN: this.formData.value.t_11p_7a_WEN,
      t_3p_11p_WEN: this.formData.value.t_3p_11p_WEN,
      t_7a_3p_WEN: this.formData.value.t_7a_3p_WEN,
      t_7p_7a_WEH: this.formData.value.t_7p_7a_WEH,
      t_7a_7p_WEH: this.formData.value.t_7a_7p_WEH,
      t_11p_7a_WEH: this.formData.value.t_11p_7a_WEH,
      t_3p_11p_WEH: this.formData.value.t_3p_11p_WEH,
      t_7a_3p_WEH: this.formData.value.t_7a_3p_WEH,
      t_7p_7a_WDH: this.formData.value.t_7p_7a_WDH,
      t_7a_7p_WDH: this.formData.value.t_7a_7p_WDH,
      t_11p_7a_WDH: this.formData.value.t_11p_7a_WDH,
      t_3p_11p_WDH: this.formData.value.t_3p_11p_WDH,
      t_7a_3p_WDH: this.formData.value.t_7a_3p_WDH,
    }
    this.dataService.editAgencyRates(data).subscribe((res:any)=>{
      if(!res.error){
        this.tost.successToastr(res.msg)
        this.loct.back()
      }
    })
  }
  
  goBack(){
    this.loct.back()
  }

  getAgencyRatesById(id){
    let data = { 
      id : id.id
    }
    this.dataService.getAgencyRatesById(data).subscribe((res:any)=>{
      this.data = res.body[0]
      this.getAgencyListing()
      this.getcommunityForAgencyRates()
      this.ptchVal()
    })
  }

  getAgencyListing(){
    let community_id = this.currentUser.role == 'SuperAdmin' ? this.data.community_id : this.currentUser.id
    let is_for = 'community'
    let typeDrop = true
    this.dataService.getAgency(this.searchStr= '', this.page.pageNumber, this.page.size, community_id,is_for,typeDrop).subscribe((res:any)=>{
      this.agencyListingData = res.body
    })
  }
  
  getcommunityForAgencyRates() {
    this.dataService.getAllCgetcommunityForAgencyRatesom().subscribe((response: any) => { 
          this.comdata = response.body
        })
  }

  getPosition(){
    let community_id= this.currentUser.id
    this.positionApi.getPosition(community_id).subscribe((res:any)=>{
      this.postnListingData = res.body;
    },err=>{
      this.tost.errorToastr('Something went wrong please try again leter')
    })
  }


}
