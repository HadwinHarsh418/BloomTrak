import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-agency-holiday',
  templateUrl: './agency-holiday.component.html',
  styleUrls: ['./agency-holiday.component.scss']
})
export class AgencyHolidayComponent implements OnInit {
  searchStr:any;
  currentUser: any;
  rows: any;
  addPrms: any;
  dltPrms: any;
  edtPrms: any;
  vwPrms: any;
  roleData: any=[];
  constructor(
    private dtsrv: DataService,
    private _authenticationService : AuthenticationService,
    private toaster : ToastrManager
  ) { 
    this._authenticationService.currentUser.subscribe((x: any) => {
      this.currentUser = x
      
    });
    this.getRole()
  }

  ngOnInit(): void {
    this.getHoliday()
  }

  getHoliday(){
    let data = { 
      id:this.currentUser.id
    }
    this.dtsrv.getHoliday(data).subscribe((res:any)=>{
      this.rows = res.body;
    },err=>{
      this.toaster.errorToastr('Something went wrong please try again leter')
    })
  }

  getPrmsnData(){
    this.dtsrv.getPermissionByAdminRole().subscribe(
      (res:any) => {
        if (!res.error) {
          res.body.map(i=>{
            //comunity
            if(this.roleData.includes(i.role_id)){
              if(i.trak_type == '1')
              if(i.permission_name == 'Agency Holiday'){
                this.addPrms  = i.add_permission
              this.dltPrms  = i.delete_permission
              this.edtPrms  = i.edit_permission
              this.vwPrms  = i.view_permission
              }
            }
          })
          
        } 
    }, (error:any) => {
      this.dtsrv.genericErrorToaster()
    }
    )
  }

  getRole(){
    this.dtsrv.getAllRole( ).subscribe((res:any)=>{
      if(!res.err){
        // console.log("Roles------",res.body);
         res.body.filter(i=>{ this.roleData.push(i.id.toString())})
         this.getPrmsnData()

      }
    },err=>{
      this.dtsrv.genericErrorToaster()
    })
  }
}
