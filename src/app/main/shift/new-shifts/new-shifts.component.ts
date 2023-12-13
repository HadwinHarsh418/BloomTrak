import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'app/auth/service/authentication.service';
import { DataService } from 'app/auth/service/data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import moment from 'moment';
import { Page } from 'app/utils/models';
import { Patterns } from 'app/auth/helpers/patterns';
import { Subject } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { ConfirmedValidator } from 'app/auth/helpers/mustMacth';
import { IDropdownSettings } from 'ng-multiselect-dropdown/multiselect.model';

@Component({
  selector: 'app-new-shifts',
  templateUrl: './new-shifts.component.html',
  styleUrls: ['./new-shifts.component.scss']
})
export class NewShiftsComponent implements OnInit {
  // @ViewChild('searchStrInput', { static: true }) searchStrInput: ElementRef<any>;
  @ViewChild('deleteShift') deleteShift: ElementRef<any>;
  @ViewChild('reasonLstMdl') reasonLstMdl: ElementRef<any>;
  @ViewChild('UserLiST') UserLiST: ElementRef<any>;
  @ViewChild('Addnew') Addnew: ElementRef<any>;
  @ViewChild('reasonMdl') reasonMdl: ElementRef<any>;

  private keyUpFxn = new Subject<any>();



  timeslots = [
    { value: { hour: 0, minute: 0 }, label: '00:00' },
    { value: { hour: 0, minute: 30 }, label: '00:30', },
    { value: { hour: 1, minute: 0 }, label: '01:00', },
    { value: { hour: 1, minute: 30 }, label: '01:30', },
    { value: { hour: 2, minute: 0 }, label: '02:00', },
    { value: { hour: 2, minute: 30 }, label: '02:30', },
    { value: { hour: 3, minute: 0 }, label: '03:00', },
    { value: { hour: 3, minute: 30 }, label: '03:30', },
    { value: { hour: 4, minute: 0 }, label: '04:00', },
    { value: { hour: 4, minute: 30 }, label: '04:30', },
    { value: { hour: 5, minute: 0 }, label: '05:00', },
    { value: { hour: 5, minute: 30 }, label: '05:30', },
    { value: { hour: 6, minute: 0 }, label: '06:00', },
    { value: { hour: 6, minute: 30 }, label: '06:30', },
    { value: { hour: 7, minute: 0 }, label: '07:00', },
    { value: { hour: 7, minute: 30 }, label: '07:30', },
    { value: { hour: 8, minute: 0 }, label: '08:00', },
    { value: { hour: 8, minute: 30 }, label: '08:30', },
    { value: { hour: 9, minute: 0 }, label: '09:00', },
    { value: { hour: 9, minute: 30 }, label: '09:30', },
    { value: { hour: 10, minute: 0 }, label: '10:00', },
    { value: { hour: 10, minute: 30 }, label: '10:30', },
    { value: { hour: 11, minute: 0 }, label: '11:00', },
    { value: { hour: 11, minute: 30 }, label: '11:30', },
    { value: { hour: 12, minute: 0 }, label: '12:00', },
    { value: { hour: 12, minute: 30 }, label: '12:30', },
    { value: { hour: 13, minute: 0 }, label: '13:00', },
    { value: { hour: 13, minute: 30 }, label: '13:30', },
    { value: { hour: 14, minute: 0 }, label: '14:00', },
    { value: { hour: 14, minute: 30 }, label: '14:30', },
    { value: { hour: 15, minute: 0 }, label: '15:00', },
    { value: { hour: 15, minute: 30 }, label: '15:30', },
    { value: { hour: 16, minute: 0 }, label: '16:00', },
    { value: { hour: 16, minute: 30 }, label: '16:30', },
    { value: { hour: 17, minute: 0 }, label: '17:00', },
    { value: { hour: 17, minute: 30 }, label: '17:30', },
    { value: { hour: 18, minute: 0 }, label: '18:00', },
    { value: { hour: 18, minute: 30 }, label: '18:30', },
    { value: { hour: 19, minute: 0 }, label: '19:00' },
    { value: { hour: 19, minute: 30 }, label: '19:30' },
    { value: { hour: 20, minute: 0 }, label: '20:00' },
    { value: { hour: 20, minute: 30 }, label: '20:30' },
    { value: { hour: 21, minute: 0 }, label: '21:00' },
    { value: { hour: 21, minute: 30 }, label: '21:30' },
    { value: { hour: 22, minute: 0 }, label: '22:00' },
    { value: { hour: 22, minute: 30 }, label: '22:30' },
    { value: { hour: 23, minute: 0 }, label: '23:00' },
    { value: { hour: 23, minute: 30 }, label: '23:30' },
    { value: { hour: 24, minute: 0 }, label: '24:00' },
  ]
  shiftData: any[] = [];
  getAgencyMonthlyBudgetData: any[] = []
  clickedBtn = null

  searchStr = '';
  replaceUserText = '';
  data1: any;
  currentUser: any;
  start_date: any;
  startTime: any;
  end_date: any;
  endTime: any;
  shiftType: any = null;
  slctCpType: any = null;
  resonIsNull: boolean;
  data: any;
  public page = new Page();
  permision = { addPrms: '', dltPrms: '', edtPrms: '', vwPrms: '', aplyPrms: '', assign: '' };
  roleData: any[] = [];
  reason: any;
  cancel_reason: string;
  id: { id: any; };
  btnShow: boolean;
  UserCanceledShiftById: any;
  row: any;
  loadingList: boolean;
  agncyUsr: any;
  slctSrtNm: any;
  selectedDataValue: any;
  prmsUsrId: any;
  formData: FormGroup;
  editFormData!: FormGroup;
  frstNewApply: any;
  replcShitData: any;

  CmntdropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    closeDropDownOnSelection: true,
    itemsShowLimit: 3,
    allowSearchFilter: true,
    maxHeight: 250
  };
 
  constructor(
    private _authenticationService: AuthenticationService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private tost: ToastrManager,
    private dataService: DataService,

  ) {

    this.keyUpFxn.pipe(
      debounceTime(500)
    ).subscribe((searchTextValue: any) => {
      if (searchTextValue)
        this.searchStr = searchTextValue
      this.getShiftAccToRole()
    });
    
  }

  getAgencyMonthlyBudget() {
    let id = ''
    if (this.permision.addPrms == '1')
      id = this.currentUser.com_id ?? this.currentUser.id
    else
      id = this.currentUser.id
    this.dataService.getAgencyMonthlyBudget(id).subscribe((res: any) => {
      if (!res.error) {
        this.getAgencyMonthlyBudgetData = res.body;
      }
    })
    this.initFormNewUser();

  }

  ngOnInit(): void {
    this._authenticationService.currentUser.subscribe
      (x => {
        this.currentUser = x;
        this.getRole()
        this.onItemSelect(this.currentUser.id)
      }
      );
  }

  seachShift(event) {
    if (event.target.value)
      this.keyUpFxn.next(event.target.value)
    else
      this.getShiftAccToRole()
  }

  initFormNewUser() {
    this.formData = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required, Validators.pattern(Patterns.number)]],
      agency_id: [''],
      password: ['', Validators.compose([Validators.required, Validators.pattern(Patterns.password)])],
      cnfrmpassword: ['', [Validators.required]],
      addUsrRl: ['', [Validators.required]],
    }, {
      validator: ConfirmedValidator('password', 'cnfrmpassword')
    },)

  }

  getCommunityRecords() {
    let body = {
      searchStr: this.searchStr,
      page: this.page.pageNumber,
      shiftType: this.shiftType ?? null,
      currentUser: this.currentUser?.com_id ?? this.currentUser.id,
      limit: '10',
      start_time: this.start_date ? this.cnvrtnewDt(this.start_date + ' ' + this.startTime) : null,
      end_time: this.end_date ? this.cnvrtnewDt(this.end_date + ' ' + this.endTime) : null,
    }

    this.dataService.getNewCommunityShifts(body).subscribe(res => {
      if (res.body?.length)
        this.shiftData = this.returnDataWithStatus(res.body)
        if (!res.pagination) {
          this.page.size = res.pagination.size;
          this.page.totalElements = res.pagination.totalElements;
          this.page.pageNumber = res.pagination.pageNumber;
          this.page.totalPages = res.pagination.totalPages;
        } else {
          this.page = res.pagination
          this.page.pageNumber = res.pagination.pageNumber;
          this.clickedBtn = 'AllShift'
          
        }
    })
  }

  pageChanged(page) {
    this.page.pageNumber = page.offset
    this.getShiftAccToRole()
  }

  cngShft(value) {
    if(this.currentUser.user_role == 1){
      this.getCommunityRecords()
    }else
    this.getShiftAccToRole()
  }
  SelectShiftType(event) {
    if (event.target.value == 'AllShift')
      this.clickedBtn = 'AllShift'
    if (event.target.value == 'MyShift')
      this.clickedBtn = 'MyShift'
    if (event.target.value == 'AllAvailShift')
      this.clickedBtn = 'AllAvailShift'

    this.getShiftAccToRole()


  }

  getShiftAccToRole() {
    if (this.currentUser.role.includes('Community') && (this.clickedBtn == 'AllShift' || this.currentUser.user_role == 1) && this.clickedBtn != 'MyShift' && this.clickedBtn != 'AllAvailShift' && !this.shiftType) {
      this.getCommunityRecords()
    } else if (this.currentUser.role == 'SuperAdmin' && this.currentUser.user_role == 6) {
      this.getShiftForAdmin()
    } else if (this.currentUser.user_role == 5) {
      this.getUserShiftById()
    } else
      this.getShiftForAgency()
  }

  getShiftForAgency() {
    let body: any
    if (this.currentUser.role.includes('Community') && (this.currentUser.user_role == 4 || this.currentUser.user_role == 1) && (this.clickedBtn != 'AllShift' || this.shiftType)) {
      body = {
        searchStr: this.searchStr,
        tpUsr: '',
        cpType: this.shiftType ?? null,
        currentUser: this.currentUser.user_role == 4 ? this.currentUser.id : this.currentUser.com_id ?? this.currentUser.id,
        for_cp1: true,
      }
      this.dataService.getNewCommunityShiftByID(body, this.currentUser.user_role).subscribe((res: any) => {
        this.shiftData = []
        if (this.clickedBtn == 'MyShift') {
          if (res.body)
            this.shiftData = this.returnDataWithStatus(res.body.userShifts);
          console.log(this.shiftData, 'wefjhfywefuywm');

        }
        if (this.clickedBtn == 'AllAvailShift') {
          if (res.body)
            this.shiftData = this.returnDataWithStatus(res.body.availableShifts);
        }

      })
    } else {
      body = {
        searchStr: this.searchStr,
        tpUsr: 'typeUser',
        cpType: this.shiftType ?? null,
        currentUser: this.currentUser.id,
        for_cp1: false,
      }
      this.dataService.getNewCommunityShiftByID(body).subscribe((res: any) => {
        this.shiftData = []
        if (this.clickedBtn == 'MyShift') {
          if (res.body.userShifts)
            this.shiftData = this.returnDataWithStatus(res.body.userShifts);
        }
        else if (this.clickedBtn == 'AllAvailShift') {
          if (res.body.availableShifts)
            this.shiftData = this.returnDataWithStatus(res.body.availableShifts);
        }
        else if (this.clickedBtn == 'AllShift') {
          this.shiftData = this.returnDataWithStatus(res.body.allShifts);

        }

      })
    }

  }

  replcUsr(row,no){
    this.frstNewApply = no
    this.replcShitData = row
    this.modalOpenOSE(this.UserLiST, 'lg');
    this.getagencyUser()
  }

  
  getagencyUser(){
    let is_for = this.currentUser.role == 'Agency' ? 'agency' : 'community'
      this.dataService.getAgencyUnblockUser(this.prmsUsrId?.id || this.currentUser.com_id,this.currentUser.id).subscribe((res: any) => {
        this.agncyUsr = res.body;
        this.agncyUsr = this.agncyUsr.filter(i=>{
          if(i.is_blocked == true){
            i.asgnBtnDsbl = true
          }else{
            i.asgnBtnDsbl = false
          }
          if(i.id != this.replcShitData.agency_user){
            return i
          }
        })
        this.loadingList = false;
      }, error => {
        this.loadingList = false;
      }
      )
  }

  getUserShiftById() {
    this.dataService.getUserAgencyshiftById(this.currentUser.id).subscribe(res => {
      if (this.clickedBtn == 'MyShift') {
        if (res.body.userShifts)
          this.shiftData = this.returnDataWithStatus(res.body.userShifts);
      }
      else if (this.clickedBtn == 'AllAvailShift') {
        if (res.body.availableShifts)
          this.shiftData = this.returnDataWithStatus(res.body.availableShifts);
      }
      else if (this.clickedBtn == 'AllShift') {
        this.shiftData = this.returnDataWithStatus(res.body.allShifts);

      }
    })
  }

  getShiftForAgencyUser() {
    this.dataService.getNewCommunityShiftByID(this.currentUser.id).subscribe((res: any) => {
      this.shiftData = []
      if (this.clickedBtn == 'MyShift')
        this.shiftData = res.body.userShifts;
      if (this.clickedBtn == 'AllAvailShift')
        this.shiftData = res.body.availableShifts;

    })
  }

  resetFilterValue() {
    this.start_date = '';
    this.startTime = 'undefined';
    this.end_date = '';
    this.endTime = 'undefined';
    this.getShiftAccToRole()
  }

  cnvrtnewDt(date_tm) {
    let dt = moment(date_tm).format();
    let dt1 = dt.split('+')
    return moment(dt1[0]).utc().unix()
  }

  getShiftForAdmin() {
    let body = {
      searchStr: this.searchStr,
      page: this.page.pageNumber,
      userShift: this.shiftType ?? null,
      limit: '10',
    }

    this.dataService.getNewshift(body).subscribe(res => {
      this.shiftData = []
      if (res.body?.length)
        this.shiftData = this.returnDataWithStatus(res.body);

      if (!res.pagination) {
        this.page.size = res.pagination.size;
        this.page.totalElements = res.pagination.totalElements;
        this.page.pageNumber = res.pagination.pageNumber;
        this.page.totalPages = res.pagination.totalPages;
      } else {
        this.page = res.pagination
        this.page.pageNumber = res.pagination.pageNumber
      }
    })
  }

  getRoles() {
    let id = this.currentUser.prmsnId
    let data = {
      prms: (id == '1') ? 'community_id' : (id == '2') ? 'agency_id' : 'null',
      id: this.currentUser.id
    }
    this.dataService.getRole(data).subscribe((res: any) => {
      if (!res.error) {
        this.data1 = res.body.sort(function (a, b) {
          if (a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
          if (a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
          return 0;
        });;

      } else {
        this.tost.errorToastr('Something went wrong please try again later')
      }
    }, err => {
      this.dataService.genericErrorToaster()
    })
  }


  getRole() {    
    this.dataService.getAllRole().subscribe((res: any) => {
      if (!res.err || !res.error) {
        this.getPrmsnData(res.body)
      }
    }, () => {
      this.dataService.genericErrorToaster()
    })
  }

  getPrmsnData(roleData) {
    this.permision = { addPrms: '', dltPrms: '', edtPrms: '', vwPrms: '', aplyPrms: '', assign: '' };
    let roleIds = []
    roleData.forEach(i => roleIds.push(i.id.toString()))
    roleIds.push('5')
    this.dataService.getPermissionByAdminRole().subscribe(
      (res: any) => {
        if (!res.error) {
          res.body.map(i => {
            if (roleIds.includes(i.role_id)) {
              if(i.trak_type == '1'){
                if (i.permission_name == 'Shifts') {
                  this.permision.addPrms = i.add_permission
                  this.permision.dltPrms = i.delete_permission
                  this.permision.edtPrms = i.edit_permission
                  this.permision.vwPrms = i.view_permission
                  this.permision.aplyPrms = i.apply_permission
                  this.permision.assign = i.assign
                }
              }
            } 
            

          })
          this.getAgencyMonthlyBudget();
          if(this.currentUser.user_role == 2 || this.currentUser.user)
          this.clickedBtn = 'AllShift'
          if (this.currentUser.role != 'SuperAdmin' && this.currentUser.role != 'Community') this.clickedBtn = 'AllAvailShift';
          this.getShiftAccToRole()

        }
      }
    )
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

  openDeleteShift(row: any,) {
    this.id = { id: row.id }
    this.modalOpenOSE(this.deleteShift, 'lg');
  }
  closeded(modal: NgbModalRef) {
    modal.dismiss();
    this.cancel_reason = ''
    this.formData.reset();
    this.getAgncyUsrLst()
  }

  cancleShft() {
    if (!this.cancel_reason) {
      this.resonIsNull = true
      return
    } else {
      this.resonIsNull = false
    }
    if (this.currentUser.role == 'Agency') {
      this.data = {
        shift_id: this.row.shift_id,
        user_id: this.row.aggency_id,
        cancel_reason: this.cancel_reason,
        is_agency: '1'
      }
    } else {
      this.data = {
        shift_id: this.row.shift_id || this.row.id,
        user_id: this.currentUser.id,
        cancel_reason: this.cancel_reason,
        is_agency: ''
      }
    }
    this.dataService.cancelUAppliedShift(this.data).subscribe((res: any) => {
      if (!res.error) {
        this.getShiftAccToRole()
        this.modalService.dismissAll()
        this.cancel_reason = ''
      }
    },
      (err) => {
        this.dataService.genericErrorToaster()
      })

  }

  deleteshift(modal: NgbModalRef) {
    this.btnShow = true;
    this.dataService.deleteshift(this.id).subscribe((res: any) => {
      if (!res.error) {
        this.getShiftAccToRole();
        this.tost.successToastr(res.msg)
        this.closeded(modal)
        this.btnShow = false;
      } else {
        this.btnShow = false;
        this.tost.errorToastr(res.msg)
      }
    })
  }


  completeShift(row) {
    let data = {
      shift_id: row.id
    }
    this.dataService.markShiftCompleteByID(data).subscribe((res: any) => {
      if (!res.error) {
        this.tost.successToastr(res.msg)
        this.getShiftAccToRole()
      }
    },
      (err) => {
        this.dataService.genericErrorToaster()
      })
  }

  getUserCanceledShiftById(row) {
    this.modalOpenOSE(this.reasonLstMdl, 'lg');
    this.dataService.getUserCanceledShiftById(row.id).subscribe((res: any) => {
      this.UserCanceledShiftById = res.body;
      this.UserCanceledShiftById.map(i => {
        i.shift_cancel_time = moment.unix(i.shift_cancel_time).format('MM-DD-YYYY hh:mm a')
      });
      this.loadingList = false;
    }, error => {
      this.loadingList = false;
    }
    )
  }

  submitted(modal) {
    // this.formData.reset()
    for (let item of Object.keys(this.controls)) {
      this.controls[item].markAsDirty()
    }
    if (this.formData.invalid) {
      return;
    }

    if (this.frstNewApply == 2) {
      let data = {
        shift_id: this.replcShitData.shift_id,
        aggency_id: this.replcShitData.aggency_id,
        user_id: this.replcShitData?.agency_user || this.replcShitData.phone_number,
        phone_number: this.controls.phone_number.value?.replace(/\D/g, ''),
        first_name: this.controls.first_name.value,
        last_name: this.controls.last_name.value,
        // replaced_user_id: this.replcShitData.User.id || '',
        old_number: this.replcShitData.phone_number,
        reason: this.reason,
        is_for: 'add_new',
        user_name: this.replcShitData.username,

      }
      this.dataService.replaceShiftUser(data).subscribe((res: any) => {
        this.loadingList = false;
        this.modalService.dismissAll()

      }, error => {
        this.loadingList = false;
      }
      )
    }

    let data = {
      phone_number: this.formData.value.phone_number?.replace(/\D/g, ''),
      email: this.formData.value.email,
      first_name: this.formData.value.first_name,
      last_name: this.formData.value.last_name,
      username: this.slctSrtNm + '-' + this.formData.value.username,
      password: this.formData.value.password,
      agency_id: [this.currentUser.id],
      isAdmin: '5',
      country_code: this.selectedDataValue ? this.selectedDataValue : '',
      roles: this.formData.value.addUsrRl
    }

    this.dataService.addUser(data).subscribe((res: any) => {
      if (!res.error) {

        this.tost.successToastr(res.msg);
        this.getAgncyUsrLst()
        this.formData.reset()
        modal.dismiss();
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
  get controls() {
    return this.formData.controls;
  }

  returnDataWithStatus(data: any) {
    data = data.sort((a, b) => (b.created_at < a.created_at ? -1 : 1));

    if(this.clickedBtn == 'MyShift'){
      return this.returnDataMyShiftStatus(data)
    }else{
      return data.map(i => {
        if (i.assigned == 0) {
          i.approvalStatus = 'Posted'
        } else if (i.assigned == 2) {
          i.approvalStatus = 'Filled By Community'
        } else if (i.assigned == 3 && i.status == "0" || i.assigned == 3 && i.status == "0" && i.cancellation_period_reached == '0' || i.assigned == 3 && i.status == "0"&&i.is_mannual == '0') {
          i.approvalStatus = 'Filled By Agency'
        } else if (i.assigned == 2 && i.status == "1") {
          i.approvalStatus = 'Started By Community'
        }
        else if (i.assigned == 2 && i.status == "3") {
          i.approvalStatus = 'Completed By Community'
        } else if (i.assigned == 3 && i.status == "1") {
          i.approvalStatus = 'Started By Agency'
        }
        else if (i.assigned == 3 && i.status == "3") {
          i.approvalStatus = 'Completed By Agency'
        }
        else if (i.assigned == 5 && i.status == "5") {
          i.approvalStatus = 'Closed'
          i.hideBtn = true
        }
        else {
          i.approvalStatus = 'Pending'
        }
        return i
      });
    }
  
  }

  returnDataMyShiftStatus(data){
    return data.map(i => {
      if (i.assigned == 3 && i.status == "3") {
        i.approvalStatus = 'Completed By Agency'
        i.expired = this.checkErrorDate(i.start_time)
      } else if (i.assigned == 5 && i.status == "5"){
        i.approvalStatus = 'Closed'
        i.hideBtn = true;
        i.expired = this.checkErrorDate(i.start_time)
      }else 
      if (i.approved == 1) {
       i.approvalStatus = 'Assigned'
       i.approvedHide = true
       i.expired = this.checkErrorDate(i.start_time)
     } else if (i.approved == 0 && i.assigned == 1) {
       i.approvalStatus = 'Not Assigned'
       i.approvedHide = false
       i.expired = this.checkErrorDate(i.start_time)
     }
     else if((i.approved  == 0 || i.approved == 2) && (i.assigned == 2 || i.assigned == 3  || i.assigned ==0) && i.self_cancel ==0){
      i.approvalStatus = 'Canceled';
      i.expired = this.checkErrorDate(i.start_time)
     }
     else if((i.approved  == 0 || i.approved == 2) && (i.assigned == 2 || i.assigned == 3  || i.assigned ==0) && i.self_cancel ==1){
      i.approvalStatus = 'Canceled By User'
      i.expired = this.checkErrorDate(i.start_time)
     }
     return i;
    });
  }

  checkErrorDate(val){
    const timestamp = Number(val) * 1000;
              const moment = new Date(timestamp);

              // Get the current date and time
              const currentDate = new Date();

              // Compare the moment to the current date
              if (moment >= currentDate) {
                return true
              } else {
                return false
              }
  }

  applyShift(row) {
    this.prmsUsrId = row
    let body = {
      for_cp: this.prmsUsrId.for_cp,
      shift_id: this.currentUser.user_role == 2 ? this.prmsUsrId.shift_id : this.prmsUsrId.id,
      user_id: this.currentUser.id,
      is_agency: this.currentUser.user_role == 2 ? 1 : 0
    }

    this.dataService.applyShift(body).subscribe((res: any) => {
      if (!res.error) {
        this.tost.successToastr(res.msg)
        if (this.currentUser.user_role == '4') {
          this.getShiftAccToRole();
        }
      }
      else {
        this.tost.errorToastr(res.msg)
      }
    }, (err) => {
      this.dataService.genericErrorToaster()
    })
  }
  assignShift(snglUsr, modal) {
    let body = {
      for_cp: this.prmsUsrId.for_cp,
      shift_id: this.currentUser.role == 'Agency' ? this.prmsUsrId.shift_id : this.prmsUsrId.id,
      user_id: this.currentUser.role == 'Agency' ? this.currentUser.id : this.currentUser.com_id,
      agency_user: snglUsr.id,
      is_agency: this.currentUser?.role == 'Agency' || this.currentUser.user_role == 5 ? 1 : 0,
    }

    this.dataService.applyShift(body).subscribe((res: any) => {
      if (!res.error) {
        this.tost.successToastr(res.msg)
        this.modalService.dismissAll()
        this.getShiftAccToRole()
        let data = {
          is_for: '',
          shift_id: this.prmsUsrId?.shift_id ?? this.prmsUsrId.id,
          user_id: snglUsr.id,
          agency_id: this.currentUser.user_role == 2 ? this.currentUser.id : this.currentUser.com_id,
          first_name: snglUsr.first_name,
          last_name: snglUsr.last_name,
          phone_number: snglUsr.phone_number,
          pin: snglUsr?.PIN_code || '',
          hourly_rate: snglUsr.hourly_rate,
          user_name: snglUsr.username
        }
        this.dataService.assignAGShift(data).subscribe((res: any) => {
          if (!res.error)
          {          
             this.closeded(modal)
          }
        })
        if (this.currentUser.user_role == '4') {
          this.getShiftAccToRole();
        }
      }
      else {
        this.modalService.dismissAll()
        this.tost.errorToastr(res.msg)
      }
    })
  }

  openReasonMdl(row) {
    this.row = row
    this.modalOpenOSE(this.reasonMdl, 'lg');
  }
  keyupper(cancel_reason) {
    if (!cancel_reason) {
      this.resonIsNull = true
    } else {
      this.resonIsNull = false
    }
  }

  applyShiftToAgency(row, no) {
    console.log(row,'vhrvbrjmrvuru');
    
    this.prmsUsrId = row
    if (this.currentUser.user_role != 2 && this.currentUser.user_role != 5) {
      this.applyShift(row)
    } else {
      this.getAgncyUsrLst()
      this.modalOpenOSE(this.UserLiST, 'lg');
    }
  }
  getAgncyUsrLst() {
    let is_for = 'agency'
    let searchStr = ''
    this.dataService.getAgencyUnblockUser(this.currentUser.user_role == 2 ? this.currentUser.com_id : this.currentUser.id, this.currentUser.user_role == 2 ? this.currentUser.id : this.currentUser.com_id).subscribe((res: any) => {
      if (!res.error) {
        this.agncyUsr = res.body

        this.agncyUsr.map(i => {
          if (i.is_blocked == true) {
            i.asgnBtnDsbl = true
          } else {
            i.asgnBtnDsbl = false
          }
        })
      }
    },
      (err) => {
        this.dataService.genericErrorToaster()
      })
  }
  openAddNew() {
    this.modalOpenOSE(this.Addnew, 'lg');
    this.getRoles()
  }
  reson(reason){
    this.replaceUserText = reason
  }

  replaceShiftUser(snglUsr,modal){
    let data = {
      shift_id:this.replcShitData.shift_id,
      aggency_id:this.replcShitData.aggency_id,
      user_id:this.replcShitData.agency_user || this.replcShitData.phone_number,
      replaced_user_id:snglUsr.id,
      phone_number:this.replcShitData.phone_number,
      reason : this.replaceUserText,
      user_name:snglUsr.username,
      first_name:snglUsr.first_name,
      last_name:snglUsr.last_name
    }
      this.dataService.replaceShiftUser(data).subscribe((res: any) => {
        this.loadingList = false;
        this.tost.successToastr(res.msg)
        this.modalService.dismissAll()
        this.getShiftAccToRole()

      }, error => {
        this.loadingList = false;
      }
      )
    
  }

  ngOnDestroy(): void {
  }

  onItemSelect(e){
    if(this.currentUser.user_role == '2'){
      this.dataService.getAgenciesByID(this.currentUser.id).subscribe((res: any) => {
        this.slctSrtNm =  res.body[0].sort_name
    })
    }
  }
}
