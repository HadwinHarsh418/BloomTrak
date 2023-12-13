import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Role } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { ApiService } from 'app/auth/service/api.service';
import { DataService } from 'app/auth/service/data.service';
import { Page } from 'app/utils/models';
import { ToastrManager } from 'ng6-toastr-notifications';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  selector: 'app-agency-personel',
  templateUrl: './agency-personel.component.html',
  styleUrls: ['./agency-personel.component.scss']
})
export class AgencyPersonelComponent implements OnInit {
  searchSub: any = null;
  userRoles: any[] = [Role.Admin, Role.Community]
  userRoles2: any[] = [Role.Admin, Role.Agency]
  currenUserId: any;
  public page = new Page();
  loadingList: boolean;
  searchStr: string = '';
  public rows: any
  btnShow: boolean = false;
  allAgenciesID: any = [];
  currentUser: any;
  id: { id: any; };
  minDate: string;
  public settings = {};
  addPrms: any;
  dltPrms: any;
  edtPrms: any;
  vwPrms: any;
  @ViewChild('deleteUser') deleteUser: ElementRef<any>;
  @ViewChild('searchStrInput', { static: true }) searchStrInput: ElementRef;
  
  rows1: any = []
  datacommunity: any;
  submitId: any = []
  submitId2: any = []
  data: any;
  data1: any;
  data2: any;
  data3: any;
  crrntUsrId: any[] = []
  data4: any;
  userEdit: any;
  data5: any;
  data6: any;
  cols: string;
  mngmCommunity: any= [];
  mngmNames: any= [];
  selectedFile: any;
  name: string | Blob;
  addedImagePath: any;
  fileToUpload: any;
  roleData: any=[]

    constructor(
    private dataService: DataService,
    private _authenticationService: AuthenticationService,
    private modalService: NgbModal,
    private tost: ToastrManager,
    private api: ApiService,
  ) {
    this.page.size = 10;
    this._authenticationService.currentUser.subscribe((x: any) => {
      this.currentUser = x
      this.crrntUsrId.push(this.currentUser?.role == 'Admin' ?  x?._id : x?.id)
    });
    this.getRole()
    this.mngmCommunity = []
  }

  ngOnInit(): void {
    this.cols = this.currentUser.role == 'Admin' ? 'col-12' : 'col-6';
     this.getDate()
     this.currenUserId = ''
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
   }
   getDate() {
    let todayDate: any = new Date();
    let toDate: any = todayDate.getDate();
    if (toDate < 10) {
      toDate = '0' + toDate
    }
    let month = todayDate.getMonth() + 1;
    if (month < 10) {
      month = '0' + month;
    }
    let year = todayDate.getFullYear();
    this.minDate = year + '-' + month + '-' + toDate
  }

  setPage(pageInfo) {
    if (this.searchSub) {
      this.searchSub.unsubscribe();
      this.searchSub = null;
    }
    // this.page.pageNumber = pageInfo.offset;
    this.loadingList = true;
    if (this.currentUser.user_role == 2 || this.currentUser.role == 'Community' || this.currentUser.role == 'User') {
      let is_for = this.currentUser.role == Role.Agency ? 'agency' : 'agency'
      this.getUserById(this.currentUser.user_role == 2 ? this.currentUser.id : this.currentUser.com_id, is_for)
    } else if(this.currentUser.role == 'Admin'){
      this.dataService.getMNGTUser(this.searchStr, this.page.pageNumber, this.page.size,).subscribe(res => {
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
      //  this.dataService.getManagementNames().subscribe(res => {
      //   if (!res.error) {
      //     this.rows = res.body;
      //     this.rows.forEach(element => {
      //         this.mngmNames.push(element.mg_name)
      //     });
      //     console.log('Management Names',this.mngmNames)
      //   } else {
      //     this.dataService.genericErrorToaster()
      //   }
      //   this.loadingList = false;
      // }, error => {
      //   this.loadingList = false;
      //   this.dataService.genericErrorToaster(error)
      // }
      // )
    }
    else {
      let is_for = this.currentUser.role == 'User' ? 'user' : 'agency'
      this.searchSub = this.dataService.getUser(this.searchStr, this.page.pageNumber, this.page.size,is_for).subscribe(res => {
        if (!res.error) {
          this.rows = res.body;
          this.rows.map(rw => {
            if (this.currentUser.role == 'Agency') {
              rw.phone = rw.agency_phone
              rw.emails = rw.agency_email
            }
            else {
              rw.phone = rw.phone_number
              rw.emails = rw.email
            }
          })
          // if (!res.pagination) {
          //   this.page.size = res.body.length;
          //   this.page.totalElements = res.body.length;
          //   this.page.pageNumber = res.pagination.pageNumber;
          //   this.page.totalPages = res.pagination.totalPages;
          // } else {
          //   this.page = res.pagination
          //   this.page.pageNumber = res.pagination.pageNumber
          // }
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

  deletesUser(modal: NgbModalRef) {
    this.btnShow = true;
    this.dataService.deleteUserById(this.id).subscribe((res: any) => {
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

  openDeleteUser(row: any, modal) {
    this.id = { id: row.id }
    this.modalOpenOSE(this.deleteUser, 'lg');
  }

  getUserById(id, is_for) {
    this.dataService.getUserById(this.searchStr,id, is_for).subscribe((res: any) => {
      this.rows = res.body;
      // this.rows.map(rw => {
      //   if (this.currentUser.role == 'Agency') {
      //     rw.phone = rw.agency_phone
      //     rw.emails = rw.agency_email
      //   }
      //   else {
      //     rw.phone = rw.phone_number
      //     rw.emails = rw.email
      //   }
      // })
      if (!res.pagination) {
        this.page.size = res.body.length;
        this.page.totalElements = res.body.length;
        this.page.pageNumber = 0;
        this.page.totalPages = res.pagination?.totalPages;
      } else {
        this.page = res.pagination
        this.page.pageNumber = res.pagination?.pageNumber
      }
      this.loadingList = false;
    }, error => {
      this.loadingList = false;
    }
    )
  }

  terminateUsr(row){
    let cmntyData = {
      user_id : row?.id,
      community_id : this.currentUser?.id,
      is_for : 'community'
    }
    let agncyData = {
      user_id : row?.id,
      agency_id : this.currentUser?.id,
      is_for : ''
    }
    this.dataService.terminateUser(this.currentUser.role == 'Agency' ? agncyData : cmntyData).subscribe((res:any) => {
      if (!res.err) {
        this.tost.successToastr(res.msg)
        this.setPage({ offset: 0 })

      } else {
        this.dataService.genericErrorToaster()
      }
    }, error => {
      this.dataService.genericErrorToaster(error)
    }
    )
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

    this.dataService.importUsers(formdata).subscribe((res:any) => {
          if (!res.error) {
        this.tost.successToastr(res.msg)
        this.setPage({ offset: 0 })

      } else {
        this.tost.errorToastr(res.msg)
      }
    }, error => {
      this.tost.errorToastr('Something went wrong please try again')
    }
    )
  }

  getPrmsnData(){
    this.dataService.getPermissionByAdminRole().subscribe(
      (res:any) => {
        if (!res.error) {
        res.body.map(i=>{
          // comunity , agency
            if(this.roleData.includes(i.role_id)){
              if(i.trak_type == '1')
              if(i.permission_name == 'User'){
                this.addPrms  = i.add_permission
              this.dltPrms  = i.delete_permission
              this.edtPrms  = i.edit_permission
              this.vwPrms  = i.view_permission
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
    this.dataService.getAllRole( ).subscribe((res:any)=>{
      if(!res.err){
        // console.log("Roles------",res.body);
         res.body.filter(i=>{ this.roleData.push(i.id.toString())})
         this.getPrmsnData()
        
      }
    },err=>{
      this.dataService.genericErrorToaster()
    })
  }
  }