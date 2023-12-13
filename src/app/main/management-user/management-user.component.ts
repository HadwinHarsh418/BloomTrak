import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'app/auth/service';
import { ApiService } from 'app/auth/service/api.service';
import { DataService } from 'app/auth/service/data.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-management-user',
  templateUrl: './management-user.component.html',
  styleUrls: ['./management-user.component.scss']
})
export class ManagementUserComponent implements OnInit {
  currentUser: any;
  rows1: any;
  loadingList: boolean;

  @ViewChild('deleteUser') deleteUser: ElementRef<any>;
  id: { id: any; };
  btnShow: boolean;
  constructor(
    private dataService: DataService,
    private _authenticationService: AuthenticationService,
    private tost: ToastrManager,
    private modalService: NgbModal,
    private api: ApiService,
  ) {
    this._authenticationService.currentUser.subscribe((x: any) => {
      this.currentUser = x
    });
   }

  ngOnInit(): void {
    this.getManagement()
  }

  getManagement(){
    this.dataService.getManagementUsers().subscribe((res:any) => {
      if (!res.error) {
        this.rows1 = res.body;
        // this.rows = this.rows1
        // this.rows.forEach(element => {
        //   element.community.forEach(element => {
        //     this.mngmCommunity.push(element)
        //   });
        // });
        // console.log('Management Communities',this.mngmCommunity)
      } else {
        this.dataService.genericErrorToaster()
      }
      this.loadingList = false;
    }, error => {
      this.loadingList = false;
      this.dataService.genericErrorToaster(error)
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
  
  closeded(modal: NgbModalRef) {
    modal.dismiss();
  }

  openDeleteUser(row: any, modal) {
    this.id = { id: row.id }
    this.modalOpenOSE(this.deleteUser, 'lg');
  }

  deletesUser(modal: NgbModalRef) {
    this.btnShow = true;
    this.dataService.deleteUserById(this.id).subscribe((res: any) => {
      if (!res.error) {
        this.tost.successToastr(res.msg)
        this.closeded(modal)
        this.btnShow = false;
        this.getManagement()
      } else {
        this.btnShow = false;
        this.tost.errorToastr(res.msg)
      }
    },
      (err) => {
        this.btnShow = false;
        this.api.genericErrorToaster()
      })
  }

}
