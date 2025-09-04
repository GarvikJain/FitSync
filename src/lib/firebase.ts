import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBL_iykJiiwgfYQU-uBpb_Yf4wB6sl63kI",
  authDomain: "fitsync.firebaseapp.com",
  projectId: "fitsync",
  storageBucket: "fitsync.firebasestorage.app",
  messagingSenderId: "180830730557",
  appId: "1:180830730557:web:e966a55537975a8ca36d54"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Configure Google provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Connect to Firestore emulator in development (commented out for production)
// if (import.meta.env.DEV && !db._delegate._settings?.host?.includes('firebase')) {
//   try {
//     connectFirestoreEmulator(db, 'localhost', 8080);
//   } catch (error) {
//     console.log('Firestore emulator already connected or not available');
//   }
// }

export default app;

