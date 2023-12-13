import { Component, Input, OnInit } from '@angular/core';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { DataService } from 'app/auth/service/data.service';

@Component({
  selector: 'app-schedule-timer',
  templateUrl: './schedule-timer.component.html',
  styleUrls: ['./schedule-timer.component.scss']
})
export class ScheduleTimerComponent implements OnInit {

  public currentUser: User;
  @Input() set startDateTime(val) {
    this.startDateTimes = val;
  }
  btnShow: boolean = false;
  todaysDate: any;
  minDate: string;
  fromTime: number = new Date().getTime(); workId: any;
  startDateTimes: any;
  intrvl: any;
  srt_endStts: any;

  constructor(
    public dataService: DataService,
    private _authenticationService: AuthenticationService,
  ) {
    this._authenticationService.currentUser.subscribe
      (x => {
        this.currentUser = x
      }
      );
  }

  ngOnInit(): void {
  }


  // startTime() {
  //   this.startDateTime = this.dataService.startTracker();
  // }

}
