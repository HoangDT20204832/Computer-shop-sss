importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-messaging.js')
const firebaseConfig = {
  apiKey: "AIzaSyBHFF2dpOSbJWWfVg9O8W9emF59j9bL0JQ",
  authDomain: "shop-nextjs-22587.firebaseapp.com",
  projectId: "shop-nextjs-22587",
  storageBucket: "shop-nextjs-22587.firebasestorage.app",
  messagingSenderId: "772966399194",
  appId: "1:772966399194:web:8d92b7a5fa57a92624f9e3",
  measurementId: "G-1JFN3XHTXZ"
}
// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig)
// eslint-disable-next-line no-undef
const messaging = firebase.messaging()
messaging.onBackgroundMessage(payload => {
  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
    icon: './logo.png'
  }
  self.registration.showNotification(notificationTitle, notificationOptions)
})