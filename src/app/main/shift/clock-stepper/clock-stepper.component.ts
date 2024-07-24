import { DatePipe, Location } from '@angular/common';
import { Component, ElementRef, OnInit, Output, ViewChild ,HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmedValidator } from 'app/auth/helpers/mustMacth';
import { Router } from '@angular/router';
import moment from 'moment';
import { Patterns } from 'app/main/authentication/register/helpers/patterns';

@Component({
  selector: 'app-clock-stepper',
  templateUrl: './clock-stepper.component.html',
  styleUrls: ['./clock-stepper.component.scss'],
  providers:[DatePipe]
})
export class ClockStepperComponent implements OnInit {

  private timeoutId: any;
  private readonly inactivityDuration = 69000; // 1 min 15 Sec
  formData!: FormGroup;
  form2Data!: FormGroup;
  slcSftForm!: FormGroup;
  newUser!: FormGroup;
  activeTab: number = 1
  public currentUser: User;
  rows1: any = []
  slctCpType: any;
  sec_key: any;
  searchStr: string = '';
  curntUsrvl: any[] = []
  linked_with: any[] = [];
  btnShow: boolean = false;
  deletingUser: boolean ;
  submit1: boolean = false;
  welcomeClockIN:boolean=false;
  todaysDate: any;
  minDate: string;
  fromTime: number = new Date().getTime(); workId: any;
  @ViewChild('Disagree') Disagree: ElementRef<any>;
  @ViewChild('slcSft') slcSft: ElementRef<any>;
  @ViewChild('newReg') newReg: ElementRef<any>;
  @ViewChild('Confrm') Confrm: ElementRef<any>;
  @ViewChild('keyModal') keyModal: ElementRef<any>;

  agreeData: any = []
  frstFrmData: any;
  agreeData1: any;
  agreeData2: any;
  agreeData3: any;
  agreeData4: any;
  agreeData5: any;
  startDateTime: number;
  intrvl: any;
  stprData: any;
  btnHide: boolean = false;
  srt_endStts: any;
  slctSftId: any;
  cpId: any;
  agncId: any;
  drton2: string;
  cmpltHide: boolean =false ;
  slctAgncy: any;
  uData: any;
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
  showClockOut: any;
  getDifferenceDate: any;
  agencyidd: any;


  constructor
    (
      private fb: FormBuilder,
      private dataService: DataService,
      private _authenticationService: AuthenticationService,
      private tost: ToastrManager,
    private modalService: NgbModal,
    private datePipe:DatePipe

  ) {
    this._authenticationService.currentUser.subscribe
      (x => {
        this.currentUser = x
        
      }
      );

  }

  ngOnInit(): void {
    let today = new Date();
    // this.getUserById()
    this.todaysDate = this.getDate(today)
    this.getStrShftDtl()
    this.formData = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern(Patterns.number)]],
      pin: ['', [Validators.required]],
      dob: ['', [Validators.required]],
      ssn: ['', [Validators.required]],
    })

    this.form2Data = this.fb.group({
      agency: ['',],
      username: ['', [Validators.required]],
      shift_key: ['', [Validators.required]],
      password: ['', [Validators.required]],
    })
    this.form2Data.get('username').valueChanges.subscribe(() => {
      this.clearShiftKeyValidation();
    });
  
    this.form2Data.get('password').valueChanges.subscribe(() => {
      this.clearShiftKeyValidation();
    });
  
    this.form2Data.get('shift_key').valueChanges.subscribe(() => {
      this.updateUsernameAndPasswordValidation();
    });


    this.slcSftForm = this.fb.group({
      chooseShift: ['', [Validators.required]],
      // pin: ['', [Validators.required]],
    })

    this.newUser = this.fb.group({
      // DOB: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required, Validators.pattern(Patterns.number)]],
      // agency_id: [''],
      // hourly_rate: ['',Validators.required],
      PIN_code: ['', Validators.required],
      // community_id: ['',Validators.required],
      // management_Co: [''],
      // management_co_user: ['',Validators.required],
      password: ['',Validators.compose([Validators.required, Validators.pattern(Patterns.password)])],
      cnfrmpassword:  ['', [Validators.required]]
    }, { 
      validator: ConfirmedValidator('password', 'cnfrmpassword')
    },
    )
    
   this.locl_Sec_k =  JSON.parse(localStorage.getItem('Secretkey'));
   let Authtoken = localStorage.getItem('Carental-admin-auth-token');
   let token_fnd =''
   if(Authtoken){
     token_fnd =  JSON.parse(localStorage.getItem('Carental-admin-auth-token'));
   }
   if(this.locl_Sec_k || !token_fnd){
      this.sumtKey()
   }

   this.resetTimeout();

  }

@HostListener('document:mousemove')
@HostListener('document:keypress')
@HostListener('document:scroll')
@HostListener('document:touchstart')
resetTimeout() {
  clearTimeout(this.timeoutId);
  
  this.timeoutId = setTimeout(() => {
    this.form2Data.reset();
    this.form2Data.get('username').setValue('')
    this.form2Data.get('password').setValue('')
    this.slcSftForm.reset();
    this.slcSftForm.get('chooseShift').setValue('')
    this.rfsh()
    
  }, this.inactivityDuration);
}

clearShiftKeyValidation(): void {
    const username = this.form2Data.get('username');
    const password = this.form2Data.get('password');
    const shiftKey = this.form2Data.get('shift_key');
  
    if (username.valid && password.valid) {
        shiftKey.clearValidators();
        shiftKey.updateValueAndValidity();
        shiftKey.disable();
        this.form2Data.get('shift_key').reset();
      } else {
        shiftKey.enable();
      }
  }
  
  
  updateUsernameAndPasswordValidation(): void {
    const shiftKey = this.form2Data.get('shift_key').value;
    const usernameControl = this.form2Data.get('username');
    const passwordControl = this.form2Data.get('password');
  
    if (shiftKey.valid) {
     
        usernameControl.clearValidators();
        passwordControl.clearValidators();
  
        usernameControl.updateValueAndValidity();
        passwordControl.updateValueAndValidity();
  
        
        usernameControl.disable();
        passwordControl.disable();
    } else {
       
        usernameControl.enable();
        passwordControl.enable();
    }
  }
  
  
  
      isShiftKeyDisabled(): boolean {
        if(this.form2Data.get('username').value || this.form2Data.get('password').value){
          this.form2Data.get('shift_key').clearValidators();
          this.form2Data.get('shift_key').disable();
          this.form2Data.get('shift_key').updateValueAndValidity();
        }else{
          this.form2Data.get('shift_key').setValidators([Validators.required]);
          this.form2Data.get('shift_key').enable();
          this.form2Data.get('shift_key').updateValueAndValidity();
        }
        return this.form2Data.get('username').value || this.form2Data.get('password').value ? true : false;
      }
      
      isUsernameDisabled(): boolean {
        return this.form2Data.get('shift_key').value ? true : false;
      }
      
  
  
      shiftkey(value){
        if(value){
          this.form2Data.get('username').clearValidators();
          this.form2Data.get('username').disable();
          this.form2Data.get('username').updateValueAndValidity();
          this.form2Data.get('password').clearValidators();
          this.form2Data.get('password').disable();
          this.form2Data.get('password').updateValueAndValidity();
        }else{
                  this.form2Data.get('username').enable();
          this.form2Data.get('username').setValidators([Validators.required]);
          this.form2Data.get('username').updateValueAndValidity();
                  this.form2Data.get('password').enable();
          this.form2Data.get('password').setValidators([Validators.required]);
          this.form2Data.get('password').updateValueAndValidity();
        }
      }
  


  get fc() {
    return this.formData.controls;
  }
  get fc2() {
    return this.form2Data.controls;
  }

  get fc3() {
    return this.slcSftForm.controls;
  }

  get controls() {
    return this.newUser.controls;
  }
  formDataSubmit() {
    for (let item of Object.keys(this.fc)) {
      this.fc[item].markAsDirty()
    }
    if (this.formData.invalid) {
      this.activeTab = 2;
      return;
    }
    let data = {
      phone_number: this.formData.value.phone?.replace(/\D/g, ''),
      PIN_code: this.formData.value.pin,
      DOB: this.formData.value.dob,
      SSN: this.formData.value.ssn,
      id: this.currentUser?.id
    }
    this.dataService.addUserData(data).subscribe((res: any) => {
      if (res) {
        this.activeTab = 3;
      }
    },
      (err) => {
        this.dataService.genericErrorToaster();
      })

  }

  getShiftClockIn() {
 
    let data = {
      shift_id: this.slcSftForm.value.chooseShift,
      agency_id: this.agencyidd,
    }
    this.dataService.getShiftClockIn(data).subscribe((res: any) => {
      if (res) {
        this.rows1 = res.body;
        this.showClockOut = res.body.clockIn
        if(this.showClockOut == '1'){
          this.activeTab = 8;
        }
        else if (this.rows1['clockIn_delay'] == 0 || this.rows1['clockIn_delay'] == '0') {
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

  getClockOut() {
    
    let data = {shift_id:this.slcSftForm.value.chooseShift,
               agency_id : this.agencyidd,
      clockIn:'2'
              }
    
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
        this.btnHide = false;
      }
    },
      (err) => {
        this.dataService.genericErrorToaster();
      })

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

  form2DataSubmit() {
    for (let item of Object.keys(this.fc2)) {
      this.fc2[item].markAsDirty()
    }
    if (this.form2Data.invalid) {
      this.activeTab = 1;
      return;
    }
    this.btnShow = true;
    let data = {}
    if (this.form2Data.value.password){
      data = {
        username: this.form2Data.value.username.replace(' ','').trim(),
        // PIN_code: this.form2Data.value.pin,
        shift_key: this.form2Data.value.shift_key,
        agency_id: this.slctAgncy,
        community_id:this.currentUser?.id,
        password:this.form2Data.value.password
      }
    }else{
      data = {
        shift_key: this.form2Data.value.shift_key,
        community_id:this.currentUser?.id,
      }
    }
    this.dataService.verifyUser(data).subscribe((res: any) => {

        this.newUserDet = res?.body
    this.btnShow = false;
    
      if(res.msg == 'User Shifts'){
      this.frstFrmData = res.body.agAssignedShift
      this.uData = res.body.uData[0]
      if(this.frstFrmData.length > 0){
        this.modalOpenOSE(this.slcSft, 'lg');
      }else{
        this.tost.errorToastr('You Have No Shift')
      }
     
      } else if(res.msg == "Wrong Credentials"){
        this.tost.errorToastr(res.msg)
      }else if(res.msg == 'No User Shifts found'){
        this.tost.errorToastr(res.msg)
      }else if(res.is_started == false){
       let time =  moment(res.body).format("YYYY-MM-DD hh:mm a")
        this.tost.errorToastr('Shift Start After'+ ' ' + time)
      }
      else if(res.is_new == true){
        // this.router.navigateByUrl('/user')
        this.uData = res.body
        this.modalOpenOSE(this.Confrm, 'lg');

      }
    },
      (err) => {
        this.btnShow = false;
        this.dataService.genericErrorToaster();
      })
  }

  mapVal() {
    this.frstFrmData
    this.formData.patchValue({
      phone: this.frstFrmData.phone_number,
      pin: this.frstFrmData.PIN_code,
    });
    setTimeout(() => {
      this.formData.get('phone').setValue(this.frstFrmData.phone_number);
    }, 40)
  }

  submit(no) {
    this.agreeData1 = no
    if (no == 0) {
    this.disAgree()
      let data = {
        clockIn_delay: this.agreeData1 ? this.agreeData1 : this.rows1?.clockIn_delay,
        // clockIn_responsibilities: this.agreeData2 ? this.agreeData2 : this.rows1?.clockIn_responsibilities,
        // clockIn_training: this.agreeData3 ? this.agreeData3 : this.rows1?.clockIn_training,
        // clockIn_covid: this.agreeData4 ? this.agreeData4 : this.rows1?.clockIn_covid,
        // clockIn_safety: this.agreeData5 ? this.agreeData5 : this.rows1?.clockIn_safety,
        // user_id: this.currentUser?.id,
        agency_id: this.agencyidd,
        shift_id: this.slcSftForm.value.chooseShift,
        phone_num : this.form2Data.value.phone_no,
        is_for: 'agency',
        for_clockIn_delay: true,
        is_agree : true
      }
      this.dataService.shiftClockIn(data).subscribe((res: any) => {
      },
        (err) => {
          this.dataService.genericErrorToaster();
        })
    } else {
      let data = {
        clockIn_delay: this.agreeData1 ? this.agreeData1 : this.rows1?.clockIn_delay,
        agency_id: this.agencyidd,
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
      this.activeTab = 4;
    }
  }

  submit2(no) {
    this.agreeData2 = no
    if (no == 0) {
      this.disAgree()
      let data = {
        clockIn_responsibilities: this.agreeData2 ? this.agreeData2 : this.rows1?.clockIn_responsibilities,
        agency_id: this.agencyidd,
        shift_id: this.slcSftForm.value.chooseShift,
        phone_num : this.form2Data.value.phone_no,
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
        // clockIn_delay: this.agreeData1 ? this.agreeData1 : this.rows1?.clockIn_delay,
        clockIn_responsibilities: this.agreeData2 ? this.agreeData2 : this.rows1?.clockIn_responsibilities,
        // clockIn_training: this.agreeData3 ? this.agreeData3 : this.rows1?.clockIn_training,
        // clockIn_covid: this.agreeData4 ? this.agreeData4 : this.rows1?.clockIn_covid,
        // clockIn_safety: this.agreeData5 ? this.agreeData5 : this.rows1?.clockIn_safety,
        // user_id: this.currentUser?.id,
        agency_id: this.agencyidd,
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
  submit3(no) {
    this.agreeData3 = no
    if (no == 0) {
      this.disAgree()
      let data = {
        // clockIn_delay: this.agreeData1 ? this.agreeData1 : this.rows1?.clockIn_delay,
        // clockIn_responsibilities: this.agreeData2 ? this.agreeData2 : this.rows1?.clockIn_responsibilities,
        clockIn_training: this.agreeData3 ? this.agreeData3 : this.rows1?.clockIn_training,
        // clockIn_covid: this.agreeData4 ? this.agreeData4 : this.rows1?.clockIn_covid,
        // clockIn_safety: this.agreeData5 ? this.agreeData5 : this.rows1?.clockIn_safety,
        // user_id: this.currentUser?.id,
        agency_id: this.agencyidd,
        shift_id: this.slcSftForm.value.chooseShift,
        phone_num : this.form2Data.value.phone_no,
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
        // clockIn_delay: this.agreeData1 ? this.agreeData1 : this.rows1?.clockIn_delay,
        // clockIn_responsibilities: this.agreeData2 ? this.agreeData2 : this.rows1?.clockIn_responsibilities,
        clockIn_training: this.agreeData3 ? this.agreeData3 : this.rows1?.clockIn_training,
        // clockIn_covid: this.agreeData4 ? this.agreeData4 : this.rows1?.clockIn_covid,
        // clockIn_safety: this.agreeData5 ? this.agreeData5 : this.rows1?.clockIn_safety,
        // user_id: this.currentUser?.id,
        agency_id: this.agencyidd,
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
    this.activeTab = 8;

  }

  submit6(no) {
    this.agreeData4 = no
    if (no == 0) {
      this.disAgree()
      let data = {
        // clockIn_delay: this.agreeData1 ? this.agreeData1 : this.rows1?.clockIn_delay,
        // clockIn_responsibilities: this.agreeData2 ? this.agreeData2 : this.rows1?.clockIn_responsibilities,
        // clockIn_training: this.agreeData3 ? this.agreeData3 : this.rows1?.clockIn_training,
        clockIn_covid: this.agreeData4 ? this.agreeData4 : this.rows1?.clockIn_covid,
        // clockIn_safety: this.agreeData5 ? this.agreeData5 : this.rows1?.clockIn_safety,
        // user_id: this.currentUser?.id,
        agency_id: this.agencyidd,
        shift_id: this.slcSftForm.value.chooseShift,
        phone_num : this.form2Data.value.phone_no,
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
        // clockIn_delay: this.agreeData1 ? this.agreeData1 : this.rows1?.clockIn_delay,
        // clockIn_responsibilities: this.agreeData2 ? this.agreeData2 : this.rows1?.clockIn_responsibilities,
        // clockIn_training: this.agreeData3 ? this.agreeData3 : this.rows1?.clockIn_training,
        clockIn_covid: this.agreeData4 ? this.agreeData4 : this.rows1?.clockIn_covid,
        // clockIn_safety: this.agreeData5 ? this.agreeData5 : this.rows1?.clockIn_safety,
        // user_id: this.currentUser?.id,
        agency_id: this.agencyidd,
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
  submit4(no) {
    this.agreeData5 = no
    if (no == 0) {
      this.disAgree()
      let data = {
        // clockIn_delay: this.agreeData1 ? this.agreeData1 : this.rows1?.clockIn_delay,
        // clockIn_responsibilities: this.agreeData2 ? this.agreeData2 : this.rows1?.clockIn_responsibilities,
        // clockIn_training: this.agreeData3 ? this.agreeData3 : this.rows1?.clockIn_training,
        // clockIn_covid: this.agreeData4 ? this.agreeData4 : this.rows1?.clockIn_covid,
        clockIn_safety: this.agreeData5 ? this.agreeData5 : this.rows1?.clockIn_safety,
        // user_id: this.currentUser?.id,
        agency_id: this.agencyidd,
        shift_id: this.slcSftForm.value.chooseShift,
        phone_num : this.form2Data.value.phone_no,
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
        // clockIn_delay: this.agreeData1 ? this.agreeData1 : this.rows1?.clockIn_delay,
        // clockIn_responsibilities: this.agreeData2 ? this.agreeData2 : this.rows1?.clockIn_responsibilities,
        // clockIn_training: this.agreeData3 ? this.agreeData3 : this.rows1?.clockIn_training,
        // clockIn_covid: this.agreeData4 ? this.agreeData4 : this.rows1?.clockIn_covid,
        clockIn_safety: this.agreeData5 ? this.agreeData5 : this.rows1?.clockIn_safety,
        // user_id: this.currentUser?.id,
        agency_id: this.agencyidd,
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
      // setTimeout(() => {
      //   this.startTime()
      // }, 200);
      this.activeTab = 8;
    }
    let data = {
      clockIn_delay: this.agreeData1 ? this.agreeData1 : this.rows1?.clockIn_delay,
      clockIn_responsibilities: this.agreeData2 ? this.agreeData2 : this.rows1?.clockIn_responsibilities,
      clockIn_training: this.agreeData3 ? this.agreeData3 : this.rows1?.clockIn_training,
      clockIn_covid: this.agreeData4 ? this.agreeData4 : this.rows1?.clockIn_covid,
      clockIn_safety: this.agreeData5 ? this.agreeData5 : this.rows1?.clockIn_safety,
      // user_id: this.currentUser?.id,
      agency_id: this.agencyidd,
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
  submit5() {
    // debugger;
    let data = {
      is_for:  "agency",
      id : this.slcSftForm.value.chooseShift,
      agency_id:  this.agencyidd,
      clockIn:'1'
    }

    this.dataService.startShiftByID(data).subscribe((res: any) => {
      if (res.err == false) {
        this.tost.successToastr(res.msg)
        this.activeTab = 1
        this.form2Data.reset();
        this.form2Data.get('agency').setValue('')
        this.slcSftForm.reset();
        this.slcSftForm.get('chooseShift').setValue('')
        }
      },
        (err) => {
          this.dataService.genericErrorToaster();
        })

      // this.startTime()
      this.btnHide = true
  }

  submit10(no) {
    this.agreeData10 = no
    if (no == 0) {
      let data = {
        clockOut_Complete1: this.agreeData10 ? this.agreeData10 : this.clockOutPopUp?.clockOut_Completed_1,
        // clockOut_Complete2: this.agreeData11? this.agreeData11 : this.clockOutPopUp?.clockOut_Completed_2,
        // clockOut_Complete3: this.agreeData12 ? this.agreeData12 : this.clockOutPopUp?.clockOut_Completed_3,
        agency_id: this.agencyidd,
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
        // clockOut_Complete2: this.agreeData11 ? this.agreeData11 : this.clockOutPopUp?.clockOut_Completed_2,
        // clockOut_Complete3: this.agreeData12 ? this.agreeData12 : this.clockOutPopUp?.clockOut_Completed_3,
        agency_id: this.agencyidd,
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

  submit11(no) {
    this.agreeData11 = no
    if (no == 0) {
      let data = {
        // clockOut_Complete1: this.agreeData10 ? this.agreeData10 : this.clockOutPopUp?.clockOut_Completed_1,
        clockOut_Complete2: this.agreeData11 ? this.agreeData11 : this.clockOutPopUp?.clockOut_Completed_2,
        // clockOut_Complete3: this.agreeData12 ? this.agreeData12 : this.clockOutPopUp?.clockOut_Completed_3,
        agency_id: this.agencyidd,
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
        // clockOut_Complete1: this.agreeData10 ? this.agreeData10 : this.clockOutPopUp?.clockOut_Completed_1,
        clockOut_Complete2: this.agreeData11 ? this.agreeData11 : this.clockOutPopUp?.clockOut_Completed_2,
        // clockOut_Complete3: this.agreeData12 ? this.agreeData12 : this.clockOutPopUp?.clockOut_Completed_3,
        agency_id: this.agencyidd,
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

  submit12(no) {
    this.agreeData12 = no
    if (no == 0) {
      let data = {
        // clockOut_Complete1: this.agreeData10 ? this.agreeData10 : this.clockOutPopUp?.clockOut_Completed_1,
        // clockOut_Complete2: this.agreeData11 ? this.agreeData11 : this.clockOutPopUp?.clockOut_Completed_2,
        clockOut_Complete3: this.agreeData12 ? this.agreeData12 : this.clockOutPopUp?.clockOut_Completed_3,
        agency_id: this.agencyidd,
        shift_id: this.slcSftForm.value.chooseShift,
        is_agree : true
      }
      this.dataService.addClockOut(data).subscribe((res: any) => {
        if (res) {
          
          let data = {
            // is_for: this.currentUser?.user_role == '5' ? '' : "community_user",
            shift_id: this.slcSftForm.value.chooseShift,
            agency_id: this.agencyidd
          }
      
          this.dataService.endShiftByID(data).subscribe((res: any) => {
            if (!res.error) {
              this.strtShft = "";
              this.endShft = "",
              this.strtShft = res.body.user_start_time
              this.endShft = res.body.user_end_time
              this.tost.successToastr(res.msg)
              this.cmpltHide = true
              // setTimeout(() => {
              //   this.activeTab = 1
              //   this.form2Data.reset()
              //   this.slcSftForm.reset()
              // }, 500);
              // this.dataService.closeTracker();
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
        // clockOut_Complete1: this.agreeData10 ? this.agreeData10 : this.clockOutPopUp?.clockOut_Completed_1,
        // clockOut_Complete2: this.agreeData11 ? this.agreeData11 : this.clockOutPopUp?.clockOut_Completed_2,
        clockOut_Complete3: this.agreeData12 ? this.agreeData12 : this.clockOutPopUp?.clockOut_Completed_3,
        agency_id: this.agencyidd,
        shift_id: this.slcSftForm.value.chooseShift,
        is_agree : false
      }
      this.dataService.addClockOut(data).subscribe((res: any) => {
        if (res) {
          

          let data = {
            // is_for: this.currentUser?.user_role == '5' ? '' : "community_user",
            shift_id: this.slcSftForm.value.chooseShift,
            agency_id: this.agencyidd
          }
      
          this.dataService.endShiftByID(data).subscribe((res: any) => {
            if (!res.error) {
              this.strtShft = res.body.user_start_time
              this.endShft = res.body.user_end_time
              this.tost.successToastr(res.msg)
              this.cmpltHide = true
              setTimeout(() => {
                this.activeTab = 1
                this.form2Data.reset();
    this.form2Data.get('agency').setValue('')
    this.slcSftForm.reset();
    this.slcSftForm.get('chooseShift').setValue('')
              }, 10000);
              // this.dataService.closeTracker();
            }
          })

        }
      },
        (err) => {
          this.dataService.genericErrorToaster();
        })
      this.activeTab = 8;
    }
    this.showClockOut = '2'


  }

  bckHome(){
    this.activeTab = 1
    this.form2Data.reset();
    this.form2Data.get('agency').setValue('')
    this.slcSftForm.reset();
    this.slcSftForm.get('chooseShift').setValue('')
        this.rfsh()
  }


  clkOut() {
    this.getClockOut()
    // if (this.clockOutPopUp?.clockOut_Completed_1 == 0) {
    //   this.activeTab = 10;
    // } else if (this.clockOutPopUp?.clockOut_Completed_2 == 0) {
    //   this.activeTab =11;
    // } else if (this.clockOutPopUp?.clockOut_Completed_3 == 0 ) {
    //   this.activeTab = 12;
    // }
  }

  disAgree() {
    this.modalOpenOSE(this.Disagree, 'lg');
  }

  goback(modal){
    this.modalService.dismissAll()
    this.activeTab = 1
    this.form2Data.reset();
    this.form2Data.get('agency').setValue('')
    this.slcSftForm.reset();
    this.slcSftForm.get('chooseShift').setValue('')
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



  // getUserById() {
  //   let is_for = 'user'
  //   let searchStr = ''
  //   this.dataService.getUserById(searchStr = '',this.currentUser?.id, is_for).subscribe((res: any) => {
  //     this.curntUsrvl = res.body[0].linked_with;
  //     this.curntUsrvl.forEach(element => {
  //       this.linked_with.push(element)
  //     });
  //     
  //   })
  // }

  getDate(today) {
    // let todayDate: any = new Date();
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
    // let data = {
    //   agncId: e.target.value,
    //   usrId: this.currentUser?.id,
    //   is_for: this.currentUser?.user_role == '5' ? 'agency' : 'community_user'
    // }
    // this.dataService.getUserAssignedShift(data).subscribe((res: any) => {
    //   if (!res.error) {
    //     // this.rows1 = res.body
    //   }
    // },
    //   (err) => {
    //     this.dataService.genericErrorToaster();
    //   })
  }

  shiftCng2(e) {
    this.frstFrmData1 = ''
    this.shiftCng = e.target.value
    
    this.dataService.getUserAssignedShift(this.shiftCng).subscribe((res: any) => {
      if (!res.error) {
        this.strtShft="";
        this.endShft='';
        this.frstFrmData1 = res.body
        this.agencyidd =res.body[0]?.aggency_id
        
        if(res.body){
          this.getDifferenceDate = this.getDifferenceDateBw(this.getDiff(res.body[0].start_time),this.getDiff(res.body[0].end_time))          
        }
        if(this.frstFrmData1?.length > 0){
          if(this.frstFrmData1[0].clocked_in_out == 1 && this.frstFrmData1[0].status == 1){
               this.strtShft = this.frstFrmData1[0].user_start_time
                 this.btnHide = true      
          }else if(this.frstFrmData1[0].clocked_in_out == 0 && this.frstFrmData1[0].status == 2){
            this.strtShft = this.frstFrmData1[0].user_start_time
            this.endShft = this.frstFrmData1[0].user_end_time
              // this.cmpltHide = true
          }else if(this.frstFrmData1[0].clocked_in_out == 0 && this.frstFrmData1[0].status == 0){
            this.cmpltHide = false;
            this.btnHide = false;

          }
        }else{
          // this.tost.errorToastr('You Completed Shift')
        }
      }
    },
      (err) => {
        this.dataService.genericErrorToaster();
      })
  }

  getStrShftDtl() {
    let data = {
      id: this.currentUser?.id,
      // is_for: this.currentUser?.user_role == '5' ? '' : 'community_user'
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

  newUsersubmitted(modal){
    for (let item of Object.keys(this.controls)) {
      this.controls[item].markAsDirty()
    }
    if (this.newUser.invalid) {
      // this.activeTab = 1;
      return;
    }
    let data = {
      phone_number: this.newUser.value.phone_number,
      email: this.newUser.value.email,
      first_name: this.newUser.value.first_name,
      last_name: this.newUser.value.last_name,
      // DOB: this.newUser.value.DOB,
      PIN_code: this.newUser.value.PIN_code,
      password: this.newUser.value.password,
      agency_id : [this.agencyidd]
    }

    this.dataService.addAgencyUser(data).subscribe((res: any) => {
      if (!res.error) {
       this.tost.successToastr(res.msg)
       this.goback(modal)
      //  this.loctn.back()
      }
    },
    (err) => {
      this.dataService.genericErrorToaster();
    })


  } 

  completeShiftByID(){
    this.clkOut() 
    let data = {
      is_for: this.currentUser?.user_role == '5' ? '' : "community_user",
      id: this.slctSftId ? this.slctSftId  : this.form2Data.value.chooseShift,
      agency_id: this.currentUser?.user_role == '5' ? ( this.agncId || this.agencyidd) : (this.cpId || this.currentUser?.id )
    }
    this.dataService.completeShiftByID(data).subscribe((res: any) => {
      if (!res.error) {
        // this.rows1 = res.body
        // this.cmpltHide = true
        this.dataService.closeTracker()
      }
    },
      (err) => {
        this.dataService.genericErrorToaster();
      })
  }

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
        if (localStorage.getItem('uniqueFirst') && localStorage.getItem('Secretkey')) {
          this.tost.errorToastr("Time Clock Refreshed");
        } else if(localStorage.getItem('Secretkey') && !localStorage.getItem('uniqueFirst')){
          localStorage.setItem('uniqueFirst', 'login');
          this.tost.successToastr('Success');
      }
        this.getStrShftDtl()
          this.welcomeClockIN = true;
        }else{
          this.tost.errorToastr(res.msg)
        }
      },
        (err) => {
          this.dataService.genericErrorToaster();
        })

  }

  rfsh(){
    window.location.reload()
  }

  goToHome(){
    this.form2Data.reset();
    this.activeTab = 1;
    this.rfsh()
    this.form2Data.get('agency').setValue('')
    this.slcSftForm.reset();
    this.slcSftForm.get('chooseShift').setValue('')
    
  }
  ngOnDestroy() {
    this.form2Data.reset();
      this.form2Data.get('agency').setValue('')
      this.slcSftForm.reset();
      this.slcSftForm.get('chooseShift').setValue('')
    clearTimeout(this.timeoutId);
  }
  getDiff(timestamp:any){
    const dateObject = new Date(timestamp*1000);
    return dateObject.toString();
  }
  getDifferenceDateBw(startDate:any,endDate:any){
    var diff = new Date(endDate).getTime() - new Date(startDate).getTime();
        var days = Math.floor(diff / (60 * 60 * 24 * 1000));
        var hours = Math.floor(diff / (60 * 60 * 1000)) - (days * 24);
        var minutes = Math.floor(diff / (60 * 1000)) - ((days * 24 * 60) + (hours * 60));
        var seconds = Math.floor(diff / 1000) - ((days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60));
        return days + ' ' + 'Days' + ' ' + hours + ' ' + 'Hours' + ' ' + minutes + ' ' + 'Minutes' + ' '+ seconds + ' ' +'Seconds'
  }
}
