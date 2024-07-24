import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { BehaviorSubject, Notification, Observable, observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationSocketService {
  NotificationSocket: any;
  private notificationSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);


  constructor() {
    setTimeout(() => {
      this.initSocket()
    }, 1000);
  }

  initSocket() {
    this.NotificationSocket = io.connect(environment.socketUrl);
    this.NotificationSocket.on('connect', () => {
    });
    this.NotificationSocket.on("connection", (data: any) => {});
    this.NotificationSocket.on('notification', (data: any) => {
      this.notificationSubject.next(data);
    });
  }

  getNotificationSubject(): BehaviorSubject<any> {
    return this.notificationSubject;
  }
}