// Import the functions you need from the SDKs you need
// ✅ Use ES module import from Firebase CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore,setDoc,doc,getDocs, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
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
const password2_input = document.getElementById('password2');
const department_input = document.getElementById('department-id');
const speciality_input = document.getElementById('specialities-id');
const year_input = document.getElementById('years-each-speciality');



const auth = getAuth(app);

async function registerUser() {
  const email = email_input.value.trim();
  const password = password_input.value.trim();
  const password2 = password2_input.value.trim();
  const department = department_input.value.trim();
  const speciality = speciality_input.value.trim();
  const year = year_input.value.trim();

  if (password !== password2) {
    alert("Passwords do not match.");
    return;
  }
   const channel = `${department}/${speciality}/${year}`;
  try {
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
       await setDoc(doc(db, "users",userCredential.user.uid), {
      email,
      channel
    });
    console.log("✅ User registered:", userCredential.user);
    alert("Registration successful! You can now log in.");
    window.location.href = "login.html";
  } catch (error) {
    console.error("Registration failed:", error.message);
    alert(error.message);
  }
}


const register_button =  document.getElementById('register_button');
register_button.addEventListener('click',()=>{
    registerUser();
})




