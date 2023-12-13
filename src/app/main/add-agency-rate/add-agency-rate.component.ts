import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { Page } from 'app/utils/models';
import { ToastrManager } from 'ng6-toastr-notifications';
import { PositionService } from '../position/position.service';

@Component({
  selector: 'app-add-agency-rate',
  templateUrl: './add-agency-rate.component.html',
  styleUrls: ['./add-agency-rate.component.scss']
})
export class AddAgencyRateComponent implements OnInit {
  public contentHeader: object;
  btnShow : boolean = false;
  formData!: FormGroup
  currentUser: any;
  comdata:any;
  agcydata: any;
  agencyListingData: any;
  SelectedAgency_id: any;
  searchStr: string;
  public page = new Page();
  postnListingData: any;

  constructor(
    private loct : Location,
    private fb : FormBuilder,
    private dataService :DataService,
    private tost : ToastrManager,
    private _router:Router,
    private _authenticationService : AuthenticationService,
    private positionApi : PositionService

  ) { 
    this._authenticationService.currentUser.subscribe((x: any) => {
      this.currentUser = x
    });
    // this.getAgencyListing()
    this.getAgency()
    this.getPosition()
    this.getcommunityForAgencyRates()
  }

  ngOnInit(): void {
    this.getAgncyDtail()
    this.contentHeader = {
      headerTitle: 'Add Agency Rates',
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
      community: ['',[Validators.required]],
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
    if(this.currentUser.role != 'Admin')
    {
     this.formData.controls['community'].clearValidators();
     this.formData.updateValueAndValidity();
    }
    if(this.currentUser.role == 'Admin')
    {
     this.formData.controls['community'].setValidators(Validators.required);
     this.formData.updateValueAndValidity();
    }
  }

  get controls() {
    return this.formData.controls
  }
  goBack(){
    this.loct.back()
  }

  // getAgencyListing(){
  //   let community_id = this.currentUser.id
  //   let is_for = 'community'
  //   let typeDrop = true
  //   this.dataService.getAgency(this.searchStr= '', this.page.pageNumber, this.page.size, community_id,is_for,typeDrop).subscribe((res:any)=>{
  //     this.agencyListingData = res.body
  //   })
  // }
  selectCommunity(event:any){
    console.log(event);
    this.dataService.getAgenciesNewByID(event.target.value).subscribe((response: any) => { 
      this.agencyListingData = response.body
    })
  }
  getcommunityForAgencyRates() {
      this.dataService.getAllCgetcommunityForAgencyRatesom().subscribe((response: any) => { 
            this.comdata = response.body.sort(function(a, b){
              if(a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
              if(a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
              return 0;
          })  ;
          })
    }



  getAgency() {
    // let data = {
    //   pageNo: this.page.pageNumber,
    //   limitNum: 10,
    // };

    let typeDrop = false
    let community_id = this.currentUser.role == 'Community' ? this.currentUser.id : this.currentUser.role == 'Admin' ? this.currentUser.id : null;
    let is_for= this.currentUser.role == 'Community' ? 'community' : this.currentUser.role == 'Admin' ? 'management' :'superadmin';
    this.dataService.getAgency(this.searchStr, this.page.pageNumber, 10, community_id,is_for,typeDrop).subscribe((response: any) => {
      if (response['error'] == false && this.currentUser.user_role != 6) {
        this.agencyListingData = response.body;
        //this.toastr.successToastr(response.msg);
      } else if (response['error'] == true) {
        this.tost.errorToastr(response.msg);
      }
    })
  }
  selectAgency(data){
    this.SelectedAgency_id = data
  }
  submitted(){
    for (let item of Object.keys(this.controls)) {
      this.controls[item].markAsDirty()
    }
    if (this.formData.invalid) {
      return;
    }
    let body={
      // agency_name: this.formData.value.agency_name,
      // rate: this.formData.value.rate,
      // date_type: this.formData.value.date_type,
      // rate_type: this.formData.value.rate_type,
      // time_slot: this.formData.value.time_slot,
      position: this.formData.value.position,
      community_id: this.currentUser.user_role == 6 ? this.formData.value.community : this.currentUser.id,
      agency_id: this.formData.value.agency_id,
      t_7a_3p_WDN:this.formData.value.t_7a_3p_WDN,
      t_3p_11p_WDN:this.formData.value.t_3p_11p_WDN,
      t_11p_7a_WDN:this.formData.value.t_11p_7a_WDN,
      t_7a_7p_WDN:this.formData.value.t_7a_7p_WDN,
      t_7p_7a_WDN:this.formData.value.t_7p_7a_WDN,
      t_7p_7a_WEN:this.formData.value.t_7p_7a_WEN,
      t_7a_7p_WEN:this.formData.value.t_7a_7p_WEN,
      t_11p_7a_WEN:this.formData.value.t_11p_7a_WEN,
      t_3p_11p_WEN:this.formData.value.t_3p_11p_WEN,
      t_7a_3p_WEN:this.formData.value.t_7a_3p_WEN,
      t_7p_7a_WEH:this.formData.value.t_7p_7a_WEH,
      t_7a_7p_WEH:this.formData.value.t_7a_7p_WEH,
      t_11p_7a_WEH:this.formData.value.t_11p_7a_WEH,
      t_3p_11p_WEH:this.formData.value.t_3p_11p_WEH,
      t_7a_3p_WEH:this.formData.value.t_7a_3p_WEH,
      t_7p_7a_WDH:this.formData.value.t_7p_7a_WDH,
      t_7a_7p_WDH:this.formData.value.t_7a_7p_WDH,
      t_11p_7a_WDH:this.formData.value.t_11p_7a_WDH,
      t_3p_11p_WDH:this.formData.value.t_3p_11p_WDH,
      t_7a_3p_WDH:this.formData.value.t_7a_3p_WDH,
      
    }
    console.log(this.formData.value,'tttttttttttttttttttttttttttttttt')
    this.btnShow = true;
    this.dataService.agencyRates(body).subscribe((res: any) => {
      if (!res.error) {
        this.tost.successToastr(res.msg)
        this.btnShow = false;
        this._router.navigate(['agencyRate'])
      } else {
        this.btnShow = false;
        this.tost.errorToastr(res.msg)
      }
    },
      (err) => {
        this.btnShow = false;
        this.dataService.genericErrorToaster()
      })
  }

  getAgncyDtail() {
    this.dataService.getAgenciesByID(this.currentUser.id).subscribe((res: any) => {
      if (!res.error) {
        this.agcydata = res.body[0]
  
      }
      else {
        this.tost.errorToastr(res.msg)
      }
    }, (err) => {
      this.dataService.genericErrorToaster()
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
