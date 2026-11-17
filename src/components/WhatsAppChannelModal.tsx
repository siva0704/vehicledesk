import React, { useState } from 'react';
import { useVehicleDesk } from '../context/VehicleDeskContext';
import { MessageSquare, Send, X, CheckCheck, Bot, User as UserIcon, Sparkles } from 'lucide-react';

interface WhatsAppChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppChannelModal: React.FC<WhatsAppChannelModalProps> = ({ isOpen, onClose }) => {
  const { users, sendWhatsAppBookingMessage } = useVehicleDesk();
  const [selectedPhone, setSelectedPhone] = useState('+91 98765 43210'); // Default MLA-001
  const [messageText, setMessageText] = useState('Need Class A vehicle from Legislators Home Gate to Vidhana Soudha at 10:30 AM for assembly session');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'system'; text: string; time: string }>>([
    {
      sender: 'system',
      text: 'Karnataka Secretariat Official Vehicle Desk WhatsApp Automated Bot. Send vehicle request with pickup, drop, time, and class preference.',
      time: '09:00 AM',
    },
  ]);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { sender: 'user' as const, text: messageText, time: userTime };

    const result = sendWhatsAppBookingMessage(selectedPhone, messageText);
    const systemTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const systemMsg = { sender: 'system' as const, text: result.reply, time: systemTime };

    setMessages((prev) => [...prev, userMsg, systemMsg]);
    setMessageText('');
  };

  const currentSelectedUser = users.find(
    (u) => u.phone.replace(/\D/g, '') === selectedPhone.replace(/\D/g, '')
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col h-[600px] border border-slate-200">
        {/* WhatsApp Header */}
        <div className="bg-emerald-700 text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm">Karnataka Vehicle Desk Official</h3>
                <span className="text-[10px] bg-emerald-800 text-emerald-200 px-1.5 py-0.5 rounded font-mono">
                  +91 80 2203 4000
                </span>
              </div>
              <p className="text-xs text-emerald-100 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                Official Automated WhatsApp Ingestion Channel
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-emerald-800 text-emerald-100 hover:text-white transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sender Identity Selector */}
        <div className="bg-emerald-50/70 border-b border-emerald-100 p-2.5 px-4 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-semibold text-emerald-900 flex items-center gap-1">
              <UserIcon className="w-3.5 h-3.5 text-emerald-700" />
              Simulate Sender Number:
            </span>
            <select
              value={selectedPhone}
              onChange={(e) => setSelectedPhone(e.target.value)}
              className="px-2 py-1 bg-white border border-emerald-300 rounded-md text-xs font-mono font-medium text-slate-800 focus:outline-hidden"
            >
              <option value="+91 98765 43210">Shri. R. Patil (MLA-001) · +91 98765 43210</option>
              <option value="+91 98450 11223">Ramesh K. (PA-A1 for MLA-001) · +91 98450 11223</option>
              <option value="+91 98450 44556">Suresh M. (PA-A2 for MLA-001) · +91 98450 44556</option>
              <option value="+91 98440 23456">Smt. Sumalatha K. (MLA-002) · +91 98440 23456</option>
              <option value="+91 99999 00000">Unregistered Stranger Number · +91 99999 00000</option>
            </select>
          </div>
          {currentSelectedUser && (
            <p className="text-[11px] text-emerald-800 mt-1">
              Detected: <strong className="font-semibold">{currentSelectedUser.name}</strong> ({currentSelectedUser.role})
              {currentSelectedUser.role === 'PA' && (
                <span className="text-purple-700 ml-1 font-semibold">
                  &rarr; Auto-binds to {currentSelectedUser.linkedMlaId}
                </span>
              )}
            </p>
          )}
        </div>

        {/* Chat message timeline */}
        <div className="flex-1 p-4 overflow-y-auto bg-slate-100/70 space-y-3">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs shadow-xs ${
                  m.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-xs'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                }`}
              >
                <p className="whitespace-pre-line leading-relaxed">{m.text}</p>
                <div
                  className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                    m.sender === 'user' ? 'text-emerald-200' : 'text-slate-400'
                  }`}
                >
                  <span>{m.time}</span>
                  {m.sender === 'user' && <CheckCheck className="w-3 h-3 text-emerald-200" />}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Sample Prompts */}
        <div className="bg-slate-50 border-t border-slate-200 p-2 flex gap-1.5 overflow-x-auto text-[11px]">
          <button
            type="button"
            onClick={() =>
              setMessageText(
                'Need Innova Hycross from Legislators Home Gate to Vidhana Soudha today at 10:30 AM Class A'
              )
            }
            className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded border border-slate-200 shrink-0 font-medium cursor-pointer"
          >
            + Sample: LH to Vidhana Soudha (Class A)
          </button>
          <button
            type="button"
            onClick={() =>
              setMessageText(
                'Pickup from Kumara Krupa Guest House to Vikasa Soudha Class B Ertiga urgent'
              )
            }
            className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded border border-slate-200 shrink-0 font-medium cursor-pointer"
          >
            + Sample: Kumara Krupa (Class B)
          </button>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex gap-2">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type WhatsApp message to official desk..."
            className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
