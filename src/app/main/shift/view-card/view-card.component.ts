import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { Page } from 'app/utils/models';
import moment from 'moment';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-view-card',
  templateUrl: './view-card.component.html',
  styleUrls: ['./view-card.component.scss']
})
export class ViewCardComponent implements OnInit {
  currentUser: any;
  allShifts: any;
  searchStr: string = '';
  public page = new Page();
  @ViewChild('appliedList') appliedList: ElementRef<any>;
  shiftId: any;
  singleShiftdtail: any = []
  appliedUserdtail: any;

  constructor(
    private dataService: DataService,
    private _authenticationService: AuthenticationService,
    private modalService: NgbModal,
    private tost: ToastrManager,

  ) {
    this._authenticationService.currentUser.subscribe
      (x => {
        this.currentUser = x
        
      }
      );
  }

  ngOnInit(): void {
    this.getCommunityShift()
  }

  getCommunityShift() {
    let currentUser1 = this.currentUser.id;
    let userShift = ''
    let usetype = ''
    if (this.currentUser.role == 'SuperAdmin') {
      this.page.size = 10
      let userShifts = ''
    
      this.dataService.getshift(this.searchStr = '', usetype, this.page.size,userShifts).subscribe((res: any) => {
        
        this.allShifts = res.body
        this.allShifts.map(rt => {
        })
      },
        (err) => {
          this.dataService.genericErrorToaster()
        })
    }
    else if (this.currentUser.role == 'Agency' || this.currentUser.role == 'User') {

      if(this.currentUser.user_role == '5'){
        this.dataService.getUserAgencyshiftById(this.currentUser.id).subscribe((res: any) => {
          this.allShifts = res.body.userShifts
          this.allShifts.map(rt => {
          })
        },
          (err) => {
            this.dataService.genericErrorToaster()
          })
      }else{
      let for_cp1 = this.currentUser.role == 'User' ? 'true' : 'false';
      let currentUser1 = this.currentUser.id
      let cpType = ''
      let tpUsr = 'typeUser1'
      this.dataService.getCommunityShiftByID(this.searchStr,for_cp1, currentUser1, cpType,tpUsr).subscribe((res: any) => {
        this.allShifts = res.body.userShifts
        this.allShifts.map(rt => {
        })
      },
        (err) => {
          this.dataService.genericErrorToaster()
        })
      }
    }
    else {
      let pageNo = '0'
      let limit = '10'
      let start_time = null
      let end_time = null
      this.dataService.getCommunityShifts(this.searchStr, pageNo, userShift, currentUser1, limit,start_time,end_time).subscribe((res) => {
        if (!res.error) {

          this.allShifts = res.body
          this.allShifts.map(rt => {
          })
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
  closeded(modal: NgbModalRef) {
    modal.dismiss();
  }

  applied(row) {
    this.shiftId = row.id
    this.dataService.getshiftById(row.id).subscribe((res: any) => {
      if (!res.error) {
        this.singleShiftdtail = res.body
        this.singleShiftdtail.map(rt => {
        })
        this.appliedUser(row)
      }
    },
      (err) => {
        this.dataService.genericErrorToaster();
      })

    this.modalOpenOSE(this.appliedList, 'lg');
  }

  appliedUser(row) {
    let data ={
      shift_id: row.id ,
      is_for: "cp"
    }
    this.dataService.getAppliedShiftById(data).subscribe((res: any) => {
      if (!res.error) {
        this.appliedUserdtail = res.body
      }
    },
      (err) => {
        this.dataService.genericErrorToaster();
      })
  }

  assignShift(snglUsr, modal) {
    let body = {
      id: this.shiftId,
      user_id: snglUsr.id
    }
    this.dataService.assignShift(body).subscribe((res: any) => {
      if (!res.error) {
        this.tost.successToastr(res.msg)
        this.closeded(modal)
      }
    },
      (err) => {
        this.dataService.genericErrorToaster();
      })
  }
}
