import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'app/auth/service';
import { ApiService } from 'app/auth/service/api.service';
import { DataService } from 'app/auth/service/data.service';
import { EncryptionService } from 'app/utils/encryption/encryption.service';
import { Page } from 'app/utils/models';
import { ToastrManager } from 'ng6-toastr-notifications';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  selector: 'app-add-management',
  templateUrl: './add-management.component.html',
  styleUrls: ['./add-management.component.scss']
})
export class AddManagementComponent implements OnInit {
  searchSub: any = null;
  currenUserId: any;
  public page = new Page();
  loadingList: boolean;
  searchStr: string = '';
  public rows = [];
  allCommunity: any = [];
  btnShow: boolean = false;
  allAgenciesID: any = [];
  currentUser: any;
  id: { id: any; };
  minDate: string;

  @ViewChild('deleteUser') deleteUser: ElementRef<any>;
  @ViewChild('searchStrInput', { static: true }) searchStrInput: ElementRef;
  manageId: any;

  constructor(
    private encryptionService: EncryptionService,
    private dataService: DataService,
    private _authenticationService: AuthenticationService,
    private modalService: NgbModal,
    private tost: ToastrManager,
    private api: ApiService,
  ) {
    this.setPage({ offset: 0 });
    this.page.size = 10;
    this._authenticationService.currentUser.subscribe(x => (this.currentUser = x));
   }

  ngOnInit(): void {
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

  closeded(modal: NgbModalRef) {
    modal.dismiss();
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
    let itemenc = this.encryptionService.encode(JSON.stringify(data))
    this.loadingList = true;
    // let community_id = (this.currentUser.role == Role.Community) ? this.currentUser.id : null;
    // let agency_id = (this.currentUser.role == Role.Agency) ? this.currentUser.id : null;
           this.searchSub = this.dataService.getManagement(this.searchStr, this.page.pageNumber).subscribe(res => {
             if (!res.error) {
               this.rows = res.body;
              //  this.rows.map(rw => {
              //    if (this.currentUser.role == 'Agency') {
              //      rw.phone = rw.agency_phone
              //      rw.emails = rw.agency_email
              //    }
              //    else {
              //      rw.phone = rw.phone_number
              //      rw.emails = rw.email
              //    }
              //  })
               if (!res.pagination) {
                 this.page.size = res.body.length;
                 this.page.totalElements = res.body.length;
                 this.page.pageNumber = res.pagination.pageNumber;
                 this.page.totalPages = res.pagination.totalPages;
               } else {
                 this.page = res.pagination
                 this.page.pageNumber = res.pagination.pageNumber
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

  modalOpenOSE(modalOSE, size = 'lg') {
    this.modalService.open(modalOSE,
      {
        backdrop: false,
        size: size,
        centered: true,
      }
    );
  }

  deletesUser(modal: NgbModalRef) {
    this.btnShow = true;
    let data = {id:this.manageId.id}
    this.dataService.deleteManagenment(data).subscribe((res: any) => {
      if (!res.error) {
        this.setPage({ offset: 0 });
        this.tost.successToastr(res.msg)
        this.closeded(modal)
        this.btnShow = false;
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

  openDeleteUser(item) {
    this.manageId = item;
    this.modalOpenOSE(this.deleteUser, 'lg');
  }
 
}
