import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// የአንተ እውነተኛ የFirebase ቁልፎች
const firebaseConfig = {
  apiKey: "AIzaSyBVwvrXBlyaIISyUFf2NyLFBq_mmcvaPCc",
  authDomain: "my-chat-app-393d0.firebaseapp.com",
  databaseURL: "https://my-chat-app-393d0-default-rtdb.firebaseio.com",
  projectId: "my-chat-app-393d0",
  storageBucket: "my-chat-app-393d0.firebasestorage.app",
  messagingSenderId: "836061447359",
  appId: "1:836061447359:web:9a071fb5931ad8b50e320a"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);