import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const TicketContactForm = ({ onSubmit, initialData, user, title, subtitle }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState(initialData?.subject || '');
  const [message, setMessage] = useState(initialData?.message || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync user info if logged in, or sync initial configuration data
  useEffect(() => {
    if (user) {
      setName(`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Customer');
      setEmail(user.email || '');
    }
  }, [user]);

  useEffect(() => {
    if (initialData?.subject) setSubject(initialData.subject);
    if (initialData?.message) setMessage(initialData.message);
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Field completeness safety guards
    if (!name.trim() || !email.trim()) {
      toast.error('Please provide your name and email address.');
      return;
    }
    if (!subject.trim() || !message.trim()) {
      toast.error('Please provide both a subject and a message.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Pass guest details along with the ticket body
      await onSubmit({ name, email, subject, message });
      toast.success('Support ticket created successfully!');
      
      if (!initialData) {
        setSubject('');
        setMessage('');
        // Only clear name/email if submission was a guest action
        if (!user) {
          setName('');
          setEmail('');
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message || 'Failed to create ticket.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h3 className="text-2xl font-semibold mb-2">{title}</h3>
        <p className="text-sm text-stone-500">{subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.1em] text-stone-500 mb-1">Name *</label>
            <input 
              type="text" 
              required
              value={name} 
              onChange={(e) => setName(e.target.value)}
              disabled={!!user} 
              placeholder="Your full name"
              className={`w-full border px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors ${
                user 
                  ? 'border-stone-200 bg-stone-50 text-stone-500 cursor-not-allowed' 
                  : 'border-stone-300 bg-white text-stone-900'
              }`} 
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.1em] text-stone-500 mb-1">Email *</label>
            <input 
              type="email" 
              required
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              disabled={!!user} 
              placeholder="your.email@example.com"
              className={`w-full border px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors ${
                user 
                  ? 'border-stone-200 bg-stone-50 text-stone-500 cursor-not-allowed' 
                  : 'border-stone-300 bg-white text-stone-900'
              }`} 
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-[0.1em] text-stone-500 mb-1">Subject *</label>
          <input
            type="text"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="What do you need help with?"
            className="w-full border border-stone-300 bg-white px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-[0.1em] text-stone-500 mb-1">Message *</label>
          <textarea
            required
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Please describe your issue in detail..."
            className="w-full border border-stone-300 bg-white px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black text-white px-5 py-4 text-xs font-bold uppercase tracking-[0.1em] hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Creating Ticket...' : 'Submit Support Ticket'}
        </button>
      </form>
    </div>
  );
};

export default TicketContactForm;