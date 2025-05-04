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
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Components & Pages
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
import KycForm from "./Components/KYCForm";
import Movies from "./Components/Movies";
import BookMovie from "./Components/BookMovie";
import LocationServices from "./Components/LocationServices";
import MerchantDashboard from "./Components/MerchantDashboard";
import CustomerInvoice from "./Components/CustomerInvoice";
import BusinessProfile from "./Components/BusinessProfile";
import CustomerSupport from "./Components/CustomerSupport";
import PrivacyPolicy from "./Components/PrivacyPolicy";
import TermsAndConditions from "./Components/TermsAndConditions";
import PaymentSuccess from "./Components/PaymentSuccess";
import ThankYou from "./Components/ThankYou";
import GenerateUpi from "./Components/GenerateUpi";
import ReceiveMoney from "./Components/ReceiveMoney";
import SendMoney from "./Components/SendMoney";
import RegisterUser from "./Components/RegisterUser";
import BankServices from "./Components/BankServices";
import LoginUser from "./Components/LoginUser";
import NotFound from "./pages/Notfound"; // Create this page
import EnhancedSettingsPage from "./Components/Settings";
import VerifyOtp from "./Components/VerifyOtp";
import KYCAdminPanel from "./Components/KYCAdminPanel";
// Auth check
const isAuthenticated = () => !!localStorage.getItem("paymanni_user");

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login-user" replace />;
};

// Optional: Cleaner alternative usage
const Protected = ({ Component }) => {
  return isAuthenticated() ? <Component /> : <Navigate to="/login-user" replace />;
};

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-12">
        <Routes>

          {/* Default Route Based on Auth */}
          <Route
            path="/"
            element={
              isAuthenticated() ? (
                <Navigate to="/home" replace />
              ) : (
                <Navigate to="/login-user" replace />
              )
            }
          />

          {/* Unprotected Routes */}
          <Route path="/login-user" element={<LoginUser />} />
          <Route path="/register-user" element={<RegisterUser />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/movies/book/:movieId" element={<BookMovie />} />

          {/* Protected Routes */}
          <Route path="/kyc-admin" element={<ProtectedRoute><KYCAdminPanel /></ProtectedRoute>} />
          <Route path="/kyc-form/:id" element={<ProtectedRoute><KycForm /></ProtectedRoute>} />
          <Route path="/verify-otp" element={<ProtectedRoute><VerifyOtp/></ProtectedRoute>}/>
          <Route path="/settings" element={<ProtectedRoute><EnhancedSettingsPage/></ProtectedRoute>}/>
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/movies" element={<ProtectedRoute><Movies /></ProtectedRoute>} />
          <Route path="/send-money" element={<ProtectedRoute><SendMoney /></ProtectedRoute>} />
          <Route path="/receive-money" element={<ProtectedRoute><ReceiveMoney /></ProtectedRoute>} />
          <Route path="/generate-upi" element={<ProtectedRoute><GenerateUpi /></ProtectedRoute>} />
          <Route path="/bank-services" element={<ProtectedRoute><BankServices /></ProtectedRoute>} />
          <Route path="/customer-support" element={<ProtectedRoute><CustomerSupport /></ProtectedRoute>} />
          <Route path="/terms-and-conditions" element={<ProtectedRoute><TermsAndConditions /></ProtectedRoute>} />
          <Route path="/privacy-policy" element={<ProtectedRoute><PrivacyPolicy /></ProtectedRoute>} />
          <Route path="/merchant-dashboard" element={<ProtectedRoute><MerchantDashboard /></ProtectedRoute>} />
          <Route path="/customer-invoice" element={<ProtectedRoute><CustomerInvoice /></ProtectedRoute>} />
          <Route path="/business-profile" element={<ProtectedRoute><BusinessProfile /></ProtectedRoute>} />
          <Route path="/location-services" element={<ProtectedRoute><LocationServices /></ProtectedRoute>} />
          <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
          <Route path="/recharge" element={<ProtectedRoute><Recharge /></ProtectedRoute>} />
          <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
          <Route path="/bill-reminder" element={<ProtectedRoute><BillPaymentReminder /></ProtectedRoute>} />
          <Route path="/loan-application" element={<ProtectedRoute><LoanApplication /></ProtectedRoute>} />
          <Route path="/flight-booking" element={<ProtectedRoute><FlightBooking /></ProtectedRoute>} />
          <Route path="/train-booking" element={<ProtectedRoute><TrainBooking /></ProtectedRoute>} />
          <Route path="/bus-booking" element={<ProtectedRoute><BusBooking /></ProtectedRoute>} />
          <Route path="/balance-history" element={<ProtectedRoute><BalanceHistory /></ProtectedRoute>} />
          <Route path="/split-payment" element={<ProtectedRoute><GroupPaymentSplitting /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          <Route path="/pay-contacts" element={<ProtectedRoute><PaymentContacts /></ProtectedRoute>} />
          <Route path="/qr-scanner" element={<ProtectedRoute><QrScanner /></ProtectedRoute>} />
          <Route path="/transfer" element={<ProtectedRoute><MoneyTransferPage /></ProtectedRoute>} />
          <Route path="/pay-bills" element={<ProtectedRoute><BillPaymentPage /></ProtectedRoute>} />

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;


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
//           <Route path="/home" element={<Home />} />
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/signup" element={<SignupPage />} />
//           <Route path="/sign-up" element={<SignUp />} />

//           {/* Redirect to sign-in or home based on authentication */}
//           <Route
//             path="/"
//             element={
//               <SignedOut>
//                 <Navigate to="/sign-in" replace />
//               </SignedOut>
//             }
//           />

//           {/* Sign-In Page */}
//           <Route path="/sign-in" element={<SigninPage />} />

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
//           <Route path="*" element={<Navigate to="/home" replace />} />
//         </Routes>
//       </main>
//       <Footer />
//     </div>
//   );
// }

// export default App;