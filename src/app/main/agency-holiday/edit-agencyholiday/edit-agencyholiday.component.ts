import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { Page } from 'app/utils/models';
import { ToastrManager } from 'ng6-toastr-notifications';
import moment from 'moment';

@Component({
  selector: 'app-edit-agencyholiday',
  templateUrl: './edit-agencyholiday.component.html',
  styleUrls: ['./edit-agencyholiday.component.scss']
})
export class EditAgencyholidayComponent implements OnInit {
  public contentHeader: object;
  formData! : FormGroup;
  btnShow: boolean =false;
  rows: any;
  holiId: any;
  currentUser: any;
  searchStr: string;
  public page = new Page();
  agencyListingData: any;
  timeslots: any[] = [
    { value: { hour: 0, minute: 0 }, label: '00:00', },
    { value: { hour: 0, minute: 30 }, label: '00:30', },
    { value: { hour: 1, minute: 0 }, label: '01:00', },
    { value: { hour: 1, minute: 30 }, label: '01:30', },
    { value: { hour: 2, minute: 0 }, label: '02:00', },
    { value: { hour: 2, minute: 30 }, label: '02:30', },
    { value: { hour: 3, minute: 0 }, label: '03:00', },
    { value: { hour: 3, minute: 30 }, label: '03:30', },
    { value: { hour: 4, minute: 0 }, label: '04:00', },
    { value: { hour: 4, minute: 30 }, label: '04:30', },
    { value: { hour: 5, minute: 0 }, label: '05:00', },
    { value: { hour: 5, minute: 30 }, label: '05:30', },
    { value: { hour: 6, minute: 0 }, label: '06:00', },
    { value: { hour: 6, minute: 30 }, label: '06:30', },
    { value: { hour: 7, minute: 0 }, label: '07:00', },
    { value: { hour: 7, minute: 30 }, label: '07:30', },
    { value: { hour: 8, minute: 0 }, label: '08:00', },
    { value: { hour: 8, minute: 30 }, label: '08:30', },
    { value: { hour: 9, minute: 0 }, label: '09:00', },
    { value: { hour: 9, minute: 30 }, label: '09:30', },
    { value: { hour: 10, minute: 0 }, label: '10:00', },
    { value: { hour: 10, minute: 30 }, label: '10:30', },
    { value: { hour: 11, minute: 0 }, label: '11:00', },
    { value: { hour: 11, minute: 30 }, label: '11:30', },
    { value: { hour: 12, minute: 0 }, label: '12:00', },
    { value: { hour: 12, minute: 30 }, label: '12:30', },
    { value: { hour: 13, minute: 0 }, label: '13:00', },
    { value: { hour: 13, minute: 30 }, label: '13:30', },
    { value: { hour: 14, minute: 0 }, label: '14:00', },
    { value: { hour: 14, minute: 30 }, label: '14:30', },
    { value: { hour: 15, minute: 0 }, label: '15:00', },
    { value: { hour: 15, minute: 30 }, label: '15:30', },
    { value: { hour: 16, minute: 0 }, label: '16:00', },
    { value: { hour: 16, minute: 30 }, label: '16:30', },
    { value: { hour: 17, minute: 0 }, label: '17:00', },
    { value: { hour: 17, minute: 30 }, label: '17:30', },
    { value: { hour: 18, minute: 0 }, label: '18:00', },
    { value: { hour: 18, minute: 30 }, label: '18:30', },
    { value: { hour: 19, minute: 0 }, label: '19:00' },
    { value: { hour: 19, minute: 30 }, label: '19:30' },
    { value: { hour: 20, minute: 0 }, label: '20:00' },
    { value: { hour: 20, minute: 30 }, label: '20:30' },
    { value: { hour: 21, minute: 0 }, label: '21:00' },
    { value: { hour: 21, minute: 30 }, label: '21:30' },
    { value: { hour: 22, minute: 0 }, label: '22:00' },
    { value: { hour: 22, minute: 30 }, label: '22:30' },
    { value: { hour: 23, minute: 0 }, label: '23:00' },
    { value: { hour: 23, minute: 30 }, label: '23:30' },
    { value: { hour: 24, minute: 0 }, label: '24:00' },
  ]
  dt_tm: string[];
  dt_tm1: string[];


  constructor(
    private fb : FormBuilder,
    private loct :Location,
    private dtsrv: DataService,
    private toaster : ToastrManager,
    private aCtRoute :ActivatedRoute,
    private _authenticationService :AuthenticationService

  ) { 
    this.aCtRoute.params.subscribe(
      res => {
        if (res.id) {
          this.getHolidayByID(res.id)
        }
      }
    )
    this._authenticationService.currentUser.subscribe((x: any) => {
      this.currentUser = x
      
    });
    this.getAgencyListing()
  }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Edit Holiday ',
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
            name: 'Agency Holiday',
            isLink: false,
            link: '/agency'
          }
        ]
      }
    };

    this.formData = this.fb.group({
       holi_strDate : [null ,[Validators.required]],
      holi_strTime : [null ,[Validators.required]],
      holi_endDate : [null ,[Validators.required]],
      holi_endTime : [null ,[Validators.required]],
      description : ['' ],
      agency_id : ['' ,[Validators.required]],
      holiday_name : ['' ,[Validators.required]]
    })
    
  }

  get controls(){
    return this.formData.controls
   }

   goBack(){
    this.loct.back()
  }

  
  getHolidayByID(id){
    this.dtsrv.getHolidayByID(id).subscribe((res:any)=>{
      this.rows = res.body[0];
      this.holiId = res.body[0].id
      this.patchVal()
    },err=>{
      this.toaster.errorToastr('Something went wrong please try again leter')
    })
  }

  patchVal(){
    let sd = moment.unix(this.rows?.start_date).format("YYYY-MM-DD HH:mm")
        let ed = moment.unix(this.rows?.end_date).format("YYYY-MM-DD HH:mm")
        this.dt_tm = ed.split(" ");
        this.dt_tm1 = sd.split(" ");
        // this.end_time = this.dt_tm[0]
        // this.start_time = this.dt_tm1[0]
        // this.endTime = this.dt_tm[1]
        // this.startTime = this.dt_tm1[1]
    this.formData.patchValue({
      date: this.rows.date,
      description: this.rows.description,
      agency_id: this.rows.agency_id,
      holiday_name: this.rows.holiday_name,
      holi_strDate: this.dt_tm1[0],
      holi_strTime: this.dt_tm1[1],
      holi_endDate: this.dt_tm[0],
      holi_endTime: this.dt_tm[1],
    });
  }

  submitted(){
    for (let item of Object.keys(this.controls)) {
      this.controls[item].markAsDirty()
    }
    if (this.formData.invalid) {
      return;
    }

    let body={
      start_date:  this.cnvrtnewDt(this.formData.value.holi_strDate + ' ' + this.formData.value.holi_strTime),
      end_date :  this.cnvrtnewDt(this.formData.value.holi_endDate + ' ' + this.formData.value.holi_endTime),
      description: this.formData.value.description,
      agency_id: this.formData.value.agency_id,
      holiday_name: this.formData.value.holiday_name,
      id: this.holiId,
      community_id : this.currentUser.id
      
    }
    this.btnShow = true;
    this.dtsrv.editHolidayByID(body).subscribe((res: any) => {
      if (!res.error) {
        this.toaster.successToastr(res.msg)
        this.btnShow = false;
        this.loct.back()
      } else {
        this.btnShow = false;
        this.toaster.errorToastr(res.msg)
      }
    },
      (err) => {
        this.btnShow = false;
        this.dtsrv.genericErrorToaster()
      })

  }

  cnvrtnewDt(date_tm) {
    return new Date(date_tm)
  }

  getAgencyListing(){
    let community_id = this.currentUser.id
    let is_for = 'community'
    let typeDrop = true
    this.dtsrv.getAgency(this.searchStr= '', this.page.pageNumber, this.page.size, community_id,is_for,typeDrop).subscribe((res:any)=>{
      this.agencyListingData = res.body
    })
  }
}
