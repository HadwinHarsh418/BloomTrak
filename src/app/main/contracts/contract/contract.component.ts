import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { EncryptionService } from 'app/utils/encryption/encryption.service';
import { Page } from 'app/utils/models';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { debounceTime, map, distinctUntilChanged, filter } from "rxjs/operators";
import { fromEvent } from 'rxjs';
import { Pagination } from 'swiper';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Patterns } from 'app/auth/helpers/patterns';
import { Router } from '@angular/router';
import { Role } from 'app/auth/models';


@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss']
})
export class ContractComponent implements OnInit {

  @ViewChild('tablesss') tablesss: ElementRef<any>;
  @ViewChild('searchStrInput', { static: true }) searchStrInput: ElementRef;
  @ViewChild('deleteActivity') deleteActivity: ElementRef<any>;
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

  formData!: FormGroup;
  Primary!: FormGroup;
  Servey!: FormGroup;
  radioData!: FormGroup;
  managementServey!: FormGroup;
  btnShow: boolean = false;

  activeTab: number = 1;
  community_id: any;
  id: any;
  userid: any;
  allCommunity: any = [];
  allUsers: any = [];
  allAgency: any = [];
  allProject: any = [];


  constructor(
    private _authenticationService: AuthenticationService,
    private encryptionService: EncryptionService,
    private modalService: NgbModal,
    private dataService: DataService,
    private toastr: ToastrManager,
    private fb: FormBuilder,
    private rout: Router,
  ) {
    this.page.size = 10;
    this._authenticationService.currentUser.subscribe(x => (this.currentUser = x));
  }

  ngOnInit(): void {
    this.getCommunityId();
    this.getUserId();
    this.getAgencyId();
    this.getProjectId();
    this.setPage({ offset: 0 });

    fromEvent(this.searchStrInput.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      })
      , debounceTime(1000)
      , distinctUntilChanged()
    ).subscribe((text: string) => {
      this.setPage({ offset: 0 })
    });
    this.formData = this.fb.group({
      project_id: ['', Validators.required],     
      community_id: ['', [Validators.required]],
      budget: ['', [Validators.required]],
      estimate: ['', [Validators.required]],
      status:['', [Validators.required]],

    })
  }


  closeded(modal: NgbModalRef) {
    modal.dismiss();
  }

  closeAddCommunity(modal: NgbModalRef) {
    modal.dismiss();
  }
  get controls() {
    return this.formData.controls;
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
    // let community_id = (this.currentUser?.role == Role.Community) ? this.currentUser?.id : null;
    this.searchSub = this.dataService.getContract(this.searchStr, this.page.pageNumber, this.page.size).subscribe(
      res => {
        if (!res.error) {
          this.rows = res.body;
          if (!res.pagination) {
            this.page.size = res.body.length;
            this.page.totalElements = res.body.length;
            this.page.pageNumber = res.pagination.pageNumber;
            this.page.totalPages = res.pagination.totalPages;
          }
          else {
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

  deletesUser(modal) {
    if (this.currentUser) {
      let data = { id: this.currentUser?.id };
      let enc = this.encryptionService.encode(JSON.stringify(data));
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

  openDeleteUser(item) {
    this.currentUser = item;
    this.modalOpenOSE(this.deleteActivity, 'lg');
  }

  openAddcommunity() {
    this.radioData.reset();
    this.managementServey.reset();
    this.formData.reset();
    this.Servey.reset();
    this.Primary.reset();
    this.activeTab = 1;
    this.modalOpenOSE(this.addUsers, 'lg');
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

  openAddUser() {
    this.formData.reset();
    this.modalOpenOSE(this.addUsers, 'lg');
  }

  closed(modal: NgbModalRef) {
    modal.dismiss();
    this.currentUser = null;
  }

  ngOnDestroy() {
    if (this.searchSub) {
      this.searchSub.unsubscribe();
      this.searchSub = null;
    }
  }

  submitted(modal: NgbModalRef) {
    for (let item of Object.keys(this.controls)) {
      this.controls[item].markAsDirty()
    }
    if (this.formData.invalid) {      
      return;
    }
    else {
      //let data = { ...this.formData.value, ...{ community_id: this.tempAddId } }
      
      this.btnShow = true;
      this.dataService.addContract(this.formData.value).subscribe((res: any) => {
        if (!res.error) {
          this.toastr.successToastr(res.msg);
          this.tempAddId = res.body[0]
          this.closeded(modal)
          this.setPage({ offset: 0 })
        } else {
          this.toastr.errorToastr(res.msg);
        }
        this.btnShow = false;
      },
        (err) => {
          this.btnShow = false;
          this.dataService.genericErrorToaster();

        })
    }
  }

  get pControls() {
    return this.Primary.controls
  }

  getCommunityId() {
    this.dataService.getCommunityId().subscribe((response: any) => {
      if (response['error'] == false) {
        this.allCommunity = response.body;
        //this.toastr.successToastr(response.msg);
      } else if (response['error'] == true) {
        this.toastr.errorToastr(response.msg);
      }
    })
  }

  getUserId() {
    this.dataService.getUserId().subscribe((response: any) => {
      if (response['error'] == false) {
        this.allUsers = response.body;
        //this.toastr.successToastr(response.msg);
      } else if (response['error'] == true) {
        this.toastr.errorToastr(response.msg);
      }
    })
  }

  getAgencyId() {
    this.dataService.getAgencyId().subscribe((response: any) => {
      if (response['error'] == false) {
        this.allAgency = response.body;
        //this.toastr.successToastr(response.msg);
      } else if (response['error'] == true) {
        this.toastr.errorToastr(response.msg);
      }
    })
  }

  getProjectId() {
    this.dataService.getProjectId().subscribe((response: any) => {
      if (response['error'] == false) {
        this.allProject = response.body;
        //this.toastr.successToastr(response.msg);
      } else if (response['error'] == true) {
        this.toastr.errorToastr(response.msg);
      }
    })
  }


}
