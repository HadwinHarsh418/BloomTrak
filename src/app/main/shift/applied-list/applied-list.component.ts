import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  cancel_reason: string;
  resonIsNull: boolean;
  defaultNo: any;
  tDate:any;

  constructor(
    private dataService: DataService,
    private _authenticationService: AuthenticationService,
    private aCtRoute: ActivatedRoute,
    private tost: ToastrManager,
    private loct : Location,
    private modalService: NgbModal,

  ) {
    this._authenticationService.currentUser.subscribe
      (x => {
        this.currentUser = x
      }
      );

    this.aCtRoute.params.subscribe(
      res => {
        this.prmData = res
        this.applied(res)
      }
    )
this.tDate=new Date()
this.tDate=moment.unix(this.tDate/1000000);  
console.log('ttttttttttt',this.tDate)
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

        this.appliedUser()
      }
    },
      (err) => {
        this.dataService.genericErrorToaster();
      })
  }

  appliedUser() {
    let body = {
      is_for: this.currentUser.role == 'Community' || this.currentUser.role == 'SuperAdmin' ? 'cp' : '',
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

  assignShift(snglUsr) {
    if(snglUsr.agency_user_data?.length){
      this.body = {
        id: this.shiftID,
        user_id: snglUsr.user_id == null ? snglUsr.aggency_id : snglUsr.user_id,
        is_for: snglUsr.user_id == null ? 'agency' : 'community_user',
        phone_number:snglUsr.agency_user_data[0].phone_number,
        agency_user :  snglUsr.agency_user_data[0].id 
      }
    }else{
    this.body = {
        id: this.shiftID,
        user_id: snglUsr.user_id == null ? snglUsr.aggency_id : snglUsr.user_id,
        is_for: snglUsr.user_id == null ? 'agency' : 'community_user',
        agency_user :  snglUsr.phone_number
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

  cancelAppliedShift(snglUsr){
    let data = {
      shift_id: snglUsr.shift_id,
      // user_id: snglUsr.community_id,
      community_id:this.currentUser.id
    }
    this.dataService.cancelAppliedShift(data).subscribe((res: any) => {
      if (!res.error) {
          // this.appliedUser()
          this.tost.successToastr(res.msg)
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

  openMOdl(no){
    this.defaultNo=null;
    this.defaultNo = no
    if(no == 2 || no == 3){
      this.modalOpenOSE(this.reasonMdl, 'lg');
    }
  }



  cnclAndArch(no?){
    if(!this.cancel_reason){
      this.resonIsNull = true
      return
    }else{
      this.resonIsNull = false
    }
   let data = {
      shift_id: this.prmData.id,
      is_cancel: this.defaultNo,
      community_id:this.currentUser.user_role == 4 ? this.currentUser.com_id : this.currentUser.id,
      is_for : no == 1 ? 'all' : '',
      shift_cancel_reason : this.cancel_reason
    }  
    this.dataService.cancelShiftStatus (data).subscribe((res: any) => {
      if (!res.error) {
          this.tost.successToastr(res.msg)
          this.appliedUser()
           window.location.reload()
      }else{
        this.tost.errorToastr(res.msg)
      }
    },
      (err) => {
        this.dataService.genericErrorToaster()
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
