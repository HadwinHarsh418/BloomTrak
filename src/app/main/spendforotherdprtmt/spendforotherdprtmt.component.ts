import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-spendforotherdprtmt',
  templateUrl: './spendforotherdprtmt.component.html',
  styleUrls: ['./spendforotherdprtmt.component.scss']
})
export class SpendforotherdprtmtComponent implements OnInit {
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
  sectDepr: any=[];
  no: any;
  apprvBtnHide: boolean;
  community_id: any;
  currenttab: string;
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
    this.getSpnDwn(1)
  }
  
  ngOnInit(): void {
    this.getCurrentYear = new Date().getFullYear()+1; // current year
    this.listOfYears = Array.from({length: 3}, (_, i) => this.getCurrentYear - i);
    // this.getSpendDownList(this.data);
    this.getCommunityId()
    // if(['1'].includes(this.currentUser?.prmsnId)){
      //   this.getDepartment( this.currentUser?.id);
      // }
      // else if(this.roleData1.includes(this.currentUser?.prmsnId)){
        // }
        // setTimeout(() => {
          // this.getSpndOnInIt()
          // }, 1500);
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
       this.getSpnDwn(1)

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
    formdata.append('entered_by',this.currentUser?.id)

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
    if(this.currentUser?.user_role != 3 && this.currentUser?.user_role != 8){
      this.dataSrv.getCommunityId().subscribe((response: any) => {
        if (response['error'] == false) {
          this.allCommunity = response.body.sort(function(a, b){
            if(a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
            if(a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
            return 0;
        })  ;
        if(!['2','3','4','5','6'].includes(this.currentUser?.prmsnId)){
          this.allCommunity= this.allCommunity.filter(i=> {if(i.id == this.currentUser?.com_id){ return i}})
        }
        this.frsCom = this.allCommunity[0]?.id
        if(this.currentUser?.prmsnId ==6){
          this.getDepartment(this.frsCom)
          }
          if(this.currentUser?.prmsnId ==1){
            this.getDepartment(this.currentUser?.id)
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
      this.getMngComunity()
    }
  }


  getMngComunity(){
    if(this.currentUser?.id && this.currentUser?.com_id){
      let data = {
        userId : this.currentUser?.id,
        mangId : this.currentUser?.com_id
      }
      this.dataSrv.getManagementUserCommunities(data).subscribe((res: any) => {
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
        this.community_id = d.community_id
        // this.getSpndOnInIt()
        this.getSpnDwn(0)
      } else {
          this.toaster.errorToastr(res.msg);
        }
      },
        (err) => {
          this.dataSrv.genericErrorToaster();
        })
    }
    else{
      this.dataSrv.getMNMGcommunity(this.currentUser?.id).subscribe((response: any) => {
        if (response['error'] == false) {
          this.allCommunity = response.body.sort(function(a, b){
            if(a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
            if(a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
            return 0;
        })  ;
        this.community_id = response?.body[0]?.cp_id
        // this.getSpndOnInIt()
        this.getSpnDwn(0)
      } else if (response['error'] == true) {
          this.toaster.errorToastr(response.msg);
        }
      }, (err) => {
        this.dataSrv.genericErrorToaster();
  
      })
    }
  }


  selectCommunity(id:any){
    this.community_id = id;
    this.currenttab == 'other' ? this.getSpnDwn(2) : this.getSpnDwn(1)
  }

//   getUserDtl(){
//     let is_for = 'user'
//     let searchStr = ''
//     this.dataSrv.getUserById(searchStr = '',this.currentUser?.id,is_for).subscribe(response => {
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
    // if(this.currentUser?.user_role == 3){
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

  // getSpndOnInIt(){
  //   this.dataSrv.getSpendDownOthersTable(this.currentUser?.user_role == 3 || this.currentUser?.user_role == 8 ? this.community_id : this.currentUser?.id,this.sectDepr,this.currentUser?.user_role == 3 || this.currentUser?.user_role == 8 ? this.community_id : this.currentUser?.com_id ?? this.currentUser?.id).subscribe((res:any)=>{
  //     if(!res.error){
  //       this.rows = res.body.added_by_others
  //       this.apprvBtnHide = true
  //     }
  //     else{
  //       this.toaster.errorToastr('Something went wrong please try again later')
  //     }
  //   },err=>{
  //       this.dataSrv.genericErrorToaster()
  //   })
  // }

  getPrmsnData(){
    let post=[];
    this.dataSrv.getPermissionByAdminRole().subscribe(
      (res:any) => {
        if (!res.error) {
          res.body.map(i=>{
            //comunity
            if(this.roleData.includes(i.role_id)){
              if(this.roleData2.includes(this.currentUser?.prmsnId )){
              if(i.permission_name == 'Department'){
                if(i.trak_type == '0'){
                  this.dprtmnt=JSON.parse(i.row_data);
                  this.dprtmnt.map(i=>{
                    this.sectDepr.push(i.name)
                  })
                  this.dprtmnt =  this.dprtmnt.sort(function(a, b){
                    if(a.name.toUpperCase() < b.name.toUpperCase()) { return -1; }
                    if(a.name.toUpperCase() > b.name.toUpperCase()) { return 1; }
                    return 0;
                });
              }
              if(this.dprtmnt)
                  this.frstDp = this.dprtmnt[0]?.name
               }
              }
               if(i.permission_name == 'Spend For Other Departmet'){
                this.addPrms  = i.add_permission
                this.dltPrms  = i.delete_permission
                this.edtPrms  = i.edit_permission
                this.vwPrms  = i.view_permission
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

  
  getSpnDwn(no){
    this.no = no
    this.dataSrv.getSpendDownOthersTable(this.currentUser?.user_role == 3 || this.currentUser?.user_role == 8 ? this.community_id : this.currentUser?.id,this.sectDepr,this.currentUser?.user_role == 3 || this.currentUser?.user_role == 8 ? this.community_id : this.currentUser?.com_id ?? this.currentUser?.id).subscribe((res:any)=>{
      if(!res.error){
        if(this.no == 1){
          this.currenttab = 'me'
          this.apprvBtnHide = false
          this.rows = res.body.added
        }
        else{
          this.currenttab = 'other'
          this.apprvBtnHide = true
          this.rows = res.body.added_by_others
        }
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

  giveApprove(id,no){
    let data = {
      id : id,
      status : no ==2 ? 'rejected' : 'approved'
    }
    this.dataSrv.approveSpendDownOthersTable(data).subscribe((res:any)=>{
      if(!res.error){
        this.toaster.successToastr(res.msg)
        this.getSpnDwn(this.no)
      }
      else{
        this.toaster.errorToastr('Something went wrong please try again leter')
      }
    },err=>{
        this.dataSrv.genericErrorToaster()
    })
  }

  delete1(id){
    let data = {
      id : id
    }
    this.dataSrv.deleteSpendDownOthersTable(data).subscribe((res:any)=>{
      if(!res.error){
        this.toaster.successToastr(res.msg)
        this.getSpnDwn( this.no)
      }
      else{
        this.toaster.errorToastr('Something went wrong please try again leter')
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
   
