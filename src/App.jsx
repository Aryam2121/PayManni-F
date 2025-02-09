import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
import FlightBooking from "./pages/FlightBooking.";
import LoanApplication from "./pages/LoanApp";
import BillPaymentReminder from "./pages/BillPaymentRem";
import { GoogleOAuthProvider } from "@react-oauth/google";
function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID} >
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-12">
          <Routes>
            <Route path="/bill-reminder" element={<BillPaymentReminder />} />
            <Route path="/loan-application" element={<LoanApplication />} />
            <Route path="/flight-booking" element={<FlightBooking />} />
            <Route path="/train-booking" element={<TrainBooking />} />
            <Route path="/bus-booking" element={<BusBooking />} />
            <Route path="/balanceHis" element={<BalanceHistory />} />
            <Route path="/split-payment" element={<GroupPaymentSplitting />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/payContacts" element={<PaymentContacts />} />
            <Route path="/qr-scanner" element={<QrScanner />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/transfer" element={<MoneyTransferPage />} />
            <Route path="/pay-bills" element={<BillPaymentPage />} />
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/recharge" element={<Recharge />} />
            <Route path="/transactions" element={<Transactions />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
