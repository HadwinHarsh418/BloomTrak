import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular';
import { User } from 'app/auth/models/user';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';
import { Page } from 'app/utils/models';
import moment from 'moment';

@Component({
  selector: 'app-shared-calender',
  templateUrl: './shared-calender.component.html',
  styleUrls: ['./shared-calender.component.scss']
})
export class SharedCalenderComponent implements OnInit {
  calendarOptions: CalendarOptions;
  public currentUser: User;
  searchStr: string = '';
  public page = new Page();
  public contentHeader: object;
  minDate: string;
  status: any;
  positions: any;
  EventS: any = [];
  start: any;
  end: any;
  hideTbl :boolean = false;
  public rows: any = [];

  constructor(
    private dataService: DataService,
    private _authenticationService: AuthenticationService) {
    this.currentUser = this._authenticationService.currentUserValue;
  }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Shift Calender ',
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
            name: 'Shift List ',
            isLink: true,
            link: '/shift'
          }
        ]
      }
    };
    this.getCalDetail()
    
    setTimeout(() => {

      let clc: any = document.querySelector(".fc-dayGridMonth-button.fc-button.fc-button-primary.fc-button-active")
      clc.click();
    }, 500);

    this.calendarOptions = {
      initialView: 'dayGridMonth',
      eventClick: (e) => this.handleEventOnClick(e),
      height: 500,
      headerToolbar: {
        left: 'prev,next',
        center: 'title',
        right: 'dayGridMonth,dayGridWeek'
      },
      buttonText: {
        month: 'Month',
        week: 'Week',
      },

      events: this.EventS[0]
    };
  }

  handleEventOnClick(arg) {
    // 
  }
  getCalDetail() {
    this.EventS = []
    if (this.currentUser.role == 'Community') {
      let currentUser1 = this.currentUser.id;
      let usetype = ''
      let pageNO = '0'
      let limit = '10'
      let start_time = null
      let end_time = null
      this.dataService.getCommunityShifts(this.searchStr = '', pageNO, usetype, currentUser1, limit,start_time,end_time).subscribe((res: any) => {
        for (let i = 0; i < res.body.length; i++) {
          
          if (!res.error) {
            // this.start = res.body[0].start_time
            this.start = moment.unix(res.body[i].start_time).format("YYYY-MM-DD HH:mm:ss")
            this.end = moment.unix(res.body[i].end_time).format("YYYY-MM-DD HH:mm:ss")
            this.status = res.body[i].status;
            this.positions = res.body[i].positions;
            

            this.EventS.push({
              title: this.status == 0 ? '(Pending) ' + this.positions : this.status == 1 ? '(Started) ' + this.positions : this.status == 2 ? '(Completed) ' + this.positions : '(Onhold)' + this.positions,
              start: this.start,
              end: this.end,
              status: this.status,
              color: this.status == 0 ? 'orange' : this.status == 1 ? 'green' : this.status == 2 ? 'blue' : 'red',
              textColor:'white',
            })

            this.calendarOptions.events = this.EventS
          }

        }
      },
        (err) => {
          this.dataService.genericErrorToaster()
        })
    }

    else if( this.currentUser.role == 'Agency'){
     
      let for_cp1 = 'false';
      let currentUser1 = this.currentUser.id
      let cpType = {cpType2 :  null}
      let slctCpType = {cpType2 : null }
      let tpUsr = 'typeUser'

      this.dataService.getCommunityShiftByID(this.searchStr,for_cp1,currentUser1, cpType ? cpType : slctCpType,tpUsr).subscribe((res: any) => {
        if (!res.error) {
          this.rows = res.body.userShifts
          for (let i = 0; i < res.body.userShifts.length; i++) {
            
            if (!res.error) {
              // this.start = res.body[0].start_time
              this.start = moment.unix(res.body.userShifts[i].start_time).format("YYYY-MM-DD HH:mm:ss")
              this.end = moment.unix(res.body.userShifts[i].end_time).format("YYYY-MM-DD HH:mm:ss")
              this.status = res.body.userShifts[i].status;
              this.positions = res.body.userShifts[i].positions;
              
  
              this.EventS.push({
                title: this.status == 0 ? '(Pending) ' + this.positions : this.status == 1 ? '(Started) ' + this.positions : this.status == 2 ? '(Completed) ' + this.positions : '(Onhold)' + this.positions,
                start: this.start,
                end: this.end,
                status: this.status,
                color: this.status == 0 ? 'orange' : this.status == 1 ? 'green' : this.status == 2 ? 'blue' : 'red',
                textColor:'white',
              })
  
              this.calendarOptions.events = this.EventS
            }
  
          }
        }
      },
        (err) => {
          this.dataService.genericErrorToaster();
        })
    }
    else if (this.currentUser.user_role == '5') {
      this.dataService.getUserAgencyshiftById(this.currentUser.id).subscribe((res: any) => {
        for (let i = 0; i < res.body.userShifts.length; i++) {
          
          if (!res.error) {
            // this.start = res.body[0].start_time
            this.start = moment.unix(res.body.userShifts[i].start_time).format("YYYY-MM-DD HH:mm:ss")
            this.end = moment.unix(res.body.userShifts[i].end_time).format("YYYY-MM-DD HH:mm:ss")
            this.status = res.body.userShifts[i].status;
            this.positions = res.body.userShifts[i].positions;
            

            this.EventS.push({
              title: this.status == 0 ? '(Pending) ' + this.positions : this.status == 1 ? '(Current Shift) ' + this.positions : this.status == 2 ? '(Completed) ' + this.positions : '(Cancelled)' + this.positions,
              start: this.start,
              end: this.end,
              status: this.status,
              color: this.status == 0 ? 'orange' : this.status == 1 ? 'green' : this.status == 2 ? 'blue' : 'red',
              textColor:'white',
            })

            this.calendarOptions.events = this.EventS
          }

        }
      },
        (err) => {
          this.dataService.genericErrorToaster();
        })
    }
    else if (this.currentUser.user_role == '4') {
      let for_cp1 = this.currentUser.role == 'User' ? 'true' : 'false';
      let currentUser1 = this.currentUser.id
      let cpType = ''
      let tpUsr = 'typeUser1'
      
      this.dataService.getCommunityShiftByID(this.searchStr,for_cp1, currentUser1, cpType,tpUsr).subscribe((res: any) => {
        
        for (let i = 0; i < res.body.userShifts.length; i++) {
          
          if (!res.error) {
            // this.start = res.body[0].start_time
            this.start = moment.unix(res.body.userShifts[i].start_time).format("YYYY-MM-DD HH:mm:ss")
            this.end = moment.unix(res.body.userShifts[i].end_time).format("YYYY-MM-DD HH:mm:ss")
            this.status = res.body.userShifts[i].status;
            this.positions = res.body.userShifts[i].positions;
            

            this.EventS.push({
              title: this.status == 0 ? '(Pending) ' + this.positions : this.status == 1 ? '(Current Shift) ' + this.positions : this.status == 2 ? '(Completed) ' + this.positions : '(Cancelled)' + this.positions,
              start: this.start,
              end: this.end,
              status: this.status,
              color: this.status == 0 ? 'orange' : this.status == 1 ? 'green' : this.status == 2 ? 'blue' : 'red',
              textColor:'white',
            })

            this.calendarOptions.events = this.EventS
          }

        }
        // this.allShifts = res.body.availableShifts
        // this.allShifts.map(rt => {
        //   
        //     rt.start_time = moment.unix(rt.start_time).format("YYYY-MM-DD"),
        //     rt.end_time = moment.unix(rt.end_time).format("YYYY-MM-DD"))
        // })
      },
        (err) => {
          this.dataService.genericErrorToaster()
        })
    }
    else {
      this.EventS = []
      let usetype = ''
      this.page.size = 10
      let userShifts = ''
      this.dataService.getshift(this.searchStr = '', usetype, this.page.size,userShifts).subscribe((res: any) => {
        for (let i = 0; i < res.body.length; i++) {
          
          if (!res.error) {
            // this.start = res.body[0].start_time
            this.start = moment.unix(res.body[i].start_time).format("YYYY-MM-DD HH:mm:ss")
            this.end = moment.unix(res.body[i].end_time).format("YYYY-MM-DD HH:mm:ss")
            this.status = res.body[i].status;
            this.positions = res.body[i].positions;
            

            this.EventS.push({
              title: this.status == 0 ? '(Pending) ' + this.positions : this.status == 1 ? '(Current Shift) ' + this.positions : this.status == 2 ? '(Completed) ' + this.positions : '(Cancelled)' + this.positions,
              start: this.start,
              end: this.end,
              status: this.status,
              color: this.status == 0 ? 'orange' : this.status == 1 ? 'green' : this.status == 2 ? 'blue' : 'red',
              textColor:'white',
            })

            this.calendarOptions.events = this.EventS
          }
        }
      },
        (err) => {
          this.dataService.genericErrorToaster()
        })
    }
  }
}
