import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/auth/service';
import { NotificationsService } from 'app/main/notifications/notifications.service';
import moment from 'moment';

@Component({
  selector: 'app-all-notification',
  templateUrl: './all-notification.component.html',
  styleUrls: ['./all-notification.component.scss'],
  providers:[NotificationsService]
})
export class AllNotificationComponent implements OnInit {

  public notifications: any;
  currentUser: any;

  constructor(private _notificationsService: NotificationsService,
    private _authenticationService:AuthenticationService) {

    this._authenticationService.currentUser.subscribe(res=>{
      this.currentUser = res;
    })

  }

  checkNotification(){
    this._notificationsService.getNotification(this.currentUser.id).subscribe(
      res => {
      this.notifications = res.body.sort(function (a, b) {
        if (a.createdAt.toUpperCase() < b.createdAt.toUpperCase()) { return 1; }
        if (a.createdAt.toUpperCase() > b.createdAt.toUpperCase()) { return -1; }
        return 0;
      }).map((i: any) => {
        i.datenoti = moment(i.createdAt).format('MM-DD-YYYY');
        i.timenoti = moment(i.createdAt).format('HH:MM A');
        return i;
      });
    });
  }


  ngOnInit(): void {
    this.checkNotification()
  }
}
