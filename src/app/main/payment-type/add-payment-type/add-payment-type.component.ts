import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'app/auth/service/data.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-add-payment-type',
  templateUrl: './add-payment-type.component.html',
  styleUrls: ['./add-payment-type.component.scss']
})
export class AddPaymentTypeComponent implements OnInit {
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
      headerTitle: this.prmsUsrId?.id ? 'Edit Payment Type' : 'Add Payment Type',
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
            name: 'Payment Type',
            isLink: true,
            link: '/payment_type'
          }
        ]
      }
    };
    this.formRoleData = this.formBuilder.group({
      type_name: ['', Validators.required],
    })
      if(this.prmsUsrId?.id){
        this.patchVal()
      }
  }

  patchVal(){
    this.formRoleData.patchValue({
      type_name : this.prmsUsrId.name
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
    let data ={
      name:this.formRoleData.value.type_name,
    }
    if(this.prmsUsrId?.id){
      this.loading=  true;
      
      let data ={
        name:this.formRoleData.value.type_name,
        id:this.prmsUsrId.id
      }
        this.dataSrv.editPaymentType(data).subscribe((res:any)=>{
          
          if(!res.error){
              this.loading=  false;
            this.toaster.successToastr(res.msg)
            this._router.navigate(['/payment_type'])
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
      
        this.dataSrv.addPaymentType(data).subscribe((res:any)=>{
          
          if(!res.error){
              this.loading=  false;
            this.toaster.successToastr(res.msg)
            this._router.navigate(['/payment_type'])
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
