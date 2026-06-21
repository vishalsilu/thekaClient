import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../config/api';

const formatDateTime = (value) => {
  if (!value) return '-';
  return new Date(value).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const UserTicketsList = ({ user }) => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    if (user) {
      fetchTickets();
    }
  }, [user]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/support/user');
      if (data?.success) {
        setTickets(data.tickets || []);
      }
    } catch (err) {
      toast.error('Failed to load your tickets.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) {
      toast.error('Please enter a reply.');
      return;
    }

    setSendingReply(true);
    try {
      const { data } = await api.post(`/support/user/${selectedTicket.ticketId}/reply`, {
        message: replyText
      });
      
      if (data?.success) {
        // Update the selected ticket and the list in UI
        setSelectedTicket(data.ticket);
        setTickets(prev => prev.map(t => t.ticketId === data.ticket.ticketId ? data.ticket : t));
        setReplyText('');
        toast.success('Reply sent successfully.');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send reply.');
    } finally {
      setSendingReply(false);
    }
  };

  if (!user) {
    return (
      <div className="w-full border border-stone-200 bg-stone-50 p-8 text-center min-h-[300px] flex items-center justify-center">
        <p className="text-sm font-bold uppercase tracking-[0.1em] text-stone-500">Please log in to view your tickets.</p>
      </div>
    );
  }

  // --- DETAIL VIEW: Show Conversation History ---
  if (selectedTicket) {
    const isClosed = selectedTicket.status === 'closed' || selectedTicket.status === 'resolved';

    return (
      <div className="w-full border border-stone-200 bg-white flex flex-col h-[700px]">
        {/* Header */}
        <div className="border-b border-stone-200 p-5 bg-stone-50 flex items-center justify-between sticky top-0 z-10">
          <div>
            <button 
              onClick={() => setSelectedTicket(null)}
              className="text-xs font-bold uppercase tracking-[0.1em] text-stone-500 hover:text-black mb-3 inline-block transition-colors"
            >
              ← Back to Tickets
            </button>
            <h2 className="text-xl font-bold truncate max-w-md">{selectedTicket.subject}</h2>
            <p className="mt-1 text-xs uppercase tracking-[0.1em] text-stone-500">
              Ticket ID: {selectedTicket.ticketId.toUpperCase()} • {formatDateTime(selectedTicket.createdAt)}
            </p>
          </div>
          <dic className="flex items-center justify-center gap-4">
            <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] border ${
            isClosed ? 'border-stone-300 bg-stone-100 text-stone-500' : 'border-emerald-200 bg-emerald-50 text-emerald-700'
          }`}>
            {selectedTicket.status}
          </span>
           <button 
          onClick={fetchTickets}
          className="border border-stone-300 bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.1em] hover:bg-stone-50 transition-colors"
        >
          Refresh
        </button>
          </dic>
        </div>

        {/* Conversation Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-white">
          {/* Original Message */}
          <div className="p-4 border border-stone-200 bg-stone-50 mr-8">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.1em] text-stone-500 mb-2 border-b border-stone-200 pb-2">
              <span>You</span>
              <span>{formatDateTime(selectedTicket.createdAt)}</span>
            </div>
            <p className="text-sm leading-relaxed text-stone-800 whitespace-pre-wrap">{selectedTicket.message}</p>
          </div>

          {/* Replies */}
          {selectedTicket.replies?.map((reply, index) => {
            const isAdmin = reply.from === 'admin';
            return (
              <div 
                key={index} 
                className={`p-4 border ${isAdmin ? 'border-stone-300 bg-white ml-8' : 'border-stone-200 bg-stone-50 mr-8'}`}
              >
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.1em] text-stone-500 mb-2 border-b border-stone-100 pb-2">
                  <span className={isAdmin ? 'text-black' : ''}>{isAdmin ? 'Support Team' : 'You'}</span>
                  <span>{formatDateTime(reply.sentAt)}</span>
                </div>
                <p className="text-sm leading-relaxed text-stone-800 whitespace-pre-wrap">{reply.message}</p>
              </div>
            );
          })}
        </div>

        {/* Reply Box */}
        <div className="border-t border-stone-200 p-5 bg-stone-50 sticky bottom-0">
          {isClosed ? (
            <div className="text-center p-4 bg-stone-100 border border-stone-200 text-sm font-bold uppercase tracking-[0.1em] text-stone-500">
              This ticket is closed. Please open a new ticket for further assistance.
            </div>
          ) : (
            <form onSubmit={handleSendReply}>
              <textarea
                required
                rows={3}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full border border-stone-300 bg-white p-3 text-sm focus:outline-none focus:border-black transition-colors resize-none"
                placeholder="Type your reply here..."
              />
              <div className="mt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={sendingReply}
                  className="border border-black bg-black px-6 py-3 text-xs font-bold uppercase tracking-[0.1em] text-white hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                >
                  {sendingReply ? 'Sending...' : 'Send Reply'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  // --- LIST VIEW: Show all tickets ---
  return (
    <div className="w-full border border-stone-200 bg-white">
      <div className="border-b border-stone-200 p-5 bg-stone-50 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold mb-1">My Tickets</h3>
          <p className="text-sm text-stone-500">Track and manage your support requests.</p>
        </div>
        <button 
          onClick={fetchTickets}
          className="border border-stone-300 bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.1em] hover:bg-stone-50 transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        {loading ? (
          <div className="p-10 text-center text-xs font-bold uppercase tracking-[0.1em] text-stone-500">Loading tickets...</div>
        ) : tickets.length === 0 ? (
          <div className="p-10 text-center text-sm text-stone-500">You haven't opened any support tickets yet.</div>
        ) : (
          <table className="w-full border-collapse text-left">
            <thead className="bg-stone-50 sticky top-0 border-b border-stone-200">
              <tr className="text-[10px] font-bold uppercase tracking-[0.1em] text-stone-500">
                <th className="px-5 py-4 border-b border-stone-200">Ticket ID</th>
                <th className="px-5 py-4 border-b border-stone-200">Subject</th>
                <th className="px-5 py-4 border-b border-stone-200">Status</th>
                <th className="px-5 py-4 border-b border-stone-200 text-right">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr 
                  key={ticket.ticketId} 
                  onClick={() => setSelectedTicket(ticket)}
                  className="border-b border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors group"
                >
                  <td className="px-5 py-4 font-semibold text-sm">{ticket.ticketId.toUpperCase()}</td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-stone-900 truncate max-w-[200px] sm:max-w-[300px]">{ticket.subject}</p>
                    <p className="text-xs text-stone-500 mt-1">{ticket.replies?.length || 0} Replies</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-[0.1em] border ${
                      ticket.status === 'closed' || ticket.status === 'resolved' 
                        ? 'border-stone-200 bg-stone-100 text-stone-500' 
                        : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    }`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right text-xs text-stone-500 whitespace-nowrap group-hover:text-black transition-colors">
                    {formatDateTime(ticket.updatedAt || ticket.createdAt)}
                    <span className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserTicketsList;