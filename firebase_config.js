import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// ⚠️ ከታች ባሉት ጥቅሶች (" ") ውስጥ ያሉትን የናሙና ጽሑፎች በሙሉ በአንተ እውነተኛ የFirebase ቁልፎች ተካቸው!
const firebaseConfig = {
  apiKey: "የአንተን_እውነተኛ_API_KEY_እዚህ_ፔስት_አድርግ",
  authDomain: "የአንተን_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://የአንተን_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "የአንተን_PROJECT_ID",
  storageBucket: "የአንተን_PROJECT_ID.appspot.com",
  messagingSenderId: "የአንተን_SENDER_ID_ቁጥር",
  appId: "የአንተን_APP_ID_እዚህ_አስገባ"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);