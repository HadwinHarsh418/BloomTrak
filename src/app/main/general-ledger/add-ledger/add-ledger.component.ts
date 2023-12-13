import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-add-ledger',
  templateUrl: './add-ledger.component.html',
  styleUrls: ['./add-ledger.component.scss']
})
export class AddLedgerComponent implements OnInit {
  public contentHeader: any;
  formRoleData: any;
  loading:boolean = false;
  prmsUsrId: any;
  allCommunity: any;
  currentUser: any;
  comName: any;
  dprtmnt: any =[]
  deptDsbl: boolean;
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
      headerTitle: this.prmsUsrId?.id ? 'Edit General Ledger' : 'Add General Ledger',
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
            name: 'General Ledger',
            isLink: true,
            link: '/general_ledger'
          }
        ]
      }
    };
    
    this.formRoleData = this.formBuilder.group({
      com_name: ['', Validators.required],
      gl_acc: ['', Validators.required],
      desc:['',Validators.required],
      department:['',Validators.required],
      gl_and_description:['',Validators.required]
    })

    if(['1'].includes(this.currentUser.prmsnId))
    {
     this.formRoleData.controls['com_name'].clearValidators();
     this.formRoleData.updateValueAndValidity();
    }
    if(['6'].includes(this.currentUser.prmsnId))
    {
     this.formRoleData.controls['com_name'].setValidators(Validators.required);
     this.formRoleData.updateValueAndValidity();
    }

    if(this.prmsUsrId?.id){
      this.getLedger();
      this.deptDsbl = true
    }
    if(this.currentUser.prmsnId == '6' || this.currentUser.user_role =='3'){
      this.getCommunityId()
    }
  }

  ngAfterContentInit(){
    if(['1'].includes(this.currentUser.prmsnId)){
      this.getCommunityDetails()
      this.getDepartment(this.currentUser.id)
    }
  }

 
  goBack(){
    this.location.back()
  }

  get FormData_Control(){
    return this.formRoleData.controls;
  }
  
  getLedger(){
    let data = {
      id : this.prmsUsrId.id,
      community_id : 'id'
    }
    this.dataSrv.getLedgerById(data).subscribe((res:any)=>{
      if(!res.err){
        if(['6'].includes(this.currentUser.prmsnId)){
          this.getDepartment(res.body[0].community_id)
        }
          this.formRoleData.patchValue({
            com_name : res.body[0].community_id,
            department : res.body[0].department,
            gl_acc: res.body[0].gl_acc,
            desc:res.body[0].description,
            gl_and_description:res.body[0].gl_and_description
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
    if(this.prmsUsrId?.id){
      this.formRoleData.get('department').clearValidators([]);
      this.formRoleData.get('department').updateValueAndValidity();
    }
    for (let item of Object.keys(this.FormData_Control)) {
      this.FormData_Control[item].markAsDirty()
    }
    if (this.formRoleData.invalid) {
      return;
    }
    let data ={
      community_id:this.currentUser.prmsnId == '1' ? this.currentUser.id :this.formRoleData.value.com_name,
      gl_acc:this.formRoleData.value.gl_acc,
      description:this.formRoleData.value.desc,
      department:this.formRoleData.value.department,
      gl_and_description:this.formRoleData.value.gl_and_description
    }
    if(this.prmsUsrId?.id){
      this.loading=  true;
      let data ={
        community_id:this.formRoleData.value.com_name,
        id:this.prmsUsrId.id,
        gl_acc:this.formRoleData.value.gl_acc,
        description:this.formRoleData.value.desc,
        department:this.formRoleData.value.department,
        gl_and_description:this.formRoleData.value.gl_and_description
      }
      
        this.dataSrv.editLedger(data).subscribe((res:any)=>{
          
          if(!res.error){
              this.loading=  false;
            this.toaster.successToastr(res.msg)
            this._router.navigate(['/general_ledger'])
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
      
        this.dataSrv.addLedger(data).subscribe((res:any)=>{
          
          if(!res.error){
              this.loading=  false;
            this.toaster.successToastr(res.msg)
           this._router.navigate(['/general_ledger'])
          }else{
            this.loading=  false;
            this.toaster.errorToastr(res.msg)
          }
        },err=>{
          this.loading=  false;
          this.dataSrv.genericErrorToaster()
        })
    }
  }

  getCommunityId() {
    if(this.currentUser.user_role =='3'){
if(this.currentUser.id && this.currentUser.com_id){
  let data = {
    userId : this.currentUser.id,
    mangId : this.currentUser.com_id
  }
  this.dataSrv.getManagementUserCommunities(data).subscribe((res: any) => {
    if (!res.error) {
      // this.mangComs = res.body[1].userAvailableCommunities
      this.allCommunity = res.body[0].user_added_communities.sort(function(a, b){
        if(a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
        if(a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
        return 0;
    })  ;
    } else {
      this.toaster.errorToastr(res.msg);
    }
  },
    (err) => {
      this.dataSrv.genericErrorToaster();
    })
}
else{
  this.dataSrv.getMNMGcommunity(this.currentUser.id).subscribe((response: any) => {
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
    }
    else{
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
  }

  getCommunityDetails() {
    this.dataSrv.getcommunityById(this.currentUser.id).subscribe(response => {
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

  slct(e){
    this.getDepartment(e.target.value)
  }
  

  getDepartment(e){
    this.dprtmnt =[]
    let isfor = 6 
    let for_other = null
    this.dataSrv.getDepartmentListing(['1'].includes(this.currentUser.prmsnId) ? this.currentUser.id : e,isfor,for_other).subscribe((res:any)=>{
      this.dprtmnt = res.body.sort(function(a, b){
        if(a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
        if(a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
        return 0;
    })  ;;
    },err=>{
      this.toaster.errorToastr('Something went wrong please try again leter')
    })
  }

}
