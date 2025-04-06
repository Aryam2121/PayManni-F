// components/BiometricAuth.jsx
import { useEffect, useState } from "react";

export default function BiometricAuth() {
  const [isSupported, setIsSupported] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    setIsSupported(!!window.PublicKeyCredential);
  }, []);

  const handleBiometricAuth = async () => {
    try {
      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: new Uint8Array(32),
          allowCredentials: [],
          timeout: 60000,
          userVerification: "preferred",
        },
      });
      setStatus("Authentication successful ✅");
    } catch (err) {
      setStatus("Authentication failed ❌");
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-md max-w-md mx-auto mb-6">
      <h2 className="text-xl font-semibold mb-4 text-zinc-800 dark:text-white">
        Biometric Login
      </h2>
      <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-4">
        {isSupported
          ? "Click below to authenticate using Face or Fingerprint ID."
          : "Biometric authentication is not supported on this device."}
      </p>
      {isSupported && (
        <button
          onClick={handleBiometricAuth}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
        >
          Authenticate
        </button>
      )}
      {status && (
        <p className="mt-4 text-sm font-medium text-green-600 dark:text-green-400">
          {status}
        </p>
      )}
    </div>
  );
}
