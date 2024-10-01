// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDhVl-KmS5O858Y3LBjvAEt_-jb-v0wJQQ",
  authDomain: "fixitdb-15651.firebaseapp.com",
  projectId: "fixitdb-15651",
  storageBucket: "fixitdb-15651.appspot.com",
  messagingSenderId: "476361016448",
  appId: "1:476361016448:web:d4cd73bf24d3d30b361265"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Initialize Firebase Auth
const provider = new GoogleAuthProvider(); // Create a Google Auth Provider

export { auth, provider };