import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'app/auth/service/data.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-add-menu',
  templateUrl: './add-menu.component.html',
  styleUrls: ['./add-menu.component.scss']
})
export class AddMenuComponent implements OnInit {

  public contentHeader: any;
  loading:boolean = false;
  formData: any;
  prmsUsrId: any;
  dataDetl: any;
  errTru: boolean;

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
          this.getPermissionByID(res)
      }
    )
   }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: this.prmsUsrId?.id ? 'Edit Menu': 'Add Menu',
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
            name: 'Menu',
            isLink: true,
            link: '/span-trak'
          }
        ]
      }
    };

    this.formData = this.formBuilder.group({
      name: ['', Validators.required],
      shift_type1: [''],
      shift_type2: [''],
      shift_type3: [''],
      shift_type4: [''],
    })

    
  }

  get FormData_Control(){
    return this.formData.controls;
    
  }

  submitted(){
    for (let item of Object.keys(this.FormData_Control)) {
      this.FormData_Control[item].markAsDirty()
    }
    if (this.formData.invalid) {
      this.errTru =true
      return;
    }
    
    if(!this.FormData_Control.shift_type1.value && !this.FormData_Control.shift_type2.value && !this.FormData_Control.shift_type3.value && !this.FormData_Control.shift_type4.value){
        this.errTru =true
      return;
    }

    let data ={
      name: this.formData.value.name,
      shift_type:this.formData.value.shift_type1 == true ? '0' : this.formData.value.shift_type2 == true ? '1' : this.formData.value.shift_type4 == true ? '3' : '2' ,
      id:this.prmsUsrId.id ? this.prmsUsrId.id : ''
    }

    if(this.prmsUsrId?.id){
      this.loading=  true;
      this.dataSrv.editPermission(data).subscribe((res:any)=>{
        if(!res.error){
            this.loading=  false;
          this.toaster.successToastr(res.msg)
          this._router.navigate(['/menu'])
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
      this.dataSrv.addPermission(data).subscribe((res:any)=>{
        if(!res.error){
            this.loading=  false;
          this.toaster.successToastr(res.msg)
          this._router.navigate(['/menu'])
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

  goBack(){
    this.location.back()
  }

  getPermissionByID(res){
    this.dataSrv.getPermissionByID(res.id).subscribe((res:any)=>{
      if(!res.err){
        this.dataDetl = res.body[0];
        if(this.dataDetl?.id){
          this.patchVal()
        }
      }else{
      this.toaster.errorToastr('Something went wrong please try again leter')
      }
    },err=>{
      this.dataSrv.genericErrorToaster()
    })
  }

  patchVal(){
    this.formData.patchValue({
      name : this.dataDetl.name,
      shift_type1: this.dataDetl.shift_type == 0 ? '0' : false,
      shift_type2: this.dataDetl.shift_type == 1 ? '1' : false,
      shift_type3: this.dataDetl.shift_type == 2 ? '2' : false,
      shift_type4: this.dataDetl.shift_type == 3 ? '3' : false,
    })
  }

  chckBx(e){
    if(e.target.checked){
      this.errTru =false
    }
    if(!this.FormData_Control.shift_type1.value && !this.FormData_Control.shift_type2.value && !this.FormData_Control.shift_type3.value && !this.FormData_Control.shift_type4.value){
      this.errTru =true
  }
  }

}
