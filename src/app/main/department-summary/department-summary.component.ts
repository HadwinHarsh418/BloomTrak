import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import moment from 'moment';
import { ToastrManager } from 'ng6-toastr-notifications';
import * as uuid from 'uuid'

@Component({
  selector: 'app-department-summary',
  templateUrl: './department-summary.component.html',
  styleUrls: ['./department-summary.component.scss'],
  providers : [DatePipe]
})
export class DepartmentSummaryComponent implements OnInit {
  getRowClass = (row) => {    
    return {
      'row-color1': row.need_exp == 1,
      'row-color2': row.need_exp != 1,
    };
   }

  dprtmnt: any = []
  currentUser: any;
  getCurrentYear: number;
  listOfYears: number[];
   mL = [{val :'January',id:'01'},{val :'February',id:'02'}, {val :'March',id:'03'},{val :'April',id:'04'}, {val :'May',id:'05'}, {val :'June',id:'06'}, {val :'July',id:'07'}, {val :'August',id:'08'}, {val :'September',id:'09'}, {val :'October',id:'10'}, {val :'November',id:'11'}, {val :'December',id:'12'}];
  allCommunity: any =[]
  colmn: string;
  slctCom: any;
  asRcount:any;
  addPrms :any;
  dltPrms :any;
  aplyPrms :any;
  vwPrms :any;
  edtPrms :any;
  slctDpt: any;
  slctYr: any;
  rows: any =[]
  vrnce: number;
  @ViewChild('addExp') addExp: ElementRef<any>;
  @ViewChild('addRec') addRec: ElementRef<any>;
  @ViewChild('rfp') rfp: ElementRef<any>;
  @ViewChild('gltablesss') gltablesss: ElementRef<any>;
  updResVal:any
  rowdata: any;
  slcMnt: any;
  frstDp: any;
  frsCom: any;
  dataByCom: any = [{actual:0,totBudget:0,totVarnc:0,actual_ytd:0,totBudget_ytd:0,totVarnc_ytd:0}]
  btnShow: boolean = false;
  roleData: any=[]
  roleData1: any =[]
  roleData2: any=[]
  expltn:any
  expltnBool: any;
  curMnt: any;
  minDate: any;
  formRoleData: any;
  vendorData: any[];
  ledgerData: any[];
  loadSpinner: boolean;
  paymentType: any[];
  rowData: any;
  comName: any;
  lastDay: Date;
  ledgerData1: any[];
  dsbFld: any;
  custmDt: any;
  currYear: any;
  userName: any;
  boolVal: boolean;
  glPage:number = 0;
  glPageEvent:any={count: 0, pageSize: 10, limit: 10, offset: 0};
  assPrms: any;
  // actual: number=0;
  // totBudget: number = 0;
  // totVarnc: number = 0;
  // actual_ytd: number = 0;
  // totBudget_ytd: number = 0;
  // totVarnc_ytd: number = 0;
  resValCal: any;
  rows2: any;
  FnlreconciliationText: any;
  rows1: any=[];

  constructor(
    private _authenticationService : AuthenticationService,
    private dataSrv : DataService,
    private toaster : ToastrManager,
    private modalService: NgbModal,
    private formBuilder : FormBuilder,
    private datePipe : DatePipe
  ) { 
    this.getDate1('')
    this.getDate()
    this._authenticationService.currentUser.subscribe((x: any) => {
      this.currentUser = x
    })
    this.getRole();
    this.getPrmsnData()
  }

  changeNow(event) {
    this.glPageEvent = event;
  }

  ngOnInit(): void {
    
    this.formRoleData =   this.formBuilder.group({
      com_name:  [''],
      pur_date: ['',Validators.required],
      vendor: [''],
      // desc: [''],
      gl_acc : ['',Validators.required],
      amount: ['',Validators.required],
      spAct: ['',Validators.required],
      mntEdFin: ['',Validators.required],
      pay_type: ['',Validators.required],
      department: ['',Validators.required],
      final: ['',Validators.required],
      receipt_id: [''],
      entered_by: [this.currentUser.id],
      start_date:[this.minDate],
      // invoice_date:[''],
      // invoice_number:['']
    });
    
  
    this.getCommunityId()
    // if(this.currentUser.prmsnId == '1'){
    //   this.getDepartment(this.currentUser.id)
    // }
    this.getCurrentYear = new Date().getFullYear(); // current year
    this.listOfYears = Array.from({length: 3}, (_, i) => this.getCurrentYear - i);
    setTimeout(() => {
      this.getDprtSmr()
    }, 1500);
  }

  getDepartment(e){
    this.frstDp = ''
    this.dprtmnt =[]
    let isfor =  6
    let for_other = null
    this.dataSrv.getDepartmentListing(['1'].includes(this.currentUser.prmsnId) ? this.currentUser.id : e,isfor,for_other).subscribe((res:any)=>{
      this.dprtmnt = res.body.sort(function(a, b){
        if(a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
        if(a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
        return 0;
    })  ;;
    this.frstDp = this.dprtmnt[0]?.name
    },err=>{
      this.toaster.errorToastr('Something went wrong please try again leter')
    })
  }

  getCommunityId() {
    if(this.currentUser.user_role != 3 && this.currentUser.user_role != 8){
      this.dataSrv.getCommunityId().subscribe((response: any) => {
        if (response['error'] == false) {
          this.allCommunity = response.body.sort(function(a, b){
            if(a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
            if(a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
            return 0;
        })  ;
        if(!['1','2','3','4','5','6'].includes(this.currentUser.prmsnId)){
          this.allCommunity= this.allCommunity.filter(i=> {if(i.id == this.currentUser.com_id){ return i}})
        }
        this.frsCom = this.allCommunity[0].id
        if(this.currentUser.prmsnId ==6){
          this.getDepartment(this.frsCom)
          }
          else if(this.currentUser.prmsnId ==1){
            this.getDepartment(this.currentUser.id)
          }
          //this.toastr.successToastr(response.msg);
        } else if (response['error'] == true) {
          this.toaster.errorToastr(response.msg);
        }
      }, (err) => {
        this.dataSrv.genericErrorToaster();
  
      })
    }
    else{
        if(this.currentUser.id && this.currentUser.com_id){
          let data = {
            userId : this.currentUser.id,
            mangId : this.currentUser.com_id
          }
          this.dataSrv.getManagementUserCommunities(data).subscribe((res: any) => {
            if (!res.error) {
              // this.mangComs = res.body[1].userAvailableCommunities
              this.allCommunity = res.body[0].user_added_communities.sort(function(a, b){
                if(a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
                if(a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
                return 0;
            })  ;
            this.frsCom =  this.allCommunity[0]?.community_id
            this.getDepartment(this.frsCom)
            } else {
              this.toaster.errorToastr(res.msg);
            }
          },
            (err) => {
              this.dataSrv.genericErrorToaster();
            })
        }
        else{
          this.dataSrv.getMNMGcommunity(this.currentUser.id).subscribe((response: any) => {
            if (response['error'] == false) {
              this.allCommunity = response.body.sort(function(a, b){
                if(a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
                if(a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
                return 0;
            })  ;
            this.frsCom =  this.allCommunity[0]?.cp_id
            this.getDepartment(this.frsCom)
              //this.toastr.successToastr(response.msg);
            } else if (response['error'] == true) {
              this.toaster.errorToastr(response.msg);
            }
          }, (err) => {
            this.dataSrv.genericErrorToaster();
      
          })
        }
    }
   
  }

  slct(e){
    this.slctCom = e.target.value
    this.frsCom = e.target.value
    // if(this.currentUser.user_role == 3){
    //   this.getPrmsnData()
    // }
    // else{
      this.getDepartment(this.slctCom)
    // }
  }

  chngDprt(value){
    this.slctDpt = value
    this.frstDp = value
  }

  chngD(e){
    let d = e?.target?.value || e
    this.ledgerData1 = this.ledgerData.filter(i=>i.department == d).sort(function(a, b){
      if(a.gl_and_description.toUpperCase() < b.gl_and_description.toUpperCase()) { return -1; }
      if(a.gl_and_description.toUpperCase() > b.gl_and_description.toUpperCase()) { return 1; }
      return 0;
  })
    // if(!e?.target?.value && !this.prmsUsrId.id){ 
    //   this.ledgerData1 = this.ledgerData.filter(i=>i.department == this.ptchDprt)
    // }
    // this.loadSpinner = false
  }

  chngYr(value){
    this.slctYr = value
    this.custmDt = (this.slcMnt || this.curMnt) +'-'+ '01' +'-'+ (this.slctYr || this.currYear) 
    this.getDate1(this.custmDt)
  }

  chngMnt(value){
    this.slcMnt = value 
    this.custmDt = (this.slcMnt || this.curMnt) +'-'+ '01' +'-'+ (this.slctYr || this.currYear) 
    this.getDate1(this.custmDt)
  }

  getDprtSmr(){
    this.slcMnt = this.slcMnt || this.curMnt
    this.boolVal = false;
    this.dataByCom[0].actual = 0
    this.dataByCom[0].totBudget = 0
    this.dataByCom[0].totVarnc = 0
    this.dataByCom[0].actual_ytd = 0
    this.dataByCom[0].totBudget_ytd = 0
    this.dataByCom[0].totVarnc_ytd = 0

    let data = {
      community_id :  this.currentUser.prmsnId == 1 ? this.currentUser.id : this.frsCom,
      department:this.frstDp,
      year:'2023',
      month: this.curMnt
    }
    this.dataSrv.getDepartmentSummary(data).subscribe((response: any) => {
      if (response['error'] == false) {
        this.rows = response.body.result1.sort(function(a, b){
          if(a.GLA_id.toUpperCase() < b.GLA_id.toUpperCase()) { return -1; }
          if(a.GLA_id.toUpperCase() > b.GLA_id.toUpperCase()) { return 1; }
          return 0;
      })
        this.rows2 = response.body.result2.sort(function(a, b){
          if(a.GLA_id.toUpperCase() < b.GLA_id.toUpperCase()) { return -1; }
          if(a.GLA_id.toUpperCase() > b.GLA_id.toUpperCase()) { return 1; }
          return 0;
      })
        this.rows.map(i=>{
           i.vrnce =  Number(i.total_amount) -Number(i.budget)
           if(i.department_summary == null){
            i.editHide = true
         }else{
          i.editHide = false
         }
         if(i.department_summary != null){
          i.editHide1 = true
        }else{
          i.editHide1 = false
        }

      
        })

          if(this.slcMnt =='01'){
            this.updResVal = this.rows2[0].january
            this.resValCal = this.rows2[0].january * 31
          }
          else if(this.slcMnt =='02'){
            this.updResVal = this.rows2[0].february
            this.resValCal = this.rows2[0].february * 28
          }
          else if(this.slcMnt =='03'){
            this.updResVal = this.rows2[0].march
            this.resValCal = this.rows2[0].march * 31
          }
          else if(this.slcMnt =='04'){
            this.updResVal = this.rows2[0].april
            this.resValCal = this.rows2[0].april*30
          }
          else if(this.slcMnt =='05'){
            this.updResVal = this.rows2[0].may
            this.resValCal = this.rows2[0].may*31
          }
          else if(this.slcMnt =='06'){
            this.updResVal = this.rows2[0].june
            this.resValCal = this.rows2[0].june*30
          }
          else if(this.slcMnt =='07'){
            this.updResVal = this.rows2[0].july
            this.resValCal = this.rows2[0].july*31
          }
          else if(this.slcMnt =='08'){
            this.updResVal = this.rows2[0].august
            this.resValCal = this.rows2[0].august*31
          }
          else if(this.slcMnt =='09'){
            this.updResVal = this.rows2[0].september
            this.resValCal = this.rows2[0].september*30
          }
          else if(this.slcMnt =='10'){
            this.updResVal = this.rows2[0].october
            this.resValCal = this.rows2[0].october*31
          }
          else if(this.slcMnt =='11'){
            this.updResVal = this.rows2[0].november
            this.resValCal = this.rows2[0].november*30
          } else if(this.slcMnt =='12'){
            this.updResVal = this.rows2[0].december
            this.resValCal = this.rows2[0].december*31
          }

        for (let i = 0; i < this.rows.length; ++i) {
          this.dataByCom[0].actual += parseFloat(this.rows[i].total_amount??0);
          this.dataByCom[0].totBudget += parseFloat(this.rows[i].budget??0);
          this.dataByCom[0].totVarnc =  this.dataByCom[0].actual - this.dataByCom[0].totBudget 
          //----------ytd-----------
          this.dataByCom[0].actual_ytd += parseFloat(this.rows[i].ytd_actual??0);
          this.dataByCom[0].totBudget_ytd += parseFloat(this.rows[i].YE_total??0);
          this.dataByCom[0].totVarnc_ytd = this.dataByCom[0].actual_ytd - this.dataByCom[0].totBudget_ytd 
        }
        this.boolVal =true;
        //this.toastr.successToastr(response.msg);
      } else if (response['error'] == true) {
        this.toaster.errorToastr(response.msg);
      }
    }, (err) => {
      this.dataSrv.genericErrorToaster();

    })
    
  }

  addEx(row){
    this.rowdata = row
    this.expltn = row.department_summary
    this.expltnBool = row.department_summary == null ? true: false
    this.modalOpenOSE(this.addExp, 'lg');
  }

  subExp(modal){
    if(this.expltnBool == true){
      let data = {
        community_id: this.currentUser.prmsnId == 1 ? this.currentUser.id : (this.slctCom || this.frsCom),
        gl_acc : this.rowdata.GLA_id,
        department : this.rowdata.department,
        explanation : this.expltn,
        spend_id :  this.rowdata.id,
        year : this.slctYr || '2023',
        month : this.slcMnt || this.curMnt
      }
      this.dataSrv.addDepartmentExplanation(data).subscribe((response: any) => {
        if (response['error'] == false) {
          this.closeded(modal)
          this.getDpartSmmry()
        } else if (response['error'] == true) {
          this.toaster.errorToastr(response.msg);
        }
      }, (err) => {
        this.dataSrv.genericErrorToaster();
  
      })
    }
    else{
      let data = {
        id : this.rowdata.dsId,
        explanation : this.expltn,
        
      }
      this.dataSrv.updateDepartmentExplanation(data).subscribe((response: any) => {
        if (response['error'] == false) {
          this.closeded(modal)
          this.getDpartSmmry()
        } else if (response['error'] == true) {
          this.toaster.errorToastr(response.msg);
        }
      }, (err) => {
        this.dataSrv.genericErrorToaster();
  
      })
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

  closeded(modal: NgbModalRef) {
    modal.dismiss();
      this.formRoleData.get('mntEdFin').setValue('')
  }

  getDpartSmmry(){
    this.slcMnt = this.slcMnt || this.curMnt
    this.boolVal = false;
    this.dataByCom[0].actual = 0
    this.dataByCom[0].totBudget = 0
    this.dataByCom[0].totVarnc = 0
    this.dataByCom[0].actual_ytd = 0
    this.dataByCom[0].totBudget_ytd = 0
    this.dataByCom[0].totVarnc_ytd = 0
    
    let data = {
      community_id : this.currentUser.prmsnId ==1 ? this.currentUser.id : this.slctCom || this.frsCom,
      department:this.slctDpt || this.frstDp,
      year:this.slctYr || '2023',
      month:this.slcMnt || this.curMnt
    }
    this.btnShow = true
    this.dataSrv.getDepartmentSummary(data).subscribe((response: any) => {
      if (response['error'] == false) {
        this.btnShow = false
        this.rows = response.body.result1.sort(function(a, b){
          if(a.GLA_id.toUpperCase() < b.GLA_id.toUpperCase()) { return -1; }
          if(a.GLA_id.toUpperCase() > b.GLA_id.toUpperCase()) { return 1; }
          return 0;
      })
        this.rows2 = response.body.result2.sort(function(a, b){
          if(a.GLA_id.toUpperCase() < b.GLA_id.toUpperCase()) { return -1; }
          if(a.GLA_id.toUpperCase() > b.GLA_id.toUpperCase()) { return 1; }
          return 0;
      })

        this.rows.map(i=>{
           i.vrnce =  Number(i.total_amount) - Number(i.budget)
           if(i.department_summary == null){
              i.editHide = true
           }else{
            i.editHide = false
           }
           if(i.department_summary != null){
            i.editHide1 = true
          }else{
            i.editHide1 = false
          }
         
        })

          if(this.slcMnt =='01'){
            this.updResVal =this.rows2[0].january
            this.resValCal = this.rows2[0].january * 31
          }
          else if(this.slcMnt =='02'){
            this.updResVal = this.rows2[0].february
            this.resValCal = this.rows2[0].february * 28
          }
          else if(this.slcMnt =='03'){
            this.updResVal = this.rows2[0].march
            this.resValCal = this.rows2[0].march * 31
          }
          else if(this.slcMnt =='04'){
            this.updResVal = this.rows2[0].april
            this.resValCal = this.rows2[0].april*30
          }
          else if(this.slcMnt =='05'){
            this.updResVal = this.rows2[0].may
            this.resValCal = this.rows2[0].may*31
          }
          else if(this.slcMnt =='06'){
            this.updResVal = this.rows2[0].june
            this.resValCal = this.rows2[0].june*30
          }
          else if(this.slcMnt =='07'){
            this.updResVal = this.rows2[0].july
            this.resValCal = this.rows2[0].july*31
          }
          else if(this.slcMnt =='08'){
            this.updResVal = this.rows2[0].august
            this.resValCal = this.rows2[0].august*31
          }
          else if(this.slcMnt =='09'){
            this.updResVal = this.rows2[0].september
            this.resValCal = this.rows2[0].september*30
          }
          else if(this.slcMnt =='10'){
            this.updResVal = this.rows2[0].october
            this.resValCal = this.rows2[0].october*31
          }
          else if(this.slcMnt =='11'){
            this.updResVal = this.rows2[0].november
            this.resValCal = this.rows2[0].november*30
          } else if(this.slcMnt =='12'){
            this.updResVal = this.rows2[0].december
            this.resValCal = this.rows2[0].december*31
          }
        
        for (let i = 0; i < this.rows.length; ++i) {
          this.dataByCom[0].actual += parseFloat(this.rows[i].total_amount??0);
          this.dataByCom[0].totBudget += parseFloat(this.rows[i].budget??0);
          this.dataByCom[0].totVarnc = this.dataByCom[0].actual - this.dataByCom[0].totBudget 
          //--------ytd--------
          this.dataByCom[0].actual_ytd += parseFloat(this.rows[i].ytd_actual??0);
          this.dataByCom[0].totBudget_ytd += parseFloat(this.rows[i].YE_total??0);
          this.dataByCom[0].totVarnc_ytd = this.dataByCom[0].actual_ytd - this.dataByCom[0].totBudget_ytd 
        }
        this.boolVal = true;
        //this.toastr.successToastr(response.msg);
      } else if (response['error'] == true) {
        this.toaster.errorToastr(response.msg);
        this.btnShow = false
      }
    }, (err) => {
      this.dataSrv.genericErrorToaster();
      this.btnShow = false
    })
  }

  getPrmsnData(){
    this.dprtmnt = []
    this.dataSrv.getPermissionByAdminRole().subscribe(
      (res:any) => {
        if (!res.error) {
          res.body.map(i=>{
            //comunity
            if(this.roleData.includes(i.role_id)){
              if(i.permission_name == 'Department'){
                if(i.trak_type == '0' || !i.trak_type){
                // this.assPrms  = i.assignResidentCount_permission
                  this.dprtmnt=JSON.parse(i.row_data);
                  this.dprtmnt =  this.dprtmnt.sort(function(a, b){
                    if(a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
                    if(a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
                    return 0;
                });
              }
              
              this.frstDp = this.dprtmnt[0]?.name
            }
            if(i.permission_name == 'Department Summary'){
              this.addPrms  = i.add_permission
              this.dltPrms  = i.delete_permission
              this.edtPrms  = i.edit_permission
              this.vwPrms  = i.view_permission
              this.aplyPrms  = i.apply_permission
              this.assPrms  = i.assignResidentCount_permission
            }
            }
          })
        } 
    }, (error:any) => {
      this.dataSrv.genericErrorToaster()
    }
    )
  }

  getRole(){
    this.dataSrv.getAllRole( ).subscribe((res:any)=>{
      if(!res.err){
        res.body.filter(i=>{ this.roleData.push(i.id.toString())})
       this.roleData.map(i=>{
        if(i != 2 && i != 3  && i != 4 && i != 5 && i != 6 ){
          this.roleData1.push(i)
        }
        if(i != 1 && i != 2 && i != 3  && i != 4 && i != 5 && i != 6 ){
          this.roleData2.push(i)
        }
       })
       if(this.roleData2.includes(this.currentUser.prmsnId)){
        this.getPrmsnData()
      }
      }
    },err=>{
      this.dataSrv.genericErrorToaster()
    })
  }

  Cancle(modal){
    this.closeded(modal)
  }

  get FormData_Control(){
    return this.formRoleData.controls;
  }

  getDate1(dt) {
    let todayDate: any = new Date();
    let todayDate1: any = dt ? new Date(dt) : new Date();
    this.lastDay = new Date(todayDate1.getFullYear(), todayDate1.getMonth() + 1, 0);
    
    let toDate: any = todayDate.getDate();
    if (toDate < 10) {
      toDate = '0' + toDate
    }
    let month = todayDate.getMonth() + 1;
    if (month < 10) {
      month = '0' + month;
    }
    let year = todayDate.getFullYear();
    this.minDate = year + '-' + month + '-' + toDate
    return this.minDate
  }

  getDate() {
    let todayDate: any = new Date();
    // let toDate: any = todayDate.getDate();
    // if (toDate < 10) {
    //   toDate = '0' + toDate
    // }
    let month = todayDate.getMonth() + 1;
    if (month < 10) {
      month = '0' + month;
    }
    this.currYear = todayDate.getFullYear();
    this.curMnt = month 
  }

  addRecSub(row){
    this.loadSpinner = true
    this.getCommunityDetails()
    this.getvendors()
    if(row == '0'){

       this.formRoleData.controls['spAct'].clearValidators();
       this.formRoleData.updateValueAndValidity();

      this.dsbFld = 'false'
      this.formRoleData.reset()
      this.formRoleData.patchValue({
        com_name: this.frsCom,
        pur_date: this.datePipe.transform( this.lastDay, 'yyyy-MM-dd'),
        vendor:  "Reconciliation",
        // desc: this.rowData.description,
        gl_acc : '',
        spAct: '' ,
        pay_type: "Reconciliation",
        department:  this.frstDp,
        final: '1',
        // receipt_id: this.rowData,
        entered_by: this.currentUser.id,
        start_date:this.minDate,
        // invoice_date:[''],
        // invoice_number: this.rowData.invoice_number
          })
      let data = {
        id : this.currentUser.user_role == 8 ? (this.slctCom || this.frsCom) : this.currentUser.prmsnId == '1' ? this.currentUser.id :this.roleData2.includes(this.currentUser.prmsnId) ? this.currentUser.com_id : (this.slctCom || this.frsCom),
        community_id : 'community_id'
      }
      this.dataSrv.getLedgerById(data).subscribe((res:any)=>{
        if(!res.err){
          this.ledgerData =  res.body
          this.chngD(this.slctDpt ||  this.frstDp)
          // if(this.currentUser.prmsnId == '6'){
          //   this.getDepartment(community_id)
          // }
        }
        else{
          this.loadSpinner = false
          this.toaster.errorToastr('Something went wrong please try again leter')
        }
      },err=>{
        this.loadSpinner = false
          this.dataSrv.genericErrorToaster()
      })
      // this.modalOpenOSE(this.addRec, 'lg');
    }
    else{
      this.dsbFld = 'true'
      this.rowData = row
      let vr = this.rowData.total_amount.toString().replace('-','')
      vr = Number(vr)
      this.formRoleData.patchValue({
        com_name: this.rowData.community_id,
        pur_date: this.datePipe.transform( this.lastDay, 'yyyy-MM-dd'),
        vendor:  "Reconciliation",
        // desc: this.rowData.description,
        gl_acc : this.rowData.GLA_id,
        spAct: vr.toFixed(2) ,
        pay_type: "Reconciliation",
        department: this.rowData.department,
        final: '1',
        receipt_id: this.rowData,
        entered_by: this.currentUser.id,
        start_date:this.minDate,
        // invoice_date:[''],
        // invoice_number: this.rowData.invoice_number
          })
      this.slctComm(row.community_id,this.rowData.department)
    }
  }

  getvendors(){
    this.vendorData = []
    let data = {usrRole : this.currentUser.prmsnId == '6' ? '6' : '', comId : this.currentUser.prmsnId == '6' ? '' : this.roleData2.includes(this.currentUser.prmsnId) ? this.currentUser.com_id : this.currentUser.id }
    this.dataSrv.getVendor(data).subscribe((res:any)=>{
      if(!res.err){
        this.vendorData=    res.body.sort(function(a, b){
          if(a.vendor_name.toUpperCase() < b.vendor_name.toUpperCase()) { return -1; }
          if(a.vendor_name.toUpperCase() > b.vendor_name.toUpperCase()) { return 1; }
          return 0;
      })  ;
        //  .filter(i=>{
        //   if ( i.vendor_name) {this.vendorData.push(i.vendor_name)}
        //   });
      this.getType()
          
          
      }
      else{
        this.toaster.errorToastr('Something went wrong please try again leter')
      }
    },err=>{
        this.dataSrv.genericErrorToaster()
    })
  }

  getType(){
    this.paymentType = []
    this.dataSrv.getPaymentType().subscribe((res:any)=>{
      if(!res.err){
      res.body.filter(i=>{
        if ( i.name) {this.paymentType.push(i.name)}
       });
         
        this.paymentType.sort(function(a, b){
            if(a.toUpperCase() < b.toUpperCase()) { return -1; }
            if(a.toUpperCase() > b.toUpperCase()) { return 1; }
            return 0;
        })  ;
        // console.log(this.paymentType);
    this.loadSpinner = false
   this.modalOpenOSE(this.addRec, 'lg');
   
      }
      else{
        this.toaster.errorToastr('Something went wrong please try again leter')
        this.loadSpinner = false
      }
    },err=>{
        this.dataSrv.genericErrorToaster()
        this.loadSpinner = false
    })
  }


  slctComm(community_id,department){
    this.frsCom = community_id
    this.ledgerData = []
   
    let data = {
      id : this.currentUser.user_role == 8 ? community_id : this.currentUser.prmsnId == '1' ? this.currentUser.id :this.roleData2.includes(this.currentUser.prmsnId) ? this.currentUser.com_id : community_id,
      community_id : 'community_id'
    }
    this.dataSrv.getLedgerById(data).subscribe((res:any)=>{
          if(!res.err){
            this.ledgerData =  res.body
            this.chngD(department)
            if(this.currentUser.prmsnId == '6'){
              this.getDepartment(community_id)
            }
          }
          else{
            this.loadSpinner = false
            this.toaster.errorToastr('Something went wrong please try again leter')
          }
        },err=>{
          this.loadSpinner = false
            this.dataSrv.genericErrorToaster()
        })
  }

  getCommunityDetails() {
    if(this.currentUser.user_role == '3'){
      this.dataSrv.getManagementById(this.currentUser.id).subscribe((res: any) => {
        this.comName = res.body[0]
      })
    }
    else if(this.currentUser.user_role == '8'){
      let searchStr = ''
      this.dataSrv.getUserById(searchStr ,this.currentUser.id ,'user').subscribe((res: any) => {
        if (res.body[0]?.first_name) {
          this.userName = res.body[0]
        } 
      })
    }
    else{
      this.dataSrv.getcommunityById(this.roleData2.includes(this.currentUser.prmsnId) ? this.currentUser.com_id : this.currentUser.id).subscribe(response => {
        if (!response.error) {
            this.comName = response.body[0]
            if(this.roleData2.includes(this.currentUser.prmsnId)){
              this.getUserDtl()
            }
        } else {
          this._authenticationService.errorToaster(response);
        }
      }, error => {
        this.dataSrv.genericErrorToaster()
      }
      );
    }
}

getUserDtl(){
  let is_for = 'user'
  let searchStr = ''
  this.dataSrv.getUserById(searchStr = '',this.currentUser.id,is_for).subscribe(response => {
    if (!response.error) {
        this.userName = response.body[0]
    } else {
      this._authenticationService.errorToaster(response);
    }
  }, error => {
    this.dataSrv.genericErrorToaster()
  }
  );
}

submitted(modal){
  for (let item of Object.keys(this.FormData_Control)) {
    this.FormData_Control[item].markAsDirty()
  }
  if (this.formRoleData.invalid) {
    return;
  }
  // let comId = this.rowData?.community_id || this.formRoleData.value.com_name || this.currentUser.id
  let comId = ['3','6','8'].includes( this.currentUser.user_role) ? this.formRoleData.value.com_name : this.currentUser.prmsnId == '1' ? this.currentUser.id :   this.rowData?.community_id;
   let com = this.currentUser.user_role == 3 ? this.allCommunity.filter(c => c.cp_id == comId ) : this.currentUser.user_role == 8 ? this.allCommunity.filter(c => c.community_id == comId ) :  this.allCommunity.filter(c => c.id == comId )
  let  data = [{
      community_name: com[0].community_name ,
      purchage_date:this.formRoleData.value.pur_date,
      vendor: 'Reconciliation',
      // description:this.formRoleData.value.desc,
      gl_account:this.formRoleData.value.gl_acc,
      amount:this.formRoleData.value.amount,
      mntEdFin:this.formRoleData.value.mntEdFin,
      spAct:this.dsbFld == 'true' ? '0' : this.formRoleData.value.spAct,
      department:this.formRoleData.value.department,
      pmt_type: this.formRoleData.value.pay_type,
      final: this.formRoleData.value.final,
      entered_by:this.currentUser.id,
      start_date:this.minDate,
      // invoice_date:this.formRoleData.value.invoice_date,
      // invoice_number:this.formRoleData.value.invoice_number
  }]
  this.dataSrv.addSpendDown(data).subscribe((res:any)=>{
          
    if(!res.error){
      this.toaster.successToastr(res.msg)
      this.closeded(modal)
      this.getDpartSmmry();
      this.glPage = this.glPageEvent.offset;
    }else{
      this.toaster.errorToastr(res.msg)
    }
  },err=>{
    this.dataSrv.genericErrorToaster()
  })
}

monFin(){
  if(this.dsbFld == 'false'){
    let varnc =  (this.formRoleData.value.mntEdFin || 0) - Number(0) 
    this.formRoleData.get('amount').setValue(varnc.toFixed(2))
  }else{
    let vr = this.rowData.total_amount.toString().replace('-','')
    let varnc =  (this.formRoleData.value.mntEdFin || 0) - Number(vr) 
    this.formRoleData.get('amount').setValue(varnc.toFixed(2))
  }
}

updREs(){ 
  this.slcMnt = this.slcMnt || this.curMnt
  let mnt = ''
  if(this.slcMnt =='01'){
    this.resValCal = this.updResVal*31
    mnt = 'january'
  }
  else if(this.slcMnt =='02'){
    mnt = 'february'
    this.resValCal = this.updResVal*28
  }
  else if(this.slcMnt =='03'){
    mnt = 'march'
    this.resValCal = this.updResVal*31
  }
  else if(this.slcMnt =='04'){
    mnt = 'april'
    this.resValCal = this.updResVal*30
  }
  else if(this.slcMnt =='05'){
    mnt = 'may'
    this.resValCal = this.updResVal*31
  }
  else if(this.slcMnt =='06'){
    mnt = 'june'
    this.resValCal = this.updResVal*30
  }
  else if(this.slcMnt =='07'){
    mnt = 'july'
    this.resValCal = this.updResVal*31
  }
  else if(this.slcMnt =='08'){
    mnt = 'august'
    this.resValCal = this.updResVal*31
  }
  else if(this.slcMnt =='09'){
    mnt = 'september'
    this.resValCal = this.updResVal*30
  }
  else if(this.slcMnt =='10'){
    mnt = 'october'
    this.resValCal = this.updResVal*31
  }
  else if(this.slcMnt =='11'){
    mnt = 'november'
    this.resValCal = this.updResVal*30
  } else if(this.slcMnt =='12'){
    mnt = 'december'
    this.resValCal = this.updResVal*31
  }
    let data ={
      id:  this.rows2[0].id,
      january: this.slcMnt == '01' ? this.updResVal : null,
      february: this.slcMnt == '02' ? this.updResVal : null,
      march: this.slcMnt == '03' ? this.updResVal : null,
      april: this.slcMnt == '04' ? this.updResVal : null,
      may: this.slcMnt == '05' ? this.updResVal : null,
      june: this.slcMnt == '06' ? this.updResVal : null,
      july: this.slcMnt == '07' ? this.updResVal : null,
      august: this.slcMnt == '08' ? this.updResVal : null,
      september: this.slcMnt == '09' ? this.updResVal : null,
      october: this.slcMnt == '10' ? this.updResVal : null,
      november: this.slcMnt == '11' ? this.updResVal : null,
      december: this.slcMnt == '12' ? this.updResVal : null,
      is_month : this.slcMnt,
      residents_value : this.resValCal,
      community_id:this.currentUser.prmsnId == 1 ? this.currentUser.id : !['1','2','3','4','5','6','8'].includes(this.currentUser.prmsnId)? this.currentUser.com_id : this.slctCom , 
      department:this.slctDpt || this.frstDp,
      year:this.slctYr || this.getCurrentYear,
      month: mnt
    }
    this.dataSrv.SpendEditBudgetRD(data).subscribe((res:any)=>{
      if(!res.error){
        this.toaster.successToastr(res.msg)
        this.getDprtSmr()
      }else{
        this.toaster.errorToastr(res.msg)
      }
    },err=>{
      this.dataSrv.genericErrorToaster()
    })
}

Fnlreconciliation(){
  let mnt =  moment(this.slcMnt, 'MM').format('MMMM');
  this.FnlreconciliationText = `Are you sure you want to reconcile all unreconciled GL Accounts in ${this.frstDp} for ${mnt} ${this.slctYr || this.currYear} ?`
  this.modalOpenOSE(this.rfp, 'lg')
}

yesFinalization(modal){
  this.rows1 =  this.rows.filter(i=>{
    if(i.pmt_type != 'Reconciliation'){
      return i
    }
  })
  const finalResult = this.rows1.map(item => {
    return {
      community_id: item.community_id,
      vendor:"Reconciliation",
      description: "Reconciliation Expense",
      gl_account: item.GLA_id,
      department: item.department,
      amount: '0',
      pmt_type: "Reconciliation",
      final:"1",
      receipt_id: uuid.v4(),
      entered_by:this.currentUser.id,
      invoice_date: null,
      invoice_number: null,
      start_date:this.minDate,
      purchage_date:this.datePipe.transform( this.lastDay, 'yyyy-MM-dd'),
    }
  })
  console.log('this.rowsthis.rowsthis.rowsthis.rows',finalResult);

  if(!finalResult.length){
    this.toaster.errorToastr('All GLs are reconciled')
  }else{
  this.dataSrv.addSpendDown( finalResult).subscribe((res:any)=>{
    if(!res.error){
      this.toaster.successToastr(res.msg)
      this.closeded(modal)
      this.getDpartSmmry();
      this.glPage = this.glPageEvent.offset;
    }else{
      this.toaster.errorToastr(res.msg)
    }
  },err=>{
    this.dataSrv.genericErrorToaster()
  })
}
}
 
}
