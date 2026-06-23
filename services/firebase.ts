import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCuIsRm2JI_8-H_fzoiYcYDCX3W_c6Ev4Y",
  authDomain: "smart-switch-1baf4.firebaseapp.com",
  databaseURL:
    "https://smart-switch-1baf4-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smart-switch-1baf4",
  storageBucket: "smart-switch-1baf4.firebasestorage.app",
  messagingSenderId: "30173484876",
  appId: "1:30173484876:web:4baebc7bb1ae9ac65aa1e9",
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
