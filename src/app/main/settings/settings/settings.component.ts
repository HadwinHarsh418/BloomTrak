import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'app/auth/service';
import { EncryptionService } from 'app/utils/encryption/encryption.service';
import { Page } from 'app/utils/models';
import { ToastrManager } from 'ng6-toastr-notifications';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  @ViewChild('tablesss') tablesss: any;
  @ViewChild('searchStrInput', { static: true }) searchStrInput: ElementRef;
  @ViewChild('addProtection') addProtection: ElementRef<any>;
  
  amount: any = '';
  description: string = '';
  titleJp: string = '';
  descriptionJp: string = '';
  addingProtection: boolean;
  securityCode: string = '';
  deletingFaq: boolean;
  editingFaq: boolean;
  public page = new Page();
  public rows = [];
  public loadingList: boolean;
  toDelete: any;
  toEdit: any;
  searchStr: string = '';
  filteredUsers: any[];
  

  constructor(private _authenticationService: AuthenticationService,
    private modalService: NgbModal,
    private encryptionService: EncryptionService,
    public toastr: ToastrManager,
    private settingService:SettingsService) { }

  ngOnInit(): void {
    this.setPage(this.page);
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    let data = {
      pageNo: this.page.pageNumber,
      limitNum: this.page.size,
    };
    this.loadingList = true;
    this.settingService.getProtection().subscribe(
      res => {  
        if (!res.error) {
          this.rows = res.body               
      
        } else {
          this._authenticationService.errorToaster(data)
        }
        this.loadingList = false;
      }, error => {
        this.loadingList = false;
      }
    )
  }
  UpdateProtection(modal){
    if (!this.amount.trim()) {
      this.toastr.errorToastr('Amount is required');
      return;
    }
    if (!this.description.trim()) {
      this.toastr.errorToastr('Description is required');
      return;
    }
    let data = {
      id: '',
      amount: this.amount,
      description: this.description,
    }
     if (this.toEdit?.id) { data.id = this.toEdit.id }

    this.addingProtection = true;
    this.settingService.addProtection(data).subscribe(
      res => {
        if (!res.error) {
          this.toastr.successToastr(res.msg);
          this.setPage(this.page);
          this.closed(modal);
        } else {
          this._authenticationService.errorToaster(res);
        }
        this.addingProtection = false;
      }, error => {
        this.toastr.errorToastr('Oops! something went wrong, while adding Faq, please try again.');
        this.addingProtection = false;
      }
    );
  }



  openProtectionModal(item =null){
    if (item &&  item.id) {
        this.toEdit = item;
        this.amount = item.amount;
        this.description = item.description;  
      
    }
    else {
      this.amount = '';
      this.description = '';
     
    }
    this.modalOpenOSE(this.addProtection);

  }

modalOpenOSE(modalOSE) {
  this.modalService.open(modalOSE,
    {
      backdrop: false,
      centered: true,
      size: 'lg'
    }
  );
}

closed(modal: NgbModalRef) {
  this.toDelete = null;
  this.toEdit = null
  modal.dismiss();
}
}
