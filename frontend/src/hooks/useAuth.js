import { useState } from 'react';
import { userAPI } from '../api/endpoints';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [otpSent, setOtpSent] = useState(false);

  const sendOtp = async (mobile_number, name = '', email = '') => {
    try {
      setLoading(true);
      setError(null);

      const response = await userAPI.sendOtp({
        mobile_number,
        ...(name && { name }),
        ...(email && { email })
      });

      if (response.success) {
        setOtpSent(true);
        return { success: true, message: response.message };
      }

      throw new Error(response.message || 'Failed to send OTP');
    } catch (err) {
      const errorMessage = err.message || 'Failed to send OTP';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (mobile_number, otp) => {
    try {
      setLoading(true);
      setError(null);

      const response = await userAPI.verifyOtp({ mobile_number, otp });

      if (response.success && response.data?.token) {
        console.log('OTP verified successfully:', response);
        // Save token to localStorage
        localStorage.setItem('authToken', response.data.token);

        // Optionally save user info
        localStorage.setItem('userData', JSON.stringify({
          userId: response.data.userId,
          mobile_number: response.data.mobile_number,
          name: response.data.name,
          email: response.data.email,
        }));

        return {
          success: true,
          message: response.message,
          userData: response.data
        };
      }

      throw new Error(response.message || 'Failed to verify OTP');
    } catch (err) {
      const errorMessage = err.message || 'Failed to verify OTP';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    window.location.href = '/login';
  };

  const isAuthenticated = () => {
    return !!localStorage.getItem('authToken');
  };

  return {
    loading,
    error,
    otpSent,
    sendOtp,
    verifyOtp,
    logout,
    isAuthenticated,
    setOtpSent,
  };
};
