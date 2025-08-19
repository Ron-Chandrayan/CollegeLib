import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import wallpaper from '../../assets/wallpaper.jpeg';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [userData, setUserData] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  // Verify token on component mount
  useEffect(() => {
    if (!token) {
      toast.error('Missing reset token');
      navigate('/forgot-password');
      return;
    }

    const validateToken = async () => {
      try {
        const response = await fetch(`/verify-reset-token/${token}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const data = await response.json();

        if (data.success) {
          setUserData(data.user);
          toast.success('Token verified successfully');
        } else {
          toast.error(data.message || 'Invalid or expired token');
          setTimeout(() => {
            navigate('/forgot-password');
          }, 3000);
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to verify token. Please try again.');
        setTimeout(() => {
          navigate('/forgot-password');
        }, 3000);
      } finally {
        setIsVerifying(false);
      }
    };

    validateToken();
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Check if passwords match when either password field changes
    if (name === 'newPassword' || name === 'confirmPassword') {
      if (name === 'newPassword') {
        setPasswordsMatch(value === formData.confirmPassword || formData.confirmPassword === '');
      } else {
        setPasswordsMatch(value === formData.newPassword);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (formData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    
    setIsLoading(true);

    try {
      const response = await fetch('/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword
        })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success(data.message);
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        toast.error(data.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to reset password. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-cover bg-center flex items-center justify-center p-4 relative overflow-hidden" style={{ backgroundImage: `url(${wallpaper})` }}>
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-blue-900/30 to-indigo-900/40 backdrop-blur-sm"></div>
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/30 relative z-10 max-w-md w-full">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <h2 className="text-2xl font-bold text-slate-800">Verifying Reset Token</h2>
            <p className="text-slate-600 text-center">Please wait while we verify your reset token...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center p-4 relative overflow-hidden" style={{ backgroundImage: `url(${wallpaper})` }}>
      {/* Enhanced background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-blue-900/30 to-indigo-900/40 backdrop-blur-sm"></div>
      
      <div className="w-full max-w-md mx-auto relative z-10">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/30">
          {/* Enhanced header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent mb-2">
              Create New Password
            </h2>
            <p className="text-slate-600 text-base mb-4">
              Set a new password for your account
            </p>
            
            {/* User info card */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 mb-2">
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-medium text-slate-800">{userData.name}</p>
                  <p className="text-sm text-slate-600">{userData.PRN}</p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                New Password
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  name="newPassword" 
                  placeholder="Enter new password" 
                  onChange={handleChange}
                  value={formData.newPassword} 
                  required
                  minLength={6}
                  className="w-full px-4 py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none bg-white/80 backdrop-blur-sm hover:bg-white text-base shadow-sm"
                />
              </div>
              <p className="text-xs text-slate-500">Password must be at least 6 characters</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Confirm Password
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword" 
                  placeholder="Confirm new password" 
                  onChange={handleChange}
                  value={formData.confirmPassword} 
                  required
                  className={`w-full px-4 py-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none bg-white/80 backdrop-blur-sm hover:bg-white text-base shadow-sm ${
                    formData.confirmPassword && !passwordsMatch 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-slate-200'
                  }`}
                />
                {formData.confirmPassword && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {passwordsMatch ? (
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                )}
              </div>
              {formData.confirmPassword && !passwordsMatch && (
                <p className="text-xs text-red-500">Passwords do not match</p>
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="showPassword" className="ml-2 text-sm text-gray-700">
                Show password
              </label>
            </div>

            <button 
              type="submit"
              disabled={isLoading || !passwordsMatch}
              className={`w-full font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-xl focus:ring-4 focus:ring-blue-300 focus:outline-none text-base relative overflow-hidden group ${
                isLoading || !passwordsMatch
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 transform hover:scale-105 hover:shadow-2xl'
              }`}
            >
              <span className="relative z-10">
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Resetting Password...</span>
                  </div>
                ) : (
                  "Reset Password"
                )}
              </span>
              {!isLoading && passwordsMatch && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              )}
            </button>
            
            <div className="text-center">
              <span className="text-slate-600 text-sm">
                Need a new reset link?
              </span>
              <button 
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="ml-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
              >
                Request Again
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
