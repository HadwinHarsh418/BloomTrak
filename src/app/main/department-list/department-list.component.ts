import { Component, OnInit } from '@angular/core';
import { DataService } from 'app/auth/service/data.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.scss']
})
export class DepartmentListComponent implements OnInit {
  rows: any=[]
  rl_id: any;
  addPrms: any;
  dltPrms: any;
  edtPrms: any;
  vwPrms: any;
  aplyPrms: any;
  roleData: any=[]
  constructor(
    private toaster : ToastrManager,
    private dataSrv : DataService
  ) { 
    this.getRole()
  }

  ngOnInit(): void {
  }

  getNewDepartment(){
    this.dataSrv.getNewDepartment().subscribe((res:any)=>{
      if(!res.err){
        this.rows = res.body.sort(function(a, b){
          if(a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
          if(a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
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
              if(i.permission_name == 'Department List'){
                this.addPrms  = i.add_permission
                this.dltPrms  = i.delete_permission
                this.edtPrms  = i.edit_permission
                this.vwPrms  = i.view_permission
                this.aplyPrms  = i.apply_permission
              }
            }
          })
          this.getNewDepartment();
          
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
         this.getPrmsnData()
        
      }
    },err=>{
      this.dataSrv.genericErrorToaster()
    })
  }

}
