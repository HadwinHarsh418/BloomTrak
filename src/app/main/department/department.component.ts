import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DepartmentService } from './department.service';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit {
  public rows: any;
  searchStr:string='';
  currentUser: any;
  addPrms: any;
  dltPrms: any;
  edtPrms: any;
  vwPrms: any;
  roleData: any=[]
  roleData1: any=[];
  comNm: any;
  constructor(private departmentApi:DepartmentService, private toaster:ToastrManager,
    private _authenticationService: AuthenticationService,
    private dataService : DataService
    
    ) { 
    this._authenticationService.currentUser.subscribe((x: any) => {
      this.currentUser = x
      console.log(this.currentUser);
      
    });
    this.getRole()
  }

  ngOnInit(): void {
    this.getDepartment()
  }
  getDepartment(){
    // if(this.currentUser.prmsnId == '6'){
      let  isf= ''
      this.departmentApi.getDepartmentListing(this.currentUser.id,isf).subscribe((res:any)=>{
        this.rows = res.body.sort(function(a, b){
          if(a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
          if(a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
          return 0;
      });
      },err=>{
        this.toaster.errorToastr('Something went wrong please try again leter')
      })
    // }
   
 
  }

  dltDprtmnt(row){
    this.departmentApi.deletedDepartment(row.id).subscribe((res:any)=>{
      // this.rows = res.body;
      this.toaster.successToastr(res.msg)
      this.ngOnInit()
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
              if(i.permission_name == 'Department'){
                this.addPrms  = i.add_permission
              this.dltPrms  = i.delete_permission
              this.edtPrms  = i.edit_permission
              this.vwPrms  = i.view_permission
              // this.rows=JSON.parse(i.row_data);
            //   this.rows =  this.rows.sort(function(a, b){
            //     if(a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
            //     if(a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
            //     return 0;
            // });
              }
            }
          })
          this.getUsrCom()
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
          if(i != 6 ){
            this.roleData1.push(i)
          }
         
         })
         this.getPrmsnData()
        
      }
    },err=>{
      this.dataService.genericErrorToaster()
    })
  }
 
  getUsrCom(){
    if(this.currentUser.prmsnId == 1){
      this.dataService.getcommunityById(this.currentUser.id).subscribe((res: any) => {
        this.comNm = res.body[0]?.community_name
        this.rows.map(i=>{
          i.comNm = this.comNm
        })
      })
    }else{
      let searchStr = ''
      this.dataService.getUserById(searchStr ,this.currentUser.id ,'user').subscribe((res: any) => {
        this.comNm = res.body[0]?.linked_with[0]?.community_name
        this.rows.map(i=>{
          i.comNm = this.comNm
        })
      })
    }
  }
   
}
