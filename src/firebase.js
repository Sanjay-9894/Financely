// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth,GoogleAuthProvider } from "firebase/auth";
import { getFirestore,doc,setDoc } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCgHQidE3YM51O6OXbUopCWXLskCZ_HvL0",
  authDomain: "financely-fd786.firebaseapp.com",
  projectId: "financely-fd786",
  storageBucket: "financely-fd786.appspot.com",
  messagingSenderId: "147627077763",
  appId: "1:147627077763:web:c7bf65dfc3c15b4e1eabb6",
  measurementId: "G-774MW4EFX0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export{db,auth,provider,doc,setDoc};