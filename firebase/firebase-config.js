import "firebase/app";
import { getFirestore, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import "firebase/storage";
import * as firebase from "firebase/app";
import { getStorage, ref, uploadBytesResumable } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_APP_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_APP_AUTHDOMAIN,
  projectId: process.env.NEXT_PUBLIC_APP_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_APP_STORAGEBUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_APP_MESSAGINGSENDERID,
  appId: process.env.NEXT_PUBLIC_APP_APPID,
  measurementId: process.env.NEXT_PUBLIC_APP_MEASUREMENTID,
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

const db = getFirestore(app);
const googleAuthProvider = getAuth(app);
const storage = getStorage(app);

export const uploadImage = (file) => {
  const storageRef = ref(storage, `images/${file.name}`);
  var uploadTask = uploadBytesResumable(storageRef, file);
  return uploadTask;
};

export const listenArticles = (callback) => {
  // const q = query(collection(db, "articles"));
  // const unsubscribe = onSnapshot(q, (snapshot) => {
  //   const articles = [];
  //   snapshot.docs.map((doc) => {
  //     articles.push(doc.data().article);
  //   });
  //   console.log(articles);
  // });
  // return onSnapshot(({ docs }) => {
  //   const newArticles = docs.map((doc) => {
  //     return {
  //       id: doc.id,
  //       ...doc.data(),
  //     };
  //   });
  //   callback(newArticles);
  // });
};

export { db, googleAuthProvider, app };
