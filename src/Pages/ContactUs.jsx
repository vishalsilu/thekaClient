import React, { useState, useCallback } from'react';
import { Link, useLocation } from'react-router-dom';
import { useSelector } from'react-redux';
import { useGoogleReCaptcha } from'react-google-recaptcha-v3';
import * as Icons from'react-icons/fa6';
import WhatsAppContactForm from'../Components/Contact/WhatsAppContactForm';
import EmailContactForm from'../Components/Contact/EmailContactForm';
import { useTextFavicon } from'../Utils/useTextFavicon';
import api from'../config/api';

const ContactUs = () => {
 const location = useLocation();
 const orderHelpInfo = location.state?.orderHelp;
 const [selectedChannel, setSelectedChannel] = useState(orderHelpInfo ? 'email' : 'whatsapp');
 
 const data = useSelector((state) => state.siteData.data);
 const user = useSelector((state) => state.auth.user);
 const { executeRecaptcha } = useGoogleReCaptcha();

 const contactInfo = data?.contact;
 const phoneDigits = contactInfo?.phone?.replace(/\D/g,'') ||'1234567890';

 useTextFavicon('CU', `CONTACT US - ${data?.websiteName?.toUpperCase()}`, {
 bgColor:'#10b981',
 textColor:'#ffffff',
 });

const handleEmailSubmit = useCallback(async (formData) => {
    if (!executeRecaptcha) {
      throw new Error('Security check unavailable. Please wait a moment and try again.');
    }

    let generatedToken = null;
    try {
      generatedToken = await executeRecaptcha('submit_contact');
    } catch (securityError) {
      console.error('Google Security Token Engine Runtime Error:', securityError);
    }

    const subjectText = formData?.subject || orderHelpInfo?.subject || 'Support Request';
    const nameText = formData?.name || 'Anonymous User';
    const optimizedAdminSubject = `[Support Desk Inbound] ${subjectText} | From: ${nameText}`;

    const transmissionPayload = {
      name: nameText,
      email: formData?.email || '',
      subject: optimizedAdminSubject,
      message: formData?.message || orderHelpInfo?.message || '',
      userId: formData?.id || orderHelpInfo?.userId || user?.id || 'Guest Session',
      source: orderHelpInfo?.source || 'contact_us_page',
      recaptchaToken: generatedToken
    };

    // Make the actual API call
    return await api.post('/users/email/contact', transmissionPayload);
    
  }, [user?.id, contactInfo?.email, executeRecaptcha]); // Dependencies closed here

 return (
 <div className="w-full bg-surface">
 {/* HEADER SECTION */}
 <div className="py-2 pt-8 flex flex-col items-center border-b border-gray-100">
 <h1 className="text-4xl md:text-5xl font-medium mb-4">Contact Us</h1>
 <div className="flex items-center gap-2 text-sm tracking-widest uppercase">
 <Link to="/" className="hover:text-black transition-colors">Home</Link>
 <span>{'>'}</span>
 <span>Contact Us</span>
 </div>
 </div>

 {/* MAIN CONTENT AREA */}
 <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-16">
 
 {/* LEFT COLUMN: FORM */}
 <div className="lg:col-span-8">
 <h2 className="text-3xl font-medium mb-4">{contactInfo?.heading}</h2>
 <p className="text-gray-500 mb-8">{contactInfo?.subHeading}</p>

 <div className="grid grid-cols-2 gap-3 mb-8">
 <button
 type="button"
 className={`w-full px-5 py-3 rounded-md transition-all font-medium border ${
 selectedChannel ==='whatsapp'
 ?'bg-black text-white'
 :'bg-surface text-gray-700 border-gray-200 hover:bg-gray-100'
 }`}
 onClick={() => setSelectedChannel('whatsapp')}
 >
 WhatsApp
 </button>
 <button
 type="button"
 className={`w-full px-5 py-3 rounded-md transition-all font-medium border ${
 selectedChannel ==='email'
 ?'bg-black text-white'
 :'bg-surface text-gray-700 border-gray-200 hover:bg-gray-100'
 }`}
 onClick={() => setSelectedChannel('email')}
 >
 Email
 </button>
 </div>

 {selectedChannel ==='whatsapp' ? (
 <WhatsAppContactForm
 className="w-full"
 businessPhoneNumber={phoneDigits}
 userId={user?.id}
 title="Chat on WhatsApp"
 subtitle="Send your message directly via WhatsApp. It's fast and secure!"
 submitText="Submit Now"
 successMessage="Opening WhatsApp..."
 />
 ) : (
 <EmailContactForm
 className="w-full"
 businessEmail={contactInfo?.email ||'support@example.com'}
 userId={user?.id}
 initialData={orderHelpInfo ? {
 name: user?.firstName || user?.lastName ? `${user?.firstName || ''} ${user?.lastName || ''}`.trim() : undefined,
 email: user?.email || undefined,
 subject: orderHelpInfo.subject,
 message: orderHelpInfo.message,
 id: orderHelpInfo.userId
 } : undefined}
 onSubmit={handleEmailSubmit}
 title="Send an Email"
 subtitle="Fill out the secure fields below. We usually respond within 24 business hours."
 submitText="Submit Now"
 successMessage="Sending Message..."
 />
 )}
 </div>

 {/* RIGHT COLUMN: INFORMATION */}
 <div className="lg:col-span-4 space-y-10">
 <div className="flex flex-col gap-4">
 <p className="text-sm"><span className="font-bold">Address:</span> {contactInfo?.address}</p>
 <p className="text-sm"><span className="font-bold">Phone:</span> {contactInfo?.phone}</p>
 <p className="text-sm"><span className="font-bold">Email:</span> {contactInfo?.email}</p>
 <div className="flex items-center gap-4 mt-2">
 {contactInfo?.socials?.map((social, sIndex) => {
 const IconComponent = Icons[`Fa${social.label}`];
 return IconComponent ? (
 <a key={sIndex} href={social.url} target="_blank" rel="noopener noreferrer" className="text-xl hover:scale-110 transition-transform">
 <IconComponent />
 </a>
 ) : null;
 })}
 </div>
 </div>

 <div>
 <h3 className="text-lg font-bold mb-4">We're Open</h3>
 {contactInfo?.workingHours?.map((item, index) => (
 <div key={index} className="flex justify-between font-bold text-sm mb-2">
 <span>{item.day}</span>
 <span>{item.hours}</span>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 );
};

export default ContactUs;