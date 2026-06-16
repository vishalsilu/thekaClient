import React, { useCallback } from'react';
import { useSelector } from'react-redux';
import EmailContactForm from'./EmailContactForm';
import api from'../../config/api';

const EmailContact = () => {
 const user = useSelector((state) => state.auth?.user);
 const siteContactData = useSelector((state) => state.siteData?.data?.contact);

 const handleFormSubmit = useCallback(async (formData) => {
 const transmissionPayload = {
 name: formData.name,
 email: formData.email,
 subject: `[Support] ${formData.subject}`,
 message: formData.message,
 userId: formData.id || user?.id ||'Guest',
 source: 'email_contact_component',
 recipientEmail: siteContactData?.email ||'support@domain.com'
 };

 return await api.post('/users/email/contact', transmissionPayload);
 }, [user?.id, siteContactData?.email]);

 return (
 <div className="bg-white py-16 px-6 md:px-12">
 <div className="max-w-4xl mx-auto">
 {/* Header */}
 <div className="mb-12">
 <h1 className="text-3xl text-stone-900 mb-4 tracking-tight">Contact via Email</h1>
 <div className="w-12 h-1 bg-stone-900 mb-6"></div>
 <p className="text-sm text-stone-500 max-w-lg">
 Submit a detailed request below. Our administration team processes incoming traffic within 24 business hours.
 </p>
 </div>

 {/* Form System */}
 <EmailContactForm
 businessEmail={siteContactData?.email}
 onSubmit={handleFormSubmit}
 userId={user?.id}
 />
 </div>
 </div>
 );
};

export default EmailContact;