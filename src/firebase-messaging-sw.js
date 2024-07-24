// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging-compat.js");

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.

firebase.initializeApp({
  apiKey: "AIzaSyCbWkp4Qpi4N-aFMcGe2FL8iTOJn5gNv5c",
  authDomain: "bloomtrak-da279.firebaseapp.com",
  projectId: "bloomtrak-da279",
  storageBucket: "bloomtrak-da279.appspot.com",
  messagingSenderId: "1025681259851",
  appId: "1:1025681259851:web:1beb049c4df5c560bcfcce",
  measurementId: "G-GTFK849BB5"
},
);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
self.addEventListener('notificationclick', (event) => {
    console.log('[Service Worker] Notification click Received. event:%s', event);
    console.log(event, 'notif')
    event.notification.close();
    event.waitUntil(
        clients
          .matchAll({
            type: 'window'
          })
          .then(clientList => {
            for (let i = 0; i < clientList.length; i++) {
              const client = clientList[i];
              if (client.url === '/' && 'focus' in client) {
                return event?.notification?.data?.FCM_MSG?.data?.chat_id ? clients.openWindow(`/member/home/${event?.notification?.data?.FCM_MSG?.data?.chat_id}`) : client.focus();
              }
            }
            if (clients.openWindow)  { 
              return event?.notification?.data?.FCM_MSG?.data?.chat_id ? clients.openWindow(`/member/home/${event?.notification?.data?.FCM_MSG?.data?.chat_id}`) : clients.openWindow('/');
            }
          })
      );
});
const messaging = firebase.messaging();