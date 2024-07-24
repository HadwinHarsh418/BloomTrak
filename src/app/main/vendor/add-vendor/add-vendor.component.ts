import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-add-vendor',
  templateUrl: './add-vendor.component.html',
  styleUrls: ['./add-vendor.component.scss']
})
export class AddVendorComponent implements OnInit {
  prmsUsrId: any;
  formRoleData: any;
  loading:boolean = false;
  currentUser: any;
  roleData: any[]=[];
  roleData1: any[]=[];
  roleData2: any[]=[];
  allCommunity: any = [];
  comName: any;
  userName: any;
  community_id: any;

  constructor(
    private aCtRoute : ActivatedRoute,
    private formBuilder : FormBuilder,
    private location: Location,
    private dataSrv :DataService,
    private toaster : ToastrManager,
    private _router : Router,
    private _authenticationService : AuthenticationService,
  ) {
    this.getAllRole()
    this._authenticationService.currentUser.subscribe((x: any) => {
      this.currentUser = x
      this.currentUser?.user_role == 3|| this.currentUser?.user_role == 8?this.getMngComunity() :this.getCommunityId()
    })
    this.aCtRoute.params.subscribe(
      res => {
          this.prmsUsrId = res;
          if(this.prmsUsrId.id){
            this.getVendorList()
          }
      }
    )
   }
  public contentHeader: any;

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: this.prmsUsrId?.id ? 'Edit Vendor' : 'Add Vendor',
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
            name: 'Vendor',
            isLink: true,
            link: '/vendor'
          }
        ]
      }
    };

    this.formRoleData = this.formBuilder.group({
      vendor: ['', Validators.required],
      description: ['', Validators.required],
      community_id: [''],
     })
  }

  getVendorList(){
    let data = {
      id : this.prmsUsrId.id,
    }
    this.dataSrv.getVendorById(data).subscribe((res:any)=>{
      if(!res.err){
        this.formRoleData.patchValue({
          vendor: res.body[0].vendor_name,
          description: res.body[0].description,
          community_id: res.body[0].community_id,
       })
    }
      else{
        this.toaster.errorToastr('Something went wrong please try again leter')
      }
    },err=>{
        this.dataSrv.genericErrorToaster()
    })
  }

  goBack(){
    this.location.back()
  }

  get FormData_Control(){
    return this.formRoleData.controls;
  }

  submitted(){
    for (let item of Object.keys(this.FormData_Control)) {
      this.FormData_Control[item].markAsDirty()
    }
    if (this.formRoleData.invalid) {
      return;
    }
    if(this.prmsUsrId?.id){
     
      this.loading=  true;
      let data ={
       
        vendor_name: this.formRoleData.value.vendor,
        description: this.formRoleData.value.description,
        community_id: this.currentUser?.prmsnId == '1' ? this.currentUser?.id : this.formRoleData.value.community_id,
          id:this.prmsUsrId.id
      }
        this.dataSrv.editVendor(data).subscribe((res:any)=>{
          if(!res.error){
              this.loading=  false;
            this.toaster.successToastr(res.msg)
            this._router.navigate(['/vendor'])
          }else{
            this.loading=  false;
            this.toaster.errorToastr(res.msg)
          }
        },err=>{
          this.loading=  false;
          this.dataSrv.genericErrorToaster()
        })
    }else{
      let data ={
        vendor_name: this.formRoleData.value.vendor,
        description: this.formRoleData.value.description,
        community_id: this.currentUser?.prmsnId == '1' ? this.currentUser?.id : this.formRoleData.value.community_id,
  }
      this.loading=  true;
        this.dataSrv.addVendor(data).subscribe((res:any)=>{
          if(!res.error){
              this.loading=  false;
            this.toaster.successToastr(res.msg)
            this._router.navigate(['/vendor'])
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

  getAllRole(){
    this.dataSrv.getAllRole( ).subscribe((res:any)=>{
      if(!res.err){
        res.body.filter(i=>{ this.roleData.push(i.id.toString())})
       this.roleData.map(i=>{
        if(i != 2 && i != 3  && i != 4 && i != 5 && i != 6 ){
          this.roleData1.push(i)
        }
        if(i != 1 && i != 2 && i != 3  && i != 4 && i != 5 && i != 6 ){
          this.roleData2.push(i)
        }
       })
      }
    },err=>{
      this.dataSrv.genericErrorToaster()
    })
  }

  getCommunityId() {
    this.dataSrv.getCommunityId().subscribe((response: any) => {
      if (response['error'] == false) {
        this.allCommunity = response.body.sort(function(a, b){
          if(a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
          if(a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
          return 0;
      })  ;
      if(this.roleData2.includes(this.currentUser?.prmsnId)){
        this.allCommunity= this.allCommunity.filter(i=> {if(i.id == this.currentUser?.com_id){ return i}})
      }
     this.getCommunityDetails()
        //this.toastr.successToastr(response.msg);
      } else if (response['error'] == true) {
        this.toaster.errorToastr(response.msg);
      }
    }, (err) => {
      this.dataSrv.genericErrorToaster();

    })
  }
  getMngComunity(){
    if(this.currentUser?.id && this.currentUser?.com_id){
      let data = {
        userId : this.currentUser?.id,
        mangId : this.currentUser?.com_id
      }
      this.dataSrv.getManagementUserCommunities(data).subscribe((res: any) => {
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
        this.community_id = d.community_id
        } else {
          this.toaster.errorToastr(res.msg);
        }
      },
        (err) => {
          this.dataSrv.genericErrorToaster();
        })
    }
    else{
      this.dataSrv.getMNMGcommunity(this.currentUser?.id).subscribe((response: any) => {
        if (response['error'] == false) {
          this.allCommunity = response.body.sort(function(a, b){
            if(a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
            if(a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
            return 0;
        })  ;
        this.community_id = response?.body[0]?.cp_id
        } else if (response['error'] == true) {
          this.toaster.errorToastr(response.msg);
        }
      }, (err) => {
        this.dataSrv.genericErrorToaster();
  
      })
    }
  }

   getCommunityDetails() {
    this.dataSrv.getcommunityById(this.roleData2.includes(this.currentUser?.prmsnId) ? this.currentUser?.com_id : this.currentUser?.id).subscribe(response => {
      if (!response.error) {
          this.comName = response.body[0]
          if(this.roleData2.includes(this.currentUser?.prmsnId)){
            this.getUserDtl()
          }
      } else {
        this._authenticationService.errorToaster(response);
      }
    }, error => {
      this.dataSrv.genericErrorToaster()
    }
    );

}


getUserDtl(){
  let is_for = 'user'
  let searchStr = ''
  this.dataSrv.getUserById(searchStr = '',this.currentUser?.id,is_for).subscribe(response => {
    if (!response.error) {
        this.userName = response.body[0]
    } else {
      this._authenticationService.errorToaster(response);
    }
  }, error => {
    this.dataSrv.genericErrorToaster()
  }
  );
}

}
