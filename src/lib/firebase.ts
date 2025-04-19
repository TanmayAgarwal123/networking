
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
