import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const SigninPage = () => {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) {
      navigate("https://pay-manni.vercel.app/home"); // Redirect to home if user is already signed in
    } else {
      setTimeout(() => {
        window.location.href = "https://profound-scorpion-72.accounts.dev/sign-in";
      }, 2500);
    }
  }, [isSignedIn, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="text-center p-6 bg-gray-800 rounded-lg shadow-lg">
        <div className="flex justify-center items-center w-16 h-16 mx-auto border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-6 text-lg font-semibold tracking-wide">Redirecting to sign-in...</p>
        <p className="text-sm text-gray-400 mt-2">Please wait while we securely sign you in.</p>
      </div>
    </div>
  );
};

export default SigninPage;
