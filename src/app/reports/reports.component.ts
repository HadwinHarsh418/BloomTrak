import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgbCalendar, NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'app/auth/service';
import { ApiService } from 'app/auth/service/api.service';
import { DataService } from 'app/auth/service/data.service';
import { Page } from 'app/utils/models';
import moment from 'moment';
import { ToastrManager } from 'ng6-toastr-notifications';
import * as XLSX from 'xlsx'

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  public contentHeader: object;
  allCommunity: any = []
  mngmNames: any;
  public start_day: any
  public end_day: any
  public subtract_day: any
  public Difference_In_Days: any
  crrntUsrId: any[] = []
  currentUser: any;
  Alldata: any;
  AlldataAgency: any;
  trendAnalysis: any;
  filename = "export-data.xlsx";
  data0: boolean = false
  data1: boolean = false
  data2: boolean = false
  data3: boolean = false
  loadingSite: boolean = false;
  public page = new Page();

  Difference_In_Time: number;
  SHIFT_VARIANCE :any
  SHIFT_VARIANCE_PRS :any
  SHIFT_VARIANCE_DOLLAR :any
  SHIFT_VARIANCE_PRS_DOLLAR :any
  disable: boolean = false;
  agncyDtlTimeRept: any;


  hoveredDate: NgbDate | null = null;
	fromDate: NgbDate;
	toDate: NgbDate | null = null;
  toDate1: NgbDate | null = null;
  fromDate1: NgbDate;
  hoveredDate1: NgbDate | null = null;
  start_day1: string;
  today1: string;
  priorDays: string;
  timeprd: boolean = false
  enDt :any
  stDt:any
  trndRpt: boolean = false;
  AlldataAgency1: any;
  totNumOfShft:number=0;
  totHrSchld:number=0;
  totAdjHr:number=0;
  totAdjPay:number=0;
  minDate: any;
  diffInDys: boolean = false;
  Difference_In_Days1: number;
  Difference_In_Days2: number;
  minDate1: { year: number; month: number; day: number; };
  minDate2: { year: number; month: number; day: number; };
  adjHours1: any;
  Tothrs: any;
  TotWave: any;
  minDate3: any[] =[];
  agencyListingData: any;
  searchStr: string;
  agency_id: any;
  agncyDrp: boolean = false;
  SHIFT_VARIANCE_DOLLAR1: number;
  SHIFT_VARIANCE_PRS_DOLLAR1: number;
  SHIFT_VARIANCE_DOLLAR2: number;
  SHIFT_VARIANCE_PRS_DOLLAR2: number;
  agcydata: any;
  community_id: any;
  TotGroHrs: any;
  start_day2: any;
  runPrms: any;
  roleData: any=[]
  totalValues ={adjAgencyPayable:0,adjHourSchedule:0,hourSchedule:0,noOfShifts:0};
  noOfShifts: any[]=[];
  adjAgencyPayable: any[]=[];
  adjHourSchedule: any[]=[];
  hourSchedule: any[]=[];
  showDataAgency: any[]=[];
  allCommunity1: any;
  comid: any;
  allAgency: any[];
  selectAgency: any;
  allCommunityNew: any;
  comId: any;

  constructor(
    public datepipe: DatePipe,
    private loctn: Location,
    private dataService: DataService,
    private toastr: ToastrManager,
    private Apicall: ApiService,
    private _authenticationService: AuthenticationService,

    calendar: NgbCalendar
    
  ) {
    this._authenticationService.currentUser.subscribe((x: any) => {
      this.currentUser = x
      this.currentUser?.user_role == 3 || this.currentUser?.user_role == 8 ? this.getMngComunity() : this.getCommunityId()

    });
    this.getCommunityByAgencyID()
    this.getRole()

    this.fromDate = calendar.getToday();
		this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
    if(this.currentUser?.role == 'SuperAdmin'){
      this.getagenciesID()
    }else if(this.currentUser?.user_role==3)
    this.getAllAgency()
    else{
      this.getAgencyListing()
    }
  }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Reports',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Home',
            isLink: true,
            link: '/'
          },
        ]
      }
    };
    this.getAgncyDtail()
    this.mgnmntNames()
    this.getDate()
  }

  getCommunityId() {
    this.dataService.getCommunityId().subscribe((response: any) => {
      if (response['error'] == false) {
        this.allCommunity = response.body.sort(function (a, b) {
          if (a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
          if (a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
          return 0;
        });;;
      } else if (response['error'] == true) {
        this.toastr.errorToastr(response.msg);
      }
    },
      (err) => {
        this.dataService.genericErrorToaster();
      })
  }

  getCommunityByAgencyID() {
    this.dataService.getCommunityByAgencyID(this.currentUser?.user_role == 5 ? this.currentUser?.com_id : this.currentUser?.id).subscribe((response: any) => {
      if (response['error'] == false) {
        this.allCommunity1 = response.body
      } 
    },
      (err) => {
        this.dataService.genericErrorToaster();
      })
  }

  mgnmntNames() {
    this.dataService.getManagementNames().subscribe(res => {
      if (!res.error) {
        this.mngmNames = res.body.sort(function (a, b) {
          if (a.mg_name.toUpperCase() < b.mg_name.toUpperCase()) { return -1; }
          if (a.mg_name.toUpperCase() > b.mg_name.toUpperCase()) { return 1; }
          return 0;
        });;;

      } else {
        this.dataService.genericErrorToaster()
      }
    }, error => {
      this.dataService.genericErrorToaster(error)
    }
    )
  }

  goBack() {
    this.loctn.back()
  }


  onChange(event: any) {
    this.start_day = event.target.value;
    
    if(this.start_day == 'year'){
      this.disable = true;
      this.Alldata = ''
      this.AlldataAgency = ''
      this.agncyDtlTimeRept = ''
      this.start_day2 = ''
    }
    else if(this.start_day != 'year'){
      this.disable = false;
      this.Alldata = ''
      this.agncyDtlTimeRept = ''
      this.AlldataAgency = ''
      this.stDt = ''
      this.enDt = ''
      this.start_day2 = ''

    }
  }

  // onChange1(event: any){ 
  //   if(event.target.value=="0"){
  //     this.data2 = false;
  //     this.data1 = false;
  //     this.Alldata=[]
  //     this.data0=event.target.value=="0"
  //   }else if(event.target.value=="1"){
  //     this.data0 = false;
  //     this.data2 = false;
  //     this.AlldataAgency=[]
  //     this.data1=event.target.value=="1"
  //   }else{
  //     this.data1 = false;
  //     this.data0 = false;
  //     this.trendAnalysis=[]
  //     this.data2=event.target.value=="2"
  //   }
  // }
  onChange1(event: any) {
    this.data0 = event.target.value == "0"
    this.data1 = event.target.value == "1"
    this.data2 = event.target.value == "2"
    this.data3 = event.target.value == "3"

    if(this.data0 == true){
      this.AlldataAgency = ''
      this.trendAnalysis = ''
      this.agncyDtlTimeRept = ''
      this.trndRpt = false
      this.agncyDrp = false
      this.agency_id = 'undefined';
      this.stDt = ''
      this.enDt = ''
      this.enDt = ''
    }else if(this.data1 == true){
      this.Alldata = ''
      this.trendAnalysis = ''
      this.trndRpt = false
      this.agncyDrp = false
      this.agency_id = 'undefined'
      this.agncyDtlTimeRept = ''
    }else if(this.data3 == true){
      this.Alldata = ''
      this.trendAnalysis = ''
      this.trndRpt = false
      this.AlldataAgency = ''
      this.agency_id = 'undefined'
      this.agncyDrp = true
      if(this.currentUser?.user_role == 5){
        this.getAgncyDtail(this.currentUser?.com_id)
      }
    }
    else{
      this.AlldataAgency = ''
      this.Alldata = ''
      this.agncyDtlTimeRept = ''
      this.trndRpt = true
      this.fromDate = null
      this.agncyDrp = false
      this.agency_id = 'undefined'
      this.toDate = null
      this.getDate()
    }


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
          this.toastr.errorToastr(res.msg);
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
          this.toastr.errorToastr(response.msg);
        }
      }, (err) => {
        this.dataService.genericErrorToaster();
  
      })
    }
  }

  selectCommunity1(id:any){
    this.comid=id
  }

  selectCommunity(id:any){
    this.comId = id;
    
    let is_for = 'community'
    let typeDrop = true
    this.dataService.getAgency(this.searchStr= '', this.page.pageNumber, this.page.size, id,is_for,typeDrop).subscribe((res:any)=>{
      this.agencyListingData = res.body
    })
  }
  getAllAgency(){
    this.dataService.getAgencyForManagement().subscribe(res=>{
      this.agencyListingData = res.body;
      this.agency_id=res.body[0].id;
    })
  }

  submit() {
    if (this.data2 != true) {
      var date = new Date(this.stDt);
    var dateObj = moment(date, "DD/MM/YYYY").toDate().toString();
    this.start_day1 = (moment(dateObj).format("YYYY-MM-DD"));

    var date1 = new Date(this.enDt);
    var dateObj1 = moment(date1, "DD/MM/YYYY").toDate().toString();
    this.end_day = (moment(dateObj1).format("YYYY-MM-DD"));

    
    

    this.Difference_In_Time = date1.getTime() - date.getTime();
    // To calculate the no. of days between two dates
    this.Difference_In_Days = this.Difference_In_Time / (1000 * 3600 * 24);
    
  this.loadingSite = false
      if(this.start_day != 'year'){

        let today = new Date();
        let priorDate = new Date(new Date().setDate(today.getDate() - Number(this.start_day) ));
        this.today1 =   moment(today).format('YYYY-MM-DD')
        this.priorDays =   moment(priorDate).format('YYYY-MM-DD')
        
        
      }
    }
  
    

    // if(this.priorDays == 'Invalid date' && !this.data1 && !this.data2 && this.start_day == 'year'){
    //   this.timeprd = true
    //   return
    // }

    if (this.data0 == true) {

      // this.timeprd = false
      if(this.start_day == 'year'){
        this.today1 = this.enDt
        this.priorDays = this.stDt 
        this.diffInDys = true
        this.Apicall.getCurrentStatusReport(this.currentUser?.role == 'SuperAdmin' ? this.community_id : this.currentUser?.user_role == 8 || this.currentUser?.user_role == 3 ? this.comId : this.currentUser?.com_id ? this.currentUser?.com_id : this.currentUser?.role == 'Community User' ? this.currentUser?.com_id :this.currentUser?.id,  this.stDt,  this.enDt).subscribe(res => {
          this.loadingSite = false;
          if (!res.error) {
            this.Alldata = res.body
            this.SHIFT_VARIANCE= res.body[0].filledByAgency -res.body[0].agencyShiftBudget 
            this.SHIFT_VARIANCE_DOLLAR=  res.body[0].agencySpend - res.body[0].agencyShiftBudgetSpend 
            this.SHIFT_VARIANCE_PRS = (this.SHIFT_VARIANCE/ res.body[0].agencyShiftBudget)*100
            this.SHIFT_VARIANCE_PRS_DOLLAR = (this.SHIFT_VARIANCE_DOLLAR / res.body[0].agencyShiftBudgetSpend)* 100
           
          }
          else {
            this.toastr.errorToastr(res.msg)
            this.Alldata = ''
          }
        })
      } else{
        this.Apicall.getCurrentStatusReport(this.currentUser?.role == 'SuperAdmin' ? this.community_id : this.currentUser?.user_role == 8 || this.currentUser?.user_role == 3 ? this.comId : this.currentUser?.com_id ? this.currentUser?.com_id : this.currentUser?.id,this.priorDays, this.today1  ).subscribe(res => {
        this.diffInDys = false
        this.loadingSite = false;
          if (!res.error) {
            
            this.Alldata = res.body
            this.SHIFT_VARIANCE= res.body[0].filledByAgency -res.body[0].agencyShiftBudget 
            this.SHIFT_VARIANCE_DOLLAR=  res.body[0].agencySpend - res.body[0].agencyShiftBudgetSpend 
            this.SHIFT_VARIANCE_PRS = (this.SHIFT_VARIANCE/ res.body[0].agencyShiftBudget)*100
            this.SHIFT_VARIANCE_PRS_DOLLAR = (this.SHIFT_VARIANCE_DOLLAR / res.body[0].agencyShiftBudgetSpend)* 100
           
          }
          else {
            this.toastr.errorToastr(res.msg)
            this.Alldata = ''
          }
        })
      }
    }
    else if (this.data1 == true) {
      if(this.start_day == 'year'){
        this.today1 = this.enDt 
        this.priorDays =  this.stDt      
         this.diffInDys = true
         this.showDataAgency = [],
         this.totNumOfShft = 0,
        this.totHrSchld = 0,
        this.totAdjHr = 0,
        this.totAdjPay = 0,
        this.Apicall.getAgencyPositionReport(this.currentUser?.role == 'SuperAdmin' ? this.community_id : this.currentUser?.user_role==3 || this.currentUser?.user_role == 8 ? this.community_id : this.currentUser?.com_id ? this.currentUser?.com_id : this.currentUser?.role == 'Community User' ? this.currentUser?.com_id : this.currentUser?.id,  this.stDt, this.enDt).subscribe(res => {
          // 
          this.loadingSite = false;
          if (!res.error) {
            //
            res.body[0].positions.sort(function(a, b){
              if(a.toUpperCase() < b.toUpperCase()) { return -1; }
              if(a.toUpperCase() > b.toUpperCase()) { return 1; }
              return 0;
          });
            res.body[0].positions.forEach(i=>this.showDataAgency.push({show:this.changeText(i),compare:i})) 
            this.AlldataAgency = res.body[0].positions;
            
            this.AlldataAgency1 = res.body[0].data
            // this.totNumOfShft = this.AlldataAgency1?.activities_assistant?.noOfShifts + this.AlldataAgency1?.direct_care_aide?.noOfShifts + this.AlldataAgency1?.cook?.noOfShifts + this.AlldataAgency1?.registered_medication_aide?.noOfShifts + this.AlldataAgency1?.shift_supervisor?.noOfShifts
            // this.totHrSchld = this.AlldataAgency1?.activities_assistant?.hourSchedule + this.AlldataAgency1?.direct_care_aide?.hourSchedule + this.AlldataAgency1?.cook?.hourSchedule + this.AlldataAgency1?.registered_medication_aide?.hourSchedule + this.AlldataAgency1?.shift_supervisor?.hourSchedule
            // this.totAdjHr = this.AlldataAgency1?.activities_assistant?.adjHourSchedule + this.AlldataAgency1?.direct_care_aide?.adjHourSchedule + this.AlldataAgency1?.cook?.adjHourSchedule + this.AlldataAgency1?.registered_medication_aide?.adjHourSchedule + this.AlldataAgency1?.shift_supervisor?.adjHourSchedule
            // this.totAdjPay = this.AlldataAgency1?.activities_assistant?.adjAgencyPayable + this.AlldataAgency1?.direct_care_aide?.adjAgencyPayable + this.AlldataAgency1?.cook?.adjAgencyPayable + this.AlldataAgency1?.registered_medication_aide?.adjAgencyPayable + this.AlldataAgency1?.shift_supervisor?.adjAgencyPayable
           
           
            const sumData = {};
            this.AlldataAgency.forEach(position => {
              sumData[position] = {
                  "noOfShifts": 0,
                  "hourSchedule": 0,
                  "adjHourSchedule": 0,
                  "adjAgencyPayable": 0
              };
          
              // Iterate through the data for each position
              Object.keys(sumData[position]).forEach(key => {
                  sumData[position][key] += this.AlldataAgency1[position][key]
              });
          });

          // Object.keys()

          // Calculate sums
          Object.values(sumData).forEach((position:any) => {
              this.totNumOfShft += position.noOfShifts;
              this.totHrSchld += position.hourSchedule;
              this.totAdjHr += position.adjHourSchedule;
              this.totAdjPay += position.adjAgencyPayable;
          });
            
          }
          else {
            this.toastr.errorToastr(res.msg)
            this.AlldataAgency = ''
          }
        })
      }
      else{
        this.showDataAgency = [],
        this.totNumOfShft = 0,
        this.totHrSchld = 0,
        this.totAdjHr = 0,
        this.totAdjPay = 0,
        this.Apicall.getAgencyPositionReport(this.currentUser?.role == 'SuperAdmin' ? this.community_id :this.currentUser?.user_role==3 || this.currentUser?.user_role == 8 ? this.community_id :this.currentUser?.com_id ? this.currentUser?.com_id : this.currentUser?.role == 'Community User' ? this.currentUser?.com_id: this.currentUser?.id,  this.priorDays,this.today1  ).subscribe(res => {
          // 
          this.loadingSite = false;
          this.diffInDys = false
          if (!res.error) {
            // 
            res.body[0].positions.sort(function(a, b){
              if(a.toUpperCase() < b.toUpperCase()) { return -1; }
              if(a.toUpperCase() > b.toUpperCase()) { return 1; }
              return 0;
          });
            res.body[0].positions.forEach(i=>this.showDataAgency.push({show:this.changeText(i),compare:i})) 
            this.AlldataAgency = res.body[0].positions;
            this.AlldataAgency1 = res.body[0].data
            // this.totNumOfShft = this.AlldataAgency1?.activities_assistant?.noOfShifts + this.AlldataAgency1?.direct_care_aide?.noOfShifts + this.AlldataAgency1?.cook?.noOfShifts + this.AlldataAgency1?.registered_medication_aide?.noOfShifts + this.AlldataAgency1?.shift_supervisor?.noOfShifts
            // this.totHrSchld = this.AlldataAgency1?.activities_assistant?.hourSchedule + this.AlldataAgency1?.direct_care_aide?.hourSchedule + this.AlldataAgency1?.cook?.hourSchedule + this.AlldataAgency1?.registered_medication_aide?.hourSchedule + this.AlldataAgency1?.shift_supervisor?.hourSchedule
            // this.totAdjHr = this.AlldataAgency1?.activities_assistant?.adjHourSchedule + this.AlldataAgency1?.direct_care_aide?.adjHourSchedule + this.AlldataAgency1?.cook?.adjHourSchedule + this.AlldataAgency1?.registered_medication_aide?.adjHourSchedule + this.AlldataAgency1?.shift_supervisor?.adjHourSchedule
            // this.totAdjPay = this.AlldataAgency1?.activities_assistant?.adjAgencyPayable + this.AlldataAgency1?.direct_care_aide?.adjAgencyPayable + this.AlldataAgency1?.cook?.adjAgencyPayable + this.AlldataAgency1?.registered_medication_aide?.adjAgencyPayable + this.AlldataAgency1?.shift_supervisor?.adjAgencyPayable
            const sumData = {};
            this.AlldataAgency.forEach(position => {
              sumData[position] = {
                  "noOfShifts": 0,
                  "hourSchedule": 0,
                  "adjHourSchedule": 0,
                  "adjAgencyPayable": 0
              };
          
              // Iterate through the data for each position
              Object.keys(sumData[position]).forEach(key => {
                  sumData[position][key] += this.AlldataAgency1[position][key]
              });
          });

          // Object.keys()

          // Calculate sums
          Object.values(sumData).forEach((position:any) => {
              this.totNumOfShft += position.noOfShifts;
              this.totHrSchld += position.hourSchedule;
              this.totAdjHr += position.adjHourSchedule;
              this.totAdjPay += position.adjAgencyPayable;
          });
          }
          else {
            this.toastr.errorToastr(res.msg)
            this.AlldataAgency = ''
          }
        })
      }
     

    }
    else if (this.data2 == true) {
      let curStrDt = this.dateFrmtChng( this.fromDate1?.year + '-' + this.fromDate1?.month + '-' + this.fromDate1?.day)
      let curEndDt =  this.dateFrmtChng(this.toDate1?.year + '-' + this.toDate1?.month + '-' + this.toDate1?.day)
      let comprtvStrDt = this.dateFrmtChng(this.fromDate?.year + '-' + this.fromDate?.month + '-' + this.fromDate?.day)
      let comprtvEdDt =  this.dateFrmtChng(this.toDate?.year + '-' + this.toDate?.month + '-' + this.toDate?.day)

     
      this.loadingSite = true;

      this.Apicall.trendAnalysisReport(this.currentUser?.role == 'SuperAdmin' ? this.community_id : this.currentUser?.user_role == 8 || this.currentUser?.user_role == 3 ? this.comId : this.currentUser?.com_id ? this.currentUser?.com_id : this.currentUser?.role == 'Community User' ? this.currentUser?.com_id: this.currentUser?.id, curStrDt , curEndDt, comprtvStrDt,comprtvEdDt ).subscribe(res => {
        // 
      // this.timeprd = false
      this.loadingSite = false;

        if (!res.error) {
          // 
          this.trendAnalysis = res.body[0]
          this.SHIFT_VARIANCE= res.body[0].currentResult.filledByAgency - res.body[0].comparativePeriod.filledByAgency
          this.SHIFT_VARIANCE_PRS = (this.SHIFT_VARIANCE/ res.body[0].comparativePeriod.filledByAgency )*100
            this.SHIFT_VARIANCE_DOLLAR =  res.body[0].currentResult.filledByTeamMembers - res.body[0].comparativePeriod.filledByTeamMembers
            this.SHIFT_VARIANCE_PRS_DOLLAR = (this.SHIFT_VARIANCE_DOLLAR / res.body[0].comparativePeriod.filledByTeamMembers)* 100
            this.SHIFT_VARIANCE_DOLLAR1 =  res.body[0].currentResult.totalFilledShift - res.body[0].comparativePeriod.totalFilledShift 
            this.SHIFT_VARIANCE_PRS_DOLLAR1 = (this.SHIFT_VARIANCE_DOLLAR1 / res.body[0].comparativePeriod.totalFilledShift)* 100
            this.SHIFT_VARIANCE_DOLLAR2 =   res.body[0].currentResult.agencySpend - res.body[0].comparativePeriod.agencySpend
            this.SHIFT_VARIANCE_PRS_DOLLAR2 = (this.SHIFT_VARIANCE_DOLLAR2 /  res.body[0].comparativePeriod.agencySpend)* 100
          }
        else {
          this.toastr.errorToastr(res.msg)
          this.trendAnalysis = ''
        }
      })
    }
    else if (this.data3 == true) {
      if(this.start_day == 'year'){
        this.today1 = this.enDt
        this.priorDays =  this.stDt
        this.diffInDys = true
        let agId = 
        this.Apicall.agencyDetailTimeReport(this.currentUser?.role =='Agency' ? this.comid : this.currentUser?.role == 'SuperAdmin' ? this.community_id : this.currentUser?.user_role == 8 || this.currentUser?.user_role == 3 ? this.comId : this.currentUser?.role == 'Community User' ? this.currentUser?.com_id: this.currentUser?.user_role == 5 ? this.currentUser?.com_id : this.currentUser?.user_role==3 ? this.community_id: this.currentUser?.id,  this.stDt, this.enDt, this.currentUser?.role == 'Agency' ? this.currentUser?.id : this.agency_id).subscribe(res => {
          // 
          this.loadingSite = false;
          if (!res.error) {
            
            this.agncyDtlTimeRept = res.body.sort((a, b) => {
              return new Date(b.scheduleStartDate).getTime() - new Date(a.scheduleStartDate).getTime();
            });
            
              this.adjHours1 = this.agncyDtlTimeRept.reduce(
                (previousValue, currentValue) => previousValue + currentValue.adjHours,0
              );

              this.Tothrs = this.agncyDtlTimeRept.reduce(
                (previousValue, currentValue) => previousValue + currentValue.scheduleTotalHours,0
              );

              this.TotWave = this.agncyDtlTimeRept.reduce(
                (previousValue, currentValue) => previousValue + currentValue.totalWages,0
              );

              this.TotGroHrs = this.agncyDtlTimeRept.reduce(
                (previousValue, currentValue) => previousValue + currentValue.grossHours,0
              );
            
          }
          else {
            this.toastr.errorToastr(res.msg)
            this.agncyDtlTimeRept = ''
          }
        })
      }
      else{
        this.diffInDys = false
        this.Apicall.agencyDetailTimeReport(this.currentUser?.role =='Agency' ? this.comid : this.currentUser?.role == 'SuperAdmin' ? this.community_id : this.currentUser?.user_role == 8 || this.currentUser?.user_role == 3 ? this.comId :this.currentUser?.role == 'Community User' ? this.currentUser?.com_id : this.currentUser?.user_role == 5 ? this.comid :this.currentUser?.user_role==3 ? this.community_id: this.currentUser?.id,  this.priorDays || this.enDt,this.today1 || this.stDt,this.currentUser?.role == 'Agency' ? this.currentUser?.id : this.currentUser?.user_role == 5 ? this.currentUser?.com_id : this.agency_id).subscribe(res => {
          //          
           this.loadingSite = false;
          if (!res.error) {
            // 
            
            this.agncyDtlTimeRept = res.body.sort((a, b) => {
              return new Date(b.scheduleStartDate).getTime() - new Date(a.scheduleStartDate).getTime();
            });

            this.adjHours1 = this.agncyDtlTimeRept.reduce(
              (previousValue, currentValue) => previousValue + currentValue.adjHours,0
            );

            this.Tothrs = this.agncyDtlTimeRept.reduce(
              (previousValue, currentValue) => previousValue + currentValue.scheduleTotalHours,0
            );

            this.TotWave = this.agncyDtlTimeRept.reduce(
              (previousValue, currentValue) => previousValue + currentValue.totalWages,0
            );

            this.TotGroHrs = this.agncyDtlTimeRept.reduce(
              (previousValue, currentValue) => previousValue + currentValue.grossHours,0
            );
          }
          else {
            this.toastr.errorToastr(res.msg)
            this.agncyDtlTimeRept = ''
          }
        })
      }
    }
    this.start_day2 = this.start_day =='year' ? this.start_day : Number(this.start_day)
    this.start_day2 = this.start_day =='year' ? this.start_day : this.start_day2 +=1
    this.Difference_In_Days +=1
    
    // this.onChange1(1)
    // var today = new Date()
    // 
    // this.start_day = this.datepipe.transform(today, "yyyy-MM-dd")
    // 
    // let dte = new Date();
    // dte.setDate(dte.getDate() - 30);
    // this.end_day = dte.toString();
    // 
    // this.end_day = this.datepipe.transform(this.end_day, "yyyy-MM-dd")
    // 
    // this.Apicall.getCurrentStatusReport(this.currentUser?.id, this.start_day, this.end_day).subscribe(res => {
    //   // 
    //   if (res.msg == "Success") {
    //     // 
    //     this.Alldata = res.body
    //     
    //   }
    //   else {
    //     (res.error[0])
    //   }
    // })
  }

  // updateTotals(position:any) {
  //   if (this.AlldataAgency1) {
  //     this.totNumOfShft += this.AlldataAgency1.noOfShifts;
  //     this.totHrSchld += this.AlldataAgency1.hourSchedule;
  //     this.totAdjHr += this.AlldataAgency1.adjHourSchedule;
  //     this.totAdjPay += this.AlldataAgency1.adjAgencyPayable;
  //   }
  // }

  export(): void {
    let element = document.getElementById(this.data0 == true ? "demo" : this.data1 == true ? 'demo1' : 'demo2');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element)
    const wb: XLSX.WorkBook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, this.filename)
  }

  onDateSelection(date: NgbDate,data) {
    if(data == false){
      if (!this.fromDate && !this.toDate) {
        this.fromDate = date;
      } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
        this.toDate = date;
      } else {
        this.toDate = null;
        this.fromDate = date;
      }
    }
    let dt = new Date(this.fromDate?.year + '-' + this.fromDate?.month + '-' + this.fromDate?.day);
      var dateObj = moment(dt, "DD/MM/YYYY").toDate().toString();
      this.start_day = (moment(dateObj).format("YYYY-MM-DD"));
      if(!this.toDate){
        return
      }
      let  dt1 = new Date(this.toDate?.year + '-' + this.toDate?.month + '-' + this.toDate?.day);
      var dateObj1 = moment(dt1, "DD/MM/YYYY").toDate().toString();
      this.end_day = (moment(dateObj1).format("YYYY-MM-DD"));
  
      
      
  
      this.Difference_In_Time = dt1.getTime() - dt.getTime();
      // To calculate the no. of days between two dates
      let dt12 = JSON.stringify( this.Difference_In_Time / (1000 * 3600 * 24))
      this.Difference_In_Days1 = parseInt(dt12) ;

      // this.Difference_In_Days1 = parseInt(Number( this.Difference_In_Time / (1000 * 3600 * 24)));
      
		
	}

	isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }



  currentDateSelection1(date: NgbDate,data) {
    if(data == true){
      if (!this.fromDate1 && !this.toDate1) {
        this.fromDate1 = date;
      } else if (this.fromDate1 && !this.toDate1 && date.after(this.fromDate1)) {
        this.toDate1 = date;
      } else {
        this.toDate1 = null;
        this.fromDate1 = date;
      }
      
      this.minDate2 = { year: parseInt(JSON.stringify( this.fromDate1?.year)), month: parseInt(JSON.stringify( this.fromDate1?.month)), day: parseInt(JSON.stringify( this.fromDate1?.day)) }
      let dt = new Date(this.fromDate1?.year + '-' + this.fromDate1?.month + '-' + this.fromDate1?.day);
      var dateObj = moment(dt, "DD/MM/YYYY").toDate().toString();
      this.start_day = (moment(dateObj).format("YYYY-MM-DD"));
      
      if(!this.toDate1){
        return
      }
      let  dt1 = new Date(this.toDate1?.year + '-' + this.toDate1?.month + '-' + this.toDate1?.day);
      var dateObj1 = moment(dt1, "DD/MM/YYYY").toDate().toString();
      this.end_day = (moment(dateObj1).format("YYYY-MM-DD"));
  
      
      
  
      this.Difference_In_Time = dt1.getTime() - dt.getTime();
      // To calculate the no. of days between two dates
      let dt12 = JSON.stringify( this.Difference_In_Time / (1000 * 3600 * 24))
      this.Difference_In_Days2 = parseInt(dt12) ;
      
    }
		
	}

	currentisHovered1(date: NgbDate,) {
		return (
			this.fromDate1 && !this.toDate1 && this.hoveredDate1 && date.after(this.fromDate1) && date.before(this.hoveredDate1)
		);
	}

	currentisInside1(date: NgbDate) {
		return this.toDate1 && date.after(this.fromDate1) && date.before(this.toDate1);
	}

	currentisRange1(date: NgbDate) {
		return (
			date.equals(this.fromDate1) ||
			(this.toDate1 && date.equals(this.toDate1)) ||
			this.currentisInside1(date) ||
			this.currentisHovered1(date)
		);
	}

  getDate() {
    let todayDate: any = new Date();
    let toDate: any = todayDate.getDate();
    if (toDate < 10) {
      toDate = '0' + toDate
    }
    let month = todayDate.getMonth() + 1;
    if (month < 10) {
      month = '0' + month;
    }
    let year = todayDate.getFullYear();
    if(this.data2 == true){
      this.minDate1 = { year: year, month: month, day: toDate }
      this.minDate3 =[ { year: parseInt(year), month: parseInt(month), day: parseInt(toDate) }]
    }else{
      this.minDate = year + '-' + month + '-' + toDate
    }
  }

  // isDisabled=(date:NgbDateStruct,current: {month: number,year:number})=> {
  //   //in current we have the month and the year actual
  //   return this.minDate3.find(x=>new NgbDate(x.year,x.month,x.day).equals(date))?
  //        true:false;
  // }

  getAgencyListing(){
    let community_id = this.currentUser?.com_id ? this.currentUser?.com_id : this.currentUser?.id
    let is_for = 'community'
    let typeDrop = true
    this.dataService.getAgency(this.searchStr= '', this.page.pageNumber, this.page.size, community_id,is_for,typeDrop).subscribe((res:any)=>{
      this.agencyListingData = res.body
    })
  }

  getagenciesID() {
    this.dataService.agenciesID().subscribe((response: any) => {
      if (response['error'] == false) {
        this.agencyListingData = response.body.sort(function(a, b){
          if(a.agency_name.toUpperCase() < b.agency_name.toUpperCase()) { return -1; }
          if(a.agency_name.toUpperCase() > b.agency_name.toUpperCase()) { return 1; }
          return 0;
      });
        //this.toastr.successToastr(response.msg);
      } else if (response['error'] == true) {
        this.toastr.errorToastr(response.msg);
      }
    },
      (err) => {
        this.dataService.genericErrorToaster();
      })
  }

  getAgncyDtail(id?) {
    this.dataService.getAgenciesByID(id ? id :this.currentUser?.id).subscribe((res: any) => {
      if (!res.error) {
        this.agcydata = res.body[0];
        id ? this.agencyListingData = res.body : ''
  
      }
      else {
        this.toastr.errorToastr(res.msg)
      }
    }, (err) => {
      this.dataService.genericErrorToaster()
    })
  }

  getPrmsnData(){
    this.dataService.getPermissionByAdminRole().subscribe(
      (res:any) => {
        if (!res.error) {
        res.body.map(i=>{
          // comunity , agency
            if(this.roleData.includes(i.role_id)){
              if(i.trak_type == '1')
              if(i.permission_name == 'Reports'){
                this.runPrms  = i.run_permission
             
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
    this.dataService.getAllRole().subscribe((res:any)=>{
      if(!res.err){
        // 
         res.body.filter(i=>{ this.roleData.push(i.id.toString())})
        this.getPrmsnData()
        
      }
    },err=>{
      this.dataService.genericErrorToaster()
    })
  }


  dateFrmtChng(date){
    let dt1 = new Date(date);
    var dt = new Date(dt1.getTime() + dt1.getTimezoneOffset() * 60000);
    var dateObj = moment(dt, "DD/MM/YYYY").toDate().toString();
    let start_day = (moment(dateObj).format("YYYY-MM-DD"));
    return start_day
  }
  changeText(string){
    let words = string.split('_').map(function(word) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });

    return words.join(' ');
  }


}
