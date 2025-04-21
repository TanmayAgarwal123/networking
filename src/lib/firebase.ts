
import { initializeApp } from "firebase/app";
import { getDatabase, connectDatabaseEmulator, ref, get } from "firebase/database";
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

// Database singleton
let database;
let isFirebaseInitialized = false;

// Initialize Firebase with better error handling
try {
  const app = initializeApp(firebaseConfig);
  database = getDatabase(app);
  isFirebaseInitialized = true;
  console.info("Firebase initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase:", error);
  isFirebaseInitialized = false;
}

// Test the database connection and show appropriate toasts
const testDatabaseConnection = async () => {
  if (!isFirebaseInitialized) {
    toast.error("Could not connect to cloud storage. Using local storage as fallback.");
    return false;
  }

  try {
    // Try a simple read operation to test the connection
    const testRef = ref(database, '.info/connected');
    await get(testRef);
    toast.success("Connected to cloud storage");
    return true;
  } catch (error) {
    console.error("Firebase connection test failed:", error);
    toast.error("Could not connect to cloud storage. Using local storage as fallback.");
    return false;
  }
};

// Test the connection right away
testDatabaseConnection();

export { database, isFirebaseInitialized, testDatabaseConnection };
