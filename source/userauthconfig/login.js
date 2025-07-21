// login.js
// ---------
// Handles user login logic using Firebase Authentication and Firestore.
// Authenticates user, retrieves user/channel info, and stores in localStorage for chat usage.

// Import the functions you need from the SDKs you need
// ✅ Use ES module import from Firebase CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, getDocs, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Your config and app logic below

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
/*
   firebase config here 
*/
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);


// Get DOM elements for email and password inputs
const email_input = document.getElementById('email');
const password_input= document.getElementById('password');


// Add event listener to login button
const login_button =  document.getElementById('login_button');
login_button.addEventListener('click',()=>{
  loginUser();
})


// Initialize Firebase Authentication
const auth = getAuth(app);

// Login function
async function loginUser() {
  // Get and trim email and password values
  const email = email_input.value.trim();
  const password = password_input.value.trim();

  try {
    // Sign in user with email and password
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("✅ Login successful:", userCredential.user);
    const user_email = userCredential.user.email;
    
    // Retrieve user document from Firestore
    const users = await getDocs(collection(db,"users"));
    users.forEach((doc) => {
      const data = doc.data()
       // Check if user email matches document email
       if(user_email === data.email){
         const  channel  = data.channel;
         // Store channel info in localStorage
         localStorage.setItem("channel",channel);
       }
    });
    // Extract and store full name in localStorage
    const [full] = user_email.split("@")
    const [firstName, lastName] = full.split(".");
     const full_name = `${firstName} ${lastName}`;
    // module.exports = {full_name};
    localStorage.setItem("fullName", full_name);
    
    // Redirect to specialized chat page
    window.location.href = "../specializedchat/specialitieschat.html";
  } catch (error) {
    // Handle and display login errors
    console.error("Login failed:", error.message);
    alert("Login failed: " + error.message);
  }
}
