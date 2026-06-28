import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./Components/ProtectedRoute";

// Import all components/pages
import Header from "./Components/Header";
import EnhancedHeader from "./Components/EnhancedHeader";
import Footer from "./Components/Footer";
import Home from "./pages/Home";
import Wallet from "./pages/Wallet";
import Recharge from "./pages/Recharge";
import Transactions from "./pages/Transactions";
import BillPaymentPage from "./Components/Paybills_Enhanced";
import ServicesHub from "./pages/ServicesHub";
import Notifications from "./pages/Notifications";
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
import LoginUserNew from "./Components/LoginUserNew";
import NotFound from "./pages/Notfound";
import EnhancedSettingsPage from "./Components/Settings";
import VerifyOtp from "./Components/VerifyOtp";
import KYCAdminPanel from "./Components/KYCAdminPanel";
import Admin from "./Components/Admin";
import NewHome from "./pages/NewHome";
import EnhancedWallet from "./pages/EnhancedWallet";
import EnhancedLoginUser from "./Components/EnhancedLoginUser";
import ModernDashboard from "./pages/ModernDashboard";
import CompleteDashboard from "./pages/CompleteDashboard";

function AppContent() {
  const location = useLocation();
  const { darkMode } = useTheme();
  const hideHeaderFooterRoutes = ["/login-user", "/register-user", "/login-classic", "/login", "/home"];

  const shouldHide = hideHeaderFooterRoutes.includes(location.pathname);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${darkMode ? "dark bg-background" : "bg-background"}`}>
      {!shouldHide && <EnhancedHeader />}
      <main className={`flex-grow ${!shouldHide ? "pt-[72px] pb-28" : ""}`}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginUserNew />} />
          <Route path="/login-user" element={<EnhancedLoginUser />} />
          <Route path="/login-classic" element={<LoginUser />} />
          <Route path="/register-user" element={<RegisterUser />} />
          <Route path="/register" element={<RegisterUser />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
          <Route path="/thank-you" element={<ProtectedRoute><ThankYou /></ProtectedRoute>} />
          <Route path="/movies/book/:movieId" element={<ProtectedRoute><BookMovie /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><Admin /></ProtectedRoute>} />
          <Route path="/kyc-admin" element={<ProtectedRoute requiredRole="admin"><KYCAdminPanel /></ProtectedRoute>} />
          <Route path="/kyc-form/:id" element={<ProtectedRoute><KycForm /></ProtectedRoute>} />
          <Route path="/verify-otp" element={<ProtectedRoute><VerifyOtp/></ProtectedRoute>}/>
          <Route path="/settings" element={<ProtectedRoute><EnhancedSettingsPage/></ProtectedRoute>}/>
          <Route path="/home" element={<ProtectedRoute><CompleteDashboard /></ProtectedRoute>} />
          <Route path="/home-modern" element={<ProtectedRoute><ModernDashboard /></ProtectedRoute>} />
          <Route path="/home-classic" element={<ProtectedRoute><NewHome /></ProtectedRoute>} />
          <Route path="/home-original" element={<ProtectedRoute><Home /></ProtectedRoute>} />
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
          <Route path="/wallet" element={<ProtectedRoute><EnhancedWallet /></ProtectedRoute>} />
          <Route path="/wallet-classic" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
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
          <Route path="/services" element={<ProtectedRoute><ServicesHub /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/pay-bills" element={<ProtectedRoute><BillPaymentPage /></ProtectedRoute>} />

          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!shouldHide && <Footer />}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
