import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-payment-type',
  templateUrl: './payment-type.component.html',
  styleUrls: ['./payment-type.component.scss']
})
export class PaymentTypeComponent implements OnInit {
  rows:any=[];
  currentUser: any;
  fileToUpload: any;
  rl_id: any;
  addPrms: any;
  dltPrms: any;
  edtPrms: any;
  vwPrms: any;
  aplyPrms: any;
  roleData: any=[]
  constructor(
    private dataSrv : DataService,
    private toaster : ToastrManager,
    private _authenticationService : AuthenticationService
  ) { 
    this._authenticationService.currentUser.subscribe((x: any) => {
      this.currentUser = x
    })
    this.getRole()
  }

  ngOnInit(): void {
  }

  getType(){
    this.dataSrv.getPaymentType().subscribe((res:any)=>{
      if(!res.err){
        this.rows = res.body;
      }
      else{
        this.toaster.errorToastr('Something went wrong please try again leter')
      }
    },err=>{
        this.dataSrv.genericErrorToaster()
    })
  }

  delete(id){
    
    let data ={
      id: id,
    }
    this.dataSrv.deletePaymentType(data).subscribe((res:any)=>{
      
      if(!res.error){
        this.toaster.successToastr(res.msg)
        this.getType();
      }else{
        this.toaster.errorToastr(res.msg)
      }
    },err=>{
      this.dataSrv.genericErrorToaster()
    })
  }

  @ViewChild('fileInput') elfile: ElementRef;
  onFileInput(files: any) {
    if (files.length === 0) {
      return;
    }
    let type = files[0].type;
    this.fileToUpload = files[0];
    this.uploadNow()
  }

  uploadNow() {
    
    let formdata = new FormData();
    formdata.append('report',this.fileToUpload)

    this.dataSrv.importAgencies(formdata).subscribe(
      (res:any) => {
        if (!res.error) {
          this.toaster.successToastr(res.msg)
          this.getType()
        } else {
          this.toaster.errorToastr(res.msg)
        }
    }, (error:any) => {
      this.dataSrv.genericErrorToaster()
    }
    )
  }

  getPrmsnData(){
    this.dataSrv.getPermissionByAdminRole().subscribe(
      (res:any) => {
        if (!res.error) {
          res.body.map(i=>{
            // 'community','agency administrator','employee', 'agenciesuser'
            if(this.roleData.includes(i.role_id)){
              if(i.role_id ==15){
                this.rl_id = i.role_id
              }
              if(i.permission_name == 'Payment Type'){
                this.addPrms  = i.add_permission
                this.dltPrms  = i.delete_permission
                this.edtPrms  = i.edit_permission
                this.vwPrms  = i.view_permission
                this.aplyPrms  = i.apply_permission
              }
            }
          })
          this.getType();
          
        } 
    }, (error:any) => {
      this.dataSrv.genericErrorToaster()
    }
    )
  }

  getRole(){
    this.dataSrv.getAllRole( ).subscribe((res:any)=>{
      if(!res.err){
        // 
         res.body.filter(i=>{ this.roleData.push(i.id.toString())})
         this.getPrmsnData();
        
      }
    },err=>{
      this.dataSrv.genericErrorToaster()
    })
  }

}
