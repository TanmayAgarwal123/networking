
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDM5dK7Sp9pYlCKb21_IcO-9E4slgkXq3I",
  authDomain: "columbia-networking-db.firebaseapp.com",
  projectId: "columbia-networking-db",
  storageBucket: "columbia-networking-db.appspot.com",
  messagingSenderId: "994636870153",
  appId: "1:994636870153:web:b87ce9cd2a3593e2acf625",
  databaseURL: "https://columbia-networking-db-default-rtdb.firebaseio.com",
};

// Initialize Firebase with error handling
let app;
let db;

try {
  app = initializeApp(firebaseConfig);
  db = getDatabase(app);
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase:", error);
  // We'll handle the fallback in the useContactManagement hook
}

export { db };
