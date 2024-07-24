import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-add-budget-resident',
  templateUrl: './add-budget-resident.component.html',
  styleUrls: ['./add-budget-resident.component.scss']
})
export class AddBudgetResidentComponent implements OnInit {

  public contentHeader: any;
  formRoleData: any;
  loading:boolean = false;
  prmsUsrId: any;
  allCommunity: any;
  currentUser: any;
  comName: any;
  community_id: any;
  allCommunity1: any[];
  community_name: any;
  constructor(
    private formBuilder : FormBuilder,
    private location : Location,
    private dataSrv : DataService,
    private toaster : ToastrManager,
    private aCtRoute : ActivatedRoute,
    private _router : Router,
    private _authenticationService : AuthenticationService,

  ) { 
    this.aCtRoute.params.subscribe(
      res => {
          this.prmsUsrId = res;
          
      }
    )

    this._authenticationService.currentUser.subscribe((x: any) => {
      this.currentUser = x
    })
  }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: this.prmsUsrId?.id ? 'Edit Budget resident days' : 'Add Budget resident days',
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
            name: 'Budget resident days',
            isLink: true,
            link: '/budget-resident-days'
          }
        ]
      }
    };
    
    this.formRoleData = this.formBuilder.group({
      com_name: ['', Validators.required],
      january: ['', Validators.required],
      february: ['', Validators.required],
      march: ['', Validators.required],
      april: ['', Validators.required],
      may: ['', Validators.required],
      june: ['', Validators.required],
      july: ['', Validators.required],
      august: ['', Validators.required],
      september: ['', Validators.required],
      october: ['', Validators.required],
      november: ['', Validators.required],
      december: ['', Validators.required],
      YE_total: ['', Validators.required],
      start_date:['',Validators.required],
      end_date:['',Validators.required],
      desc:['',Validators.required]
    })
    if(this.prmsUsrId?.id){
      this.getLedger();
    }
    if(['6'].includes(this.currentUser?.prmsnId)){
      this.getCommunityId()
    }
    if(['3'].includes(this.currentUser?.prmsnId)){
      this.ManagemnetCom()
    }
    if(['1'].includes(this.currentUser?.prmsnId)){
      this.getCommunityDetails()
    }
    if(['1'].includes(this.currentUser?.prmsnId))
    {
     this.formRoleData.controls['com_name'].clearValidators();
     this.formRoleData.updateValueAndValidity();
    }
    //   if(['1'].includes(this.currentUser?.prmsnId)){
    //   this.getCommunityDetails()
    // }

    if(['8'].includes(this.currentUser?.prmsnId)){
     this.getMngComunity()
    }
    if(['6'].includes(this.currentUser?.prmsnId))
    {
     this.formRoleData.controls['com_name'].setValidators(Validators.required);
     this.formRoleData.updateValueAndValidity();
    }
    if(['3'].includes(this.currentUser?.prmsnId))
    {
     this.formRoleData.controls['com_name'].setValidators(Validators.required);
     this.formRoleData.updateValueAndValidity();
    }
  }
 
  goBack(){
    this.location.back()
  }

  get FormData_Control(){
    return this.formRoleData.controls;
  }
  
  getLedger(){
    this.dataSrv.getBudgetResidentDaysById(this.prmsUsrId.id).subscribe((res:any)=>{
      if(!res.err){
        
        this.formRoleData.patchValue({
          com_name : res.body[0].community_name,
          january: res.body[0].january,
          february: res.body[0].february,
          march: res.body[0].march,
          april: res.body[0].april,
          may: res.body[0].may,
          june: res.body[0].june,
          july: res.body[0].july,
          august: res.body[0].august,
          september: res.body[0].september,
          october: res.body[0].october,
          november: res.body[0].november,
          december: res.body[0].december,
          YE_total: res.body[0].YE_total,
          start_date:res.body[0].start_date,
          end_date:res.body[0].end_date,
          desc:res.body[0].description
        })
      }
      else{
        this.toaster.errorToastr('Something went wrong please try again leter')
      }
    },err=>{
        this.dataSrv.genericErrorToaster()
    })
  }


  submitted(){
    
    for (let item of Object.keys(this.FormData_Control)) {
      this.FormData_Control[item].markAsDirty()
    }
    if(this.formRoleData.value.end_date <= this.formRoleData.value.start_date)
      {
        this.toaster.errorToastr("Start date after End date")
      }else{
    if (this.formRoleData.invalid) {
      return;
    }
    let data ={
      community_name : this.currentUser?.prmsnId== '1' ? this.comName.community_name : this.formRoleData.value.com_name,
          january: this.formRoleData.value.january,
          february: this.formRoleData.value.february,
          march: this.formRoleData.value.march,
          april: this.formRoleData.value.april,
          may: this.formRoleData.value.may,
          june: this.formRoleData.value.june,
          july: this.formRoleData.value.july,
          august: this.formRoleData.value.august,
          september: this.formRoleData.value.september,
          october: this.formRoleData.value.october,
          november: this.formRoleData.value.november,
          december: this.formRoleData.value.december,
          YE_total: this.formRoleData.value.YE_total,
          start_date:this.formRoleData.value.start_date,
          end_date:this.formRoleData.value.end_date,
          description:this.formRoleData.value.desc
    }
    if(this.prmsUsrId?.id){
      this.loading=  true;
      let data ={
          id:this.prmsUsrId.id,
          community_name : this.currentUser?.prmsnId== '1'?this.comName.community_name :this.currentUser?.prmsnId== '3' ?this.community_name : this.formRoleData.value.com_name,
          january: this.formRoleData.value.january,
          february: this.formRoleData.value.february,
          march: this.formRoleData.value.march,
          april: this.formRoleData.value.april,
          may: this.formRoleData.value.may,
          june: this.formRoleData.value.june,
          july: this.formRoleData.value.july,
          august: this.formRoleData.value.august,
          september: this.formRoleData.value.september,
          october: this.formRoleData.value.october,
          november: this.formRoleData.value.november,
          december: this.formRoleData.value.december,
          YE_total: this.formRoleData.value.YE_total,
          start_date:this.formRoleData.value.start_date,
          end_date:this.formRoleData.value.end_date,
          description:this.formRoleData.value.desc
        }
        this.dataSrv.editBudgetResidentDays(data).subscribe((res:any)=>{
          
          if(!res.error){
              this.loading=  false;
            this.toaster.successToastr(res.msg)
            this._router.navigate(['/budget-resident-days'])
          }else{
            this.loading=  false;
            this.toaster.errorToastr(res.msg)
          }
        },err=>{
          this.loading=  false;
          this.dataSrv.genericErrorToaster()
        })
    }else{
      this.loading=  true;
      
        this.dataSrv.addBudgetResidentDays(data).subscribe((res:any)=>{
          
          if(!res.error){
              this.loading=  false;
            this.toaster.successToastr(res.msg)
           this._router.navigate(['/budget-resident-days'])
          }else{
            this.loading=  false;
            this.toaster.errorToastr(res.msg)
          }
        },err=>{
          this.loading=  false;
          this.dataSrv.genericErrorToaster()
        })
    }
  }}

  getCommunityId() {
    this.dataSrv.getCommunityId().subscribe((response: any) => {
      if (response['error'] == false) {
        this.allCommunity = response.body.sort(function(a, b){
          if(a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
          if(a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
          return 0;
      })  ;
        //this.toastr.successToastr(response.msg);
      } else if (response['error'] == true) {
        this.toaster.errorToastr(response.msg);
      }
    }, (err) => {
      this.dataSrv.genericErrorToaster();

    })
  }

  getCommunityDetails() {
    this.dataSrv.getcommunityById(this.currentUser?.id).subscribe(response => {
      if (!response.error) {
          this.comName = response.body[0]
      } else {
        this._authenticationService.errorToaster(response);
      }
    }, error => {
      this.dataSrv.genericErrorToaster()
    }
    );
  }
  getMngComunity(){
    if(this.currentUser?.id && this.currentUser?.com_id){
      let data = {
        userId : this.currentUser?.id,
        mangId : this.currentUser?.management
      }
      this.dataSrv.getManagementUserCommunities(data).subscribe((res: any) => {
        if (!res.error) {
          // this.mangComs = res.body[1].userAvailableCommunities
          let d:any[] = res?.body[0].user_added_communities.concat(res?.body[1].userAvailableCommunities);
          const uniqueArray = d.filter((obj, index, self) =>
                index === self.findIndex((t) => (
                    t.community_id === obj.community_id &&
                    t.community_name === obj.community_name &&
                    t.community_short_name === obj.community_short_name
                ))
            );
          this.allCommunity1 = uniqueArray.sort(function(a, b){
            if(a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
            if(a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
            return 0;
        })  ;
        this.community_id = this.allCommunity1[0]?.community_id
 
        } else {
          this.toaster.errorToastr(res.msg);
        }
      },
        (err) => {
          this.dataSrv.genericErrorToaster();
        })
    }
  }
  ManagemnetCom(){
    this.dataSrv.getMNMGcommunity(this.currentUser?.id).subscribe((response: any) => {
      if (response['error'] == false) {
        this.allCommunity = response.body.sort(function(a, b){
          if(a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
          if(a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
          return 0;
      })  ;
      this.community_id = response?.body[0]?.cp_id
      this.community_name=response?.body[0]?.community_name
  
      } else if (response['error'] == true) {
        this.toaster.errorToastr(response.msg);
      }
    }, (err) => {
      this.dataSrv.genericErrorToaster();

    })
  }
  }
