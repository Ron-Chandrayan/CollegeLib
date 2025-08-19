import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import wallpaper from '../../assets/wallpaper.jpeg';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [usePRN, setUsePRN] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    PRN: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const toggleInputType = () => {
    setUsePRN(!usePRN);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email || undefined,
          PRN: formData.PRN || undefined
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Email is now being sent from the backend
        toast.success('Password reset link sent to your email address');
        
        // Only log tokens in development if they're returned
        if (data.resetToken) {
          console.log('DEV ONLY - Reset token:', data.resetToken);
          console.log(`DEV ONLY - Reset URL: ${data.resetUrl || `/reset-password?token=${data.resetToken}`}`);
        }
        
        setIsSubmitted(true);
      } else {
        toast.error(data.message || 'Failed to process request');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to send reset email. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center p-4 relative overflow-hidden" style={{ backgroundImage: `url(${wallpaper})` }}>
      {/* Enhanced background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-blue-900/30 to-indigo-900/40 backdrop-blur-sm"></div>
      
      <div className="w-full max-w-md mx-auto relative z-10">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/30">
          {/* Enhanced header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
              {isSubmitted ? (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              ) : (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              )}
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent mb-2">
              {isSubmitted ? "Check Your Email" : "Reset Your Password"}
            </h2>
            <p className="text-slate-600 text-base">
              {isSubmitted 
                ? "We've sent a password reset link to your email address" 
                : `Enter your ${usePRN ? "PRN" : "email"} to receive a password reset link via email`
              }
            </p> 
          </div>

          {isSubmitted ? (
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 mb-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-1">Check your inbox</h3>
                  <p className="text-slate-600 mb-4">
                    We've sent a password reset link to your email address. Please check your inbox and spam folder.
                  </p>
                  <p className="text-sm text-blue-600 font-medium mb-2">
                    {formData.email || (usePRN ? `Email associated with PRN ${formData.PRN}` : '')}
                  </p>
                  <p className="text-sm text-slate-500">
                    The link will expire in 10 minutes
                  </p>
                </div>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium"
                  >
                    Return to Login
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center mb-4">
              <div className="bg-slate-100 p-1 rounded-xl inline-flex">
                <button
                  type="button"
                  onClick={() => setUsePRN(true)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    usePRN 
                      ? 'bg-white shadow-md text-blue-600' 
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  Use PRN
                </button>
                <button
                  type="button"
                  onClick={() => setUsePRN(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    !usePRN 
                      ? 'bg-white shadow-md text-blue-600' 
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  Use Email
                </button>
              </div>
            </div>

            {usePRN ? (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                  PRN Number
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    name="PRN" 
                    placeholder="Enter your PRN" 
                    onChange={handleChange}
                    value={formData.PRN} 
                    required={usePRN}
                    className="w-full px-4 py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none bg-white/80 backdrop-blur-sm hover:bg-white text-base shadow-sm"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  Email Address
                </label>
                <div className="relative">
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="Enter your email" 
                    onChange={handleChange}
                    value={formData.email} 
                    required={!usePRN}
                    className="w-full px-4 py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none bg-white/80 backdrop-blur-sm hover:bg-white text-base shadow-sm"
                  />
                </div>
              </div>
            )}

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
                    <span>Sending Request...</span>
                  </div>
                ) : (
                  "Send Reset Link"
                )}
              </span>
              {!isLoading && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              )}
            </button>
            
            <div className="text-center">
              <span className="text-slate-600 text-sm">
                Remember your password?
              </span>
              <button 
                type="button"
                onClick={() => navigate('/')}
                className="ml-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
              >
                Sign In
              </button>
            </div>
          </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
