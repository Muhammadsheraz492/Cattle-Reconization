import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBlbN0csYG8KrEV6YkHAdH068xPUp834OM",
    authDomain: "cattle-9ddf4.firebaseapp.com",
    projectId: "cattle-9ddf4",
    storageBucket: "cattle-9ddf4.appspot.com",
    messagingSenderId: "233267774565",
    appId: "1:233267774565:web:d57eb54547b481744ef28c",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };
