
import { initializeApp } from "firebase/app";
import { getDatabase, connectDatabaseEmulator } from "firebase/database";
import { toast } from "sonner";

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

let database;

try {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  database = getDatabase(app);
  console.info("Firebase initialized successfully");
  toast.success("Connected to cloud storage");
} catch (error) {
  console.error("Error initializing Firebase:", error);
  toast.error("Could not connect to cloud storage. Using local storage as fallback.");
}

export { database };
