import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmedValidator } from 'app/auth/helpers/mustMacth';
import { Patterns } from 'app/auth/helpers/patterns';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import moment from 'moment';
import { ToastrManager } from 'ng6-toastr-notifications';
import { LocationStrategy } from '@angular/common';


@Component({
  selector: 'app-clockin',
  templateUrl: './clockin.component.html',
  styleUrls: ['./clockin.component.scss']
})
export class ClockinComponent implements OnInit {
  private timeoutId: any;
  private readonly inactivityDuration = 30000; // 30 Sec


  agencyForm!: FormGroup;
  slcSftForm!: FormGroup;
  newUser!: FormGroup;

  activeTab: number = 1

  public currentUser: User;

  slctCpType: any;
  sec_key: any;
  searchStr: string = '';
  todaysDate: any;
  minDate: string;
  
  rows1: any = []
  curntUsrvl: any[] = []
  linked_with: any[] = [];

  btnShow: boolean = false;
  rfhLoad: boolean = false;
  deletingUser: boolean ;
  submit1: boolean = false;
  welcomeClockIN:boolean=false;
  btnHide: boolean = false;
  cmpltHide: boolean =false ;


  fromTime: number = new Date().getTime(); workId: any;

  @ViewChild('Disagree') Disagree: ElementRef<any>;
  @ViewChild('slcSft') slcSft: ElementRef<any>;
  @ViewChild('newReg') newReg: ElementRef<any>;
  @ViewChild('Confrm') Confrm: ElementRef<any>;

  agreeData: any = []
  frstFrmData: any;
  agreeData1: any;
  agreeData2: any;
  agreeData3: any;
  agreeData4: any;
  agreeData5: any;
  srt_endStts: any;
  slctSftId: any;
  cpId: any;
  agncId: any;
  drton2: string;
  slctAgncy: any;
  // uData: any;
  strtShft: any;
  agreeData10: any;
  agreeData11: any;
  agreeData12: any;
  endShft: any;
  shiftCng: any;
  frstFrmData1: any ;
  clockOutPopUp: any;
  newUserDet: any;
  myItem: string;
  loggedUser: User;
  locl_Sec_k: any;
  dummyUrl: string;
  
  constructor (private fb: FormBuilder,private dataService: DataService,private _authenticationService: AuthenticationService,
    private tost: ToastrManager,private modalService: NgbModal,private location: LocationStrategy) {
      this.dummyUrl = window.location.pathname
      this._authenticationService.currentUser.subscribe(x => {this.currentUser = x});
      history.pushState(null, null, window.location.href);  
      this.location.onPopState(() => {
        history.pushState(null, null, window.location.href);
      });  
      localStorage.setItem('ClockIn', JSON.stringify('Yes'));
    }

ngOnInit(): void {
  this.dummyUrl = window.location.pathname
  let today = new Date();
  this.todaysDate = this.getDate(today)
  this.getStrShftDtl()
  this.initForms()
  this.locl_Sec_k =  JSON.parse(localStorage.getItem('Secretkey'));
  let token_fnd =  JSON.parse(localStorage.getItem('Carental-admin-auth-token'));
  if(this.locl_Sec_k || !token_fnd){
    this.sumtKey()
  }
  this.resetTimeout();
}

initForms() {
  this.agencyForm = this.fb.group({
    agency: ['', [Validators.required]],
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  })
  this.slcSftForm = this.fb.group({
    chooseShift: ['', [Validators.required]]
  })
  this.newUser = this.fb.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone_number: ['', [Validators.required, Validators.pattern(Patterns.number)]],
    PIN_code: ['', Validators.required],
    password: ['',Validators.compose([Validators.required, Validators.pattern(Patterns.password)])],
    cnfrmpassword:  ['', [Validators.required]]
  }, { 
    validator: ConfirmedValidator('password', 'cnfrmpassword')
  },
  )
}

resetTimeout() {
  clearTimeout(this.timeoutId);
  this.timeoutId = setTimeout(() => {
  this.rfsh()
  }, this.inactivityDuration);
}

ngOnDestroy() {
  this.agencyForm.reset();
  this.agencyForm.get('chooseShift').setValue(' ');
  clearTimeout(this.timeoutId);
  this.agencyForm.reset()
}

getDate(today) {
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
  
agncyCng(e) {
  this.slctAgncy = e.target.value
}

  get agf() {
    return this.agencyForm.controls;
  }

  get fc3() {
    return this.slcSftForm.controls;
  }

  get controls() {
    return this.newUser.controls;
  }

  closeded(modal: NgbModalRef) {
    modal.dismiss();
    this.newUser.reset()
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

  getStrShftDtl() {
    setTimeout(() => {
      this.myItem = localStorage.getItem('Secretkey');
      if(this.myItem == null){
        this.welcomeClockIN = false
      }else{
        this.welcomeClockIN = true
      }
    }, 200);
    let data = {
      id: this.currentUser?.id,
    }
    this.dataService.clockInPortal(data).subscribe((res: any) => {
      if (!res.error) {
        this.srt_endStts = res.body
        if(this.srt_endStts?.res?.length){
          this.slctSftId =  this.srt_endStts?.res[0]?.shift_id
          this.cpId = this.srt_endStts.res[0]?.user_id
          this.agncId = this.srt_endStts.res[0]?.aggency_id
          let drton = this.srt_endStts?.totalHours * 60
            this.drton2 = drton.toString().split('.')[0]
        }
      }
        if (this.srt_endStts.started == 1) {
          this.activeTab = 7
          this.srt_endStts.is_stopped == 0 ? this.btnHide = true : this.btnHide =false
          if(this.srt_endStts.is_stopped == 0){
            this.dataService.startTracker(this.drton2 ? this.drton2  : 0);
          }else{
            this.dataService.startTracker(this.drton2 ? this.drton2  : 0);
            this.dataService.closeTracker()
          }
        } else {
          this.activeTab = 1
          
        }
    },
      (err) => {
        this.dataService.genericErrorToaster();
      })
  }

  shiftCng2(e) {
    this.frstFrmData1 = ''
    this.shiftCng = e.target.value
    this.dataService.getUserAssignedShift(this.shiftCng).subscribe((res: any) => {
      if (!res.error) {
        this.strtShft="";
        this.endShft='';
        this.frstFrmData1 = res.body
        if(this.frstFrmData1?.length > 0){
          if(this.frstFrmData1[0].clocked_in_out == 1 && this.frstFrmData1[0].status == 1){
            this.strtShft = this.frstFrmData1[0].user_start_time
            this.btnHide = true      
          }else if(this.frstFrmData1[0].clocked_in_out == 0 && this.frstFrmData1[0].status == 2){
            this.strtShft = this.frstFrmData1[0].user_start_time
            this.endShft = this.frstFrmData1[0].user_end_time
          }else if(this.frstFrmData1[0].clocked_in_out == 0 && this.frstFrmData1[0].status == 0){
            this.cmpltHide = false;
            this.btnHide = false;
          }
        }else{
        }
      }
    },
      (err) => {
        this.dataService.genericErrorToaster();
      })
  }

  //tab1 secret key submit
  sumtKey(){
    if (!this.sec_key && !this.locl_Sec_k) {
      this.submit1 = true
      return;
    }
    let data ={
      key : this.sec_key || this.locl_Sec_k
    }
    this.dataService.clockInPortalLogin(data).subscribe((res: any) => {
      if (!res.error) {
      localStorage.setItem('Secretkey',JSON.stringify(this.sec_key || this.locl_Sec_k))
      this.loggedUser = res.body[0];
      this._authenticationService.setLogin(res.body[0]) 
      window.location.reload()
        this.tost.successToastr(res.msg)
        this.welcomeClockIN = true;
      }else{
        this.tost.errorToastr(res.msg)
      }
    },
      (err) => {
        this.dataService.genericErrorToaster();
      })

}

  //register new user
  newUsersubmitted(modal){
    for (let item of Object.keys(this.controls)) {
      this.controls[item].markAsDirty()
    }
    if (this.newUser.invalid) {
      return;
    }
    let data = {
      phone_number: this.newUser.value.phone_number,
      email: this.newUser.value.email,
      first_name: this.newUser.value.first_name,
      last_name: this.newUser.value.last_name,
      PIN_code: this.newUser.value.PIN_code,
      password: this.newUser.value.password,
      agency_id : [this.agencyForm.value.agency]
    }
    this.dataService.addAgencyUser(data).subscribe((res: any) => {
      if (!res.error) {
       this.tost.successToastr(res.msg)
       this.goback(modal)
      }
    },
    (err) => {
      this.dataService.genericErrorToaster();
    })
  } 

  agencyFormSubmit() {
    for (let item of Object.keys(this.agf)) {
      this.agf[item].markAsDirty()
    }
    if (this.agencyForm.invalid) {
      this.activeTab = 1;
      return;
    }
    this.btnShow = true;
    let data = {
      username: this.agencyForm.value.username.replace(' ','').trim(),
      agency_id: this.slctAgncy,
      community_id:this.currentUser?.id,
      password:this.agencyForm.value.password
    }

    this.dataService.verifyUser(data).subscribe((res: any) => {
      this.newUserDet = res?.body
      this.btnShow = false;
    
      if(res.msg == 'User Shifts'){
      this.frstFrmData = res.body.agAssignedShift
      // this.uData = res.body.uData[0]
      if(this.frstFrmData.length > 0){
        this.modalOpenOSE(this.slcSft, 'lg');
      }else{
        this.tost.errorToastr('You Have No Shift')
      }
     
      } else if(res.msg == 'Wrong credentials'){
        this.tost.errorToastr(res.msg)
      }else if(res.msg == 'No User Shifts found'){
        this.tost.errorToastr(res.msg)
      }else if(res.is_started == false){
       let time =  moment(res.body).format("YYYY-MM-DD hh:mm a")
        this.tost.errorToastr('Shift Start After'+ ' ' + time)
      }
      else if(res.is_new == true){
        // this.uData = res.body
        this.modalOpenOSE(this.Confrm, 'lg');

      }
    },
      (err) => {
        this.btnShow = false;
        this.dataService.genericErrorToaster();
      })
  }

 

  //disagree popup open
  disAgree() {
    this.modalOpenOSE(this.Disagree, 'lg');
  }

  getClockOut() {
    let data = {shift_id:this.slcSftForm.value.chooseShift,agency_id : this.agencyForm.value.agency}
    this.dataService.getClockOut(data).subscribe((res: any) => {
      if (res) {
        this.clockOutPopUp = res.body
        if (this.clockOutPopUp?.clockOut_Completed_1 == 0 || this.clockOutPopUp?.clockOut_Completed_1 == '0') {
          this.activeTab = 10;
        } else if (this.clockOutPopUp?.clockOut_Completed_2 == 0 || this.clockOutPopUp?.clockOut_Completed_2 == '0') {
          this.activeTab =11;
        } else if (this.clockOutPopUp?.clockOut_Completed_3 == 0  || this.clockOutPopUp?.clockOut_Completed_3 == '0') {
          this.activeTab = 12;
        }
      }
    },
      (err) => {
        this.dataService.genericErrorToaster();
      })
  }

  //clockin functions
  tab3Submit(no) {
    this.agreeData1 = no
    if (no == 0) {
    this.disAgree()
      let data = {
        clockIn_delay: this.agreeData1 ? this.agreeData1 : this.rows1?.clockIn_delay,
        agency_id: this.agencyForm.value.agency,
        shift_id: this.slcSftForm.value.chooseShift,
        phone_num : this.agencyForm.value.phone_no,
        is_for: 'agency',
        for_clockIn_delay: true,
        is_agree : true
      }
      this.dataService.shiftClockIn(data).subscribe((res: any) => {
        if (res) {
          
        }
      },
        (err) => {
          this.dataService.genericErrorToaster();
        })
    } else {
      let data = {
        clockIn_delay: this.agreeData1 ? this.agreeData1 : this.rows1?.clockIn_delay,
        agency_id: this.agencyForm.value.agency,
        shift_id: this.slcSftForm.value.chooseShift,
        is_for: 'agency',
        is_agree : false
      }
      this.dataService.shiftClockIn(data).subscribe((res: any) => {},
        (err) => {
          this.dataService.genericErrorToaster();
        })
      this.activeTab = 4;
    }
  }

  tab4Submit(no) {
    this.agreeData2 = no
    if (no == 0) {
      this.disAgree()
      let data = {
        clockIn_responsibilities: this.agreeData2 ? this.agreeData2 : this.rows1?.clockIn_responsibilities,
        agency_id: this.agencyForm.value.agency,
        shift_id: this.slcSftForm.value.chooseShift,
        phone_num : this.agencyForm.value.phone_no,
        is_for: 'agency',
        for_clockIn_responsibilities: true,
        is_agree : true
      }
      this.dataService.shiftClockIn(data).subscribe((res: any) => {
        if (res) {
          
        }
      },
        (err) => {
          this.dataService.genericErrorToaster();
        })
    } else {
      let data = {
        clockIn_responsibilities: this.agreeData2 ? this.agreeData2 : this.rows1?.clockIn_responsibilities,
        agency_id: this.agencyForm.value.agency,
        shift_id: this.slcSftForm.value.chooseShift,
        is_for: 'agency',
        is_agree : false

      }
      this.dataService.shiftClockIn(data).subscribe((res: any) => {
        if (res) {
          
        }
      },
        (err) => {
          this.dataService.genericErrorToaster();
        })
      this.activeTab = 5;
    }
  }

  tab5Submit(no) {
    this.agreeData3 = no
    if (no == 0) {
      this.disAgree()
      let data = {
        clockIn_training: this.agreeData3 ? this.agreeData3 : this.rows1?.clockIn_training,
        agency_id: this.agencyForm.value.agency,
        shift_id: this.slcSftForm.value.chooseShift,
        phone_num : this.agencyForm.value.phone_no,
        is_for: 'agency',
        for_clockIn_training: true,
        is_agree : true

      }
      this.dataService.shiftClockIn(data).subscribe((res: any) => {
        if (res) {
          
        }
      },
        (err) => {
          this.dataService.genericErrorToaster();
        })
    } else {
      let data = {
        clockIn_training: this.agreeData3 ? this.agreeData3 : this.rows1?.clockIn_training,
        agency_id: this.agencyForm.value.agency,
        shift_id: this.slcSftForm.value.chooseShift,
        is_for: 'agency',
        is_agree : false
      }
      this.dataService.shiftClockIn(data).subscribe((res: any) => {
        if (res) {
          
        }
      },
        (err) => {
          this.dataService.genericErrorToaster();
        })
    }
    this.activeTab = 6;
  }

  tab6Submit(no) {
    this.agreeData4 = no
    if (no == 0) {
      this.disAgree()
      let data = {
        clockIn_covid: this.agreeData4 ? this.agreeData4 : this.rows1?.clockIn_covid,
        agency_id: this.agencyForm.value.agency,
        shift_id: this.slcSftForm.value.chooseShift,
        phone_num : this.agencyForm.value.phone_no,
        is_for: 'agency',
        for_clockIn_covid: true,
        is_agree : true

      }
      this.dataService.shiftClockIn(data).subscribe((res: any) => {
        if (res) {
          
        }
      },
        (err) => {
          this.dataService.genericErrorToaster();
        })
    } else {
      let data = {
        clockIn_covid: this.agreeData4 ? this.agreeData4 : this.rows1?.clockIn_covid,
        agency_id: this.agencyForm.value.agency,
        shift_id: this.slcSftForm.value.chooseShift,
        is_for: 'agency',
        is_agree : false
      }
      this.dataService.shiftClockIn(data).subscribe((res: any) => {
        if (res) {
          
        }
      },
        (err) => {
          this.dataService.genericErrorToaster();
        })
      this.activeTab = 7;
    }
  }

  tab7Submit(no) {
    this.agreeData5 = no
    if (no == 0) {
      this.disAgree()
      let data = {
        clockIn_safety: this.agreeData5 ? this.agreeData5 : this.rows1?.clockIn_safety,
        agency_id: this.agencyForm.value.agency,
        shift_id: this.slcSftForm.value.chooseShift,
        phone_num : this.agencyForm.value.phone_no,
        is_for: 'agency',
        for_clockIn_safety: true,
        is_agree : true
      }
      this.dataService.shiftClockIn(data).subscribe((res: any) => {
        if (res) {
          
        }
      },
        (err) => {
          this.dataService.genericErrorToaster();
        })
    } 
    else {
      let data = {
        clockIn_safety: this.agreeData5 ? this.agreeData5 : this.rows1?.clockIn_safety,
        agency_id: this.agencyForm.value.agency,
        shift_id: this.slcSftForm.value.chooseShift,
        is_for: 'agency',
        is_agree : false
      }
      this.dataService.shiftClockIn(data).subscribe((res: any) => {
        if (res) {
          
        }
      },
        (err) => {
          this.dataService.genericErrorToaster();
        })
      this.activeTab = 8;
    }
    let data = {
      clockIn_delay: this.agreeData1 ? this.agreeData1 : this.rows1?.clockIn_delay,
      clockIn_responsibilities: this.agreeData2 ? this.agreeData2 : this.rows1?.clockIn_responsibilities,
      clockIn_training: this.agreeData3 ? this.agreeData3 : this.rows1?.clockIn_training,
      clockIn_covid: this.agreeData4 ? this.agreeData4 : this.rows1?.clockIn_covid,
      clockIn_safety: this.agreeData5 ? this.agreeData5 : this.rows1?.clockIn_safety,
      agency_id: this.agencyForm.value.agency,
      shift_id: this.slcSftForm.value.chooseShift,
      is_for: 'agency'
    }
    this.dataService.shiftClockIn(data).subscribe((res: any) => {
      if (res) {
        
      }
    },
      (err) => {
        this.dataService.genericErrorToaster();
      })
  }

  tab8Submit() {
    let data = {
      is_for:  "agency",
      id : this.slcSftForm.value.chooseShift,
      agency_id:  this.agencyForm.value.agency,
      clockIn:true
    }
    this.dataService.startShiftByID(data).subscribe((res: any) => {
      if (res.err == false) {
        this.tost.successToastr(res.msg)
        this.activeTab = 1
        this.agencyForm.reset();
        this.agencyForm.get('agency').setValue('')
        this.slcSftForm.reset();
        this.slcSftForm.get('chooseShift').setValue('')
        }
      },
        (err) => {
          this.dataService.genericErrorToaster();
        })
      this.btnHide = true
  }

//clockout functions
  tab9Submit(no) {
    this.agreeData10 = no
    if (no == 0) {
      let data = {
        clockOut_Complete1: this.agreeData10 ? this.agreeData10 : this.clockOutPopUp?.clockOut_Completed_1,
        agency_id: this.agencyForm.value.agency,
        shift_id: this.slcSftForm.value.chooseShift,
        is_agree : true
      }
      this.dataService.addClockOut(data).subscribe((res: any) => {
        if (res) {
          
        }
      },
        (err) => {
          this.dataService.genericErrorToaster();
        })
      this.activeTab = 11;
    } else {
      let data = {
        clockOut_Complete1: this.agreeData10 ? this.agreeData10 : this.clockOutPopUp?.clockOut_Completed_1,
        agency_id: this.agencyForm.value.agency,
        shift_id: this.slcSftForm.value.chooseShift,
        is_agree : false
      }
      this.dataService.addClockOut(data).subscribe((res: any) => {
        if (res) {
          
        }
      },
        (err) => {
          this.dataService.genericErrorToaster();
        })
      this.activeTab = 11;
    }
  }

  tab10Submit(no) {
    this.agreeData11 = no
    if (no == 0) {
      let data = {
        clockOut_Complete2: this.agreeData11 ? this.agreeData11 : this.clockOutPopUp?.clockOut_Completed_2,
        agency_id: this.agencyForm.value.agency,
        shift_id: this.slcSftForm.value.chooseShift,
        is_agree : true
      }
      this.dataService.addClockOut(data).subscribe((res: any) => {
        if (res) {
          
        }
      },
        (err) => {
          this.dataService.genericErrorToaster();
        })
      this.activeTab = 12;
    } else {
      let data = {
        clockOut_Complete2: this.agreeData11 ? this.agreeData11 : this.clockOutPopUp?.clockOut_Completed_2,
        agency_id: this.agencyForm.value.agency,
        shift_id: this.slcSftForm.value.chooseShift,
        is_agree : false
      }
      this.dataService.addClockOut(data).subscribe((res: any) => {
        if (res) {
          
        }
      },
        (err) => {
          this.dataService.genericErrorToaster();
        })
      this.activeTab = 12;
    }
  }

  tab11Submit(no) {
    this.agreeData12 = no
    if (no == 0) {
      let data = {
        clockOut_Complete3: this.agreeData12 ? this.agreeData12 : this.clockOutPopUp?.clockOut_Completed_3,
        agency_id: this.agencyForm.value.agency,
        shift_id: this.slcSftForm.value.chooseShift,
        is_agree : true
      }
      this.dataService.addClockOut(data).subscribe((res: any) => {
        if (res) {
          
          let data = {
            is_for: this.currentUser?.user_role == '5' ? '' : "community_user",
            shift_id: this.slcSftForm.value.chooseShift,
            agency_id: this.agencyForm.value.agency
          }
      
          this.dataService.endShiftByID(data).subscribe((res: any) => {
            if (!res.error) {
              this.strtShft = "";
              this.endShft = "",
              this.strtShft = res.body.user_start_time
              this.endShft = res.body.user_end_time
              this.tost.successToastr(res.msg)
              this.cmpltHide = true
            }
          })
        }
      },
        (err) => {
          this.dataService.genericErrorToaster();
        })
      this.activeTab = 8;
    } else {
      let data = {
        clockOut_Complete3: this.agreeData12 ? this.agreeData12 : this.clockOutPopUp?.clockOut_Completed_3,
        agency_id: this.agencyForm.value.agency,
        shift_id: this.slcSftForm.value.chooseShift,
        is_agree : false
      }
      this.dataService.addClockOut(data).subscribe((res: any) => {
        if (res) {
          

          let data = {
            is_for: this.currentUser?.user_role == '5' ? '' : "community_user",
            shift_id: this.slcSftForm.value.chooseShift,
            agency_id: this.agencyForm.value.agency
          }
      
          this.dataService.endShiftByID(data).subscribe((res: any) => {
            if (!res.error) {
              this.strtShft = res.body.user_start_time
              this.endShft = res.body.user_end_time
              this.tost.successToastr(res.msg)
              this.cmpltHide = true
              setTimeout(() => {
                this.activeTab = 1
                this.agencyForm.reset()
                this.slcSftForm.reset()
              }, 10000);
            }
          })

        }
      },
        (err) => {
          this.dataService.genericErrorToaster();
        })
      this.activeTab = 8;
    }


  }

  closeDismiss(modal){
    modal.dismiss();
  }

  ConfrmOk(modal){
    this.closeded(modal)
    this.modalOpenOSE(this.newReg, 'lg');
    this.newUser.patchValue({
      phone_number: this.newUserDet[0]?.phone_number,
      first_name: this.newUserDet[0]?.user_name,
      last_name: this.newUserDet[0]?.user_lastname,
      PIN_code: this.newUserDet[0]?.pin,
      agency_id: this.newUserDet[0]?.aggency_id,
    });
  }

  slcSftFormSubmit() {
    for (let item of Object.keys(this.fc3)) {
      this.fc3[item].markAsDirty()
    }
    if (this.slcSftForm.invalid) {
      return;
    }
    this.modalService.dismissAll()
    this.getShiftClockIn()
  }

  getShiftClockIn() {
    let data = {
      shift_id: this.slcSftForm.value.chooseShift,
      agency_id: this.agencyForm.value.agency,
    }
    this.dataService.getShiftClockIn(data).subscribe((res: any) => {
      if (res) {
        this.rows1 = res.body
        if (this.rows1['clockIn_delay'] == 0 || this.rows1['clockIn_delay'] == '0') {
                this.activeTab = 3;
              } else if (this.rows1['clockIn_responsibilities'] == 0 || this.rows1['clockIn_responsibilities'] == '0') {
                this.activeTab = 4;
              } else if (this.rows1['clockIn_training']== 0  || this.rows1['clockIn_training']== '0') {
                this.activeTab = 5;
              }else if ( this.rows1['clockIn_covid'] == 0 || this.rows1['clockIn_covid'] == '0') {
                this.activeTab = 6;
              } else if (this.rows1['clockIn_safety'] == 0 || this.rows1['clockIn_safety'] == '0') {
                this.activeTab = 7;
              } else {
                this.activeTab = 8;
              }
      }
    },
      (err) => {
        this.dataService.genericErrorToaster();
      })
  }


  rfsh(){
    this.rfhLoad = true;
    window.location.reload()
    this.rfhLoad = false;
  }

  //reset agency form and navigate to tab1
  goToHome(){
    this.agencyForm.reset()
    this.activeTab = 1;
    this.rfsh()
  }

  //close the clockin/out popup and move to tab 1
  goback(modal){
    this.modalService.dismissAll()
    this.activeTab = 1
    this.agencyForm.reset()
    this.slcSftForm.reset()
  }
}
