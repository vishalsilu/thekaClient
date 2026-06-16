// controllers/useAuthController.js
import { useState, useEffect, useRef } from'react';
import { useNavigate } from'react-router-dom';
import { useDispatch, useSelector } from'react-redux';
import { useGoogleReCaptcha } from'react-google-recaptcha-v3';
import { sendOTP, verifyOTP, completeRegistration, resetPassword } from'../../Redux/controllers/crudUser';
import api from'../../config/api';
import toast from'react-hot-toast';

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
 return `${mins}:${secs < 10 ?'0' :''}${secs}`;
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
   setTimeLeft(0);
 };

 // Handler Actions
 const handleSendEmailOTP = async (e) => {
 e.preventDefault();
 if (!executeRecaptcha) {
 toast.error("Security system initializing. Please wait a brief moment.");
 return;
 }
 if (isSubmitting) return;

 setIsSubmitting(true);
 setLoading(true);
 const loadingToast = toast.loading("Verifying...");

 try {
 const freshToken = await executeRecaptcha('send_otp');
 if (!freshToken) {
 toast.error("Security token acquisition failed.", { id: loadingToast });
 return;
 }

 const response = await api.post('/users/email/send-otp', {
 email: identifier.trim().toLowerCase(),
 recaptchaToken: freshToken,
 mode,
 });

 if (response.data.success) {
 toast.success("OTP code sent to your email.", { id: loadingToast });
 setOtpSent(true);
 setStep(1);
 startResendTimer();
 }
 } catch (error) {
 const errorMessage = error.response?.data?.error || error.response?.data?.message ||"Something went wrong.";
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
 const resultAction = await dispatch(sendOTP({ email: identifier.trim().toLowerCase(), recaptchaToken: token, mode }));

 if (sendOTP.fulfilled.match(resultAction)) {
 toast.success('New OTP code sent to your email.', { id: resendToast });
 startResendTimer();
 } else {
 toast.error(resultAction.payload ||'Resend OTP failed.', { id: resendToast });
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
 const verifyingToast = toast.loading("Verifying credentials...");

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
   const resultAction = await dispatch(verifyOTP({ email: identifier.trim().toLowerCase(), otp }));

   if (verifyOTP.fulfilled.match(resultAction)) {
     if (resultAction.payload.registrationRequired) {
       toast.success('Email verified! Please set up your account details.', { id: verifyingToast });
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
 if (!firstName.trim() || !lastName.trim() || !phone.trim()) {
 return toast.error('Please fill in all required profile fields.');
 }

 setLoading(true);
 const creatingToast = toast.loading("Finalizing account setup...");

 try {
 const resultAction = await dispatch(completeRegistration({
 firstName: firstName.trim(),
 lastName: lastName.trim(),
 phone: phone.trim(),
 registrationToken: regToken,
 }));

 if (completeRegistration.fulfilled.match(resultAction)) {
 toast.success(`Welcome to ${siteData?.websiteName ||'Our Platform'}! Account setup finalized.`, { id: creatingToast });
 navigate('/');
 } else {
 toast.error(resultAction.payload ||'Failed to finalize account setup.', { id: creatingToast });
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