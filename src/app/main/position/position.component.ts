import { Component, OnInit ,ViewChild,ElementRef} from '@angular/core';
import { Role } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { Page } from 'app/utils/models';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ToastService } from '../components/toasts/toasts.service';
import { PositionService } from './position.service';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { fromEvent } from 'rxjs';



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
  @ViewChild('searchStrInput', { static: true }) searchStrInput: ElementRef;
  allCommunity: any;
  comid: any;
  community_id: any;
  isGaleAgency: any;
  constructor( private positionApi:PositionService, 
    private toaster:ToastrManager,
    private _authenticationService: AuthenticationService, 
    private dataService :  DataService
    ) { 
    this._authenticationService.currentUser.subscribe((x: any) => {
      this.currentUser = x
      
      
    });
    this.currentUser?.user_role == 8 || this.currentUser?.user_role == 3 ? this.getMngComunity() : ''
    this.getRole()
  }

  ngOnInit(): void {
    this.currentUser.user_role == 1 || this.currentUser.user_role == 4 ? this.getcommunityById() : ''
    this.currentUser.user_role !=3 && this.currentUser.user_role != 8 ? this.getPosition() :''
         fromEvent(this.searchStrInput?.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      })
      , debounceTime(1000)
      , distinctUntilChanged()
    ).subscribe((text: string) => { 
      this.getPosition()
    });
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
    let community_id= this.currentUser?.user_role == 4 ? this.currentUser?.com_id : this.currentUser?.user_role == 3 || this.currentUser?.user_role == 8 ? this.community_id : this.currentUser?.id
    
    this.positionApi.getPosition(community_id,this.searchStr).subscribe((res:any)=>{
      this.rows = res.body.sort(function (a, b) {
        if (a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
        if (a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
        return 0;
      });;
      
    },err=>{
      this.toaster.errorToastr('Something went wrong please try again leter')
    })
  }

  dltPostn(row){
    this.positionApi.deletedPosition(row.id).subscribe((res:any)=>{
     this.toaster.successToastr(res.msg)
     this.getPosition()
     this.ngOnInit()
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
        this.getPosition()
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
        this.getPosition()
        } else if (response['error'] == true) {
          this.toaster.errorToastr(response.msg);
        }
      }, (err) => {
        this.dataService.genericErrorToaster();
  
      })
    }
  }
  
  
  selectCommunity(id:any){
    this.community_id = id
    this.getPosition()    
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
    this.dataService.getAllRole().subscribe((res:any)=>{
      if(!res.err){
        // 
         res.body.filter(i=>{ this.roleData.push(i.id.toString())})
         this.getPrmsnData()

      }
    },err=>{
      this.dataService.genericErrorToaster()
    })
  }
  getcommunityById()
{
  this.dataService.getcommunityById(this.currentUser.user_role == 4 ? this.currentUser.com_id : this.currentUser.id).subscribe(response => {
    if (!response.error) {
      if (response.body && response.body[0] && response.body[0]) {
        this.isGaleAgency = response.body[0].gale_flag
      }
    }
  });
}
}
