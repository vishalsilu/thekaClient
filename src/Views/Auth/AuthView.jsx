import { ArrowLeftIcon } from 'lucide-react';
import React from 'react';
import { useState } from 'react';

const AuthView = ({ controller }) => {
  const {
    step, mode, otp, otpSent, identifier, password, confirmPassword, firstName, 
    lastName, phone, loading, isSubmitting, timeLeft, siteData, formatTime, 
    handleChooseMode, setIdentifier, setPassword, setConfirmPassword, 
    setFirstName, setLastName, setPhone, setOtp, handleIdentifierSubmit, 
    handleProfileSubmit, handleVerifyOTP, handleResendOTP, handleRestart,isSubscribed, setIsSubscribed, setStep
  } = controller;

  const showOtpInput = otpSent || timeLeft > 0;
 
  
  const headerLabel = step === 1 
    ? (showOtpInput ? (mode === 'forgot' ? 'Reset Your Password' : 'Enter OTP Confirmation') : (mode === 'login' ? 'Sign In' : mode === 'register' ? 'Create Account' : 'Reset Password'))
    : 'Complete Your Profile';

  const submitLabel = loading ? 'Working...' : (showOtpInput ? (mode === 'forgot' ? 'Reset Password' : 'Verify OTP') : (mode === 'login' ? 'Send OTP' : mode === 'register' ? 'Register & Send OTP' : 'Send Reset Code'));

  return (
    <div className="max-w-[400px] w-full mx-auto p-6 bg-white border border-zinc-200 shadow-sm rounded-xl antialiased">
      <h2 className="text-center text-lg font-bold text-zinc-900 tracking-tight">{siteData?.websiteName || 'Platform'}</h2>
      <h3 className="text-center text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-6">{headerLabel}</h3>

      {step === 1 && (
        <div className="space-y-4">
          {!showOtpInput && (
            <p className="text-center text-[11px] text-zinc-500">
              {mode === 'forgot' ? 'Enter your email to receive a reset code.' : 'Enter your credentials to continue.'}
            </p>
          )}

          <form onSubmit={showOtpInput ? handleVerifyOTP : handleIdentifierSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-[9px] font-black uppercase text-zinc-400">Email Address</label>
              <input type="email" placeholder="name@example.com" value={identifier} onChange={(e) => setIdentifier(e.target.value)} disabled={loading || otpSent} required className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm outline-none focus:border-zinc-900" />
            </div>
            
          {mode === 'forgot' && otpSent && (
              <>
               <div className="space-y-1">
               <label className="block text-[9px] font-black uppercase text-zinc-400">OTP</label>
               <input type="text" maxLength="6" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} placeholder="Enter 6 digit secure otp" required className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm outline-none focus:border-zinc-900" />
             </div>
               <div className="space-y-1">
               <label className="block text-[9px] font-black uppercase text-zinc-400">New Password</label>
               <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}  required className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm outline-none focus:border-zinc-900" />
             </div>
            <div className="space-y-1">
               <label className="block text-[9px] font-black uppercase text-zinc-400">Confirm Password</label>
               <input type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}  required className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm outline-none focus:border-zinc-900" />
             </div>
              </>
          )}

            {!showOtpInput && mode === 'login' && (
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="block text-[9px] font-black uppercase text-zinc-400">Password</label>
                  <button type="button" onClick={() => handleChooseMode('forgot')} className="text-[9px] font-bold uppercase text-zinc-600 hover:text-black">Forgot?</button>
                </div>
                <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm outline-none focus:border-zinc-900" />
              </div>
            )}

            {!showOtpInput && mode === 'register' && (
              <>
                <div className="space-y-1"><label className="block text-[9px] font-black uppercase text-zinc-400">Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm outline-none focus:border-zinc-900" /></div>
                <div className="space-y-1"><label className="block text-[9px] font-black uppercase text-zinc-400">Confirm Password</label><input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm outline-none focus:border-zinc-900" /></div>
              </>
            )}

            {showOtpInput && mode !== 'forgot' && (
              <div className="space-y-1">
                <label className="block text-[9px] font-black uppercase text-zinc-400">OTP Code</label>
                <input type="text" maxLength="6" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} className="w-full px-3 py-3 text-center text-xl tracking-[0.5em] bg-zinc-50 border border-zinc-200 rounded-lg outline-none focus:border-zinc-900" placeholder="000000" required />
              </div>
            )}

            <button type="submit" disabled={loading || isSubmitting} className="w-full py-2.5 text-[10px] font-black uppercase tracking-[0.15em] rounded-lg bg-zinc-900 text-white hover:bg-black transition-all">
              {submitLabel}
            </button>
          </form>

          {!otpSent && (
            <button type="button" onClick={() => handleChooseMode(mode === 'login' ? 'register' : 'login')} className="w-full text-[10px] font-bold uppercase text-zinc-500 hover:text-zinc-900 transition">
              {mode === 'login' ? 'New here? Create Account' : 'Already have an account? Sign In'}
            </button>
          )}

          <div className="flex flex-col items-start gap-5 justify-center pt-2">
  {step > 1 && (
    <button 
      type="button" 
      onClick={handleRestart} 
      className="text-[9px] font-black uppercase text-zinc-400 hover:text-black"
    >
      Reset
    </button>
  )}
  
  {otpSent && (
    <div className="text-[10px] text-zinc-500">
      {timeLeft > 0 ? (
        <>Resend in {formatTime(timeLeft)}</>
      ) : (
        <button onClick={handleResendOTP} className="font-bold underline text-black">
          Resend Code
        </button>
      )}
    </div>
  )}

  {/* 2. Replaced your second duplicate block with this checkbox label */}
 {showOtpInput && mode === 'register' && ( <label className="flex items-start gap-2 text-[10px] text-zinc-500 cursor-pointer">
    <input
      type="checkbox"
      checked={isSubscribed}
      onChange={(e) => setIsSubscribed(e.target.checked)}
      className="mt-[2px] w-3 h-3 accent-black cursor-pointer" 
    />
    <span className="leading-tight">
      I agree to subscribe to get the latest updates very first to grab hot deals and offers
    </span>
  </label>)}
</div>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <button type="button" onClick={() => setStep(1)} className="flex items-center gap-1 text-[10px] font-bold uppercase text-zinc-500"><ArrowLeftIcon size={12} /> Back</button>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-[9px] font-black uppercase text-zinc-400">First Name</label><input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm outline-none" /></div>
            <div><label className="block text-[9px] font-black uppercase text-zinc-400">Last Name</label><input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm outline-none" /></div>
<div className="col-span-2">
  <label className="block text-[9px] font-black uppercase text-zinc-400">Phone</label>
  <input 
    type="tel" 
    maxLength={10} 
    value={phone} 
    onChange={(e) => {
      const numericValue = e.target.value.replace(/[^0-9]/g, '');
      setPhone(numericValue);
    }} 
    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm outline-none" 
  />
</div>          </div>
          <button type="submit" className="w-full py-2.5 text-[10px] font-black uppercase rounded-lg bg-zinc-900 text-white">Save Profile</button>
        </form>
      )}

      <div className="mt-6 pt-4 border-t border-zinc-100 text-center">
        <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-zinc-400">Protected by reCAPTCHA & Google Privacy Policy  </p>
      </div>
    </div>
  );
};

export default AuthView;