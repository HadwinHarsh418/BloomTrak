import { Component, OnInit } from '@angular/core';
import { Role } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { Page } from 'app/utils/models';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ToastService } from '../components/toasts/toasts.service';
import { PositionService } from './position.service';

@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.scss']
})
export class PositionComponent implements OnInit {

  public rows: any;
  searchStr:string='';
  public role:Role;
  searchSub: any = null;
  userRoles: any[] = [Role.Admin, Role.Community]
  public page = new Page();
  loadingList: boolean;
  currentUser: any;
  id: { id: any; };
  crrntUsrId: any[] = []
  cols: string;
  addPrms: any;
  dltPrms: any;
  edtPrms: any;
  vwPrms: any;
  roleData: any=[]
  constructor( private positionApi:PositionService, 
    private toaster:ToastrManager,
    private _authenticationService: AuthenticationService, 
    private dataService :  DataService
    ) { 
    this._authenticationService.currentUser.subscribe((x: any) => {
      this.currentUser = x
      
      
    });
    this.getRole()
  }

  ngOnInit(): void {
    this.getPosition()
  }

  setPage(pageInfo) {
    if (this.searchSub) {
      this.searchSub.unsubscribe();
      this.searchSub = null;
    }
    this.page.pageNumber = pageInfo.offset;
    this.loadingList = true;
      this.getPosition()
  }

  getPosition(){
    let community_id= this.currentUser.user_role == 4 ? this.currentUser.com_id : this.currentUser.id
    
    this.positionApi.getPosition(community_id).subscribe((res:any)=>{
      this.rows = res.body;
      
    },err=>{
      this.toaster.errorToastr('Something went wrong please try again leter')
    })
  }

  dltPostn(row){
    this.positionApi.deletedPosition(row.id).subscribe((res:any)=>{
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
            // comunity
            if(this.roleData.includes(i.role_id)){
              if(i.permission_name == 'Position'){
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
        // 
         res.body.filter(i=>{ this.roleData.push(i.id.toString())})
         this.getPrmsnData()

      }
    },err=>{
      this.dataService.genericErrorToaster()
    })
  }
}
