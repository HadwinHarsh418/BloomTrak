import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Role, shift, User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { ApiService } from 'app/auth/service/api.service';
import { DataService } from 'app/auth/service/data.service';
import { EncryptionService } from 'app/utils/encryption/encryption.service';
import { Page } from 'app/utils/models';
import { ToastrManager } from 'ng6-toastr-notifications';
import moment from 'moment';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { IDropdownSettings } from 'ng-multiselect-dropdown/multiselect.model';
import { Patterns } from 'app/auth/helpers/patterns';
import { ConfirmedValidator } from 'app/auth/helpers/mustMacth';
import { StaticServiceService } from 'app/utils/static-service.service';

@Component({
  selector: 'app-shift',
  templateUrl: './shift.component.html',
  styleUrls: ['./shift.component.scss']
})
export class ShiftComponent implements OnInit {
  searchSub: any = null;
  public page = new Page();
  loadingList: boolean;
  searchStr: string = '';
  public rows: any = [];
  todaysDate: any;
  btnShow: boolean = false;
  addShiftType: FormGroup;
  formData: FormGroup;
  editFormData!: FormGroup;
  mngmCommunity: any = [];
  allCommunity: any = [];
  currenUserId: any = ''
  public currentUser: User;
  minDate: any;
  approvedHide: boolean = false;
  shiftTypeDrpHide: boolean = false;
  start_date: any;
  end_date: any;
  id: { id: any; };
  @ViewChild('searchStrInput', { static: true }) searchStrInput: ElementRef<any>;
  @ViewChild('deleteShift') deleteShift: ElementRef<any>;
  @ViewChild('Addnew') Addnew: ElementRef<any>;
  @ViewChild('reasonMdl') reasonMdl: ElementRef<any>;
  @ViewChild('reasonLstMdl') reasonLstMdl: ElementRef<any>;
  @ViewChild('UserLiST') UserLiST: ElementRef<any>;
  @ViewChild('appliedList') appliedList: ElementRef<any>;
  // @ViewChild('clockInModal') clockInModal: ElementRef<any>;
  dsble: boolean = false;
  shiftType: any = '';
  cpType: any;
  user = new shift();
  formArray: any[] = [];
  addPrms: any;
  dltPrms: any;
  edtPrms: any;
  vwPrms: any;
  CmntdropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    closeDropDownOnSelection: true,
    itemsShowLimit: 3,
    allowSearchFilter: true,
    maxHeight:250
  };
  dropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'value',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true,
    closeDropDownOnSelection: true
  };
  dropdownSettings1: IDropdownSettings = {
    singleSelection: true,
    idField: 'value',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    closeDropDownOnSelection: true,
    allowSearchFilter: true
  };
  dropdownSettings2: IDropdownSettings = {
    singleSelection: true,
    idField: 'value',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true,
    closeDropDownOnSelection: true
  };
  dropdownSettings3: IDropdownSettings = {
    singleSelection: true,
    idField: 'id',
    textField: 'community_name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    closeDropDownOnSelection: true,
    itemsShowLimit: 3,
    allowSearchFilter: true
  };
  Hours: any = [
    { hour: '01' },
    { hour: '06' },
    { hour: '12' },
    { hour: '24' },
    { hour: '48' },
  ]

  Minutes: any = [
    { minute: '05' },
    { minute: '15' },
    { minute: '30' },
    { minute: '45' },
  ]

  timeslots: any[] = [
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
  user_id: any;
  rows1: any = []
  singleShiftdtail: any = []
  appliedUserdtail: any;
  data: any;
  data1: any;
  dt_tm: any = []
  dt_tm1: any = []
  shiftId: any;
  h_m: string;
  end_time: any;
  start_time: any;
  endTime: any;
  startTime: any;
  department: any = [];
  description: any;
  positions: any = [];
  certification: any = [];
  is_urgent: any;
  delay: any;
  for_cp: any;
  shiftID: any;
  shiftCommunication: any;
  community: any;
  position: any = [];
  cmntId: any;
  hideTbl: boolean = false;
  chngCommntyList: any = []
  slctCpType: any;
  srchVal: any;
  start_time1: any;
  end_time1: any;
  cmpltShft: any = []
  hideTbl2: boolean = false
  hideTbl3: boolean = false
  rows2: any = []
  agncyUsr: any = []
  prmsUsrId: any;
  agcydata: any;
  agncyUsr1: any;
  getAgencyMonthlyBudgetData: any;
  asgnBtnDsbl: boolean = false;
  aplyPrms: any;
  rl_id: any;
  roleData: any=[]
  hideBtn: boolean;
  replcShitData: any;
  reason: any;
  frstNewApply: any;
  sngUser: any;
  cancel_reason: any;
  row: any;
  resonIsNull: boolean;
  UserCanceledShiftById: any;
  slctSrtNm: any;
  phoneUsd: { name: string; flag: string; code: string; dial_code: string; }[];
  selectedDataValue: any;
  roleData2: any[]=[];
  AgencyRowsData: any[]=[];
  constructor(
    private encryptionService: EncryptionService,
    private dataService: DataService,
    private _authenticationService: AuthenticationService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private tost: ToastrManager,
    private genApi: ApiService,  
      private phoneService : StaticServiceService

  ) {
    // this.initQuestions();
    this.page.size = 10;
    this.phoneUsd = this.phoneService.phoneUsdCode
    this._authenticationService.currentUser.subscribe
      (x => {
        this.currentUser = x;
        
        this.onItemSelect(this.currentUser?.id)
      }
      );
     
      this.getRole()
    this.shiftType = null
    this.slctCpType = null
    this.getAgencyMonthlyBudget()

  }

  mapCountry_selected(data){
    return this.selectedDataValue = data.dial_code;
  }

  ngOnInit(): void {
    this.getAgncyDtail()
    setTimeout(() => {
      this.delay = this.Hours[0].hour
    }, 1000);

    // this.getData();
    this.getCommunityId()
    // this.filterShift(1)
    let today = new Date();
    this.user = new shift()
    this.user.h_m = 'Hours';
    this.todaysDate = this.getDate(today)
    this.addShiftType = this.fb.group({
      shiftType: ['']
    })


    this.formData = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required, Validators.pattern(Patterns.number)]],
      agency_id: [''],
      password: ['',Validators.compose([Validators.required, Validators.pattern(Patterns.password)])],
      cnfrmpassword:  ['', [Validators.required]],
      addUsrRl:  ['', [Validators.required]],
    }, { 
      validator: ConfirmedValidator('password', 'cnfrmpassword')
    },)

    if (this.currentUser?.role == "User"|| this.currentUser?.role == 'Community User' || this.currentUser?.role == "Agency" || (this.currentUser?.role == 'Community' && this.currentUser?.user_role == '4')) {
      fromEvent(this.searchStrInput?.nativeElement, 'keyup').pipe(
        map((event: any) => {
          this.srchVal = event.target.value;
          return this.srchVal

        })
        , debounceTime(1000)
        , distinctUntilChanged()
      ).subscribe((text: string) => {
        if (this.hideTbl == true) {
          this.filterShift(1)
        } else {
          this.filterShift1(2)
        }
      });
    } else {
      fromEvent(this.searchStrInput?.nativeElement, 'keyup').pipe(
        map((event: any) => {
          return event.target.value
        })
        , debounceTime(1000)
        , distinctUntilChanged()
      ).subscribe((text: string) => {
        this.setPage({ offset: 0 })
      });
    }


  }
  getRoles(){
    // let comunity_id=this.currentUser?.id
let id = this.currentUser?.prmsnId
    let data = {
      prms : (id == '1') ? 'community_id' : (id == '2') ? 'agency_id' : 'null',
       id : this.currentUser?.id
    }
    this.dataService.getRole(data).subscribe((res:any)=>{
      if(!res.error){
        this.data1 = res.body.sort(function(a, b){
          if(a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
          if(a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
          return 0;
      });;
     
      }else{
      this.tost.errorToastr('Something went wrong please try again later')
      }
    },err=>{
      this.dataService.genericErrorToaster()
    })
}
  // getData() {
  //   this.dataService.getMNMGcommunity().subscribe(res => {
  //     if (!res.error) {
  //       this.rows1 = res.body;
  //       this.rows1.forEach(element => {
  //         this.mngmCommunity.push(element)
  //       });
  //       this.mngmCommunity = [].concat(this.mngmCommunity);
  //     }
  //   });

  // }

  modalOpenOSE(modalOSE, size = 'md') {
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
    this.cancel_reason = ''
  }

  closededAll() {
    this.modalService.dismissAll();
  }

  getAgncyDtail() {
    this.dataService.getAgenciesByID(this.currentUser?.id).subscribe((res: any) => {
      if (!res.error) {
        this.agcydata = res.body[0]
      }
      else {
        this.tost.errorToastr(res.msg)
      }
    }, (err) => {
      this.dataService.genericErrorToaster()
    })
  }

  get controls() {
    return this.formData.controls;
  }

  submitted(modal) {
    // this.formData.reset()
    for (let item of Object.keys(this.controls)) {
      this.controls[item].markAsDirty()
    }
    if (this.formData.invalid) {
      return;
    }

    if(this.frstNewApply == 2){
      let data = {
        shift_id:this.replcShitData.shift_id,
        aggency_id:this.replcShitData.aggency_id,
        user_id:this.replcShitData?.agency_user || this.replcShitData.phone_number,
        phone_number: this.controls.phone_number.value?.replace(/\D/g, ''),
        first_name: this.controls.first_name.value,
        last_name: this.controls.last_name.value,
        // replaced_user_id: this.replcShitData.User.id || '',
        old_number:this.replcShitData.phone_number,
        reason : this.reason,
        is_for : 'add_new',
        user_name:this.replcShitData.username,

      }
        this.dataService.replaceShiftUser(data).subscribe((res: any) => {
          this.loadingList = false;
          this.modalService.dismissAll()
          this.filterShift1(2)
  
        }, error => {
          this.loadingList = false;
        }
        )
    }

    let data = {
      // is_for: "add_new",
      // first_name: this.controls.first_name.value,
      // last_name: this.controls.last_name.value,
      // phone_number: this.controls.phone_number.value.replace(/\D/g, ''),
      // pin: this.controls.pin.value,
      // hourly_rate: this.agcydata.hourly_rate,
      // agency_id: this.currentUser?.id,
      // shift_id: this.prmsUsrId?.shift_id ||  this.frstNewApply?.shift_id
      phone_number: this.formData.value.phone_number?.replace(/\D/g, ''),
      email: this.formData.value.email,
      first_name: this.formData.value.first_name,
      last_name: this.formData.value.last_name,
      username: this.slctSrtNm +'-'+ this.formData.value.username.replace(' ','').trim(),
      password: this.formData.value.password,
      agency_id: [this.currentUser?.id],
      isAdmin : '5',
      country_code:this.selectedDataValue? this.selectedDataValue : '',
      roles:this.formData.value.addUsrRl
    }
    // let body = {
    //   for_cp: this.prmsUsrId?.for_cp,
    //   shift_id: this.currentUser?.role == 'Agency' ? this.prmsUsrId?.shift_id : this.prmsUsrId?.id,
    //   user_id: this.currentUser?.id,
    //   is_agency: this.currentUser?.role == 'Agency' ? 1 : 0,
    //   agency_user :this.controls.phone_number.value.replace(/\D/g, ''),
    // }

    // this.dataService.applyShift(body).subscribe((res: any) => {
    //   if (!res.error) {
    //     this.tost.successToastr(res.msg)
        this.dataService.addUser(data).subscribe((res: any) => {
          if (!res.error) {
           
            this.tost.successToastr(res.msg);
            // this.tempAddId = res.body[0]
            this.formData.reset()
            this.getAgncyUsrLst()
            modal.dismiss();
            // this.setPage({ offset: 0 })
          } else {
            this.tost.errorToastr(res.msg);
          }
          this.btnShow = false;
        },
          (err) => {
            this.btnShow = false;
            this.dataService.genericErrorToaster();

          })
      // }
      // else {
      //   this.btnShow = false;
      //   this.formData.reset()
      //   this.tost.errorToastr(res.msg)
      //   this.modalService.dismissAll()
      // }
    // }, (err) => {
    //   this.dataService.genericErrorToaster()
    // })
    this.btnShow = true;

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
    if ((this.currentUser?.role == 'Community' && this.currentUser?.user_role !=4) || this.currentUser?.role == 'SuperAdmin' || this.rl_id == 15  || this.addPrms == '1') {
      // if((this.currentUser?.role == 'Community User'&& this.currentUser?.user_role =='4')|| this.addPrms == '1'){
      //   this.currentUser?.role = Role.Community
      // }
      this.getCommunityShifts()
    } else if (this.currentUser?.role == 'User' || this.currentUser?.role == 'Community User' || this.currentUser?.role == 'Agency' || (this.currentUser?.role == 'Community' && this.currentUser?.user_role ==4)) {
      this.filterShift(1)
    }
    else if (this.currentUser?.role == 'Admin') {
      let id = this.currentUser?.community ?? this.currentUser?.id
      let usetype = null
      let start_time = null
      let end_time = null
      this.dataService.getCommunityShifts(this.searchStr, this.page.pageNumber, usetype, id, this.page.size, start_time, end_time).subscribe(res => {
        if (!res.error) {
          this.rows = res.body
          this.rows = this.rows.map(i => {
            if (i.assigned == 0) {
              i.approval = 'Posted'
            } else if (i.assigned == 2) {
              i.approval = 'Filled By Community'
            } else if (i.assigned == 3 && i.status == "0"|| i.assigned == 3 && i.status == "0" && i.cancellation_period_reached =='0') {
              i.approval = 'Filled By Agency'
            } else if ( i.assigned == 2 && i.status == "1") {
              i.approval = 'Started By Community'
            } 
            else if ( i.assigned == 2 && i.status == "3") {
              i.approval = 'Completed By Community'
            }  else if ( i.assigned == 3 && i.status == "1") {
              i.approval = 'Started By Agency'
            } 
            else if ( i.assigned == 3 && i.status == "3") {
              i.approval = 'Completed By Agency'
            } 
            else if ( i.assigned == 5 && i.status == "5" ){
              i.approval = 'Closed'
              i.hideBtn = true
            }
            else {
              i.approval = 'Pending'
            }
            return i
          })
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
    // else {
    //   let userShifts = ''
    //   this.dataService.getshift(this.searchStr, this.page.pageNumber, this.page.size,userShifts).subscribe(res => {
    //     if (!res.error) {
    //       this.rows = res.body
    //       this.rows.map(rt => {
    //         console.log(
    //           rt.start_time = moment.unix(rt.start_time).format("YYYY-MM-DD hh:mm"),
    //           rt.end_time = moment.unix(rt.end_time).format("YYYY-MM-DD hh:mm"))
    //       })
    //       if (!res.pagination) {
    //         this.page.size = res.body.length;
    //         this.page.totalElements = res.body.length;
    //         this.page.pageNumber = res.pagination.pageNumber;
    //         this.page.totalPages = res.pagination.totalPages;
    //       } else {
    //         this.page = res.pagination
    //         this.page.pageNumber = res.pagination.pageNumber
    //       }
    //     } else {
    //       this._authenticationService.errorToaster(data)
    //     }
    //     this.loadingList = false;
    //   }, error => {
    //     this.loadingList = false;
    //   }
    //   )
    // }
  }

  applyShift1(row,no) {
    
    this.frstNewApply = no
    this.prmsUsrId = row
    if (this.currentUser?.role != 'Agency') {
      this.applyShift(row)
    } else {
      this.getAgncyUsrLst()
      this.modalOpenOSE(this.UserLiST, 'lg');
    }
  }

  applyShift(row) {
    this.prmsUsrId = row
    let body = {
      for_cp: this.prmsUsrId.for_cp,
      // first_name: this.prmsUsrId.first_name.value,
      // last_name: this.prmsUsrId.last_name.value,
      // phone_number: this.prmsUsrId.phone_number.value.replace(/\D/g, ''),
      // pin: this.prmsUsrId.pin,
      shift_id: this.currentUser?.role == 'Agency' ? this.prmsUsrId.shift_id : this.prmsUsrId.id,
      user_id: this.currentUser?.id,
      is_agency: this.currentUser?.role == 'Agency' ? 1 : 0
    }

    this.dataService.applyShift(body).subscribe((res: any) => {
      if (!res.error) {
        this.tost.successToastr(res.msg)
        if (this.currentUser?.user_role == '4') {
          this.setPage({ offset: 0 });
        }
      }
      else {
        this.tost.errorToastr(res.msg)
      }
    }, (err) => {
      this.dataService.genericErrorToaster()
    })
  }

  getCommunityId() {
    this.dataService.getCommunityId().subscribe((response: any) => {
      if (response['error'] == false) {
        this.allCommunity = response.body;
        //this.toastr.successToastr(response.msg);
      } else if (response['error'] == true) {
        this.tost.errorToastr(response.msg);
      }
    }, (err) => {
      this.dataService.genericErrorToaster();

    })
    // this.allCommunity = [].concat(this.allCommunity);

  }

  // getDate(miliS) {
  //   let todayDate: any = new Date(miliS);
  //   let toDate: any = todayDate.getDate();
  //   if (toDate < 10) {
  //     toDate = '0' + toDate
  //   }
  //   let month = todayDate.getMonth() + 1;
  //   if (month < 10) {
  //     month = '0' + month;
  //   }
  //   let year = todayDate.getFullYear();
  //   this.minDate = year + '-' + month + '-' + toDate
  //   return this.minDate
  // }

  openDeleteShift(row: any,) {
    this.id = { id: row.id }
    this.modalOpenOSE(this.deleteShift, 'lg');
  }

  openAddNew() {
    this.modalOpenOSE(this.Addnew, 'lg');
    this.getRoles()
  }




  deleteshift(modal: NgbModalRef) {
    this.btnShow = true;
    this.dataService.deleteshift(this.id).subscribe((res: any) => {
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
        this.genApi.genericErrorToaster()

      })
  }

  getCommunityShift() {
    let currentUser1 = this.currentUser?.id
    this.dataService.getCommunityShift(currentUser1).subscribe((res: any) => {
      if (!res.error) {
        this.rows = res.body
        if (!res.pagination) {
          this.page.size = res.body.length;
          this.page.totalElements = res.body.length;
          // this.page.pageNumber = res.pagination.pageNumber;
          // this.page.totalPages = res.pagination.totalPages;
        } else {
          this.page = res.pagination
          this.page.pageNumber = res.pagination.pageNumber
        }
      }
    },
      (err) => {
        this.dataService.genericErrorToaster();
      })
  }

  filterShift(no) {
    if (no == 1) {
      this.hideTbl = true
      this.hideTbl2 = false
      this.hideTbl3 = false
    }

    if (this.currentUser?.role == 'User' || this.currentUser?.role == 'Community User' || this.currentUser?.role == 'Agency' || (this.currentUser?.role == 'Community' && this.currentUser?.user_role == '4')) {
      let for_cp1 = this.currentUser?.prmsnId == '4' || this.currentUser?.prmsnId == '18' || this.currentUser?.user_role == '4' ? 'true' : this.currentUser?.prmsnId == '5'? 'agencyUser' : 'false';
      let currentUser1 = this.currentUser?.id
      this.shiftTypeDrpHide = false
      let cpType = { cpType2: this.shiftType ? this.shiftType : null }
      let slctCpType = { cpType2: this.slctCpType ? this.slctCpType : null }
      let tpUsr = 'typeUser';
      if(this.currentUser?.role == 'Community User'){
        this.hideTbl = true;
      }
      if (this.currentUser?.user_role == '5') {
        this.dataService.getUserAgencyshiftById(this.currentUser?.id).subscribe((res: any) => {
          if (!res.error) {
            this.rows = res.body.availableShifts.sort(function (a, b) {
              if (a.start_time > b.start_time) { return -1; }
              if (a.start_time < b.start_time) { return 1; }
              return 0;
            });
            this.rows =this.rows.map(i => {
             
               if (i.assigned == 0) {
                i.approval = 'Posted'
              } else if (i.assigned == 2 && i.status !== 3) {
                i.approval = 'Filled By Community'
              } else if (i.assigned == 3 && i.status == "0"|| i.assigned == 3 && i.status == "0"&&i.cancellation_period_reached =='0' || i.assigned == 3 && i.status == "0"&&i.is_mannual == '0') {
                i.approval = 'Filled By Agency'
              } else if ( i.assigned == 2 && i.status == "1") {
                i.approval = 'Started By Community'
              } 
              else if ( i.assigned == 2 && i.status == "3") {
                i.approval = 'Completed By Community'
              }  else if ( i.assigned == 3 && i.status == "1") {
                i.approval = 'Started By Agency'
              } 
              else if ( i.assigned == 3 && i.status == "3") {
                i.approval = 'Completed By Agency'
              }else if ( i.assigned == 5 && i.status == "5" ){
                i.approval = 'Closed'
                i.hideBtn = true
              }
              // else if ( i.assigned == 9 && i.status == 5){
              //   i.approval = 'Closed'
              // }
              else {
                i.approval = 'Pending'
              }
             return i;
            })
          }
          this.AgencyRowsData = res.body.availableShifts.filter(i =>{if (i.assigned == 0) {
            i.approval = 'Posted';
            return i;
          } else if (i.assigned == 2) {
            i.approval = 'Filled By Community'
          } else if (i.assigned == 3 && i.status == "0" || i.assigned == 3 && i.status == "0"&&i.is_mannual == '0') {
            i.approval = 'Filled By Agency'
          } else if ( i.assigned == 2 && i.status == "1") {
            i.approval = 'Started By Community'
          } 
          else if ( i.assigned == 2 && i.status == 3) {
            i.approval = 'Completed By Community'
          }  else if ( i.assigned == 3 && i.status == "1") {
            i.approval = 'Started By Agency'
          } 
          else if ( i.assigned == 3 && i.status == "3") {
            i.approval = 'Completed By Agency'
          } else if ( i.assigned == 5 && i.status == "5" ){
            i.approval = 'Closed'
            i.hideBtn = true
          }
          else {
            i.approval = 'Pending';
            return i;
          }})
        },
          (err) => {
            this.dataService.genericErrorToaster();
          })
      } else {
        this.dataService.getCommunityShiftByID(this.srchVal, for_cp1, currentUser1, cpType ? cpType : slctCpType, tpUsr).subscribe((res: any) => {
          if (!res.error) {
            this.rows = res?.body?.availableShifts?.sort(function (a, b) {
              if (a.start_time > b.start_time) { return -1; }
              if (a.start_time < b.start_time) { return 1; }
              return 0;
            });
            
            if(this.currentUser?.role == 'Agency' || this.currentUser?.role == "User"|| this.currentUser?.role == "Community User"){
              this.AgencyRowsData = this.rows = this.rows.filter(i =>{if (i.assigned == 0) {
                  i.approval = 'Posted';
                  return i;
                } else if (i.assigned == 2) {
                  i.approval = 'Filled By Community'
                } else if (i.assigned == 3 && i.status == "0" || i.assigned == 3 && i.status == "0"&&i.cancellation_period_reached =='0' || i.assigned == 3 && i.status == "0"&&i.is_mannual == '0') {
                  i.approval = 'Filled By Agency';
                  return i;
                } else if ( i.assigned == 2 && i.status == "1") {
                  i.approval = 'Started By Community'
                } 
                else if ( i.assigned == 2 && i.status == 3) {
                  i.approval = 'Completed By Community'
                }  else if ( i.assigned == 3 && i.status == "1") {
                  i.approval = 'Started By Agency'
                } 
                else if ( i.assigned == 3 && i.status == "3") {
                  i.approval = 'Completed By Agency'
                } else if ( i.assigned == 5 && i.status == "5" ){
                  i.approval = 'Closed'
                  i.hideBtn = true
                }
                else {
                  i.approval = 'Pending';
                  return i;
                }})
            }else{
              this.AgencyRowsData = this.rows.filter(i => {
                if (i.assigned == 0) {
                  i.approval = 'Posted'
                } else if (i.assigned == 2) {
                  i.approval = 'Filled By Community'
                } else if (i.assigned == 3 && i.status == "0"|| i.assigned == 3 && i.status == "0"&&i.cancellation_period_reached =='0'|| i.assigned == 3 && i.status == "0"&&i.is_mannual == '0') {
                  i.approval = 'Filled By Agency';
                  return i;
                } else if ( i.assigned == 2 && i.status == "1") {
                  i.approval = 'Started By Community'
                } 
                else if ( i.assigned == 2 && i.status == 3) {
                  i.approval = 'Completed By Community'
                }  else if ( i.assigned == 3 && i.status == "1") {
                  i.approval = 'Started By Agency'
                } 
                else if ( i.assigned == 3 && i.status == "3") {
                  i.approval = 'Completed By Agency'
                } else if ( i.assigned == 5 && i.status == "5" ){
                  i.approval = 'Closed'
                  i.hideBtn = true
                }
                else {
                  i.approval = 'Pending'
                }
                // if(i.user_name){
                //   i.user_name1 = i.user_name
                // }else if(i.user_name == null && i.first_name != null && i.last_name != null){
                //   i.user_name1 = i.first_name + i.last_name
                // }else if(i.user_name == null && i.first_name == null && i.last_name == null ){
                //   i.user_name1 = 'Not Assigned'
                // }
                return i;
              })
            }
            
            
          }
          
        },
          (err) => {
            this.dataService.genericErrorToaster();
          })
      }

    }else{
      this.refresh()
    }
  }

  filterShift1(no) {

    if (no == 2) {
      this.hideTbl2 = true
      this.hideTbl = false
      this.hideTbl3 = false
    }
    if (this.currentUser?.role == 'SuperAdmin' || this.rl_id == 15) {
      this.getCommunityShifts()
    }
    if (this.roleData.includes(this.currentUser?.prmsnId) || this.currentUser?.role == 'Agency' || this.currentUser?.role == 'User') {
      let for_cp1 = this.currentUser?.prmsnId == '4' || this.currentUser?.prmsnId == '18'|| this.currentUser?.prmsnId == '76' || this.currentUser?.user_role == '4' ? 'true' : this.currentUser?.prmsnId == '5'? 'agencyUser' : 'false';
      let currentUser1 = this.currentUser?.id
      this.shiftTypeDrpHide = true
      let cpType = { cpType2: this.shiftType ? this.shiftType : null }
      let tpUsr = 'typeUser1'
      let slctCpType = { cpType2: this.slctCpType ? this.slctCpType : null }
      this.shiftTypeDrpHide = true
      if (this.currentUser?.user_role == '5') {
        this.dataService.getUserAgencyshiftById(this.currentUser?.id).subscribe((res: any) => {
          if (!res.error) {
            this.rows1 = res.body.userShifts.sort(function (a, b) {
              if (a.start_time > b.start_time) { return -1; }
              if (a.start_time < b.start_time) { return 1; }
              return 0;
            });
            this.rows1 = this.rows1.map(i => {
              if ( i.assigned == 3 && i.status == "3") {
                i.approval1 = 'Completed By Agency';
               i.approvedHide = true
              } else if ( i.assigned == 5 && i.status == "5" ){
                i.approval1 = 'Closed'
                i.hideBtn = true;
               i.approvedHide = true
              }else 
              if (i.approved == 1) {
               i.approval1 = 'Assigned'
               i.approvedHide = true
             } else if (i.approved == 0 && i.assigned == 1) {
               i.approval1 = 'Not Assigned'
               i.approvedHide = false
             }
             else if((i.approved  == 0 || i.approved == 2) && (i.assigned == 2 || i.assigned == 3  || i.assigned ==0) && i.self_cancel ==0){
              i.approval1 = 'Canceled'
             }
             else if((i.approved  == 0 || i.approved == 2) && (i.assigned == 2 || i.assigned == 3  || i.assigned ==0) && i.self_cancel ==1){
              i.approval1 = 'Canceled By User'
             }
             return i;
           })
          }
        },
          (err) => {
            this.dataService.genericErrorToaster();
          })
      } else {
        this.dataService.getCommunityShiftByID(this.srchVal, for_cp1, currentUser1, cpType ? cpType : slctCpType, tpUsr).subscribe((res: any) => {
          if (!res.error) {
            if(res.body.userShifts.length < 1){
              this.rows1=[]
            }
            this.rows1 = res.body.userShifts.sort(function (a, b) {
              if (a.start_time > b.start_time) { return -1; }
              if (a.start_time < b.start_time) { return 1; }
              return 0;
            });

            this.rows1 = this.rows1.map(i => {
              
              if (i.assigned == 3 && i.status == "3") {
                i.approval1 = 'Completed By Agency'
                i.expired = this.checkErrorDate(i.start_time)
              } else if (i.assigned == 5 && i.status == "5"){
                i.approval1 = 'Closed'
                i.hideBtn = true;
                i.expired = this.checkErrorDate(i.start_time)
              }else 
              if (i.approved == 1) {
               i.approval1 = 'Assigned'
               i.approvedHide = true
               i.expired = this.checkErrorDate(i.start_time)
             } else if (i.approved == 0 && i.assigned == 1) {
               i.approval1 = 'Not Assigned'
               i.approvedHide = false
               i.expired = this.checkErrorDate(i.start_time)
             }
             else if((i.approved  == 0 || i.approved == 2) && (i.assigned == 2 || i.assigned == 3  || i.assigned ==0) && i.self_cancel ==0){
              i.approval1 = 'Canceled';
              i.expired = this.checkErrorDate(i.start_time)
             }
             else if((i.approved  == 0 || i.approved == 2) && (i.assigned == 2 || i.assigned == 3  || i.assigned ==0) && i.self_cancel ==1){
              i.approval1 = 'Canceled By User'
              i.expired = this.checkErrorDate(i.start_time)
             }
             return i;
           })
           this.rows1 = this.rows1.map(i => {
              if (i) {
                i.user_name1 = (i.first_name ?? '') + ' ' + i.user_lastname
              }
              return i
            })
          }
          
          
        },
          (err) => {
            this.dataService.genericErrorToaster();
          })
      }
    }
    
  }

  checkErrorDate(val){
    const timestamp = Number(val) * 1000;
              const moment = new Date(timestamp);

              // Get the current date and time
              const currentDate = new Date();

              // Compare the moment to the current date
              if (moment <= currentDate) {
                return true
              } else {
                return false
              }
  }

  // cmpltShift(no) {
  //   this.cmpltShft = []
  //   if (no == 3) {
  //     this.hideTbl3 = true
  //     this.hideTbl = false
  //     this.hideTbl2 = false
  //   }
  //   if (this.currentUser?.role == 'User' || this.currentUser?.role == 'Agency') {
  //     let for_cp1 = this.currentUser?.role == 'User' ? 'true' : 'false';
  //     let currentUser1 = this.currentUser?.id
  //     this.shiftTypeDrpHide = true
  //     let cpType = { cpType2: this.shiftType ? this.shiftType : null }
  //     let tpUsr = 'typeUser1'
  //     let slctCpType = { cpType2: this.slctCpType ? this.slctCpType : null }
  //     this.dataService.getCommunityShiftByID(this.srchVal, for_cp1, currentUser1, cpType ? cpType : slctCpType, tpUsr).subscribe((res: any) => {
  //       if (!res.error) {
  //         this.rows2 = res.body.userShifts.sort(function (a, b) {
  //           if (a.start_time > b.start_time) { return -1; }
  //           if (a.start_time < b.start_time) { return 1; }
  //           return 0;
  //         });
  //         this.cmpltShft = this.rows2.filter(i => i.status == 2)
  //         //    this.rows2.forEach(i => {
  //         //   if (i.approved == 1) {
  //         //     i.approval = 'Approved'
  //         //     i.approvedHide = true
  //         //   } else if (i.approved != 1) {
  //         //     i.approval = 'Pending'
  //         //     i.approvedHide = false
  //         //   }

  //         // })
  //       }
  //     },
  //       (err) => {
  //         this.dataService.genericErrorToaster();
  //       })
  //   }
  // }

  getCommunityShifts() {
    if (this.currentUser?.role == 'Community' || this.rl_id == 15) {
      let currentUser1 = this.rl_id == 15 ? (this.currentUser?.com_id ?? this.currentUser?.id) : (this.currentUser?.com_id ?? this.currentUser?.id) 
      let userShift = this.shiftType ? this.shiftType : null
      if (this.start_date || this.startTime != 'undefined' || this.end_date || this.endTime != 'undefined') {
        this.start_time1 = this.start_date || this.startTime ? this.cnvrtnewDt(this.start_date + ' ' + this.startTime) : null;
        this.end_time1 = this.end_date || this.endTime ? this.cnvrtnewDt(this.end_date + ' ' + this.endTime) : null;
      } else {
        this.start_time1 = null
        this.end_time1 = null
      }
      this.dataService.getCommunityShifts(this.searchStr, this.page.pageNumber, userShift, currentUser1, this.page.size, this.start_time1, this.end_time1).subscribe((res: any) => {
        if (!res.error) {
          this.rows = []
          this.rows = res.body.sort(function (a, b) {
            if (a.start_time > b.start_time) { return -1; }
            if (a.start_time < b.start_time) { return 1; }
            return 0;
          });
          this.rows = this.rows.map(i => {
            if (i.assigned == 0) {
              i.approval = 'Posted'
            } else if (i.assigned == 2&& i.status == "0") {
              i.approval = 'Filled By Community'
            } else if (i.assigned == 3 && i.status == "0"|| i.assigned == 3 && i.status == "0"&&i.cancellation_period_reached =='0') {
              i.approval = 'Filled By Agency'
            } else if ( i.assigned == 2 && i.status == "1") {
              i.approval = 'Started By Community'
            } 
            else if ( i.assigned == 2 && i.status == "3") {
              i.approval = 'Completed By Community'
            }  else if ( i.assigned == 3 && i.status == "1") {
              i.approval = 'Started By Agency'
            } 
            else if ( i.assigned == 3 && i.status == "3") {
              i.approval = 'Completed By Agency'
            } 
            else if ( i.assigned == 5 && i.status == "5" ){
              i.approval = 'Closed'
              i.hideBtn = true
            }
            else {
              i.approval = 'Pending'
            }
            return i
          })
          if (!res.pagination) {
            this.page.size = res.pagination.size;
            this.page.totalElements = res.pagination.totalElements;
            this.page.pageNumber = res.pagination.pageNumber;
            this.page.totalPages = res.pagination.totalPages;
          } else {
            this.page = res.pagination
            this.page.pageNumber = res.pagination.pageNumber
          }
        }
        
      },
        (err) => {
          this.dataService.genericErrorToaster();
        })
    } else if (this.currentUser?.role == 'User' || this.currentUser?.role == 'Agency') {

      let for_cp1 = this.currentUser?.prmsnId == '4' || this.currentUser?.prmsnId == '18' ? 'true' : this.currentUser?.prmsnId == '5'? 'agencyUser' : 'false';
      let currentUser1 = this.currentUser?.id
      let cpType = { cpType2: this.shiftType ? this.shiftType : null }
      let slctCpType = { cpType2: this.slctCpType ? this.slctCpType : null }
      let tpUsr = 'typeUser'

      this.dataService.getCommunityShiftByID(this.searchStr, for_cp1, currentUser1, cpType ? cpType : slctCpType, tpUsr).subscribe((res: any) => {
        if (!res.error) {
          this.rows = res.body.availableShifts.sort(function (a, b) {
            if (a.start_time > b.start_time) { return -1; }
            if (a.start_time < b.start_time) { return 1; }
            return 0;
          });
          this.rows = this.rows.map(i => {
            if (i.assigned == 0) {
              i.approval = 'Posted'
            } else if (i.assigned == 2) {
              i.approval = 'Filled By Community'
            } else if (i.assigned == 3 && i.status == "0"|| i.assigned == 3 && i.status == "0"&&i.cancellation_period_reached =='0') {
              i.approval = 'Filled By Agency'
            } else if ( i.assigned == 2 && i.status == "1") {
              i.approval = 'Started By Community'
            } 
            else if ( i.assigned == 2 && i.status == "3") {
              i.approval = 'Completed By Community'
            }  else if ( i.assigned == 3 && i.status == "1") {
              i.approval = 'Started By Agency'
            } 
            else if ( i.assigned == 3 && i.status == "3") {
              i.approval = 'Completed By Agency'
            } 
            else if ( i.assigned == 5 && i.status == "5" ){
              i.approval = 'Closed'
              i.hideBtn = true
            }
            else {
              i.approval = 'Pending'
            }
            return i
          })
        }
        
      },
        (err) => {
          this.dataService.genericErrorToaster();
        })
    } else {
      let userShift = this.shiftType ? this.shiftType : null
      this.dataService.getshift(this.searchStr, this.page.pageNumber, this.page.size, userShift).subscribe((res: any) => {
        if (!res.error) {
          this.rows = res.body
          this.rows = res.body
          this.rows.forEach(i => {
            if (i.assigned == 2) {
              i.approval = 'Filled By Community'
              i.approvedHide = true
            } else if (i.assigned == 3) {
              i.approval = 'Filled By Agency'
              i.approvedHide = false
            }else if (i.assigned == 0) {
              i.approval = 'Posted'
              // i.approvedHide = false
            }
            else if ( i.assigned == 5 && i.status == 5 ){
              i.approval = 'Closed'
              i.hideBtn = true
            }
            else{
              i.approval = 'Pending'
            }
          })
          if (!res.pagination) {
            this.page.size = res.pagination.size;
            this.page.totalElements = res.pagination.totalElements;
            this.page.pageNumber = res.pagination.pageNumber;
            this.page.totalPages = res.pagination.totalPages;
          } else {
            this.page = res.pagination
            this.page.pageNumber = res.pagination.pageNumber
          }
        }
      },
        (err) => {
          this.dataService.genericErrorToaster();
        })
    }
  }

  getCommunityShiftByID() {

    let currentUser1 = this.currentUser?.id
    let userShift = this.currentUser?.prmsnId == '4' ? 'true' : this.currentUser?.prmsnId == '5'? 'agencyUser' : 'false'
    // let cpType = {cpType2 : this.shiftType ? this.shiftType : null , cpType1  : 'typeUser'}
    let slctCpType = { cpType2: this.slctCpType ? this.slctCpType : null }
    let tpUsr = 'typeUser1'

    this.dataService.getCommunityShiftByID(this.searchStr, userShift, currentUser1, slctCpType, tpUsr).subscribe((res: any) => {
      if (!res.error) {
        this.rows1 = res.body.userShifts.sort(function (a, b) {
          if (a.start_time > b.start_time) { return -1; }
          if (a.start_time < b.start_time) { return 1; }
          return 0;
        });
        this.rows1 = this.rows1.map(i => {
          if ( i.assigned == 3 && i.status == "3") {
            i.approval = 'Completed By Agency'
          } else if ( i.assigned == 5 && i.status == "5" ){
            i.approval = 'Closed'
            i.hideBtn = true
          }else 
          if (i.approved == 1) {
           i.approval1 = 'Assigned'
           i.approvedHide = true
         } else if (i.approved == 0 && i.assigned == 1) {
           i.approval1 = 'Not Assigned'
           i.approvedHide = false
         }
         else if((i.approved  == 0 || i.approved == 2) && (i.assigned == 2 || i.assigned == 3  || i.assigned ==0) && i.self_cancel ==0){
          i.approval1 = 'Canceled'
         }
         else if((i.approved  == 0 || i.approved == 2) && (i.assigned == 2 || i.assigned == 3  || i.assigned ==0) && i.self_cancel ==1){
          i.approval1 = 'Canceled By User'
         }
         return i;
       })
        // if (this.currentUser?.role == 'Agency') {
        //   this.rows.filter(i => {
        //     if (i.for_cp == '0') {
        //       this.rows1.push(i)
        //       this.rows = this.rows1
        //     }
        //   })
        // }
      }
    },
      (err) => {
        this.dataService.genericErrorToaster();
      })
  }

  getDate(today) {
    // let todayDate: any = new Date();
    let toDate: any = today.getDate();
    if (toDate < 10) {
      toDate = '0' + toDate
    }
    let month = today.getMonth() + 1;
    if (month < 10) {
      month = '0' + month;
    }
    let year = today.getFullYear();
    this.minDate = year + '-' + month + '-' + toDate
    return this.minDate
  }

  assign(row) {
  }




  // initQuestions() {
  //   this.questions = [
  //     { id: 1, question: "1.What is Your Name?", answer: '', error: false },
  //     { id: 2, question: "2. What is your Role?", answer: '', error: false },
  //     { id: 3, question: "3. What are you doing here?", answer: '', error: false },
  //     { id: 4, question: "4. What is your DOB?", answer: '', error: false },
  //     { id: 5, question: "5. Write a short bio.", answer: '', error: false },
  //     { id: 6, question: "6. What is your Phone number?", answer: '', error: false },
  //     { id: 7, question: "7. Enter your valid Email-id.", answer: '', error: false },
  //     { id: 8, question: "8. Enter your Shift type.", answer: '', error: false },
  //     { id: 9, question: "9. From where you get to know about us.", answer: '', error: false },
  //     { id: 10, question: "10. Enter your address.", answer: '', error: false }
  //   ]
  // }

  //   modalOpenOSE(modalOSE, size = 'sm') {
  //   this.modalService.open(modalOSE,
  //     {
  //       backdrop: false,
  //       size: size,
  //       centered: true,
  //     }
  //   );
  // }

  //  closed(modal: NgbModalRef) {
  //   modal.dismiss();
  // }

  // openClockIn() { //open the model
  //   this.initQuestions();
  //   this.modalOpenOSE(this.clockInModal, 'lg');
  //   this.currentQuestions = 0
  // }
  // nextQuestion(modal) { // Used to move next
  //   if (!this.questions[this.currentQuestions].answer) { // checking if the answer is entered or not. If yes then move to other condition else show error
  //     this.questions[this.currentQuestions].error = true; // Show error to the user
  //     this.tost.errorToastr('Error, Field Required') // Toaster Notification
  //   }
  //   else {
  //     this.questions[this.currentQuestions].error = false;
  //     if (this.currentQuestions < this.questions.length - 1) { // checking if the index of current question is less than length of the questions array. 
  //       this.currentQuestions += 1; // If the above condition satisfies than increment the current question index and move next by one
  //     }
  //     else {
  //       this.closed(modal)// closes the modal
  //       this.tost.successToastr('Submitted Successfully') //Toaster Notification
  //       console.log(this.questions); // console the final output in array.
  //     }
  //   }
  // }

  refresh(){
    this.setPage({ offset: 0 })
  }

  strtshft(row) {
    let timeStart = moment(row.start_time).utc().unix();
    let tdy = new Date()
    let crrnTm = moment(tdy).utc().unix();
    let hourDiff = timeStart - crrnTm; //in ms
    // let secDiff = hourDiff / 1000;
    let minDiff = hourDiff / 60 / 1000; //in minutes
    let hDiff = hourDiff / 3600 / 1000; //in hours
    let hours = Math.floor(hDiff);
    let minutes = minDiff - 60 * hours;
    if (!isNaN(hours) && !isNaN(minutes)) {
      if (hours.toString().includes('-')) {
        this.tost.errorToastr('Shift is Over On this Current Time')
        return;
      }
      this.tost.errorToastr('Time is left ' + hours + ' hour and ' + minutes + ' minutes.')
      return;
    }
    let body = {
      is_for: 'start',
      id: row.id,
    }
    this.dataService.startShiftByID(body).subscribe((res: any) => {
      if (!res.error) {
        this.tost.successToastr(res.msg)
      }
    },
      (err) => {
        this.dataService.genericErrorToaster();
      })
  }

  cnvrtnewDt(date_tm) {
    let dt = moment(date_tm).format();
    let dt1 = dt.split('+')
    return moment(dt1[0]).utc().unix()
  }

  resetData() {
    if (this.start_date || this.startTime || this.end_date || this.endTime) {
      this.start_date = ''
      this.startTime = 'undefined'
      this.end_date = ''
      this.endTime = 'undefined'
    }
    this.ngOnInit();
  }

  getAgncyUsrLst() {
    let is_for = 'agency'
    let searchStr = ''
    this.dataService.getAgencyUnblockUser(this.prmsUsrId.id,this.currentUser?.id).subscribe((res: any) => {
      if (!res.error) {
        this.agncyUsr = res.body
        
        this.agncyUsr.map(i => {
          if(i.is_blocked == true){
            i.asgnBtnDsbl = true
          }else{
            i.asgnBtnDsbl = false
          }
        })

        // this.agncyUsr.map(i => {
        //   if (this.prmsUsrId.shift_id == i.shift_id && this.prmsUsrId.agency_user == i.agency_user) {
        //     if (i.approved == 1) {
        //       if(i.shift_status == 1) {
        //         this.dsble = true;
        //       }else{
        //         this.dsble = false;
        //       }  
        //       i.asgnBtn = true;
        //     } else {               
        //       i.asgnBtn = false;
        //     }
        //   } else {
        //     if(this.dsble == true) {
        //       this.dsble = true;
        //     }else{
        //       this.dsble = false;
        //     }
        //     i.asgnBtn = false;
        //   }

        // })
      }
    },
      (err) => {
        this.dataService.genericErrorToaster()
      })
  }

  assignShift(snglUsr, modal) {
    // this.snglUserDetl(snglUsr.id)
    
    let body = {
      for_cp: this.prmsUsrId.for_cp,
      // first_name: this.prmsUsrId.first_name.value,
      // last_name: this.prmsUsrId.last_name.value,
      // phone_number: this.prmsUsrId.phone_number.value.replace(/\D/g, ''),
      // pin: this.prmsUsrId.pin,
      shift_id: this.currentUser?.role == 'Agency' ? this.prmsUsrId.shift_id : this.prmsUsrId.id,
      user_id: this.currentUser?.id,
      agency_user: snglUsr.id,
      is_agency: this.currentUser?.role == 'Agency' ? 1 : 0,
    }

    this.dataService.applyShift(body).subscribe((res: any) => {
      if (!res.error) {
        this.tost.successToastr(res.msg)
        let data = {
          is_for  : '',
          shift_id: this.prmsUsrId.shift_id,
          user_id: snglUsr.id,
          agency_id: this.currentUser?.id,
          first_name: snglUsr.first_name,
          last_name: snglUsr.last_name,
          phone_number: snglUsr.phone_number,
          pin: snglUsr?.PIN_code || '',
          hourly_rate: snglUsr.hourly_rate,
          user_name:snglUsr.username
        }
        this.dataService.assignAGShift(data).subscribe((res: any) => {
          if (!res.error) {
            this.closeded(modal)
            this.setPage({ offset: 0 })
          }
        })
        if (this.currentUser?.user_role == '4') {
          this.setPage({ offset: 0 });
        }
      }
      else {
        this.modalService.dismissAll()
        this.tost.errorToastr(res.msg)
      }
    })
  }

  // snglUserDetl(id){
  //   let is_for = 'user'
  //   let searchStr = ''
  //   this.dataService.getUserById(searchStr = '', id, is_for).subscribe((res: any) => {
  //     if (!res.error) {
  //       this.agncyUsr1 = res.body
  //     }
  //   },
  //     (err) => {
  //       this.dataService.genericErrorToaster()
  //     })
  // }

  openReasonMdl(row){
    this.row = row
    this.modalOpenOSE(this.reasonMdl, 'lg');
  }

  keyupper(cancel_reason){
    if(!cancel_reason){
      this.resonIsNull = true
    }else{
      this.resonIsNull = false
    }
  }

  cancleShft() {
    if(!this.cancel_reason){
      this.resonIsNull = true
      return
    }else{
      this.resonIsNull = false
    }
    if(this.currentUser?.role == 'Agency'){
      this.data = {
        shift_id: this.row.shift_id,
        user_id: this.row.aggency_id,
        cancel_reason : this.cancel_reason,
        is_agency : '1'
      }
    }else{
      this.data = {
        shift_id: this.row.shift_id || this.row.id,
        user_id: this.currentUser?.id,
        cancel_reason : this.cancel_reason,
        is_agency : ''
      }
    }
    this.dataService.cancelUAppliedShift(this.data).subscribe((res: any) => {
      if (!res.error) {
        this.filterShift1(2)
        this.modalService.dismissAll()
        this.cancel_reason = ''
      }
    },
      (err) => {
        this.dataService.genericErrorToaster()
      })
    //     else{

    //  let data = {
    //         shift_id: row.shift_id,
    //         user_id: this.currentUser?.id,
    //         community_id:row.community_id
    //       }
    //       this.dataService.cancelAppliedShift(data).subscribe((res: any) => {
    //         if (!res.error) {
    //             this.filterShift1(2)
    //         }
    //       },
    //         (err) => {
    //           this.dataService.genericErrorToaster()
    //         })
    //     }

  }

  cngShft(e){
    if(e.target.value == 6){
      this.dataService.getArchive(this.currentUser?.id).subscribe((res: any) => {
        if (!res.error) {
          this.rows = res.body.sort(function (a, b) {
            if (a.start_time > b.start_time) { return -1; }
            if (a.start_time < b.start_time) { return 1; }
            return 0;
          });

          // this.rows.forEach(i => {
          //   if (i.assigned == 0) {
          //     i.approval = 'Posted'
          //   }  
          //   else {
          //     i.approval = 'Pending'
          //   }
          // })
        }
      })
    }else{
      if(this.currentUser?.user_role == '4'){
        this.filterShift(1)
      }else{
        this.getCommunityShifts()
      }
    }
  }

  getAgencyMonthlyBudget() {
    this.dataService.getAgencyMonthlyBudget(this.currentUser?.id).subscribe((res: any) => {
      if (!res.error) {
        this.getAgencyMonthlyBudgetData = res.body
      }
    },
      (err) => {
        this.dataService.genericErrorToaster()
      })
  }

  completeShift(row){
    let data ={
      shift_id : row.id
    }
    this.dataService.markShiftCompleteByID(data).subscribe((res: any) => {
      if (!res.error) {
        this.tost.successToastr(res.msg)
         this.setPage({ offset: 0 });
      }
    },
      (err) => {
        this.dataService.genericErrorToaster()
      })
  }

  getPrmsnData(){
    this.dataService.getPermissionByAdminRole().subscribe(
      (res:any) => {
        if (!res.error) {
          res.body.map(i=>{
            // 'community','agency administrator','employee', 'agenciesuser'
            // if(this.roleData.includes(i.role_id)){
              if(i.role_id ==15){
                this.rl_id = i.role_id
              }
              if(i.trak_type == '1')
              if(i.permission_name == 'Shifts'){
                this.addPrms  = i.add_permission
                this.dltPrms  = i.delete_permission
                this.edtPrms  = i.edit_permission
                this.vwPrms  = i.view_permission
                this.aplyPrms  = i.apply_permission
              }
          
              
            // }
          })
          this.setPage({ offset: 0 });
          
        } 
    }, (error:any) => {
      this.dataService.genericErrorToaster()
    }
    )
  }

  getRole(){
    this.dataService.getAllRole().subscribe((res:any)=>{
      if(!res.err){
        // console.log("Roles------",res.body);
         res.body.filter(i=>{ this.roleData.push(i.id.toString())})
         this.getPrmsnData()
        
      }
    },err=>{
      this.dataService.genericErrorToaster()
    })
  }

  reson(reason){
    this.reason = reason
  }

  replaceShiftUser(snglUsr,modal){
    // if(!this.reason){
    //   this.tost.errorToastr('Reason Field Is Required')
    // }
    this.sngUser = snglUsr
    let data = {
      shift_id:this.replcShitData.shift_id,
      aggency_id:this.replcShitData.aggency_id,
      user_id:this.replcShitData.agency_user || this.replcShitData.phone_number,
      replaced_user_id:snglUsr.id,
      phone_number:this.replcShitData.phone_number,
      reason : this.reason,
      user_name:snglUsr.username
    }
      this.dataService.replaceShiftUser(data).subscribe((res: any) => {
        this.loadingList = false;
        this.tost.successToastr(res.msg)
        this.modalService.dismissAll()
        this.filterShift1(2)

      }, error => {
        this.loadingList = false;
      }
      )
    
  }
  
  replcUsr(row,no){
    this.frstNewApply = no
    this.replcShitData = row
    this.modalOpenOSE(this.UserLiST, 'lg');
    this.getagencyUser()
  }

  getagencyUser(){
    let is_for = this.currentUser?.role == 'Agency' ? 'agency' : 'community'
      this.dataService.getAgencyUnblockUser(this.prmsUsrId?.id || this.currentUser?.com_id,this.currentUser?.id).subscribe((res: any) => {
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

  getUserCanceledShiftById(row){
    this.modalOpenOSE(this.reasonLstMdl, 'lg');
    this.dataService.getUserCanceledShiftById(row.id).subscribe((res: any) => {
      this.UserCanceledShiftById = res.body;
      this.UserCanceledShiftById.map(i=>{
        i.shift_cancel_time =   moment.unix(i.shift_cancel_time).format('MM-DD-YYYY hh:mm a')
      });
      this.loadingList = false;
    }, error => {
      this.loadingList = false;
    }
    )
  }

  onItemSelect(e){
    if(this.currentUser?.user_role == '2'){
      this.dataService.getAgenciesByID(this.currentUser?.id).subscribe((res: any) => {
        this.slctSrtNm =  res.body[0].sort_name
    })
    }
  }

}
