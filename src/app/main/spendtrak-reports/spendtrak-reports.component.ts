import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbDate, NgbDateStruct, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'app/auth/service';
import { ApiService } from 'app/auth/service/api.service';
import { DataService } from 'app/auth/service/data.service';
import { Page } from 'app/utils/models';
import moment from 'moment';
import { ToastrManager } from 'ng6-toastr-notifications';
import * as XLSX from 'xlsx'

@Component({
  selector: 'app-spendtrak-reports',
  templateUrl: './spendtrak-reports.component.html',
  styleUrls: ['./spendtrak-reports.component.scss']
})
export class SpendtrakReportsComponent implements OnInit {

  public contentHeader: object;
  allCommunity: any = []
  mngmNames: any;
  public start_day: any
  public end_day: any
  public subtract_day: any
  public Difference_In_Days: any
  crrntUsrId: any[] = []
  currentUser: any;
  Alldata: any=[]
  AlldataAgency: any;
  trendAnalysis: any;
  filename = "export-data.xlsx";
  @ViewChild('addExp') addExp: ElementRef<any>;
  @ViewChild('UserLiST') UserLiST: ElementRef<any>;
  data0: boolean = false
  data1: boolean = false
  data2: boolean = false
  data3: boolean = false
  data4: boolean = false
  data5: boolean = false
  data6: boolean = false
  data7: boolean = false
  data8: boolean = false;
  btnShow : boolean = false;
  public page = new Page();
  slctDprt :any
  listOfYears: number[];
  mL = [{val :'January',id:'01'},{val :'February',id:'02'}, {val :'March',id:'03'},{val :'April',id:'04'}, {val :'May',id:'05'}, {val :'June',id:'06'}, {val :'July',id:'07'}, {val :'August',id:'08'}, {val :'September',id:'09'}, {val :'October',id:'10'}, {val :'November',id:'11'}, {val :'December',id:'12'}];


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
  totNumOfShft: any;
  totHrSchld: any;
  totAdjHr: any;
  totAdjPay: any;
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
  dprtmnt: any[];
  slctYr: any;
  slcMnt: any;
  getCurrentYear: number;
  mt: string;
  sym: any;
  expltnBool: any;
  rowdata: any;
  expltn: any;
  slctCom: any;

  ntbgt: boolean =false;
  mnth: any;
  month: any;
  mn2: any;
  yr: string;
  Alldata1: any=[];
  roleData1: any=[];
  roleData2: any=[];
  year: any;
  comName: any;
  DailyShowCounts: boolean;
  residentDays: any;
  residentCounts: number;


  constructor(
    private loctn: Location,
    private dataService: DataService,
    private toastr: ToastrManager,
    private Apicall: ApiService,
    private _authenticationService: AuthenticationService,
    private modalService: NgbModal,
    
  ) {
    this.getDate()
    this._authenticationService.currentUser.subscribe((x: any) => {
      this.currentUser = x
      
    });
    this.getRole()
    if(this.currentUser.prmsnId == '1'){
      this.getDepartment(this.currentUser.id)
    }
    if([3,6,8].includes(this.currentUser.user_role) ){
      this.getagenciesID()
      this.mt = "col-6 mt-1"
    }else{
      this.getAgencyListing()
      this.mt = "col-6 mt-0"
      this.getRole()
    }
    this.getCommDetls()
  }

  ngOnInit(): void {
    // this.contentHeader = {
    //   headerTitle: 'spendtrak Reports',
    //   actionButton: false,
    //   breadcrumb: {
    //     type: '',
    //     links: [
    //       {
    //         name: 'Home',
    //         isLink: true,
    //         link: '/'
    //       },
    //     ]
    //   }
    // };
    this.getCurrentYear = new Date().getFullYear(); // current year
    this.listOfYears = Array.from({length: 3}, (_, i) => this.getCurrentYear - i);
    this.getAgncyDtail()
    this.getCommunityId()
    this.mgnmntNames()
  }

  getCommunityId() {
    if(this.currentUser.prmsnId == '6'){

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
    }else{
      if(this.currentUser.id && this.currentUser.com_id){
        let data = {
          userId : this.currentUser.id,
          mangId : this.currentUser.com_id
        }
        this.dataService.getManagementUserCommunities(data).subscribe((res: any) => {
          if (!res.error) {
            // this.mangComs = res.body[1].userAvailableCommunities
            this.allCommunity = res.body[0].user_added_communities.sort(function(a, b){
              if(a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
              if(a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
              return 0;
          })  ;
          // this.com_name =  this.allCommunity[0]?.community_id
          } else {
            this.toastr.errorToastr(res.msg);
          }
        },
          (err) => {
            this.dataService.genericErrorToaster();
          })
      }
      else{
        this.dataService.getMNMGcommunity(this.currentUser.id).subscribe((response: any) => {
          if (response['error'] == false) {
            this.allCommunity = response.body.sort(function(a, b){
              if(a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
              if(a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
              return 0;
          })  ;
          // this.com_name =  this.allCommunity[0]?.cp_id
            //this.toastr.successToastr(response.msg);
          } else if (response['error'] == true) {
            this.toastr.errorToastr(response.msg);
          }
        }, (err) => {
          this.dataService.genericErrorToaster();
    
        })
      }
    }
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
      this.Alldata = []
      this.AlldataAgency = ''
      this.agncyDtlTimeRept = ''
      this.start_day2 = ''
    }
    else if(this.start_day != 'year'){
      this.disable = false;
      this.Alldata = []
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
    this.data4 = event.target.value == "4"
    this.data5 = event.target.value == "5"
    this.data6 = event.target.value == "6"
    this.data7 = event.target.value == "7"
    this.data8 = event.target.value == "8"
    if(event.target.value == "6")
      this.DailyShowCounts = true
    else
    this.DailyShowCounts = false


    if(this.data0 == true){
      this.stDt  = ''
      this.enDt  = ''
      this.mnth = 'undefined'
      this.yr = 'undefined'
    }else if(this.data1 == true){
      this.Alldata = []
      this.timeprd = false
    }else if(this.data3 == true){
      this.Alldata = []
    }
    else if(this.data4 == true){
      // this.Alldata = []
      this.agncyDtlTimeRept = ''
      // this.trndRpt = true
      this.fromDate = null
      // this.agncyDrp = false
      this.agency_id = 'undefined'
      this.toDate = null
      this.getDate()
    }
    else if(this.data5 == true){
      this.Alldata = []
    }
    else if(this.data6 == true){
      this.Alldata = []
    }
    else if(this.data7 == true){
      this.Alldata = []
    }
    else if(this.data8 == true){
      this.Alldata = []
    }
    else{
      this.Alldata = []
    }
  }

  submit() {
    if(!this.data4 && !this.data0){
      if(!this.mnth){
        this.timeprd = true
        return;
      }else{
        this.timeprd = false
      }
    }
   
    if (this.data4 != true) {
      var date = new Date(this.stDt);
    var dateObj = moment(date, "DD/MM/YYYY").toDate().toString();
    this.start_day1 = (moment(dateObj).format("YYYY-MM-DD"));

    var date1 = new Date(this.enDt);
    var dateObj1 = moment(date1, "DD/MM/YYYY").toDate().toString();
    this.end_day = (moment(dateObj1).format("YYYY-MM-DD"));

    
    

    this.Difference_In_Time = date1.getTime() - date.getTime();
    // To calculate the no. of days between two dates
    this.Difference_In_Days = this.Difference_In_Time / (1000 * 3600 * 24);
    

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

        this.Apicall.reportingGetVendor([3,6,8].includes(this.currentUser.user_role)  ? this.community_id : this.currentUser.com_id ? this.currentUser.com_id : this.currentUser.id, this.stDt ,this.enDt ).subscribe(res => {
        this.diffInDys = false
          if (!res.error) {
            
            this.Alldata = res.body
            // .filter(i=>{if(i.contract_uploaded == 'Y'){ return i}})
           
          }
          else {
            this.toastr.errorToastr(res.msg)
            this.Alldata = []
          }
        })
    }
    else if (this.data1 == true) {
        this.Apicall.reportingGetVendor([3,6,8].includes(this.currentUser.user_role)  ? this.community_id :this.currentUser.com_id ? this.currentUser.com_id :  this.currentUser.id,  this.stDt,this.enDt  ).subscribe(res => {
          // 
          this.diffInDys = false
          if (!res.error) {
            // 
            this.Alldata = res.body.filter(i=>{if(i.contract_uploaded == 'N'){ return i}})
          }
          else {
            this.toastr.errorToastr(res.msg)
            this.Alldata = []
          }
        })
     

    }
    else if (this.data2 == true) {
     
      this.Apicall.notFinalReport([3,6,8].includes(this.currentUser.user_role) ? this.community_id : this.currentUser.com_id ? this.currentUser.com_id : this.currentUser.id, this.stDt,this.enDt ).subscribe(res => {
      
        if (!res.error) {
          this.Alldata = res.body
          }
        else {
          this.toastr.errorToastr(res.msg)
          this.Alldata = []
      
        }
      })
    }
    else if (this.data3 == true) {
      let id =  this.currentUser.role =='Agency' ?   this.agcydata.community_id  : [3,6,8].includes(this.currentUser.user_role) ? this.community_id : this.roleData2.includes(this.currentUser.prmsnId) ? this.currentUser.com_id : this.currentUser.id
        this.Apicall.spendTrendReport(id,  this.stDt, this.enDt,this.slctDprt ).subscribe(res => {
          // 
          if (!res.error) {
            // 
            this.Alldata = res.body
            
          }
          else {
            this.toastr.errorToastr(res.msg)
            this.Alldata = []
          }
        })
    
    }
    else if (this.data4 == true) {
      let curStrDt = this.dateFrmtChng( this.fromDate1?.year + '-' + this.fromDate1?.month + '-' + this.fromDate1?.day)
      let curEndDt =  this.dateFrmtChng(this.toDate1?.year + '-' + this.toDate1?.month + '-' + this.toDate1?.day)
      let comprtvStrDt = this.dateFrmtChng(this.fromDate?.year + '-' + this.fromDate?.month + '-' + this.fromDate?.day)
      let comprtvEdDt =  this.dateFrmtChng(this.toDate?.year + '-' + this.toDate?.month + '-' + this.toDate?.day)

      
      this.Apicall.comparativePeriodDate(this.currentUser.role =='Agency' ?   this.agcydata.community_id  : [3,6,8].includes(this.currentUser.user_role)  ? this.community_id : this.roleData2.includes(this.currentUser.prmsnId) ? this.currentUser.com_id : this.currentUser.id,this.slctDprt,  curStrDt , curEndDt, comprtvStrDt,comprtvEdDt ).subscribe(res => {
        // 
        if (!res.error) {
          // 
          this.Alldata = res.body
          
        }
        else {
          this.toastr.errorToastr(res.msg)
          this.Alldata = []
        }
      })
  
  }
  else if (this.data5 == true) {
      
    this.Apicall.monthlySpendReport(this.currentUser.role =='Agency' ?   this.agcydata.community_id  : this.currentUser.role == 'SuperAdmin' ? this.community_id : this.currentUser.id,  this.stDt, this.enDt, ).subscribe(res => {
      // 
      if (!res.error) {
        // 
        this.Alldata = res.body
        
      }
      else {
        this.toastr.errorToastr(res.msg)
        this.Alldata = []
      }
    })

}
else if (this.data6 == true) {
      
  this.Apicall.monthlyDepReport(this.currentUser.role =='Agency' ?   this.agcydata.community_id  : [3,6,8].includes(this.currentUser.user_role)  ? this.community_id : this.roleData2.includes(this.currentUser.prmsnId) ? this.currentUser.com_id : this.currentUser.id,this.slctDprt,this.stDt, this.enDt, ).subscribe(res => {
    // 
    if (!res.error) {
      // 
      this.Alldata = res.body.result1
      this.Alldata.map(i=>{
        i.vrnce =  Number(i.total_amount) - Number(i.budget)
        i.YTDvrnce =  Number(i.ytd_actual) - Number(i.YE_total)
        // if(i?.vrnce && !i?.vrnce.toString().includes('-')){
        //   i.ntbgt = true
        // }
        // else{
        //   i.ntbgt = false
        // }
     })
     if(res.body.result2){
      if(this.mnth =='01'){
        this.residentDays = res.body.result2[0].january
        this.residentCounts = res.body.result2[0].january * 31
      }
      else if(this.mnth =='02'){
        this.residentDays = res.body.result2[0].february
        this.residentCounts = res.body.result2[0].february * 28
      }
      else if(this.mnth =='03'){
        this.residentDays = res.body.result2[0].march
        this.residentCounts = res.body.result2[0].march * 31
      }
      else if(this.mnth =='04'){
        this.residentDays = res.body.result2[0].april
        this.residentCounts = res.body.result2[0].april*30
      }
      else if(this.mnth =='05'){
        this.residentDays = res.body.result2[0].may
        this.residentCounts = res.body.result2[0].may*31
      }
      else if(this.mnth =='06'){
        this.residentDays = res.body.result2[0].june
        this.residentCounts = res.body.result2[0].june*30
      }
      else if(this.mnth =='07'){
        this.residentDays = res.body.result2[0].july
        this.residentCounts = res.body.result2[0].july*31
      }
      else if(this.mnth =='08'){
        this.residentDays = res.body.result2[0].august
        this.residentCounts = res.body.result2[0].august*31
      }
      else if(this.mnth =='09'){
        this.residentDays = res.body.result2[0].september
        this.residentCounts = res.body.result2[0].september*30
      }
      else if(this.mnth =='10'){
        this.residentDays = res.body.result2[0].october
        this.residentCounts = res.body.result2[0].october*31
      }
      else if(this.mnth =='11'){
        this.residentDays = res.body.result2[0].november
        this.residentCounts = res.body.result2[0].november*30
      } else if(this.mnth =='12'){
        this.residentDays = res.body.result2[0].december
        this.residentCounts = res.body.result2[0].december*31
      }
     }

    }
    else {
      this.toastr.errorToastr(res.msg)
      this.Alldata = []
    }
  })

}
else if (this.data7 == true) {
      
  this.Apicall.VarianceReports(this.currentUser.role =='Agency' ?   this.agcydata.community_id  : [3,6,8].includes(this.currentUser.user_role)  ? this.community_id : this.roleData2.includes(this.currentUser.prmsnId) ? this.currentUser.com_id : this.currentUser.id,this.slctDprt,this.stDt, this.enDt, ).subscribe(res => {
    // 
    if (!res.error) {
      // 
      this.Alldata = res.body.fynl.result1.filter(i=>{
        if(i.budget) {return i}
      })
      this.sym =  res.body.vrnc
      this.Alldata.map(i=>{
        i.vrnce =  Number(i.total_amount) - Number(i.budget)
        // if(i?.vrnce && !i?.vrnce.toString().includes('-')){
        //   i.ntbgt = true
        // }
        // else{
        //   i.ntbgt = false
        // }
        if(i?.need_exp && i?.need_exp == '1'){
          i.bgChng = true
        }
        else{
          i.bgChng = false
        }
     })
      
    }
    else {
      this.toastr.errorToastr(res.msg)
      this.Alldata = []
    }
  })

}
else if (this.data8 == true) {
      
  this.Apicall.reciptReports(this.currentUser.role =='Agency' ?   this.agcydata.community_id  : [3,6,8].includes(this.currentUser.user_role)  ? this.community_id : this.roleData2.includes(this.currentUser.prmsnId) ? this.currentUser.com_id : this.currentUser.id,this.slctDprt,this.stDt, this.enDt, ).subscribe(res => {
    // 
    if (!res.error) {
      this.Alldata = res.body
    }
    else {
      this.toastr.errorToastr(res.msg)
      this.Alldata = []
    }
  })

}
    // this.start_day2 = this.start_day =='year' ? this.start_day : Number(this.start_day)
    // this.start_day2 = this.start_day =='year' ? this.start_day : this.start_day2 +=1
    // this.Difference_In_Days +=1
    
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
    // this.Apicall.getCurrentStatusReport(this.currentUser.id, this.start_day, this.end_day).subscribe(res => {
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


  export(): void {
    let element = document.getElementById("demo");
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
      // var dateObj = moment(dt, "DD/MM/YYYY").toDate().toString();
      // this.start_day = (moment(dateObj).format("YYYY-MM-DD"));
      if(!this.toDate){
        return
      }
      let  dt1 = new Date(this.toDate?.year + '-' + this.toDate?.month + '-' + this.toDate?.day);
      // var dateObj1 = moment(dt1, "DD/MM/YYYY").toDate().toString();
      // this.end_day = (moment(dateObj1).format("YYYY-MM-DD"));
  
      
      
  
      this.Difference_In_Time = Math.floor((Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) - Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate()) ) /(1000 * 60 * 60 * 24));
      // To calculate the no. of days between two dates
      // let dt12 = JSON.stringify( this.Difference_In_Time / (1000 * 3600 * 24))
      this.Difference_In_Days1 = this.Difference_In_Time ;

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
      // var dateObj = moment(dt, "DD/MM/YYYY").toDate().toString();
      // this.start_day = (moment(dateObj).format("YYYY-MM-DD"));
      
      if(!this.toDate1){
        return
      }
      let  dt1 = new Date(this.toDate1?.year + '-' + this.toDate1?.month + '-' + this.toDate1?.day);
      // var dateObj1 = moment(dt1, "DD/MM/YYYY").toDate().toString();
      // this.end_day = (moment(dateObj1).format("YYYY-MM-DD"));
  
      
      
  
      this.Difference_In_Time = Math.floor((Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) - Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate()) ) /(1000 * 60 * 60 * 24));
      // To calculate the no. of days between two dates
      // let dt12 = JSON.stringify( this.Difference_In_Time / (1000 * 3600 * 24))
      this.Difference_In_Days2 = this.Difference_In_Time ;
      
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
    this.month = todayDate.getMonth() + 1;
    if (this.month < 10) {
      this.month = '0' + this.month;
      this.mnth = this.month
    }
    this.year = todayDate.getFullYear();
    this.yr = this.year
    this.chngYr(this.yr)
    if(this.data4 == true){
      this.minDate1 = { year: parseInt(this.year), month: parseInt(this.month), day: parseInt(toDate) }
      this.minDate3 =[ { year: parseInt(this.year), month: parseInt(this.month), day: parseInt(toDate) }]
    }
  }

  isDisabled=(date:NgbDateStruct,current: {month: number,year:number})=> {
    //in current we have the month and the year actual
    return this.minDate3.find(x=>new NgbDate(x.year,x.month,x.day).equals(date))?
         true:false;
  }

  getAgencyListing(){
    let community_id = this.currentUser.com_id ? this.currentUser.com_id : this.currentUser.id
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

  getAgncyDtail() {
    this.dataService.getAgenciesByID(this.currentUser.id).subscribe((res: any) => {
      if (!res.error) {
        this.agcydata = res.body[0]
  
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
              if(i.permission_name == 'Reports'){
                this.runPrms  = i.run_permission
              }
              if(i.permission_name == 'Department'){
                if(i.trak_type == '0'|| i.trak_type == '1'){
                  this.dprtmnt=JSON.parse(i.row_data);
                  this.dprtmnt =  this.dprtmnt.sort(function(a, b){
                    if(a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
                    if(a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
                    return 0;
                });
                }
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
    this.dataService.getAllRole( ).subscribe((res:any)=>{
      if(!res.err){
        // 
         res.body.filter(i=>{ this.roleData.push(i.id.toString())})
         this.roleData.map(i=>{
          if(i != 2 && i != 3  && i != 4 && i != 5 && i != 6 ){
            this.roleData1.push(i)
          }
          if(i != 1 && i != 2 && i != 3  && i != 4 && i != 5 && i != 6 ){
            this.roleData2.push(i)
          }
         })
         if(this.roleData2.includes(this.currentUser.prmsnId )){
          this.getPrmsnData()
        }
        
      }
    },err=>{
      this.dataService.genericErrorToaster()
    })
  }


  dateFrmtChng(date){
    let dt = new Date(date);
    var dateObj = moment(dt, "DD/MM/YYYY").toDate().toString();
    let start_day = (moment(dateObj).format("YYYY-MM-DD"));
    return start_day
  }

  chngCom(val){
    this.slctCom = val
    // if(this.data3 || this.data4 || this.data6 || this.data7 || this.data8){
      this.getDepartment(val)
    // }
    this.allCommunity.filter(i=>{
      let id = i.cp_id ||  i.id
      if(this.community_id == id){
        this.comName = i.community_name
      }
    })    
  }

  getDepartment(e){
    this.dprtmnt =[]
    let isfor =  6
    let for_other = null
    this.dataService.getDepartmentListing(e,isfor,for_other).subscribe((res:any)=>{
      this.dprtmnt = res.body.sort(function(a, b){
        if(a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
        if(a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
        return 0;
    });
    
    },err=>{
      this.toastr.errorToastr('Something went wrong please try again leter')
    })
  }

  // chngYr(value){
  //   this.slctYr = value
  // }

  // chngMnt(value){
  //   this.slcMnt = value 
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
  }

  subExp(modal){
    if(this.expltnBool == true){
      let data = {
        community_id: this.currentUser.prmsnId == 1 ? this.currentUser.id : this.slctCom,
        gl_acc : this.rowdata.GLA_id,
        department : this.rowdata.department,
        explanation : this.expltn,
        spend_id :  this.rowdata.id,
        year : this.minDate,
        month : this.mn2
      }
      this.dataService.addDepartmentExplanation(data).subscribe((response: any) => {
        if (response['error'] == false) {
          this.closeded(modal)
          this.submit()
        } else if (response['error'] == true) {
          this.toastr.errorToastr(response.msg);
        }
      }, (err) => {
        this.dataService.genericErrorToaster();
  
      })
    }
    else{
      let data = {
        id : this.rowdata.dsId,
        explanation : this.expltn,
        
      }
      this.dataService.updateDepartmentExplanation(data).subscribe((response: any) => {
        if (response['error'] == false) {
          this.closeded(modal)
          this.submit()
        } else if (response['error'] == true) {
          this.toastr.errorToastr(response.msg);
        }
      }, (err) => {
        this.dataService.genericErrorToaster();
  
      })
    }
  }

  Cancle(modal){
    this.closeded(modal)
  }

  addEx(row){
    this.rowdata = row
    this.expltn = row.department_summary
    this.expltnBool = row.department_summary == null ? true: false
    this.modalOpenOSE(this.addExp, 'lg');
  }

  chngMnt(mnth){
    this.mn2 = mnth || this.mnth
switch (this.mn2) {
    case '01':
      this.stDt = this.minDate + '-' + '01' + '-' + '01'
      this.enDt = this.minDate + '-' + '01' + '-' + '31'
        break;
    case '02':
      this.stDt = this.minDate + '-' + '02' + '-' + '01'
      this.enDt = this.minDate + '-' + '02' + '-' + '28'
        break;
    case '03':
      this.stDt = this.minDate + '-' + '03' + '-' + '01'
      this.enDt = this.minDate + '-' + '03' + '-' + '31'
        break;
    case '04':
      this.stDt = this.minDate + '-' + '04' + '-' + '01'
      this.enDt = this.minDate + '-' + '04' + '-' + '30'
        break;
    case '05':
      this.stDt = this.minDate + '-' + '05' + '-' + '01'
      this.enDt = this.minDate + '-' + '05' + '-' + '31'
        break;
    case '06':
      this.stDt = this.minDate + '-' + '06' + '-' + '01'
      this.enDt = this.minDate + '-' + '06' + '-' + '30'
        break;
    case '07':
      this.stDt = this.minDate + '-' + '07' + '-' + '01'
      this.enDt = this.minDate + '-' + '07' + '-' + '31'
        break;
         case '08':
           this.stDt = this.minDate + '-' + '08' + '-' + '01'
      this.enDt = this.minDate + '-' + '08' + '-' + '31'
        break;
        case '09':
             this.stDt = this.minDate + '-' + '09' + '-' + '01'
      this.enDt = this.minDate + '-' + '09' + '-' + '30'
          break;
          case '10':
               this.stDt = this.minDate + '-' + '10' + '-' + '01'
      this.enDt = this.minDate + '-' + '10' + '-' + '31'
            break;
            case '11':
                 this.stDt = this.minDate + '-' + '11' + '-' + '01'
      this.enDt = this.minDate + '-' + '11' + '-' + '30'
              break;
             
    default:
           this.stDt = this.minDate + '-' + '12' + '-' + '01'
      this.enDt = this.minDate + '-' + '12' + '-' + '31'
        break;
}
  }

  chngYr(yr){
    this.minDate = yr
    this.chngMnt(this.mn2)
  }

  recModal(receipt_id){
    this.modalOpenOSE(this.UserLiST, 'lg');
    this.Apicall.reciptIdReports(receipt_id).subscribe(res => {
      if (!res.error) {
        this.Alldata1 = res.body
      }
      else {
        this.toastr.errorToastr(res.msg)
      }
    })
  
  }

  getCommDetls(){
    if(this.currentUser.prmsnId =='1'){
      this.dataService.getcommunityById(this.currentUser.id).subscribe((res: any) => {
          this.comName = res.body[0].community_name
      })
    }
  }

}
