import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'app/auth/service';
import { Location } from '@angular/common';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DataService } from 'app/auth/service/data.service';

@Component({
  selector: 'app-admin-notifications',
  templateUrl: './admin-notifications.component.html',
  styleUrls: ['./admin-notifications.component.scss']
})
export class AdminNotificationsComponent implements OnInit {
  public formNotification: FormGroup;
  currentUser:any;
  loading:boolean = false;
  dropdownList:any = [];
  selectedItems = [];
  dropdownSettings = {};
  rows: any=[]
  addPrms: any;
  dltPrms: any;
  edtPrms: any;
  vwPrms: any;
  roleData: any=[]
  roleData1: any=[];
  roleData2: any=[];
  constructor(
    private _authenticationService: AuthenticationService, 
    private formBuilder:FormBuilder,private location:Location,
    private tost : ToastrManager,
    private dataService:DataService,
  ) { 
    this.getRole()
    this._authenticationService.currentUser.subscribe((x: any) => {
      this.currentUser = x
      
    });
  }

  ngOnInit(): void {
   this.getNotification()
  }

  getNotification(){
    let data = {usrRole : this.currentUser.prmsnId == '6' ? '6' : '', comId : this.currentUser.prmsnId == '6' ? '' : this.roleData2.includes(this.currentUser.prmsnId) ? this.currentUser.com_id  : this.currentUser.id }
    this.dataService.getNotification(data).subscribe((res:any)=>{
      
      if(!res.error){
        this.rows = res.body
        this.rows.map(i=>{
          if(i.frequency){
            i.frequency = JSON.parse(i.frequency)
          }
        })
          this.loading=  false;
      }else{
        this.loading=  false;
        this.tost.errorToastr(res.msg)
      }
    },err=>{
      this.loading=  false;
      this.dataService.genericErrorToaster()
    })
  }

  openDeleteUser(row){
let data  ={
  id : row.id
}
    this.dataService.deleteNotification(data).subscribe((res:any)=>{
      
      if(!res.error){
          this.loading=  false;
        this.tost.successToastr(res.msg)
        this.getNotification()
      }else{
        this.loading=  false;
        this.tost.errorToastr(res.msg)
      }
    },err=>{
      this.loading=  false;
      this.dataService.genericErrorToaster()
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
    this.dataService.getAllRole().subscribe((res:any)=>{
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
