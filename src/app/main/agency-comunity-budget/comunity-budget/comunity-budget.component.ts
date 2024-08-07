import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { BudgetServiceService } from '../budget-service.service';

@Component({
  selector: 'app-comunity-budget',
  templateUrl: './comunity-budget.component.html',
  styleUrls: ['./comunity-budget.component.scss']
})
export class ComunityBudgetComponent implements OnInit {
  rows:any; 
  currentUser: any;
  addPrms: any;
  dltPrms: any;
  edtPrms: any;
  vwPrms: any;
  roleData: any=[];
  allAgency: any[];
  selectAgency: any;
  allCommunity: any;
  selectCommunity: any;

  constructor(private _authenticationService:AuthenticationService,
    private toaster:ToastrManager, private budgetService:BudgetServiceService,
    private _router:Router,
    private dataService : DataService
    ) {
   this._authenticationService.currentUser.subscribe((x: any) => {
     this.currentUser = x
   });
   this.getAllAgency()
   
   this.getRole()
   this.currentUser?.user_role == 3 || this.currentUser?.user_role == 8 ? this.getMngComunity() : ''
   this.getBudget()
  }

  ngOnInit(): void {
  }

  getAllAgency(){
    this.dataService.getAgencyForManagement().subscribe(res=>{
      this.allAgency = res.body;
      this.selectAgency=res.body[0]?.id;
      this.getBudget()
    })
  }
  chngCom(comId){
    this.selectCommunity = comId;
    this.getBudget()
  }

  getPrmsnData(){
    this.dataService.getPermissionByAdminRole().subscribe(
      (res:any) => {
        if (!res.error) {
           res.body.map(i=>{
            //comunity
            if(this.roleData.includes(i.role_id)){
              if(i.permission_name == 'Agency Budget'){
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
  getMngComunity(){
    this.dataService.getMNMGcommunity(this.currentUser?.id).subscribe((response: any) => {
      if (response['error'] == false) {
        this.allCommunity = response.body.sort(function(a, b){
          if(a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
          if(a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
          return 0;
      });
      this.selectCommunity = response.body[0].cp_id;
      this.getBudget(this.selectCommunity)
    }})
  }
  getBudget(id?){
    this.budgetService.getBudget(this.currentUser?.user_role == 3 ? this.selectCommunity : id??this.currentUser?.id).subscribe((res:any)=>{
    if(!res.err){
      this.rows = res?.body.map(i=>{
        i.months = i.months == 'January' ? '01' : i.months == 'February' ? '02' : i.months == 'March' ? '03' :
        i.months == 'April' ? '04' : i.months == 'May' ? '05': i.months == 'June' ? '06':
        i.months == 'July' ? '07': i.months == 'August' ? '08': i.months == 'September' ? '09':
        i.months == 'October' ? '10': i.months == 'November' ? '11': '12';
        return i;
  }).sort(function(a, b){
        if(a.year.toUpperCase() < b.year.toUpperCase()) { return -1; }
        if(a.year.toUpperCase() > b.year.toUpperCase()) { return 1; }
        
        if(a.months.toUpperCase() < b.months.toUpperCase()) { return -1; }
        if(a.months.toUpperCase() > b.months.toUpperCase()) { return 1; }
        return 0;
    });
    }else{
      this.toaster.errorToastr(res.msg)
    }
  },err=>{
    this.toaster.errorToastr('Something went   please try again leter')
  })
  }
  deleteBudget(data){
    this.budgetService.deleteBudget(data).subscribe((res:any)=>{
      if(!res.error){
        this.rows = res.body;
        this.getBudget()
        this.toaster.successToastr(res.msg)

      }else{
        this.toaster.errorToastr(res.msg)
      }
    },err=>{
      this.toaster.errorToastr('Something went wrong please try again leter')
    })


  }

  getRole(){
    this.dataService.getAllRole().subscribe((res:any)=>{
      if(!res.err){
        // console.log("Roles------",res.body);
         res.body.filter(i=>{ this.roleData.push(i.id.toString())})
         this.getPrmsnData()
      }
    },err=>{
      this.dataService.genericErrorToaster()
    })
  }
}
