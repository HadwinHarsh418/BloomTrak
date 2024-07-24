import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'app/auth/service/authentication.service';
import { DataService } from 'app/auth/service/data.service';
import { FilterService } from 'app/auth/service/filter.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import moment from 'moment';
import { Page } from 'app/utils/models';
import { Patterns } from 'app/auth/helpers/patterns';
import { Subject } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { ConfirmedValidator } from 'app/auth/helpers/mustMacth';
import { IDropdownSettings } from 'ng-multiselect-dropdown/multiselect.model';
import { ActivatedRoute, Router } from '@angular/router';
import { log } from 'console';

@Component({
  selector: 'app-new-shifts',
  templateUrl: './new-shifts.component.html',
  styleUrls: ['./new-shifts.component.scss']
})
export class NewShiftsComponent implements OnInit {
  @ViewChild('deleteShift') deleteShift: ElementRef<any>;
  @ViewChild('comUsrApply') comUsrApply: ElementRef<any>;
  @ViewChild('directApply') directApply: ElementRef<any>;
  @ViewChild('reasonLstMdl') reasonLstMdl: ElementRef<any>;
  @ViewChild('reasondeleteLstMdl') reasondeleteLstMdl: ElementRef<any>;
  @ViewChild('UpgradeShift') UpgradeShift: ElementRef<any>;
  @ViewChild('UserLiST') UserLiST: ElementRef<any>;
  @ViewChild('CmUserList') CmUserList: ElementRef<any>;
  @ViewChild('requestmodel') requestmodel: ElementRef<any>;
  @ViewChild('cancelRequestshift') cancelRequestshift: ElementRef<any>;
  @ViewChild('requestacceptmodel') requestacceptmodel: ElementRef<any>;
  @ViewChild('Addnew') Addnew: ElementRef<any>;
  @ViewChild('createnew') createnew: ElementRef<any>;
  @ViewChild('addnewuser') addnewuser: ElementRef<any>;
  @ViewChild('reasonMdl') reasonMdl: ElementRef<any>;
  @ViewChild('AssignShift') AssignShift: ElementRef<any>;

  private keyUpFxn = new Subject<any>();
  private userSearch = new Subject<any>();
  private userSearch1 = new Subject<any>();




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
  curmonth: any;
  currentUser: any;
  start_date: any;
  public passwordTextType: boolean;
  public passwordTextType2: boolean;
  startTime = '00:00';
  endTime = '24:00';
  end_date: any;
  shiftType: any = null;
  shiftTypeStatus: any = null;
  slctCpType: any = null;
  resonIsNull: boolean;
  disabledApply: boolean;
  startingDates: string[] = [];
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
  // slctSrtNm: any;
  // selectedDataValue: any;
  prmsUsrId: any;
  formData: FormGroup;
  formData1: FormGroup;
  editFormData!: FormGroup;
  frstNewApply: any;
  replcShitData: any;
  loadingSite: boolean = true;
  loadingrefresh: boolean = false;

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
  phoneUsd: { name: string; flag: string; code: string; dial_code: string; }[];
  selectedDataValue = "+1";
  slctSrtNm: any;
  comId: any;
  comConf: boolean;
  allCommunity: any;
  community_id: any;
  allCommunity1: any;
  active: any;
  sortedArrayVal: any[] = [];
  firstLoad = true;
  community: any;
  filterEdit: boolean = false;
  userDetail: any;
  sortorder: any;
  newTab: any = '';
  rows: any;
  searchUserName: string;
  searchUserName1: string;
  curComDetails: any;
  comid: any;
  shiftif: any;
  shift_id: any;
  startvardata: number;
  startvardata1: number;
  UserArchiveShiftById: any;
  stime: string;
  shoeAsignbtn: boolean;
  shoeAsignbtn1: boolean;
  comass: any;
  ShiftDeletedTime: any[];
  stime1: string;
  userphone: any;
  username: any;
  userfirstname: any;
  userdetail: any;
  usrid: void;
  shiftid: any;
  appliedUserdtail: any;
  shiftId: any;
  shiftdata: any;
  result: any[];
  newshift_id: any;
  newvar: any;
  btnn: boolean = false;
  shift: any;
  ag: any;
  snglUsr: any;
  poid: any;
  poph: any;
  month: any;
  year: any;
  mnth: any;
  minDate1: { year: number; month: number; day: number; };
  minDate2: { year: number; month: number; day: number; }[];
  datePipe: any;
  todayDate: string;
  currentMonthStartingDate: string;
  agencySpend: any;
  filledByAgency: any;
  formattedLastDate: string;
  shiftdata1: any;
  replaceid: string;
  malualUsr: any;
  searchmanualUserName: string;
  flags: any;
  applyDirectly: boolean;
  detailuser: any;
  applyrequest: any;
  // userSearch1: any;
  // assignShiftDt: any;

  constructor(
    private _authenticationService: AuthenticationService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private tost: ToastrManager,
    private dataService: DataService,
    private FilterService: FilterService,
    private acttivatedRoute: ActivatedRoute,
    private _router: Router
  ) {

    this.keyUpFxn.pipe(
      debounceTime(500)
    ).subscribe((searchTextValue: any) => {
      if (searchTextValue)
        this.searchStr = searchTextValue;
      this.getShiftAccToRole()
    });
    this.userSearch.pipe(
      debounceTime(500)
    ).subscribe((searchTextValue: any) => {
      if (searchTextValue)
        this.searchUserName = searchTextValue;
      this.currentUser?.user_role == 2 || this.currentUser?.user_role == 5 ? this.getAgncyUsrLst() : this.getUserDetail()
    });
    this.userSearch1.pipe(
      debounceTime(500)
    ).subscribe((searchTextValue: any) => {
      if (searchTextValue)
        this.searchmanualUserName = searchTextValue;
      this.getMalualUserDetail()
    });
    sessionStorage.clear();
  }
  mapCountry_selected(data) {
    return this.selectedDataValue = data.dial_code;
  }

  addFilter(no?: any) {
    let body: any
    if (no == 1) {
      body = {
        searchStr: '',
        pageNumber: '',
        shiftType: '5',
        start_date: '',
        startTime: 'undefined',
        endTime: 'undefined',
        end_date: '',
        clickedBtn: 'AllAvailShift',
        selectedCommunity: 'undefined',
        shiftTypeStatus: 'null',
        sortorder: this.sortorder
      }
      this.searchStr = body.searchStr
      this.page.pageNumber = body.pageNumber
      this.shiftType = body.shiftType ?? '5'
      this.shiftTypeStatus = body.shiftTypeStatus
      this.start_date = body.start_date
      this.startTime = body.startTime
      this.endTime = body.endTime
      this.end_date = body.end_date
      this.clickedBtn = body.clickedBtn
      this.community = body.selectedCommunity
      this.sortorder = body.sortorder
    }
    else {
      body = {
        searchStr: this.searchStr,
        pageNumber: this.page.pageNumber,
        shiftType: this.shiftType ? this.shiftType : '5',
        shiftTypeStatus: this.shiftTypeStatus,
        start_date: this.start_date,
        startTime: this.startTime,
        endTime: this.endTime,
        end_date: this.end_date,
        clickedBtn: this.clickedBtn,
        selectedCommunity: this.community,
        sortorder: this.sortorder

      }
    }
    this.FilterService.setFilter(body)
  }

  getFilter() {
    let data = this.FilterService.getFilter();
    if (this._router.url == '/shift/id' && !data)
      this._router.navigate(['/shift'])
    this.active = data;
    this.searchStr = data?.searchStr;
    this.page.pageNumber = data?.pageNumber;
    this.shiftType = data?.shiftType;
    this.start_date = data?.start_date;
    this.startTime = data?.startTime;
    this.endTime = data?.endTime;
    this.end_date = data?.end_date;
    this.clickedBtn = data?.clickedBtn;
    this.community = data?.selectedCommunity
    this.shiftTypeStatus = data?.shiftTypeStatus;
    this.sortorder = data?.sortorder;
    if (JSON.parse(sessionStorage.getItem('item')))
      sessionStorage.removeItem('item')

    sessionStorage.setItem('item', JSON.stringify(this.clickedBtn))
  }
  addBtn() {
    this.addFilter()
    this._router.navigate(['/shift/shift-confirmation'])
  }

  AddEditPage() {
    this.addFilter()
  }

  getAgencyMonthlyBudget() {
    let d = new Date().getMonth() == 11 ? '01' : new Date().getMonth() + 2
    let body = {
      id: this.permision.addPrms == '1' ? this.currentUser?.com_id ?? this.currentUser?.id : this.currentUser?.id,
      start_time: this.currentMonthStartingDate,
      end_time: new Date().getMonth() == 11 ? new Date().getFullYear() + 1 : new Date().getFullYear() + '-' + (Number(d) > 9 ? d : '0' + d) + '-' + ('0' + 1)

    }
    this.dataService.getAgencyMonthlyBudget(body).subscribe((res: any) => {
      if (!res.error) {
        this.getAgencyMonthlyBudgetData = res.body[0].finalResult;
        this.agencySpend = res.body[0].schedularData;
      }
    })
    this.initFormNewUser();
    this.create();
  }

  ngOnInit(): void {
    this._authenticationService.currentUser.subscribe
      (x => {
        this.currentUser = x;
        this.getPrmsnData()
        this.getUserDetail()
        this.currentUser?.user_role == 8 || this.currentUser?.user_role == 3 ? this.getCommunityByMangmentId() : ''
        this.currentUser?.user_role == 4 || this.currentUser?.user_role == 1 || this.currentUser?.user_role == 5 ? this.getuserDetails() : ''
        this.onItemSelect(this.currentUser?.user_role == 5 ? this.currentUser?.com_id : this.currentUser?.id)
        this.currentUser?.user_role == 4 || this.currentUser?.user_role == 1 ? this.shiftAssignTo() : ''
      });

   this.currentUser.user_role == 5 ? this.getShiftRequestStatus() : ''

    this.acttivatedRoute.params.subscribe(res => {
      if (res.d) {
        this.getFilter()
      }

    })
    this.getnewdate()
    // this.currentUser?.user_role != 8 ? this.getShiftAccToRole() : ''
    this.currentUser?.user_role == 2 || this.currentUser?.user_role == 5 ? this.getCommunityByAgencyID() : ''

  }

  seachShift(event) {
    this.page.pageNumber = 0;
    this.active ? this.active.pageNumber = 0 : '';
    if (event.target)
      this.keyUpFxn.next(event.target.value)
    else {
      this.searchStr = ''
      this.getShiftAccToRole()
    }
  }

  getnewdate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const day = ('0' + currentDate.getDate()).slice(-2);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

    this.formattedLastDate = year + '-' + month + '-' + ('0' + lastDay).slice(-2);
    this.currentMonthStartingDate = `${year}-${month}-01`;
    // console.log(this.formattedLastDate,this.currentMonthStartingDate);

  }


  initFormNewUser() {
    this.formData = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required, Validators.pattern(Patterns.number)]],
      agency_id: [''],
      hourly_rate: [''],
      community_id: [''],
      DOB: [''],
      password: ['', Validators.compose([Validators.required, Validators.pattern(Patterns.password)])],
      cnfrmpassword: ['', [Validators.required]],
      addUsrRl: ['', [Validators.required]],
    }, {
      validator: ConfirmedValidator('password', 'cnfrmpassword')
    },)

  }

  create() {
    this.formData1 = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required]
    });
  }

  // updateDate(event,type) {
  //   if(type == 'start_date')
  //     this.start_date = event;
  //   else{
  //     this.end_date = event
  //   }
  // }

  getCommunityRecords1(d?: any) {
    if (d == 'refresh') {
      this.page.pageNumber = 0
    }
    if (this.currentUser?.user_role == 1 || this.permision.addPrms == '1' && this.clickedBtn == 'AllShift') {
      let body = {
        searchStr: this.searchStr,
        page: '',
        shiftType: this.shiftType ? this.shiftType : '5',
        currentUser: this.currentUser?.com_id ?? this.currentUser?.id,
        limit: '10',
        start_time: this.start_date ? this.cnvrtnewDt(this.start_date + ' ' + this.startTime) : null,
        end_time: this.end_date ? this.cnvrtnewDt(this.end_date + ' ' + this.endTime) : null,
        sort: this.sortorder ? this.sortorder : { prop: 'start_time', dir: 'desc' }
      }
      this.startvardata = new Date(this.start_date + ' ' + this.startTime).getTime();
      this.startvardata1 = new Date(this.end_date + ' ' + this.endTime).getTime();

      if (this.startvardata >= this.startvardata1) {
        this.tost.errorToastr("End Filter must be after Start Filter")
      } else
        this.dataService.getNewCommunityShifts(body).subscribe(res => {
          this.loadingSite = false;
          this.loadingrefresh = false;
          if (res.body?.length)
            this.shiftData = this.returnDataWithStatus(res.body.sort(function (a, b) {
              if (a.start_time.toUpperCase() < b.start_time.toUpperCase()) { return 1; }
              if (a.start_time.toUpperCase() > b.start_time.toUpperCase()) { return -1; }
              return 0;
            }));
          this.comass = this.returnDataWithStatus(res.body).map(i => {
            this.shoeAsignbtn = this.compareDates(i.created_at)
            return i
          });
          // console.log(this.comass);

          // this.shoeAsignbtn = this.compareDates(res.body[0]);
          if (!res.pagination) {
            this.sortedArrayVal = this.shiftData
            this.page.size = 10;
            this.page.totalElements = this.shiftData?.length;
            this.page.pageNumber = this.page.pageNumber;
            this.page.totalPages = Math.ceil(this.shiftData?.length / 10);
            this.changePage('', this.active?.pageNumber ? this.active?.pageNumber : this.page.pageNumber ? this.page.pageNumber : 0)
          } else {
            this.page = res.pagination
            this.page.pageNumber = res.pagination.pageNumber;
            this.clickedBtn = this.active ? this.clickedBtn : this.clickedBtn
          }
        }, err => {
          this.loadingSite = false;
          this.loadingrefresh = false;
        })
    } else {
      this.getShiftForAgency(d)
    }
  }

  getCommunityByAgencyID() {
    this.dataService.getCommunityByAgencyID(this.currentUser?.user_role == 5 ? this.currentUser?.com_id : this.currentUser?.id).subscribe((response: any) => {
      if (response['error'] == false) {
        this.allCommunity1 = response.body;
        this.community_id = response.body[0].community_id;
      }
    },
      (err) => {
        this.dataService.genericErrorToaster();
      })
  }

  getShiftRequestStatus() {
    this.dataService.getShiftRequestStatus(this.currentUser.com_id).subscribe((res: any) => {
      this.applyrequest = res.body
      if ((res?.body.agency_shift_request_status  == '2')) {
        this.applyDirectly = true
        console.log(this.applyrequest, 'tttttttdddddd');
      }
    })
  }

  getCommunityRecords() {
    let body = {
      searchStr: this.searchStr,
      page: this.page.pageNumber,
      shiftType: this.shiftType ? this.shiftType : '5',
      currentUser: this.currentUser?.user_role == 8 || this.currentUser?.user_role == 3 ? this.community_id : this.currentUser?.com_id ?? this.currentUser?.id,
      limit: '10',
      start_time: this.start_date ? this.cnvrtnewDt(this.start_date + ' ' + this.startTime) : null,
      end_time: this.end_date ? this.cnvrtnewDt(this.end_date + ' ' + this.endTime) : null,
      sort: this.sortorder ? this.sortorder : { prop: 'start_time', dir: 'desc' }
    }
    this.dataService.getNewCommunityShifts(body).subscribe(res => {
      this.loadingSite = false;
      this.loadingrefresh = false;
      if (res.body?.length)
        this.shiftData = this.returnDataWithStatus(res.body.sort(function (a, b) {
          if (a.start_time.toUpperCase() < b.start_time.toUpperCase()) { return 1; }
          if (a.start_time.toUpperCase() > b.start_time.toUpperCase()) { return -1; }
          return 0;
        }));
      if (!res.pagination) {
        this.sortedArrayVal = this.shiftData
        this.page.size = 10;
        this.page.totalElements = this.shiftData?.length;
        this.page.pageNumber = this.page.pageNumber;
        this.page.totalPages = Math.ceil(this.shiftData?.length / 10);
        this.changePage('', this.active?.pageNumber ? this.active?.pageNumber : this.page.pageNumber ? this.page.pageNumber : 0)
      } else {
        this.page = res.pagination
        this.page.pageNumber = res.pagination.pageNumber;
        this.clickedBtn = this.active ? this.clickedBtn : 'AllShift';
        if (JSON.parse(sessionStorage.getItem('item')))
          sessionStorage.removeItem('item')

        sessionStorage.setItem('item', JSON.stringify(this.clickedBtn))

      }
    }, err => {
      this.loadingSite = false;
      this.loadingrefresh = false;

    })
  }

  pageChanged(page) {
    this.page.pageNumber = page.offset
    this.getShiftAccToRole()
  }
  sort(page) {
    this.sortorder = page.sorts[0]
    this.page.pageNumber = 0
    this.getShiftAccToRole()
  }
  cngShft1(value) {
    this.page.pageNumber = 0;
    this.active ? this.active.pageNumber = 0 : '';
    if (this.currentUser?.user_role == 5 && this.clickedBtn == 'MyShift' && this.permision.aplyPrms != '1') {
      this.getUserShiftById()
    } else
      this.getShiftForAgency()
  }

  cngShft(value) {
    this.page.pageNumber = 0;
    this.active ? this.active.pageNumber = 0 : '';
    if (this.currentUser?.user_role == 1 || this.permision.aplyPrms == '1' && this.clickedBtn == 'AllShift') {
      this.getCommunityRecords1()
    } else
      this.getShiftAccToRole()
  }
  SelectShiftType(event) {
    this.page.pageNumber = 0;
    if (this.active?.clickedBtn != 'AllAvailShift' || event?.target?.value == 'AllAvailShift')
      this.active ? this._router.navigate(['/shift']) : '';
    if (event?.target?.value == 'AllShift')
      this.clickedBtn = 'AllShift'
    if (event?.target?.value == 'MyShift')
      this.clickedBtn = 'MyShift'
    if (event?.target?.value == 'AllAvailShift')
      this.clickedBtn = 'AllAvailShift'
    this.shiftTypeStatus = null;
    this.shiftType = null;
    this.shiftData = [];
    this.community = 'undefined';
    if (JSON.parse(sessionStorage.getItem('item')))
      sessionStorage.removeItem('item')

    sessionStorage.setItem('item', JSON.stringify(this.clickedBtn))
    this.getShiftAccToRole()
  }

  getCommunityByMangmentId() {
    if (this.currentUser?.id && this.currentUser?.com_id) {
      let data = {
        userId: this.currentUser?.id,
        mangId: this.currentUser?.management
      }
      this.dataService.getManagementUserCommunities(data).subscribe((res: any) => {
        if (!res.error) {
          // this.mangComs = res.body[1].userAvailableCommunities
          let d: any[] = res?.body[0].user_added_communities.concat(res?.body[1].userAvailableCommunities);
          const uniqueArray = d.filter((obj, index, self) =>
            index === self.findIndex((t) => (
              t.community_id === obj.community_id &&
              t.community_name === obj.community_name &&
              t.community_short_name === obj.community_short_name
            ))
          );
          this.allCommunity = uniqueArray.sort(function (a, b) {
            if (a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
            if (a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
            return 0;
          });
          this.community_id = this.allCommunity[0].community_id
          this.getShiftAccToRole();
        } else {
          this.tost.errorToastr(res.msg);
        }
      },
        (err) => {
          this.dataService.genericErrorToaster();
        })
    }
    else {
      this.dataService.getMNMGcommunity(this.currentUser?.id).subscribe((response: any) => {
        if (response['error'] == false) {
          this.allCommunity = response.body.sort(function (a, b) {
            if (a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
            if (a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
            return 0;
          });
          this.community_id = response.body[0].cp_id
          this.getShiftAccToRole();
          //this.toastr.successToastr(response.msg);
        } else if (response['error'] == true) {
          this.tost.errorToastr(response.msg);
        }
      }, (err) => {
        this.dataService.genericErrorToaster();

      })
    }
  }


  selectCommunity(id: any) {
    this.community_id = id
    this.page.pageNumber = 0;
    this.active ? this.active.pageNumber = 0 : '';
    this.getShiftAccToRole();
  }
  selectCommunity1(id: any) {
    this.community = id;
    this.page.pageNumber = 0;
    this.active ? this.active.pageNumber = 0 : '';
    this.getShiftAccToRole()
  }


  getShiftAccToRole(d?: any) {
    this.loadingrefresh = true;
    if (JSON.parse(sessionStorage.getItem('item')) == undefined || JSON.parse(sessionStorage.getItem('item')) == 'undefined') {
      sessionStorage.setItem('item', JSON.stringify(this.clickedBtn ? this.clickedBtn : (this.currentUser?.user_role == 6 || this.currentUser?.user_role == 1 || this.currentUser?.user_role == 8) ? 'AllShift' : 'AllAvailShift'))
    }
    if (d == 'refresh') {
      this.loadingrefresh = true;
      this.page.pageNumber = 0;
      this.active ? this.active.pageNumber = 0 : '';
    } else if (this.firstLoad) {
      if (JSON.parse(sessionStorage.getItem('item')))
        sessionStorage.removeItem('item')

      sessionStorage.setItem('item', JSON.stringify(this.clickedBtn ? this.clickedBtn : (this.currentUser?.user_role == 6 || this.currentUser?.user_role == 1 || this.currentUser?.user_role == 8) ? 'AllShift' : 'AllAvailShift'))

    }
    if (this.currentUser?.role.includes('Community', 'Management User') && (this.clickedBtn == 'AllShift' || this.currentUser?.user_role == 1 || this.currentUser?.user_name == 8) && this.clickedBtn != 'MyShift' && this.clickedBtn != 'AllAvailShift') {
      this.getCommunityRecords()
    } else if ((this.currentUser?.role == 'SuperAdmin' && this.currentUser?.user_role == 6)) {
      this.getShiftForAdmin()
    } else if (this.currentUser?.user_role == 8 || this.currentUser?.user_role == 3) {
      this.getCommunityRecords()
    }
    else if (this.currentUser?.user_role == 5 && this.permision.aplyPrms != '1') {
      this.getUserShiftById()
    } else
      this.getShiftForAgency()
  }

  getShiftForAgency(d?: any) {
    if (d == 'refresh') {
      this.page.pageNumber = 0;
    }
    this.clickedBtn = this.active?.clickedBtn ? this.active?.clickedBtn : this.clickedBtn ? this.clickedBtn : null
    let body: any
    if (this.currentUser?.role.includes('Community', 'Management User') && (this.currentUser?.user_role == 4 || this.currentUser?.user_role == 1 || this.currentUser?.user_role == 8) && (this.clickedBtn != 'AllShift' || this.shiftType)) {
      body = {
        searchStr: this.searchStr ?? '',
        tpUsr: '',
        start_time: this.start_date ? this.cnvrtnewDt(this.start_date + ' ' + this.startTime) : null,
        end_time: this.end_date ? this.cnvrtnewDt(this.end_date + ' ' + this.endTime) : null,
        id: this.community ?? undefined,
        sort: this.sortorder ? this.sortorder : { prop: 'start_time', dir: 'desc' },
        // typeUser1 : this.shiftType,
        // tyUsr1 :this.shiftType,
        cpType: this.shiftTypeStatus ? this.shiftTypeStatus : null,
        currentUser: this.currentUser?.user_role == 4 ? this.currentUser?.id : this.currentUser?.user_role == 8 ? this.community_id : this.currentUser?.com_id ?? this.currentUser?.id,
        for_cp1: true,
      }
      this.startvardata = new Date(this.start_date + ' ' + this.startTime).getTime();
      this.startvardata1 = new Date(this.end_date + ' ' + this.endTime).getTime();

      if (this.startvardata >= this.startvardata1) {
        this.tost.errorToastr("End Filter must be after Start Filter")
        this.loadingSite = false;
        this.loadingrefresh = false;
      } else
        this.dataService.getNewCommunityShiftByID(body, this.currentUser?.user_role).subscribe((res: any) => {
          this.shiftData = []
          this.loadingSite = false;
          this.loadingrefresh = false;

          if (this.clickedBtn == 'MyShift') {
            if (res.body)
              this.shiftData = this.returnDataWithStatus(res.body.userShifts);
          }
          if (this.clickedBtn == 'AllAvailShift') {
            if (res.body)
              this.shiftData = this.returnDataWithStatus(res.body.availableShifts);
          }
          if (!res?.pagination) {
            console.log(this.active?.pageNumber ? this.active?.pageNumber : this.page.pageNumber ? this.page.pageNumber : 0, 'wfjhyvfwhgjugwyfw');

            this.sortedArrayVal = this.shiftData
            this.page.size = 10;
            this.page.totalElements = this.shiftData?.length;
            this.page.pageNumber = this.page.pageNumber;
            this.page.totalPages = Math.ceil(this.shiftData?.length / 10);
            this.changePage('', this.active?.pageNumber ? this.active?.pageNumber : this.page.pageNumber ? this.page.pageNumber : 0)
          }

        }, err => {
          this.loadingSite = false;
          this.loadingrefresh = false;

        })
    } else {
      let id = this.permision.aplyPrms == '1' && this.currentUser?.user_role == 5 ? this.currentUser?.com_id : this.currentUser?.id
      if (this.clickedBtn == 'MyShift' && this.shiftType) {
        body = {
          searchStr: this.searchStr ?? '',
          tpUsr: '',
          cpType: this.shiftTypeStatus ? this.shiftTypeStatus : this.shiftType ?? null,
          currentUser: id,
          for_cp1: false,
          id: this.community ?? undefined,
          start_time: this.start_date ? this.cnvrtnewDt(this.start_date + ' ' + this.startTime) : null,
          end_time: this.end_date ? this.cnvrtnewDt(this.end_date + ' ' + this.endTime) : null,
          sort: this.sortorder ? this.sortorder : { prop: 'start_time', dir: 'desc' }
        }
      } else
        body = {
          searchStr: this.searchStr ?? '',
          tpUsr: 'typeUser',
          cpType: this.shiftTypeStatus ?? null,
          currentUser: id,
          id: this.community ? this.community : undefined,
          for_cp1: false,
          start_time: this.start_date ? this.cnvrtnewDt(this.start_date + ' ' + this.startTime) : null,
          end_time: this.end_date ? this.cnvrtnewDt(this.end_date + ' ' + this.endTime) : null,
          sort: this.sortorder ? this.sortorder : { prop: 'start_time', dir: 'desc' }
        }
      this.startvardata = new Date(this.start_date + ' ' + this.startTime).getTime();
      this.startvardata1 = new Date(this.end_date + ' ' + this.endTime).getTime();

      if (this.startvardata >= this.startvardata1) {
        this.tost.errorToastr("End Filter must be after Start Filter")
        this.loadingSite = false;
        this.loadingrefresh = false;
      } else
        this.dataService.getNewCommunityShiftByID(body).subscribe((res: any) => {
          this.shiftData = [];
          this.loadingSite = false;
          this.loadingrefresh = false;

          let d = JSON.parse(sessionStorage.getItem('item'))
          if (this.clickedBtn == 'MyShift' || d == 'MyShift') {
            this.clickedBtn = d;
            if (res.body.userShifts)
              this.shiftData = this.returnDataWithStatus(res.body.userShifts);
          }
          else if (this.clickedBtn == 'AllAvailShift' || d == 'AllAvailShift') {
            this.clickedBtn = d;
            if (res.body.availableShifts)
              this.shiftData = this.returnDataWithStatus(res.body.availableShifts);
          }
          else if (this.clickedBtn == 'AllShift' || d == 'AllShift') {
            this.clickedBtn = d;
            this.shiftData = this.returnDataWithStatus(res.body.allShifts);

          }
          if (!res?.pagination) {
            console.log(this.active?.pageNumber, 'wfjhyvfwhgjugwyfw');
            console.log(this.page.pageNumber, 'wfjhyvfwhgjugwyfw');

            this.sortedArrayVal = this.shiftData

            this.page.size = 10;
            this.page.totalElements = this.shiftData?.length;
            this.page.pageNumber = this.page.pageNumber;
            this.page.totalPages = Math.ceil(this.shiftData?.length / 10);
            this.changePage('', this.active?.pageNumber ? this.active?.pageNumber : this.page.pageNumber ? this.page.pageNumber : 0)
          }

        }, err => {
          this.loadingSite = false;
          this.loadingrefresh = false;


        })
    }

  }


  returnRequestStatus(res: any) {
    return res.map(i => {
      this.result.forEach(el => {
        if (i.shift_id == el.shift_id) {
          i.aprrovedStat = el.request_status
          console.log(i.aprrovedStat);
        }
      });
      return i;
    })
  }

  replcUsr(row, no) {
    // console.log("<<<<==============row===========", row)
    this.frstNewApply = no
    this.replcShitData = row
    this.replaceid = row.agency_user
    // this.disabledApply=false;
    this.replaceUserText = ''
    this.modalOpenOSE(this.UserLiST, 'lg');
    this.getAgncyUsrLst() 
  }


  getagencyUser(shiftData) {
    this.shiftdata1 = shiftData

    let is_for = this.currentUser?.role == 'Agency' ? 'agency' : 'community'
    let community_id = this.currentUser?.user_role == 5 || this.currentUser?.user_role == 2 ? this.prmsUsrId?.id : this.currentUser?.id
    let searchStr = this.searchUserName1 ?? '';
    this.comid = shiftData?.community_id
    let agency_id = this.currentUser?.user_role == 2 ? this.currentUser?.id : this.currentUser?.user_role == 5 ? this.currentUser?.com_id : (this.prmsUsrId?.id || this.currentUser?.com_id)
    this.dataService.getAgencyUnblockUser(community_id, agency_id, searchStr).subscribe((res: any) => {
      this.agncyUsr = res.body.sort(function (a, b) {
        if (a.last_name.toUpperCase() < b.last_name.toUpperCase()) { return -1; }
        if (a.last_name.toUpperCase() > b.last_name.toUpperCase()) { return 1; }
        return 0;
      });
      this.agncyUsr = this.agncyUsr.filter(i => {
        if (i.is_blocked == true) {
          i.asgnBtnDsbl = true
        } else {
          i.asgnBtnDsbl = false
        }
        if (i.id != this.replcShitData.agency_user) {
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
    let body = {
      id: this.currentUser?.id,
      searchVal: this.searchStr,
      tyUsr1: this.shiftTypeStatus ?? this.shiftType,
      start_time: this.start_date ? this.cnvrtnewDt(this.start_date + ' ' + this.startTime) : null,
      end_time: this.end_date ? this.cnvrtnewDt(this.end_date + ' ' + this.endTime) : null,
      sort: this.sortorder ? this.sortorder : { prop: 'start_time', dir: 'desc' },
      community_id: this.community ? this.community : undefined,
    }
    this.startvardata = new Date(this.start_date + ' ' + this.startTime).getTime();
    this.startvardata1 = new Date(this.end_date + ' ' + this.endTime).getTime();

    if (this.startvardata >= this.startvardata1) {
      this.loadingrefresh = false;
      this.tost.errorToastr("End Filter must be after Start Filter")
    } else
    this.dataService.getUserAgencyshiftById(body).subscribe(res => {
      this.loadingSite = false;
      this.loadingrefresh = false;
      let d = JSON.parse(sessionStorage.getItem('item'))
      if (this.clickedBtn == 'MyShift' || d == 'MyShift') {
        if (res.body.userShifts)
          this.shiftData = this.returnDataWithStatus(res.body.userShifts.sort(function (a, b) {
            if (a.start_time.toUpperCase() < b.start_time.toUpperCase()) { return 1; }
            if (a.start_time.toUpperCase() > b.start_time.toUpperCase()) { return -1; }
            return 0;
          }));
        
      }
      else if (this.clickedBtn == 'AllAvailShift' || d == 'AllAvailShift') {
        if (res.body.availableShifts)
          this.shiftData = this.returnDataWithStatus(res.body.availableShifts);
      }
      else if (this.clickedBtn == 'AllShift' || d == 'AllShift') {
        this.shiftData = this.returnDataWithStatus(res.body.allShifts);

      }
      if (!res?.pagination) {
        this.sortedArrayVal = this.shiftData;
        this.page.size = 10;
        this.page.totalElements = this.shiftData?.length;
        this.page.pageNumber = this.page.pageNumber;
        this.page.totalPages = Math.ceil(this.shiftData?.length / 10);
        this.changePage('', this.active?.pageNumber ? this.active?.pageNumber : this.page.pageNumber ? this.page.pageNumber : 0)
      }
    }, err => {
      this.loadingSite = false;
      this.loadingrefresh = false;
    })
  }

  // getShiftRequest(){
  //   let data = { 
  //     aggency_id : this.currentUser?.user_role == 5 ? this.currentUser?.com_id : this.currentUser?.id
  //   }
  //   this.dataService.getShiftRequest(data).subscribe((res : any) =>{
  //     this.result =  res.body;
  //     console.log(this.result);   
  //   })
  // }

  getShiftForAgencyUser() {
    this.dataService.getNewCommunityShiftByID(this.currentUser?.id).subscribe((res: any) => {
      this.loadingSite = false;
      this.loadingrefresh = false;
      this.shiftData = [];
      let data = []
      if (this.clickedBtn == 'MyShift') {
        this.shiftData = res.body.userShifts
        data = res.body.userShifts
      }
      if (this.clickedBtn == 'AllAvailShift') {
        this.shiftData = res.body.availableShifts;
        data = res.body.availableShifts;

      }
      if (!res?.pagination) {
        this.sortedArrayVal = this.shiftData;
        this.page.size = 10;
        this.page.totalElements = this.shiftData?.length;
        this.page.pageNumber = this.page.pageNumber;
        this.page.totalPages = Math.ceil(this.shiftData?.length / 10);
        this.changePage('', this.active?.pageNumber ? this.active?.pageNumber : this.page.pageNumber ? this.page.pageNumber : 0)
      }
    }, err => {
      this.loadingSite = false;
      this.loadingrefresh = false;
    })
  }

  resetFilterValue() {
    this.loadingrefresh = true;
    this.shiftTypeStatus = null;
    this.shiftType = 5;
    this.shiftData = [];
    this.community = 'undefined';
    this.searchStr = '';
    this.sortorder = { prop: 'start_time', dir: 'desc' };
    this.clickedBtn = JSON.parse(sessionStorage.getItem(''));
    this.start_date = '';
    this.shiftType = '';
    this.startTime = 'undefined';
    this.end_date = '';
    this.endTime = 'undefined';
    this.page.pageNumber = 0;
    this.active ? this.active.pageNumber = 0 : '';
    this.getShiftAccToRole();
    this.addFilter(1);
    this.startTime = '00:00';
    this.endTime = '24:00';

  }

  cnvrtnewDt(date_tm) {
    let dt = moment(date_tm).format();
    let dt1 = dt.split('+')
    return moment(dt1[0]).utc().unix()
  }

  getShiftForAdmin() {
    let body = {
      searchStr: this.searchStr ?? '',
      page: this.page.pageNumber ?? 0,
      userShift: this.shiftType ?? this.shiftTypeStatus ?? null,
      limit: '10',
      start_time: this.start_date ? this.cnvrtnewDt(this.start_date + ' ' + this.startTime) : null,
      end_time: this.end_date ? this.cnvrtnewDt(this.end_date + ' ' + this.endTime) : null,
      sort: this.sortorder ? this.sortorder : { prop: 'start_time', dir: 'desc' }
    }

    this.dataService.getNewshift(body).subscribe(res => {
      this.loadingSite = false;
      this.loadingrefresh = false;
      this.shiftData = []
      if (res.body?.length)
        this.shiftData = this.returnDataWithStatus(res.body);

      if (!res.pagination) {
        this.sortedArrayVal = this.shiftData
        this.page.size = 10;
        this.page.totalElements = this.shiftData?.length;
        this.page.pageNumber = this.page.pageNumber;
        this.page.totalPages = Math.ceil(this.shiftData?.length / 10);
        this.changePage('', this.active?.pageNumber ? this.active?.pageNumber : this.page.pageNumber ? this.page.pageNumber : 0)
      } else {
        this.page = res?.pagination
        this.page.pageNumber = res.pagination?.pageNumber
      }
    }, err => {
      this.loadingSite = false;
      this.loadingrefresh = false;
    })
  }

  getRoles() {
    let id = this.currentUser?.prmsnId
    let data = {
      prms: (id == '1') ? 'community_id' : (id == '2' || this.currentUser?.user_role == 5) ? 'agency_id' : this.currentUser?.user_role == 4 ? 'community_id' : 'null',
      id: this.currentUser?.user_role == 4 || this.currentUser?.user_role == 5 ? this.currentUser?.com_id : this.comId || this.currentUser?.id
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


  // getRole() {
  //   this.dataService.getAllRole().subscribe((res: any) => {
  //     if (!res.err || !res.error) {

  //     }
  //   }, () => {
  //     this.dataService.genericErrorToaster()
  //   })
  // }

  getPrmsnData() {
    this.permision = { addPrms: '', dltPrms: '', edtPrms: '', vwPrms: '', aplyPrms: '', assign: '' };
    let roleIds = []
    this.dataService.getPermissionByAdminRole()?.subscribe(
      (res: any) => {
        if (!res.error) {
          res.body.map(i => {
            // if (roleIds.includes(i.role_id)) {
            if (i.trak_type == '1') {
              if (i.permission_name == 'Shifts') {
                this.permision.addPrms = i.add_permission
                this.permision.dltPrms = i.delete_permission
                this.permision.edtPrms = i.edit_permission
                this.permision.vwPrms = i.view_permission
                this.permision.aplyPrms = i.apply_permission
                this.permision.assign = i.assign;
                if (i.view_permission == '0') {
                  this.tost.errorToastr('You dont have for this page please contact with your admin')
                  this._router.navigate(['/dashboard'])
                }
              }

              // }
            }


          })
          this.getAgencyMonthlyBudget();
          if (this.currentUser?.user_role == 2 || this.currentUser?.user || this.permision.addPrms == '1')
            this.clickedBtn = this.active ? this.clickedBtn : 'AllShift'
          if (this.currentUser?.role != 'SuperAdmin' && this.currentUser?.role != 'Community' && this.permision.addPrms != '1' && !this.active) this.clickedBtn = 'AllAvailShift';
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
    this.cancel_reason = '';
    this.searchUserName = '';
    this.searchUserName1 = '';
    this.searchmanualUserName = ''
    this.formData.reset();
    this.formData1.reset();
    this.currentUser?.user_role == 4 || this.currentUser?.user_role == 1 ? this.getUserDetail() : this.getAgncyUsrLst()
  }

  closededApply(modal: NgbModalRef) {
    modal.dismiss();
    this.cancel_reason = ''
  }

  cancleShft() {
    if (!this.cancel_reason) {
      this.resonIsNull = true
      return
    } else {
      this.resonIsNull = false
    }
    if (this.currentUser?.role == 'Agency' || this.currentUser?.user_role == 5) {
      this.data = {
        shift_id: this.row.shift_id,
        user_id: this.row.aggency_id,
        cancel_reason: this.cancel_reason,
        is_agency: this.currentUser?.user_role == 2 ? '1' : '2',
        canceled_by: this.userDetail
        // if is_agency == 2 agency user
      }
    } else {
      this.data = {
        shift_id: this.row.shift_id || this.row.id,
        user_id: this.currentUser?.id,
        cancel_reason: this.cancel_reason,
        is_agency: '',
        canceled_by: this.userDetail
      }
    }
    this.dataService.cancelUAppliedShift(this.data).subscribe((res: any) => {
      if (!res.error) {
        this.getShiftAccToRole()
        this.modalService.dismissAll()
        this.cancel_reason = '',
          this.tost.successToastr('User shift cancel successfully')
      }
    },
      (err) => {
        this.dataService.genericErrorToaster()
      })

  }

  upgradeShift(row: any) {
    // console.log(row);
    this.shift_id = row.id

    this.modalOpenOSE(this.UpgradeShift, 'lg')
  }

  UpdateForCP(modal: NgbModalRef) {
    this.dataService.UpdateForCP(this.shift_id).subscribe((res: any) => {
      if (!res.error) {
        this.getShiftAccToRole();
        this.tost.successToastr(res.msg)
        this.closeded(modal)
      }
    })

  }



  deleteshift(modal: NgbModalRef) {
    let data = {
      cancel_reason: this.cancel_reason,
      id: this.id?.id,
      archived_by: this.curComDetails

    }
    if (!this.cancel_reason) {
      this.tost.errorToastr("Please fill Archive reason")
    } else {
      this.dataService.deleteshift(data).subscribe((res: any) => {
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
      this.UserCanceledShiftById = res.body.canceled_shift;
      this.UserCanceledShiftById.map(i => {
        i?.shift_cancel_time ? i.shift_cancel_time = moment.unix(i.shift_cancel_time).format('MM-DD-YYYY hh:mm a') : i.shift_cancel_time = '----'
      });
      this.ShiftDeletedTime = res.body?.archived_shift
      this.stime1 = moment(res.body?.archived_shift.updated_at).format("MM-DD-yyyy hh:mm a");

      // console.log(this.ShiftDeletedTime,'sfjheejfb');

      this.loadingList = false;
    }, error => {
      this.loadingList = false;
    }
    )
  }

  archive(row) {
    this.modalOpenOSE(this.reasondeleteLstMdl, 'lg');
    this.dataService.getShiftArchivedReason(row.id).subscribe((res: any) => {
      this.UserArchiveShiftById = res.body;
      // this.UserArchiveShiftById.map(i => {
      //   i?.updated_at ? i.updated_at = moment.unix(i.updated_at).format('MM-DD-YYYY hh:mm a') : i.updated_at = '----'
      // });
      this.stime = moment(res?.body.updated_at).format("MM-DD-yyyy HH:mm A");
      this.loadingList = false;
    }, error => {
      this.loadingList = false;
    }
    )
  }

  dateErrorFxn() {
    let date = new Date();
    let inputDate = new Date(this.formData.value.DOB)
    return date < inputDate ? true : false;
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
      community_id: this.currentUser?.user_role == 4 ? [this.currentUser?.com_id] : [this.currentUser?.id],

    }

    this.dataService.addUserManually(body).subscribe((res: any) => {
      if (!res.error) {
        this.tost.successToastr(res.msg);
        modal.dismiss();
        // this.getUserDetail()
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

  submitted(modal) {
    if (this.dateErrorFxn()) {
      this.tost.errorToastr('Please select valid date!')
      return;
    }
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
        applied_for_by: this.userDetail,
        canceled_by: this.userDetail


      }
      this.dataService.replaceShiftUser(data).subscribe((res: any) => {
        this.loadingList = false;
        this.modalService.dismissAll()

      }, error => {
        this.loadingList = false;
      }
      )
    }
    if (this.currentUser?.user_role == 2 || this.currentUser?.user_role == 5) {
      this.data = {
        phone_number: this.formData.value.phone_number?.replace(/\D/g, ''),
        email: this.formData.value.email,
        first_name: this.formData.value.first_name,
        last_name: this.formData.value.last_name,
        username: this.slctSrtNm + '-' + this.formData.value.username.replace(' ', '').trim(),
        password: this.formData.value.password,
        agency_id: this.currentUser?.user_role == 5 ? this.currentUser?.com_id : [this.currentUser?.id],
        isAdmin: '5',
        country_code: this.selectedDataValue ? this.selectedDataValue : '',
        roles_assign: this.formData.value.addUsrRl
      }
    } else {
      this.data = {
        phone_number: this.formData.value.phone_number?.replace(/\D/g, ''),
        email: this.formData.value.email,
        first_name: this.formData.value.first_name,
        last_name: this.formData.value.last_name,
        DOB: this.formData.value.DOB,
        username: this.slctSrtNm + '-' + this.formData.value.username.replace(' ', '').trim(),
        hourly_rate: parseFloat(this.formData.value.hourly_rate),
        password: this.formData.value.password,
        management_co_user: this.formData.value.management_co_user,
        community_id: this.currentUser?.user_role == 4 ? [this.currentUser?.com_id] : [this.currentUser?.id],
        country_code: this.selectedDataValue ? this.selectedDataValue : '',
        isAdmin: '4',
        roles_assign: this.formData.value.addUsrRl,

      }
    }

    this.dataService.addUser(this.data).subscribe((res: any) => {
      if (!res.error) {

        this.tost.successToastr(res.msg);
        modal.dismiss();
        this.currentUser?.user_role == 2 || this.currentUser?.user_role == 5 ? this.getAgncyUsrLst() : ''
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
  get controls1() {
    return this.formData1.controls;
  }
  returnDataWithStatus(data: any) {
    if (JSON.parse(sessionStorage.getItem('item'))) {
      this.clickedBtn = JSON.parse(sessionStorage.getItem('item'))
    }
    if (this.clickedBtn == 'MyShift') {
      return this.returnDataMyShiftStatus(data)
    } else if (this.clickedBtn == 'AllAvailShift') {
      return data?.map(i => {
        if (i.assigned == 0 && i.is_deleted != '1') {
          i.approvalStatus = 'Posted'
        }
        else {
          i.approvalStatus = 'Pending'
        }
        return i
      });
    }
    else {
      return data.map(i => {
        if (i.assigned == 0 && i.is_deleted != '1') {
          i.approvalStatus = 'Posted'
        } else if (i.is_deleted == '1') {
          i.approvalStatus = 'Archived'
        }
        else if (i.assigned == 2 && i.is_deleted != '1') {
          i.approvalStatus = 'Filled By Community'
        } else if (i.assigned == 3 && i.status == "0" && i.is_deleted != '1' || i.assigned == 3 && i.status == "0" && i.cancellation_period_reached == '0' || i.assigned == 3 && i.status == "0" && i.is_mannual == '0' && i.is_deleted != '1') {
          i.approvalStatus = 'Filled By Agency'
        } else if (i.assigned == 2 && i.status == "1" && i.is_deleted != '1') {
          i.approvalStatus = 'Started By Community'
        }
        else if (i.assigned == 2 && i.status == "3" && i.is_deleted != '1') {
          i.approvalStatus = 'Completed By Community'
        } else if (i.assigned == 3 && i.status == "1" && i.is_deleted != '1') {
          i.approvalStatus = 'Started By Agency'
        }
        else if (i.assigned == 3 && i.status == "3" && i.is_deleted != '1') {
          i.approvalStatus = 'Completed By Agency'
        }
        else if (i.assigned == 5 && i.status == "5" && i.is_deleted != '1') {
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

  returnDataMyShiftStatus(data) {
    return data?.map(i => {
      if (i.assigned == 3 && i.status == "3" && i.auto_cancel != '1' && i.self_cancel != "1") {
        i.approvalStatus = 'Completed By Agency'
        i.expired = this.checkErrorDate(i.start_time)
      } else if (i.assigned == 5 && i.status == "5") {
        i.approvalStatus = 'Closed'
        i.hideBtn = true;
        i.expired = this.checkErrorDate(i.start_time)
      } else
        if (i.approved == 1 && i.self_cancel != "1" && i.auto_cancel != '1') {
          i.approvalStatus = 'Assigned'
          i.approvedHide = true
          i.expired = this.checkErrorDate(i.start_time)
        } else if (i.approved == "0" || i.approved == "1") {
          i.approvalStatus = 'Not Assigned'
          i.approvedHide = false
          i.expired = this.checkErrorDate(i.start_time)
        }
        else if ((i.approved == 0 || i.approved == 2) && (i.assigned == 2 || i.assigned == 3 || i.assigned == 1 || i.assigned == 0) && i.self_cancel == 0) {
          i.approvalStatus = 'Canceled';
          i.expired = this.checkErrorDate(i.start_time)
        }
        else if ((i.approved == 0 || i.approved == 2) && (i.assigned == 2 || i.assigned == 3 || i.assigned == 1 || i.assigned == 0) && i.self_cancel == 1) {
          i.approvalStatus = 'Canceled By User'
          i.expired = this.checkErrorDate(i.start_time)
        }
      return i;
    });
  }

  checkErrorDate(val) {
    const timestamp = Number(val) * 1000;
    const moment = new Date(timestamp);

    // Get the current date and time
    const currentDate = new Date();

    // Compare the moment to the current date
    if (moment > currentDate) {
      return true
    } else {
      return false
    }
  }

  applyShift() {
    let body = {
      for_cp: this.prmsUsrId.for_cp,
      shift_id: this.currentUser?.user_role == 2 ? this.prmsUsrId.shift_id : this.prmsUsrId.id,
      user_id: this.currentUser?.id,
      is_agency: this.currentUser?.user_role == 2 ? 1 : 0,
      applied_for_by: this.userDetail,
      direct_assign: 0
    }

    this.dataService.applyShift(body).subscribe((res: any) => {
      if (!res.error) {
        this.tost.successToastr(res.msg)
        this.modalService.dismissAll()
        if (this.currentUser?.user_role == '4') {
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
  getUserDetail() {
    let is_for = this.currentUser?.user_role == 2 ? 'agency' : this.currentUser?.user_role == 1 || this.currentUser?.user_role == 4 ? 'community' : 'agency'
    let id = this.currentUser?.user_role == 2 || this.currentUser?.user_role == 1 ? this.currentUser?.id : this.currentUser?.com_id
    let searchStr = this.searchUserName ?? '';
    this.dataService.getUserById(searchStr, id, is_for).subscribe((res: any) => {
      this.agncyUsr = res?.body.sort(function (a, b) {
        if (a.last_name.toUpperCase() < b.last_name.toUpperCase()) { return -1; }
        if (a.last_name.toUpperCase() > b.last_name.toUpperCase()) { return 1; }
        return 0;
      });
    })
  }

  onStartDateChange() { // Clear end_date if start_date is cleared
    if (!this.start_date) {
      this.end_date = null;
      this.endTime = '24:00';
      this.startTime = '00:00';
    }
  }

  getMalualUserDetail() {
    let id = this.currentUser?.user_role == 1 ? this.currentUser?.id : this.currentUser?.com_id
    let searchStr = this.searchmanualUserName ?? '';
    this.dataService.getManualUserById(searchStr, id).subscribe((res: any) => {
      this.malualUsr = res?.body.sort(function (a, b) {
        if (a.last_name.toUpperCase() < b.last_name.toUpperCase()) { return -1; }
        if (a.last_name.toUpperCase() > b.last_name.toUpperCase()) { return 1; }
        return 0;
      });
    })
  }

  assignShift(snglUsr, modal) {
    console.log(snglUsr, modal, 'snglurs');

    let body: any = {}
    if (this.currentUser?.user_role == 5 && this.applyDirectly == true) {
      body = {
        for_cp: this.prmsUsrId.for_cp,
        shift_id: this.prmsUsrId.shift_id,
        agency_user: this.currentUser.id,
        user_id: this.currentUser?.role == 'Agency' ? this.currentUser?.id : this.currentUser?.com_id,
        is_agency: this.currentUser?.role == 'Agency' || this.currentUser?.user_role == 5 ? 1 : 0,
        applied_for_by: this.userDetail,
        direct_assign: 0
      }
    }
    else if (this.currentUser?.user_role == 5 && this.permision.aplyPrms == '1') {
      body = {
        for_cp: this.prmsUsrId.for_cp,
        shift_id: this.prmsUsrId.shift_id,
        agency_user: snglUsr.agency_user || snglUsr.id,
        user_id: this.currentUser?.role == 'Agency' ? this.currentUser?.id : this.currentUser?.com_id,
        is_agency: this.currentUser?.role == 'Agency' || this.currentUser?.user_role == 5 ? 1 : 0,
        applied_for_by: this.userDetail,
        direct_assign: 0
      }
    } else {
      body = {
        for_cp: this.prmsUsrId.for_cp,
        shift_id: this.currentUser?.role == 'Agency' ? this.prmsUsrId.shift_id : this.prmsUsrId.id,
        user_id: this.currentUser?.role == 'Agency' ? this.currentUser?.id : this.currentUser?.com_id,
        agency_user: snglUsr.agency_user || snglUsr.id,
        is_agency: this.currentUser?.role == 'Agency' || this.currentUser?.user_role == 5 ? 1 : 0,
        applied_for_by: this.userDetail,
        direct_assign: 0
      }

    }

    let body1: any = {}
    if (this.currentUser?.user_role == 5 && this.applyDirectly == true) {
      body1 = {
        shift_id: this.prmsUsrId.shift_id,
        agency_user: this.currentUser.id,
        request_status: 'Approved'
      }
    }
    else {
      body1 = {
        shift_id: snglUsr.shift_id,
        agency_user: snglUsr.agency_user,
        request_status: 'Approved'
      }
    }

    this.dataService.applyShift(body).subscribe((res: any) => {
      if (!res.error) {
        this.tost.successToastr(res.msg)
        this.dataService.ApproveRequest(body1).subscribe((res: any) => {
          if (!res.error) {
          }
        })
        this.modalService.dismissAll()
        this.getShiftAccToRole()
        let data :any ={}
        if(this.currentUser?.user_role == 5 && this.applyDirectly == true){
          data = {
            is_for: '',
            shift_id: this.prmsUsrId?.shift_id ?? this.prmsUsrId.id,
            user_id: this.detailuser.agency_user || this.detailuser.id,
            agency_id: this.currentUser?.user_role == 2 ? this.currentUser?.id : this.currentUser?.com_id,
            first_name: this.detailuser.first_name,
            last_name: this.detailuser.user_lastname || this.detailuser.last_name,
            phone_number: this.detailuser.phone_number,
            pin: this.detailuser?.PIN_code || '',
            hourly_rate: this.detailuser.hourly_rate || '',
            user_name: this.detailuser.username
          }
        }
        else{
         data = {
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
        }}
        this.dataService.assignAGShift(data).subscribe((res: any) => {
          if (!res.error) {
            this.closeded(modal)
          }
        })
        if (this.currentUser?.user_role == '4') {
          this.getShiftAccToRole();
        }
      }
      else {
        this.modalService.dismissAll()
        this.tost.errorToastr(res.msg)
      }
    })
  }

  cancelRequest1(row: any) {
    this.shift = row.shift_id
    this.ag = row.agency_user

    this.modalOpenOSE(this.cancelRequestshift, 'lg');
  }

  cancelRequest(modal: NgbModalRef) {
    let body1 = {
      shift_id: this.shift,
      agency_user: this.ag,
      request_status: 'Cancelled',
      request_cancel_reason: this.cancel_reason
    }
    if (!this.cancel_reason) {
      this.tost.errorToastr("Please fill reason")
    } else {
      this.dataService.cancelRequest(body1).subscribe((res: any) => {
        if (!res.error) {
          this.tost.successToastr(res.msg)
          this.getShiftForAgency()
          this.modalService.dismissAll()
        } else {
          this.modalService.dismissAll()
          this.tost.errorToastr(res.msg)
        }
      })
    }

  }

  openReasonMdl(row) {
    this.row = row
    this.modalOpenOSE(this.reasonMdl, 'lg');
  }
  popUpForComm(row) {
    this.modalOpenOSE(this.AssignShift, 'ls')
    this.poid = row.id;
    this.poph = row.phone_number

  }

  keyupper(cancel_reason) {
    if (!cancel_reason) {
      this.resonIsNull = true
    } else {
      this.resonIsNull = false
    }
  }

  applyShiftToCmUser(row, no,) {
    this.prmsUsrId = row;
    if (this.currentUser?.user_role == 1 || this.currentUser?.user_role == 4) {
      if (this.flags == 0) {
        this.onItemSelect(this.currentUser?.user_role == 5 || this.permision.addPrms == '1' ? this.currentUser?.com_id : this.currentUser?.id)
        this.getUserDetail()
        this.modalOpenOSE(this.CmUserList, 'lg')
      }
      else {
        this.onItemSelect(this.currentUser?.user_role == 5 || this.permision.addPrms == '1' ? this.currentUser?.com_id : this.currentUser?.id)
        this.getUserDetail()
        this.createAddNew()
      }
    }
  }

  requestlist(row) {
    this.prmsUsrId = row
    this.shiftid = row.shift_id
    this.modalOpenOSE(this.requestacceptmodel, 'lg')
    this.accptshift()
  }

  requestedapply() {

  }

  request(row) {
    this.prmsUsrId = row
    this.modalOpenOSE(this.requestmodel, 'lg')
  }


  requested(modal: NgbModalRef) {
    let body = {
      shift_id: this.permision.aplyPrms == '1' ? this.prmsUsrId.shift_id : this.prmsUsrId.id,
      agency_user: this.currentUser?.id,
      user_name: this.userdetail.username,
      first_name: this.userdetail.first_name,
      user_lastname: this.userdetail.last_name,
      phone_number: this.userdetail.phone_number,
      email: this.userdetail.email,
      country_code: this.userdetail.country_code,
      pin: this.userdetail.PIN_code,
      hourly_rates: this.userdetail.hourly_rate,
      aggency_id: this.currentUser?.com_id,
      community_id: this.permision.aplyPrms == '1' ? this.prmsUsrId.id : this.prmsUsrId.community_id,
      start_time: this.prmsUsrId.start_time,
      approved: '0',
      status: this.userdetail.status,
      user_end_time: this.prmsUsrId.end_time
    }
    this.dataService.requestForShift(body).subscribe((res: any) => {
      if (!res.error) {
        this.tost.successToastr(res.msg)
        this.modalService.dismissAll()
        this.getShiftAccToRole();
      }
      else {
        this.tost.errorToastr(res.msg)
      }
    }, (err) => {
      this.dataService.genericErrorToaster()
    })

  }





  applyShiftToAgency(row, no) {
    this.prmsUsrId = row;
    console.log(this.prmsUsrId, 'prmission');

    if (this.applyDirectly == true && this.currentUser.user_role == 5) {
      this.onItemSelect(this.currentUser?.user_role == 5 || this.permision.addPrms == '1' ? this.currentUser?.com_id : this.currentUser?.id)
      this.modalOpenOSE(this.directApply, 'lg')
    } else if (this.currentUser?.user_role != 2 && this.currentUser?.user_role != 5) {
      this.onItemSelect(this.currentUser?.user_role == 5 ? this.currentUser?.com_id : this.currentUser?.id)
      this.modalOpenOSE(this.comUsrApply, 'lg')
    } else {
      this.getAgncyUsrLst()
      this.modalOpenOSE(this.UserLiST, 'lg');
      this.searchUserName = '';
    }
  }
  getAgncyUsrLst() {
    let is_for = 'agency'
    let searchStr = this.searchUserName1 ?? ''
    let id = this.currentUser?.user_role == 5 || this.currentUser?.user_role == 2 ? this.replcShitData?.community_id ?? this.prmsUsrId?.id : this.currentUser?.id
    this.dataService.getAgencyUnblockUser(id, this.currentUser?.user_role == 2 ? this.currentUser?.id : this.currentUser?.com_id, searchStr).subscribe((res: any) => {
      if (!res.error) {
        this.agncyUsr = res.body.sort(function (a, b) {
          if (a.last_name.toUpperCase() < b.last_name.toUpperCase()) { return -1; }
          if (a.last_name.toUpperCase() > b.last_name.toUpperCase()) { return 1; }
          return 0;
        });

        this.agncyUsr.map(i => {
          if (i.is_blocked == true) {
            i.asgnBtnDsbl = true
          } else {
            i.asgnBtnDsbl = false
          }
          if (i.id == this.replaceid) {
            i.asgnDsbl = true
          } else {
            i.asgnDsbl = false
          }
        })
      }
    },
      (err) => {
        this.dataService.genericErrorToaster()
      })
  }

  shiftAssignTo() {
    this.dataService.getShiftAssignTo(this.currentUser?.user_role == 4 ? this.currentUser?.com_id : this.currentUser?.id).subscribe((res: any) => {
      this.flags = res.body[0].shift_assigned_to
    })
  }

  openAddNew() {
    this.modalOpenOSE(this.Addnew, 'lg');
    this.getRoles()
    this.getuserDetails()
    if (this.currentUser?.user_role == '2' || this.currentUser?.user_role == 5) {
      this.dataService.getAgenciesByID(this.currentUser?.user_role == 5 ? this.currentUser?.com_id : this.currentUser?.id).subscribe((res: any) => {
        this.slctSrtNm = res.body[0]?.sort_name;
        this.userDetail = res.body[0]?.agency_name
      })
    }
  }
  reson(reason) {
    this.replaceUserText = reason
  }
  // assignshift(data:any){
  //   this.assignShiftDt = data
  //   this.modalOpenOSE(this.AssignShift,'lg')

  // }

  applyShiftToCmU(snglUsr, modal) {
    let body = {
      for_cp: this.prmsUsrId.for_cp,
      shift_id: this.prmsUsrId.id,
      user_id: this.poid,
      is_agency: 0,
      applied_for_by: this.curComDetails,
      direct_assign: 1
    }


    let data = {
      id: this.prmsUsrId.id,
      user_id: this.poid,
      is_for: 'community_user',
      phone_number: this.poph,
      assigned_by: this.curComDetails,
      assign_note: this.cancel_reason

    }
    if (!this.cancel_reason) {
      this.tost.errorToastr("Fill Confirmation Message")
    }
    else {
      this.dataService.applyShift(body).subscribe((res: any) => {
        if (!res.error) {
          this.dataService.assignShift(data).subscribe((res: any) => {
            if (!res.error) {
              this.tost.successToastr(res.msg)
              this.modalService.dismissAll()
              this.cancel_reason = ''
            } else {
              this.tost.errorToastr(res.msg)
            }
          },
            (err) => {
              this.dataService.genericErrorToaster();
            })
          if (this.currentUser?.user_role == '1' || this.currentUser?.user_role == '4') {
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
  }

  createAddNew() {
    this.modalOpenOSE(this.addnewuser, 'lg');
    this.getMalualUserDetail()
  }
  manulyAddUser() {
    this.modalOpenOSE(this.createnew, 's');
  }



  accptshift() {
    this.dataService.getShiftRequestById(this.shiftid, this.currentUser?.id).subscribe((res: any) => {
      if (!res.error) {
        this.appliedUserdtail = res.body
        this.appliedUserdtail.map(i => {
          if (i.aggency_id == null) {
            i.chngVal = i?.first_name + ' ' + i?.last_name
          }
          else if (i.aggency_id != null) {
            if (i.agency_user_data?.length) {
              if (i.agency_user_data?.length && i.agency_user != null) {
                i.chngVal = i.agency_user_data[0].first_name + ' ' + i.agency_user_data[0].last_name
              } else {
                i.chngVal = i?.user_name + ' ' + i?.user_lastname
              }
            } else {
              i.chngVal = i.chngVal = i?.user_name + ' ' + i?.user_lastname
            }
          }
        })
      }
    },
      (err) => {
        this.dataService.genericErrorToaster();
      })
  }

  getuserDetails() {
    if ((this.currentUser?.user_role == 4 && this.permision.addPrms != '1') || this.currentUser?.user_role == 5) {
      let id = this.currentUser?.id;
      let is_for = 'user'
      this.dataService.getUserById('', id, is_for).subscribe(response => {
        if (response.body && response.body[0] && response.body[0]) {
          this.curComDetails = response.body[0]?.first_name + ' ' + response.body[0]?.last_name
          this.userdetail = response.body[0]

        }
      })
    }
    else {
      this.dataService.getcommunityById(this.currentUser?.user_role == 4 ? this.currentUser?.com_id : this.currentUser?.id).subscribe(response => {
        if (!response.error) {
          if (response.body && response.body[0] && response.body[0]) {
            this.curComDetails = response.body[0].community_name
            this.slctSrtNm = response.body[0].sort_name
          }

        }
      }

      );
    }
  }


  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  togglePasswordTextType2() {
    this.passwordTextType2 = !this.passwordTextType2;
  }
  replaceShiftUser(snglUsr, modal) {
    if (!this.replaceUserText) {
      this.tost.errorToastr('Please fill reason!')
      return
    }
    this.disabledApply = true;
    let data = {
      shift_id: this.replcShitData.shift_id,
      aggency_id: this.replcShitData.aggency_id,
      user_id: this.replcShitData.agency_user || this.replcShitData.phone_number,
      replaced_user_id: snglUsr.id,
      phone_number: this.replcShitData.phone_number,
      reason: this.replaceUserText,
      user_name: snglUsr.username,
      first_name: snglUsr.first_name,
      last_name: snglUsr.last_name,
      applied_for_by: this.userDetail,
      canceled_by: this.userDetail
    }
    this.dataService.replaceShiftUser(data).subscribe((res: any) => {
      if(res.error)
        this.tost.errorToastr(res.msg)
      else
      this.tost.successToastr(res.msg)
      this.loadingList = false;
      this.modalService.dismissAll()
      this.disabledApply = false;
      this.replaceUserText = ''
      // this.disabledApply=false;
      this.getShiftAccToRole();
    }, error => {
      this.loadingList = false;
      // this.disabledApply=false;
    }
    )

  }

  ngOnDestroy(): void {
  }

  onItemSelect(e) {
    if (this.currentUser?.user_role == '2' || this.currentUser?.user_role == 5) {
      this.dataService.getAgenciesByID(this.currentUser?.user_role == 5 ? this.currentUser?.com_id : this.currentUser?.id).subscribe((res: any) => {
        this.detailuser = res.body[0]
        this.slctSrtNm = res.body[0]?.sort_name;
        this.userDetail = res.body[0]?.agency_name
      })
    }
    if (this.currentUser?.user_role == 5 || this.currentUser?.user_role == 4 || this.currentUser?.user_role == 1) {
      let is_for = this.currentUser?.user_role == 1 ? 'community' : 'user'
      let searchStr = ''
      this.dataService.getUserById(searchStr = '', this.currentUser?.id, is_for).subscribe((res: any) => {
        this.detailuser = res.body[0]
        this.slctSrtNm = res.body[0].sort_name
        this.userDetail = res.body[0].first_name + " " + res.body[0].last_name;
      })
    }
  }

  compareDates(dates: any) {
    let currentDate = moment().utc().unix();
    let hour = dates.h_m == "Hours" ? "hour" : "minute";
    let shiftStartTime: any = moment(dates.created_at).add(
      dates.delay,
      hour
    );
    shiftStartTime = moment(shiftStartTime).utc().unix();

    if (shiftStartTime > currentDate) {
      return true;
    } else if (shiftStartTime < currentDate) {
      return false;
    } else {
      return true;
    }
  }

  changePage(page: any, data?: any) {
    this.page.pageNumber = data ? data : page.offset ? page.offset : 0;
    const startIndex = this.page.pageNumber * 10;
    const endIndex = startIndex + 10;
    this.shiftData = this.sortedArrayVal?.slice(startIndex, endIndex);
  }
  searchUser(event: any) {
    this.userSearch.next(event.target.value)
  }
  searchUser1(event: any) {
    this.userSearch1.next(event.target.value)
  }
  appliedUser(row) {
    let body = {
      is_for: this.currentUser.role == 'Community' || this.currentUser.role == 'SuperAdmin' ? 'cp' : '',
      shift_id: row.id,
    }
    this.dataService.getAppliedShiftById(body).subscribe((res: any) => {
      if (!res.error) {
        if (res.body.all[0].approved == '1')
          this.appliedUserdtail = res.body.all[0]
      }
    })
  }
}
