import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from 'app/auth/service/authentication.service';
import { DataService } from 'app/auth/service/data.service';
import { Page } from 'app/utils/models';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { debounceTime, map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  private userSearch1 = new Subject<any>();
  currentUser: any;
  searchmanualUserName: string;
  shiftData: any;
  sortedArrayVal: any[] = [];
  public page = new Page();
  sortorder: any;
  active: any;
  prmsUsrId: any;
  shift: any;
  ag: any;
  userDetail: any;
  cancel_reason: string;
  aplyPrms: any;
  dltPrms: any;
  id :any;
  @ViewChild('deleteUser') deleteUser: ElementRef<any>;
  @ViewChild('EditUser') EditUser: ElementRef<any>;
  @ViewChild('AddUser') AddUser: ElementRef<any>;
  formData1: FormGroup;
  formData: FormGroup;
  btnShow: boolean;
  data: any;
  allCommunity: any;
  fileToUpload: string | Blob;
  setPage: any;


  constructor(  private dataService: DataService,
    private _authenticationService: AuthenticationService,
    private modalService: NgbModal,
    private tost: ToastrManager,
    private fb: FormBuilder,
  ) { 
    this._authenticationService.currentUser.subscribe
      (x => {
        this.currentUser = x
      }
      );
      this.userSearch1.pipe(
        debounceTime(500)
      ).subscribe((searchTextValue: any) => {
        if (searchTextValue)
          this.searchmanualUserName = searchTextValue;
         this.getMalualUserDetail()
      });
      this.create()
      this.add()
  } 

  ngOnInit(): void {
    this.getMalualUserDetail()
  }

  getMalualUserDetail(){
    let id = this.currentUser?.user_role == 1 || this.currentUser?.user_role == 6 ? this.currentUser?.id : this.currentUser?.com_id
    let searchStr = this.searchmanualUserName ?? '';
    this.dataService.getManualUserById(searchStr, id).subscribe((res : any) =>{
      this.shiftData =res.body?.sort(function (a, b) {
        if (a.last_name?.toUpperCase() < b.last_name?.toUpperCase()) { return -1; }
        if (a.last_name?.toUpperCase() > b.last_name?.toUpperCase()) { return 1; }
        return 0;
      });
      
      if (!res.pagination) {
        this.sortedArrayVal = this.shiftData
        this.page.size = 10;
        this.page.totalElements = this.shiftData?.length;
        this.page.pageNumber = this.page.pageNumber;
        this.page.totalPages = Math.ceil(this.shiftData?.length / 10);
        this.changePage('', this.active?.pageNumber ? this.active?.pageNumber : this.page.pageNumber ? this.page.pageNumber : 0)
      }else{
        this.page = res?.pagination
        this.page.pageNumber = res.pagination?.pageNumber
      }
    })
  }

  sort(page) {
    this.sortorder = page.sorts[0]
    this.getMalualUserDetail()
  }
  openDeleteUser(row: any) {
    this.id = row.id;
    this.modalOpenOSE(this.deleteUser, 'lg');
  }

  openEditUser(row: any) {
    this.data = row;    
    console.log(this.data);
    
    setTimeout(() => {
      this.ptchVal()
    }, 200);
 this.modalOpenOSE(this.EditUser, 'lg');
  }
  
  ptchVal(){
    this.formData1.patchValue({
      community_name:this.data.community_name,
      first_name: this.data.first_name,
      last_name: this.data.last_name
    })
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

  
  changePage(page: any, data?: any) {
    this.page.pageNumber = data ? data : page.offset ? page.offset : 0;
    const startIndex = this.page.pageNumber * 10;
    const endIndex = startIndex + 10;
    this.shiftData = this.sortedArrayVal?.slice(startIndex, endIndex);
  }
  searchUser1(event: any) {
    this.userSearch1.next(event.target.value)
  }

  closededApply(modal: NgbModalRef) {
    modal.dismiss();
    this.getMalualUserDetail()  
  }

  deleteshift(modal: NgbModalRef) {
    let data ={
      id: this.id,
    }

      this.dataService.deleteEmployee(data).subscribe((res: any) => {
        if (!res.error) {
          this.tost.successToastr(res.msg)
          this.closededApply(modal)
        } else {
          this.tost.errorToastr(res.msg)
          this.closededApply(modal)
        }
      })
  }
  add(){
    this.formData = this.fb.group({
      community_name: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required]
    })
    if(this.currentUser.role == 'Community' || this.currentUser.user_role == 4)
      {
       this.formData.controls['community_name'].clearValidators();
       this.formData.updateValueAndValidity();
      }
      if(this.currentUser.role == 'SuperAdmin')
      {
       this.formData.controls['community_name'].setValidators(Validators.required);
       this.formData.updateValueAndValidity();
      }
  }

  create(){
    this.formData1 = this.fb.group({
      community_name:['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required]
    })
    if(this.currentUser.role == 'Community' || this.currentUser.user_role == 4)
      {
       this.formData1.controls['community_name'].clearValidators();
       this.formData1.updateValueAndValidity();
      }
      if(this.currentUser.role == 'SuperAdmin')
      {
       this.formData1.controls['community_name'].setValidators(Validators.required);
       this.formData1.updateValueAndValidity();
      }
  }
  get controls1() {
    return this.formData1.controls;
  }
  get controls() {
    return this.formData.controls;
  }
  
  submitted(modal: any) {
    for (let item of Object.keys(this.controls)) {
      this.controls[item].markAsDirty()
    }
    if (this.formData.invalid) {
      return;
    }
  
   let body = {
    first_name: this.controls.first_name.value,
     last_name: this.controls.last_name.value,
     community_id: this.currentUser?.user_role == 4 ? [this.currentUser?.com_id] : this.currentUser.user_role == 6 ? [this.formData.value.community_name] :  [this.currentUser?.id],
    }
  
   this.dataService.addUserManually(body).subscribe((res: any) => {
    if (!res.error) {
      this.tost.successToastr(res.msg);
      modal.dismiss();
      this.formData.reset()
      modal.dismiss();
      this.getMalualUserDetail()
    } else {
      this.tost.errorToastr(res.msg);
    }
    this.btnShow = false;
  },
    (err) => {
      this.btnShow = false;
      this.dataService.genericErrorToaster();
    })
  this.btnShow = true;
  
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
    formdata.append('report',this.fileToUpload);
    formdata.append('community_id', String(this.currentUser.id));
    this.dataService.importEmployee(formdata).subscribe((res:any) => {
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

  submitted1(modal: any) {
    for (let item of Object.keys(this.controls1)) {
      this.controls1[item].markAsDirty()
    }
    if (this.formData1.invalid) {
      return;
    }
  
   let body = {
    first_name: this.controls1.first_name.value,
     last_name: this.controls1.last_name.value,
     id: this.data.id,
   }
  
   this.dataService.editManualUser(body).subscribe((res: any) => {
    if (!res.error) {
      this.tost.successToastr(res.msg);
      modal.dismiss();
      this.formData1.reset()
      modal.dismiss();
      this.getMalualUserDetail()
    } else {
      this.tost.errorToastr(res.msg);
    }
    this.btnShow = false;
  },
    (err) => {
      this.btnShow = false;
      this.dataService.genericErrorToaster();
    })
  this.btnShow = true;
  
  }

 addEmployee(){
 this.modalOpenOSE(this.AddUser, 'lg');
 if(this.currentUser.user_role == 6){
  this.getCommunityId()
 }
  }

  getCommunityId() {
    this.dataService.getCommunityId().subscribe((response: any) => { 
          this.allCommunity = response.body.sort(function(a, b){
            if(a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
            if(a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
            return 0;
        })  ;
        })
}
}
