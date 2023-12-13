import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.scss']
})
export class VendorComponent implements OnInit {
  rows: any= []
  rl_id: any;
  aplyPrms: any;
  addPrms: any;
  dltPrms: any;
  edtPrms: any;
  vwPrms: any;
  roleData: any =[]
  currentUser: any;
  roleData1: any=[];
  roleData2: any=[];

  constructor(
    private _authenticationService : AuthenticationService,
    private toaster : ToastrManager,
    private dataSrv : DataService
  ) {
    this._authenticationService.currentUser.subscribe((x: any) => {
      this.currentUser = x
    })
    this.getRole()
   }

  ngOnInit(): void {
  }

  getVendor(){
    let data = {usrRole : this.currentUser.prmsnId == '6' ? '6' : '', comId : this.currentUser.prmsnId == '6' ? '' : this.roleData2.includes(this.currentUser.prmsnId) ? this.currentUser.com_id  : this.currentUser.id }
    this.dataSrv.getVendor(data).subscribe((res:any)=>{
      if(!res.err){
        this.rows = res.body.sort(function(a, b){
          if(a.vendor_name.toUpperCase() < b.vendor_name.toUpperCase()) { return -1; }
          if(a.vendor_name.toUpperCase() > b.vendor_name.toUpperCase()) { return 1; }
          return 0;
      })  ;;
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
    this.dataSrv.deleteVendor(data).subscribe((res:any)=>{
      if(!res.error){
        this.toaster.successToastr(res.msg)
        this.getVendor()
      }else{
        this.toaster.errorToastr(res.msg)
      }
    },err=>{
      this.dataSrv.genericErrorToaster()
    })
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
              if(i.trak_type == '0')
              if(i.permission_name == 'Vendor List'){
                this.addPrms  = i.add_permission
                this.dltPrms  = i.delete_permission
                this.edtPrms  = i.edit_permission
                this.vwPrms  = i.view_permission
                this.aplyPrms  = i.apply_permission
              }
            }
          })
          this.getVendor();
          
        } 
    }, (error:any) => {
      this.dataSrv.genericErrorToaster()
    }
    )
  }

  getRole(){
    this.dataSrv.getAllRole( ).subscribe((res:any)=>{
      if(!res.err){
        // console.log("Roles------",res.body);
         res.body.filter(i=>{ this.roleData.push(i.id.toString())})
         this.roleData.map(i=>{
          if(i != 2 && i != 3  && i != 4 && i != 5 && i != 6 ){
            this.roleData1.push(i)
          }
          if(i != 1 && i != 2 && i != 3  && i != 4 && i != 5 && i != 6 ){
            this.roleData2.push(i)
          }
         })
         this.getPrmsnData()
        
      }
    },err=>{
      this.dataSrv.genericErrorToaster()
    })
  }

}
