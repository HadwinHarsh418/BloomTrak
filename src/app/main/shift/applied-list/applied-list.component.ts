import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import moment from 'moment';

@Component({
  selector: 'app-applied-list',
  templateUrl: './applied-list.component.html',
  styleUrls: ['./applied-list.component.scss']
})
export class AppliedListComponent implements OnInit {
  public contentHeader: object;
  shiftID: any;
  singleShiftdtail: any;
  currentUser: any;
  appliedUserdtail: any;
  prmData: any;
  chngVal: string;
  body: any;
  assingToAgncy: any;
  @ViewChild('reasonMdl') reasonMdl: ElementRef<any>;
  @ViewChild('inside')inside:ElementRef<any>;
  @ViewChild('comUsrApply1')comUsrApply1:ElementRef<any>;
  @ViewChild('reasonMdlCancel')reasonMdlCancel:ElementRef<any>;
  cancel_reason: string;
  resonIsNull: boolean;
  defaultNo: any;
  tDate:any;
  comid: any;
  userId: any;
  curComDetails: any;
  checkErrorDate: any;
  snglShftDtls: any;
  Showbtn: any;
  id: any;
  shoeAsignbtn: boolean;
  commUser: any;
  showpanalty: any;

  constructor(
    private dataService: DataService,
    private _authenticationService: AuthenticationService,
    private aCtRoute: ActivatedRoute,
    private tost: ToastrManager,
    private loct : Location,
    private modalService: NgbModal,
    private router:Router

  ) {
    this._authenticationService.currentUser.subscribe
      (x => {
        this.currentUser = x
      }
      );
      this.currentUser?.user_role == 4 || this.currentUser?.user_role == 1 ? this.getuserDetails() : ''
    this.aCtRoute.params.subscribe(
      res => {
        this.prmData = res
        this.applied(res)
      }
    )
this.tDate=new Date()
this.tDate=moment.unix(this.tDate/1000000);
  }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Applied List',
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
          // {
          //   name: 'Project profile',
          //   isLink: false
          // }
        ]
      }
    };
  }

  applied(row) {
    this.shiftID = row.id || row
    this.dataService.getshiftById(this.shiftID).subscribe((res: any) => {
      if (!res.error) {
        this.singleShiftdtail = res.body
        this.assingToAgncy = res.body[0].assigned
        this.comid = res.body[0].community_id
        this.shoeAsignbtn = this.compareDates(res.body[0]);
        this.showpanalty = res.body[0]?.cancellation_period_reached       
        this.appliedUser()
      }
    },
      (err) => {
        this.dataService.genericErrorToaster();
      })
  }

  goBackShift(){
    this.router.navigate(['/shift','id'])
  }
  closededApply(modal: NgbModalRef) {
    modal.dismiss();
  }
  appliedUser() {
    let body = {
      is_for: this.currentUser?.role == 'Community' || this.currentUser?.role == 'SuperAdmin' ? 'cp' : '',
      shift_id: this.prmData.id,
    }
    this.dataService.getAppliedShiftById(body).subscribe((res: any) => {
      if (!res.error) {
        this.appliedUserdtail = res.body.all
        this.appliedUserdtail.map(i => {
          if (i.aggency_id == null) {
            i.chngVal = i?.first_name + ' ' + i?.last_name
          }
           else if (i.aggency_id != null) {
            if (i.agency_user_data?.length) {
              if(i.agency_user_data?.length && i.agency_user != null){
                i.chngVal = i.agency_user_data[0].first_name + ' ' + i.agency_user_data[0].last_name
              }else{
                i.chngVal = i?.user_name + ' ' + i?.user_lastname
              }
            } else {
              i.chngVal =  i.chngVal = i?.user_name + ' ' + i?.user_lastname

            }
          }
        })
      }
    },
      (err) => {
        this.dataService.genericErrorToaster();
      })
  }
  // applyShiftToAgency(row, no) {
  //   this.prmsUsrId = row;
  //   if (this.currentUser?.user_role != 2 && this.currentUser?.user_role != 5) {
  //     this.modalOpenOSE(this.comUsrApply, 'lg')
  //   } else {
  //     this.getAgncyUsrLst()
  //     this.modalOpenOSE(this.UserLiST, 'lg');
  //   }
  // }
  assignShift(snglUsr) {
    if(snglUsr.agency_user_data?.length){
      this.body = {
        id: this.shiftID,
        user_id: snglUsr.user_id == null ? snglUsr.aggency_id : snglUsr.user_id,
        is_for: snglUsr.user_id == null ? 'agency' : 'community_user',
        phone_number:snglUsr.agency_user_data[0].phone_number,
        agency_user :  snglUsr.agency_user_data[0].id,
        assigned_by : this.curComDetails
      }
    }else{
    this.body = {
        id: this.shiftID,
        user_id: snglUsr.user_id == null ? snglUsr.aggency_id : snglUsr.user_id,
        is_for: snglUsr.user_id == null ? 'agency' : 'community_user',
        agency_user :  snglUsr.phone_number,
        assigned_by : this.curComDetails
          }
    }
    
    this.dataService.assignShift(this.body).subscribe((res: any) => {
      if (!res.error) {
        this.tost.successToastr(res.msg)
        this.appliedUser()
        this.applied(this.prmData.id)
      }else{
        this.tost.errorToastr(res.msg)
      }
    },
      (err) => {
        this.dataService.genericErrorToaster();
      })
      this.appliedUser()

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

  cancelAppliedShift(snglUsr){
    this.commUser = snglUsr
    this.modalOpenOSE(this.reasonMdlCancel)
  }

  openMOdl(no){
    this.defaultNo=null;
    this.defaultNo = no
    if(no == 2 || no == 3 || no == 1){
      this.modalOpenOSE(this.reasonMdl, 'lg');
    }else
    this.modalOpenOSE(this.inside,'lg');
    }
  getuserDetails()
   {
    if(this.currentUser?.user_role == 4){
    let id = this.currentUser?.id;
    let is_for = 'user'
    this.dataService.getUserById('',id, is_for).subscribe(response => {
        if (response.body && response.body[0] && response.body[0]) {
          this.curComDetails = response.body[0]?.first_name + ' ' + response.body[0]?.last_name
        }})}
       else {
        this.dataService.getcommunityById(this.currentUser?.id).subscribe(response => {
          if (!response.error) {
            if (response.body && response.body[0] && response.body[0]) {
              this.curComDetails = response.body[0].community_name
            }
          
      }
    }
    
    );
  }}


  cnclAndArch(no?,val?:any){
    
    if(!this.cancel_reason){
      this.resonIsNull = true
      return
    }else{
      this.resonIsNull = false
    }
   let data = {
      shift_id: this.prmData.id,
      is_cancel: no ? no : this.defaultNo,
      community_id:this.currentUser?.user_role == 4 ? this.currentUser?.com_id : this.currentUser?.id,
      is_for :this.defaultNo == 1 || no == 1 ? 'all' : '',
      shift_cancel_reason : this.cancel_reason,
      canceled_by: this.curComDetails ?? 'Bloomtrak'
    }  
    this.dataService.cancelShiftStatus(data).subscribe((res: any) => {
      if (!res.error) { 
          this.tost.successToastr(res.msg)
          this.appliedUser()
          if(this.defaultNo == 1 || no == 1){
            let data={
              id:this.prmData.id,
              archived_by: this.curComDetails,
              cancel_reason: this.cancel_reason,
            }
            this.dataService.deleteshift(data).subscribe((res: any) => {
              if (!res.error) {
                this.modalService.dismissAll();
                this.router.navigate(['/shift'])
              }
              else {
                this.tost.errorToastr(res.msg)
              }
            })
          }else{
            window.location.reload()
          }
      }else{
        this.tost.errorToastr(res.msg)
      }
    },
      (err) => {
        this.dataService.genericErrorToaster()
      })
  }

  cnclreasonMdl(){
    let data = {
      shift_id: this.commUser.shift_id,
      // user_id: snglUsr.community_id,
      community_id:this.currentUser?.user_role == 6 ? this.comid :this.currentUser?.user_role == 4 ? this.comid: this.currentUser?.id,
      canceled_by : this.curComDetails,
      is_for : 'community',
      cancel_reason:this.cancel_reason
    }
    if(!this.cancel_reason){
      this.tost.errorToastr("Fill Cancel Reason")
     }else{
      this.dataService.cancelAppliedShift(data).subscribe((res: any) => {
        if (!res.error) {
            // this.appliedUser()
            this.tost.successToastr(res.msg)
            this.modalService.dismissAll()
            // this.loct.back()
            this.appliedUser()
        }else{
          this.tost.errorToastr(res.msg)
          this.loct.back()
        }
      },
        (err) => {
          this.dataService.genericErrorToaster()
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

  insidecancel(){
    this.modalOpenOSE(this.inside,'lg');
  }

  popup(){
    this.modalOpenOSE(this.comUsrApply1,'lg');

  }

  keyupper(cancel_reason){
    if(!cancel_reason){
      this.resonIsNull = true
    }else{
      this.resonIsNull = false
    }
  }
  closeded(modal: NgbModalRef) {
    modal.dismiss();
    this.cancel_reason = ''
  }
}
