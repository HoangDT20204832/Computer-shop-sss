importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-messaging.js')
const firebaseConfig = {
    apiKey: "AIzaSyDBeVLeOJPel4ewbsHIlAX7FLMruTwWAXY",
    authDomain: "computer-shop-e5259.firebaseapp.com",
    projectId: "computer-shop-e5259",
    storageBucket: "computer-shop-e5259.firebasestorage.app",
    messagingSenderId: "255102347756",
    appId: "1:255102347756:web:1d8653161990ccefbcf8c9",
    measurementId: "G-4WG3DH5HR0"
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