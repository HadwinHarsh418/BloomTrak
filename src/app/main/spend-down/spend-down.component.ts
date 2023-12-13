import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-spend-down',
  templateUrl: './spend-down.component.html',
  styleUrls: ['./spend-down.component.scss']
})

export class SpendDownComponent implements OnInit {
  rows:any=[];
  currentUser: any;
  fileToUpload: any;
  dprtmnt: any[];
  mL = [{val :'January',id:'01'},{val :'February',id:'02'}, {val :'March',id:'03'},{val :'April',id:'04'}, {val :'May',id:'05'}, {val :'June',id:'06'}, {val :'July',id:'07'}, {val :'August',id:'08'}, {val :'September',id:'09'}, {val :'October',id:'10'}, {val :'November',id:'11'}, {val :'December',id:'12'}];
  // mL = [{val :'January',id:'01'},{val :'February',id:'02'}, {val :'March',id:'March'},{val :'April',id:'April'}, {val :'May',id:'May'}, {val :'June',id:'June'}, {val :'July',id:'July'}, {val :'August',id:'August'}, {val :'September',id:'September'}, {val :'October',id:'October'}, {val :'November',id:'November'}, {val :'December',id:'December'}];
  allCommunity: any[];
  getCurrentYear: number;
  listOfYears: number[];
  slcm: any;
  slcDp: any;
  slcYr: any;
  slcMn: any;
  data: { year: any; month_name: any; department: any; community_id: any; };
  rows1: any =[]
  frsCom: any;
  frstDp: any;
  fltrTolRes: any = []
  updResVal:any
  row2: any=[]
  resValCal: any;
  dataForBgt: any ={difference:'',differenceYTD:''}
  roleData: any=[]
  roleData1: any=[]
  addPrms: any;
  dltPrms: any;
  edtPrms: any;
  vwPrms: any;
  assPrms: any;
  userName: any;
  curMnt: any;
  roleData2: any=[];
  constructor(
    private dataSrv : DataService,
    private toaster : ToastrManager,
    private _authenticationService : AuthenticationService
  ) {
    this.getDate()
    this.dataSrv.clearData()
    this._authenticationService.currentUser.subscribe((x: any) => {
      this.currentUser = x
    })
    this.getRole()
   }

  ngOnInit(): void {
    this.getCurrentYear = new Date().getFullYear(); // current year
    this.listOfYears = Array.from({length: 3}, (_, i) => this.getCurrentYear - i);
    // this.getSpendDownList(this.data);
    this.getCommunityId()
    // if(['1'].includes(this.currentUser.prmsnId)){
    //   this.getDepartment( this.currentUser.id);
    // }
    // else if(this.roleData1.includes(this.currentUser.prmsnId)){
    // }
    setTimeout(() => {
      this.getSpndOnInIt()
    }, 1500);
    // this.getPrmsnData();
    // this.getUserDtl()
  }

  // getSpendDownList(data){
  
  // }

  delete(id){
    let data ={
      id: id,
    }
    this.dataSrv.deleteSpendDown(data).subscribe((res:any)=>{
      if(!res.error){
        this.toaster.successToastr(res.msg)
       this.getSpnDwn()

      }else{
        this.toaster.errorToastr(res.msg)
      }
    },err=>{
      this.dataSrv.genericErrorToaster()
    })
  }
  
  @ViewChild('fileInput') elfile: ElementRef;
  onFileInput(files: any) {
    if (files.length === 0) {
      return;
    }
    let type = files[0].type;
    this.fileToUpload = files[0];
    this.uploadNow()
  }

  uploadNow() {
    let formdata = new FormData();
    formdata.append('report',this.fileToUpload)
    formdata.append('entered_by',this.currentUser.id)

    this.dataSrv.importSpendDownTable(formdata).subscribe(
      (res:any) => {
        if (!res.error) {
          this.toaster.successToastr(res.msg)
          this.chngMnt(this.slcMn)
        } else {
          this.toaster.errorToastr(res.msg)
        }
    }, (error:any) => {
      this.dataSrv.genericErrorToaster()
    }
    )
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
        if(!['2','3','4','5','6'].includes(this.currentUser.prmsnId)){
          this.allCommunity= this.allCommunity.filter(i=> {if(i.id == this.currentUser.com_id){ return i}})
        }
        this.frsCom = this.allCommunity[0]?.id
        if(this.currentUser.prmsnId ==6){
          this.getDepartment(this.frsCom)
          }
          if(this.currentUser.prmsnId ==1){
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

//   getUserDtl(){
//     let is_for = 'user'
//     let searchStr = ''
//     this.dataSrv.getUserById(searchStr = '',this.currentUser.id,is_for).subscribe(response => {
//       if (!response.error) {
//           this.userName = response.body[0]
//       } else {
//         this._authenticationService.errorToaster(response);
//       }
//     }, error => {
//       this.dataSrv.genericErrorToaster()
//     }
//     );
// }

  getDepartment(e){
    this.dprtmnt =[]
    let isfor =  6
    let for_other = null
    this.dataSrv.getDepartmentListing(e,isfor,for_other).subscribe((res:any)=>{
      this.dprtmnt = res.body.sort(function(a, b){
        if(a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
        if(a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
        return 0;
    });
    this.frstDp = this.dprtmnt[0]?.name
    
    },err=>{
      this.toaster.errorToastr('Something went wrong please try again leter')
    })
  }

  slct(e){
    this.slcDp = ''
    this.slcm = e.target.value
    // if(this.currentUser.user_role == 3){
    //   this.getPrmsnData()
    // }
    // else{
      this.getDepartment(this.slcm)
    // }
  //  this.dataSrv.setData(e.target.value);
  }

  chngDprt(val){
    this.slcDp = val
    // this.dataSrv.setData(val);
  }

  chngYr(val){
    this.slcYr = val
    // this.dataSrv.setData(val);
  }

  chngMnt(val){
    this.slcMn = val
  }

  getSpndOnInIt(){
    this.fltrTolRes = []
    this.updResVal = ''
    this.resValCal = ''
    let mn = this.curMnt
    this.data ={
      year : '2023',
      month_name : mn,
      department:this.frstDp,
      community_id: this.currentUser.prmsnId == 1 ? this.currentUser.id : this.frsCom
    }
    this.dataSrv.getSpendDown(this.data).subscribe((res:any)=>{
      if(!res.error){
        this.rows = res.body.data
        this.rows1 = res.body
        this.dataForBgt.difference = JSON.stringify(res.body?.difference)
        this.dataForBgt.differenceYTD = JSON.stringify(res.body?.differenceYTD)
        this.row2 =  res.body?.res2
         this.rows.map(i=>{
          if(i.entered != null){
            i.entered1 = i.entered_by_cm || i.entered_by_user
          }else{
            i.entered1 =  i.entered_by_cm || i.entered_by_user
          }
        })
        this.row2.filter(i=>{
         
          if(mn =='01'){
            this.fltrTolRes.push( i.january)
            this.updResVal = this.fltrTolRes[0]
            this.resValCal = this.updResVal*31
          }
          else if(mn =='02'){
            this.fltrTolRes.push( i.february)
            this.updResVal = this.fltrTolRes[0]
            this.resValCal = this.updResVal*28
          }
          else if(mn =='03'){
            this.fltrTolRes.push( i.march)
            this.updResVal = this.fltrTolRes[0]
            this.resValCal = this.updResVal*31
          }
          else if(mn =='04'){
            this.fltrTolRes.push( i.april)
            this.updResVal = this.fltrTolRes[0]
            this.resValCal = this.updResVal*30
          }
          else if(mn =='05'){
            this.fltrTolRes.push( i.may)
            this.updResVal = this.fltrTolRes[0]
            this.resValCal = this.updResVal*31
          }
          else if(mn =='06'){
            this.fltrTolRes.push( i.june)
            this.updResVal = this.fltrTolRes[0]
            this.resValCal = this.updResVal*30
          }
          else if(mn =='07'){
            this.fltrTolRes.push( i.july)
            this.updResVal = this.fltrTolRes[0]
            this.resValCal = this.updResVal*31
          }
          else if(mn =='08'){
            this.fltrTolRes.push( i.august)
            this.updResVal = this.fltrTolRes[0]
            this.resValCal = this.updResVal*31
          }
          else if(mn =='09'){
            this.fltrTolRes.push( i.september)
            this.updResVal = this.fltrTolRes[0]
            this.resValCal = this.updResVal*30
          }
          else if(mn =='10'){
            this.fltrTolRes.push( i.october)
            this.updResVal = this.fltrTolRes[0]
            this.resValCal = this.updResVal*31
          }
          else if(mn =='11'){
            this.fltrTolRes.push( i.november)
            this.updResVal = this.fltrTolRes[0]
            this.resValCal = this.updResVal*30
          } else if(mn =='12'){
            this.fltrTolRes.push( i.december)
            this.updResVal = this.fltrTolRes[0]
            this.resValCal = this.updResVal*31
          }
        })

        this.updResVal = this.fltrTolRes[0]
         
      }
      else{
        this.toaster.errorToastr('Something went wrong please try again leter')
      }
    },err=>{
        this.dataSrv.genericErrorToaster()
    })
  }

  getPrmsnData(){
    let post=[];
    this.dataSrv.getPermissionByAdminRole().subscribe(
      (res:any) => {
        if (!res.error) {
          res.body.map(i=>{
            //comunity
            if(this.roleData.includes(i.role_id)){
              if(this.roleData2.includes(this.currentUser.prmsnId)){
              if(i.permission_name == 'Department'){
                if(i.trak_type == '0' || i.trak_type ==null){
                  this.dprtmnt=JSON.parse(i.row_data);
                  this.dprtmnt =  this.dprtmnt.sort(function(a, b){
                    if(a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
                    if(a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
                    return 0;
                });
                }
                if (this.dprtmnt) {
                  this.frstDp = this.dprtmnt[0]?.name
               }
               }
              }
              if(i.trak_type == '0'){
                if(i.permission_name == 'Spend Down'){
                 this.addPrms  = i.add_permission
                 this.dltPrms  = i.delete_permission
                 this.edtPrms  = i.edit_permission
                 this.vwPrms  = i.view_permission
                 this.assPrms  = i.assignResidentCount_permission
              }
              }
            }
            
          })
        } 
    }, (error:any) => {
      this.dataSrv.genericErrorToaster()
    }
    )
  }

  updREs(){ 
    this.slcMn = this.slcMn || this.curMnt
    let mnt = ''
    if(this.slcMn =='01'){
      this.resValCal = this.updResVal*31
      mnt = 'january'
    }
    else if(this.slcMn =='02'){
      mnt = 'february'
      this.resValCal = this.updResVal*28
    }
    else if(this.slcMn =='03'){
      mnt = 'march'
      this.resValCal = this.updResVal*31
    }
    else if(this.slcMn =='04'){
      mnt = 'april'
      this.resValCal = this.updResVal*30
    }
    else if(this.slcMn =='05'){
      mnt = 'may'
      this.resValCal = this.updResVal*31
    }
    else if(this.slcMn =='06'){
      mnt = 'june'
      this.resValCal = this.updResVal*30
    }
    else if(this.slcMn =='07'){
      mnt = 'july'
      this.resValCal = this.updResVal*31
    }
    else if(this.slcMn =='08'){
      mnt = 'august'
      this.resValCal = this.updResVal*31
    }
    else if(this.slcMn =='09'){
      mnt = 'september'
      this.resValCal = this.updResVal*30
    }
    else if(this.slcMn =='10'){
      mnt = 'october'
      this.resValCal = this.updResVal*31
    }
    else if(this.slcMn =='11'){
      mnt = 'november'
      this.resValCal = this.updResVal*30
    } else if(this.slcMn =='12'){
      mnt = 'december'
      this.resValCal = this.updResVal*31
    }
      let data ={
        id: this.row2[0].id,
        january: this.slcMn == '01' ? this.updResVal : null,
        february: this.slcMn == '02' ? this.updResVal : null,
        march: this.slcMn == '03' ? this.updResVal : null,
        april: this.slcMn == '04' ? this.updResVal : null,
        may: this.slcMn == '05' ? this.updResVal : null,
        june: this.slcMn == '06' ? this.updResVal : null,
        july: this.slcMn == '07' ? this.updResVal : null,
        august: this.slcMn == '08' ? this.updResVal : null,
        september: this.slcMn == '09' ? this.updResVal : null,
        october: this.slcMn == '10' ? this.updResVal : null,
        november: this.slcMn == '11' ? this.updResVal : null,
        december: this.slcMn == '12' ? this.updResVal : null,
        is_month : this.slcMn,
        residents_value : this.resValCal,
        community_id:this.currentUser.prmsnId == 1 ? this.currentUser.id : !['1','2','3','4','5','6'].includes(this.currentUser.prmsnId)? this.currentUser.com_id : this.slcm , 
        department:this.slcDp || this.frstDp,
        year:this.slcYr || this.getCurrentYear,
        month: mnt
      }
      this.dataSrv.SpendEditBudgetRD(data).subscribe((res:any)=>{
        if(!res.error){
          this.toaster.successToastr(res.msg)
          this.getSpnDwn()
        }else{
          this.toaster.errorToastr(res.msg)
        }
      },err=>{
        this.dataSrv.genericErrorToaster()
      })
  }
  getSpnDwn(){
    this.slcMn = this.slcMn || this.curMnt
    // this.dataSrv.setData(val);
    this.fltrTolRes = []
    this.updResVal = ''
    this.resValCal = ''
 this.data ={
      year : this.slcYr || '2023',
      month_name : this.slcMn ,
      department:this.slcDp || this.frstDp,
      community_id: this.currentUser.prmsnId == 1 ? this.currentUser.id : this.slcm ||this.frsCom
    }
    this.dataSrv.getSpendDown(this.data).subscribe((res:any)=>{
      if(!res.error){
        this.rows = res.body.data
        this.rows1 = res.body
        this.dataForBgt.difference = JSON.stringify(res.body?.difference)
        this.dataForBgt.differenceYTD = JSON.stringify(res.body?.differenceYTD)
        this.row2 = res.body?.res2
         this.rows.map(i=>{
          if(i.entered != null){
            i.entered1 = i.entered_by_cm || i.entered_by_user
          }else{
            i.entered1 = i.entered_by_cm || i.entered_by_user
          }
        })
        this.row2.filter(i=>{
          if(this.slcMn =='01'){
            this.fltrTolRes.push( i.january)
            this.updResVal = this.fltrTolRes[0]
            this.resValCal = this.updResVal*31
          }
          else if(this.slcMn =='02'){
            this.fltrTolRes.push( i.february)
            this.updResVal = this.fltrTolRes[0]
            this.resValCal = this.updResVal*28
          }
          else if(this.slcMn =='03'){
            this.fltrTolRes.push( i.march)
            this.updResVal = this.fltrTolRes[0]
            this.resValCal = this.updResVal*31
          }
          else if(this.slcMn =='04'){
            this.fltrTolRes.push( i.april)
            this.updResVal = this.fltrTolRes[0]
            this.resValCal = this.updResVal*30
          }
          else if(this.slcMn =='05'){
            this.fltrTolRes.push( i.may)
            this.updResVal = this.fltrTolRes[0]
            this.resValCal = this.updResVal*31
          }
          else if(this.slcMn =='06'){
            this.fltrTolRes.push( i.june)
            this.updResVal = this.fltrTolRes[0]
            this.resValCal = this.updResVal*30
          }
          else if(this.slcMn =='07'){
            this.fltrTolRes.push( i.july)
            this.updResVal = this.fltrTolRes[0]
            this.resValCal = this.updResVal*31
          }
          else if(this.slcMn =='08'){
            this.fltrTolRes.push( i.august)
            this.updResVal = this.fltrTolRes[0]
            this.resValCal = this.updResVal*31
          }
          else if(this.slcMn =='09'){
            this.fltrTolRes.push( i.september)
            this.updResVal = this.fltrTolRes[0]
            this.resValCal = this.updResVal*30
          }
          else if(this.slcMn =='10'){
            this.fltrTolRes.push( i.october)
            this.updResVal = this.fltrTolRes[0]
            this.resValCal = this.updResVal*31
          }
          else if(this.slcMn =='11'){
            this.fltrTolRes.push( i.november)
            this.updResVal = this.fltrTolRes[0]
            this.resValCal = this.updResVal*30
          } else if(this.slcMn =='12'){
            this.fltrTolRes.push( i.december)
            this.updResVal = this.fltrTolRes[0]
            this.resValCal = this.updResVal*31
          }
        })
      
        
        
      }
      else{
        this.toaster.errorToastr('Something went wrong please try again leter')
      }
    },err=>{
        this.dataSrv.genericErrorToaster()
    })
  }

  getRole(){
    this.dataSrv.getAllRole( ).subscribe((res:any)=>{
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
                this.getPrmsnData()
              
      }
    },err=>{
      this.dataSrv.genericErrorToaster()
    })
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
    // let year = todayDate.getFullYear();
    this.curMnt = month 
  }
}
   