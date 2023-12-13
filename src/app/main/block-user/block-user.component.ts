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
  currentUser: any;
  public rows = [];
  workingUserHide: boolean =false;
  blckBtnHide: boolean =false;
  @ViewChild('deleteActivity') deleteActivity: ElementRef<any>;
  rowsDtal: any;

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
  }

  ngOnInit(): void {
    if(this.currentUser.role == 'Agency'){
this.getBLockedUser()
    }else{
      this.getCommunityUserWorking();

    }
  }
  searchFilter(val){
    if( this.workingUserHide == true){
      this.getBLockedUser(val)
          }else{
            this.getCommunityUserWorking(val);
      
          }
  }

  getCommunityUserWorking(val?:any){
    this.workingUserHide = false
    this.dataService.getCommunityUserWorking(this.currentUser.com_id || this.currentUser.id,val).subscribe(
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

  getBLockedUser(searchVal?:any){
    this.workingUserHide = true
    this.dataService.getBLockedUser(searchVal?? '').subscribe(
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

  addBLockedUser(rows){
    this.rowsDtal = rows
    this.modalOpenOSE(this.deleteActivity, 'lg');
  }

  closed(modal: NgbModalRef) {
    modal.dismiss();
  }
  
  deletedBLockedUser(row){
    this.dataService.deletedBLockedUser(row.user_id).subscribe(
      (res:any) => {
        if (!res.error) {
          this.rows = res.body;
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
          this.tost.successToastr(res.msg)
          this.modalService.dismissAll()
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
