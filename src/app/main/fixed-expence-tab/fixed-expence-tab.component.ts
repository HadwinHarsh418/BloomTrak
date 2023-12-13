import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-fixed-expence-tab',
  templateUrl: './fixed-expence-tab.component.html',
  styleUrls: ['./fixed-expence-tab.component.scss']
})
export class FixedExpenceTabComponent implements OnInit {
  currentUser: any;
  rows: any;
  rl_id: any;
  aplyPrms: any;
  addPrms: any;
  dltPrms: any;
  edtPrms: any;
  vwPrms: any;
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

  getFixeExpensesTable(){
    this.dataSrv.getFixeExpensesTable().subscribe((res:any)=>{
      if(!res.err){
        this.rows = res.body
         this.rows.map(i=>{
          if(i.entered != null){
            i.entered1 = i.entered
          }else{
            i.entered1 = i.entered_by_community
          }
        })
       
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
    this.dataSrv.deleteFixeExpensesTable(data).subscribe((res:any)=>{
      if(!res.error){
        this.toaster.successToastr(res.msg)
        this.getFixeExpensesTable();
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
              if(i.permission_name == 'Fixed Expense Table'){
                this.addPrms  = i.add_permission
                this.dltPrms  = i.delete_permission
                this.edtPrms  = i.edit_permission
                this.vwPrms  = i.view_permission
                this.aplyPrms  = i.apply_permission
              }
            }
          })
          this.getFixeExpensesTable();
          
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
