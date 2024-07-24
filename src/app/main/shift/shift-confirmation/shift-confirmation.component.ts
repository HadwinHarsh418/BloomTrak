import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { shift, User } from 'app/auth/models';
import { AuthenticationService, UserService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { Page } from 'app/utils/models';
import moment from 'moment';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrManager } from 'ng6-toastr-notifications';
import {Location} from '@angular/common';
import { CertificationService } from 'app/main/certification/certification.service';
import { DepartmentService } from 'app/main/department/department.service';
import { PositionService } from 'app/main/position/position.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-shift-confirmation',
  templateUrl: './shift-confirmation.component.html',
  styleUrls: ['./shift-confirmation.component.scss']
})
export class ShiftConfirmationComponent implements OnInit {
  @ViewChild('createnew') createnew: ElementRef<any>;
  @ViewChild('createnewdublication') createnewdublication: ElementRef<any>;
  @ViewChild('createnewadd') createnewadd: ElementRef<any>;
  public rows: any
  public page = new Page();
  public contentHeader: object;
  user = new shift();
  blankArray: any[] = [];
  mngmCommunity: any[] = [];
  btnShow: boolean;
  submit: boolean = false
  todaysDate: any;
  shiftDates: boolean = false;
  shiftduration : any;
  
  dropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'value',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    closeDropDownOnSelection: true,
    allowSearchFilter: true
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
    closeDropDownOnSelection: true,
    itemsShowLimit: 3,
    allowSearchFilter: true
  };
  dropdownSettings3: IDropdownSettings = {
    singleSelection: true,
    idField: 'id',
    textField: 'community_name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    closeDropDownOnSelection: true,
    allowSearchFilter: true
  };

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

  cancellation_period: any = [
    { hour: '02' },
    { hour: '03' },
    { hour: '04' },
    { hour: '06' },
    { hour: '12' },
    { hour: '24' },
  ]

  pickupSteps = {
    pickuploaction: null,
    pickedSpot: null,
    pickedCity: null,
    pickedCityId: '',
    latitude: '',
    longitude: '',
    availableLocs: [],
    picupDateTime: null,
    dropoffDateTime: null,
    currentStep: 1,
  }


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
  data: any;
  currentUser: User;
  minDate: string;
  date1: Date;
  srtDt: any = []
  endDt: any = []
  allCommunity: any = [];
  department: any = [{name:'Activities',value:'Activities'},{name:'Business Office',value:'Business Office'},{name:'Dining',value:'Dining'},{name:'Environmental Services',value:'Environmental Services'},{name:'Health & Wellness',value:'Health & Wellness'},{name:'Housekeeping',value:'Housekeeping'},{name:'Laundry',value:'Laundry'}]
  position: any = [{name:'Concierge',value:'Concierge'},{name:'Cook',value:'Cook'},{name:'Dining Concierge',value:'Dining Concierge'},{name:'Direct Care Aide',value:'Direct Care Aide'},{name:'Dishwasher/Dining Aide',value:'Dishwasher/Dining Aide'},{name:'Housekeeper',value:'Housekeeper'},{name:'Laundry Aide',value:'Laundry Aide'},{name:'Maintenance Assistant',value:'Maintenance Assistant'},{name:'Registered Medication Aide/AMAP',value:'Registered Medication Aide/AMAP'},{name:'Shift Supervisor',value:'Shift Supervisor'}]
  certification: any = [{name:'Direct Care Aide',value:'Direct Care Aide'},{name:'Licensed Practical Nurse',value:'Licensed Practical Nurse'},{name:'Registered Medication Aide',value:'Registered Medication Aide'},{name:'Registered Nurse',value:'Registered Nurse'},{name:'Serve Safe Certified'}]
  srtDt1: any;
  srtDt2: any;
  enDt: any;
  enDt2: any;
  hours: number;
  rows1: any =[]
  searchStr: string;
  page1: string;
  page2: number;
  delay: number;
  additional_note: string;
  overtime: number;
  spread_hourly_rate:number;
  chngCommntyList: any =[]
  certificationDpw: any;
  departmentDpw: any;
  positionDpw: any;
  rate_type: any;
  agcy_app_rate: any;
  updtDate: any;
  roleData: any=[];
  roleData1: any=[];
  roleData2: any=[];
  shortBreak: any;
  allCommunity1: any;
  str: any;
  typ_shift_length: any;
  durationflag: boolean = false;
  shiftlength: number;
  shifttime: number;
  datedisable: boolean;
  disableInput: boolean = true;
  flaghorlyhate: any;
  spread_rate: boolean;

  constructor(
    private tost: ToastrManager,
    private api: UserService,
    private rout: Router,
    private dataService: DataService,
    private _authenticationService: AuthenticationService,
    private location : Location,
    private certificationService:CertificationService,
    private departmentService:DepartmentService,
    private positionService:PositionService,
    private dp : DepartmentService,
    private modalService: NgbModal,
  ) {
    this._authenticationService.currentUser.subscribe
      (x => {
        this.currentUser = x
      }
      );
      this.getCommunityBreakSetting()
  }

  // updateDate(event, index, type) {
  //   if(type == 'start-shift'){
  //     this.blankArray[index].start_date = event;
  //       this.getTm1(this.blankArray[index].start_date,index)
  //       this.disableInput=false
  //   }else{
  //     this.blankArray[index].end_date = event;
  //       this.getTm3(this.blankArray[index].end_date,index)
  //   }  }

 
  ngOnInit(): void {
    this.getAgency()
    this.certificationDpw=[];
    this.getuserDetails()
    this.positionDpw=[]
    this.getRole()
    if(this.currentUser.user_role != '6' && this.currentUser.user_role != '3' && this.currentUser.user_role != 4){
      this.getCertification();
      this.getPosition()
    }
    if(this.currentUser?.user_role !='4'&& this.currentUser?.user_role !='2' && this.currentUser?.user_role !='5')
    this.getDepartment()
   this.currentUser?.user_role != 3 && this.currentUser?.user_role != 8 ? this.getData() : '';
   this.currentUser?.user_role == 8 || this.currentUser?.user_role == 3 ? this.getMngComunity() : this.getCommunityId()
    let today = new Date();
    // this.todaysDate = { day: today.getDate(), month: today.getMonth() + 1, year: today.getFullYear() };
    // this.todaysDate = this.todaysDate.year  + '-' +  this.todaysDate.month +'-' +   this.todaysDate.day
    this.user = new shift()
    //  this.user.start_date =  this.todaysDate
    this.user.h_m = 'Hours';
    this.user.overtime = '0';
    this.user.rate_type = 'Normal';
    // this.user.is_urgent = 'urgent';
    this.todaysDate = this.getDate(today)
    
    
    this.blankArray.push(this.user)
    this.contentHeader = {
      headerTitle: 'Add Shift ',
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
            name: 'Shift ',
            isLink: true,
            link: '/shift'
          }
        ]
      }
    };

  }

  goBackShift(){
    this.rout.navigate(['/shift','id'])
  }

 getCertification(){
  let isf = ''
  let data = {usrRole : this.currentUser?.prmsnId == '6' ? '6' : '', comId : this.currentUser?.prmsnId == '6' ? '' : this.roleData2.includes(this.currentUser?.prmsnId) ? this.currentUser?.com_id  : this.currentUser?.id }
  this.certificationService.getCertificationListing(data).subscribe((res:any)=>{
    this.certificationDpw = res.body.sort(function(a, b){
      if(a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
      if(a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
      return 0;
  })  ;
  })
  // this.departmentService.getDepartmentListing(this.roleData2.includes(this.currentUser?.prmsnId) ? this.currentUser?.com_id :this.currentUser?.id,isf).subscribe((res:any)=>{
  //   this.departmentDpw = res.body.sort(function(a, b){
  //     if(a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
  //     if(a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
  //     return 0;
  // })  ;
  // })
  
 }
 
 getPosition(){
  let community_id= this.currentUser?.user_role == 4 ? this.currentUser?.com_id : this.currentUser?.id
  
  this.positionService.getPosition(community_id).subscribe((res:any)=>{
    this.positionDpw = res.body.sort(function(a, b){
      if(a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
      if(a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
      return 0;
  })  ;
  })
 }

  getData()
  {
    this.dataService.getMNMGcommunity(this.currentUser?.id).subscribe(res => {
      if (!res.error) {
        this.rows1 = res.body.sort(function(a, b){
          if(a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
          if(a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
          return 0;
      })  ;
        this.rows1.forEach(element => {
            this.mngmCommunity.push(element)
        });
        this.mngmCommunity = [].concat(this.mngmCommunity);
      }
    });

  }


  getTm1(e,i) {
    this.srtDt = e
   this.getDrton(i)
  }
  getTm2(e,i) {
    this.srtDt2 = e
   this.getDrton(i)
  }
  getTm3(e,i) {
    this.enDt = e
   this.getDrton(i)
  }
  getTm4(e,i) {
    this.enDt2 = e
   this.getDrton(i)
  }

  getDrton(i){
      let timeStart = new Date(this.srtDt + ' ' + this.srtDt2).getTime();
      let timeEnd = new Date(this.enDt + ' ' + this.enDt2).getTime();
      let hourDiff = timeEnd - timeStart; //in ms
      // let secDiff = hourDiff / 1000;
      let minDiff = hourDiff / 60 / 1000; //in minutes
      let hDiff = hourDiff / 3600 / 1000; //in hours
      let hours = Math.floor(hDiff);
     let minutes = minDiff - 60 * hours;
     if(!isNaN(hours) && !isNaN(minutes)){
         this.blankArray[i].duration = hours + ' hour and ' + minutes + ' minutes.'
         this.blankArray[i].breakTime = this.findBreakTime(hours,minutes)
         
     }
     if(!isNaN(hours) && !isNaN(minutes)){
     this.shiftduration = hDiff
     }
     
  }
  getCommunityBreakSetting(){
 
    this.dataService.getCommunityBreakSetting(this.currentUser?.id).subscribe((res: any) => {
      if (!res.error) {
        if(res?.body[0]?.variance_val){
          let d= JSON.parse(res?.body[0]?.variance_val)
              this.shortBreak = JSON.parse(d).map(i=>{i.editing=false; return i;});
        }
            
      }
    },
      (err) => {
        this.dataService.genericErrorToaster();
  
      })
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
      })  ;
        //this.toastr.successToastr(response.msg);
      } else if (response['error'] == true) {
        this.tost.errorToastr(response.msg);
      }
    }, (err) => {
      this.dataService.genericErrorToaster();

    })
    this.allCommunity = [].concat(this.allCommunity);

  }

  submitted(d?:any) {    
    this.data = [];
    for (let x = 0; x < this.blankArray.length; x++) {
      this.blankArray[x].shift = 'confirmation'

      if (!this.blankArray[x].for_cp 
        || !this.blankArray[x].delay 
        || !this.blankArray[x].h_m || !this.blankArray[x].startTime || !this.blankArray[x].description
        || !this.blankArray[x].endTime
        || !this.blankArray[x].end_date || !this.blankArray[x].overtime || this.spread_rate ? !this.blankArray[x].spread_hourly_rate : this.blankArray[x].spread_hourly_rate || !this.blankArray[x].rate_type || !this.blankArray[x].certification
      ) {
        this.submit = true
        this.tost.errorToastr('Form is invalid')
        return;
      }
       if ((this.blankArray[x].for_cp == '2' || this.blankArray[x].for_cp == '0') ) {
        if(!this.blankArray[x].agcy_app_rate || this.blankArray[x].agcy_app_rate  == 'undefined'){
          this.submit = true
          this.blankArray[x].agcy_app_rate = 'undefined'
          return
        }
        else{
          this.submit = false
        }
        // !this.blankArray[x].agcy_app_rate
        // this.tost.errorToastr('Agency Applicable Rates ')
        // return;
      } else{
        this.submit = true
        this.blankArray[x].agcy_app_rate = 'undefined'
      }
      // if(this.blankArray[x].startTime.getTime() < this.blankArray[x].endTime.getTime() ){
      //   this.tost.errorToastr('End time is greater then start time')
      //   return;
      // }
      this.data.push({
        // title: this.blankArray[x].title,
        description: this.blankArray[x].description,
        certification: this.blankArray[x].certification,
        shift: this.blankArray[x].shift,
        // is_urgent: this.blankArray[x].is_urgent,
        // cancellation_period: this.blankArray[x].cancellation_period,
        delay: this.blankArray[x].delay,
        additional_note : this.blankArray[x].additional_note,
        overtime: this.blankArray[x].overtime ,
        spread_hourly_rate: this.blankArray[x].spread_hourly_rate ?? '' ,
        for_cp: this.blankArray[x].for_cp,
        rate_type: this.blankArray[x].rate_type,
        agcy_app_rate: this.blankArray[x].agcy_app_rate,
        h_m: this.blankArray[x].h_m,
        department: this.blankArray[x].department,
        position: this.blankArray[x].position,
        start_time: this.cnvrtnewDt(this.blankArray[x].start_date + ' ' + this.blankArray[x].startTime),
        end_time: this.cnvrtnewDt(this.blankArray[x].end_date + ' ' + this.blankArray[x].endTime),
        community_id: this.currentUser?.role == 'Admin' || this.currentUser?.user_role == 8 ? this.blankArray[x].community :  this.currentUser?.role == 'SuperAdmin' ? this.blankArray[x].community : this.currentUser?.prmsnId == '15' ? this.currentUser?.com_id : this.currentUser?.user_role == 4 ? this.currentUser?.com_id : this.currentUser?.id,
        breakTime:this.blankArray[x].breakTime ?? 0
      })
    }
    let date1 = moment(new Date(this.data[0].start_time)).utc().unix()
    let date2 = moment(new Date(this.data[0].end_time)).utc().unix()
     let updtSrt = this.data[0].start_time.setHours(this.data[0].start_time.getHours() );
     let crntDate = new Date()
     let dl = this.data[0].delay == '01' ? 1 : this.data[0].delay == '06' ? 6 : 
    Number( this.data[0].delay)
    if(this.data[0].h_m == 'Minutes'){
      this.updtDate =  crntDate.setMinutes(crntDate.getMinutes() + dl );
    }else{
      this.updtDate =  crntDate.setHours(crntDate.getHours() + dl );
    }
    
    if(this.durationflag == false && !d){
      if(this.shiftduration > this.shiftlength){
        this.modalOpenOSE(this.createnew, 's');
        return
      }
  }

    if (date1 >= date2) {
      this.tost.errorToastr('End Date and Time must be after Start Date and Time')
      return
    }
    if (this.updtDate > updtSrt) {
      this.tost.errorToastr('Your Delay Period ends on or after the shift start time')
      return
    }
    this.api.addshift(this.data).subscribe((res) => {
      if (!res.error) {
        this.tost.successToastr(res.msg)
        this.rows1 = []
      }
    },
      (err) => {
        this.dataService.genericErrorToaster()
      })
    this.rout.navigate(['/shift'])
  }

  addForm(d?:any) {
    for (let x = 0; x < this.blankArray.length; x++) {
      if (!this.blankArray[x].for_cp ||
        !this.blankArray[x].description
        || !this.blankArray[x].delay 
        || !this.blankArray[x].h_m || !this.blankArray[x].startTime
        || !this.blankArray[x].endTime || !this.blankArray[x].overtime  || this.spread_rate == true ? !this.blankArray[x].spread_hourly_rate : this.blankArray[x].spread_hourly_rate || !this.blankArray[x].rate_type
      ) {
        this.tost.errorToastr('Form is invalid')
        this.rows1 = []
        return;
      }
      if ( this.blankArray[x].for_cp == '2' || this.blankArray[x].for_cp == '0'
      ) {
        if(!this.blankArray[x].agcy_app_rate  || this.blankArray[x].agcy_app_rate == 'undefined'){
          this.submit = true
          this.blankArray[x].agcy_app_rate = 'undefined'
          this.rows1 =[]
          return
        }
        else{
          this.submit = false
        }
      }
      else{
        this.submit = false
        this.blankArray[x].agcy_app_rate = 'undefined'
      }
      let start_time = this.cnvrtnewDt(this.blankArray[x].start_date + ' ' + this.blankArray[x].startTime)
      let updtstart_time =  start_time.setHours(start_time.getHours() );
      let end_time = this.cnvrtnewDt(this.blankArray[x].end_date + ' ' + this.blankArray[x].endTime)
      let date1 = moment(new Date(start_time)).utc().unix()
      let date2 = moment(new Date(end_time)).utc().unix()
      let crntDate = new Date()
      let dl = this.blankArray[x].delay == '01' ? 1 : this.blankArray[x].delay == '06' ? 6 : 
      Number( this.blankArray[x].delay)
      if(this.blankArray[x].h_m == 'Minutes'){
        this.updtDate =  crntDate.setMinutes(crntDate.getMinutes() + dl );
      }else{
        this.updtDate =  crntDate.setHours(crntDate.getHours() + dl );
      }
      
      if (date1 > date2) {
        this.tost.errorToastr('End Date and Time must be after Start Date and Time')
        return
      }
      if (this.updtDate > updtstart_time) {
        this.tost.errorToastr('Your Delay Period ends on or after the shift start time')
        return
      }
      if(this.durationflag == false && !d){
        if(this.shiftduration > this.shiftlength){
          this.modalOpenOSE(this.createnewadd, 's');
          return
        }
    }
    }
    this.user = new shift()
    this.user.h_m = 'Hours';
    this.user.overtime = '0';
    this.user.rate_type = 'Normal';
    // this.user.is_urgent = 'standard';
    this.blankArray.push(this.user);
    this.enDt2 = ''
    this.enDt = ''
    this.srtDt = '' 
      this.srtDt2 = ''
      this.rows1 = []


  }

  duplctSft(d? : any){
    let dup =   JSON.parse(JSON.stringify(this.blankArray[this.blankArray.length-1]))
    if (!dup.for_cp || !dup.description
      || !dup.delay || !dup.h_m || !dup.startTime
      || !dup.endTime || !dup.overtime || !dup.rate_type || this.spread_rate == true ? !dup.spread_hourly_rate : dup.spread_hourly_rate
    ) {
      this.tost.errorToastr('Form is invalid')
      return;
    }
     if ((dup.for_cp == '2' || dup.for_cp == '0') ) {
      if(!dup.agcy_app_rate || dup.agcy_app_rate == 'undefined'){
        this.submit = true
        this.blankArray[this.blankArray.length-1].agcy_app_rate = 'undefined'
        return
      }
      else{
        this.submit = false
      }
    }
    let start_time = this.cnvrtnewDt(dup.start_date + ' ' + dup.startTime)
    let updtstart_time =  start_time.setHours(start_time.getHours() );
    let end_time = this.cnvrtnewDt(dup.end_date + ' ' + dup.endTime)
    let date1 = moment(new Date(start_time)).utc().unix()
    let date2 = moment(new Date(end_time)).utc().unix()
    let crntDate = new Date()
    let dl = dup.delay == '01' ? 1 : dup.delay == '06' ? 6 : 
    Number( dup.delay)
    if(dup.h_m == 'Minutes'){
      this.updtDate =  crntDate.setMinutes(crntDate.getMinutes() + dl );
    }else{
      this.updtDate =  crntDate.setHours(crntDate.getHours() + dl );
    }
    
    if (date1 > date2) {
      this.tost.errorToastr('End Date and Time must be after Start Date and Time')
      return
    }
    if (this.updtDate > updtstart_time) {
      this.tost.errorToastr('Your Delay Period ends on or after the shift start time')
      return
    }

    if(this.durationflag == false && !d){
      if(this.shiftduration > this.shiftlength){
        this.modalOpenOSE(this.createnewdublication, 's');
        return
      }
  }

    this.blankArray.push(dup);
  }

  // setPickupDateTime() {
  //   for (let x = 0; x < this.blankArray.length; x++) {
  //     if (!this.blankArray[x].startTime) {
  //       this.blankArray[x].startTime = this.getCurrentHours();
  //     }
  //     let dt = new Date()
  //     let selectedDate = new Date(this.blankArray[x].start_date.year, this.blankArray[x].start_date.month - 1, this.blankArray[x].start_date.day);
  //     if (selectedDate.setHours(0, 0, 0, 0) == dt.setHours(0, 0, 0, 0)) {
  //       if (!this.shiftDates) {
  //         for (let i = 1; i <= 3; i++) {
  //           this.timeslots.shift();
  //         }
  //         this.shiftDates = true;
  //       }
  //     }

  //     // let dt = new Date()
  //     // this.blankArray[x].start_date = { day: dt.getDate(), month: dt.getMonth() + 1, year: dt.getFullYear() }
  //     //   this.blankArray[x].start_date = this.getCurrentHours();
  //     // let selectedDate = new Date(this.blankArray[x].start_date.year, this.blankArray[x].start_date.month - 1, this.blankArray[x].start_date.day);
  //     // if (selectedDate.setHours(0, 0, 0, 0) == dt.setHours(0, 0, 0, 0)) {
  //     //   if (!this.shiftDates) {
  //     //     for (let i = 1; i <= 3; i++) {
  //     //       this.timeslots.shift();
  //     //     }
  //     //     this.shiftDates = true;
  //     //   }
  //     // }
  //     else {
  //       this.shiftDates = false;
  //       this.timeslots = [
  //         { value: { hour: 0, minute: 0 }, label: '00:00', },
  //         { value: { hour: 0, minute: 30 }, label: '00:30', },
  //         { value: { hour: 1, minute: 0 }, label: '01:00', },
  //         { value: { hour: 1, minute: 30 }, label: '01:30', },
  //         { value: { hour: 2, minute: 0 }, label: '02:00', },
  //         { value: { hour: 2, minute: 30 }, label: '02:30', },
  //         { value: { hour: 3, minute: 0 }, label: '03:00', },
  //         { value: { hour: 3, minute: 30 }, label: '03:30', },
  //         { value: { hour: 4, minute: 0 }, label: '04:00', },
  //         { value: { hour: 4, minute: 30 }, label: '04:30', },
  //         { value: { hour: 5, minute: 0 }, label: '05:00', },
  //         { value: { hour: 5, minute: 30 }, label: '05:30', },
  //         { value: { hour: 6, minute: 0 }, label: '06:00', },
  //         { value: { hour: 6, minute: 30 }, label: '06:30', },
  //         { value: { hour: 7, minute: 0 }, label: '07:00', },
  //         { value: { hour: 7, minute: 30 }, label: '07:30', },
  //         { value: { hour: 8, minute: 0 }, label: '08:00', },
  //         { value: { hour: 8, minute: 30 }, label: '08:30', },
  //         { value: { hour: 9, minute: 0 }, label: '09:00', },
  //         { value: { hour: 9, minute: 30 }, label: '09:30', },
  //         { value: { hour: 10, minute: 0 }, label: '10:00', },
  //         { value: { hour: 10, minute: 30 }, label: '10:30', },
  //         { value: { hour: 11, minute: 0 }, label: '11:00', },
  //         { value: { hour: 11, minute: 30 }, label: '11:30', },
  //         { value: { hour: 12, minute: 0 }, label: '12:00', },
  //         { value: { hour: 12, minute: 30 }, label: '12:30', },
  //         { value: { hour: 13, minute: 0 }, label: '13:00', },
  //         { value: { hour: 13, minute: 30 }, label: '13:30', },
  //         { value: { hour: 14, minute: 0 }, label: '14:00', },
  //         { value: { hour: 14, minute: 30 }, label: '14:30', },
  //         { value: { hour: 15, minute: 0 }, label: '15:00', },
  //         { value: { hour: 15, minute: 30 }, label: '15:30', },
  //         { value: { hour: 16, minute: 0 }, label: '16:00', },
  //         { value: { hour: 16, minute: 30 }, label: '16:30', },
  //         { value: { hour: 17, minute: 0 }, label: '17:00', },
  //         { value: { hour: 17, minute: 30 }, label: '17:30', },
  //         { value: { hour: 18, minute: 0 }, label: '18:00', },
  //         { value: { hour: 18, minute: 30 }, label: '18:30', },
  //         { value: { hour: 19, minute: 0 }, label: '19:00' },
  //         { value: { hour: 19, minute: 30 }, label: '19:30' },
  //         { value: { hour: 20, minute: 0 }, label: '20:00' },
  //         { value: { hour: 20, minute: 30 }, label: '20:30' },
  //         { value: { hour: 21, minute: 0 }, label: '21:00' },
  //         { value: { hour: 21, minute: 30 }, label: '21:30' },
  //         { value: { hour: 22, minute: 0 }, label: '22:00' },
  //         { value: { hour: 22, minute: 30 }, label: '22:30' },
  //         { value: { hour: 23, minute: 0 }, label: '23:00' },
  //         { value: { hour: 23, minute: 30 }, label: '23:30' },
  //         { value: { hour: 24, minute: 0 }, label: '24:00' },
  //       ];
  //     }
  //   }
  // }

  closededApply(modal: NgbModalRef) {
    this.durationflag = false;
    modal.dismiss();
  }

  getCurrentHours() {
    for (let x = 0; x < this.blankArray.length; x++) {

      let now = new Date();
      let ch = now.getHours();
      if (ch >= 22) {
        return this.timeslots[this.timeslots.length - 1].label;
      } else if (ch < 10) {
        return this.timeslots[x].label;
      } else {
        let hous = this.timeslots.findIndex(item => item.value.hour == ch);
        if (now.getMinutes() > 30) {
          return this.timeslots[hous + 2].label;
        } else {
          return this.timeslots[hous + 1].label;
        }
      }
    }
  }

  // setDropOffDateTime(addtwo = false) {
  //   for (let x = 0; x < this.blankArray.length; x++) {

  //     if (!this.blankArray[x].endDate) {
  //       let now = new Date();
  //       this.blankArray[x].endDate = { day: now.getDate(), month: now.getMonth() + 1, year: now.getFullYear() }
  //       this.blankArray[x].endDate = this.getCurrentHours();
  //       this.pickupSteps.picupDateTime = new Date(this.blankArray[x].endDate.year, this.blankArray[x].endDate.month - 1, this.blankArray[x].endDate.day);
  //     }
  //     if (!this.blankArray[x].endTime) {
  //       this.blankArray[x].endTime = this.getCurrentHours();
  //       this.pickupSteps.dropoffDateTime = new Date(this.blankArray[x].endDate.year, this.blankArray[x].endDate.month - 1, this.blankArray[x].endDate.day)
  //     }
  //   }

  // }

  removeCard(i) {
    this.blankArray.splice(i,1)
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

  cnvrtnewDt(date_tm) {
    return new Date(date_tm)
  }

  goBack(){
    this.location.back();
  }
  getDepartment(){
    // if(this.currentUser?.prmsnId == '6'){
      let  isf= ''
      this.departmentService.getDepartmentListing(this.currentUser?.user_role == '4' ? this.currentUser?.com_id : this.currentUser?.id,this.currentUser?.user_role == '4' ? 'community' : '6').subscribe((res:any)=>{
        this.departmentDpw = res.body.sort(function(a, b){
          if(a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
          if(a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
          return 0;
      });
      },err=>{
        this.tost.errorToastr('Something went wrong please try again leter')
      })
    // }
   
 
  }
  cmntyCng(e){
    this.str = e
    console.log(this.str);
    
    let words = this.str.split(' ');
    let isf = 6
    let community_id= this.currentUser?.user_role == 4 ? this.currentUser?.com_id : this.currentUser?.id

    let data = {usrRole :'' , comId : community_id }
    this.dp.getDepartmentListing(words[1],isf).subscribe((res:any)=>{
      this.departmentDpw = res.body.sort(function(a, b){
        if(a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
        if(a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
        return 0;
    })  ;
    },err=>{
      this.tost.errorToastr('Something went wrong please try again leter')
    })
    let data1 = {usrRole : this.currentUser?.prmsnId == '6' ? '6' : '', comId : this.currentUser?.prmsnId == '6' || this.currentUser?.user_role == 8 ? words[1] : this.roleData2.includes(this.currentUser?.prmsnId) ? this.currentUser?.com_id : this.currentUser?.user_role == 3 ? words[1] : this.currentUser?.id }
    this.certificationService.getCertificationListing(data1).subscribe((res:any)=>{community_id
      this.certificationDpw = res.body.sort(function(a, b){
        if(a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
        if(a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
        return 0;
    })  ;
    })

    this.positionService.getPosition(words[1]).subscribe((res:any)=>{
      this.positionDpw = res.body.sort(function(a, b){
        if(a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
        if(a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
        return 0;
    })  ;
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
              this.getPermissionByAdminRole()
      }
    },err=>{
      this.dataService.genericErrorToaster()
    })
  }

  getPermissionByAdminRole() {
    this.dataService.getPermissionByAdminRole().subscribe(
      res => {
        if (!res.error) {
          res.body.filter(i=>{
            if(i.permission_name == 'Department' && this.currentUser?.user_role != 6 && this.currentUser?.user_role != 1){
              // if((i.trak_type == '1'|| i.trak_type == null && this.currentUser?.role !='Community')){
              if((i.trak_type == '1')){
                
                this.departmentDpw=JSON.parse(i.row_data);
                this.departmentDpw =  this.departmentDpw.sort(function(a, b){
                  if(a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
                  if(a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
                  return 0;
              });
              }
           }
           if(i.permission_name == 'Certification' && i.trak_type =='1'){
            i.view_permission == '1' ? this.getCertification() : ''
           }
           if(i.permission_name == 'Position' && i.trak_type =='1'){
            i.view_permission == '1' ? this.getPosition() : ''
           }
          })
          // this.dprtmnt.filter(i=>{this.dprtmnt2.push(i.name)})
         

          // this._toastr.successToastr(res.msg);
        } else {
          // this._toastr.errorToastr(res.msg);
        }
      }, error => {
      }
    )
  }

  findBreakTime(hours,min){
    if(this.shortBreak)
    if(hours <= 1 && min < 59){
      return this.shortBreak[0].value
    }else if(hours <= 2 && hours >= 1 && min < 59){
      return this.shortBreak[1].value
    }else if(hours <= 3 && hours >= 2 && min < 59){
      return this.shortBreak[2].value
    }else if(hours <= 4 && hours >= 3 && min < 59){
      return this.shortBreak[3].value
    }else if(hours <= 5 && hours >= 4 && min < 59){
      return this.shortBreak[4].value
    }else if(hours <= 6 && hours >= 5 && min < 59){
      return this.shortBreak[5].value
    }else if(hours <= 7 && hours >= 6 && min < 59){
      return this.shortBreak[6].value
    }else{
      return this.shortBreak[7].value
    }
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

  getuserDetails() {
    if ((this.currentUser?.user_role == 4) || this.currentUser?.user_role == 5) {
      let id = this.currentUser?.id;
      let is_for = 'user'
      this.dataService.getUserById('', id, is_for).subscribe(response => {
        if (response.body && response.body[0] && response.body[0]) {
          this.shiftlength = response.body[0].typ_shift_length
        }
      })
    }
    else {
      this.dataService.getcommunityById(this.currentUser?.user_role == 4 ? this.currentUser?.com_id : this.currentUser?.id).subscribe(response => {
        if (!response.error) {
          if (response.body && response.body[0] && response.body[0]) {
          this.shiftlength = response.body[0].typ_shift_length          
          }

        }
      }

      );
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
}}
