import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-add-default-role',
  templateUrl: './add-default-role.component.html',
  styleUrls: ['./add-default-role.component.scss']
})
export class AddDefaultRoleComponent implements OnInit {
  @Input() getCheck: any;
  public contentHeader: any;
  formRoleData: any;
  loading:boolean = false;
  prmsUsrId: any;
  currentUser: any;
  allCommunity: any;
  data: any;
  sendValueTrak: any;
  ErrorCheck: boolean;
  SharedValue: any;
  showTrak: any;
  rows: any[];

  constructor(
    private formBuilder : FormBuilder,
    private location : Location,
    private dataSrv : DataService,
    private toaster : ToastrManager,
    private aCtRoute : ActivatedRoute,
    private _router : Router,
    private auth :AuthenticationService,
  ) { 
    this.auth.currentUser.subscribe((x: any) => {
      this.currentUser = x
    })
    
    this.aCtRoute.params.subscribe(
      res => {
          this.prmsUsrId = res;
          
      }
    )
  }

  ngOnInit(): void {
    this.getRole()
    this.contentHeader = {
      headerTitle: this.prmsUsrId?.id ? 'Edit Default Roles' : 'Add Default Roles',
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
            name: 'Default Roles',
            isLink: true,
            link: '/default-roles'
          }
        ]
      }
    };
    this.showTrakAccToRole()
    this.formRoleData = this.formBuilder.group({
      is_for: ['',  Validators.required],
      role_name: ['', Validators.required],
      trak_type: ['',Validators.required],
    })
      if(this.prmsUsrId?.id){
        this.patchVal()
      }
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
    if(this.currentUser?.prmsnId ==2){
      this.data ={
        is_for:this.formRoleData.value.is_for,
        name:this.formRoleData.value.role_name,
        id:this.prmsUsrId.id ? this.prmsUsrId.id : '',
        trak_type:'1',
        default_Role:this.formRoleData.value.default_Role
      }
    }else{
      this.data ={
        is_for:this.formRoleData.value.is_for,
        name:this.formRoleData.value.role_name,
        id:this.prmsUsrId.id ? this.prmsUsrId.id : '',
        trak_type:this.formRoleData.value.trak_type,
        default_Role:this.formRoleData.value.default_Role
      }
    }
  
    if(this.prmsUsrId?.id){
      this.loading=  true;
        this.dataSrv.editRole(this.data).subscribe((res:any)=>{
          if(!res.error){
              this.loading=  false;
            this.toaster.successToastr(res.msg)
            this._router.navigate(['/default-roles'])
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
        this.dataSrv.addDefaultRole(this.data).subscribe((res:any)=>{
          if(!res.error){
              this.loading=  false;
            this.toaster.successToastr(res.msg)
            this._router.navigate(['/default-roles'])
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
  getRoles(){
    // let comunity_id=this.currentUser?.id
    let data = {
      prms : this.currentUser?.prmsnId == '1' ? 'community_id' : this.currentUser?.prmsnId == '2' ? 'agency_id' : 'agency_id',
       id : this.currentUser?.prmsnId == '6' ? null : this.currentUser?.id
    }
    this.dataSrv.getRole(data).subscribe((res:any)=>{
      if(!res.err){
        this.rows = res.body.sort(function(a, b){
          if(a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
          if(a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
          return 0;
      })  ;;
      }else{
      this.toaster.errorToastr('Something went wrong please try again leter')
      }
    },err=>{
      this.dataSrv.genericErrorToaster()
    })
}
  getRole(){
  
    this.dataSrv.getAllRole( ).subscribe((res:any)=>{
      if(!res.err){
      // if(this.currentUser?.prmsnId == '6'){
      //    this.default_Role=  res.body
      // }
      if(this.currentUser?.prmsnId == 6){
        this.rows=[]
      this.rows=  res.body
      }
        
      }
    },err=>{
      this.dataSrv.genericErrorToaster()
    })
  }

  patchVal(){
    this.formRoleData.patchValue({
      is_for:this.prmsUsrId.is_for,
      role_name : this.prmsUsrId.name,
      trak_type:this.prmsUsrId.trak_type,
    })
  }

  goBack(){
    this.location.back()
  }

  getComId(){
    if(this.currentUser?.user_role =='6'){
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
  else{
    this.dataSrv.getMNMGcommunity(this.currentUser?.id).subscribe((response: any) => {
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


  chckBx(e){
    this.ErrorCheck = false;

    if(e.target.value == '0'){
      const checkboxElement: HTMLInputElement | null = document.getElementById('flexRadioDefault2') as HTMLInputElement;

      if (checkboxElement) {
        checkboxElement.checked = false;
      }
    }else{
      const checkboxElement: HTMLInputElement | null = document.getElementById('flexRadioDefault1') as HTMLInputElement;

      if (checkboxElement) {
        checkboxElement.checked = false;
      }
    }
    this.formRoleData.value.trak_type = e.target.value;
    this.SharedValue = ''
    this.SharedValue = e.target.value;
  }

  showTrakAccToRole(){
    this.dataSrv.getCMAccessToByDate(this.auth.currentUserValue.com_id ? this.auth.currentUserValue.com_id : this.auth.currentUserValue.id).subscribe((res:any) => {
      this.showTrak = res.body.access_to
    })
  }

}
