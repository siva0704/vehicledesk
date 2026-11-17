import React, { useState } from 'react';
import { useVehicleDesk } from '../context/VehicleDeskContext';
import { Phone, KeyRound, X, CheckCircle, ShieldAlert } from 'lucide-react';

interface PhoneOTPModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PhoneOTPModal: React.FC<PhoneOTPModalProps> = ({ isOpen, onClose }) => {
  const { loginWithPhone, loginUser, t } = useVehicleDesk();
  const [phoneNumber, setPhoneNumber] = useState('+91 98765 43210');
  const [otp, setOtp] = useState('123456');
  const [otpSent, setOtpSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      setErrorMsg('Please enter a valid phone number');
      return;
    }
    setErrorMsg('');
    setOtpSent(true);
    setSuccessMsg('Demo OTP 123456 generated for Karnataka Fleet Auth.');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const res = loginWithPhone(phoneNumber, otp);
    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        onClose();
        setOtpSent(false);
        setSuccessMsg('');
      }, 700);
    } else {
      setErrorMsg(res.message);
    }
  };

  const selectExampleUser = (id: string, phone: string) => {
    loginUser(id);
    setPhoneNumber(phone);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        {/* Header styling matching Mobile PDF wireframe */}
        <div className="bg-slate-900 text-white p-6 relative text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 rounded-xl bg-blue-600/30 border border-blue-400/40 text-blue-400 flex items-center justify-center mx-auto mb-3">
            <Phone className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">Vehicle Desk</h2>
          <p className="text-sm text-slate-300 mt-1">{t('loginWithPhone')}</p>
        </div>

        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Mobile Number (Registered with Desk)
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-mono text-slate-800 bg-slate-50/50"
                    required
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  All 4 roles authenticate via verified phone + SMS OTP.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition shadow-md shadow-blue-500/20 cursor-pointer"
              >
                {t('sendOtp')}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Enter Verification OTP
                  </label>
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="text-[11px] text-blue-600 hover:underline"
                  >
                    Change Phone
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    maxLength={6}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center tracking-widest text-lg font-mono font-bold text-slate-800 bg-slate-50/50"
                    required
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1 text-center">
                  Use demo code: <span className="font-mono font-bold text-slate-700">123456</span>
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition shadow-md shadow-emerald-500/20 cursor-pointer"
              >
                {t('verifyOtp')}
              </button>
            </form>
          )}

          {/* Example Users Section from PDF Wireframe (Page 3) */}
          <div className="mt-6 pt-5 border-t border-slate-200">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center mb-3">
              {t('exampleUsers')}
            </p>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => selectExampleUser('MLA-001', '+91 98765 43210')}
                className="w-full py-2 px-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-left flex items-center justify-between text-xs transition cursor-pointer"
              >
                <span className="font-bold text-slate-800">MLA-001</span>
                <span className="text-blue-600 font-semibold flex items-center gap-1">
                  Full View &rarr;
                </span>
              </button>

              <button
                type="button"
                onClick={() => selectExampleUser('PA-A1', '+91 98450 11223')}
                className="w-full py-2 px-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-purple-50 hover:border-purple-300 text-left flex items-center justify-between text-xs transition cursor-pointer"
              >
                <span className="font-bold text-slate-800">PA-A1</span>
                <span className="text-purple-600 font-semibold flex items-center gap-1">
                  Booking &rarr;
                </span>
              </button>

              <button
                type="button"
                onClick={() => selectExampleUser('Driver-D12', '+91 94480 99887')}
                className="w-full py-2 px-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-left flex items-center justify-between text-xs transition cursor-pointer"
              >
                <span className="font-bold text-slate-800">Driver-D12</span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  Status &rarr;
                </span>
              </button>

              <button
                type="button"
                onClick={() => selectExampleUser('Admin-AD01', '+91 80220 34000')}
                className="w-full py-2 px-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 text-left flex items-center justify-between text-xs transition cursor-pointer"
              >
                <span className="font-bold text-slate-800">Admin-AD01</span>
                <span className="text-amber-600 font-semibold flex items-center gap-1">
                  Control &rarr;
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
