import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; 

const firebaseConfig = {
  apiKey: "AIzaSyDOu5_s-h1-apa81x7OBtX5AR4xlK9msf4",
  authDomain: "coinbank-34c76.firebaseapp.com",
  projectId: "coinbank-34c76",
  storageBucket: "coinbank-34c76.appspot.com",
  messagingSenderId: "784453622855",
  appId: "1:784453622855:web:bb4d57bd68382d517f6562",
  measurementId: "G-T860K4WV93"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, googleProvider, db, storage };
