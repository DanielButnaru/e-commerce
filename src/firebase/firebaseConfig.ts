// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB7aXv_gRJg5j-kL3JOVO00af2Z7Mie29s",
  authDomain: "ecommerce-app-2a916.firebaseapp.com",
  projectId: "ecommerce-app-2a916",
  storageBucket: "ecommerce-app-2a916.firebasestorage.app",
  messagingSenderId: "37358827141",
  appId: "1:37358827141:web:faebddd3542c99f5c29bec",
  measurementId: "G-0MPF7N1C3X"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

