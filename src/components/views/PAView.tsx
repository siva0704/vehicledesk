import React, { useState } from 'react';
import { useVehicleDesk } from '../../context/VehicleDeskContext';
import { VehicleClass } from '../../types';
import {
  ShieldAlert,
  CheckCircle,
  MapPin,
  Clock,
  Car,
  ExternalLink,
  Lock,
  Calendar,
  AlertTriangle,
} from 'lucide-react';

export const PAView: React.FC = () => {
  const { currentUser, requests, createBooking, t } = useVehicleDesk();

  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');
  const [pickup, setPickup] = useState('Legislators Home Gate');
  const [drop, setDrop] = useState('Vidhana Soudha');
  const [preferredClass, setPreferredClass] = useState<VehicleClass>('Class A');
  const [dateTime, setDateTime] = useState('2026-10-29T10:30');
  const [urgency, setUrgency] = useState<'Routine' | 'Urgent' | 'VVIP Assembly Protocol'>(
    'VVIP Assembly Protocol'
  );
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  // Intentional test trigger to prove self-booking is blocked!
  const [trySelfBooking, setTrySelfBooking] = useState(false);

  if (!currentUser) return null;

  const linkedMlaId = currentUser.linkedMlaId || 'MLA-001';

  // PA sees only trips they created or linked to their MLA
  const myCreatedRequests = requests.filter(
    (r) => r.beneficiaryMlaId === linkedMlaId || r.requestedByUserId === currentUser.id
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    // If the user checked "Try self booking (test hard block)"
    const targetBeneficiary = trySelfBooking ? currentUser.id : linkedMlaId;

    const res = createBooking({
      beneficiaryMlaId: targetBeneficiary,
      pickupLocation: pickup,
      dropLocation: drop,
      scheduledTime: new Date(dateTime).toISOString(),
      preferredClass,
      urgency,
      channel: 'App',
    });

    if (res.success) {
      setStatusMsg({
        type: 'success',
        text: `Request submitted successfully on behalf of ${linkedMlaId}.`,
      });
      setTimeout(() => {
        setActiveTab('history');
      }, 1000);
    } else {
      setStatusMsg({
        type: 'error',
        text: res.message,
      });
    }
  };

  return (
    <div className="max-w-md md:max-w-xl mx-auto space-y-4">
      {/* Official Purple Header matching PDF Page 5 Wireframe */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-800 text-white rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-xs font-bold font-mono">
                {currentUser.id}
              </span>
              <span className="text-xs uppercase tracking-wider font-semibold text-purple-200">
                Booking Access
              </span>
            </div>
            <h2 className="text-lg font-bold mt-1">
              {currentUser.name} (for {linkedMlaId})
            </h2>
            <p className="text-xs text-purple-100">
              Authorized Personal Assistant · Linked strictly to {linkedMlaId}
            </p>
          </div>

          <div className="flex items-center gap-1 bg-purple-900/40 p-1 rounded-lg text-xs">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-3 py-1 rounded-md font-semibold cursor-pointer ${
                activeTab === 'create' ? 'bg-white text-purple-900 shadow-xs' : 'text-purple-200'
              }`}
            >
              New Request
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1 rounded-md font-semibold cursor-pointer ${
                activeTab === 'history' ? 'bg-white text-purple-900 shadow-xs' : 'text-purple-200'
              }`}
            >
              Status ({myCreatedRequests.length})
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'create' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="text-center mb-5">
            <h3 className="font-bold text-slate-900 text-base">
              New Request (on behalf of {linkedMlaId})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Protocol rule: All allocations are booked in the name of the MLA.
            </p>
          </div>

          {statusMsg && (
            <div
              className={`mb-4 p-3 rounded-xl text-xs flex items-start gap-2.5 ${
                statusMsg.type === 'success'
                  ? 'bg-emerald-50 border border-emerald-300 text-emerald-900'
                  : 'bg-rose-50 border border-rose-300 text-rose-900'
              }`}
            >
              {statusMsg.type === 'success' ? (
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div>
                <strong className="font-bold">
                  {statusMsg.type === 'success' ? 'Success' : 'Security Block Triggered:'}
                </strong>
                <p className="mt-0.5">{statusMsg.text}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Beneficiary Field - Read Only Locked */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Beneficiary (Fixed by Protocol)
                </label>
                <span className="text-[10px] text-purple-700 font-bold flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Locked to Linked MLA
                </span>
              </div>
              <input
                type="text"
                value={`Shri. R. Patil (${linkedMlaId})`}
                disabled
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-100 font-semibold text-slate-700 text-xs cursor-not-allowed"
              />
            </div>

            {/* Date & Time */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('dateTime')}
              </label>
              <input
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs font-mono text-slate-800 bg-slate-50/50 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            {/* Pickup */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('pickup')}
              </label>
              <input
                type="text"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                placeholder="Legislators Home Gate"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-800 bg-slate-50/50 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            {/* Drop */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('drop')}
              </label>
              <input
                type="text"
                value={drop}
                onChange={(e) => setDrop(e.target.value)}
                placeholder="Vidhana Soudha"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-800 bg-slate-50/50 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            {/* Preferred Class */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('preferredClass')}
                </label>
                <select
                  value={preferredClass}
                  onChange={(e) => setPreferredClass(e.target.value as VehicleClass)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs bg-slate-50/50 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-purple-500 font-medium"
                >
                  <option value="Class A">Class A (Innova / Fortuner)</option>
                  <option value="Class B">Class B (Ertiga / Bolero)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Urgency Level
                </label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs bg-slate-50/50 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-purple-500 font-medium"
                >
                  <option value="VVIP Assembly Protocol">VVIP Protocol</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Routine">Routine</option>
                </select>
              </div>
            </div>

            {/* Test Hard Block Toggle for Verification / QA */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={trySelfBooking}
                  onChange={(e) => setTrySelfBooking(e.target.checked)}
                  className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
                />
                <span className="text-xs font-semibold text-amber-900">
                  QA Test: Attempt booking for self ({currentUser.id})
                </span>
              </label>
              <p className="text-[11px] text-amber-700 mt-1 pl-6">
                When checked, submission will verify that the system blocks self-booking with 403 Forbidden.
              </p>
            </div>

            {/* Submit Button matching PDF Page 5 */}
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm transition shadow-md shadow-purple-600/20 cursor-pointer"
            >
              {t('submitRequest')}
            </button>

            {/* Mandatory Note matching PDF Page 5 */}
            <p className="text-[11px] text-slate-400 text-center italic mt-2">
              {t('paBookingNotice')}
            </p>
          </form>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-slate-900 text-sm">
              Requests Created for {linkedMlaId}
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Total: {myCreatedRequests.length}
            </span>
          </div>

          {myCreatedRequests.map((req) => (
            <div
              key={req.id}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-purple-700">{req.id}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                  {req.status}
                </span>
              </div>

              <div className="text-xs text-slate-700 space-y-0.5">
                <p>
                  <strong>Route:</strong> {req.pickupLocation} &rarr; {req.dropLocation}
                </p>
                <p className="text-[11px] text-slate-500">
                  Class: {req.preferredClass} · Urgency: {req.urgency}
                </p>
              </div>

              {req.liveGpsShareUrl && (
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Driver Live GPS Active
                  </span>
                  <a
                    href={req.liveGpsShareUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>View Map</span>
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
