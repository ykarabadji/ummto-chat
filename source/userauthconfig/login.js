// Import the functions you need from the SDKs you need
// ✅ Use ES module import from Firebase CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, getDocs, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Your config and app logic below

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBNJ-ty_T7cMfcCX81oVDSTmyTrAfz6sMo",
  authDomain: "chatpp-50ee8.firebaseapp.com",
  projectId: "chatpp-50ee8",
  storageBucket: "chatpp-50ee8.firebasestorage.app",
  messagingSenderId: "776544732197",
  appId: "1:776544732197:web:3027f330ef88ffc30eabcc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);


const email_input = document.getElementById('email');
const password_input= document.getElementById('password');



const login_button =  document.getElementById('login_button');
login_button.addEventListener('click',()=>{
  loginUser();
})


const auth = getAuth(app);

async function loginUser() {
  const email = email_input.value.trim();
  const password = password_input.value.trim();

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("✅ Login successful:", userCredential.user);
    const user_email = userCredential.user.email;
    const users = await getDocs(collection(db,"users"));
    users.forEach((doc) => {
      const data = doc.data()
       if(user_email === data.email){
         const  channel  = data.channel;
         localStorage.setItem("channel",channel);
       }
    });
    const [full] = user_email.split("@")
    const [firstName, lastName] = full.split(".");
     const full_name = `${firstName} ${lastName}`;
    // module.exports = {full_name};
    localStorage.setItem("fullName", full_name);
    
    window.location.href = "../specializedchat/specialitieschat.html";
  } catch (error) {
    console.error("Login failed:", error.message);
    alert("Login failed: " + error.message);
  }
}
