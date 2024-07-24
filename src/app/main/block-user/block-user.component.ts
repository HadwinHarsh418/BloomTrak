import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Page } from 'app/utils/models';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { log } from 'console';

@Component({
  selector: 'app-block-user',
  templateUrl: './block-user.component.html',
  styleUrls: ['./block-user.component.scss']
})
export class BlockUserComponent implements OnInit {
  @ViewChild('searchStrInput', { static: true }) searchStrInput: ElementRef;
  searchStr: string = '';
  searchSub: any;
  public page = new Page();
  loadingList: boolean;
  currenttab: any = 'community';
  currentUser: any;
  public rows = [];
  workingUserHide: boolean =false;
  blckBtnHide: boolean =false;
  @ViewChild('deleteActivity') deleteActivity: ElementRef<any>;
  @ViewChild('ReinstateActivity') ReinstateActivity: ElementRef<any>;
  rowsDtal: any;
  allCommunity1: any;
  community_id: any;
  rows1: any;

  constructor(
    private _authenticationService: AuthenticationService,
    private dataService : DataService,
    private tost :ToastrManager,
    private modalService: NgbModal,

  ) { 
    this.page.size = 10;
    this._authenticationService.currentUser.subscribe((x: any) => {
      this.currentUser = x
    })
    this.currentUser?.user_role == 3 || this.currentUser?.user_role == 8 ? this.getMngComunity() : this.currentUser?.user_role == 1 ? '' : this.currentUser?.user_role == 4 ? this.getCommunityUserWorking() : this.getCommunityByAgencyID()
    // if(this.currentUser?.user_role == 3 || this.currentUser?.user_role == 8)
    // this.getMngComunity()
    // else
    // this.getCommunityByAgencyID()
  }

  ngOnInit(): void {
    if(this.currentUser?.role != 'Agency' && this.currentUser?.user_role != 5 && this.currentUser?.user_role == 8 || this.currentUser?.user_role == 3 || this.currentUser?.user_role == 1 || this.currentUser?.user_role == 6)
      this.getCommunityUserWorking();
  }
  searchFilter(val){
    if( this.workingUserHide == true){
      this.getBLockedUser(val)
          }else{
            this.getCommunityUserWorking(val);
      
          }
  }


  getMngComunity(){
    if(this.currentUser?.id && this.currentUser?.com_id){
      let data = {
        userId : this.currentUser?.id,
        mangId : this.currentUser?.management
      }
      this.dataService.getManagementUserCommunities(data).subscribe((res: any) => {
        if (!res.error) {
          // this.mangComs = res.body[1].userAvailableCommunities
          let d:any[] = res?.body[0].user_added_communities.concat(res?.body[1].userAvailableCommunities);
          const uniqueArray = d.filter((obj, index, self) =>
                index === self.findIndex((t) => (
                    t.community_id === obj.community_id &&
                    t.community_name === obj.community_name &&
                    t.community_short_name === obj.community_short_name
                ))
            );
          this.allCommunity1 = uniqueArray.sort(function(a, b){
            if(a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
            if(a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
            return 0;
        })  ;
        this.community_id = this.allCommunity1[0]?.community_id
      this.getCommunityUserWorking();
        } else {
          this.tost.errorToastr(res.msg);
        }
      },
        (err) => {
          this.dataService.genericErrorToaster();
        })
    }
    else{
      this.dataService.getMNMGcommunity(this.currentUser?.id).subscribe((response: any) => {
        if (response['error'] == false) {
          this.allCommunity1 = response.body.sort(function(a, b){
            if(a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
            if(a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
            return 0;
        })  ;
        this.community_id = response?.body[0]?.cp_id
      this.getCommunityUserWorking();
          //this.toastr.successToastr(response.msg);
        } else if (response['error'] == true) {
          this.tost.errorToastr(response.msg);
        }
      }, (err) => {
        this.dataService.genericErrorToaster();
  
      })
    }
  }


  getCommunityUserWorking(searchVal?:any){
    this.currenttab = 'community'
    this.workingUserHide = false
    this.dataService.getCommunityUserWorking( [3,8].includes(this.currentUser?.user_role) ? this.community_id : this.currentUser?.com_id || this.currentUser?.id,searchVal?? '').subscribe(
      res => {
        if (!res.error) {
          this.rows = res.body.sort(function(a, b){
            if(a.last_name.toUpperCase() < b.last_name?.toUpperCase()) { return -1; }
            if(a.last_name.toUpperCase() > b.last_name?.toUpperCase()) { return 1; }
            return 0;
        })  ;
          this.rows.map(i=>{
            if(i.is_deleted == 0){
              this.blckBtnHide = false
            }else{
              this.blckBtnHide = true

            }
          })
        
        } else {
          this.dataService.genericErrorToaster()
        }
        this.loadingList = false;
      }, error => {
        this.loadingList = false;
      }
    )
  }

  getBLockedUser(searchVal?:any){
    this.currenttab = 'block'
    this.workingUserHide = true
    if(this.currentUser?.user_role == 4)
    this.dataService.getBLockedUserAccRole(searchVal?? '',this.currentUser?.com_id).subscribe(
      res => {
        if (!res.error) {
          this.rows = res.body;
          this.rows.map(i=>{
            if(i.is_deleted == 0){
              this.blckBtnHide = false
            }else{
              this.blckBtnHide = true

            }
          })
        
        } else {
          this.dataService.genericErrorToaster()
        }
        this.loadingList = false;
      }, error => {
        this.loadingList = false;
      }
    )
    else
    this.dataService.getBLockedUser(searchVal?? '',this.currentUser?.user_role == 1 ? this.currentUser?.id : this.community_id,this.currentUser?.user_role == 3 || this.currentUser?.user_role == 1 ? '' : this.currentUser?.user_role == 5 ? this.currentUser?.com_id : this.currentUser?.id).subscribe(
      res => {
        if (!res.error) {
          this.rows = res.body;
          this.rows.map(i=>{
            if(i.is_deleted == 0){
              this.blckBtnHide = false
            }else{
              this.blckBtnHide = true

            }
          })
        
        } else {
          this.dataService.genericErrorToaster()
        }
        this.loadingList = false;
      }, error => {
        this.loadingList = false;
      }
    )
  }

  getCommunityByAgencyID() {
    this.dataService.getCommunityByAgencyID(this.currentUser?.user_role == 5 ? this.currentUser?.com_id : this.currentUser?.id).subscribe((response: any) => {
      if (response['error'] == false) {
        this.allCommunity1 = response.body;
        this.community_id = response.body[0]?.community_id;
        this.getBLockedUser()
      } 
    },
      (err) => {
        this.dataService.genericErrorToaster();
      })
  }
  
  selectCommunity1(id:any){
    this.community_id=id;
    
    this.currenttab == 'block' ? this.getBLockedUser() : this.getCommunityUserWorking()
  }

  addBLockedUser(rows){
    this.rowsDtal = rows
    this.modalOpenOSE(this.deleteActivity, 'lg');
  }

  closed(modal: NgbModalRef) {
    modal.dismiss();
  }
  deletedBLocked(row){
    this.rows1 = row
    this.modalOpenOSE(this.ReinstateActivity, 'lg');

  }
  
  deletedBLockedUser(){
    this.dataService.deletedBLockedUser(this.rows1.user_id).subscribe(
      (res:any) => {
        if (!res.error) {
          this.rows = res.body;         
          this.tost.successToastr("Reinstate User Successfully")
          this.modalService.dismissAll()
        this.getBLockedUser()
        } else {
          this.dataService.genericErrorToaster()
        }
        this.loadingList = false;
      }, error => {
        this.loadingList = false;
      }
    )
  }

  deletesUser(){
    let data = {
      community_id :this.rowsDtal.community_id,
      agency_id: this.rowsDtal.assigned_id,
      user_id : this.rowsDtal.user_id,
    }
    this.dataService.addBLockedUser(data).subscribe(
      (res:any) => {
        if (!res.error) {
          this.tost.successToastr("Block User Successfully")
          this.modalService.dismissAll()
          this.getCommunityUserWorking();
          this.ngOnInit()
        } else {
          this.dataService.genericErrorToaster()
        }
      }
    )
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

}
