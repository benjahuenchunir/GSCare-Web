import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAeLhJkhOhOK-ImmPOQGsn2BFKyIwQraCQ",
  authDomain: "gscare-da2b2.firebaseapp.com",
  projectId: "gscare-da2b2",
  storageBucket: "gscare-da2b2.firebasestorage.app",
  messagingSenderId: "418261211641",
  appId: "1:418261211641:web:d335a15ec8f0f58ef60528",
  measurementId: "G-QY9ZWL73NW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
