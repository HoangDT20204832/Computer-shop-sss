// Import the functions you need from the SDKs you need
//Khởi tạo cấu hình cho firebase ở phía client
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDBeVLeOJPel4ewbsHIlAX7FLMruTwWAXY",
  authDomain: "computer-shop-e5259.firebaseapp.com",
  projectId: "computer-shop-e5259",
  storageBucket: "computer-shop-e5259.firebasestorage.app",
  messagingSenderId: "255102347756",
  appId: "1:255102347756:web:1d8653161990ccefbcf8c9",
  measurementId: "G-4WG3DH5HR0"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp