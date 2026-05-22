import { initializeApp } from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDrPMHfYVpJf9bulKvz1lHIPblTiaCvkZo",
  authDomain: "pharma-link-2162a.firebaseapp.com",
  projectId: "pharma-link-2162a",
  storageBucket: "pharma-link-2162a.firebasestorage.app",
  messagingSenderId: "918812501452",
  appId: "1:918812501452:web:32caeb3d5c1af11ae96969",
  measurementId: "G-N1RRFQ2DDY"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const provider = new GoogleAuthProvider();