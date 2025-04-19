
import { initializeApp } from "firebase/app";
import { getDatabase, connectDatabaseEmulator } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC4pOI3KGD_TJ6ME7ZqZFgU-xQA0mP-UTo",
  authDomain: "networking-contacts-db.firebaseapp.com",
  databaseURL: "https://networking-contacts-db-default-rtdb.firebaseio.com",
  projectId: "networking-contacts-db",
  storageBucket: "networking-contacts-db.appspot.com",
  messagingSenderId: "634893480022",
  appId: "1:634893480022:web:7de7ccad6fb93bc3b91671"
};

// Initialize Firebase with error handling
let database;
try {
  const app = initializeApp(firebaseConfig);
  database = getDatabase(app);
  
  // Log successful connection
  console.log("Firebase initialized successfully");
  
  // Uncomment for local development with Firebase emulator
  // if (process.env.NODE_ENV === 'development') {
  //   connectDatabaseEmulator(database, 'localhost', 9000);
  // }
} catch (error) {
  console.error("Error initializing Firebase:", error);
  // Create a mock database object to prevent white screen
  database = null;
}

export { database };
