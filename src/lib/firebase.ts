
import { initializeApp } from "firebase/app";
import { getDatabase, connectDatabaseEmulator, ref, set, get } from "firebase/database";
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

// Global variables to track database state
let database = null;
let isDatabaseInitialized = false;

// Initialize Firebase with more robust error handling
const initializeFirebase = async () => {
  if (isDatabaseInitialized) return database;
  
  try {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    database = getDatabase(app);
    
    // Verify connection by trying a simple read operation
    const testRef = ref(database, '.info/connected');
    const snapshot = await get(testRef);
    
    if (snapshot.exists()) {
      console.info("Firebase initialized and connected successfully");
      toast.success("Connected to cloud storage");
      isDatabaseInitialized = true;
      return database;
    } else {
      throw new Error("Firebase initialized but connection test failed");
    }
  } catch (error) {
    console.error("Error initializing Firebase:", error);
    toast.error("Could not connect to cloud storage. Using local storage as fallback.");
    database = null;
    isDatabaseInitialized = false;
    return null;
  }
};

// Initialize immediately
initializeFirebase();

// Export functions to check and get database
const getFirebaseDatabase = async () => {
  if (isDatabaseInitialized) return database;
  return await initializeFirebase();
};

const isDatabaseAvailable = () => {
  return isDatabaseInitialized && database !== null;
};

export { getFirebaseDatabase, isDatabaseAvailable };
