// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBe3qXPCFiB5RgwyQ3wPbp7JrfyfuzmnmE",
  authDomain: "job-portal-application-2529c.firebaseapp.com",
  projectId: "job-portal-application-2529c",
  storageBucket: "job-portal-application-2529c.firebasestorage.app",
  messagingSenderId: "616049158629",
  appId: "1:616049158629:web:7c157608146184f8d4270c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);