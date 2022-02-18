// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBycT1c_GWnjTu9CqeKa-phW9JjDKMPmpk",
  authDomain: "mimoid.firebaseapp.com",
  projectId: "mimoid",
  storageBucket: "mimoid.appspot.com",
  messagingSenderId: "532895319684",
  appId: "1:532895319684:web:ecaf08b35d9c126f0de4d1",
  measurementId: "G-QZHEDQLY1D"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);