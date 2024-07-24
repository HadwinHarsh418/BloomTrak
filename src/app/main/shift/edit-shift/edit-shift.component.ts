// import { DatePipe } from '@angular/common';
import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { shift } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { CertificationService } from 'app/main/certification/certification.service';
import { DepartmentService } from 'app/main/department/department.service';
import { PositionService } from 'app/main/position/position.service';
import { Page } from 'app/utils/models';
import moment from 'moment';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-edit-shift',
  templateUrl: './edit-shift.component.html',
  styleUrls: ['./edit-shift.component.scss'],
  providers:[DatePipe]
})
export class EditShiftComponent implements OnInit {
  searchSub: any = null;
  public page = new Page();
  loadingList: boolean;
  searchStr: string = '';
  public rows: any = [];
  todaysDate: any;
  btnShow: boolean = false;
  mngmCommunity: any = [];
  allCommunity: any = [];
  currenUserId: any = ''
  public currentUser: any;
  minDate: any;
  approvedHide: boolean = false;
  today:any;

  Hours: any = [
    { hour: '00' },
    { hour: '01' },
    { hour: '02' },
    { hour: '03' },
   
  ]

  Minutes: any = [
    { minute: '00' },
    { minute: '05' },
    { minute: '15' },
    { minute: '30' },
    { minute: '45' },
  ]

  cancellation_period1: any = [
    { hour: '02' },
    { hour: '03' },
    { hour: '04' },
    { hour: '06' },
    { hour: '12' },
    { hour: '24' },
  ]

  timeslots: any[] = [
    { value: { hour: 0, minute: 0 }, label: '00:00', },
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


  public contentHeader: object;

  shiftId: any;
  h_m: string;
  end_time: any;
  start_time: any;
  endTime: any;
  startTime: any;
  created_at: any;
  cancellation_period :any;
  department: any = [];
  description: any;
  positions: any = [];
  certification: any = [];
  // is_urgent: any;
  delay: any;
  additional_note: string;
  overtime: number;
  spread_hourly_rate:number
  for_cp: any;
  shiftID: any;
  shiftCommunication: any;
  community: any;
  community_name: any;
  position: any = [];
  cmntId: any;
  hideTbl: boolean = false;
  chngCommntyList: any = []
  data: any;
  rows1: any[];
  submit: any;
  dt_tm: any = []
  dt_tm1: any = []
  user = new shift();
  shiftType: any = '';
  prmsUsrId: any;
  edtShftVal: any = []
  srtDt: any;
  srtDt2: any;
  enDt: any;
  enDt2: any;
  duration: string;
  breakTime: any;
  dsblEnddt: boolean = true
  agcy_app_rate: any;
  rate_type: any;
  certificationDpw: any;
  departmentDpw: any;
  positionDpw: any;
  roleData: any=[];
  roleData1: any=[];
  roleData2: any=[];
  shortBreak: any[]=[];
  allCommunity1: any;
  for_cpCheck: any;
  nonsubmit: boolean=false;
  flaghorlyhate: any;
  spread_rate: boolean;

  constructor(
    private tost: ToastrManager,
    private dataService: DataService,
    private _authenticationService: AuthenticationService,
    private aCtRoute: ActivatedRoute,
    private loct: Location,
    private positionService : PositionService,
    private departmentService : DepartmentService,
    private certificationService : CertificationService,
    private _router: Router,
    private DatePipe: DatePipe
  ) {
    let d = new Date();
    this.today = this.DatePipe.transform(d,'yyyy-MM-dd')
    
    this.getRole()
    this._authenticationService.currentUser.subscribe
      (x => {
        this.currentUser = x;
        this.getCommunityBreakSetting();
      }
      );

    
    // this.getCertification()
  }

  goBackShift(){
    this._router.navigate(['/shift','id'])
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.delay = this.shiftId.delay
    }, 1000);
    let today = new Date();
    this.user = new shift()
    this.user.h_m = 'Hours';
    this.contentHeader = {
      headerTitle: 'Edit Shift',
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
            name: 'Shift',
            isLink: true,
            link: '/shift'
          }
        ]
      }
    };
    this.getAgency()
  }


  getMngComunity(){
    if(this.currentUser?.id && this.currentUser?.com_id){
      let data = {
        userId : this.currentUser?.id,
        mangId : this.currentUser?.com_id
      }
      this.dataService.getManagementUserCommunities(data).subscribe((res: any) => {
        if (!res.error) {
          let d = res?.body[0].user_added_communities.concat(res?.body[1].userAvailableCommunities);
          // this.mangComs = res.body[1].userAvailableCommunities
          let e=[]
          let c =[]
          d.forEach(element => {
            if(!e.includes(element.community_id)){
              e.push(element.community_id)
              c.push(element)
            }
          });
          this.allCommunity = c.sort(function(a, b){
            if(a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
            if(a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
            return 0;
        })  ;
        } else {
          this.tost.errorToastr(res.msg);
        }
      },
        (err) => {
          this.dataService.genericErrorToaster();
        })
    }
    else{
      this.dataService.getMNMGcommunity(this.currentUser?.id).subscribe((response: any) => {
        if (response['error'] == false) {
          this.allCommunity = response.body.sort(function(a, b){
            if(a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
            if(a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
            return 0;
        })  ;
        } else if (response['error'] == true) {
          this.tost.errorToastr(response.msg);
        }
      }, (err) => {
        this.dataService.genericErrorToaster();
  
      })
    }
  }

  getCommunityId() {
    this.dataService.getCommunityId().subscribe((response: any) => {
      if (response['error'] == false) {
        this.allCommunity = response.body.sort(function(a, b){
          if(a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
          if(a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
          return 0;
      })  ;;;
        //this.toastr.successToastr(response.msg);
      } else if (response['error'] == true) {
        this.tost.errorToastr(response.msg);
      }
    }, (err) => {
      this.dataService.genericErrorToaster();

    })
    // this.allCommunity = [].concat(this.allCommunity);

  }



  EditShift(row: any) {
    this.getData()
   this.currenUserId.user_role == 8 || this.currentUser?.user_role == 3 ? this.getMngComunity() : this.getCommunityId()
    this.shiftId = row
    this.shiftID = row.id
    this.getDrton()
    this.dataService.getshiftById(row.id).subscribe((res: any) => {
      if (!res.error) {
        this.edtShftVal = res.body[0]        
        this.cmntyCng(this.edtShftVal.community_id)
        let sd = moment.unix(this.edtShftVal?.start_time).format("YYYY-MM-DD HH:mm")
        let ed = moment.unix(this.edtShftVal?.end_time).format("YYYY-MM-DD HH:mm")
        this.dt_tm = ed.split(" ");
        this.dt_tm1 = sd.split(" ");
        this.end_time = this.dt_tm[0]
        this.start_time = this.dt_tm1[0]
        this.endTime = this.dt_tm[1]
        this.startTime = this.dt_tm1[1]
        this.created_at = moment(this.edtShftVal.created_at).format("dddd, MMMM Do YYYY, h:mm:ss a");
        this.h_m = this.edtShftVal.h_m;
        this.description = this.edtShftVal.description
        this.community_name = this.shiftId.community_name
        // let departmentArr = this.departmentVal.filter(d => d.name === this.shiftId.department);
        // let positionArr = this.positionVal.filter(p => p.name === this.shiftId.positions);
        // let certificationArr = this.certificationVal.filter(c => c.name === this.shiftId.certification);
        this.department = this.edtShftVal.department
        this.rate_type = this.edtShftVal.rate_type
        this.agcy_app_rate = this.edtShftVal.agcy_app_rate
        this.position = this.edtShftVal.positions
        this.certification = this.edtShftVal.certification
        this.overtime = this.edtShftVal.overtime
        this.spread_hourly_rate = this.edtShftVal.spread_hourly_rate
        this.additional_note = this.edtShftVal.additional_note
        // this.cancellation_period = this.edtShftVal.cancellation_period
        // this.is_urgent = this.edtShftVal.is_urgent
        // let delayArr = this.Hours.filter(d => d.hour == this.shiftId.delay);
        this.delay = this.edtShftVal.delay
        this.for_cp = this.edtShftVal.for_cp
        this.for_cpCheck = this.edtShftVal.for_cp
        this.for_cp = this.edtShftVal.for_cp
        setTimeout(() => {
          let cmntyName = this.currentUser?.role == 'Admin' ? this.mngmCommunity.filter(c => c.cp_id == this.edtShftVal.community_id) : this.allCommunity.filter(c => c.community_name == this.edtShftVal.community_name) ;
          // let cmntyName2 = this.currentUser?.role == 'SuperAdmin' ? this.allCommunity.filter(c => c.community_name === this.edtShftVal.community_name) : this.allCommunity.filter(c => c.community_name === this.edtShftVal.community_name);
          this.community =   this.currentUser?.role == 'Admin' ? cmntyName[0].cp_id : cmntyName[0].id
        }, 200);

      }
    },
      (err) => {
        this.dataService.genericErrorToaster()
      })
  }

  addForm() {
    if (!this.for_cp || !this.description
      || !this.delay || !this.h_m || !this.start_time
      || !this.end_time || !this.certification
      || !this.position || !this.department
      || !this.overtime || !this.agcy_app_rate || !this.rate_type
    ) {
      this.tost.errorToastr('Edit is invalid')
      return;
    }
    let date1 = moment(new Date(this.start_time + ' ' + this.startTime)).utc().unix()
    let date2 = moment(new Date(this.end_time + ' ' + this.endTime)).utc().unix()
    if (date1 >= date2) {
      this.tost.errorToastr('End date and time is greater then start date and time')
      return;
    }
    else if ((this.for_cp == '2' || this.for_cp == '0') ) {
      if(!this.agcy_app_rate || this.agcy_app_rate == 'undefined'){
        this.nonsubmit = true
        this.agcy_app_rate = 'undefined'
        return
      }
      else{
        this.submit = false
        this.nonsubmit = false

      }
      // !this.agcy_app_rate
      // this.tost.errorToastr('Agency Applicable Rates ')
      // return;
    } else{
      this.submit = false
      this.nonsubmit = true;
    }
    this.data = {
      department: this.department,
      description: this.description,
      position: this.position,
      certification: this.certification,
      agcy_app_rate: this.agcy_app_rate,
      rate_type: this.rate_type,
      shift: 'Confirmation',
      // is_urgent: this.is_urgent,
      // cancellation_period: this.cancellation_period,
      delay: this.delay,
      overtime: this.overtime,
      spread_hourly_rate: this.spread_hourly_rate ?? '',
      additional_note: this.additional_note,
      for_cp: this.for_cp,
      h_m: this.h_m,
      start_time: this.cnvrtnewDt(this.start_time + ' ' + this.startTime),
      end_time: this.cnvrtnewDt(this.end_time + ' ' + this.endTime),
      // community: this.currentUser?.role == 'Community' ? this.currenUserId :  this.community,
      community_id: this.currentUser?.role == 'Admin' || this.currentUser?.role == 'SuperAdmin' || this.currentUser?.user_role == 8 ? this.community : this.currentUser?.user_role == 4 ? this.currentUser?.com_id: this.currentUser?.id,
      // community_id: this.community,
      id: this.shiftID,
      breakTime: this.breakTime,
      // community: this.currentUser?.role == 'Community' ? this.currenUserId : this.currentUser?.role == 'SuperAdmin' ? this.currenUserId : this.community
    }
    this.dataService.editshift(this.data).subscribe((res: any) => {
      if (!res.error) {
        this.tost.successToastr(res.msg)
        this.rows1 = []
        this.loct.back()
      }
    },
      (err) => {
        this.dataService.genericErrorToaster()
      })
  }

  getData() {
    this.dataService.getMNMGcommunity(this.currentUser?.id).subscribe(res => {
      if (!res.error) {
        this.rows1 = res.body.sort(function(a, b){
          if(a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
          if(a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
          return 0;
      })  ;;;
        this.rows1.forEach(element => {
          this.mngmCommunity.push(element)
        });
        this.mngmCommunity = [].concat(this.mngmCommunity);
      }
    });

  }

  compareDates(dates: any){
    let currentDate =moment().utc().unix();
    let hour = dates.h_m == "Hours" ? "hour" : "minute";
    let shiftStartTime:any = moment(dates.created_at).add(
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

  cnvrtnewDt(date_tm) {
    return new Date(date_tm)
  }

  getTm1(e) {
    this.srtDt = e    
    if(this.startTime){
      this.endTime = ''
      this.end_time = ''
      this.startTime = ''
    }else{
      this.endTime = ''
      this.end_time = ''
    }
    
    this.duration = ''
    this.dsblEnddt = false
    this.getDrton2()
  }
  getTm2(e) {
    this.srtDt2 = e
    this.duration = ''
    this.getDrton2()
  }
  getTm3(e) {
    this.enDt = e
    this.duration = ''
    this.getDrton2()
  }
  getTm4(e) {
    this.enDt2 = e
    this.duration = ''
    this.getDrton2()
  }
  getDrton() {
    let end_time = moment.unix(this.shiftId.end_time).format("YYYY-MM-DD HH:mm")
    let start_time = moment.unix(this.shiftId.start_time).format("YYYY-MM-DD HH:mm")
    if (start_time >= end_time) {
      this.tost.errorToastr('End date and time is greater then start date and time')
      return;
    }
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
      this.duration = hours + ' hour and ' + minutes + ' minutes.';
      this.breakTime = this.findBreakTime(hours,minutes)

    }
  }

  getDrton2() {

    let timeStart = new Date(this.srtDt + ' ' + this.srtDt2).getTime();
    let timeEnd = new Date(this.enDt + ' ' + this.enDt2).getTime();
    let hourDiff = timeEnd - timeStart; //in ms
    // let secDiff = hourDiff / 1000;
    let minDiff = hourDiff / 60 / 1000; //in minutes
    let hDiff = hourDiff / 3600 / 1000; //in hours
    let hours = Math.floor(hDiff);
    let minutes = minDiff - 60 * hours;
    if (!isNaN(hours) && !isNaN(minutes)) {
      this.duration = hours + ' hour and ' + minutes + ' minutes.';
      this.breakTime = this.findBreakTime(hours,minutes)
      
    }
  }

  goBack(){
    this.loct.back()
  }

  // getCertification(){
  //   let isf = ''
  //   this.certificationService.getCertificationListing(this.currentUser?.id).subscribe((res:any)=>{
  //     this.certificationDpw = res.body.sort(function(a, b){
  //       if(a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
  //       if(a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
  //       return 0;
  //   })  ;
  //   })
  //   this.departmentService.getDepartmentListing(this.currentUser?.id,isf).subscribe((res:any)=>{
  //     this.departmentDpw = res.body.sort(function(a, b){
  //       if(a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
  //       if(a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
  //       return 0;
  //   })  ;
  //   })
  //   this.positionService.getPosition(this.currentUser?.id).subscribe((res:any)=>{
  //     this.positionDpw = res.body.sort(function(a, b){
  //       if(a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
  //       if(a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
  //       return 0;
  //   })  ;
  //   })
  //  }

   cmntyCng(e){
    let str = e?.target?.value || e
    let words = e?.target?.value ? str.split(' ') : str;
    let isf = 6
    let data = {usrRole : '', comId : this.currentUser?.prmsnId == '6' || this.currentUser?.user_role == 8 ? (words.length ==2 ?  words[1] : words) : this.roleData2.includes(this.currentUser?.prmsnId) ? this.currentUser?.com_id  : this.currentUser?.id }
    this.departmentService.getDepartmentListing( e?.target?.value ? words[1] :str ,isf).subscribe((res:any)=>{
      this.departmentDpw = res.body.sort(function(a, b){
        if(a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
        if(a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
        return 0;
    })  ;
    },err=>{
      this.tost.errorToastr('Something went wrong please try again leter')
    })

    this.certificationService.getCertificationListing(data).subscribe((res:any)=>{
      this.certificationDpw = res.body.sort(function(a, b){
        if(a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
        if(a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
        return 0;
    })  ;
    })

    this.positionService.getPosition(e?.target?.value ? words[1] :str ).subscribe((res:any)=>{
      this.positionDpw = res.body.sort(function(a, b){
        if(a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
        if(a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
        return 0;
    })  ;
    })
  }
  getCommunityBreakSetting(){
 
    this.dataService.getCommunityBreakSetting(this.currentUser?.id).subscribe((res: any) => {
      if (!res.error) {
        if(res?.body[0]?.variance_val){
          let d= JSON.parse(res.body[0]?.variance_val)
              this.shortBreak = JSON.parse(d).map(i=>{i.editing=false; return i;});
        }
        this.aCtRoute.params.subscribe(
          res => {
            this.prmsUsrId = res
            this.EditShift(this.prmsUsrId)
          }
        ) 
              
    }
    },
      (err) => {
        this.dataService.genericErrorToaster();
  
      })
  }

  getRole(){
    this.dataService.getAllRole().subscribe((res:any)=>{
      if(!res.err){
         res.body.filter(i=>{ this.roleData.push(i.id.toString())})
              this.roleData.map(i=>{
               if(i != 2  && i != 3 && i != 4  && i != 5 && i != 6 ){
                 this.roleData1.push(i)
               }
               if(i != 1 && i != 2 && i != 3  && i != 4 && i != 5 && i != 6 ){
                this.roleData2.push(i)
              }
              })
              
      }
    },err=>{
      this.dataService.genericErrorToaster()
    })
  }
  findBreakTime(hours,min){
    if(this.shortBreak.length)
    if(hours < 1 && min < 59){
      return this.shortBreak[0].value
    }else if(hours < 2 && hours >= 1 && min < 59){
      return this.shortBreak[1].value
    }else if(hours < 3 && hours >= 2 && min < 59){
      return this.shortBreak[2].value
    }else if(hours < 4 && hours >= 3 && min < 59){
      return this.shortBreak[3].value
    }else if(hours < 5 && hours >= 4 && min < 59){
      return this.shortBreak[4].value
    }else if(hours < 6 && hours >= 5 && min < 59){
      return this.shortBreak[5].value
    }else if(hours < 7 && hours >= 6 && min < 59){
      return this.shortBreak[6].value
    }else{
      return this.shortBreak[7].value
    }

  }
  getAgency(){
    this.dataService.getAllAgenciesType(this.currentUser.user_role == 4 ? this.currentUser.com_id : this.currentUser.id).subscribe(res=>{
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

}
