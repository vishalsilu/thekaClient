import React, { useState, useEffect } from'react';
import { Mail, Send, Loader2 } from'lucide-react';
import { useSelector } from'react-redux';
import { toast } from'react-hot-toast';

const EmailContactForm = ({ onSubmit, userId, title ="Send an Inquiry", subtitle ="Complete the routing parameters below.", initialData = {} }) => {
 const user = useSelector((state) => state.auth.user);
 const [formData, setFormData] = useState({ name:'', email:'', subject:'', message:'', ...initialData });
 const [isLoading, setIsLoading] = useState(false);

 useEffect(() => {
 if (user) {
 setFormData(prev => ({
 ...prev,
 name: prev.name || `${user.firstName ||''} ${user.lastName ||''}`.trim(),
 email: prev.email || user.email || ''
 }));
 }
 }, [user]);

 const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

 const handleSubmit = async (e) => {
 e.preventDefault();
 setIsLoading(true);
 const loadingId = toast.loading('Dispatching message...');
 try {
 await onSubmit({ ...formData, id: userId });
 toast.success('Message delivered successfully', { id: loadingId });
 setFormData(prev => ({ ...prev, subject:'', message:'' }));
 } catch (err) {
 toast.error('Delivery failed. Please try again.', { id: loadingId });
 } finally {
 setIsLoading(false);
 }
 };

 return (
 <form onSubmit={handleSubmit} className="border border-stone-200 p-8 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)]">
 <div className="mb-8 flex items-center gap-4">
 <div className="p-2 bg-stone-50 border border-stone-100 text-stone-600"><Mail size={16} /></div>
 <div>
 <h2 className="text-lg font-semibold text-stone-900">{title}</h2>
 <p className="text-xs text-stone-500">{subtitle}</p>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
 {['name','email'].map(field => (
 <div key={field} className="space-y-1.5">
 <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{field}</label>
 <input name={field} value={formData[field]} onChange={handleChange} disabled={!!user} required
 className="w-full px-4 py-3 bg-stone-50 border border-stone-200 focus:bg-white focus:border-stone-400 outline-none transition-all text-sm" />
 </div>
 ))}
 </div>

 <div className="space-y-1.5 mb-6">
 <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Subject</label>
 <input name="subject" value={formData.subject} onChange={handleChange} required
 className="w-full px-4 py-3 bg-stone-50 border border-stone-200 focus:bg-white focus:border-stone-400 outline-none transition-all text-sm" />
 </div>

 <div className="space-y-1.5 mb-8">
 <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Message</label>
 <textarea name="message" value={formData.message} onChange={handleChange} rows="5" required
 className="w-full px-4 py-3 bg-stone-50 border border-stone-200 focus:bg-white focus:border-stone-400 outline-none transition-all text-sm resize-none" />
 </div>

 <button type="submit" disabled={isLoading}
 className="w-full bg-stone-900 text-white text-xs font-bold uppercase tracking-widest py-4 hover:bg-stone-700 transition-all flex items-center justify-center gap-2">
 {isLoading ? <Loader2 className="animate-spin" size={14} /> : <>Send Message <Send size={12} /></>}
 </button>
 </form>
 );
};

export default EmailContactForm;