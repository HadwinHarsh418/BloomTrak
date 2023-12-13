import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CertificationService } from './certification.service';

@Component({
  selector: 'app-certification',
  templateUrl: './certification.component.html',
  styleUrls: ['./certification.component.scss']
})
export class CertificationComponent implements OnInit {
  public rows: any;
  searchStr:string='';
  currentUser: any;
  addPrms: any;
  dltPrms: any;
  edtPrms: any;
  vwPrms: any;
  roleData: any=[]
  roleData1: any=[];
  roleData2: any=[];
  constructor(private _authenticationService:AuthenticationService,
     private toaster:ToastrManager, private certificationService:CertificationService,
     private _router:Router,
     private dataService : DataService
     ) {
    this._authenticationService.currentUser.subscribe((x: any) => {
      this.currentUser = x
    });
    this.getRole()
   }

  ngOnInit(): void {
    this.getCertification()
  }
  getCertification(){
    let community_id= this.currentUser.user_role == 4 ? this.currentUser.com_id : this.currentUser.id

    let data = {usrRole : this.currentUser.prmsnId == '6' ? '6' : '', comId : community_id}
    this.certificationService.getCertificationListing(data).subscribe((res:any)=>{
      if(!res.err){
        this.rows = res.body;
      }else{
      this.toaster.errorToastr('Something went wrong please try again leter')
      }
    },err=>{
      this.toaster.errorToastr('Something went wrong please try again leter')
    })
}

dltCrtfctn(row){
  this.certificationService.deletedCertification(row.id).subscribe((res:any)=>{
    if(!res.err){
      this.toaster.successToastr(res.msg)
      this.ngOnInit()
    }else{
    this.toaster.errorToastr('Something went wrong please try again leter')
    }
  },err=>{
    this.toaster.errorToastr('Something went wrong please try again leter')
  })
}

getPrmsnData(){
  this.dataService.getPermissionByAdminRole().subscribe(
    (res:any) => {
      if (!res.error) {
        res.body.map(i=>{
          //comunity
          if(this.roleData.includes(i.role_id)){
            if(i.permission_name == 'Certification'){
              this.addPrms  = i.add_permission
            this.dltPrms  = i.delete_permission
            this.edtPrms  = i.edit_permission
            this.vwPrms  = i.view_permission
            }
          }
        })
        
      } 
  }, (error:any) => {
    this.dataService.genericErrorToaster()
  }
  )
}

getRole(){
  this.dataService.getAllRole( ).subscribe((res:any)=>{
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
    this.dataService.genericErrorToaster()
  })
}

}
