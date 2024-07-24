import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'app/auth/service';
import { NotificationsService } from 'app/main/notifications/notifications.service';
import { NotificationSocketService } from 'app/notification-socket.service';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

// Interface
interface notification {
  messages: [];
  systemMessages: [];
  system: Boolean;
}

@Component({
  selector: 'app-navbar-notification',
  templateUrl: './navbar-notification.component.html',
  providers:[NotificationsService]
})
export class NavbarNotificationComponent implements OnInit {
  // Public
  public notifications: any;
  NotificationCount: any;
  currentUser: any;
  notocount: any;
  notocountlength: any;
  private notificationSubscription: Subscription;    /**
   *
   * @param {NotificationsService} _notificationsService
   */
  constructor(private _notificationsService: NotificationsService,
    private notification : NotificationSocketService,
    public _router: Router,
    private _authenticationService:AuthenticationService) {
    this._authenticationService.currentUser.subscribe(res=>{
      this.currentUser = res;
    })
  }
  checkNotification(){
    if(this.currentUser?.id)
    this._notificationsService.getNotification(this.currentUser.id).subscribe(
      res => {
      this.notifications = res.body.sort(function (a, b) {
        if (a.createdAt.toUpperCase() < b.createdAt.toUpperCase()) { return 1; }
        if (a.createdAt.toUpperCase() > b.createdAt.toUpperCase()) { return -1; }
        return 0;
      }).slice(0, 5);
      this.notocount = res.body.length
      this.updateNotification()
      this.getCountNotification()
    });
  }
  toggleShowAll() {
      this._router.navigate(['/dashboard/allnotify'])
    
  }

  getCountNotification(){
    if(this.currentUser?.id)
    this._notificationsService.getNotificationReadCount(this.currentUser.id).subscribe(res=>{
      this.NotificationCount = res?.body[0]?.read_count;
      this.notocountlength = res?.body[0]?.read_count
      
    })
  }
  

  updateNotification(){
    this._notificationsService.updateNotificationDetailsById(this.currentUser.id).subscribe(res=>{
    })
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.notificationSubscription = this.notification.getNotificationSubject()
    .pipe(debounceTime(1000)) 
    .subscribe(data => {      
      if (data) {
        this.getCountNotification();  
      }
    });
    this.getCountNotification();
  }
}
