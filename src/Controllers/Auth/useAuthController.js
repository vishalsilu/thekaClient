import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { sendOTP, verifyOTP, completeRegistration, resetPassword } from '../../Redux/controllers/crudUser';
import api from '../../config/api';
import toast from 'react-hot-toast';
import { LayoutList } from 'lucide-react';

export const useAuthController = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const siteData = useSelector((state) => state.siteData.data);

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
  const [preAuthToken, setPreAuthToken] = useState('');

  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(true);
  const timerRef = useRef(null);


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

  const handleSendEmailOTP = async (e) => {
    e.preventDefault();
    if (!executeRecaptcha) {
      toast.error("Security system initializing. Please wait a brief moment.");
      return;
    }

    if ((mode === 'login' || mode === 'register') && !password) {
      return toast.error("Please enter a password.");
    }

    if (mode === 'register' && password !== confirmPassword) {
      return toast.error('Passwords do not match.');
    }

    if (isSubmitting) return;

    setIsSubmitting(true);
    setLoading(true);
    const loadingToast = toast.loading(mode === 'login' ? "Verifying credentials..." : "Sending OTP...");

    try {
      let currentPreAuthToken = '';

      // 1. Verify Credentials for Login Mode
      if (mode === 'login') {
        const freshToken = await executeRecaptcha('verify_credentials');
        const verifyRes = await api.post('/users/verify-credentials', {
          email: identifier.trim().toLowerCase(),
          password: password,
          recaptchaToken: freshToken
        });

        // 🚨 FIX: Explicit check. If success is false, throw error to jump to catch block
        if (!verifyRes.data || verifyRes.data.success === false) {
          throw new Error(verifyRes.data?.error || "Invalid credentials.");
        }

        currentPreAuthToken = verifyRes.data.preAuthToken;
        setPreAuthToken(currentPreAuthToken);
        toast.loading("Credentials verified! Dispatching OTP...", { id: loadingToast });
      }

      // 2. Request OTP Code
      const otpToken = await executeRecaptcha('send_otp');
      const payload = {
        email: identifier.trim().toLowerCase(),
        recaptchaToken: otpToken,
        mode,
      };

      if (mode === 'login') {
        payload.preAuthToken = currentPreAuthToken;
      } else if (mode === 'register') {
        payload.password = password;
      }

      const response = await api.post('/users/email/send-otp', payload);

      // 🚨 FIX: Explicit check. If OTP sending fails, throw error.
      if (!response.data || response.data.success === false) {
        throw new Error(response.data?.error || "Failed to send OTP.");
      }

      // 3. Success Path
      toast.success("OTP code sent to your email.", { id: loadingToast });
      setOtpSent(true);
      setStep(1);
      startResendTimer();

    } catch (error) {
      // Handles both manual throws and 500 server crashes cleanly
      const errorMessage = error.response?.data?.error || error.message || "Something went wrong.";
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
        preAuthToken,
        password: mode === 'register' ? password : undefined
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
        const verifyPayload = {
          email: identifier.trim().toLowerCase(),
          otp,
          mode
        };

        const resultAction = await dispatch(verifyOTP(verifyPayload));

        if (verifyOTP.fulfilled.match(resultAction)) {
          if (resultAction.payload.registrationRequired) {
            const subscribeNewsletter = await await api.post('/subscribers', { email: identifier.trim().toLowerCase(), source: 'Register' });
            toast.success('Account created! You can now complete your profile.', { id: verifyingToast });
            setRegToken(resultAction.payload.registrationToken);
            setStep(2);
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
        toast.success(`Profile updated! Welcome.`, { id: creatingToast });
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
    formatTime,
    handleChooseMode,
    handleRestart,
    handleIdentifierSubmit: handleSendEmailOTP,
    handleProfileSubmit: handleCompleteProfileRegistration,
    handleVerifyOTP,
    handleResendOTP,
    handleCompleteProfileRegistration,
    isSubscribed, setIsSubscribed
  };
};