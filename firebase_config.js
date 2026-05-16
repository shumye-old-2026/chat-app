import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "የአንተ-እውነተኛ-API-KEY-እዚህ-ይግባ",
  authDomain: "የአንተ-ፕሮጀክት-ስም.firebaseapp.com",
  databaseURL: "https://የአንተ-ፕሮጀክት-ስም-default-rtdb.firebaseio.com",
  projectId: "የአንተ-ፕሮጀክት-ስም",
  storageBucket: "የአንተ-ፕሮጀክት-ስም.appspot.com",
  messagingSenderId: "የአንተ-SENDER-ID",
  appId: "የአንተ-APP-ID"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);