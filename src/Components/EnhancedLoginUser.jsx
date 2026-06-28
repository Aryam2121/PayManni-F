import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FaEye, 
  FaEyeSlash, 
  FaGoogle, 
  FaApple, 
  FaShieldAlt,
  FaLock,
  FaUser,
  FaMobile,
  FaCheckCircle
} from 'react-icons/fa';
import { HiSparkles, HiLightningBolt } from 'react-icons/hi';
import { ToastContainer, toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { Button } from '../Components/ui/Button';
import { Input, OTPInput } from '../Components/ui/Input';
import PaymanniLogo from '../assets/Paymanniicon.png';

const EnhancedLoginUser = () => {
  const [loginMethod, setLoginMethod] = useState('phone'); // 'phone', 'email', 'otp'
  const [formData, setFormData] = useState({
    phoneNumber: '',
    email: '',
    password: '',
    otp: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const features = [
    {
      icon: <FaShieldAlt />,
      title: 'Bank-grade Security',
      description: '256-bit encryption & multi-factor authentication'
    },
    {
      icon: <HiLightningBolt />,
      title: 'Instant Transfers',
      description: 'Send money in seconds with real-time processing'
    },
    {
      icon: <FaCheckCircle />,
      title: 'Zero Hidden Fees',
      description: 'Transparent pricing with no surprise charges'
    }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (loginMethod === 'phone') {
      if (!formData.phoneNumber) {
        newErrors.phoneNumber = 'Phone number is required';
      } else if (!/^[6-9]\d{9}$/.test(formData.phoneNumber)) {
        newErrors.phoneNumber = 'Please enter a valid Indian phone number';
      }
    }

    if (loginMethod === 'email') {
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    }

    if (loginMethod === 'otp' && !formData.otp) {
      newErrors.otp = 'OTP is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOTP = async () => {
    if (!formData.phoneNumber) {
      setErrors({ phoneNumber: 'Phone number is required' });
      return;
    }

    if (!/^[6-9]\d{9}$/.test(formData.phoneNumber)) {
      setErrors({ phoneNumber: 'Please enter a valid Indian phone number' });
      return;
    }

    setLoading(true);
    try {
      // Simulate OTP sending
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setOtpSent(true);
      setCountdown(30);
      setLoginMethod('otp');
      toast.success('OTP sent successfully!');
      setErrors({});
    } catch (error) {
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Simulate login process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock successful login
      const userData = {
        _id: 'user123',
        name: 'John Doe',
        email: formData.email || `${formData.phoneNumber}@example.com`,
        phoneNumber: formData.phoneNumber,
        profilePic: null,
        balance: 5000
      };

      // Store in localStorage (replace with your actual auth logic)
      localStorage.setItem('paymanni_user', JSON.stringify(userData));
      localStorage.setItem('userId', userData._id);
      
      login(userData);
      toast.success('Login successful!');
      navigate('/home');
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // Simulate Google login
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const userData = {
        _id: 'google_user123',
        name: 'Google User',
        email: 'user@gmail.com',
        profilePic: null,
        balance: 2500
      };

      localStorage.setItem('paymanni_user', JSON.stringify(userData));
      localStorage.setItem('userId', userData._id);
      
      login(userData);
      toast.success('Google login successful!');
      navigate('/home');
    } catch (error) {
      toast.error('Google login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Left Side - Features */}
      <motion.div
        className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 text-white relative z-10"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-md">
          <motion.div
            className="flex items-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.img 
              src={PaymanniLogo} 
              alt="PayManni" 
              className="w-16 h-16 mr-4 drop-shadow-2xl"
              whileHover={{ scale: 1.1, rotate: 5 }}
            />
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
                PayManni
              </h1>
              <p className="text-blue-200 text-sm font-medium">Premium Digital Wallet</p>
            </div>
          </motion.div>

          <motion.h2
            className="text-5xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Your Money, Your Way, Your{' '}
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              PayManni
            </span>
          </motion.h2>

          <motion.p
            className="text-blue-200 text-lg mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            Experience the future of digital payments with advanced security, 
            instant transfers, and zero hidden fees.
          </motion.p>

          <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-start space-x-4 glass-dark p-5 rounded-2xl backdrop-blur-xl border border-white/10"
                variants={itemVariants}
                whileHover={{ scale: 1.02, x: 5 }}
              >
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">{feature.title}</h3>
                  <p className="text-blue-200 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Login Form */}
      <motion.div
        className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <motion.div
            className="flex lg:hidden items-center justify-center mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <img src={PaymanniLogo} alt="PayManni" className="w-16 h-16 mr-4 drop-shadow-2xl" />
            <div className="text-white">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">PayManni</h1>
              <p className="text-blue-200 text-sm">Premium Digital Wallet</p>
            </div>
          </motion.div>

          <motion.div
            className="glass backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/20 relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {/* Decorative gradient overlay */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-bl-full blur-2xl"></div>
            
            <div className="relative z-10">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Welcome Back!</h2>
                <p className="text-blue-200">Sign in to continue to PayManni</p>
              </div>

              {/* Login Method Tabs */}
              <div className="flex glass-dark rounded-2xl p-1.5 mb-6 backdrop-blur-xl">
                {[
                  { key: 'phone', label: 'Phone', icon: <FaMobile /> },
                  { key: 'email', label: 'Email', icon: <FaUser /> }
                ].map((method) => (
                  <motion.button
                    key={method.key}
                    onClick={() => {
                      setLoginMethod(method.key);
                      setOtpSent(false);
                      setErrors({});
                    }}
                    className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300 ${
                      loginMethod === method.key
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                        : 'text-white hover:bg-white/10'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-base">{method.icon}</span>
                    <span className="text-base font-semibold">{method.label}</span>
                  </motion.button>
                ))}
              </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <AnimatePresence mode="wait">
                {loginMethod === 'phone' && !otpSent && (
                  <motion.div
                    key="phone"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Input
                      type="tel"
                      label="Phone Number"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      placeholder="Enter your phone number"
                      leftIcon={<FaMobile />}
                      error={!!errors.phoneNumber}
                      helper={errors.phoneNumber}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    />
                    <Button
                      type="button"
                      onClick={handleSendOTP}
                      loading={loading}
                      className="w-full mt-4"
                      variant="gradient"
                    >
                      Send OTP
                    </Button>
                  </motion.div>
                )}

                {loginMethod === 'email' && (
                  <motion.div
                    key="email"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <Input
                      type="email"
                      label="Email Address"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter your email"
                      leftIcon={<FaUser />}
                      error={!!errors.email}
                      helper={errors.email}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    />
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        label="Password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        placeholder="Enter your password"
                        leftIcon={<FaLock />}
                        rightIcon={
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-white/60 hover:text-white"
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        }
                        error={!!errors.password}
                        helper={errors.password}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      />
                    </div>
                    <Button
                      type="submit"
                      loading={loading}
                      className="w-full"
                      variant="gradient"
                    >
                      Sign In
                    </Button>
                  </motion.div>
                )}

                {(loginMethod === 'otp' || otpSent) && (
                  <motion.div
                    key="otp"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="text-center"
                  >
                    <p className="text-blue-200 mb-4">
                      Enter the 6-digit OTP sent to {formData.phoneNumber}
                    </p>
                    <OTPInput
                      length={6}
                      onComplete={(otp) => handleInputChange('otp', otp)}
                      className="mb-4"
                    />
                    {errors.otp && (
                      <p className="text-red-400 text-sm mb-4">{errors.otp}</p>
                    )}
                    <div className="flex items-center justify-between mb-4">
                      <button
                        type="button"
                        onClick={() => {
                          setOtpSent(false);
                          setLoginMethod('phone');
                        }}
                        className="text-blue-300 hover:text-white text-sm"
                      >
                        Change Number
                      </button>
                      <button
                        type="button"
                        onClick={countdown === 0 ? handleSendOTP : undefined}
                        disabled={countdown > 0}
                        className={`text-sm ${
                          countdown > 0
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-blue-300 hover:text-white'
                        }`}
                      >
                        {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                      </button>
                    </div>
                    <Button
                      type="submit"
                      loading={loading}
                      disabled={formData.otp.length < 6}
                      className="w-full"
                      variant="gradient"
                    >
                      Verify & Sign In
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>

            {/* Divider */}
            <div className="flex items-center my-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              <span className="px-4 text-blue-200 text-sm font-medium">or continue with</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            </div>

            {/* Social Login */}
            <div className="space-y-3">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="button"
                  onClick={handleGoogleLogin}
                  loading={loading}
                  variant="outline"
                  className="w-full glass-dark border-white/20 text-white hover:bg-white/20 hover:border-white/30 backdrop-blur-xl py-3.5 font-semibold"
                >
                  <FaGoogle className="mr-3 text-red-400 text-lg" />
                  Continue with Google
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full glass-dark border-white/20 text-white hover:bg-white/20 hover:border-white/30 backdrop-blur-xl py-3.5 font-semibold"
                >
                  <FaApple className="mr-3 text-lg" />
                  Continue with Apple
                </Button>
              </motion.div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center mt-8">
              <p className="text-blue-200 text-sm">
                Don't have an account?{' '}
                <Link
                  to="/register-user"
                  className="text-yellow-400 hover:text-yellow-300 font-bold underline-offset-2 hover:underline"
                >
                  Sign up now
                </Link>
              </p>
            </div>

            {/* Security Note */}
            <motion.div
              className="flex items-center justify-center mt-8 glass-dark px-4 py-3 rounded-full backdrop-blur-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <FaShieldAlt className="mr-2 text-green-400" />
              <span className="text-blue-200 text-xs font-medium">Your data is encrypted and secure with 256-bit SSL</span>
            </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default EnhancedLoginUser;