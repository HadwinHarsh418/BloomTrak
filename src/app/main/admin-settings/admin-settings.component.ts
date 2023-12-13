import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-admin-settings',
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.scss']
})
export class AdminSettingsComponent implements OnInit {

  rows:any=[];
  fileToUpload: any;
  currentUser: any;
  roleData: any[]=[];
  addPrms: any;
  dltPrms: any;
  edtPrms: any;
  vwPrms: any;
  assPrms: any;
  userName: any;
  constructor(
    private dataSrv : DataService,
    private toaster : ToastrManager,
    private _authenticationService : AuthenticationService
  ) { 
    this._authenticationService.currentUser.subscribe((x: any) => {
      this.currentUser = x
    })
    this.getRole()
    this.getPrmsnData()
  }

  ngOnInit(): void {
    this.getSettings();
  }

  getSettings(){
    this.dataSrv.getAdminSetting().subscribe((res:any)=>{
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
    this.dataSrv.deleteAdminSetting(data).subscribe((res:any)=>{
      
      if(!res.error){
        this.toaster.successToastr(res.msg)
        this.getSettings();
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
          this.getSettings()
        } else {
          this.toaster.errorToastr(res.msg)
        }
    }, (error:any) => {
      this.dataSrv.genericErrorToaster()
    }
    )
  }

  getPrmsnData(){
    let post=[];
    this.dataSrv.getPermissionByAdminRole().subscribe(
      (res:any) => {
        if (!res.error) {
          res.body.map(i=>{
            //comunity
            if(this.roleData.includes(i.role_id)){
              // if(i.permission_name == 'Department'){
              //     this.dprtmnt=JSON.parse(i.row_data);
              //     this.frstDp = this.dprtmnt[0]?.name
              //  }
               if(i.permission_name == "Settings"){
                this.addPrms  = i.add_permission
                this.dltPrms  = i.delete_permission
                this.edtPrms  = i.edit_permission
                this.vwPrms  = i.view_permission
                this.assPrms  = i.assignResidentCount_permission
             }
            }
          })
        } 
    }, (error:any) => {
      this.dataSrv.genericErrorToaster()
    }
    )
  }

  getRole(){
    this.dataSrv.getAllRole( ).subscribe((res:any)=>{
      if(!res.err){
      
         res.body.filter(i=>{ this.roleData.push(i.id.toString())})
              // this.roleData.map(i=>{
              //  if(i != 2  && i != 3 && i != 4  && i != 5 && i != 6 ){
              //    this.roleData1.push(i)
              //  }
              // })
        
      }
    },err=>{
      this.dataSrv.genericErrorToaster()
    })
  }
}
