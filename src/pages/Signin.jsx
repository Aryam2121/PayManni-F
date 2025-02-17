import { useEffect } from "react";

const SigninPage = () => {
  useEffect(() => {
    window.location.href = "https://profound-scorpion-72.accounts.dev/sign-in";
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <p>Redirecting to sign-in...</p>
    </div>
  );
};

export default SigninPage;
