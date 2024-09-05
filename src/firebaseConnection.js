import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBZc-zcldVJNng97D5pZina63ZZ3KcR9Oo",
    authDomain: "task-92b45.firebaseapp.com",
    projectId: "task-92b45",
    storageBucket: "task-92b45.appspot.com",
    messagingSenderId: "952834982095",
    appId: "1:952834982095:web:d37c18371af00b3f1a77ba"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export {db,auth};