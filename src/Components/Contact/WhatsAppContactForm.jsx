import React, { useState } from'react';
import { MessageCircle, Send, Loader2 } from'lucide-react';
import { useSelector } from'react-redux';

const WhatsAppContactForm = ({ 
 businessPhoneNumber ='1234567890',
 onSubmit = null,
 userId = null,
 className ='',
 title ='Get in Touch',
 subtitle ='We\'d love to hear from you. Send us a message on WhatsApp!',
 submitText ='Send Message',
 successMessage ='Opening WhatsApp...'
}) => {

 const user = useSelector((state) => state.auth.user);
 const [formData, setFormData] = useState({
 name: user ? `${user.firstName ||''} ${user.lastName ||''}`.trim() :'',
 mobile: user?.phone ||'',
 message:''
 });

 const [isLoading, setIsLoading] = useState(false);

 const handleChange = (e) => {
 const { name, value } = e.target;
 setFormData(prev => ({ ...prev, [name]: value }));
 };

 const handleSubmit = (e) => {
 e.preventDefault();
 setIsLoading(true);
 
 const messageTemplate = `Inquiry from: ${formData.name}\nMessage: ${formData.message}`;
 const whatsappURL = `https://wa.me/${businessPhoneNumber}?text=${encodeURIComponent(messageTemplate)}`;
 
 if (onSubmit) onSubmit(formData, whatsappURL);
 
 setTimeout(() => {
 window.open(whatsappURL,'_blank','noopener,noreferrer');
 setIsLoading(false);
 }, 800);
 };

 return (
 <div className={`bg-white border border-stone-200 p-8 md:p-10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] ${className}`}>
 
 {/* Header */}
 <div className="mb-8">
 <h2 className="text-2xl font-semibold text-stone-900 mb-2 tracking-tight">{title}</h2>
 <p className="text-sm text-stone-500 font-normal leading-relaxed">{subtitle}</p>
 </div>

 {/* Form */}
 <form onSubmit={handleSubmit} className="space-y-6">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="space-y-1.5">
 <label className="text-xs font-medium text-stone-700">Full Name</label>
 <input
 type="text" name="name" value={formData.name} disabled={!!user} onChange={handleChange}
 className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 focus:bg-white focus:border-stone-400 focus:outline-none transition-all text-sm text-stone-800"
 />
 </div>
 <div className="space-y-1.5">
 <label className="text-xs font-medium text-stone-700">Mobile Number</label>
 <input
 type="tel" name="mobile" value={formData.mobile} disabled={!!user?.phone} onChange={handleChange}
 className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 focus:bg-white focus:border-stone-400 focus:outline-none transition-all text-sm text-stone-800"
 />
 </div>
 </div>

 <div className="space-y-1.5">
 <label className="text-xs font-medium text-stone-700">Message</label>
 <textarea
 name="message" value={formData.message} onChange={handleChange} rows="4"
 className="w-full px-4 py-3 bg-stone-50 border border-stone-200 focus:bg-white focus:border-stone-400 focus:outline-none transition-all text-sm text-stone-800 resize-none"
 />
 </div>

 <button
 type="submit"
 disabled={isLoading}
 className="w-full bg-stone-900 text-white text-sm font-medium py-3 hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
 >
 {isLoading ? (
 <>
 <Loader2 size={16} className="animate-spin" />
 {successMessage}
 </>
 ) : (
 <>
 {submitText}
 <Send size={14} />
 </>
 )}
 </button>
 </form>

 <div className="mt-8 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.1em] text-stone-400">
 <MessageCircle size={10} />
 <span>Secure Client Communication Desk</span>
 </div>
 </div>
 );
};

export default WhatsAppContactForm;