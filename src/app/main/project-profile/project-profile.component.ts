import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {  FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Role, User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import moment from 'moment';
import { DatePipe } from '@angular/common';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Patterns } from 'app/auth/helpers/patterns';

@Component({
  selector: 'app-project-profile',
  templateUrl: './project-profile.component.html',
  styleUrls: ['./project-profile.component.scss']
})
export class ProjectProfileComponent implements OnInit {
  public StartmyDate = new Date()
  break :any= 30
  formData!: FormGroup;
  editModalForm!: FormGroup;
  varianceForm!: FormGroup;
  btnShow:boolean = false;
  userId: any;
  checkVal:any;
  filename:any;
  loading: boolean;
  curComDetails: any;
  error: any;
  public contentHeader: object;
  public currentUser: User;
  imageObject: any[] = [];
  @ViewChild('Addnew') Addnew: ElementRef<any>;
  @ViewChild('UserLiST') UserLiST: ElementRef<any>;
  @ViewChild('editModal') editModal: ElementRef<any>;
  sd2: any;
  ed2: any;
  snglShftDtls: any =[]
  dt_tm: string[];
  dt_tm1: string[];
  duration: string;
  agncyUsr: any =[]
  hideApply: boolean  = false;
  applySft: any;
  agcydata: any;
  usrAssg: any;
  usrCmAssg: any;
  assigned: any;
  apprShft: any;
  aplHide: boolean = false;
  clkHide: boolean = false;
  id: any;
  shiftStartTime: any;
  shiftEndTime: any;
  shiftStartTime1: any;
  shiftEndTime1: any;
  shftData: any;
  adjSrtTime: any;
  adjEndTime: any;
  count: any[];
  hrs: any[];
  count2: any[];
  fileToUpload: any;
  clkInTm: any;
  clkOtTm: any;
  clockDetails: any;
  constructor(
    private aCtRoute: ActivatedRoute,
    private datasrv : DataService,
    private _authenticationService :AuthenticationService,
    private loctn : Location,
    private tost : ToastrManager,
    private modalService: NgbModal,
    private fb : FormBuilder,
    public datePipe:DatePipe
  ) { 
    this._authenticationService.currentUser.subscribe
    (x => {
      this.currentUser = x;
      
    }
    );
    
  }

  ngOnInit(): void {
    this.aCtRoute.params.subscribe(
      res => {
        if (res.id) {
          this.userId =  res.id;
          this.checkVal = res.d
          // console.log(res)
          this.getuserDetails();
          // this.getUserAssigned()
        }
      }
    )
    this.getAgncyDtail()
    this.formData = this.fb.group({
      first_name: ['',Validators.required],
      last_name: ['',Validators.required],
      pin: ['',Validators.required],
      phone_number: ['',[Validators.required,Validators.pattern(Patterns.number)]]
    })

    this.editModalForm = this.fb.group({
      holi_strDate : ['' ,[Validators.required]],
      holi_strTime : [this.StartmyDate ,[Validators.required]],
      holi_strTime1 : ['' ,[Validators.required]],
      holi_endDate : ['' ,[Validators.required]],
      holi_endTime : ['' ,[Validators.required]],
      holi_endTime1 : ['' ,[Validators.required]],
      // adj_Brk : ['' ,[Validators.required]],
      adj_BrkTime : ['' ,[Validators.required]],
      varFrmCmpl : ['' ,[Validators.required]],
    })
    this.varianceForm = this.fb.group({
      file:['']
    })
    this.editModalForm.controls['holi_strTime'].setValue(new Date())

    this.contentHeader = {
      headerTitle: 'Shifts',
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
        ]
      }
    };

    let cnt:any = '0'; // current count
    this.count = Array.from({length: 60}, (_, i) => cnt + i < 10 ? '0' + i : i);
    
    this.count2 = ['00','05','10','15','20','25','30','35','40','45','50','55','60']

    let hrs:any = '0'; // current count
    this.hrs = Array.from({length: 25}, (_, i:any) => hrs + i < 10 ? '0' + i : i);
  }

  getuserDetails() {
    this.loading = true;
    this.userId;
    this.datasrv.getshiftById(this.userId).subscribe(response => {
      if (!response.error) {
        console.log(response,'resssssssssssssssssssssssssssssssss,,,,,,,,,,,,,,,,,,,,,,,,,');

        this.snglShftDtls = response.body
        this.id = this.snglShftDtls[0]?.id      
        if(this.currentUser.role == 'Agency') {
          this.getUserAssigned(this.id)
        } else if(this.currentUser.role == 'Community') {
          this.getCMUserAssigned(this.id)
        }
        this.snglShftDtls.map((i:any)=>{
          this.assigned = i.assigned
         i.cr =  moment(i.created_at).format("dddd, MMMM Do YYYY, h:mm:ss a")
        })
        this.getDrton()
      }
      this.loading = false;
    }, error => {
      this.error = error;
      this.loading = false;
    }
    );
  }

  getDrton() {
    let end_time = moment.unix(this.snglShftDtls[0]?.end_time).format("YYYY-MM-DD HH:mm")
    let start_time = moment.unix(this.snglShftDtls[0]?.start_time).format("YYYY-MM-DD HH:mm")
    this.dt_tm = end_time.split(" ");
    this.dt_tm1 = start_time.split(" ");

    let timeStart = new Date(this.dt_tm1[0] + ' ' + this.dt_tm1[1]).getTime();
    let timeEnd = new Date(this.dt_tm[0] + ' ' + this.dt_tm[1]).getTime();
    let hourDiff = timeEnd - timeStart; //in ms
    // let secDiff = hourDiff / 1000;
    let minDiff = hourDiff / 60 / 1000; //in minutes
    let hDiff = hourDiff / 3600 / 1000; //in hours
    let hours = Math.floor(hDiff);
    let minutes = minDiff - 60 * hours;
    if (!isNaN(hours) && !isNaN(minutes)) {
      this.duration = hours + ' hour and ' + minutes + ' minutes.'
    }
  }
  goBack(){
    this.loctn.back()
  }

  getUserAssigned(id){
    // let data =  this.snglShftDtls[0]?.id
    // console.log('shift',shift_id)
    this.datasrv.getUserAssigned(id).subscribe((res : any) =>{
        if(res?.body){
          this.clockDetails = res.body[0].item
        this.usrAssg = res?.body;
          // this.shiftStartTime = moment.unix(res?.body[0]?.userShiftData.shiftStartTime).format("hh:mm a");
          this.shiftStartTime = moment.unix(res?.body[0]?.item.start_time);
          this.shiftEndTime = moment.unix(res?.body[0]?.item.end_time);
          this.shiftStartTime = res?.body[0]?.item.start_time || this.snglShftDtls[0].start_time ? moment.unix(res?.body[0]?.item.start_time || this.snglShftDtls[0].start_time).format("MM-DD-yyyy HH:mm A") : '';
            this.shiftEndTime = res?.body[0]?.item.end_time || this.snglShftDtls[0].end_time ? moment.unix(res?.body[0]?.item.end_time || this.snglShftDtls[0].end_time).format("MM-DD-yyyy HH:mm A") : '';
            this.adjSrtTime = res?.body[0]?.item?.adj_start_time ?  moment.unix(res?.body[0]?.item?.adj_start_time).format("MM-DD-yyyy HH:mm A"): ''
            this.adjEndTime = res?.body[0]?.item?.adj_end_time ?  moment.unix(res?.body[0]?.item?.adj_end_time).format("MM-DD-yyyy HH:mm A") :''
            this.clkInTm = res?.body[0]?.item?.user_start_time ?  moment.unix(res?.body[0]?.item?.user_start_time).format("MM-DD-yyyy HH:mm A"): ''
            this.clkOtTm = res?.body[0]?.item?.user_end_time ?  moment.unix(res?.body[0]?.item?.user_end_time).format("MM-DD-yyyy HH:mm A") :''
            this.aplHide = res?.isAssigned;
        }
        else{
          this.aplHide = false;
        }
      }
    )
  }

  getCMUserAssigned(id){
      this.datasrv.getCMUserAssigned(id).subscribe((res : any) =>{
          if(res?.body){
            this.shftData = res?.body[0].item;
            
          this.usrCmAssg = res?.body[1];
          
            this.shiftStartTime = res?.body[0]?.item.start_time || this.snglShftDtls[0].start_time ? moment.unix(res?.body[0]?.item.start_time || this.snglShftDtls[0].start_time).format("MM-DD-yyyy HH:mm A") : '';
            this.shiftEndTime = res?.body[0]?.item.end_time || this.snglShftDtls[0].end_time ? moment.unix(res?.body[0]?.item.end_time || this.snglShftDtls[0].end_time).format("MM-DD-yyyy HH:mm A") : '';
            this.adjSrtTime = this.shftData.adj_start_time ?  moment.unix(this.shftData.adj_start_time).format("MM-DD-yyyy HH:mm A"): ''
            this.adjEndTime = this.shftData.adj_end_time ?  moment.unix(this.shftData.adj_end_time).format("MM-DD-yyyy HH:mm A") :''
            this.clkInTm = this.shftData.user_start_time ?  moment.unix(this.shftData.user_start_time).format("MM-DD-yyyy HH:mm A"): ''
            this.clkOtTm = this.shftData.user_end_time ?  moment.unix(this.shftData.user_end_time).format("MM-DD-yyyy HH:mm A") :''
            this.aplHide = res?.isAssigned;
          }
          else{
            this.aplHide = false;
          }
        }
    )
  }

  applyShift(sngSfit) {
    this.applySft = sngSfit
    if(this.currentUser.role == 'Agency'){
      this.openUserList()
    this.getAgncyUsrLst()
      // this.assignShift(sngSfit,modal)
    }else{
      let body = {
        for_cp: sngSfit.for_cp,
        shift_id:  sngSfit.id,
        user_id: this.currentUser.id,
        is_agency: 0
      }
  
      this.datasrv.applyShift(body).subscribe((res: any) => {
        if (!res.error) {
          this.tost.successToastr(res.msg)
          if(this.currentUser.user_role == '4'){
            this.loctn.back()
            // this.setPage({ offset: 0 });
          }
        }
        else {
          this.closededAll()
          this.btnShow = false
          this.tost.errorToastr(res.msg)
        }
      }, (err) => {
        this.datasrv.genericErrorToaster()
      })
    }
  }

  openUserList(){
    this.modalOpenOSE(this.UserLiST, 'lg');
  }

  assignShift(snglUsr,modal) {
    let data = {
      is_for :'',
      first_name : snglUsr.first_name,
      phone_number : snglUsr.phone_number,
      hourly_rate : snglUsr.hourly_rate,
      agency_id : this.currentUser.id,
      shift_id : this.applySft.id ,
      user_id: snglUsr.id,
    }

    let body = {
      for_cp: this.applySft.for_cp,
      shift_id: this.currentUser.role == 'Agency' ? this.applySft.id : snglUsr.id,
      user_id: this.currentUser.id,
      is_agency: this.currentUser?.role == 'Agency' ? 1 : 0
    }

    this.datasrv.applyShift(body).subscribe((res: any) => {
      if (!res.error) {
          this.datasrv.assignAGShift(data).subscribe((res: any) => {
            if (!res.error) {
              this.tost.successToastr('User Assigned');
              this.closededAll()
              this.loctn.back()
                this.ngOnInit()
            }
          },
            (err) => {
              this.datasrv.genericErrorToaster()
            })
      }else{
        this.closededAll()
        this.tost.errorToastr(res.msg)
      }
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

  closeded(modal: NgbModalRef) {
    modal.dismiss();
  }

  closededAll() {
    this.modalService.dismissAll();
  }

  openAddNew() {
    this.modalOpenOSE(this.Addnew, 'lg');
  }


  getAgncyUsrLst() {
    this.datasrv.getAgencyUnblockUser(this.snglShftDtls[0].community_id,this.currentUser.id).subscribe((res: any) => {
      if (!res.error) {
        this.agncyUsr = res.body
        // this.agncyUsr.map(i => {
        //   if (this.prmsUsrId.shift_id == i.shift_id && this.prmsUsrId.agency_user == i.agency_user) {
        //     if (i.approved == 1) {
        //       if(i.shift_status == 1) {
        //         this.dsble = true;
        //       }else{
        //         this.dsble = false;
        //       }  
        //       i.asgnBtn = true;
        //     } else {               
        //       i.asgnBtn = false;
        //     }
        //   } else {
        //     if(this.dsble == true) {
        //       this.dsble = true;
        //     }else{
        //       this.dsble = false;
        //     }
        //     i.asgnBtn = false;
        //   }
         
        // })

      }
    },
      (err) => {
        this.datasrv.genericErrorToaster()
      })
  }

  getAgncyDtail() {
    this.datasrv.getAgenciesByID(this.currentUser.id).subscribe((res: any) => {
      if (!res.error) {
        this.agcydata = res.body[0]
      }
      else {
        this.tost.errorToastr(res.msg)
      }
    }, (err) => {
      this.datasrv.genericErrorToaster()
    })
  }

  get controls() {
    return this.formData.controls;
  }

  get ec() {
    return this.editModalForm.controls;
  }

  get vf() {
    return this.varianceForm.controls;
  }

  submitted() {
    // this.formData.reset()
    for (let item of Object.keys(this.controls)) {
      this.controls[item].markAsDirty()
    }
    if (this.formData.invalid) {
      return;
    }

    let data = {
      is_for :"add_new",
      first_name : this.controls.first_name.value,
      last_name : this.controls.last_name.value,
      phone_number : this.controls.phone_number.value?.replace(/\D/g, ''),
      pin : this.agcydata.PIN_code,
      hourly_rate : this.agcydata.hourly_rate,
      agency_id : this.currentUser.id,
      shift_id : this.snglShftDtls[0].id
    }

    let body = {
      for_cp: this.applySft.for_cp,
      shift_id:  this.applySft.id ,
      user_id: this.currentUser.id,
      is_agency: this.currentUser?.role == 'Agency' ? 1 : 0
    }
    this.btnShow = true;

    this.datasrv.applyShift(body).subscribe((res: any) => {
      if (!res.error) {
        this.tost.successToastr(res.msg);      
          this.datasrv.assignAGShift(data).subscribe((res: any) => {
            // console.log(res)
            if (!res.error) {
              this.tost.successToastr(res.msg);
              // this.tempAddId = res.body[0]
              this.formData.reset()
              this.closededAll()
              this.loctn.back()
              this.ngOnInit()
            } else {
              this.tost.errorToastr(res.msg);
              this.formData.reset()
              this.closededAll()
            }
            this.btnShow = false;
          },
          (err) => {
            this.btnShow = false;
            this.datasrv.genericErrorToaster();
            this.formData.reset()
            this.loctn.back()
            })
        
      }else{
        this.btnShow = false;
        this.closededAll()
        this.tost.errorToastr(res.msg)
        this.formData.reset()
      }
    })
    
  }

  editOpen(){
    this.modalOpenOSE(this.editModal, 'lg');
    setTimeout(() => {
      this.ptchVal()
    }, 200);
  }

  ptchVal(){
      // let adj_BrkTime = moment.unix(this.adjSrtTime).format("yyyy-MM-DD HH:mm").split(' ')
      // this.shiftStartTime1 =  this.adjSrtTime ? moment.unix(this.adjSrtTime).format("yyyy-MM-DD HH:mm").split(' ') : ''
      let splt =  this.adjSrtTime ? this.adjSrtTime.split(' ') : ''
      let splt2 = splt[1] ? splt[1].split(':') : ''
      // this.shiftEndTime1 =  this.adjEndTime ? moment.unix(this.adjEndTime).format("yyyy-MM-DD HH:mm").split(' ') : ''
      let splt1 = this.adjEndTime ? this.adjEndTime.split(' ') : ''
      let splt3 = splt1[1] ? splt1[1].split(':') : ''
      this.editModalForm.patchValue({
        holi_strDate: splt[0],
        holi_strTime: splt2[0],
        holi_strTime1: splt2[1],
        holi_endDate: splt1[0],
        holi_endTime: splt3[0],
        holi_endTime1: splt3[1],
        // adj_Brk: adj_BrkTime[0],
        varFrmCmpl: this.shftData?.varFrmCmpl,
        adj_BrkTime: this.shftData?.adj_break_time,
      })
  }

  editModalsubmitted(){
    for (let item of Object.keys(this.ec)) {
      this.ec[item].markAsDirty()
    }
    if (this.editModalForm.invalid) {
      return;
    }

    let data= {
      adj_start_time : this.cnvrtnewDt(this.editModalForm.value.holi_strDate + ' ' + this.editModalForm.value.holi_strTime +':'+this.editModalForm.value.holi_strTime1),
      adj_end_time : this.cnvrtnewDt(this.editModalForm.value.holi_endDate + ' ' + this.editModalForm.value.holi_endTime+':'+this.editModalForm.value.holi_endTime1),
      adj_Brk : this.editModalForm.value.adj_BrkTime,
      id : this.shftData.id,
      varFrmCmpl : this.editModalForm.value.varFrmCmpl
    }

    this.datasrv.updateAdjClockTime(data).subscribe((res: any) => {
      if (!res.error) {
        this.tost.successToastr(res.msg)
        this.modalService.dismissAll()
        this.ngOnInit()
      }
      else {
        this.tost.errorToastr(res.msg)
      }
    }, (err) => {
      this.datasrv.genericErrorToaster()
    })
  }

  cnvrtnewDt(date_tm) {
    return new Date(date_tm)
  }

//   fileChange(event:any){
//     console.log('dfgh',event.target.files[0]);
//     const file = event.target.files[0];
//     this.varianceSubmit(file)
//   }

//   varianceSubmit(data:any){
//     for (let item of Object.keys(this.vf)) {
//       this.vf[item].markAsDirty()
//     }
//     if (this.varianceForm.invalid) {
//       return;
//     }
//     const formData= new FormData();
//     formData.append('name',data);
//     formData.append('id',this.id)
//     this.datasrv.uploadVariance(formData).subscribe((res:any) => {
//       if (!res.error) {
//     this.tost.successToastr(res.msg)
//     // this.setPage({ offset: 0 })

//   } else {
//     this.tost.errorToastr(res.msg)
//   }
// }, error => {
//   this.tost.errorToastr('Something went wrong please try again')
// }
// )
//   }

  @ViewChild('fileInput') elfile: ElementRef;
  onFileInput(files: any) {
    if (files.length === 0) {
      return;
    }
    this.filename =files[0].name;
    let type = files[0].type;
    this.fileToUpload = files[0];
    this.uploadNow()
  }

  uploadNow() {
    let formdata = new FormData(); 
    formdata.append('docUpload',this.fileToUpload)
    formdata.append('id',this.id)
    this.datasrv.uploadVariance(formdata).subscribe((res:any) => {
          if (!res.error) {
        this.tost.successToastr(res.msg)
        this.getuserDetails()
        // this.setPage({ offset: 0 })

      } else {
        this.tost.errorToastr(res.msg)
      }
    }, error => {
      this.tost.errorToastr('Something went wrong please try again')
    }
    )
  }
}
