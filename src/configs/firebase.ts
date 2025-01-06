// Import the functions you need from the SDKs you need
//Khởi tạo cấu hình cho firebase ở phía client
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBHFF2dpOSbJWWfVg9O8W9emF59j9bL0JQ",
  authDomain: "shop-nextjs-22587.firebaseapp.com",
  projectId: "shop-nextjs-22587",
  storageBucket: "shop-nextjs-22587.firebasestorage.app",
  messagingSenderId: "772966399194",
  appId: "1:772966399194:web:8d92b7a5fa57a92624f9e3",
  measurementId: "G-1JFN3XHTXZ"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp