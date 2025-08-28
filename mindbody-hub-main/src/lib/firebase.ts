import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBL_iykJiiwgfYQU-uBpb_Yf4wB6sl63kI",
  authDomain: "mediagriassist.firebaseapp.com",
  projectId: "mediagriassist",
  storageBucket: "mediagriassist.firebasestorage.app",
  messagingSenderId: "180830730557",
  appId: "1:180830730557:web:e966a55537975a8ca36d54"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;

