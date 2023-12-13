import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Patterns } from 'app/auth/helpers/patterns';
import { User } from 'app/auth/models/user';
import { UserService } from 'app/auth/service';
import { AuthenticationService } from 'app/auth/service/authentication.service';
import { DataService } from 'app/auth/service/data.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { SettingsService } from '../settings.service';
import StatesJson from 'assets/states.json';
import { ConfirmedValidator } from 'app/auth/helpers/mustMacth';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  States:any = StatesJson;
  formData!: FormGroup;
  addCommunityFormData!: FormGroup;
  userFormData!: FormGroup;
  communityFormData!: FormGroup;
  editManagement!: FormGroup;
  sendNo!: FormGroup;
  otp!: FormGroup;
  forgotPassword!: FormGroup;
  imageObject: any[] = [];
  activeTab: number = 0;
  public contentHeader: object;
  public currentUser: User;
  curComDetails: any;
  userId: any;
  btnShow: boolean = false;
  editBreakRow:number;
  shortBreak:{hour_label: any,value:any,editing:boolean}[]= [
    {
        "hour_label":"Less then Hour",
        "value":"0",
        "editing": false,
    },
    {
        "hour_label":"2 Hour",
        "value":"0",
        "editing": false,
    },
    {
        "hour_label":"3 Hour",
        "value":"0",
        "editing": false,
    },
    {
        "hour_label":"4 Hour",
        "value":"0",
        "editing": false,
    },
    {
        "hour_label":"5 Hour",
        "value":"0",
        "editing": false,
    },
    {
        "hour_label":"6 Hour",
        "value":"0",
        "editing": false,
    },
    {
        "hour_label":"7 Hour",
        "value":"0",
        "editing": false,
    },
    {
        "hour_label":"8 or more Hour",
        "value":"0",
        "editing": false,
    }
]
  curntUsrvl: any[] =[]

  minDate: string;
  @ViewChild('verificationModal') verificationModal : ElementRef<any>;
  @ViewChild('addCom') addCom : ElementRef<any>;
  @ViewChild('addSrtNmCom') addSrtNmCom : ElementRef<any>;
  userDetails: any;
  state: any =[]
  chngPass!: FormGroup;
  value: boolean = false;
  value2: boolean = false;

  secret_key: any;
  cancellation_period: any = [
    { hour: '02' },
    { hour: '03' },
    { hour: '04' },
    { hour: '06' },
    { hour: '12' },
    { hour: '24' },
  ]

  automatic_clockoutArr: any = [
    { hour: '01' },
    { hour: '02' },
    { hour: '03' },
    { hour: '04' },
    { hour: '05' },
    { hour: '06' },
    { hour: '12' },
    { hour: '24' },
  ]
  roleData: any=[]
  roleData1: any=[]
  roleData2: any =[]
  roleData3: any =[]
  rows: any=[]
  titlChn:any;
  editRow: any;
  addSrtNmFormData: FormGroup;
  usrExst: boolean;
  CurrentUserRole: Object;



  tabChanged(ev:any) {
    this.activeTab = ev.nextId.replace('ngb-nav-','');
    if(this.activeTab == 0) {
      setTimeout(() => {
        this.formData.get('agency_phone').setValue(this.formData.value.agency_phone);
      }, 40)
    } 
  }
  constructor(
   public toastr: ToastrManager,
    private auth :AuthenticationService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private settingService: SettingsService,
    private dataService: DataService,
    private userService: UserService
    ) {
      this.auth.currentUser.subscribe((x: any) => {
        this.currentUser = x
        this.userId = this.currentUser?.id
      })
      this.getCommunityBreakSetting()
  }
  ngOnInit(): void {
    this.getRole()
    this.state = this.States;
    this.getUserRoles()
    setTimeout(() => {
      this.formData.get('agency_phone').setValue(this.formData.value.agency_phone);
    }, 1100)
    this.getDate()
     // content header
     this.contentHeader = {
      headerTitle: 'Profile',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Home',
            isLink: true,
            link: '/'
          }
        ]
      }
    };

    this.formData = this.fb.group({
      agency_name: ['', [Validators.required]],
        agency_phone: ['', [Validators.required]],
        agency_email: ['', [Validators.email]],
        agency_website: ['', [Validators.required,Validators.pattern(Patterns.website)]],
        state: ['',[ Validators.required]],
        show_shift_user: ['',[ Validators.required]],
        address1: ['', [Validators.required]],
        address2: [''],
        city: ['',[ Validators.required]],
        zipcode: ['',[ Validators.required]],
        agency_contact_firstname: ['',[ Validators.required]],
        agency_contact_lastname: ['',[ Validators.required]],
        agency_contact_person_title: ['',[ Validators.required]],
        agency_contact_cell_number: [''],
        agency_contact_email_address: ['', [Validators.required, Validators.email]],
    })

    this.addCommunityFormData = this.fb.group({
      value: ['', [Validators.required]],
      symbol: ['', [Validators.required]],
      break: ['', [Validators.required]],
      // setting_name: ['', [Validators.required]],
    })

    this.addSrtNmFormData = this.fb.group({
      SrtNm: ['', [Validators.required, Validators.pattern(Patterns.sort_name)]],
      // setting_name: ['', [Validators.required]],
    })

    this.forgotPassword = this.fb.group({
      PIN_code: ['', Validators.required],
      id: this.userId
    })

    this.userFormData = this.fb.group({
      DOB: [''],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required, Validators.pattern(Patterns.number)]],
      // PIN_code: ['', Validators.required],
    })

    this.communityFormData = this.fb.group({
      community_name: ['', Validators.required],
      community_address1: ['', [Validators.required]],
      cancellation_period: ['',Validators.required],
      automatic_clockout: ['', [Validators.required]],
      community_email: ['', [Validators.required]],
      state: ['', [Validators.required]],
      community_address2: ['',],
      community_phone_no: ['', [Validators.required, Validators.pattern(Patterns.number)]],
      zipcode: ['', Validators.required],
      city: ['', Validators.required],
      primary_contact_firstname: ['', Validators.required],
      primary_contact_lastname: ['', Validators.required],
      primary_contact_phone: ['',  [Validators.required]],
      primary_contact_email: ['', Validators.required],
      community_username: [''],
    })
   
    this.editManagement = this.fb.group({
      mg_name: ['', Validators.required],
      mg_title: ['', Validators.required],
      mg_phone: ['', [Validators.required,Validators.pattern(Patterns.number)]],
      // mg_email: ['', [Validators.required,Validators.pattern(Patterns.email)]],
      contact_email: ['', [Validators.required,Validators.email]],
      contact_person: ['', Validators.required],
      username: ['', Validators.required],
      contact_person_name: ['', Validators.required],
      // password: ['', [Validators.required, Validators.pattern(Patterns.password)]],
      // approval: ['1'],
    });
    this.sendNo = this.fb.group({
      number: ['', Validators.required],
      id: this.userId
    })
    
    this.otp = this.fb.group({
      otp: ['', Validators.required],
      // id: this.userId
    })

    this.chngPass = this.fb.group({
      old_Pass: ['', Validators.required],
      new_Pass: ['',[ Validators.required, Validators.pattern(Patterns.password)]],
      confim_Pass: ['',]
    }, { 
      validator: ConfirmedValidator('new_Pass', 'confim_Pass')
    },)
 
  }

  getUserRoles(){

    this.dataService.getUserRoles(this.userId).subscribe((res:any)=>{
      this.CurrentUserRole = res.body
    })
  }

  get controls() {
    return this.formData.controls;
  }
  get fp() {
    return this.forgotPassword.controls;
  }

  get uc() {
    return this.userFormData.controls;
  }

  get cfc() {
    return this.communityFormData.controls;
  }

  get adComSet() {
    return this.addCommunityFormData.controls;
  }

  get adSrtNmSet() {
    return this.addSrtNmFormData.controls;
  }
  
  get ec() {
    return this.editManagement.controls;
  }

  
  get sn() {
    return this.sendNo.controls;
  }
  
  get otpform() {
    return this.otp.controls;
  }

  get cp() {
    return this.chngPass.controls;
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
    this.minDate = year + '-' + month + '-' + toDate
  }

  chngPassSumit(){
    for (let item of Object.keys(this.cp)) {
      this.cp[item].markAsDirty()
    }
    if(this.chngPass.invalid){
      return
    }
    let body = {
      id: this.currentUser.id,
      password: this.chngPass.value.old_Pass,
      newPassword: this.chngPass.value.new_Pass,
      confPassword: this.chngPass.value.confim_Pass,
    }
  
    this.btnShow = true;
    this.dataService.updateUserPassword(body).subscribe((res: any) => {
      if (!res.error) {
        this.toastr.successToastr(res.msg);
      } else {
        this.toastr.errorToastr(res.msg);
      }
      this.btnShow = false;
    },
      (err) => {
        this.btnShow = false;
        this.dataService.genericErrorToaster();
  
      })
  }

submitted(){
  for (let item of Object.keys(this.controls)) {
    this.controls[item].markAsDirty()
  }
  if(this.formData.invalid){
    return
  }
  let body = {
    agency_name: this.formData.value.agency_name,
    agency_phone: this.formData.value.agency_phone.replace(/\D/g, ''),
    agency_email: this.formData.value.agency_email,
    agency_website: this.formData.value.agency_website,
    state: this.formData.value.state,
    show_shift_user:this.formData.value.show_shift_user,
    address1: this.formData.value.address1,
    address2: this.formData.value.address2,
    city: this.formData.value.city,
    zipcode:this.formData.value.zipcode,
    agency_contact_firstname:this.formData.value.agency_contact_firstname,
    agency_contact_lastname: this.formData.value.agency_contact_lastname,
    agency_contact_person_title: this.formData.value.agency_contact_person_title,
    agency_contact_cell_number: this.formData.value.agency_contact_cell_number.replace(/\D/g, ''),
    agency_contact_email_address: this.formData.value.agency_contact_email_address,
  }

  this.btnShow = true;
  this.settingService.editAgencies({...body,...{id:this.userId}}).subscribe((res: any) => {
    if (!res.error) {
      this.toastr.successToastr(res.msg);
      body = null
    } else {
      this.toastr.errorToastr(res.msg);
    }
    this.btnShow = false;
  },
    (err) => {
      this.btnShow = false;
      this.dataService.genericErrorToaster();

    })
}


userSubmitted(){
  for (let item of Object.keys(this.uc)) {
    this.uc[item].markAsDirty()
  }
  if(this.userFormData.invalid){
    return
  }
  let body = {
    DOB: this.userFormData.value.DOB,
    first_name: this.userFormData.value.first_name,
    last_name: this.userFormData.value.last_name,
    email: this.userFormData.value.email,
    phone_number: this.userFormData.value.phone_number.replace(/\D/g, ''),
    // PIN_code: this.userFormData.value.PIN_code,
    // is_for : 'agency'
    id : this.userId
  }
 
  this.btnShow = true;
  let is_for = 'agency'
  this.dataService.editUser(body,is_for,this.currentUser.role).subscribe((res: any) => {
    if (!res.error) {
      this.toastr.successToastr(res.msg);
      body = null
    } else {
      this.toastr.errorToastr(res.msg);
    }
    this.btnShow = false;
  },
    (err) => {
      this.btnShow = false;
      this.dataService.genericErrorToaster();

    })
}

communitySubmitted(){
  for (let item of Object.keys(this.cfc)) {
    this.cfc[item].markAsDirty()
  }
  if(this.communityFormData.invalid){
    return
  }
  let body = {
    community_name: this.communityFormData.value.community_name,
    community_address1: this.communityFormData.value.community_address1,
    community_address2: this.communityFormData.value.community_address2,
    zipcode: this.communityFormData.value.zipcode,
    automatic_clockout: this.communityFormData.value.automatic_clockout,
    state: this.communityFormData.value.state,
    community_email: this.communityFormData.value.community_email,
    cancellation_period: this.communityFormData.value.cancellation_period,
    city: this.communityFormData.value.city,
    community_phone_no: this.communityFormData.value.community_phone_no.replace(/\D/g, ''),
    primary_contact_firstname: this.communityFormData.value.primary_contact_firstname,
    primary_contact_lastname: this.communityFormData.value.primary_contact_lastname,
    primary_contact_email: this.communityFormData.value.primary_contact_email,
    primary_contact_phone: this.communityFormData.value.primary_contact_phone.replace(/\D/g, ''),
  }

  this.btnShow = true;
  this.dataService.editCommunity({...body,...{id:this.userId}}).subscribe((res: any) => {
    if (!res.error) {
      this.toastr.successToastr(res.msg);
      body = null
    } else {
      this.toastr.errorToastr(res.msg);
    }
    this.btnShow = false;
  },
    (err) => {
      this.btnShow = false;
      this.dataService.genericErrorToaster();

    })
}
editManagementSubmit(){
  for (let item of Object.keys(this.ec)) {
    this.ec[item].markAsDirty()
  }
  if(this.editManagement.invalid){
    return
  }
  let body1={
    mg_name: this.editManagement.value.mg_name,
    username: this.editManagement.value.username,
    mg_title: this.editManagement.value.mg_title,
    short_name: this.curntUsrvl[0]?.sort_name,
    contact_person_name: this.editManagement.value.contact_person_name,
    contact_email: this.editManagement.value.contact_email,
    mg_phone: this.editManagement.value.mg_phone.replace(/\D/g, ''),
    contact_person: this.editManagement.value.contact_person.replace(/\D/g, ''),
    id:this.userId
  }
  
  this.btnShow = true;
  this.dataService.editManagementByID(body1).subscribe((res: any) => {
    if (!res.error) {
      this.toastr.successToastr(res.msg);
      body1 = null
    } else {
      this.toastr.errorToastr(res.msg);
    }
    this.btnShow = false;
  },
    (err) => {
      this.btnShow = false;
      this.dataService.genericErrorToaster();

    })
}

upadtePassword(){
  for (let item of Object.keys(this.fp)) {
    this.fp[item].markAsDirty()
  }
  if(this.forgotPassword.invalid){
    return;
  }
  let body2 = {
    PIN_code: this.forgotPassword.value.PIN_code,
  }
  if(body2){
  this.settingService.editAgencies({...body2,...{id:this.userId}}).subscribe((res: any) => {
    if (!res.error) {
      this.toastr.successToastr(res.msg);
    } else {
      this.toastr.errorToastr(res.msg);
    }
    this.btnShow = false;
  },
    (err) => {
      this.btnShow = false;
      this.dataService.genericErrorToaster();

    })}
}

sendNosbmt(){
  for (let item of Object.keys(this.sn)) {
    this.sn[item].markAsDirty()
  }
  let data ={
    number : this.currentUser.role == 'User' ? this.curntUsrvl[0].phone_number : this.currentUser.role == 'Community' ?  this.curntUsrvl[0].community_phone_no : this.currentUser.role == 'Admin' ? this.userDetails.mg_phone :  this.curntUsrvl[0].agency_phone ,
    id : this.userId,
    is_for :  this.currentUser.role == 'User' ? 'user' : this.currentUser.role == 'Community' ? 'community'  : this.currentUser.role == 'Admin' ? 'management' : 'agency'
  }
  this.dataService.sms(data).subscribe((res: any) => {
    if (!res.error) {
      this.toastr.successToastr(res.msg);
      this.modalOpenOSE(this.verificationModal)
    } else {
      this.toastr.errorToastr(res.msg);
    }
    this.btnShow = false;
  },
    (err) => {
      this.btnShow = false;
      this.dataService.genericErrorToaster();

    })
}
modalOpenOSE(modalOSE:any) {
  this.otp.reset()
  this.modalService.open(modalOSE,
    {
      backdrop: false,
      size: 'md',
      centered: true,
    }
  );
}
closeVerificationModal(){
  this.addSrtNmFormData.reset()
  this.modalService.dismissAll()
}
otpSubmit(){
  this.dataService.verifyOtp({...this.otp.value,...{id:this.userId},...{is_for : this.currentUser.role == 'User' ? 'user' : this.currentUser.role == 'Community' ? 'community' : this.currentUser.role == 'Admin' ? 'management' : 'agency'}}).subscribe((res: any) => {
    if (!res.error) {
      this.toastr.successToastr(res.msg);
      this.modalService.dismissAll()
      this.curntUsrvl[0].is_verified=1
    } else {
      this.toastr.errorToastr(res.msg);
    }
    this.btnShow = false;
  },
    (err) => {
      this.btnShow = false;
      this.dataService.genericErrorToaster();

    })
}

generate_id(){
  if(this.secret_key){
    this.toastr.successToastr('You Already Genrated Your Id')
    return;
  }
  this.btnShow = true;
  this.dataService.generateSecret_Id(this.currentUser.id).subscribe((res: any) => {
    if (!res.error) {
      this.secret_key = res.body[0].secretKey;
      localStorage.setItem('Secretkey',JSON.stringify(this.secret_key))
      this.toastr.successToastr(res.msg)
      this.btnShow = false;
    } else {
      this.btnShow = false;
      this.toastr.errorToastr(res.msg)
    }
  },
    (err) => {
      this.btnShow = false;
      this.dataService.genericErrorToaster()
    })
}

forNoti() {
  this.value;
  let data ={
    sms_notification : this.value == false ? '1' : '0',
    email_notification : this.curntUsrvl[0].email_notification,
    is_for : this.roleData1.includes(this.currentUser.prmsnId) ? 'user' : 'agency',
    agency_id :  this.currentUser.role == 'Agency' ? this.currentUser.id : '',
    user_id :  this.roleData1.includes(this.currentUser.prmsnId) ? this.currentUser.id : ''
  }
  this.dataService.notificationEnableDisable(data).subscribe((res: any) => {
  })
}

forEml() {
  this.value2;
  let data ={
    email_notification : this.value2 == false ? '1' : '0',
    sms_notification : this.curntUsrvl[0].sms_notification,
    is_for : this.roleData1.includes(this.currentUser.prmsnId) ? 'user' : 'agency',
    agency_id :  this.currentUser.role == 'Agency' ? this.currentUser.id : '',
    user_id : this.roleData1.includes(this.currentUser.prmsnId) ? this.currentUser.id : ''
  }
  this.dataService.notificationEnableDisable(data).subscribe((res: any) => {
  })
}

getRole(){
  this.dataService.getAllRole( ).subscribe((res:any)=>{
    if(!res.err){
      //  res.body.filter(i=>{ this.roleData.push(i.id)})
       res.body.filter(i=>{ this.roleData.push(i.id.toString())})
       this.roleData.map(i=>{
        if(i != 1 && i != 2  && i != 3  && i !=  6 && i !=  14 && i != 15){
          this.roleData1.push(i)
        }
        if(i != 1 && i != 2  && i != 3  && i !=  4 && i != 5 && i !=  6){
          this.roleData2.push(i)
        }
        if(i != 1  && i != 3  && i !=  6){
          this.roleData3.push(i)
        }
       })

       if(['2'].includes(this.currentUser.prmsnId)){
        this.dataService.getAgenciesByID(this.currentUser.id).subscribe((res: any) => {
              this.curntUsrvl = res.body
              this.formData.patchValue({
                agency_name: this.curntUsrvl[0]?.agency_name,
                agency_phone: this.curntUsrvl[0]?.agency_phone,
                agency_email: this.curntUsrvl[0]?.agency_email,
                agency_website: this.curntUsrvl[0]?.agency_website,
                state: this.curntUsrvl[0]?.state,
                show_shift_user: this.curntUsrvl[0]?.show_shift_user,
                address1: this.curntUsrvl[0]?.address1,
                address2: this.curntUsrvl[0]?.address2,
                city: this.curntUsrvl[0]?.city,
                zipcode: this.curntUsrvl[0]?.zipcode,
                agency_contact_firstname: this.curntUsrvl[0]?.agency_contact_firstname,
                agency_contact_lastname: this.curntUsrvl[0]?.agency_contact_lastname,
                agency_contact_person_title: this.curntUsrvl[0]?.agency_contact_person_title,
                agency_contact_cell_number: this.curntUsrvl[0]?.agency_contact_cell_number,
                agency_contact_email_address: this.curntUsrvl[0]?.agency_contact_email_address,
              })
              this.value = this.curntUsrvl[0]?.sms_notification == 0 ? false : true
              this.value2 = this.curntUsrvl[0]?.email_notification == 0 ? false : true
      })
    } else if(this.currentUser.role == 'Community' && !this.roleData2.includes(this.currentUser.prmsnId)){
      this.dataService.getcommunityById(this.currentUser.id).subscribe((res: any) => {
        this.curntUsrvl = res.body
              this.secret_key = this.curntUsrvl[0]?.secret_key
              this.communityFormData.patchValue({
                community_name: this.curntUsrvl[0]?.community_name,
                community_username: this.curntUsrvl[0]?.username,
                community_address1: this.curntUsrvl[0]?.community_address1,
                cancellation_period: this.curntUsrvl[0]?.cancellation_period,
                community_email: this.curntUsrvl[0]?.community_email,
                state: this.curntUsrvl[0]?.state,
                automatic_clockout: this.curntUsrvl[0]?.automatic_clockout,
                community_address2: this.curntUsrvl[0]?.community_address2,
                community_phone_no: this.curntUsrvl[0]?.community_phone_no,
                zipcode: this.curntUsrvl[0]?.zipcode,
                city: this.curntUsrvl[0]?.city,
                primary_contact_firstname: this.curntUsrvl[0]?.primary_contact_firstname,
                primary_contact_lastname: this.curntUsrvl[0]?.primary_contact_lastname,
                primary_contact_phone: this.curntUsrvl[0]?.primary_contact_phone,
                primary_contact_email: this.curntUsrvl[0]?.primary_contact_email
              });
              setTimeout(() => {
                this.communityFormData.get('community_phone_no').setValue(this.communityFormData.value.community_phone_no)
              }, 100)
      })
    } else if(this.currentUser.role == 'Admin'){
      this.userService.getManagementById(this.currentUser.id).subscribe((res: any) => {
              this.curntUsrvl = res.body
              this.curntUsrvl.map(i=>{
                if(i.short_name){
                  i.sort_name = i.short_name
                }
              })
              this.editManagement.patchValue({
                mg_name: res.body[0].mg_name,
                username: res.body[0].username,
                mg_title: res.body[0].mg_title,
                mg_phone: res.body[0].mg_phone,
                contact_email: res.body[0].contact_email,
                contact_person: res.body[0].contact_person,
                contact_person_name: res.body[0].contact_person_name
              });
              setTimeout(() => {
                this.editManagement.get('mg_phone').setValue(this.editManagement.value.mg_phone)
              }, 100)
              setTimeout(() => {
                this.editManagement.get('contact_person').setValue(this.editManagement.value.contact_person)
              }, 100)
      })
       }
       else if(this.currentUser.role == 'User' || this.roleData2.includes(this.currentUser.prmsnId) ){
        let is_for = 'user'
        let searchStr = ''
        this.dataService.getUserById(searchStr = '',this.currentUser.id,is_for).subscribe((res: any) => {
          this.curntUsrvl = res.body
          this.userFormData.patchValue({
            DOB: this.curntUsrvl[0].DOB,
            first_name: this.curntUsrvl[0].first_name,
            last_name: this.curntUsrvl[0].last_name,
            phone_number: this.curntUsrvl[0].phone_number,
            email: this.curntUsrvl[0].email,
            // PIN_code: this.curntUsrvl[0].PIN_code
          });
          this.value = this.curntUsrvl[0].sms_notification == 0 ? false : true
          this.value2 = this.curntUsrvl[0].email_notification == 0 ? false : true
    
          setTimeout(() => {
            this.userFormData.get('phone_number').setValue(this.userFormData.value.phone_number)
          }, 100)
    })
       }
    }
  },err=>{
    this.dataService.genericErrorToaster()
  })
  this.getCommunitySetting()

}

addComSubmitted(){
  for (let item of Object.keys(this.adComSet)) {
    this.adComSet[item].markAsDirty()
  }
  if(this.addCommunityFormData.invalid){
    return;
  }
  if(this.titlChn.btn == 'Edit'){
    let data = {
      id : this.editRow.id,
    community_id : this.editRow.community_id,
    // setting_name : this.addCommunityFormData.value.setting_name,
    variance_val  : {
      symbol: this.addCommunityFormData.value.symbol,
      value:this.addCommunityFormData.value.value,
    },
    break_time:this.addCommunityFormData.value.break
    }
    this.dataService.editCommunitySetting(data).subscribe((res: any) => {
      if (!res.error) {
        this.toastr.successToastr(res.msg);
        this.closeVerificationModal()
        this.getCommunitySetting()
      } else {
        this.toastr.errorToastr(res.msg);
      }
      this.btnShow = false;
    },
      (err) => {
        this.btnShow = false;
        this.dataService.genericErrorToaster();
  
      })
  }
  else{
    let data ={
      community_id : this.currentUser.id ,
    // setting_name : this.addCommunityFormData.value.setting_name,
      variance_val  : {
        symbol: this.addCommunityFormData.value.symbol,
        value:this.addCommunityFormData.value.value,
      },
      break_time:this.addCommunityFormData.value.break
    }
    this.dataService.addCommunitySetting(data).subscribe((res: any) => {
      if (!res.error) {
        this.toastr.successToastr(res.msg);
        this.closeVerificationModal()
        this.getCommunitySetting()
      } else {
        this.toastr.errorToastr(res.msg);
      }
      this.btnShow = false;
    },
      (err) => {
        this.btnShow = false;
        this.dataService.genericErrorToaster();
  
      })
  }
}

getCommunitySetting(){
 
  this.dataService.getCommunitySetting(this.currentUser.id).subscribe((res: any) => {
    if (!res.error) {
          this.rows =  res.body
          this.rows.map(i=> {i.variance_val2 = JSON.parse(i.variance_val); return i});     
    } else {
      this.toastr.errorToastr(res.msg);
    }
    this.btnShow = false;
  },
    (err) => {
      this.btnShow = false;
      this.dataService.genericErrorToaster();

    })
}

getCommunityBreakSetting(){
 
  this.dataService.getCommunityBreakSetting(this.currentUser.id).subscribe((res: any) => {
    if (!res.error) {
      let d= JSON.parse(res.body[0].variance_val)
          this.shortBreak =JSON.parse(d).map(i=>{i.editing=false; return i;});
          console.log(this.shortBreak,'ewwghjrwerjwvmewmvwgjc');
          
    }
  },
    (err) => {
      this.dataService.genericErrorToaster();

    })
}

deleteRow(id){
  let data ={
    id:id
  }
  this.dataService.deleteCommunitySetting(data).subscribe((res: any) => {
    if (!res.error) {
      this.toastr.successToastr(res.msg);
      this.getCommunitySetting()
          
    } else {
      this.toastr.errorToastr(res.msg);
    }
    this.btnShow = false;
  },
    (err) => {
      this.btnShow = false;
      this.dataService.genericErrorToaster();

    })
}

opnModl(data){
  if(data){
    this.titlChn = {
      title : 'Edit Community Setting',
      btn : 'Edit'
    }
  }else{
    this.addCommunityFormData.reset()
    this.titlChn = {
      title : 'Add Community Setting',
      btn : 'Add'
    }
  }
 
  this.modalOpenOSE(this.addCom)
}

opnModl2(){
  this.modalOpenOSE(this.addSrtNmCom)
}

edtComSet(row){
  this.editRow = row
  this.addCommunityFormData.patchValue({
    value: row.variance_val2.value,
    symbol: row.variance_val2.symbol,
    break: row.variance_val2.break_time,
    // setting_name:row.setting_name,
  })
  this.opnModl(row)
}

addSrtNmComSubmitted(){
  for (let item of Object.keys(this.adSrtNmSet)) {
    this.adSrtNmSet[item].markAsDirty()
  }
  if(this.addSrtNmFormData.invalid){
    return;
  }
  if ( this.usrExst) { 
    return;
  }
  let data ={
    sort_name:this.addSrtNmFormData.value.SrtNm,
    id : this.currentUser.id
  }
  this.dataService.updateCommunityShortname(data).subscribe((res: any) => {
    if (!res.error) {
      this.toastr.successToastr(res.msg);
      this.closeVerificationModal()
      this.ngOnInit()
    } else {
      this.toastr.errorToastr(res.msg);
    }
    this.btnShow = false;
  },
    (err) => {
      this.btnShow = false;
      this.dataService.genericErrorToaster();

    })
}

shortNm(val){
  let data ={
    sort_name : val
  }
  this.dataService.checkShortName(data).subscribe((res:any) => {
    if (!res.error) {
      if(res.body?.length){
        this.usrExst = true
        // this.formData.get('sort_name').setValue('')
      }
      else{
        this.usrExst = false
      }
    } else {
      this.dataService.errorToaster(res);
    }
    this.btnShow = false;
  }, error => {
    this.dataService.genericErrorToaster();
    this.btnShow = false;
  });
}
editRowBreak(index: number) {
  this.shortBreak[index].editing = true;
  console.log("Edit row:", index);
}
save(){
  let d = JSON.stringify(this.shortBreak.map(i=>{i.editing=false; return i;}))
  let data = {
    community_id:this.currentUser.id,
    variance_val:d,
  }
  this.dataService.communitySetting(data).subscribe(res=>{
    if(!res.error){
      this.toastr.successToastr('Successfully Updated');
      this.getCommunityBreakSetting()
    }else{
      this.toastr.successToastr(res.msg)

    }
  })
}
cancelEdit(index: number) {
  this.shortBreak[index].editing = false;

}

 
}


