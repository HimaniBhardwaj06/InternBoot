import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAVxCy0FiUwoQi7ZAL9WqTa7aPaUl2aH4Y",
  authDomain: "task-management-app-3e33c.firebaseapp.com",
  projectId: "task-management-app-3e33c",
  storageBucket: "task-management-app-3e33c.firebasestorage.app",
  messagingSenderId: "752233438243",
  appId: "1:752233438243:web:1eb68a654ff05b0634e596"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;