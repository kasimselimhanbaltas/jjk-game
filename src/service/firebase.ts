import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
} from "@firebase/firestore";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import firebase from "firebase/compat/app";

const firebaseConfig = {
  apiKey: "AIzaSyBe2WLVhe7gmcIViuXUhfpWNO2gVOHlJxU",
  authDomain: "jjk-game.firebaseapp.com",
  projectId: "jjk-game",
  storageBucket: "jjk-game.appspot.com",
  messagingSenderId: "349108063995",
  appId: "1:349108063995:web:5a1f6e7c52f888e4d76a5e",
  measurementId: "G-6RXRDCB2BK",
};

// firebase.initializeApp(firebaseConfig);
firebase.initializeApp(firebaseConfig);

const db = getFirestore();

export { db };

// export const getUsers = async () => {
//   const docRef = doc(db, "users");
//   const docSnap = await getDoc(docRef);
//   let fetchedUsers: any = [];
//   if (docSnap.exists()) {
//     fetchedUsers = docSnap.data();
//     console.log("Users: ", docSnap.data());
//   } else {
//     // docSnap.data() will be undefined in this case
//     console.log("No such document!");
//   }
//   return fetchedUsers;
// };
