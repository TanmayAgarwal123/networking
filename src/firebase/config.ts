
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
// This is a free Firebase configuration with limited quota that will work cross-device
const firebaseConfig = {
  apiKey: "AIzaSyCvzDQFleWmIgAlCpfLq8BLSa3p_7_s4Sc",
  authDomain: "columbia-networking-db.firebaseapp.com",
  databaseURL: "https://columbia-networking-db-default-rtdb.firebaseio.com",
  projectId: "columbia-networking-db",
  storageBucket: "columbia-networking-db.appspot.com",
  messagingSenderId: "613573808162",
  appId: "1:613573808162:web:b3af93c3c9848eb345961d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
