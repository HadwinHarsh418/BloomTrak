import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'app/auth/service/data.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-add-admin-settings',
  templateUrl: './add-admin-settings.component.html',
  styleUrls: ['./add-admin-settings.component.scss']
})
export class AddAdminSettingsComponent implements OnInit {
  public contentHeader: any;
  formRoleData: any;
  loading:boolean = false;
  prmsUsrId: any;

  constructor(
    private formBuilder : FormBuilder,
    private location : Location,
    private dataSrv : DataService,
    private toaster : ToastrManager,
    private aCtRoute : ActivatedRoute,
    private _router : Router,
  ) { 
    this.aCtRoute.params.subscribe(
      res => {
          this.prmsUsrId = res;
      }
    )
  }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: this.prmsUsrId?.id ? 'Edit Settings' : 'Add Settings',
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
            name: 'Settings',
            isLink: true,
            link: '/admin-settings'
          }
        ]
      }
    };

    this.formRoleData = this.formBuilder.group({
      setting_name: ['', Validators.required],
      setting_value:['',Validators.required]
    })

      if(this.prmsUsrId?.id){
        this.getSetting()
      }
  }
  patchVal(){
    this.formRoleData.patchValue({
      setting_name : this.prmsUsrId.name,
      setting_value:""
    })
  }
  getSetting(){
    this.dataSrv.getAdminSettingById(this.prmsUsrId.id).subscribe((res:any)=>{
      if(!res.err){
        
        this.formRoleData.patchValue({
          setting_name: res.body[0].setting_name,
          setting_value: res.body[0].setting_value,
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
        setting_name:this.formRoleData.value.setting_name,
        setting_value:this.formRoleData.value.setting_value,
        id:this.prmsUsrId.id ? this.prmsUsrId.id : ''
      }
    
        this.dataSrv.editAdminSetting(data).subscribe((res:any)=>{
          
          if(!res.error){
              this.loading=  false;
            this.toaster.successToastr(res.msg)
            this._router.navigate(['/admin-settings'])
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
      
      let data ={
                setting_name:this.formRoleData.value.setting_name,
                setting_value:this.formRoleData.value.setting_value,
       }
            this.dataSrv.addAdminSetting(data).subscribe((res:any)=>{
          
          if(!res.error){
              this.loading=  false;
            this.toaster.successToastr(res.msg)
            this._router.navigate(['/admin-settings'])
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


}
