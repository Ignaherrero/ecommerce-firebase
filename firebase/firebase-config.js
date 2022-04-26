import "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import "firebase/storage";
import * as firebase from "firebase/app";
import { getStorage, ref, uploadBytesResumable } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Initialize Firebase

const firebaseConfigDevelopment = {
  apiKey: process.env.NEXT_PUBLIC_APP_DEVELOPMENT_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_APP_DEVELOPMENT_AUTHDOMAIN,
  projectId: process.env.NEXT_PUBLIC_APP_DEVELOPMENT_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_APP_DEVELOPMENT_STORAGEBUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_APP_DEVELOPMENT_MESSAGINGSENDERID,
  appId: process.env.NEXT_PUBLIC_APP_DEVELOPMENT_APPID,
  measurementId: process.env.NEXT_PUBLIC_APP_DEVELOPMENT_MEASUREMENTID,
};
const firebaseConfigProduction = {
  apiKey: process.env.NEXT_PUBLIC_APP_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_APP_AUTHDOMAIN,
  projectId: process.env.NEXT_PUBLIC_APP_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_APP_STORAGEBUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_APP_MESSAGINGSENDERID,
  appId: process.env.NEXT_PUBLIC_APP_APPID,
  measurementId: process.env.NEXT_PUBLIC_APP_MEASUREMENTID,
};

let app;

if (process.env.NODE_ENV === "development") {
  app = firebase.initializeApp(firebaseConfigDevelopment);
} else {
  app = firebase.initializeApp(firebaseConfigProduction);
}

const db = getFirestore(app);
const googleAuthProvider = getAuth(app);
const storage = getStorage(app);

export const uploadImage = (file) => {
  const storageRef = ref(storage, `images/${file.name}`);
  var uploadTask = uploadBytesResumable(storageRef, file);
  return uploadTask;
};

const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = () => {
  const auth = getAuth();
  signInWithPopup(auth, googleProvider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      return user;
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.log("error", error);
      // ...
    });
};

export { db, googleAuthProvider, app, signInWithGoogle };
