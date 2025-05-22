import "firebase/compat/storage";

import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDIrRWIuOWl9Sx7en8ZagOK6HUOw9DJNaQ",
  authDomain: "facebook-ez-ba531.firebaseapp.com",
  projectId: "facebook-ez-ba531",
  storageBucket: "facebook-ez-ba531.appspot.com",
  messagingSenderId: "142488866969",
  appId: "1:142488866969:web:7020e0185bbd17ec676808",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// 인증 상태 지속성 설정
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("인증 지속성 설정 오류:", error);
});

export { app, auth, db, storage };
