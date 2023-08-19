import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey : "AIzaSyDIabeYaJ0fTr8zqfVWcYq3nujkGfUjIa4" , 
  authDomain : "adde-267cb.firebaseapp.com" , 
  projectId : "adde-267cb" , 
  storageBucket : "adde-267cb.appspot.com" , 
  messagingSenderId : "83010446585" , 
  appId : "1:83010446585:web:6b9b3324e03233f7cfee28" ,  

};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);