import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from 'app/auth/service/authentication.service';
import { DataService } from 'app/auth/service/data.service';
import { Page } from 'app/utils/models';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';



@Component({
  selector: 'app-request-shift',
  templateUrl: './request-shift.component.html',
  styleUrls: ['./request-shift.component.scss']
})
export class RequestShiftComponent implements OnInit {
  @ViewChild('cancelRequestshift') cancelRequestshift: ElementRef<any>;
  currentUser: any;
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
  sort1: any;
  constructor(
    private dataService: DataService,
    private _authenticationService: AuthenticationService,
    private modalService: NgbModal,
    private tost: ToastrManager,  ) { 
    this._authenticationService.currentUser.subscribe
      (x => {
        this.currentUser = x
      }
      );
  }

  ngOnInit(): void {
   this.currentUser?.user_role == 5 ? this.getShiftRequest() : this.getRequestShiftForAgency()
  }
  getShiftRequest(){
    let data = { 
      aggency_id : this.currentUser?.user_role == 5 ? this.currentUser?.com_id : this.currentUser?.id,
      agency_user: this.currentUser?.id
    }
    this.dataService.getShiftRequest(data,this.currentUser?.id).subscribe((res : any) =>{
      this.shiftData =res.body?.sort(function (a, b) {
        if (a.start_time?.toUpperCase() < b.start_time?.toUpperCase()) { return 1; }
        if (a.start_time?.toUpperCase() > b.start_time?.toUpperCase()) { return -1; }
        return 0;
      });; ; 
      
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
  returnDataWithStatus(data: any) {
    return data?.map(i => {
      if (i.user_request_status == 'Pending') {
        i.approvalStatus = 'Pending'
      }
      return i
    });
  }

  changePage(page: any, data?: any) {
    this.page.pageNumber = data ? data : page.offset ? page.offset : 0;
    const startIndex = this.page.pageNumber * 10;
    const endIndex = startIndex + 10;
    this.shiftData = this.sortedArrayVal?.slice(startIndex, endIndex);
  }
  sort(page) {
    this.sortorder = page.sorts[0]
    this.currentUser?.user_role == 5 ? this.getShiftRequest() : this.getRequestShiftForAgency()
  }
  resetFilterValue(){
    this.currentUser?.user_role == 5 ? this.getShiftRequest() : this.getRequestShiftForAgency()
  }

  getRequestShiftForAgency(){
    let data = { 
      aggency_id : this.currentUser?.user_role == 5 ? this.currentUser?.com_id : this.currentUser?.id,
    }
    this.dataService.getRequestShiftForAgency(data).subscribe((res : any) =>{
      this.shiftData =res.body?.sort(function (a, b) {
        if (a.start_time?.toUpperCase() < b.start_time?.toUpperCase()) { return 1; }
        if (a.start_time?.toUpperCase() > b.start_time?.toUpperCase()) { return -1; }
        return 0;
      });; ;  
      this.shiftData = this.returnDataWithStatus(res.body)
      
      
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
  
  assignShift(snglUsr) {
    this.prmsUsrId =snglUsr    
    let body: any = {}
    
    if (this.currentUser?.user_role == 5) {
      body = {
        for_cp: snglUsr.for_cp,
        shift_id: snglUsr.shift_id,
        agency_user: snglUsr.agency_user || snglUsr.id,
        user_id: this.currentUser?.role == 'Agency' ? this.currentUser?.id : this.currentUser?.com_id,
        is_agency: this.currentUser?.role == 'Agency' || this.currentUser?.user_role == 5 ? 1 : 0,
        applied_for_by: this.userDetail,
        direct_assign : 0
      }
    } else {
      body = {
        for_cp: this.prmsUsrId.for_cp,
        shift_id: this.currentUser?.role == 'Agency' ? this.prmsUsrId.shift_id : this.prmsUsrId.id,
        user_id: this.currentUser?.role == 'Agency' ? this.currentUser?.id : this.currentUser?.com_id,
        agency_user: snglUsr.agency_user || snglUsr.id,
        is_agency: this.currentUser?.role == 'Agency' || this.currentUser?.user_role == 5 ? 1 : 0,
        applied_for_by: this.userDetail,
        direct_assign : 0
      }
     
    }
    let body1 ={
      shift_id: snglUsr.shift_id,
      agency_user: snglUsr.agency_user,
      request_status:'Approved'
    }
   
    this.dataService.applyShift(body).subscribe((res: any) => {
      if (!res.error) {
        this.tost.successToastr(res.msg)
        this.dataService.ApproveRequest(body1).subscribe((res: any) => {
          if (!res.error) {
          }
          })
        this.modalService.dismissAll()
        this.getRequestShiftForAgency()
        let data = {
          is_for: '',
          shift_id: this.prmsUsrId?.shift_id ?? this.prmsUsrId.id,
          user_id: snglUsr.agency_user || snglUsr.id,
          agency_id: this.currentUser?.user_role == 2 ? this.currentUser?.id : this.currentUser?.com_id,
          first_name: snglUsr.first_name,
          last_name: snglUsr.user_lastname || snglUsr.last_name,
          phone_number: snglUsr.phone_number,
          pin: snglUsr?.PIN_code || '',
          hourly_rate: snglUsr.hourly_rate || '',
          user_name: snglUsr.username
        }
        this.dataService.assignAGShift(data).subscribe((res: any) => {
          if (!res.error) {
            this.getRequestShiftForAgency()
          }
        })
       
      }
      else {
        this.tost.errorToastr(res.msg)
      }
    })
  }

  closeded(modal: NgbModalRef) {
    modal.dismiss();
    this.cancel_reason = '';
    this.getRequestShiftForAgency();
  }

  cancelRequest1(row:any) {
    this.shift=row.shift_id
    this.ag=row.agency_user
    
    this.modalOpenOSE(this.cancelRequestshift, 'lg');
  }

  modalOpenOSE(modalOSE, size = 'md') {
    this.modalService.open(modalOSE,
      {
        backdrop: false,
        size: size,
        centered: true,
      }
    );
  }

  cancelRequest(modal: NgbModalRef){
    let body1 ={
      shift_id: this.shift,
      agency_user: this.ag,
      request_status:'Cancelled',
      request_cancel_reason: this.cancel_reason
    }
    if (!this.cancel_reason) {
      this.tost.errorToastr("Please fill reason")
    }else{
      this.dataService.cancelRequest(body1).subscribe((res:any) => {
        if (!res.error) {
          this.tost.successToastr(res.msg)
          this.getRequestShiftForAgency()
          this.modalService.dismissAll()
          this.cancel_reason = '';
        }else {
          this.modalService.dismissAll()
          this.tost.errorToastr(res.msg)
        }
      })
    }

  }
  onItemSelect(e) {
    if (this.currentUser?.user_role == '2') {
      this.dataService.getAgenciesByID(this.currentUser?.user_role == 5 ? this.currentUser?.com_id : this.currentUser?.id).subscribe((res: any) => {
        this.userDetail = res.body[0]?.agency_name
      })
    }
    if (this.currentUser?.user_role == 5 || this.currentUser?.user_role == 4 || this.currentUser?.user_role == 1) {
      let is_for = this.currentUser?.user_role == 1 ? 'community' : 'user'
      let searchStr = ''
      this.dataService.getUserById(searchStr = '', this.currentUser?.id, is_for).subscribe((res: any) => {
        this.userDetail = res.body[0].first_name + " " + res.body[0].last_name;
      })
    }
  }

}
