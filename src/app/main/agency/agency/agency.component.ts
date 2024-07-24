import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { Page } from 'app/utils/models';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { debounceTime, map, distinctUntilChanged } from "rxjs/operators";
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-agency',
  templateUrl: './agency.component.html',
  styleUrls: ['./agency.component.scss']
})
export class AgencyComponent implements OnInit {

  @ViewChild('tablesss') tablesss: ElementRef<any>;
  @ViewChild('searchStrInput', { static: true }) searchStrInput: ElementRef;
  @ViewChild('deleteActivity') deleteActivity: ElementRef<any>;
  @ViewChild('facinal') facinal: ElementRef<any>;
  @ViewChild('addUsers') addUsers: ElementRef<any>;


  public page = new Page();
  public rows = [];
  loadingList: boolean;
  searchStr: string = '';
  searchSub: any = null;
  currentUser: any;
  deletingUser: boolean;
  delUser: boolean;
  startFrom = 0;
  Limit = 10;
  totalNumber: any = 0;

  addCommuniti: boolean;
  active = 1;
  tempAddId: any;

  // Primary!: FormGroup;
  // Servey!: FormGroup;
  // radioData!: FormGroup;
  // managementServey!: FormGroup;
  btnShow: boolean = false;

  activeTab: number = 1;
  // community_id: any;
  id: any;
  userid: any;
  allCommunity: any = [];
  currentUser1: any;
  approvedHide: boolean = false;
  fileToUpload: any;
  addPrms: any;
  dltPrms: any;
  edtPrms: any;
  vwPrms: any;
  showMenuIcon: boolean=false;
  roleData: any=[]
  community_id: any;
  agencyname: any;
  resonIsNull: boolean;
  facinalty_id: any;



  constructor(
    private _authenticationService: AuthenticationService,
    private modalService: NgbModal,
    private dataService: DataService,
    private toastr: ToastrManager,
  ) {
    this.page.size = 10;
    this._authenticationService.currentUser.subscribe((x: any) => {
      this.currentUser = x
    })
    this.getRole()
  }

  ngOnInit(): void {
    this.currentUser?.user_role == 8 ? this.getMngComunity() : this.getCommunityId();
    this.currentUser?.user_role != 8 ? this.setPage({ offset: 0 }) : '';

    fromEvent(this.searchStrInput.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      })
      , debounceTime(1000)
      , distinctUntilChanged()
    ).subscribe((text: string) => {
      this.setPage({ offset: 0 })
    });

  
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
        this.community_id = d.community_id;
        this.setPage({ offset: 0 });
        } else {
          this.toastr.errorToastr(res.msg);
        }
      },
        (err) => {
          this.dataService.genericErrorToaster();
        })
    }
  }


  setPage(pageInfo) {
    if (this.searchSub) {
      this.searchSub.unsubscribe();
      this.searchSub = null;
    }
    this.page.pageNumber = pageInfo.offset;
    let data = {
      pageNo: this.page.pageNumber,
      limitNum: this.page.size,
    };
    this.loadingList = true;
    let typeDrop = false
    let community_id = this.currentUser?.role == 'Community' ? this.currentUser?.id : this.currentUser?.role == 'Admin' ? this.currentUser?.id : this.currentUser?.user_role == 4 ? this.currentUser?.com_id : this.currentUser?.user_role == 8 ? this.community_id : null;
    let is_for= this.currentUser?.role == 'Community' || this.currentUser?.user_role == 8 || this.currentUser?.user_role == 4 ? 'community' : this.currentUser?.role == 'Admin' ? 'management' :'superadmin';
    this.searchSub = this.dataService.getAgency(this.searchStr, this.page.pageNumber, this.page.size, community_id,is_for,typeDrop).subscribe(
      res => {
        if (!res.error) {
          this.rows = res.body;
          this.rows.forEach(i => {
            if (i.approval == 1) {
              i.approval = 'Approved'
              i.approvedHide = false
            } else if (i.approval != 1) {
              i.approval = 'Pending'
              i.approvedHide = true
            }
            // if(i.community_name != null){
            //   i.community_name = i.community_name
            // }else{
            //   i.community_name = '---'
            // }
          }) 
            this.page = res?.pagination
            this.page.pageNumber = Number(res?.pagination?.pageNumber)
       
        } else {
          this._authenticationService.errorToaster(data)
        }
        this.loadingList = false;
      }, error => {
        this.loadingList = false;
      }
    )
  }

  selectCommunity(id:any){
   this.community_id = id
   this.setPage({ offset: 0 });
   
  }

  deletesUser(modal) {
    if (this.currentUser1) {
      let data = {
         id: this.currentUser1.id,
        comid : this.currentUser?.id
      };
      this.deletingUser = true;
      this.dataService.deleteActivity(data).subscribe(res => {
        if (!res.error) {
          this.toastr.successToastr(res.msg);
          this.rows = [];
          this.setPage({ offset: 0 });
          this.closed(modal);
        } else {
          this._authenticationService.errorToaster(res);
        }
        this.deletingUser = false;
      }, error => {
        this.dataService.genericErrorToaster();
        this.deletingUser = false;
      });
    }
  }
  sort(val?:any){
  }
  openDeleteUser(item) {
    this.currentUser1 = item;
    this.modalOpenOSE(this.deleteActivity, 'lg');
  }

  keyupper(facinalty_id: number) {
    if (!facinalty_id) {
        this.resonIsNull = true;
    } else {
        this.resonIsNull = false;
    }
}

  closeded(modal: NgbModalRef) {
    this.facinalty_id = ''
    this.resonIsNull = false;
    modal.dismiss();
  }


  modalOpenOSE(modalOSE, size = 'sm') {
    this.modalService.open(modalOSE,
      {
        backdrop: false,
        size: size,
        centered: true,
      }
    );
  }

  closed(modal: NgbModalRef) {
    modal.dismiss();
    this.currentUser1 = null;
  }

  ngOnDestroy() {
    if (this.searchSub) {
      this.searchSub.unsubscribe();
      this.searchSub = null;
    }
  }
  
  getCommunityId() {
    this.dataService.getCommunityId().subscribe((response: any) => {
      if (response['error'] == false) {
        this.allCommunity = response.body;
        //this.toastr.successToastr(response.msg);
      } else if (response['error'] == true) {
        this.toastr.errorToastr(response.msg);
      }
    },
      (err) => {
        this.dataService.genericErrorToaster();
      })
  }

  giveApproval(row) {
    this.dataService.updateAprroval({ ...{ id: row.id } }).subscribe((res: any) => {
      if (!res.error) {
        this.toastr.successToastr(res.msg);
        this.setPage({ offset: 0 })
      } else {
        this._authenticationService.errorToaster(res);
      }
      this.deletingUser = false;
    }, error => {
      this.dataService.genericErrorToaster();
      this.deletingUser = false;
    });
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

    this.dataService.importAgencies(formdata).subscribe(
      (res:any) => {
        if (!res.error) {
          this.toastr.successToastr(res.msg)
          this.setPage({ offset: 0 })
        } else {
          this.toastr.errorToastr(res.msg)
        }
    }, (error:any) => {
      this.dataService.genericErrorToaster()
    }
    )
  }

  getPrmsnData(){
    this.dataService.getPermissionByAdminRole().subscribe(
      (res:any) => {
        if (!res.error) {
          res.body.map(i=>{
            //comunity
            
            if(this.roleData.includes(i.role_id)){
              
              if(i.permission_name == 'Agency'){
                this.addPrms  = i.add_permission
                this.dltPrms  = i.delete_permission
                this.edtPrms  = i.edit_permission
                this.vwPrms  = i.view_permission
              }
  
              else{
                
                // this.showMenuIcon=true;
                // this.addPrms  = 0
                // this.dltPrms  = 0
                // this.edtPrms  = 0
                // this.vwPrms  = 0
             
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

}
