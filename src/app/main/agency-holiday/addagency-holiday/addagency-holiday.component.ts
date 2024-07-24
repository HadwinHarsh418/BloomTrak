import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { Page } from 'app/utils/models';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-addagency-holiday',
  templateUrl: './addagency-holiday.component.html',
  styleUrls: ['./addagency-holiday.component.scss']
})
export class AddagencyHolidayComponent implements OnInit {
  public contentHeader: object;
  formData! : FormGroup;
  currentUser: any;
  btnShow: boolean =false;
  minDate: string;
  searchStr: string;
  public page = new Page();
  agencyListingData: any;
  todaysDate: any;

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
  comdata: any;
  agcydata: any;
  comid: any;
  tomorrow: any;


  constructor(
    private fb :FormBuilder,
    private loct : Location,
    private _authenticationService : AuthenticationService,
    private dataService : DataService,
    private tost : ToastrManager
  ) {
    this._authenticationService.currentUser.subscribe((x: any) => {
      this.currentUser = x
      
    });
    // this.getAgencyListing()
    this.getAgencyId()
    this.getcommunityForAgencyRates()
   }

  ngOnInit(): void {
    this.getAgncyDtail()
    this.contentHeader = {
      headerTitle: 'Add Holiday ',
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
            isLink: true,
            link: '/agency-holiday'
          }
        ]
      }
    };

    this.formData = this.fb.group({
      description : ['' ,],
      agency_id : ['' ,[Validators.required]],
      community : ['',[Validators.required]],
      holiday_name : ['' ,[Validators.required]],
      holi_strDate : [null ,[Validators.required]],
      holi_strTime : [null ,[Validators.required]],
      holi_endDate : [null ,[Validators.required]],
      holi_endTime : [null ,[Validators.required]],
    }
    )
    if(this.currentUser?.role != 'Admin'&& this.currentUser?.user_role != 8)
    {
     this.formData.controls['community'].clearValidators();
     this.formData.updateValueAndValidity();
    }
    if(this.currentUser?.role == 'Admin'&& this.currentUser?.user_role != 8)
    {
     this.formData.controls['community'].setValidators(Validators.required);
     this.formData.updateValueAndValidity();
    }
  
    let today = new Date();
    this.todaysDate = this.getDate(today);
    console.log(this.todaysDate);
    

    this.tomorrow = this.addDaysToDate(today, 1);
    console.log(this.tomorrow);
  }

  get isHolidayEndDisabled() {
    return !this.formData.get('holi_strDate').value;
  }

  get controls(){
   return this.formData.controls
  }

  goBack(){
    this.loct.back()
  }

 dateErrorFxn() {
    let date = new Date();
    let yesterday = new Date();
    yesterday.setDate(date.getDate() - 1);
    let inputDate = new Date(this.formData.value.holi_strDate)
    return yesterday > inputDate;
}

  submitted(){
    if(this.dateErrorFxn()){
      this.tost.errorToastr('Please select valid date!')
      return;
    }
    for (let item of Object.keys(this.controls)) {
      this.controls[item].markAsDirty()
    }
    if (this.formData.invalid) {
      return;
    }
    let body={
     
      description: this.formData.value.description,
      holiday_name: this.formData.value.holiday_name,
      agency_id: this.formData.value.agency_id,
      community_id: this.currentUser?.user_role == 6 || this.currentUser?.user_role == 3 || this.currentUser?.user_role == 8 ? this.formData.value.community : this.currentUser?.id,
      start_date:  this.cnvrtnewDt(this.formData.value.holi_strDate + ' ' + this.formData.value.holi_strTime),
      end_date :  this.cnvrtnewDt(this.formData.value.holi_endDate + ' ' + this.formData.value.holi_endTime),
    }
    if(this.formData.value.holi_strDate + ' ' + this.formData.value.holi_strTime >= this.formData.value.holi_endDate + ' ' + this.formData.value.holi_endTime){
      this.tost.errorToastr("Holiday End Time must be after Holiday Start Time")
      this.btnShow = false;
    }
    else{    
    this.btnShow = true;
    this.dataService.addHoliday(body).subscribe((res: any) => {
      if (!res.error) {
        this.tost.successToastr(res.msg)
        this.btnShow = false;
        this.loct.back()
      } else {
        this.btnShow = false;
        this.tost.errorToastr(res.msg)
      }
    },
      (err) => {
        this.btnShow = false;
        this.dataService.genericErrorToaster()
      })
  }
}

  selectCommunity(id:any){
    this.comid =id
    console.log('tttttttttttttttttt',id);
    this.dataService.getAgenciesNewByID(id).subscribe((response: any) => { 
      this.agencyListingData = response.body
    })
  }

  getcommunityForAgencyRates() {
    if(this.currentUser?.user_role==6)
    this.dataService.getAllCgetcommunityForAgencyRatesom().subscribe((response: any) => { 
          this.comdata = response.body.sort(function(a, b){
            if(a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
            if(a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
            return 0;
        })  ;
        })
        else{
          this.dataService.getMNMGcommunity(this.currentUser?.user_role == 8 ? this.currentUser?.com_id : this.currentUser?.id).subscribe((response: any) => {
              this.comdata = response.body.sort(function(a, b){
                if(a.community_name.toUpperCase() < b.community_name.toUpperCase()) { return -1; }
                if(a.community_name.toUpperCase() > b.community_name.toUpperCase()) { return 1; }
                return 0;
            })  ;
  }    

      )}}


  cnvrtnewDt(date_tm) {
    return new Date(date_tm)
  }

  // getDate(today) {
  //   // let todayDate: any = new Date();
  //   let toDate: any = today.getDate();
  //   if (toDate < 10) {
  //     toDate = '0' + toDate
  //   }
  //   let month = today.getMonth() + 1;
  //   if (month < 10) {
  //     month = '0' + month;
  //   }
  //   let year = today.getFullYear();
  //   this.minDate = year + '-' + month + '-' + toDate
  //   return this.minDate
  // }


addDaysToDate(today, daysToAdd) {
  let newDate = new Date(today);
  newDate.setDate(newDate.getDate() + daysToAdd);
  return newDate.toISOString().slice(0, 10);
}

getDate(today) {
  return today.toISOString().slice(0, 10);
}

// Example usage:


  getAgncyDtail() {
    this.dataService.getAgenciesByID(this.currentUser?.id).subscribe((res: any) => {
      if (!res.error) {
        this.agcydata = res.body[0]
  
      }
      else {
        this.tost.errorToastr(res.msg)
      }
    }, (err) => {
      this.dataService.genericErrorToaster()
    })
  }

  // getAgencyListing(){
  //   let community_id = this.currentUser?.id
  //   let is_for = 'community'
  //   let typeDrop = true
  //   this.dataService.getAgency(this.searchStr= '', this.page.pageNumber, this.page.size, community_id,is_for,typeDrop).subscribe((res:any)=>{
  //     this.agencyListingData = res.body
  //   })
  // }

  // getAgencyId() {
  //   this.dataService.getAgencyId().subscribe((response: any) => {
  //     if (response['error'] == false) {
  //       this.agencyListingData = response.body;
  //       //this.toastr.successToastr(response.msg);
  //     } else if (response['error'] == true) {
  //       this.tost.errorToastr(response.msg);
  //     }
  //   })
  // }

  getAgencyId() {
    let typeDrop = false
    let community_id = this.currentUser?.role == 'Community' ? this.currentUser?.id : this.currentUser?.role == 'Admin' ? this.currentUser?.id : null;
    let is_for= this.currentUser?.role == 'Community' ? 'community' : this.currentUser?.role == 'Admin' ? 'management' :'superadmin';
    this.dataService.getAgency(this.searchStr, this.page.pageNumber, 10, community_id,is_for,typeDrop).subscribe((response: any) => {
      if (response['error'] == false && this.currentUser?.user_role != 6) {
        this.agencyListingData = response.body;
        //this.toastr.successToastr(response.msg);
      } else if (response['error'] == true) {
        this.tost.errorToastr(response.msg);
      }
    })
  }

}
