import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DepartmentService } from './department.service';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

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
  @ViewChild('searchStrInput', { static: true }) searchStrInput: ElementRef;
  allCommunity: any;
  comid: any;
  community_id: any;

  constructor(private departmentApi:DepartmentService, private toaster:ToastrManager,
    private _authenticationService: AuthenticationService,
    private dataService : DataService
    
    ) { 
    this._authenticationService.currentUser.subscribe((x: any) => {
      this.currentUser = x      
    });
    this.getRole()
    this.currentUser?.user_role == 8 || this.currentUser?.user_role == 3 ? this.getMngComunity() : ''

  }

  ngOnInit(): void {
    this.currentUser?.user_role !=3 && this.currentUser?.user_role != 8 ? this.getDepartment() :''
        fromEvent(this.searchStrInput?.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      })
      , debounceTime(1000)
      , distinctUntilChanged()
    ).subscribe((text: string) => { 
      this.getDepartment()
    });
  }
  getDepartment(){
    // if(this.currentUser?.prmsnId == '6'){

      let  isf= ''
      this.departmentApi.getDepartmentListing(this.currentUser?.user_role == 4 ? this.currentUser?.com_id : this.currentUser?.user_role == 3 ? this.community_id : this.currentUser?.user_role == 8 ? this.community_id : this.currentUser?.id,isf,this.searchStr).subscribe((res:any)=>{
        this.rows = res.body.sort(function(a, b){
          if(a.name.trim().toUpperCase() < b.name.trim().toUpperCase()) { return -1; }
          if(a.name.trim().toUpperCase() > b.name.trim().toUpperCase()) { return 1; }
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
      this.toaster.successToastr('Deleted Department successfully')
      this.getDepartment()
    },err=>{
      this.toaster.errorToastr('Something went wrong please try again leter')
    })
  }


  getMngComunity(){
    if(this.currentUser?.id && this.currentUser?.com_id){
      let data = {
        userId : this.currentUser?.id,
        mangId : this.currentUser?.com_id
      }
      this.dataService.getManagementUserCommunities(data).subscribe((res: any) => {
        if (!res.error) {
          let d = res?.body[0].user_added_communities.concat(res?.body[1].userAvailableCommunities);
          // this.mangComs = res.body[1].userAvailableCommunities
          let e=[]
          let c =[]
          d.forEach(element => {
            if(!e.includes(element.community_id)){
              e.push(element.community_id)
              c.push(element)
            }
          });
          this.allCommunity = c.sort(function(a, b){
            if(a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
            if(a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
            return 0;
        })  ;
        this.community_id = d.community_id
        this.getDepartment()
        } else {
          this.toaster.errorToastr(res.msg);
        }
      },
        (err) => {
          this.dataService.genericErrorToaster();
        })
    }
    else{
      this.dataService.getMNMGcommunity(this.currentUser?.id).subscribe((response: any) => {
        if (response['error'] == false) {
          this.allCommunity = response.body.sort(function(a, b){
            if(a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
            if(a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
            return 0;
        })  ;
        this.community_id = response?.body[0]?.cp_id
        this.getDepartment()
        } else if (response['error'] == true) {
          this.toaster.errorToastr(response.msg);
        }
      }, (err) => {
        this.dataService.genericErrorToaster();
  
      })
    }
  }
  
  
  selectCommunity(id:any){
    this.community_id = id;
    this.getDepartment()    
  }


  getPrmsnData(){
    this.dataService.getPermissionByAdminRole().subscribe(
      (res:any) => {
        if (!res.error) {
          // this.rows=[]
          res.body.map(i=>{
            //comunity
            // if(this.roleData.includes(i.role_id)){
              if(i.permission_name == 'Department'){
                this.addPrms  = i.add_permission
              this.dltPrms  = i.delete_permission
              this.edtPrms  = i.edit_permission
              this.vwPrms  = i.view_permission
            //   this.rows=JSON.parse(i.row_data);
            //   this.rows =  this.rows.sort(function(a, b){
            //     if(a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
            //     if(a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
            //     return 0;
            // });
              }
              
            // }
          })
          this.getUsrCom()
        } 
    }, (error:any) => {
      this.dataService.genericErrorToaster()
    }
    )
  }

  getRole(){
    this.dataService.getAllRole().subscribe((res:any)=>{
      if(!res.err){
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
    if(this.currentUser?.prmsnId == 1){
      this.dataService.getcommunityById(this.currentUser?.id).subscribe((res: any) => {
        this.comNm = res.body[0]?.community_name
        this.rows.map(i=>{
          i.comNm = this.comNm
        })
      })
    }else{
      let searchStr = ''
      this.dataService.getUserById(searchStr ,this.currentUser?.id ,'user').subscribe((res: any) => {
        this.comNm = res.body[0]?.linked_with[0]?.community_name
        this.rows.map(i=>{
          i.comNm = this.comNm
        })
      })
    }
  }
   
}
