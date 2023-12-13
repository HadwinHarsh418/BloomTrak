import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'app/auth/service';
import { EncryptionService } from 'app/utils/encryption/encryption.service';
import { Page } from 'app/utils/models';
import { ToastrManager } from 'ng6-toastr-notifications';
import { NotificationsService } from './notifications.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  @ViewChild('tablesss') tablesss: ElementRef<any>;
  @ViewChild('addNotificaion') addNotificaion: ElementRef<any>;
  @ViewChild('deleteNotificaion') deleteNotificaion: ElementRef<any>;
  
  title:string = '';
  description:string = '';
  addingNotificaion:boolean;
  securityCode: string = '';
  deletingNotificaion: boolean;
  public page = new Page();
  public rows = [];
  public loadingList: boolean;
  toDelete: any;
  constructor(
    private _authenticationService: AuthenticationService,
    private encryptionService: EncryptionService,
    private notificationService: NotificationsService, 
    private modalService: NgbModal,
    public toastr: ToastrManager,
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }


  ngOnInit(): void {
    this.setPage(this.page);
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    let data = {
      pageNo: this.page.pageNumber,
      limitNum: this.page.size,
    };
    let itemenc = this.encryptionService.encode(JSON.stringify(data))
    this.loadingList = true;
    this.notificationService.getNotification().subscribe(
      res => {
        let data = this.encryptionService.getDecode(res);
        if (!data.error) {
          this.rows = data.body;
          if(!data.pagination) {
            this.page.size = this.rows.length;
            this.page.totalElements = this.rows.length;
            this.page.pageNumber = 0;
            this.page.totalPages = 1;
          }
        } else {
          this._authenticationService.errorToaster(data)
        }
        this.loadingList = false;
      }, error => {
        this.loadingList = false;
      }
    )
  }

  deleteNotification(modal) {
    if(!this.securityCode.trim()) {
      this.toastr.errorToastr('Security Code is required');
      return;
    }
    let data = { id:this.toDelete.id, security: this.securityCode};
    let enc = this.encryptionService.encode(JSON.stringify(data));
    this.deletingNotificaion = true;
    this.notificationService.deleteNotification({enc}).subscribe(
      res => {
        if(!res.error) {
          this.toastr.successToastr(res.msg);
          this.setPage(this.page);
          this.closed(modal);
        } else {
          this._authenticationService.errorToaster(res);
        }
        this.deletingNotificaion = false;
      }, error => {
        this.toastr.errorToastr('Oops! something went wrong, while deleting notificaion, please try again.');
        this.deletingNotificaion = false;
      }
    );

  }

  addNotification(model) {
    if(!this.title.trim()) {
      this.toastr.errorToastr('Title is required');
      return;
    }
    if(!this.description.trim()) {
      this.toastr.errorToastr('Description is required');
      return;
    }
    if(!this.securityCode.trim()) {
      this.toastr.errorToastr('Security code is required');
      return;
    }
    
    let data = { title:this.title, description:this.description, to_everyone:"1", security: this.securityCode}
    let enc = this.encryptionService.encode(JSON.stringify(data));
    this.addingNotificaion = true;
    this.notificationService.addNotification({enc}).subscribe(
      res => {
        if(!res.error) {
          this.toastr.successToastr(res.msg);
          this.setPage(this.page);
          this.closed(model);
        } else {
          this._authenticationService.errorToaster(res);
        }
        this.addingNotificaion = false;
      }, error => {
        this.toastr.errorToastr('Oops! something went wrong, while adding notificaion, please try again.');
        this.addingNotificaion = false;
      }
    );
  }

  // openCloseModal
  openDelNotification(item) {
    this.toDelete = item;
    this.securityCode = '';
    this.modalOpenOSE(this.deleteNotificaion);
  }
  openNotificaitonModal() {
    this.securityCode = '';
    this.title = '';
    this.description = '';
    this.modalOpenOSE(this.addNotificaion);
  }

  modalOpenOSE(modalOSE) {
    this.modalService.open(modalOSE,
      {
        backdrop: false,
        centered: true,
      }
    );
  }

  closed(modal: NgbModalRef) {
    this.toDelete = null;
    modal.dismiss();
  }


}
