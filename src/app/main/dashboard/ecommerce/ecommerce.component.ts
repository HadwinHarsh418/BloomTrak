import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Role, User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { DashboardService } from 'app/main/dashboard/dashboard.service';
import { EncryptionService } from 'app/utils/encryption/encryption.service';
import { Page } from 'app/utils/models';
import { ToastrManager } from 'ng6-toastr-notifications';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/internal/operators';
import { Subject } from 'rxjs';
import { CoreMenuService } from '@core/components/core-menu/core-menu.service';
import { PushNotificationService } from 'app/auth/service/notification.service';
import { environment } from 'environments/environment';


@Component({
  selector: 'app-ecommerce',
  templateUrl: './ecommerce.component.html',
  styleUrls: ['./ecommerce.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EcommerceComponent implements OnInit {
  @ViewChild('reserveDateModal') reserveDateModal: ElementRef<any>;
  @ViewChild('gainedChartRef') gainedChartRef: any;
  @ViewChild('monthlyChartRef') monthlyChartRef: any;

  // Public
  public data: any = { total_users: 0, total_drivers: 0, total_coupons: 0 };
  public currentUser: any;
  public isAdmin: boolean;
  public isClient: boolean;
  public loadingStats: boolean;
  public gainedChartoptions;
  public monthlyChartoptions;
  debounceApi = new Subject<any>();
  roleData: any=[]
  rl_id: any;
  aplyPrms: any;
  addPrms: any;
  dltPrms: any;
  edtPrms: any;
  vwPrms: any;
  dprtmnt: any = []

  rLink: any;
  viewStat: any;
  loadingSite:boolean=true;
  loadingSite1:boolean=false;


    // Private
    private $primary = '#14802e';

  public memoText: string = '';
  initialized: boolean = false;
  show = false;
  fromTime: number = new Date().getTime(); workId: any;
  startDateTime: number;

  dashusers = [
    {
      id: 0, username: '', total_username: 0, name: 'Communities', roles: [Role.SuperAdmin ,Role.Admin,Role.ManagementUser]
    },
    {
      id: 1, username: '', total_username: 0, name: 'Shifts', roles: [Role.Community,Role.communityUser]
    },
    {
      id: 2, username: '', total_username: 0, name: 'Shifts', roles: [Role.Agency]
    },
    {
      id: 3, username: '', total_username: 0, name: 'Shifts', roles: [Role.User]
    },
  ]

  monthDataName:any[] = [
    { id:1, name: 'January', value: 'january',isChecked:true,isDisable:true},
    { id:2, name: 'February', value: 'february',isChecked:false,isDisable:false},
    { id:3, name: 'March', value: 'march' ,isChecked:false,isDisable:true},
    { id:4, name: 'April', value: 'april' ,isChecked:false,isDisable:true},
    { id:5, name: 'May', value: 'may',isChecked:false ,isDisable:true},
    { id:6, name: 'June', value: 'june' ,isChecked:false,isDisable:true},
    { id:7, name: 'July', value: 'july',isChecked:false ,isDisable:true},
    { id:8, name: 'August', value: 'august',isChecked:false ,isDisable:true},
    { id:9, name: 'September', value: 'september' ,isChecked:false,isDisable:true},
    { id:10, name: 'October', value: 'october' ,isChecked:false,isDisable:true},
    { id:11, name: 'November', value: 'november' ,isChecked:false,isDisable:true},
    { id:12, name: 'December', value: 'december',isChecked:false ,isDisable:true}
  ];

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    dateClick: this.handleDateClick.bind(this),
    height: 500,
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'dayGridMonth'
    },
    buttonText: {
      month: 'Month',
    },

    events: []
  };
  availabilityDates: any[];
  calLabels = ['Booking', 'Reserved', 'Holiday']
  /**
   * Constructor
   * @param {AuthenticationService} _authenticationService
   * @param {DashboardService} _dashboardService
   */

  rows: any[] = [];
  page = new Page();
  todayBooking: any[] = [];
  todays_Departure: any[] = [];
  todays_Returning: any[] = [];
  loadingMemo: boolean;
  selectedResDate: any;
  unReserveDt: boolean;
  reservingDate: boolean;
  stats: { id: number; name: string; stat: number; icon: string; iconColor: string; roles: Role[]; }[];
  chartData: any;
  cat: any[]=[];
  cat1: any[]=[];
  data2: any[]=[];
  data3: any[]=[];
  set: any;
  colors: any[] = []
  colors1: any[] = []
  percent:any[] = []
  percent1:any[] = []
  loading: boolean;
  mthNam: any[]=[];
  loadingYear: boolean = false;
  comdisable: boolean = false;
  form: FormGroup;
  checkedIDs: any[];
  selectedValue: any[];
  expence: any[]=[];
  expence1:any[]=[];
  roleData1: any=[];
  allCommunity: any;
  com_name:any = '';
  roleData2: any=[];
  dprtmnt2: any=[];
  allResData: any[];
  allResData2: any[];
  currmonth: number;
  accTo: any;
  comId: any;
  slcDay: any;
  lastEntry: any=[];
  menu: any;
  shftTrk: boolean;
  spndTrk: boolean;
  showPermisionError: any[];
  showAddedOther: any[]=[];
  sectDepr: any[]=[];
  showshift: any;
  showDesh: any;
  totalshift: any;
  avvshift: any;
  monthDataName1: any[];
  lastTrue: number;
  yearischecked: boolean;

  constructor(
    private _authenticationService: AuthenticationService,
    private _dashboardService: DashboardService,
    private _encryptionService: EncryptionService,
    private _toastr: ToastrManager,
    private modalService: NgbModal,
    private datasrv: DataService,
    private authService: AuthenticationService,
    private fb:FormBuilder,
    private _coreMenuService: CoreMenuService,
    private notificationService: PushNotificationService,


  ) {
    sessionStorage.clear()
    this._authenticationService.currentUser.subscribe((x: any) => {
      this.currentUser = x;
      if(x && !x.hasOwnProperty('access_to')){
        this.datasrv.getCMAccessToByDate(this.authService.currentUserValue.com_id ? this.authService.currentUserValue.com_id : this.authService.currentUserValue.id).subscribe((res:any) => {
          if(!res.err){
            this.currentUser?.user_role == 3 || this.currentUser?.user_role == 8 ? this.getDashboardData() : ''
            if(x?.access_to != res.body?.access_to){
              this.accTo = res.body
              this.loadingSite = false
              let o = JSON.parse(JSON.stringify(this.authService.currentUserValue));
              Object.assign(o, { access_to: res.body?.access_to})
              this.authService.updateTokenValue(o);
            }
          }
        })
      }
    })
    this.getRole()
    let currMnt = new Date().getMonth()+1;
    this.monthDataName.forEach(item => {
      if(item.id <= currMnt) {
        item.isChecked = true;
        item.isDisable = (item.id == currMnt) ? false : true;
      }
    });
    this.isAdmin = this._authenticationService.isAdmin;
    this.isClient = !this._authenticationService.isAdmin;
    
    this.form = this.fb.group({
      checkedValue: this.fb.array([])
    });
    this.debounceApi.pipe(
      debounceTime(1000)
    ).subscribe(data => {
      // this.yearSpDownDashboard()
    });
  }
 

  ngOnInit(): void {
    this.currentUser?.user_role == 3 || this.currentUser?.user_role == 8 || this.currentUser?.user_role == 6 ? '' : this.getRonMonths()
    this._authenticationService.currentUser.subscribe((x: any) => {
      this.currentUser = x
      this.stats = [
        {
          id: 0, name: 'Communities', stat: 0, icon: 'fa fa-users', iconColor: 'bg-light-primary', roles: [Role.SuperAdmin,Role.Admin,Role.ManagementUser]
        },
        {
          id: 1, name: 'Agencies', stat: 0, icon: 'fa fa-building-o', iconColor: 'bg-light-info', roles: [Role.SuperAdmin]
        },
        {
          id: 2, name: 'Employees', stat: 0, icon: 'fa fa-user', iconColor: 'bg-light-danger', roles: [Role.SuperAdmin]
        },
        {
          id: 3, name: 'Shifts', stat: 0, icon: 'fa fa-suitcase', iconColor: 'bg-light-primary', roles: [Role.Community,Role.Admin,Role.communityUser,Role.ManagementUser]
        },
        {
          id: 4, name: 'Agencies', stat: 0, icon: 'fa fa-building-o', iconColor: 'bg-light-info', roles: [Role.Community]
        },
        {
          id: 5, name: 'Employees', stat: 0, icon: 'fa fa-user', iconColor: 'bg-light-danger', roles: [Role.Community]
        },
        //   {
        //     id:6, name:'Contacts', stat:0, icon: 'fa fa-users', iconColor:'bg-light-primary', roles: [ Role.Community ]
        //  },
    
    
    
        
        {
          id: 6, name: 'Shifts', stat: 0, icon: 'fa fa-suitcase', iconColor: 'bg-light-primary', roles: [Role.Agency]
        },
    
    
    
    
        {
          id: 7, name: 'Shifts', stat: 0, icon: 'fa fa-suitcase', iconColor: 'bg-light-danger', roles: [Role.User]
        },
        {
          id: 8, name: 'Shifts', stat: 0, icon: 'fa fa-suitcase', iconColor: 'bg-light-primary', roles: [Role.SuperAdmin]
        },
        {
          id:9, name: 'Agency Personnel', stat:0, icon: 'fa fa-user', iconColor:'bg-light-primary', roles: [  ]
        },
        {
          id:10, name: 'Available Shifts', stat:0, icon: 'fa fa-user', iconColor:'bg-light-primary', roles: [ Role.Agency,Role.User ]
        },
        {
          id:11, name: 'My Shifts', stat:0, icon: 'fa fa-user', iconColor:'bg-light-primary', roles: [ Role.Agency,Role.User]
        },
        {
          id:12, name: 'Agency Personnel', stat:0, icon: 'fa fa-user', iconColor:'bg-light-primary', roles: [ Role.Agency ]
        },
        // {
        //   id:10, name:'All Contracts', stat:0, icon: 'fa fa-car', iconColor:'bg-light-danger', roles: [ Role.User]
        // },
        // {
        //   id:11, name:'Completed  Contracts', stat:0, icon: 'fa fa-car', iconColor:'bg-light-danger', roles: [ Role.User]
        // },
    
      ]

      if (this.currentUser && this.currentUser?.user_role == '1') {
        this.viewStat = 'View Shifts' //  community
        this.rLink = '/shift'
      } else if (this.currentUser && this.currentUser?.user_role == '6') {
        this.viewStat = 'View Communities' // admin
        this.rLink = '/community'
      } else if (this.currentUser && this.currentUser?.user_role == '2') {
        this.viewStat = 'View Shifts' // agency
        this.rLink = '/shift'
      } 
      else if (this.currentUser && (this.currentUser?.user_role == '3' || this.currentUser?.user_role == 8)) {
        this.viewStat = 'View Communities' // agency
        this.rLink = '/community'
      } else {
        this.viewStat = 'View Shifts ' // User
        this.rLink = '/shift'
      }
    }
    );
    


    // this._authenticationService.login(this.currentUser?.value)
    this.onCheckboxChange('january',true, 0,1)
    this.createChart()

    if(['6'].includes(this.currentUser?.prmsnId) || this.currentUser?.user_role==3  || this.currentUser?.user_role==8){
      this.getCommunityId()
    }

   setTimeout(() => {
     this.getCurrMenu()
   }, 2000);
  }
  goToPwa(){
    this.notificationService.showNotification('Test Notification', 'This is a test notification.');
  }

  getDashboardData(forcp?){
    this._dashboardService.getDashboardData(this.currentUser?.user_role,this.currentUser?.id,forcp).subscribe(response => {
      if (!response.error) {
        this.loadingSite = false;
        
        let data = response;
        if (this.currentUser && this.currentUser?.user_role == '6') {
          this.stats[0].stat = data.body[0]?.community_portal; //admin
          this.stats[1].stat = data.body[0]?.agencies; //admin
          this.stats[2].stat = data.body[0]?.employees; //admin
          this.stats[8].stat = data.body[0]?.shift; //admin
          // this.dashusers[0]?.total_username = data.body[0]?.community_portal; //admin
        }
        else if (this.currentUser && this.currentUser?.user_role == '1') {
          this.stats[3].stat = data.body.SHIFT; //community
          this.stats[4].stat = data.body.Agencies; //community
          this.stats[5].stat = data.body.Employees; //community
          // this.stats[6].stat = data.body[0]?.Contracts; //community
          this.dashusers[1].total_username = data.body.SHIFT; //community
        }
        else if (this.currentUser && this.currentUser?.user_role == '2') {
          // this.stats[7].stat = data.body[0]?.Contracts; //agency
          this.stats[12].stat = data?.body?.Employees; //User
          this.stats[6].stat = data?.body?.shiftAndAvilable; //agency
          this.stats[10].stat = data?.body?.avilableShift; //agency
          this.stats[11].stat = data?.body?.myShift; //agency
          this.dashusers[2].total_username = data?.body?.shiftAndAvilable; //Agency        

        }else if (this.currentUser && this.currentUser?.user_role == 3 || this.currentUser?.user_role == 8) {
          // this.stats[7].stat = data.body[0]?.Contracts; //agency
          this.stats[0].stat = data.body[0]?.community_portal; //User
          this.stats[3].stat = data.body[0]?.shift; //agency
          this.dashusers[0].total_username = data.body[0]?.community_portal; //Agency        

        }
        // else if (this.currentUser && this.currentUser?.user_role == '4') {
        //   this.stats[3].stat = data.body[0]?.userCMShift; //agency
        //   // this.stats[11].stat = data.body[0]?.userCMShift; //User
        //   this.dashusers[1].total_username = data.body[0]?.userCMShift; 
        // }
        else if (this.currentUser && this.currentUser?.user_role == 5) {
          if(this.showDesh == 0){
            var namesToRemove = ["Available Shifts", "My Shifts"];
            this.stats = this.stats.filter(function(item) {
                  return namesToRemove.indexOf(item.name) === -1;
              });
              this.stats[7].stat = data.body.totalShift; //User
              this.dashusers[3].total_username = data.body.totalShift;
            // this.stats[7].stat = data.body[0]?.userAgShift; //User
          // this.dashusers[3].total_username = data.body[0]?.userAgShift;
          }else{
            this.stats[7].stat = data.body.shiftAndAvilable; //User
            this.dashusers[3].total_username = data.body.shiftAndAvilable; //Users
            this.stats[10].stat = data.body.avilableShift; //Users
            this.stats[11].stat = data.body.myShift; //Users
          }
        }        
        if(data?.body)
        this.data = data?.body[0];
      }
      this.loadingStats = false;
      this.loadingSite = false;

    }, error => {
      this.loadingStats = false;
        this.loadingSite = false;

    });
  }


  getSpndOnInIt(){
    this.datasrv.getSpendDownOthersTable(this.currentUser?.user_role == 3 || this.currentUser?.user_role == 8 ? this.com_name : this.currentUser?.id,this.sectDepr,this.currentUser?.user_role == 3 || this.currentUser?.user_role == 8 ? this.com_name : this.currentUser?.com_id ?? this.currentUser?.id).subscribe((res:any)=>{
      if(!res.error){
        this.showAddedOther = res.body?.added_by_others
      }
      else{
        this._toastr.errorToastr('Something went wrong please try again later')
      }
    },err=>{
        this.datasrv.genericErrorToaster()
    })
  }

  getCurrMenu(){
    this.menu =  this._coreMenuService.getCurrentMenu();
    this.menu.map(i=>{
      if(i.title == "shiftrak"){
        this.shftTrk = true
      }else if(i.title == "spendtrak"){
        this.spndTrk = true
      }
    })
  }
  // getTodaysStats() {
  //   this._dashboardService.getTodaysData().subscribe(response => {
  //     if (!response.error) {
  //       this.todayBooking = response.body.TodayBooking
  //       this.todays_Departure = response.body.Todays_Departures
  //       this.todays_Returning = response.body.Todays_Returning
  //     }
  //     this.loadingStats = false;
  //   }, error => {
  //     this.loadingStats = false;

  //   });
  // }

  // getMemoData() {
  //   this.loadingMemo = true;
  //   this._dashboardService.getMemoData().subscribe(
  //     res => {
  //       if(!res.error) {
  //         let data = this._encryptionService.getDecode(res);
  //         this.memoText = data.body[0]?.memo_text;
  //       } else {

  //         this._toastr.errorToastr(res.msg);
  //       }
  //       this.loadingMemo = false;
  //     }, error => {
  //       this.loadingMemo = false;
  //     }
  //   )
  // }

  createChart(){
      // monthly detail chart
      this.monthlyChartoptions = {
        chart: {
          height: '350px',
          type: 'bar',
          stacked: true,
          toolbar: {
            show: false
          },
          sparkline: {
            enabled: false
          }
        },
        labels: {
          formatter: (value) => { return Number(value).toFixed(2) }
        },
        colors: this.colors1,
        // [this.set.value >'50000'? '#e70909':this.set.value <'5000' ? this.$primary : '#ede50e'],
        // ['#e70909','#ede50e',this.$primary],
        dataLabels: {
          enabled: false
        },
        legend: {
          // position: 'top',
          // horizontalAlign: 'left',
          // offsetX: 40,
          // enabled:false,
          show: false,
          // showForSingleSeries: false,
          // floating: false,
          // showForNullSeries: false,
          // showForZeroSeries: false,
        },
        plotOptions: {
          bar: {
            horizontal: false,
            distributed: true,
            dataLabels:{
              enabled:false
            }
          },
        },
        stroke: {
          curve: 'smooth',
          width: 2.5
        },
        fill: {
          type: 'solid',
          gradient: {
            shadeIntensity: 0.9,
            opacityFrom: 0.7,
            opacityTo: 0.5,
            stops: [0, 80, 100]
          }
        },   
        xaxis: {
          categories: 
          // [
          //   'Activities',
          //   'Dining',
          //   'Maintenance',
          //   'Marketing',
          //   'Houskeeping',
          //   'Admin',
          // ],
          this.cat1
        },
        yaxis: {
          labels: {
            formatter: (value) => { return (Number(value).toFixed(1)) + "%"}
          },
        },
        series: [
          {
            name: 'Percentage',
            // data: this.data3,
            data:this.percent1,
            data1:this.data3,
            data2:this.expence,
            // data: [0,10, 15, 20, 25, 30, 35,40,45,50,55,60,65,70,75,80,85,90,95,100]
          },
          // {
          //   name: 'Budget',
          //   data:this.data3,
          // },
          // {
          //   name: 'Actual',
          //   data:this.expence,
          // },
        ],
        tooltip: {
          custom: function({series,seriesIndex, dataPointIndex, w}){
            return (
              '<div class="arrow_box" style="padding:5px;">' +
              "<span><u>" +
              w.globals.labels[dataPointIndex] +
              ": </u><br> Percentage: " +
              w.config.series[seriesIndex].data[dataPointIndex] + "%  <br> Budget: "+
              w.config.series[seriesIndex].data1[dataPointIndex].toLocaleString('en-US', {style:"currency", currency:"USD"}) + " <br> Actual: "+
              w.config.series[seriesIndex].data2[dataPointIndex].toLocaleString('en-US', {style:"currency", currency:"USD"}) + 
              "</span>" +
              "</div>"
            );
          },
          style: {padding:'5px',
      },
          show: true
        }
      };

      //yearly detail chart
      this.gainedChartoptions = {
        chart: {
          height: '350px',
          type: 'bar',
          stacked: true,
          toolbar: {
            show: false
          },
          sparkline: {
            enabled: false
          }
        },
        labels: {
          formatter: (value) => { return Number(value).toFixed(2) }
        },
        colors: this.colors,
          // [this.set.value >'50000'? '#e70909':this.set.value <'5000' ? this.$primary : '#ede50e'],
          // ['#e70909','#ede50e',this.$primary],
        dataLabels: {
          enabled: false
        },
        plotOptions: {
          bar: {
            horizontal: false,
            distributed: true,
          },
        },
        stroke: {
          curve: 'smooth',
          width: 2.5
        },
        fill: {
          type: 'solid',
          gradient: {
            shadeIntensity: 0.9,
            opacityFrom: 0.7,
            opacityTo: 0.5,
            stops: [0, 80, 100]
          }
        },   
        xaxis: {
          categories: 
          // [
          //   'Activities',
          //   'Dining',
          //   'Maintenance',
          //   'Marketing',
          //   'Houskeeping',
          //   'Admin',
          // ],
          this.cat
        },
        yaxis: {
          labels: {
            formatter: (value) => { return Number(value).toFixed(1) + "%"}
          },
        },
        series: [
          {
            name: 'Percentage',
            data:this.percent,
            data1:this.data2,
            data2:this.expence1,
            // data: [0,10, 15, 20, 25, 30, 35,40,45,50,55,60,65,70,75,80,85,90,95,100]
          },
          // {
          //   name: 'Budget',
          //   data:this.data2,
          // },
          // {
          //   name: 'Actual',
          //   data:this.expence1,
          // },
        ],
        tooltip: {
          // custom: function({series,seriesIndex, dataPointIndex, w}){
          //   return (
          //     '<div class="arrow_box">' +
          //     "<span><u>" +
          //     w.globals.labels[dataPointIndex] +
          //     ": </u><br> Percentage: " +
          //     series[0][dataPointIndex] + "%  <br> Budget: $"+
          //     series[1][dataPointIndex] + " <br> Actual: $"+
          //     series[2][dataPointIndex] + 
          //     "</span>" +
          //     "</div>"
          //   );
          // },
          custom: function({series,seriesIndex, dataPointIndex, w}){
            return (
              '<div class="arrow_box" style="padding:5px;">' +
              "<span><u>" +
              w.globals.labels[dataPointIndex] +
              ": </u><br> Percentage: " +
              w.config.series[seriesIndex].data[dataPointIndex] + "%  <br> Budget: "+
              w.config.series[seriesIndex].data1[dataPointIndex].toLocaleString('en-US', {style:"currency", currency:"USD"}) + " <br> Actual: "+
              w.config.series[seriesIndex].data2[dataPointIndex].toLocaleString('en-US', {style:"currency", currency:"USD"}) + 
              "</span>" +
              "</div>"
            );
          },
          show: true
        }
      };
  }
  updateMemo() {
    this.loadingMemo = true;
    let data = { enc: this._encryptionService.encode(JSON.stringify({ desc: this.memoText })) };
    this._dashboardService.updateMemoData(data).subscribe(
      res => {
        if (!res.error) {
          // this.memoText = res.body;
          this._toastr.successToastr(res.msg);
        } else {
          this._toastr.errorToastr(res.msg);
        }
        this.loadingMemo = false;
      }, error => {
        this.loadingMemo = false;
      }
    )
  }

  // getAllHolidays() {
  //   this.initialized = false;
  //   this._dashboardService.getAllHolidays().subscribe(res => {
  //     if(!res.error) {
  //       this.availabilityDates = res.body;
  //       let bookingArr:any[] = [];
  //       let blockedArr:any[] = [];
  //       let holidayArr:any[] = [];
  //       this.availabilityDates.forEach(
  //         item => {
  //           if(item.booking_dates) {
  //             item.booking_dates.forEach(bd => {
  //               if(bd) {
  //                 bookingArr.push({ title: this.calLabels[0], start: bd })
  //               }
  //             });
  //           }
  //           if(item.block_dates) {
  //             let unique_block_dates = new Set(item.block_dates)
  //             unique_block_dates.forEach(bd => {
  //               if(bd) {
  //                 blockedArr.push({ title: this.calLabels[1], start: bd })
  //               }
  //             });
  //           }
  //           if(item.setting_value) {
  //             item.setting_value.forEach(bd => {
  //               if(bd) {
  //                 holidayArr.push({ title: this.calLabels[2], start: bd })
  //               }
  //             });
  //           }
  //         }
  //       );
  //       let newArr:any[] = [];
  //       newArr = bookingArr.concat(holidayArr).concat(blockedArr);
  //       this.calendarOptions.events = newArr;
  //       this.initialized = true;
  //     }
  //   }, error => {
  //     this.calendarOptions.events = [];
  //     this.initialized = true;
  //   });
  // }

  handleDateClick(arg) {
    var now = new Date();
    if (arg.date.setHours(0, 0, 0, 0) <= now.setHours(0, 0, 0, 0)) {
    } else {
      let events = JSON.parse(JSON.stringify(this.calendarOptions.events))
      let dtFound = events.filter(ev => ev.start == arg.dateStr && ev.title == this.calLabels[2]);
      this.selectedResDate = arg.dateStr
      if (dtFound.length && dtFound[0]?.title == this.calLabels[2]) {
        this.unReserveDt = true;
        this.modalOpenOSE(this.reserveDateModal, 'sm');
      } else if (dtFound.length && this.calLabels.includes(dtFound[0]?.title)) {
        //do nothing
        return;
      } else {
        // no event added yet
        this.unReserveDt = false;
        this.modalOpenOSE(this.reserveDateModal, 'sm');
      }
    }
  }

  // reserveDate(modal) {
  //   let events = JSON.parse(JSON.stringify(this.calendarOptions.events))
  //   let holidays = events.filter(item =>  item.title == this.calLabels[2]);
  //   let dates = [];
  //   holidays.forEach(item => {
  //      (this.unReserveDt && this.selectedResDate == item.start) ? '' : dates.push(item.start);
  //   })
  //   if(!this.unReserveDt && this.selectedResDate) {
  //     dates.push(this.selectedResDate);
  //   }
  //   let enc = this._encryptionService.encode(JSON.stringify({setting_value:dates}));
  //   // return;
  //   this.reservingDate = true;
  //   this._dashboardService.updateHoliday({enc}).subscribe((res) => {
  //     if (!res.error) {
  //       this.initialized = false;
  //       if (this.unReserveDt) { 
  //         this.initialized = false;
  //         let splicedEvts = events.filter(rm => rm.start != this.selectedResDate && rm.title != this.calLabels[2]);
  //         this.calendarOptions.events = events;
  //         // this.getAllHolidays()

  //       }else {
  //         events.push({ title: this.calLabels[2], start: this.selectedResDate })
  //         this.calendarOptions.events = events;
  //       }
  //       this.initialized = true;
  //       this._toastr.successToastr(res.msg);
  //       this.closed(modal);
  //     }
  //     else {
  //       this._toastr.errorToastr('Oops! something went wrong');
  //     }
  //     this.reservingDate = false;
  //   })
  // }

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
    this.selectedResDate = null;
    this.unReserveDt = false;
    modal.dismiss();
  }

  getRonMonths(){
    // this.monthDataName=[]
    this.monthDataName1=[
      { id:1, name: 'January', value: 'january',isChecked:true,isDisable:true},
      { id:2, name: 'February', value: 'february',isChecked:false,isDisable:false},
      { id:3, name: 'March', value: 'march' ,isChecked:false,isDisable:true},
      { id:4, name: 'April', value: 'april' ,isChecked:false,isDisable:true},
      { id:5, name: 'May', value: 'may',isChecked:false ,isDisable:true},
      { id:6, name: 'June', value: 'june' ,isChecked:false,isDisable:true},
      { id:7, name: 'July', value: 'july',isChecked:false ,isDisable:true},
      { id:8, name: 'August', value: 'august',isChecked:false ,isDisable:true},
      { id:9, name: 'September', value: 'september' ,isChecked:false,isDisable:true},
      { id:10, name: 'October', value: 'october' ,isChecked:false,isDisable:true},
      { id:11, name: 'November', value: 'november' ,isChecked:false,isDisable:true},
      { id:12, name: 'December', value: 'december',isChecked:false ,isDisable:true}
    ];
    this._dashboardService.getRonMonths(this.currentUser?.user_role == 8 || this.currentUser?.user_role == 6 ? this.com_name : this.authService.currentUserValue.com_id ? this.authService.currentUserValue.com_id : this.currentUser?.user_role == 3 ? this.com_name : this.authService.currentUserValue.id).subscribe(
      res =>{
        for (const key of Object.keys(res.body)) {
          const monthName = this.getMonthName(key);
          this.monthDataName.map(i=>{if(res.body[key] == "R" && monthName == i.name){i.name = i.name + ' ' + '(R)'}; return i;})
        }
      }
    )
  }

   getMonthName(key: string): string {
    const monthNames: string[] = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  
    // Split the key into parts (e.g., "5-2023" becomes ["5", "2023"])
    const keyParts = key.split('-');
  
    if (keyParts.length === 2) {
      const monthIndex = parseInt(keyParts[0], 10) - 1; // Subtract 1 because months are 0-based in JavaScript
      const year = parseInt(keyParts[1], 10);
  
      if (!isNaN(monthIndex) && !isNaN(year) && monthIndex >= 0 && monthIndex < 12) {
        return `${monthNames[monthIndex]}`;
      }
    }
  
    // Return an empty string if the key format is not valid
    return '';
  }


  getCommunityId() {
    if(['6'].includes(this.currentUser?.prmsnId) ){
    this.datasrv.getCommunityId().subscribe((response: any) => {
      if (response['error'] == false) {
        this.allCommunity = response.body.sort(function(a, b){
          if(a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
          if(a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
          return 0;
      })  ;
      this.comId =  this.allCommunity[0]?.id
      this.getLastEntrySummery()
      this.monthSpDownDashboard()
      this.yearSpDownDashboard()
        //this.toastr.successToastr(response.msg);
      } else if (response['error'] == true) {
        this._toastr.errorToastr(response.msg);
      }
    }, (err) => {
      this.datasrv.genericErrorToaster();

    })
  }else{
    if(this.currentUser?.id && this.currentUser?.com_id){
      let data = {
        userId : this.currentUser?.id,
        mangId : this.currentUser?.management
      }
      this.datasrv.getManagementUserCommunities(data).subscribe((res: any) => {
        if (!res.error) {
          let d = res?.body[0]?.user_added_communities.concat(res?.body[1].userAvailableCommunities);
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
        this.com_name =  this.allCommunity[0]?.community_id
        this.comId =  this.allCommunity[0]?.community_id
        this.getLastEntrySummery()
      this.getRonMonths()
      this.shiftapi() 

        } else {
          this._toastr.errorToastr(res.msg);
        }
      },
        (err) => {
          this.datasrv.genericErrorToaster();
        })
    }
    else{
      this.datasrv.getMNMGcommunity(this.currentUser?.id).subscribe((response: any) => {
        if (response['error'] == false) {
          this.allCommunity = response.body.sort(function(a, b){
            if(a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
            if(a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
            return 0;
        })  ;
        this.com_name =  this.allCommunity[0]?.cp_id
        this.comId =  this.allCommunity[0]?.cp_id
      this.getDepartment(this.comId)
      this.getLastEntrySummery()
      this.getRonMonths()
      this.shiftapi()
      this.getSpndOnInIt()
          //this.toastr.successToastr(response.msg);
        } else if (response['error'] == true) {
          this._toastr.errorToastr(response.msg);
        }
      }, (err) => {
        this.datasrv.genericErrorToaster();
  
      })
    }
  }
  }

  comNames(){
    if(['6'].includes(this.currentUser?.prmsnId)||this.currentUser?.user_role == 3 || this.currentUser?.user_role == 8){
        this.getDepartment(this.com_name)
    }
    else{
      this.getRole()
    }
    // this.monthSpDownDashboard()
    // this.yearSpDownDashboard()
  }

  mgnComNames(com_name){
    // this.monthSpDownDashboard()
    // this.yearSpDownDashboard()
    this.getRonMonths()
    this.getSpndOnInIt()
  }

  getDepartment(e){
    this.dprtmnt2 =[]
    let isfor =  6
    let for_other = null
    this.datasrv.getDepartmentListing(e,isfor,for_other).subscribe((res:any)=>{
      if(res?.body)
      res.body.filter(i=>{this.dprtmnt2.push(i.name)})
      this.mgnComNames(e)
    },err=>{
      this._toastr.errorToastr('Something went wrong please try again leter')
    })
  }

  monthSpDownDashboard(){
    this.loading = true;
    this.comdisable = true;
    this.cat1 = []
    this.percent1 = []
    this.data3= []
    this.expence = []
    this.colors1 = []
      let id = this.currentUser?.prmsnId == '1' ? this.currentUser?.id : this.currentUser?.user_role == '3' || this.currentUser?.user_role=='8' ? this.com_name : this.currentUser?.user_role == 6 ? this.comId : this.currentUser?.com_id || '' ;
    this._dashboardService.monthSpDownDashboard(id).subscribe((res:any) =>{
      if(!res.error){
        this.loading = false;
        this.comdisable = false;
        this.yearSpDownDashboard()
        let newUniqueArr=[];
        let arr1=[];
        res.body.forEach(i=>{
          if(!arr1.includes(i.department)){
            arr1.push(i.department)
            newUniqueArr.push(i)
          }
        })
        this.allResData=[]
        res?.body ?this.allResData = newUniqueArr?.sort(function(a, b){
          if(a.department.toUpperCase() < b.department.toUpperCase()) { return -1; }
          if(a.department.toUpperCase() > b.department.toUpperCase()) { return 1; }
          return 0;
      }) : ''  ;
         if(this.roleData2.includes(this.currentUser?.prmsnId)){
          if(this.allResData?.length)
            this.allResData.forEach((i)=>{
            if(this.dprtmnt2.includes( i.department)){
              this.cat1.push(JSON.parse(JSON.stringify(i.department)))
              this.percent1.push(parseInt(i.percentage))
              this.data3.push(i.budget)
              this.expence.push(i.expense)
            }
            })
         }else{
          if(this.allResData?.length)
          this.allResData.forEach(i=>{
            if(this.dprtmnt2.includes( i.department)){
            this.cat1.push(JSON.parse(JSON.stringify(i.department)))
            this.percent1.push(parseInt(i.percentage))
            this.data3.push(i.budget)
            this.expence.push(i.expense)
            }
            if(!this.dprtmnt2.length && this.com_name == ''){
              this.cat1.push(JSON.parse(JSON.stringify(i.department)))
              this.percent1.push(parseInt(i.percentage))
              this.data3.push(i.budget)
              this.expence.push(i.expense)
            }
           })
         }
        //  array1.filter(item => array2.includes(item))
        if(this.allResData?.length){
         this.allResData = this.allResData.filter((i,ind)=>{
         if( this.cat1.includes(i.department)) {
          return i
         }
        })
        this.colors1=[]
         this.percent1.forEach(i=>{
          if(i >= 90 && i<= 100){
            this.colors1.push('#ede50e');
           }
           else if (i<90){
            this.colors1.push(this.$primary);
           }
           else{
            this.colors1.push('#e70909');
           }
         })
        }
      }
      let arr=[];
      this.cat=[]
      this.cat.map(i=>{
        if(!arr.includes(i.id)){
          arr.push(i.id)
          return i;
        }
       })
      this.monthlyChartoptions.colors = this.colors1
      this.createChart()

    }, error => {
      this.loading = false;
    })
  }

  
  onCheckboxChange(data: string, isChecked: boolean, index:number,call?:any) {
    

    setTimeout(() => {
      this.lastTrue = 0;
      this.selectedValue=[];
      this.monthDataName.forEach( (item, i) => {
        if(i > 0) {
          if(!item.isChecked  && this.monthDataName[i -1].isChecked) {
            this.lastTrue = (i > 0) ? i -1 : 0;
          } else if(item.isChecked && i == 11) {
            this.lastTrue = 11;
          }
        }
        if(item.isChecked) {
          this.selectedValue.push(item.value);
        }
        item.isDisable = true;
      });
      if(this.lastTrue < 11) {
        this.monthDataName[this.lastTrue+1].isDisable = false;
      }
      this.monthDataName[this.lastTrue].isDisable = false;
      // this.debounceApi.next();
      if(call != 1){
        if(this.yearischecked == false)
        this.yearSpDownDashboard()
        }
    }, 100);


  }

  yearSpDownDashboard(){
    this.loadingYear = true;
    this.yearischecked = true
    // this.monthDataName[this.lastTrue+1].isDisable = true;
    this.comdisable = true;
    this.cat = []
    this.data2= []
    this.colors = []
    this.percent = []
    this.expence1 = []
    let d = this.selectedValue
    let id = this.currentUser?.prmsnId == '1' ? this.currentUser?.id : this.currentUser?.user_role == '3' || this.currentUser?.user_role=='8' ? this.com_name : this.currentUser?.user_role == 6 ? this.comId : this.currentUser?.com_id || '' ;
    this._dashboardService.yearSpDownDashboard(id,d).subscribe((res:any) =>{
      if(!res.error){
        this.loadingYear = false;
        // this.monthDataName[this.lastTrue+1].isDisable = false;
        let newUniqueArr=[];
        let arr1=[];
        if(res?.body)
        res.body.forEach(i=>{
          if(!arr1.includes(i.department)){
            arr1.push(i.department)
            newUniqueArr.push(i)
          }
        })
        this.allResData2 = []
        this.allResData2 = newUniqueArr?.sort(function(a, b){
          if(a.department.toUpperCase() < b.department.toUpperCase()) { return -1; }
          if(a.department.toUpperCase() > b.department.toUpperCase()) { return 1; }
          return 0;
      })  ;;
          this.cat= []
        if(this.roleData2.includes(this.currentUser?.prmsnId)){
          this.allResData2.forEach((i)=>{
            if(this.dprtmnt2.includes( i.department)){
              this.cat.push(JSON.parse(JSON.stringify(i.department)))
              this.percent.push(parseInt(i.percentage))
              this.data2.push(i.budget)
              this.expence1.push(i.expense)
            }
           })
         }else{
          this.allResData2.forEach(i=>{
            if(this.dprtmnt2.includes( i.department)){
            this.cat.push(JSON.parse(JSON.stringify(i.department)))
            this.percent.push(parseInt(i.percentage))
            this.data2.push(i.budget)
            this.expence1.push(i.expense)
            }
            if(!this.dprtmnt2.length && this.com_name == ''){
              this.cat.push(JSON.parse(JSON.stringify(i.department)))
              this.percent.push(parseInt(i.percentage))
              this.data2.push(i.budget)
              this.expence1.push(i.expense)
            }
           })
         }
         let arr=[]
         this.cat.map(i=>{
          if(i == null){
           return i.push('Activities')
          }
          if(!arr.includes(i.id)){
            arr.push(i.id)
            return i;
          }
          
         }) 
         this.colors =[]
         this.percent.forEach(i=>{
          if(i >= 90 && i<= 100){
            this.colors.push('#ede50e');
           }
           else if (i<90){
            this.colors.push(this.$primary);
           }
           else{
            this.colors.push('#e70909');
           }
         })

        
        }
        this.comdisable = false;
        this.yearischecked = false
        this.gainedChartoptions.colors = this.colors
        this.createChart()
        
      }, error => {
        this.loadingYear = false;
        this.yearischecked = false
        this.comdisable = false;
      })
      this.loadingSite=false;
      
  }

  getRole(){
    this.datasrv.getAllRole().subscribe((res:any)=>{
      if(!res.err){ 
         res.body.filter(i=>{ this.roleData.push(i.id.toString())
          this.roleData.map(i=>{
            if(i != 1 && i != 2 && i != 3  && i != 4 && i != 5 && i!= 6 ){
              this.roleData1.push(i)
            }
            if(i != 2 && i != 3  && i != 4 && i != 5 && i!= 6 ){
              this.roleData2.push(i)
            }
           })
          
        })    
        this.getPermissionByAdminRole() 
        }

    },err=>{
      this.datasrv.genericErrorToaster()
    })
  }

  getPermissionByAdminRole() {
    this._dashboardService.getPermissionByAdminRole().subscribe(
      res => {
        if (!res.error) {
          this.showPermisionError = res.body;
          if(res?.body)
          res.body.filter(i=>{
            if(i.permission_name == 'Shifts'){
              this.showDesh = i.apply_permission
              this.addPrms = i.add_permission
              if(i.apply_permission == '1' && this.currentUser?.user_role == 5){
                this.getDashboardData('true')
              }else{
                this.getDashboardData()
              }
              this.currentUser?.user_role == 4 ? this.shiftapi() : ''
            }
              
            if(i.permission_name == 'Department' && i.trak_type =='0'){
              this.dprtmnt=JSON.parse(i.row_data);
              this.dprtmnt.map(i=>{
                this.sectDepr.push(i.name)
              })
                this.getSpndOnInIt()
              this.dprtmnt =  this.dprtmnt?.sort(function(a, b){
                if(a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
                if(a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
                return 0;
            });
           }
           
            if(i.permission_name == 'Shifts'){
             this.vwPrms  = i.view_permission
             this.addPrms = i.add_permission
          }
          })
          this.dprtmnt.filter(i=>{this.dprtmnt2.push(i.name)})
           this.monthSpDownDashboard()
           this.getLastEntrySummery()

          // this._toastr.successToastr(res.msg);
        } else {
          // this._toastr.errorToastr(res.msg);
        }
        this.loadingMemo = false;
      }, error => {
        this.loadingMemo = false;
      }
    )
  }

  chngCom(comId){
    this.comId  = comId
    this.com_name  = comId    
    if(this.currentUser?.prmsnId == '6'){
      this.monthSpDownDashboard()
      // this.yearSpDownDashboard()
      this.comNames()
      this.getLastEntrySummery()
    }
    if(this.currentUser?.user_role == 3 || this.currentUser?.user_role == 8){
      this.getDepartment(this.comId)
      this.getLastEntrySummery()
      this.monthSpDownDashboard()
    // this.yearSpDownDashboard()
    this.shiftapi()
    }
  }

  chngDay(day){
    this.slcDay  = day
    this.getLastEntrySummery()
  }

  getLastEntrySummery(){
    let isfor = this.currentUser?.prmsnId == '6' ? '' : '6';
    let id = this.currentUser?.prmsnId == '1' ? this.currentUser?.id : this.currentUser?.user_role == '3' || this.currentUser?.user_role == '6'  || this.currentUser?.user_role=='8' ? this.comId : this.currentUser?.com_id || '' ;
    this.datasrv.getLastEntrySummery(id,isfor,this.slcDay || '3').subscribe((res:any)=>{
    this.lastEntry =   res.body.sort(function(a, b){
      if(a.department.toUpperCase() < b.department.toUpperCase()) { return -1; }
      if(a.department.toUpperCase() > b.department.toUpperCase()) { return 1; }
      return 0;
     });
    if(this.roleData1.includes(this.currentUser?.prmsnId)){
      this.lastEntry =  this.lastEntry.filter(i=>{
        if(this.dprtmnt2.includes(i.department)){
          return i
        }
      })
    }
    },err=>{
      this._toastr.errorToastr('Something went wrong please try again leter')
    })
  }

  shiftapi(){
    let body = {
      searchStr: '',
      page: this.page.pageNumber,
      shiftType: '5',
      currentUser: this.addPrms == '1' && this.currentUser?.user_role == 4 ? this.currentUser?.com_id : (this.currentUser?.user_role == 8 || this.currentUser?.user_role == 3) ? this.com_name : this.currentUser?.id,
      limit: '10',
      start_time:  null,
      end_time:  null,
      sort: { prop: 'start_time', dir: 'desc' }
    }
    let body1 = {
      searchStr: '',
      tpUsr: null,
      cpType:  null,
      currentUser: this.currentUser?.id,
      id:  undefined,
      for_cp1: true,
      start_time:  null,
      end_time: null,
      sort: { prop: 'start_time', dir: 'desc' }
    }
    this.loadingSite1 = true
    if((this.currentUser?.user_role == 4 && this.addPrms == '1') || this.currentUser?.user_role == 8 || this.currentUser?.user_role == 3){
    this.datasrv.getNewCommunityShifts(body).subscribe((res:any) =>{
      this.totalshift = res.pagination.totalElements; 
      this.loadingSite1 = false;
    }
    )}
    else{
    this.datasrv.getNewCommunityShiftByID(body1).subscribe((res:any) =>{
      this.totalshift = (res.body.availableShifts?.length + res.body.userShifts?.length)
    }
    )
  }
  }
}