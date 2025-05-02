import { initializeApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithCredential 
} from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAxWx3NGhZQRVmXDJ6ZhUX7-C90FkiNoJU",
  authDomain: "paymanni.firebaseapp.com",
  projectId: "paymanni",
  storageBucket: "paymanni.appspot.com",
  messagingSenderId: "316780867025",
  appId: "1:316780867025:web:bdd7a2be3c41f7056244f0",
  measurementId: "G-SN2WVLXGWM"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

// Function to set up reCAPTCHA
const setUpRecaptcha = (containerId) => {
  // Clear the previous reCAPTCHA if it exists
  
  if (window.recaptchaVerifier) {
    window.recaptchaVerifier.clear();
  }

  // Initialize the new reCAPTCHA verifier
  window.recaptchaVerifier = new RecaptchaVerifier(containerId, {
    size: "invisible", // or "normal" for testing
    callback: (response) => {
      console.log("reCAPTCHA solved successfully.");
    },
    'expired-callback': () => {
      console.log("reCAPTCHA expired. Please try again.");
    },
  }, auth);
};


// Function to send OTP
const sendOtp = (phoneNumber, containerId) => {
  setUpRecaptcha(containerId);
  const appVerifier = window.recaptchaVerifier;

  return signInWithPhoneNumber(auth, phoneNumber, appVerifier)
    .then((confirmationResult) => {
      console.log("OTP sent to:", phoneNumber);
      return confirmationResult;
    })
    .catch((error) => {
      console.error("Error during OTP send:", error);
      if (error.code === 'auth/too-many-requests') {
        alert('Too many attempts. Please try again later.');
      } else if (error.code === 'auth/invalid-phone-number') {
        alert('Invalid phone number. Please check the number format.');
      } else {
        alert('Error sending OTP. Please try again.');
      }
      throw new Error("Error during OTP send");
    });
};


// Function to verify OTP
const verifyOtp = (verificationId, otp) => {
  const credential = PhoneAuthProvider.credential(verificationId, otp);

  return signInWithCredential(auth, credential)
  .then((userCredential) => {
      console.log("Phone number authenticated successfully:", userCredential.user);
      return userCredential.user;
    })
    .catch((error) => {
      console.error("Error during OTP verification:", error);
      if (error.code === 'auth/invalid-verification-code') {
        alert('Invalid OTP. Please try again.');
      } else {
        alert('OTP verification failed. Please try again.');
      }
      throw new Error("OTP verification failed");
    });
};

// Function to login with email
const loginWithEmailAndPassword = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log("User logged in successfully:", userCredential.user);
      return userCredential.user;
    })
    .catch((error) => {
      console.error("Error during email login:", error);
      throw new Error("Email login failed");
    });
};

// Function to register with email
const registerWithEmailAndPassword = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log("User registered successfully:", userCredential.user);
      return userCredential.user;
    })
    .catch((error) => {
      console.error("Error during email registration:", error);
      throw new Error("Email registration failed");
    });
};

// 🔹 Function to login with Google
const loginWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider)
    .then((result) => {
      console.log("Google login successful:", result.user);
      return result.user;
    })
    .catch((error) => {
      console.error("Error during Google login:", error);
      throw new Error("Google login failed");
    });
};

export {
  setUpRecaptcha,
  firebaseApp,
  auth,
  sendOtp,
  verifyOtp,
  loginWithEmailAndPassword,
  registerWithEmailAndPassword,
  loginWithGoogle // Exporting the new function
};
