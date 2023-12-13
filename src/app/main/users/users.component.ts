import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { EncryptionService } from 'app/utils/encryption/encryption.service';
import { Page } from 'app/utils/models';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { debounceTime, map, distinctUntilChanged } from "rxjs/operators";
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  @ViewChild('tablesss') tablesss: ElementRef<any>;
  @ViewChild('searchStrInput', { static: true }) searchStrInput: ElementRef;
  @ViewChild('deleteUser') deleteUser: ElementRef<any>;
  public page = new Page();
  rows2: any = []
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
  tempCmntyId: any;
  btnShow: boolean = false;
  activeTab: number = 1;
  id: any;
  userid: any;
  manag: any = []
  radiodata: any;
  currentUserDtls: any;
  linked_with: any[]=[];
  fileToUpload: any;
  roleData: any[]=[];
  addPrms: any;
  dltPrms: any;
  edtPrms: any;
  vwPrms: any;
  assPrms: any;
  userName: any;
  currentUser1: any;
  constructor(
    private _authenticationService: AuthenticationService,
    private encryptionService: EncryptionService,
    private modalService: NgbModal,
    private dataService: DataService,
    private toastr: ToastrManager,
  ) {
    this.page.size = 10;
    this._authenticationService.currentUser.subscribe((x: any) => {
      this.currentUserDtls = x?.role
      this.currentUser = x
    });
    this.getRole()
  }

  ngOnInit(): void {
    
    setTimeout(() => {
      this.setPage({ offset: 0 });
    }, 500);
    if(this.currentUser.role == 'User'){
      this.getusercommunityById(this.id)
    }

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
    if (this.currentUser.role == 'Admin') {
      this.getMNMGcommunity()
    } else if(this.currentUser.role == 'SuperAdmin') {
      this.searchSub = this.dataService.getcommunity(this.searchStr, this.page.pageNumber, this.page.size).subscribe(
        res => {
          if (!res.error) {
            this.rows = res.body;
            //  this.rows.map(rw => {
            //          if (rw.single_community == '0') {
            //            rw.phone = 'Single'
            //          }
            //        })
            if (!res.pagination) {
              this.page.size = res.body.length;
              this.page.totalElements = res.body.length;
              this.page.pageNumber = res.body.pageNumber;
              this.page.totalPages = res.body.totalPages;

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
  }

  deletesUser(modal) {
      let data = { id: this.currentUser.prmsnId == '6' ? this.currentUser1.id : this.currentUser1.cp_id };
      this.deletingUser = true;
      this.dataService.deleteUser(data).subscribe(res => {
        if (!res.error) {
          this.toastr.successToastr(res.msg);
          if (this.currentUserDtls == 'Admin') {
            this.getMNMGcommunity()
            this.closed(modal);
          }else{
            this.rows = [];
            this.closed(modal);
            this.setPage({ offset: 0 });
          }
        } else {
          this._authenticationService.errorToaster(res);
        }
        this.deletingUser = false;
      }, error => {
        this.dataService.genericErrorToaster();
        this.deletingUser = false;
      });
  }

  openDeleteUser(item) {
    this.currentUser1 = item;
    this.modalOpenOSE(this.deleteUser, 'lg');
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
  }

  ngOnDestroy() {
    if (this.searchSub) {
      this.searchSub.unsubscribe();
      this.searchSub = null;
    }
  }
 
  radio(value) {
    this.radiodata = value;
  }

  getMNMGcommunity() {
    this.dataService.getMNMGcommunity(this.currentUser?.id).subscribe((res: any) => {
      if (!res.error) {
        this.rows = res.body
        // if (!res.pagination) {
        //   this.page.size = res.pagination.size;
        //   this.page.totalElements = res.pagination.totalElements;
        //   this.page.pageNumber = res.pagination.pageNumber;
        //   this.page.totalPages = res.pagination.totalPages;
        // } else {
        //   this.page = res.pagination
        //   this.page.pageNumber = res.pagination.pageNumber
        // }
      }
    },
      (err) => {
        this.dataService.genericErrorToaster();
      })
  }

  getusercommunityById(id) {
    this.dataService.getusercommunityById(this.currentUser.id).subscribe((res: any) => {
      this.rows2 = res.body;
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

  getUserById(id, is_for) {
    let searchStr = ''
    this.dataService.getUserById(searchStr = '',id, is_for).subscribe((res: any) => {
      this.rows2 = res.body;
       this.rows2.forEach(element => {
          this.linked_with.push(element)
        });
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

    this.dataService.importCommunities(formdata).subscribe((res:any) => {
          if (!res.error) {
        this.toastr.successToastr(res.msg)
        this.setPage({ offset: 0 })

      } else {
        this.toastr.errorToastr(res.msg)
      }
    }, error => {
      this.toastr.errorToastr('Something went wrong please try again')
    }
    )
  }

  getPrmsnData(){
    let post=[];
    this.dataService.getPermissionByAdminRole().subscribe(
      (res:any) => {
        if (!res.error) {
          res.body.map(i=>{
            //comunity
            if(this.roleData.includes(i.role_id)){
              // if(i.permission_name == 'Department'){
              //     this.dprtmnt=JSON.parse(i.row_data);
              //     this.frstDp = this.dprtmnt[0]?.name
              //  }
               if(i.permission_name == "Communities"){
                this.addPrms  = i.add_permission
                this.dltPrms  = i.delete_permission
                this.edtPrms  = i.edit_permission
                this.vwPrms  = i.view_permission
                this.assPrms  = i.assignResidentCount_permission
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
         res.body.filter(i=>{ this.roleData.push(i.id.toString())})
              // this.roleData.map(i=>{
              //  if(i != 2  && i != 3 && i != 4  && i != 5 && i != 6 ){
              //    this.roleData1.push(i)
              //  }
              // })
         this.getPrmsnData()
      }
    },err=>{
      this.dataService.genericErrorToaster()
    })
  }

}
