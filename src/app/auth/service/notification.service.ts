import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  constructor(private _router:Router) {}
  // Method to display notification
  showNotification(title: string, body: string): void {
    // Check if the browser supports notifications
    if (!('Notification' in window)) {
      console.error('This browser does not support notifications.');
      return;
    }

    // Check if permission has been granted for notifications
    if (Notification.permission === 'granted') {
      // Display the notification
      const notification = new Notification(title, { body });
      notification.onclick = () => {
        window.open('https://go.bloomtrak.com', '_blank');
      };
    } else {
      console.warn('Permission for notifications not granted.');
    }
  }
}