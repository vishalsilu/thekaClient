// controllers/useAuthController.js
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { sendOTP, verifyOTP, completeRegistration, resetPassword } from '../../Redux/controllers/crudUser';
import api from '../../config/api';
import toast from 'react-hot-toast';

export const useAuthController = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { executeRecaptcha } = useGoogleReCaptcha();

  // Data from Model (Redux)
  const siteData = useSelector((state) => state.siteData.data);
  
  // Core States
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState('login');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [regToken, setRegToken] = useState('');
  
  // Store the temporary Pre-Auth Token
  const [preAuthToken, setPreAuthToken] = useState(''); 
  
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);

  // Resend Countdown Mechanism
  useEffect(() => {
    if (timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerRef.current) {
      clearTimeout(timerRef.current);
    }
    return () => clearTimeout(timerRef.current);
  }, [timeLeft]);

  const startResendTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setTimeLeft(60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleChooseMode = (selectedMode) => {
    setMode(selectedMode);
    setOtpSent(false);
    setStep(1);
    setOtp('');
    setTimeLeft(0);
    setPassword('');
    setConfirmPassword('');
    setRegToken('');
    setPreAuthToken(''); 
  };

  const handleRestart = () => {
    setStep(1);
    setMode('login');
    setOtpSent(false);
    setIdentifier('');
    setPassword('');
    setConfirmPassword('');
    setOtp('');
    setFirstName('');
    setLastName('');
    setPhone('');
    setRegToken('');
    setPreAuthToken(''); 
    setTimeLeft(0);
  };

  // Handler Actions
  const handleSendEmailOTP = async (e) => {
    e.preventDefault();
    if (!executeRecaptcha) {
      toast.error("Security system initializing. Please wait a brief moment.");
      return;
    }

    // UPDATE: Require password for BOTH login and register modes before sending OTP
    if ((mode === 'login' || mode === 'register') && !password) {
      return toast.error("Please enter a password.");
    }

    // Confirm passwords match during registration
    if (mode === 'register' && password !== confirmPassword) {
      return toast.error('Passwords do not match.');
    }

    if (isSubmitting) return;

    setIsSubmitting(true);
    setLoading(true);
    const loadingToast = toast.loading(mode === 'login' ? "Verifying credentials..." : "Sending OTP...");

    try {
      let currentPreAuthToken = '';

      // STEP 1: Check credentials first via the new dedicated route (Login Only)
      if (mode === 'login') {
        const freshToken = await executeRecaptcha('verify_credentials');
        const verifyRes = await api.post('/users/verify-credentials', {
          email: identifier.trim().toLowerCase(),
          password: password,
          recaptchaToken: freshToken
        });

        if (verifyRes.data.success) {
          currentPreAuthToken = verifyRes.data.preAuthToken;
          setPreAuthToken(currentPreAuthToken);
          toast.loading("Credentials verified! Dispatching OTP...", { id: loadingToast });
        }
      }

      // STEP 2: Request the OTP
      const otpToken = await executeRecaptcha('send_otp');
      const payload = {
        email: identifier.trim().toLowerCase(),
        recaptchaToken: otpToken,
        mode,
      };

      if (mode === 'login') {
        payload.preAuthToken = currentPreAuthToken;
      }

      const response = await api.post('/users/email/send-otp', payload);

      if (response.data.success) {
        toast.success("OTP code sent to your email.", { id: loadingToast });
        setOtpSent(true);
        setStep(1);
        startResendTimer();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || "Something went wrong.";
      toast.error(errorMessage, { id: loadingToast });
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (timeLeft > 0 || loading) return;
    if (!executeRecaptcha) return toast.error('Security context unavailable. Please refresh browser.');

    setLoading(true);
    const resendToast = toast.loading("Requesting new OTP...");

    try {
      const token = await executeRecaptcha('resend_otp');
      
      const resultAction = await dispatch(sendOTP({ 
        email: identifier.trim().toLowerCase(), 
        recaptchaToken: token, 
        mode,
        preAuthToken 
      }));

      if (sendOTP.fulfilled.match(resultAction)) {
        toast.success('New OTP code sent to your email.', { id: resendToast });
        startResendTimer();
      } else {
        toast.error(resultAction.payload || 'Resend OTP failed.', { id: resendToast });
      }
    } catch (err) {
      toast.error('Failed to request new OTP.', { id: resendToast });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) return toast.error('Please enter a valid 6-digit OTP code.');

    if (mode === 'forgot') {
      if (!password || password !== confirmPassword) {
        return toast.error('Password and confirmation do not match.');
      }
    }

    setLoading(true);
    const verifyingToast = toast.loading("Verifying code...");

    try {
      if (mode === 'forgot') {
        const resultAction = await dispatch(resetPassword({ email: identifier.trim().toLowerCase(), otp, password }));
        if (resetPassword.fulfilled.match(resultAction)) {
          toast.success('Password reset successfully.', { id: verifyingToast });
          navigate('/');
        } else {
          toast.error(resultAction.payload || 'Invalid reset details provided.', { id: verifyingToast });
        }
      } else {
        // UPDATE: Attach password and mode to the verification payload so backend can register the user
        const verifyPayload = { 
            email: identifier.trim().toLowerCase(), 
            otp,
            mode
        };
        
        if (mode === 'register') {
            verifyPayload.password = password;
        }

        const resultAction = await dispatch(verifyOTP(verifyPayload));

        if (verifyOTP.fulfilled.match(resultAction)) {
          if (resultAction.payload.registrationRequired) {
            toast.success('Account created! You can now complete your profile.', { id: verifyingToast });
            setRegToken(resultAction.payload.registrationToken);
            setStep(2); // Move to profile completion (step 2)
          } else {
            toast.success('Email verified! You are now logged in.', { id: verifyingToast });
            navigate('/');
          }
        } else {
          toast.error(resultAction.payload || 'Invalid OTP code entered.', { id: verifyingToast });
        }
      }
    } catch (err) {
      toast.error('Failed to verify OTP code.', { id: verifyingToast });
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteProfileRegistration = async (e) => {
    e.preventDefault();
    // UPDATE: Removed strict validation so users can submit blank fields to skip

    setLoading(true);
    const creatingToast = toast.loading("Saving profile...");

    try {
      const resultAction = await dispatch(completeRegistration({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        registrationToken: regToken,
      }));

      if (completeRegistration.fulfilled.match(resultAction)) {
        toast.success(`Profile updated! Welcome to ${siteData?.websiteName || 'Our Platform'}.`, { id: creatingToast });
        navigate('/');
      } else {
        toast.error(resultAction.payload || 'Failed to update profile.', { id: creatingToast });
      }
    } catch (err) {
      toast.error('Fatal data configuration parsing failure.', { id: creatingToast });
    } finally {
      setLoading(false);
    }
  };

  return {
    // States & Meta
    step, setStep,
    mode,
    identifier, setIdentifier,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    otp, setOtp,
    otpSent,
    firstName, setFirstName,
    lastName, setLastName,
    phone, setPhone,
    loading, isSubmitting, timeLeft, siteData,
    preAuthToken, 
    // Methods
    formatTime,
    handleChooseMode,
    handleRestart,
    handleIdentifierSubmit: handleSendEmailOTP,
    handleProfileSubmit: handleCompleteProfileRegistration,
    handleVerifyOTP,
    handleResendOTP,
    handleCompleteProfileRegistration,
  };
};