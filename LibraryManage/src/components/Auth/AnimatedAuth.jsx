import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import wallpaper from '../../assets/wallpaper.jpeg';

const AnimatedAuth = ({ onAuthSuccess }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState('prn'); // 'prn', 'password', 'signup', 'otp'
  const [formData, setFormData] = useState({
    PRN: '',
    password: '',
    name: '',
    email: '',
    otp: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [userExists, setUserExists] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showOTP, setShowOTP] = useState(false);

  const handlePRNSubmit = async (e) => {
    e.preventDefault();
    if (!formData.PRN.trim()) {
      toast.error('Please enter your PRN');
      return;
    }

    setIsLoading(true);
    try {
      // Check if user exists in Users collection
      const userResponse = await fetch('/api/check-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ PRN: formData.PRN })
      });
      const userData = await userResponse.json();

      if (userData.exists) {
        setUserExists(true);
        setStep('password');
        toast.success('Welcome back! Please enter your password');
      } else {
        // Check if PRN exists in FeStudent collection
        const studentResponse = await fetch('/api/check-student', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ PRN: formData.PRN })
        });
        const studentData = await studentResponse.json();

        if (studentData.exists) {
          setStudentData(studentData.student);
          setFormData(prev => ({ ...prev, name: studentData.student.name, email: studentData.student.email }));
          setStep('signup');
          toast.success('Welcome to LibMan! Let\'s create your account');
        } else {
          toast.error('PRN not found in our records. Please check your PRN or contact administration.');
        }
      }
    } catch (error) {
      console.error('Error checking PRN:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!formData.password.trim()) {
      toast.error('Please enter your password');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          PRN: formData.PRN,
          password: formData.password
        })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        toast.success('Welcome back!');
        onAuthSuccess(data);
      } else {
        toast.error(data.message || 'Invalid password');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!formData.password.trim() || formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    try {
      // Send OTP to email
      const otpResponse = await fetch('/api/send-signup-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          PRN: formData.PRN,
          email: formData.email,
          name: formData.name
        })
      });

      const otpData = await otpResponse.json();

      if (otpData.success) {
        setStep('otp');
        toast.success('OTP sent to your email!');
      } else {
        toast.error(otpData.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    if (!formData.otp.trim()) {
      toast.error('Please enter the OTP');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/verify-signup-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          PRN: formData.PRN,
          email: formData.email,
          name: formData.name,
          password: formData.password,
          otp: formData.otp
        })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        toast.success('Account created successfully!');
        onAuthSuccess(data);
      } else {
        toast.error(data.message || 'Invalid OTP');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const goBack = () => {
    if (step === 'password') {
      setStep('prn');
      setFormData(prev => ({ ...prev, password: '' }));
    } else if (step === 'signup') {
      setStep('prn');
      setFormData(prev => ({ ...prev, password: '', name: '', email: '' }));
    } else if (step === 'otp') {
      setStep('signup');
      setFormData(prev => ({ ...prev, otp: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center p-4 relative overflow-hidden" style={{ backgroundImage: `url(${wallpaper})` }}>
      {/* Enhanced background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-blue-900/30 to-indigo-900/40 backdrop-blur-sm"></div>
      
      <div className="w-full max-w-md mx-auto relative z-10">
        <div className={`bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/30 transition-all duration-500 ease-in-out ${
          step === 'prn' ? 'h-auto' : 
          step === 'password' ? 'h-auto' : 
          step === 'signup' ? 'h-auto' : 
          'h-auto'
        }`}>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent mb-2">
              {step === 'prn' && 'Enter your PRN to continue'}
              {step === 'password' && 'Welcome Back'}
              {step === 'signup' && 'Welcome to LibMan'}
              {step === 'otp' && 'Verify Your Email'}
            </h2>
            <p className="text-slate-600 text-base">
              {step === 'prn' && 'Please enter your PRN number to get started'}
              {step === 'password' && 'Sign in to access your dashboard'}
              {step === 'signup' && 'Let\'s create your account'}
              {step === 'otp' && 'Enter the OTP sent to your email'}
            </p>
          </div>

          {/* Back button */}
          {step !== 'prn' && (
            <button
              onClick={goBack}
              className="mb-4 flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          )}

          {/* PRN Step */}
          {step === 'prn' && (
            <form onSubmit={handlePRNSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                  PRN Number
                </label>
                <input 
                  type="text" 
                  name="PRN" 
                  placeholder="Enter your PRN" 
                  onChange={handleChange}
                  value={formData.PRN} 
                  required 
                  className="w-full px-4 py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none bg-white/80 backdrop-blur-sm hover:bg-white text-base shadow-sm"
                />
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className={`w-full font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-xl focus:ring-4 focus:ring-blue-300 focus:outline-none text-base relative overflow-hidden group ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 transform hover:scale-105 hover:shadow-2xl'
                }`}
              >
                <span className="relative z-10">
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Checking...</span>
                    </div>
                  ) : (
                    'Continue'
                  )}
                </span>
              </button>
            </form>
          )}

          {/* Password Step */}
          {step === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Password
                </label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    name="password" 
                    placeholder="Enter your password" 
                    onChange={handleChange}
                    value={formData.password} 
                    required 
                    className="w-full px-4 py-4 pr-12 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none bg-white/80 backdrop-blur-sm hover:bg-white text-base shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                    className="mr-2"
                  />
                  <p className="text-slate-600 text-sm">Show password</p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
                >
                  Forgot Password?
                </button>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className={`w-full font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-xl focus:ring-4 focus:ring-blue-300 focus:outline-none text-base relative overflow-hidden group ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 transform hover:scale-105 hover:shadow-2xl'
                }`}
              >
                <span className="relative z-10">
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </span>
              </button>
            </form>
          )}

          {/* Signup Step */}
          {step === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Full Name
                </label>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Enter your full name" 
                  onChange={handleChange}
                  value={formData.name} 
                  required 
                  className="w-full px-4 py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none bg-white/80 backdrop-blur-sm hover:bg-white text-base shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email Address
                </label>
                <input 
                  type="email" 
                  name="email" 
                  placeholder="Enter your email" 
                  onChange={handleChange}
                  value={formData.email} 
                  required 
                  className="w-full px-4 py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none bg-white/80 backdrop-blur-sm hover:bg-white text-base shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Create Password
                </label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    name="password" 
                    placeholder="Create a password (min 6 characters)" 
                    onChange={handleChange}
                    value={formData.password} 
                    required 
                    className="w-full px-4 py-4 pr-12 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none bg-white/80 backdrop-blur-sm hover:bg-white text-base shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-500">Password must be at least 6 characters long</p>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className={`w-full font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-xl focus:ring-4 focus:ring-blue-300 focus:outline-none text-base relative overflow-hidden group ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 transform hover:scale-105 hover:shadow-2xl'
                }`}
              >
                <span className="relative z-10">
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending OTP...</span>
                    </div>
                  ) : (
                    'Continue Creating Account'
                  )}
                </span>
              </button>
            </form>
          )}

          {/* OTP Step */}
          {step === 'otp' && (
            <form onSubmit={handleOTPSubmit} className="space-y-6">
              <div className="text-center mb-4">
                <p className="text-slate-600 text-sm">
                  We've sent a verification code to <span className="font-semibold text-blue-600">{formData.email}</span>
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Verification Code
                </label>
                <div className="relative">
                  <input 
                    type={showOTP ? "text" : "password"}
                    name="otp" 
                    placeholder="Enter 6-digit OTP" 
                    onChange={handleChange}
                    value={formData.otp} 
                    required 
                    maxLength={6}
                    className="w-full px-4 py-4 pr-12 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none bg-white/80 backdrop-blur-sm hover:bg-white text-base shadow-sm text-center tracking-widest"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOTP(!showOTP)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showOTP ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className={`w-full font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-xl focus:ring-4 focus:ring-blue-300 focus:outline-none text-base relative overflow-hidden group ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 transform hover:scale-105 hover:shadow-2xl'
                }`}
              >
                <span className="relative z-10">
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    'Verify & Create Account'
                  )}
                </span>
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    // Resend OTP logic here
                    toast.info('Resending OTP...');
                  }}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
                >
                  Didn't receive the code? Resend
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnimatedAuth;
