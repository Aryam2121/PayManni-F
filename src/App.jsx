// import React from "react";
// import ReactDOM from "react-dom";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Header from "./Components/Header";
// import Footer from "./Components/Footer";
// import Home from "./pages/Home";
// import Wallet from "./pages/Wallet";
// import Recharge from "./pages/Recharge";
// import Transactions from "./pages/Transactions";
// import BillPaymentPage from "./Components/Paybills";
// import MoneyTransferPage from "./Components/transfer";
// import LoginPage from "./pages/Login";
// import SignupPage from "./pages/Signup";
// import QrScanner from "./Components/QRCodeScanner";
// import PaymentContacts from "./Components/PayContacts";
// import UserProfile from "./Components/UserProfile"; 
// import GroupPaymentSplitting from "./Components/SplitPayment";
// import BalanceHistory from "./pages/BalanceHis";
// import BusBooking from "./pages/BusBooking";
// import TrainBooking from "./pages/TrainBooking";
// import FlightBooking from "./pages/FlightBooking.";
// import LoanApplication from "./pages/LoanApp";
// import BillPaymentReminder from "./pages/BillPaymentRem";
// import { GoogleOAuthProvider } from "@react-oauth/google";
// function App() {
//   return (
//     <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID} >
//     <Router>
//       <div className="min-h-screen flex flex-col">
//         <Header />
//         <main className="flex-grow pt-12">
//           <Routes>
//             <Route path="/bill-reminder" element={<BillPaymentReminder />} />
//             <Route path="/loan-application" element={<LoanApplication />} />
//             <Route path="/flight-booking" element={<FlightBooking />} />
//             <Route path="/train-booking" element={<TrainBooking />} />
//             <Route path="/bus-booking" element={<BusBooking />} />
//             <Route path="/balanceHis" element={<BalanceHistory />} />
//             <Route path="/split-payment" element={<GroupPaymentSplitting />} />
//             <Route path="/profile" element={<UserProfile />} />
//             <Route path="/payContacts" element={<PaymentContacts />} />
//             <Route path="/qr-scanner" element={<QrScanner />} />
//             <Route path="/login" element={<LoginPage />} />
//             <Route path="/signup" element={<SignupPage />} />
//             <Route path="/transfer" element={<MoneyTransferPage />} />
//             <Route path="/pay-bills" element={<BillPaymentPage />} />
//             <Route path="/" element={<Home />} />
//             <Route path="/home" element={<Home />} />
//             <Route path="/wallet" element={<Wallet />} />
//             <Route path="/recharge" element={<Recharge />} />
//             <Route path="/transactions" element={<Transactions />} />
//           </Routes>
//         </main>
//         <Footer />
//       </div>
//     </Router>
//     </GoogleOAuthProvider>
//   );
// }

// export default App;
// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import { SignedIn, SignedOut, SignIn, SignUp } from "@clerk/clerk-react";

// // Import Components & Pages
// import Header from "./Components/Header";
// import Footer from "./Components/Footer";
// import Home from "./pages/Home";
// import Wallet from "./pages/Wallet";
// import Recharge from "./pages/Recharge";
// import Transactions from "./pages/Transactions";
// import BillPaymentPage from "./Components/Paybills";
// import MoneyTransferPage from "./Components/transfer";
// import LoginPage from "./pages/Login";
// import SignupPage from "./pages/Signup";
// import QrScanner from "./Components/QRCodeScanner";
// import PaymentContacts from "./Components/PayContacts";
// import UserProfile from "./Components/UserProfile";
// import GroupPaymentSplitting from "./Components/SplitPayment";
// import BalanceHistory from "./pages/BalanceHis";
// import BusBooking from "./pages/BusBooking";
// import TrainBooking from "./pages/TrainBooking";
// import FlightBooking from "./pages/FlightBooking";
// import LoanApplication from "./pages/LoanApp";
// import BillPaymentReminder from "./pages/BillPaymentRem";
// import SigninPage from "./pages/Signin";
// // Protected Route Component
// const ProtectedRoute = ({ children }) => {
//   return (
//     <SignedIn>
//       {children}
//     </SignedIn>
//   );
// };

// function App() {
//   return (
//     <div className="min-h-screen flex flex-col">
//       <Header />
//       <main className="flex-grow pt-12">
//         <Routes>
//           {/* Public Routes */}
//           {/* <Route path="/" element={<Home />} /> */}
//           <Route path="/home" element={<Home />} />
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/signup" element={<SignupPage />} />
//           <Route
//   path="/"
//   element={
//     <>
//       <SignedOut>
//         <SigninPage />
//       </SignedOut>
//       <SignedIn>
//         <Navigate to="/home" />
//       </SignedIn>
//     </>
//   }
// />

//           <Route path="/sign-up" element={<SignUp />} />

//           {/* Protected Routes */}
//           <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
//           <Route path="/recharge" element={<ProtectedRoute><Recharge /></ProtectedRoute>} />
//           <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
//           <Route path="/bill-reminder" element={<ProtectedRoute><BillPaymentReminder /></ProtectedRoute>} />
//           <Route path="/loan-application" element={<ProtectedRoute><LoanApplication /></ProtectedRoute>} />
//           <Route path="/flight-booking" element={<ProtectedRoute><FlightBooking /></ProtectedRoute>} />
//           <Route path="/train-booking" element={<ProtectedRoute><TrainBooking /></ProtectedRoute>} />
//           <Route path="/bus-booking" element={<ProtectedRoute><BusBooking /></ProtectedRoute>} />
//           <Route path="/balanceHis" element={<ProtectedRoute><BalanceHistory /></ProtectedRoute>} />
//           <Route path="/split-payment" element={<ProtectedRoute><GroupPaymentSplitting /></ProtectedRoute>} />
//           <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
//           <Route path="/payContacts" element={<ProtectedRoute><PaymentContacts /></ProtectedRoute>} />
//           <Route path="/qr-scanner" element={<ProtectedRoute><QrScanner /></ProtectedRoute>} />
//           <Route path="/transfer" element={<ProtectedRoute><MoneyTransferPage /></ProtectedRoute>} />
//           <Route path="/pay-bills" element={<ProtectedRoute><BillPaymentPage /></ProtectedRoute>} />

//           {/* Redirect Unknown Routes to Home */}
//           <Route path="*" element={<Navigate to="/" />} />
//         </Routes>
//       </main>
//       <Footer />
//     </div>
//   );
// }

// export default App;
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut, SignIn, SignUp } from "@clerk/clerk-react";

// Import Components & Pages
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Home from "./pages/Home";
import Wallet from "./pages/Wallet";
import Recharge from "./pages/Recharge";
import Transactions from "./pages/Transactions";
import BillPaymentPage from "./Components/Paybills";
import MoneyTransferPage from "./Components/transfer";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import QrScanner from "./Components/QRCodeScanner";
import PaymentContacts from "./Components/PayContacts";
import UserProfile from "./Components/UserProfile";
import GroupPaymentSplitting from "./Components/SplitPayment";
import BalanceHistory from "./pages/BalanceHis";
import BusBooking from "./pages/BusBooking";
import TrainBooking from "./pages/TrainBooking";
import FlightBooking from "./pages/FlightBooking";
import LoanApplication from "./pages/LoanApp";
import BillPaymentReminder from "./pages/BillPaymentRem";
import SigninPage from "./pages/Signin";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  return (
    <SignedIn>
      {children}
    </SignedIn>
  );
};

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-12">
        <Routes>
          {/* Public Routes */}
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/sign-up" element={<SignUp />} />

          {/* Redirect to sign-in or home based on authentication */}
          <Route
            path="/"
            element={
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
            }
          />

          {/* Sign-In Page */}
          <Route path="/sign-in" element={<SigninPage />} />

          {/* Protected Routes */}
          <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
          <Route path="/recharge" element={<ProtectedRoute><Recharge /></ProtectedRoute>} />
          <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
          <Route path="/bill-reminder" element={<ProtectedRoute><BillPaymentReminder /></ProtectedRoute>} />
          <Route path="/loan-application" element={<ProtectedRoute><LoanApplication /></ProtectedRoute>} />
          <Route path="/flight-booking" element={<ProtectedRoute><FlightBooking /></ProtectedRoute>} />
          <Route path="/train-booking" element={<ProtectedRoute><TrainBooking /></ProtectedRoute>} />
          <Route path="/bus-booking" element={<ProtectedRoute><BusBooking /></ProtectedRoute>} />
          <Route path="/balanceHis" element={<ProtectedRoute><BalanceHistory /></ProtectedRoute>} />
          <Route path="/split-payment" element={<ProtectedRoute><GroupPaymentSplitting /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          <Route path="/payContacts" element={<ProtectedRoute><PaymentContacts /></ProtectedRoute>} />
          <Route path="/qr-scanner" element={<ProtectedRoute><QrScanner /></ProtectedRoute>} />
          <Route path="/transfer" element={<ProtectedRoute><MoneyTransferPage /></ProtectedRoute>} />
          <Route path="/pay-bills" element={<ProtectedRoute><BillPaymentPage /></ProtectedRoute>} />

          {/* Redirect Unknown Routes to Home */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;