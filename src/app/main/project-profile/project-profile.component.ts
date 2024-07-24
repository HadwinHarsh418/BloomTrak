import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Role, User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import moment from 'moment';
import { DatePipe } from '@angular/common';
import { debounceTime, map } from 'rxjs/operators';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Patterns } from 'app/auth/helpers/patterns';
import { ConfirmedValidator } from 'app/auth/helpers/mustMacth';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { log } from 'console';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-project-profile',
  templateUrl: './project-profile.component.html',
  styleUrls: ['./project-profile.component.scss']
})
export class ProjectProfileComponent implements OnInit {
  public StartmyDate = new Date()
  break: any = 30
  addNewUser!: FormGroup;
  editModalForm!: FormGroup;
  varianceForm!: FormGroup;
  btnShow: boolean = false;
  userId: any;
  checkVal: any;
  filename: any;
  loading: boolean;
  curComDetails: any;
  error: any;
  roleData: any;
  public contentHeader: object;
  public currentUser: User;
  imageObject: any[] = [];
  @ViewChild('Addnew') Addnew: ElementRef<any>;
  @ViewChild('UserLiST') UserLiST: ElementRef<any>;
  @ViewChild('editModal') editModal: ElementRef<any>;
  @ViewChild('comUsrApply')comUsrApply:ElementRef<any>;
  private userSearch = new Subject<any>();
  sd2: any;
  ed2: any;
  snglShftDtls: any = []
  dt_tm: string[];
  dt_tm1: string[];
  duration: string;
  agncyUsr: any = []
  hideApply: boolean = false;
  applySft: any;
  agcydata: any;
  usrAssg: any;
  usrCmAssg: any;
  assigned: any;
  apprShft: any;
  aplHide: boolean = false;
  clkHide: boolean = false;
  id: any;
  shiftStartTime: any;
  shiftEndTime: any;
  shiftStartTime1: any;
  shiftEndTime1: any;
  shftData: any;
  adjSrtTime: any;
  adjEndTime: any;
  count: any[];
  hrs: any[];
  count2: any[];
  fileToUpload: any;
  clkInTm: any;
  dateForApply: any;
  dateForAssign: any
  clkOtTm: any;
  clockDetails: any;
  Showbtn: boolean;
  stdate: string;
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
  data1: any[];
  phoneUsd: { name: string; flag: string; code: string; dial_code: string; }[];
  selectedDataValue = "+1";
  slctSrtNm: any;
  comId: any;
  comConf: boolean;
  frstNewApply: number;
  replcShitData: any;
  reason: any;
  varianceFomValue: any;
  permision: any;
  appliedUserdtail: any;
  AppliedData: any;
  AssignedData: any;
  historyStartTime: any;
  startHistoryDate: any;
  historyEndTime: any;
  timeForApply: any;
  timeForAssign: string;
  startvardata: number;
  startvardata1: number;
  stime: string;
  CanceledData: any;
  public passwordTextType: boolean;
  public passwordTextType2: boolean;
  deletedData: any;
  ttime: any;
  clkInTm1: string;
  userDetail: any;
  varff: any;
  searchUserName: string;
  flaghorlyhate: any;
  spread_rate: boolean;

  constructor(
    private aCtRoute: ActivatedRoute,
    private datasrv: DataService,
    private _authenticationService: AuthenticationService,
    private loctn: Location,
    private tost: ToastrManager,
    private modalService: NgbModal,
    private fb: FormBuilder,
    public datePipe: DatePipe,
    public _router: Router,
    private pipe:DatePipe
  ) {
    this.usrAssg = []
    this._authenticationService.currentUser.subscribe
      (x => {
        this.currentUser = x;

      }
      );
      this.userSearch.pipe(
        debounceTime(500)
      ).subscribe((searchTextValue: any) => {
        if (searchTextValue)
          this.searchUserName = searchTextValue;
        this.currentUser?.user_role == 2 || this.currentUser?.user_role == 5 ? this.getAgncyUsrLst() : ''
      });
      sessionStorage.clear();
    }
    
    convertToIST(utcTime: string): string {
      const utcDate = new Date(utcTime);
      return this.datePipe.transform(utcDate, 'hh:mm a', 'IST') || '';
    }
  mapCountry_selected(data) {
    return this.selectedDataValue = data.dial_code;
  }

  ngOnInit(): void {
    this.aCtRoute.params.subscribe(
      res => {
        if (res.id) {
          this.userId = res.id;
          this.checkVal = res.d
          // console.log(res)
          this.getUserdetail()
          this.getuserDetails();
          this.appliedUser()
          this.addNewUserInit()
          this.onItemSelect(this.currentUser?.id)
          // this.getUserAssigned()
        }
      }
    )
    // this.getAgncyDtail()
    // this.addNewUser = this.fb.group({
    //   first_name: ['',Validators.required],
    //   last_name: ['',Validators.required],
    //   pin: ['',Validators.required],
    //   phone_number: ['',[Validators.required,Validators.pattern(Patterns.number)]]
    // })
    this.getAgncyDtail()
    this.getPrmsnData()
    this.currentUser?.user_role == 1 || this.currentUser?.user_role == 4 ? this.getShiftHistory() : '';



    this.editModalForm = this.fb.group({
      holi_strDate: ['', [Validators.required]],
      holi_strTime: [this.StartmyDate, [Validators.required]],
      holi_strTime1: ['', [Validators.required]],
      holi_endDate: ['', [Validators.required]],
      holi_endTime: ['', [Validators.required]],
      holi_endTime1: ['', [Validators.required]],
      // adj_Brk : ['' ,[Validators.required]],
      adj_BrkTime: ['',],
      varFrmCmpl: ['', [Validators.required]],
    },
      // { validators: this.timeValidation }
    );

    this.varianceForm = this.fb.group({
      file: ['']
    })
    this.editModalForm.controls['holi_strTime'].setValue(new Date())
    this.contentHeader = {
      headerTitle: 'Shifts',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Home',
            isLink: true,
            link: '/'
          },
          {
            name: 'Shifts',
            isLink: true,
            link: '/shift'
          },
        ]
      }
    };

    let cnt: any = '0'; // current count
    this.count = Array.from({ length: 60 }, (_, i) => cnt + i < 10 ? '0' + i : i);

    this.count2 = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55', '60']

    let hrs: any = '0'; // current count
    this.hrs = Array.from({ length: 25 }, (_, i: any) => hrs + i < 10 ? '0' + i : i);
  }
  addNewUserInit() {
    this.addNewUser = this.fb.group({
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
  getRoles() {
    let id = this.currentUser?.prmsnId
    let data = {
      prms: (id == '1') ? 'community_id' : (id == '2') ? 'agency_id' : 'null',
      id: this.currentUser?.id
    }
    this.datasrv.getRole(data).subscribe((res: any) => {
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
      this.datasrv.genericErrorToaster()
    })
  }

  checkErrorDate(val) {
    const timestamp = Number(val) * 1000;
    const moment = new Date(timestamp);

    // Get the current date and time
    const currentDate = new Date();

    // Compare the moment to the current date
    if (moment > currentDate) {
      return false
    } else {
      return true
    }
  }

  goBackShift() {
    this._router.navigate(['/shift', 'id'])
  }

  getuserDetails() {
    this.loading = true;
    this.userId;
    this.datasrv.getshiftById(this.userId).subscribe(response => {
      if (!response.error) {
        this.snglShftDtls = response.body
        this.getAgency()
        this.ttime = response.body[0].start_time*1000;
        this.historyStartTime = response?.body[0]?.start_time || this.snglShftDtls[0].start_time ? moment.unix(response?.body[0]?.start_time || this.snglShftDtls[0].start_time).format("MM-DD-yyyy HH:mm A") : '';
        this.stime = moment(response?.body[0].created_at).format("MM-DD-yyyy HH:mm A");
        this.historyEndTime = response?.body[0]?.end_time || this.snglShftDtls[0].end_time ? moment.unix(response?.body[0]?.end_time || this.snglShftDtls[0].end_time).format("MM-DD-yyyy HH:mm A") : '';
        this.Showbtn = this.checkErrorDate(response.body[0].start_time)
        this.id = this.snglShftDtls[0]?.id
        if (this.currentUser?.role == 'Agency') {
          this.getUserAssigned(this.id)
        } else if (this.currentUser?.role == 'Community' || this.currentUser?.user_role == 4) {
          this.getCMUserAssigned(this.currentUser?.user_role == 4 ? this.userId : this.id)
        }
        this.snglShftDtls.map((i: any) => {
          this.assigned = i.assigned
          i.cr = moment(i.created_at).format("dddd, MMMM Do YYYY, h:mm:ss a")
        })
        this.getDrton()
      }
      this.loading = false;
    }, error => {
      this.error = error;
      this.loading = false;
    }
    );
  }

  getDrton() {
    let end_time = moment.unix(this.snglShftDtls[0]?.end_time).format("YYYY-MM-DD HH:mm")
    let start_time = moment.unix(this.snglShftDtls[0]?.start_time).format("YYYY-MM-DD HH:mm")
    this.dt_tm = end_time.split(" ");
    this.dt_tm1 = start_time.split(" ");

    let timeStart = new Date(this.dt_tm1[0] + ' ' + this.dt_tm1[1]).getTime();
    let timeEnd = new Date(this.dt_tm[0] + ' ' + this.dt_tm[1]).getTime();
    let hourDiff = timeEnd - timeStart; //in ms
    // let secDiff = hourDiff / 1000;
    let minDiff = hourDiff / 60 / 1000; //in minutes
    let hDiff = hourDiff / 3600 / 1000; //in hours
    let hours = Math.floor(hDiff);
    let minutes = minDiff - 60 * hours;
    if (!isNaN(hours) && !isNaN(minutes)) {
      this.duration = hours + ' hour and ' + minutes + ' minutes.'
    }
    this.checkCase(minDiff);

  }
  goBack() {
    this.loctn.back()
  }


  getUserdetail() {
    if (this.currentUser?.user_role == '2' || this.currentUser?.user_role == 5) {
      this.datasrv.getAgenciesByID(this.currentUser?.user_role == 5 ? this.currentUser?.com_id : this.currentUser?.id).subscribe((res: any) => {
        this.slctSrtNm = res.body[0]?.sort_name;
        this.userDetail = res.body[0]?.agency_name
      })
    }
    if (this.currentUser?.user_role == 5 || this.currentUser?.user_role == 4 || this.currentUser?.user_role == 1) {
      let is_for = this.currentUser?.user_role == 1 ? 'community' : 'user'
      let searchStr = ''
      this.datasrv.getUserById(searchStr = '', this.currentUser?.id, is_for).subscribe((res: any) => {
        this.slctSrtNm = res.body[0].sort_name
        this.userDetail = res.body[0].first_name + " " + res.body[0].last_name;
      })
    }
  }

  getAgency(){
    this.datasrv.getAllAgenciesType(this.snglShftDtls[0].community_id).subscribe(res=>{
      if (!res.error){
        this.flaghorlyhate = res.body.filter(agency => agency.agency_type === '1');
        if (this.flaghorlyhate.length > 0) {
          this.spread_rate = true;
        } else {
          this.spread_rate = false;
        }
      } 
    }
  );
}

  getShiftHistory() {
    this.datasrv.getShiftHistory(this.userId).subscribe((res: any) => {
      this.AppliedData = res.body.applied.map((i: any) => {
        i.dataForApply = moment(i.created_at).format('MM-DD-YYYY');
        i.timeForApply = moment(i.created_at).format('HH:MM A');
        return i;
      })

      this.AssignedData = res.body.assigned.map((i: any) => {
        i.dateForAssign = moment(i.updated_at).format('MM-DD-YYYY');
        i.timeForAssign = moment(i.updated_at).format('HH:MM A');
        return i;
      });     
      this.CanceledData = res.body.canceled.map((i: any) => {
        i.dateForAssign = moment(i.updated_at).format('MM-DD-YYYY');
        i.timeForAssign = moment(i.updated_at).format('HH:MM A');
        return i;
      }); 
      this.deletedData = res.body.archived.map((i: any) => {
        i.dateForAssign = moment(i.updated_at).format('MM-DD-YYYY');
        i.timeForAssign = moment(i.updated_at).format('HH:MM A');
        return i;
      });     
    }
    )

  }

  getUserAssigned(id) {
    // let data =  this.snglShftDtls[0]?.id
    // console.log('shift',shift_id)
    this.datasrv.getUserAssigned(id).subscribe((res: any) => {
      if (res?.body) {
        this.clockDetails = res.body[0].item
        this.usrAssg = []
        this.usrAssg = res?.body;
        this.varianceFomValue = res.body[0]?.item.varFrmCmpl
        // this.shiftStartTime = moment.unix(res?.body[0]?.userShiftData.shiftStartTime).format("hh:mm a");
        this.shiftStartTime = moment.unix(res?.body[0]?.item.start_time);
        this.shiftEndTime = moment.unix(res?.body[0]?.item.end_time);
        this.shiftStartTime = res?.body[0]?.item.start_time || this.snglShftDtls[0].start_time ? moment.unix(res?.body[0]?.item.start_time || this.snglShftDtls[0].start_time).format("MM-DD-yyyy HH:mm A") : '';
        this.shiftEndTime = res?.body[0]?.item.end_time || this.snglShftDtls[0].end_time ? moment.unix(res?.body[0]?.item.end_time || this.snglShftDtls[0].end_time).format("MM-DD-yyyy HH:mm A") : '';
        this.adjSrtTime = res?.body[0]?.item?.adj_start_time ? moment.unix(res?.body[0]?.item?.adj_start_time).format("MM-DD-yyyy HH:mm A") : ''
        this.adjEndTime = res?.body[0]?.item?.adj_end_time ? moment.unix(res?.body[0]?.item?.adj_end_time).format("MM-DD-yyyy HH:mm A") : ''
        this.clkInTm = res?.body[0]?.item?.user_start_time ? moment.unix(res?.body[0]?.item?.user_start_time).format("MM-DD-yyyy HH:mm A") : ''
        this.clkOtTm = res?.body[0]?.item?.user_end_time ? moment.unix(res?.body[0]?.item?.user_end_time).format("MM-DD-yyyy HH:mm A") : ''
        this.aplHide = res?.isAssigned;
      }
      else {
        this.aplHide = false;
      }
    }
    )
  }

  appliedUser() {
    let body = {
      is_for: 'cp',
      shift_id: this.id,
    }
    this.datasrv.getAppliedShiftById(body).subscribe((res: any) => {
      this.appliedUserdtail = res.body.all
    })
  }

  getCMUserAssigned(shift_id) {
    this.datasrv.getCMUserAssigned(shift_id).subscribe((res: any) => {
      if (res?.body) {
        this.shftData = res?.body[0]?.item;

        this.usrCmAssg = res?.body[1];

        this.shiftStartTime = res?.body[0]?.item.start_time || this.snglShftDtls[0].start_time ? moment.unix(res?.body[0]?.item.start_time || this.snglShftDtls[0].start_time).format("MM-DD-yyyy HH:mm A") : '';
        this.shiftEndTime = res?.body[0]?.item.end_time || this.snglShftDtls[0].end_time ? moment.unix(res?.body[0]?.item.end_time || this.snglShftDtls[0].end_time).format("MM-DD-yyyy HH:mm A") : '';
        this.adjSrtTime = this.shftData.adj_start_time ? moment.unix(this.shftData.adj_start_time).format("MM-DD-yyyy HH:mm A") : ''
        this.adjEndTime = this.shftData.adj_end_time ? moment.unix(this.shftData.adj_end_time).format("MM-DD-yyyy HH:mm A") : ''
        this.clkInTm = this.shftData.user_start_time ? moment.unix(this.shftData.user_start_time).format("MM-DD-yyyy HH:mm A") : ''
        this.clkOtTm = this.shftData.user_end_time ? moment.unix(this.shftData.user_end_time).format("MM-DD-yyyy HH:mm A") : ''
        this.aplHide = res?.isAssigned;
        this.clkInTm1 = res?.body[0]?.item.end_time || this.snglShftDtls[0].end_time ? moment.unix(res?.body[0]?.item.end_time || this.snglShftDtls[0].end_time).format("MM-DD-yyyy") : ''
      }
      else {
        this.aplHide = false;
      }
    }
    )
  }  

  applyShift(sngSfit) {
    this.applySft = sngSfit
    if (this.currentUser?.role == 'Agency') {
      this.openUserList()
      this.getAgncyUsrLst()
      // this.assignShift(sngSfit,modal)
    } else {
      let body = {
        for_cp: sngSfit.for_cp,
        shift_id: sngSfit.id,
        user_id: this.currentUser?.id,
        is_agency: 0,
        direct_assign : 0,
        applied_for_by: this.userDetail,
      }

      this.datasrv.applyShift(body).subscribe((res: any) => {
        if (!res.error) {
          this.tost.successToastr(res.msg)
          if (this.currentUser?.user_role == '4') {
            this.loctn.back()
            // this.setPage({ offset: 0 });
          }
        }
        else {
          this.closededAll()
          this.btnShow = false
          this.tost.errorToastr(res.msg)
        }
      }, (err) => {
        this.datasrv.genericErrorToaster()
      })
    }
  }

  openUserList() {
    this.modalOpenOSE(this.UserLiST, 'lg');
  }

  assignShift(snglUsr, modal) {
    let data = {
      is_for: '',
      first_name: snglUsr.first_name,
      last_name: snglUsr.last_name,
      phone_number: snglUsr.phone_number,
      hourly_rate: snglUsr.hourly_rate,
      agency_id: this.currentUser?.id,
      shift_id: this.applySft.id,
      user_id: snglUsr.id,
      user_name: snglUsr.user_name ? snglUsr.user_name : snglUsr.username
    }

    let body = {
      applied_for_by: this.userDetail,
      agency_user: snglUsr.id,
      for_cp: this.applySft.for_cp,
      shift_id: this.currentUser?.role == 'Agency' ? this.applySft.id : snglUsr.id,
      user_id: this.currentUser?.id,
      is_agency: this.currentUser?.role == 'Agency' ? 1 : 0,
      direct_assign : 0
    }

    this.datasrv.applyShift(body).subscribe((res: any) => {
      if (!res.error) {
        this.datasrv.assignAGShift(data).subscribe((res: any) => {
          if (!res.error) {
            this.tost.successToastr('Successfully Applied for the shift');
            this.closededAll()
            this.loctn.back()
            this.ngOnInit()
          }
        },
          (err) => {
            this.datasrv.genericErrorToaster()
          })
      } else {
        this.closededAll()
        this.tost.errorToastr(res.msg)
      }
    })
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

  closeded(modal: NgbModalRef) {
    this.searchUserName = ''
    modal.dismiss();
  }

  closededAll() {
    this.searchUserName = ''
    this.modalService.dismissAll();
  }

  openAddNew() {
    this.addNewUserInit()
    this.modalOpenOSE(this.Addnew, 'lg');
    this.getRoles()
  }


  getAgncyUsrLst() {
    let searchStr = this.searchUserName ?? '';
    this.datasrv.getAgencyUnblockUser(this.snglShftDtls[0].community_id, this.currentUser?.id,searchStr).subscribe((res: any) => {
      if (!res.error) {
        this.agncyUsr = res.body.sort(function (a, b) {
          if (a.last_name.toUpperCase() < b.last_name.toUpperCase()) { return -1; }
          if (a.last_name.toUpperCase() > b.last_name.toUpperCase()) { return 1; }
          return 0;
        });
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
        this.datasrv.genericErrorToaster()
      })
  }

  searchUser(event: any) {
    this.userSearch.next(event.target.value)
  }

  getAgncyDtail() {
    this.datasrv.getAgenciesByID(this.currentUser?.user_role == 4 ? this.currentUser?.com_id : this.currentUser?.id).subscribe((res: any) => {
      if (!res.error) {
        this.agcydata = res.body[0]
      }
      else {
        this.tost.errorToastr(res.msg)
      }
    }, (err) => {
      this.datasrv.genericErrorToaster()
    })
  }

  get controls() {
    return this.addNewUser.controls;
  }

  get ec() {
    return this.editModalForm.controls;
  }

  get vf() {
    return this.varianceForm.controls;
  }

  // submitted() {
  //   // this.addNewUser.reset()
  //   for (let item of Object.keys(this.controls)) {
  //     this.controls[item].markAsDirty()
  //   }
  //   if (this.addNewUser.invalid) {
  //     return;
  //   }

  //   submitted(modal) {
  //     // this.formData.reset()
  //     for (let item of Object.keys(this.controls)) {
  //       this.controls[item].markAsDirty()
  //     }
  //     if (this.addNewUser.invalid) {
  //       return;
  //     }

  //   let data = {
  //     is_for :"add_new",
  //     first_name : this.controls.first_name.value,
  //     last_name : this.controls.last_name.value,
  //     phone_number : this.controls.phone_number.value?.replace(/\D/g, ''),
  //     pin : this.agcydata.PIN_code,
  //     hourly_rate : this.agcydata.hourly_rate,
  //     agency_id : this.currentUser?.id,
  //     shift_id : this.snglShftDtls[0].id
  //   }

  //   let body = {
  //     for_cp: this.applySft.for_cp,
  //     shift_id:  this.applySft.id ,
  //     user_id: this.currentUser?.id,
  //     is_agency: this.currentUser?.role == 'Agency' ? 1 : 0
  //   }
  //   this.btnShow = true;

  //   this.datasrv.applyShift(body).subscribe((res: any) => {
  //     if (!res.error) {
  //       this.tost.successToastr(res.msg);      
  //         this.datasrv.assignAGShift(data).subscribe((res: any) => {
  //           // console.log(res)
  //           if (!res.error) {
  //             this.tost.successToastr(res.msg);
  //             // this.tempAddId = res.body[0]
  //             this.addNewUser.reset()
  //             this.closededAll()
  //             this.loctn.back()
  //             this.ngOnInit()
  //           } else {
  //             this.tost.errorToastr(res.msg);
  //             this.addNewUser.reset()
  //             this.closededAll()
  //           }
  //           this.btnShow = false;
  //         },
  //         (err) => {
  //           this.btnShow = false;
  //           this.datasrv.genericErrorToaster();
  //           this.addNewUser.reset()
  //           this.loctn.back()
  //           })

  //     }else{
  //       this.btnShow = false;
  //       this.closededAll()
  //       this.tost.errorToastr(res.msg)
  //       this.addNewUser.reset()
  //     }
  //   })
  //   let data1 = {
  //     phone_number: this.addNewUser.value.phone_number?.replace(/\D/g, ''),
  //     email: this.addNewUser.value.email,
  //     first_name: this.addNewUser.value.first_name,
  //     last_name: this.addNewUser.value.last_name,
  //     username: this.slctSrtNm + '-' + this.addNewUser.value.username.replace(' ','').trim(),
  //     password: this.addNewUser.value.password,
  //     agency_id: [this.currentUser?.id],
  //     isAdmin: '5',
  //     country_code: this.selectedDataValue ? this.selectedDataValue : '',
  //     roles_assign: this.addNewUser.value.addUsrRl
  //   }

  //   this.datasrv.addUser(data1).subscribe((res: any) => {
  //     if (!res.error) {

  //       this.tost.successToastr(res.msg);
  //       this.getAgncyUsrLst()
  //       this.addNewUser.reset()
  //       modal.dismiss();
  //     } else {
  //       this.tost.errorToastr(res.msg);
  //     }
  //     this.btnShow = false;
  //   },
  //     (err) => {
  //       this.btnShow = false;
  //       this.datasrv.genericErrorToaster();

  //     })
  //   this.btnShow = true;

  // }
  submitted(modal) {
    // this.formData.reset()
    for (let item of Object.keys(this.controls)) {
      this.controls[item].markAsDirty()
    }
    if (this.addNewUser.invalid) {
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
      this.datasrv.replaceShiftUser(data).subscribe((res: any) => {
        // this.loadingList = false;
        this.modalService.dismissAll()

      }, error => {
        // this.loadingList = false;
      }
      )
    }

    let data = {
      phone_number: this.addNewUser.value.phone_number?.replace(/\D/g, ''),
      email: this.addNewUser.value.email,
      first_name: this.addNewUser.value.first_name,
      last_name: this.addNewUser.value.last_name,
      username: this.slctSrtNm + '-' + this.addNewUser.value.username.replace(' ','').trim(),
      password: this.addNewUser.value.password,
      agency_id: [this.currentUser?.id],
      isAdmin: '5',
      country_code: this.selectedDataValue ? this.selectedDataValue : '',
      roles_assign: this.addNewUser.value.addUsrRl
    }

    this.datasrv.addUser(data).subscribe((res: any) => {
      if (!res.error) {

        this.tost.successToastr(res.msg);
        this.getAgncyUsrLst()
        this.addNewUser.reset()
        modal.dismiss();
      } else {
        this.tost.errorToastr(res.msg);
      }
      this.btnShow = false;
    },
      (err) => {
        this.btnShow = false;
        this.datasrv.genericErrorToaster();

      })
    this.btnShow = true;

  }

  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  togglePasswordTextType2() {
    this.passwordTextType2 = !this.passwordTextType2;
  }

  popup(val){
    this.modalOpenOSE(this.comUsrApply,'lg');
  }

  editOpen() {
    this.modalOpenOSE(this.editModal, 'lg');
    setTimeout(() => {
      this.ptchVal()
    }, 200);
  }
  ptchVal() {    
    // let adj_BrkTime = moment.unix(this.adjSrtTime).format("yyyy-MM-DD HH:mm").split(' ')
    // this.shiftStartTime1 =  this.adjSrtTime ? moment.unix(this.adjSrtTime).format("yyyy-MM-DD HH:mm").split(' ') : ''
    let splt = this.adjSrtTime ? this.adjSrtTime.split(' ') : this.shiftStartTime.split(' ')
    let splt2 = splt[1] ? splt[1].split(':') : ''
    // this.shiftEndTime1 =  this.adjEndTime ? moment.unix(this.adjEndTime).format("yyyy-MM-DD HH:mm").split(' ') : ''
    let splt1 = this.adjEndTime ? this.adjEndTime.split(' ') : this.clkInTm ? this.clkInTm1.split(' ') : this.shiftEndTime.split(' ')
    let splt3 = splt1[1] ? splt1[1].split(':') : ''
    this.editModalForm.patchValue({
      holi_strDate: this.transformDate(splt[0]),
      holi_strTime: splt2[0],
      holi_strTime1: splt2[1],
      holi_endDate: this.transformDate(splt1[0]),
      holi_endTime: splt3[0],
      holi_endTime1: splt3[1],
      // adj_Brk: adj_BrkTime[0],
      varFrmCmpl: this.shftData?.varFrmCmpl,
      adj_BrkTime: this.shftData?.adj_break_time ? this.shftData?.adj_break_time : '00',
    })
  }

  transformDate(value: any) {
    let final = value.split('-')
    return final[2] + '-' + final[0] + '-' + final[1]
  }

  editModalsubmitted(varform) {
    this.varff = varform == 1 ? '1' : '0';
    for (let item of Object.keys(this.ec)) {
      this.ec[item].markAsDirty()
    }
    if (this.editModalForm.invalid) {
      return;
    }

    let data = {
      adj_start_time: this.cnvrtnewDt(this.editModalForm.value.holi_strDate + ' ' + this.editModalForm.value.holi_strTime + ':' + this.editModalForm.value.holi_strTime1),
      adj_end_time: this.cnvrtnewDt(this.editModalForm.value.holi_endDate + ' ' + this.editModalForm.value.holi_endTime + ':' + this.editModalForm.value.holi_endTime1),
      adj_Brk: this.editModalForm.value.adj_BrkTime,
      id: this.shftData.id,
      varFrmCmpl: this.varff
 
    }
    this.startvardata = new Date(this.editModalForm.value.holi_strDate + ' ' + this.editModalForm.value.holi_strTime + ':' + this.editModalForm.value.holi_strTime1).getTime();
    this.startvardata1 = new Date(this.editModalForm.value.holi_endDate + ' ' + this.editModalForm.value.holi_endTime + ':' + this.editModalForm.value.holi_endTime1).getTime();   
    if (this.startvardata >= this.startvardata1 ) { 
      this.tost.errorToastr("Variance Clock Out Time must be after Variance Clock In Time")
    }
    // else if(this.startvardata < this.ttime){
    //   this.tost.errorToastr("Variance Clock In Time Must Be Greater Or Equal then Shift Start Time")
    // }
     else { 
      this.datasrv.updateAdjClockTime(data).subscribe((res: any) => {
        if (!res.error) {
          this.tost.successToastr(res.msg)
          this.modalService.dismissAll()
          this.getuserDetails();
        }
        else {
          this.tost.errorToastr(res.msg)
          this.editModalForm.patchValue({
            varFrmCmpl : this.varff
          })
        }
      }, (err) => {
        this.datasrv.genericErrorToaster()
      })

    }
  }

  cnvrtnewDt(date_tm) {
    return new Date(date_tm)
  }

  //   fileChange(event:any){
  //     console.log('dfgh',event.target.files[0]);
  //     const file = event.target.files[0];
  //     this.varianceSubmit(file)
  //   }

  //   varianceSubmit(data:any){
  //     for (let item of Object.keys(this.vf)) {
  //       this.vf[item].markAsDirty()
  //     }
  //     if (this.varianceForm.invalid) {
  //       return;
  //     }
  //     const formData= new FormData();
  //     formData.append('name',data);
  //     formData.append('id',this.id)
  //     this.datasrv.uploadVariance(formData).subscribe((res:any) => {
  //       if (!res.error) {
  //     this.tost.successToastr(res.msg)
  //     // this.setPage({ offset: 0 })

  //   } else {
  //     this.tost.errorToastr(res.msg)
  //   }
  // }, error => {
  //   this.tost.errorToastr('Something went wrong please try again')
  // }
  // )
  //   }

  @ViewChild('fileInput') elfile: ElementRef;
  onFileInput(files: any) {
    if (files.length === 0) {
      return;
    }
    this.filename = files[0].name;
    let type = files[0].type;
    this.fileToUpload = files[0];
    this.uploadNow()
  }

  uploadNow() {
    let formdata = new FormData();
    formdata.append('docUpload', this.fileToUpload)
    formdata.append('id', this.id)
    this.datasrv.uploadVariance(formdata).subscribe((res: any) => {
      if (!res.error) {
        this.tost.successToastr(res.msg)
        this.getuserDetails()
        // this.setPage({ offset: 0 })

      } else {
        this.tost.errorToastr(res.msg)
      }
    }, error => {
      this.tost.errorToastr('Something went wrong please try again')
    }
    )
  }
  onItemSelect(e) {
    if (this.currentUser?.user_role == '2') {
      this.datasrv.getAgenciesByID(this.currentUser?.id).subscribe((res: any) => {
        this.slctSrtNm = res.body[0]?.sort_name
      })
    }
  }
  getPrmsnData() {
    this.permision = { addPrms: '', dltPrms: '', edtPrms: '', vwPrms: '', aplyPrms: '', assign: '' };
    this.datasrv.getPermissionByAdminRole().subscribe(
      (res: any) => {
        if (!res.error) {
          res.body.map(i => {
            // if (roleIds.includes(i.role_id)) {
            if (i.trak_type == '1') {
              if (i.permission_name == 'Shifts') {
                this.permision.addPrms = i.add_permission
                this.permision.aplyPrms = i.apply_permission

              }
            }
          });
        }
      })
  }
  checkCase(diff:any){
    const timeInMinutes: number[] = this.count2.map(time => parseInt(time));

// Filter the time values based on the minute value
this.count2 = this.count2.filter((time, index) => {
  const timeInMins = timeInMinutes[index];
  return timeInMins <= Number(diff);
});
    
  }
}

