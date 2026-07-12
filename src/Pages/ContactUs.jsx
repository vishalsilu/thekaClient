import React, { useState, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import * as Icons from 'react-icons/fa6';
import WhatsAppContactForm from '../Components/Contact/WhatsAppContactForm';
import TicketContactForm from '../Components/Contact/TicketContactForm';
import UserTicketsList from '../Components/Contact/UserTicketsList'; // <-- Import the new list component
import { useTextFavicon } from '../Utils/useTextFavicon';
import api from '../config/api';

const ContactUs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderHelpInfo = location.state?.orderHelp;

  // State handles 3 modes now: 'whatsapp', 'ticket', 'history'
  const [selectedChannel, setSelectedChannel] = useState(orderHelpInfo ? 'ticket' : 'ticket');

  const data = useSelector((state) => state.siteData.data);
  const user = useSelector((state) => state.auth.user);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const contactInfo = data?.contact;
  const phoneDigits = contactInfo?.phone?.replace(/\D/g, '') || '1234567890';

  useTextFavicon('CU', `CONTACT US - ${data?.websiteName?.toUpperCase()}`, {
    bgColor: '#000000',
    textColor: '#ffffff',
  });


  const Address = (add) => {
    const { other, appartment, street, city, state, pin } = add;
    const completeAdd = `${other} ,${appartment} ,${street} ,${city} ,${state} ,${pin}`
    return completeAdd;
  }

  const handleTicketSubmit = useCallback(async (formData) => {
    if (!executeRecaptcha) {
      throw new Error('Security check unavailable. Please wait a moment and try again.');
    }

    try {
      await executeRecaptcha('submit_ticket');
    } catch (securityError) {
      console.warn('ReCaptcha warning:', securityError);
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      subject: formData.subject || orderHelpInfo?.subject || 'Support Request',
      message: formData.message || orderHelpInfo?.message || '',
    };

    const response = await api.post('/support/user', payload);

    // Automatically switch to the "My Tickets" tab after successful creation
    if (user) {
      setSelectedChannel('history');
    } else {
      setSelectedChannel('ticket')
    }

    return response;
  }, [executeRecaptcha, orderHelpInfo]);

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

        {/* LEFT COLUMN: FORM OR HISTORY */}
        <div className="lg:col-span-8">
          <h2 className="text-3xl font-medium mb-4">{contactInfo?.heading || "We're here to help"}</h2>
          <p className="text-gray-500 mb-8">{contactInfo?.subHeading || "Choose a channel below to get in touch with our support team."}</p>

          {/* DYNAMIC TAB NAVIGATION */}
          <div className={`grid gap-3 mb-8 ${user ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {/* <button
              type="button"
              className={`w-full px-4 py-3 text-sm rounded-md transition-all font-bold border ${
                selectedChannel === 'whatsapp'
                  ? 'bg-black text-white'
                  : 'bg-surface text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
              onClick={() => setSelectedChannel('whatsapp')}
            >
              WhatsApp
            </button> */}
            <button
              type="button"
              className={`w-full px-4 py-3 text-sm rounded-md transition-all font-bold border ${selectedChannel === 'ticket'
                  ? 'bg-black text-white'
                  : 'bg-surface text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              onClick={() => setSelectedChannel('ticket')}
            >
              {user ? "New Ticket" : "Get In Touch With Us"}
            </button>
            {/* Only show 'My Tickets' button if user is logged in */}
            {user && (
              <button
                type="button"
                className={`w-full px-4 py-3 text-sm rounded-md transition-all font-bold border ${selectedChannel === 'history'
                    ? 'bg-black text-white'
                    : 'bg-surface text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                onClick={() => setSelectedChannel('history')}
              >
                My Tickets
              </button>
            )}
          </div>

          {/* DYNAMIC CONTENT RENDERING */}
          {/* {selectedChannel === 'whatsapp' && (
            <WhatsAppContactForm
              className="w-full"
              businessPhoneNumber={phoneDigits}
              userId={user?.id}
              title="Chat on WhatsApp"
              subtitle="Send your message directly via WhatsApp. It's fast and secure!"
              submitText="Submit Now"
              successMessage="Opening WhatsApp..."
            />
          )} */}

          {selectedChannel === 'ticket' && (
            <TicketContactForm
              user={user}
              initialData={orderHelpInfo ? {
                subject: orderHelpInfo.subject,
                message: orderHelpInfo.message,
              } : null}
              onSubmit={handleTicketSubmit}
              title="Open a Support Ticket"
              subtitle="Submit your issue below. You can track our responses directly in your account dashboard."
            />
          )}

          {selectedChannel === 'history' && (
            <UserTicketsList user={user} />
          )}

        </div>

        {/* RIGHT COLUMN: INFORMATION */}
        <div className="lg:col-span-4 space-y-10">
          <div className="flex flex-col gap-4">
            <p className="text-sm"><span className="font-bold">Address:</span> {Address(contactInfo?.address)}</p>
            <p className="text-sm"><span className="font-bold">Phone:</span> {contactInfo?.phone}</p>
            <p className="text-sm"><span className="font-bold">Email:</span> {contactInfo?.email}</p>
            <div className="flex items-center gap-4 mt-2">
              {contactInfo?.socials?.map((social, sIndex) => {
                const IconComponent = Icons[`Fa${social.label}`];
                return IconComponent ? (
                  <div className="flex flex-col items-center justify-center gap-1 group ">
                    <a key={sIndex} href={social.url} target="_blank" rel="noopener noreferrer" className="text-2xl hover:scale-110 transition-transform group-hover:text-red-500">
                      <IconComponent />
                    </a>
                    <h1 className='font-bold group-hover:text-red-500'>{social.label}</h1>
                  </div>
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