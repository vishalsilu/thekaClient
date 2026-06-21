import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const TicketContactForm = ({ onSubmit, initialData, user, title, subtitle }) => {
  const [subject, setSubject] = useState(initialData?.subject || '');
  const [message, setMessage] = useState(initialData?.message || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData?.subject) setSubject(initialData.subject);
    if (initialData?.message) setMessage(initialData.message);
  }, [initialData]);

  // If the user is not logged in, they cannot create a trackable ticket
  if (!user) {
    return (
      <div className="w-full border border-stone-200 bg-stone-50 p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
        <span className="text-4xl mb-4 opacity-50">🎫</span>
        <h3 className="text-xl font-bold mb-2">Login Required</h3>
        <p className="text-sm text-stone-500 mb-6 max-w-sm">
          To create and track support tickets, you need an account. Please log in or use the WhatsApp option above.
        </p>
        <Link 
          to="/login" 
          className="bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-[0.1em] hover:bg-stone-800 transition-colors"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      toast.error('Please provide both a subject and a message.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ subject, message });
      toast.success('Support ticket created successfully!');
      if (!initialData) {
        setSubject('');
        setMessage('');
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
            <label className="block text-[10px] font-bold uppercase tracking-[0.1em] text-stone-500 mb-1">Name</label>
            <input 
              type="text" 
              value={`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Customer'} 
              disabled 
              className="w-full border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-500 cursor-not-allowed" 
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.1em] text-stone-500 mb-1">Email</label>
            <input 
              type="email" 
              value={user.email} 
              disabled 
              className="w-full border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-500 cursor-not-allowed" 
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