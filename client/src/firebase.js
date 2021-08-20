// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from 'firebase/app';
import 'firebase/auth';
const firebaseConfig = {
  apiKey: 'AIzaSyAKMG3nxEtT5TBydOB2BLh51FNtMZ0p3BI',
  authDomain: 'ecommerce-9c829.firebaseapp.com',
  projectId: 'ecommerce-9c829',
  storageBucket: 'ecommerce-9c829.appspot.com',
  messagingSenderId: '499197038289',
  appId: '1:499197038289:web:ce2ed639bbd657bba3fff0',
  measurementId: 'G-PN0LW4M1K8',
};
// Initialize Firebase
firebase.initializeApp (firebaseConfig);
export const auth = firebase.auth();
export const googleAuthProvider=new firebase.auth.GoogleAuthProvider();
