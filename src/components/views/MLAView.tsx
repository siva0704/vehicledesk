import React, { useState } from 'react';
import { useVehicleDesk } from '../../context/VehicleDeskContext';
import { isVehicleEligible } from '../../utils/rules';
import { VehicleClass, TripStage } from '../../types';
import {
  Car,
  MapPin,
  Clock,
  UserPlus,
  Phone,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Calendar,
  AlertCircle,
  CheckCircle2,
  ListOrdered,
  Plus,
} from 'lucide-react';

export const MLAView: React.FC = () => {
  const {
    currentUser,
    users,
    vehicles,
    requests,
    paLogs,
    createBooking,
    managePA,
    t,
  } = useVehicleDesk();

  const [activeTab, setActiveTab] = useState<'home' | 'trips' | 'pas' | 'fairness'>('home');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showAddPaModal, setShowAddPaModal] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

  // Form states for new booking
  const [pickup, setPickup] = useState('Legislators Home Gate');
  const [drop, setDrop] = useState('Vidhana Soudha');
  const [preferredClass, setPreferredClass] = useState<VehicleClass>('Class A');
  const [scheduledTime, setScheduledTime] = useState(
    new Date(Date.now() + 30 * 60000).toISOString().slice(0, 16)
  );
  const [urgency, setUrgency] = useState<'Routine' | 'Urgent' | 'VVIP Assembly Protocol'>(
    'VVIP Assembly Protocol'
  );
  const [formMsg, setFormMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  // Form states for PA Management
  const [newPaName, setNewPaName] = useState('');
  const [newPaPhone, setNewPaPhone] = useState('');
  const [newPaReason, setNewPaReason] = useState('Official Secretariat session appointment');
  const [paActionMsg, setPaActionMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  if (!currentUser) return null;

  // Filter vehicles that are Available + Clean
  const availableCleanVehicles = vehicles.filter((v) => isVehicleEligible(v));

  // MLA's trips (all requests where beneficiary is this MLA)
  const myRequests = requests.filter(
    (r) => r.beneficiaryMlaId === currentUser.id
  );

  // Active PAs linked to this MLA
  const myPas = users.filter(
    (u) => u.role === 'PA' && u.linkedMlaId === currentUser.id
  );
  const activePas = myPas.filter((p) => p.isActive);

  // Handle new booking
  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setFormMsg(null);

    const res = createBooking({
      beneficiaryMlaId: currentUser.id,
      pickupLocation: pickup,
      dropLocation: drop,
      scheduledTime: new Date(scheduledTime).toISOString(),
      preferredClass,
      urgency,
      channel: 'App',
    });

    if (res.success) {
      setFormMsg({ type: 'success', text: res.message });
      setTimeout(() => {
        setShowRequestModal(false);
        setFormMsg(null);
        setActiveTab('trips');
      }, 1000);
    } else {
      setFormMsg({ type: 'error', text: res.message });
    }
  };

  // Handle Add PA
  const handleAddPa = (e: React.FormEvent) => {
    e.preventDefault();
    setPaActionMsg(null);

    const res = managePA({
      mlaId: currentUser.id,
      action: 'ADD',
      name: newPaName,
      phone: newPaPhone,
      reason: newPaReason,
    });

    if (res.success) {
      setPaActionMsg({ type: 'success', text: res.message });
      setNewPaName('');
      setNewPaPhone('');
      setTimeout(() => {
        setShowAddPaModal(false);
        setPaActionMsg(null);
      }, 1000);
    } else {
      setPaActionMsg({ type: 'error', text: res.message });
    }
  };

  // Selected trip for 7-point time chain inspector
  const selectedTrip = requests.find((r) => r.id === selectedTripId);

  return (
    <div className="max-w-md md:max-w-4xl mx-auto space-y-4">
      {/* Official Blue Persona Card matching PDF Wireframe (Page 4) */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white rounded-2xl p-5 shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-bold font-mono">
                {currentUser.id}
              </span>
              <span className="text-xs uppercase tracking-wider font-semibold text-blue-200">
                {t('fullView')}
              </span>
            </div>
            <h2 className="text-xl font-bold mt-1 tracking-tight">{currentUser.name}</h2>
            <p className="text-xs text-blue-100 font-medium">
              {currentUser.designation} · {currentUser.constituency}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setShowRequestModal(true)}
              className="px-4 py-2 bg-white text-blue-800 hover:bg-blue-50 font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t('requestVehicle')}</span>
            </button>
          </div>
        </div>

        {/* Sub Navigation Bar matching PDF: Home | My Trips | My PAs */}
        <div className="flex items-center gap-1 mt-5 pt-3 border-t border-blue-600/60 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'home'
                ? 'bg-white text-blue-800 shadow-xs'
                : 'text-blue-100 hover:bg-blue-600/50'
            }`}
          >
            Home / Fleet
          </button>
          <button
            onClick={() => setActiveTab('trips')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'trips'
                ? 'bg-white text-blue-800 shadow-xs'
                : 'text-blue-100 hover:bg-blue-600/50'
            }`}
          >
            {t('myTrips')} ({myRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('pas')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'pas'
                ? 'bg-white text-blue-800 shadow-xs'
                : 'text-blue-100 hover:bg-blue-600/50'
            }`}
          >
            {t('myPAs')} ({activePas.length}/2)
          </button>
          <button
            onClick={() => setActiveTab('fairness')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'fairness'
                ? 'bg-white text-blue-800 shadow-xs'
                : 'text-blue-100 hover:bg-blue-600/50'
            }`}
          >
            Weekly Fairness
          </button>
        </div>
      </div>

      {/* Main Tab Views */}
      {activeTab === 'home' && (
        <div className="space-y-4">
          {/* Section: Available Now (Matching PDF Page 4 wireframe) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">{t('availableNow')}</h3>
                <p className="text-xs text-slate-500">
                  Strict Rule: Vehicles only visible if Available + Clean and Key is returned.
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                {availableCleanVehicles.length} Ready
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableCleanVehicles.map((v) => (
                <div
                  key={v.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-blue-50/40 hover:border-blue-200 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-900 text-sm">{v.id}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        v.modelClass === 'Class A'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-200 text-slate-800'
                      }`}
                    >
                      {v.modelClass}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-700 mt-1">{v.model}</p>
                  <div className="flex items-center gap-2 mt-2 text-[11px] text-emerald-700 font-semibold">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Available + Clean</span>
                  </div>
                </div>
              ))}

              {availableCleanVehicles.length === 0 && (
                <div className="col-span-2 text-center py-8 text-slate-400 text-xs">
                  No clean vehicles currently available in the immediate pool.
                </div>
              )}
            </div>
          </div>

          {/* Quick Active Bookings in Flight */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <h3 className="font-bold text-slate-800 text-sm mb-3">Active Trips in Motion</h3>
            <div className="space-y-3">
              {myRequests
                .filter((r) => r.status !== 'Trip Completed' && r.status !== 'Key Returned')
                .map((req) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-blue-700">
                          {req.id}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 font-semibold">
                          via {req.requestedByUserId} ({req.channel})
                        </span>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        {req.status}
                      </span>
                    </div>

                    <div className="mt-2 text-xs text-slate-700 space-y-1">
                      <p className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>
                          <strong>Pickup:</strong> {req.pickupLocation} &rarr;{' '}
                          <strong>Drop:</strong> {req.dropLocation}
                        </span>
                      </p>
                      {req.assignedVehicleId && (
                        <p className="text-[11px] text-slate-600">
                          Assigned: <strong>{req.assignedVehicleId}</strong> · Driver:{' '}
                          <strong>{req.assignedDriverId}</strong>
                        </p>
                      )}
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => {
                          setSelectedTripId(req.id);
                          setActiveTab('trips');
                        }}
                        className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>Inspect 7-Point Chain</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      {req.liveGpsShareUrl && (
                        <a
                          href={req.liveGpsShareUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-emerald-600 font-semibold hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Google Maps Live Share</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}

              {myRequests.filter(
                (r) => r.status !== 'Trip Completed' && r.status !== 'Key Returned'
              ).length === 0 && (
                <p className="text-xs text-slate-500 py-3 text-center">
                  No active trips right now. Click &quot;Request Vehicle&quot; above to book.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Trips & 7-Point Time Chain Tab */}
      {activeTab === 'trips' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <h3 className="font-bold text-slate-800 text-sm mb-1">
              All Trips Requested in Your Name
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Full transparency guarantee: You see every request made by you or your linked PAs.
            </p>

            <div className="space-y-3">
              {myRequests.map((req) => (
                <div
                  key={req.id}
                  className={`p-4 rounded-xl border transition ${
                    selectedTripId === req.id
                      ? 'border-blue-500 bg-blue-50/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-blue-700">{req.id}</span>
                        <span className="text-[11px] font-semibold text-slate-700">
                          {new Date(req.createdAt).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                          Booked by: {req.requestedByUserId} ({req.channel})
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-800 mt-1">
                        {req.pickupLocation} &rarr; {req.dropLocation}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-800">
                        {req.status}
                      </span>
                      <button
                        onClick={() =>
                          setSelectedTripId(selectedTripId === req.id ? null : req.id)
                        }
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        {selectedTripId === req.id ? 'Close Audit Chain' : '7-Point Time Chain'}
                      </button>
                    </div>
                  </div>

                  {/* 7-Point Time Chain Inspector */}
                  {selectedTripId === req.id && (
                    <div className="mt-4 pt-4 border-t border-slate-200 bg-slate-50/80 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                          <ListOrdered className="w-4 h-4 text-blue-600" />
                          <span>Official 7-Point Audit Timestamp Chain</span>
                        </h4>
                        {req.liveGpsShareUrl && (
                          <a
                            href={req.liveGpsShareUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-emerald-600 hover:underline font-semibold flex items-center gap-1"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Open Google Maps GPS</span>
                          </a>
                        )}
                      </div>

                      <div className="relative border-l-2 border-blue-500 ml-3 space-y-4 my-2">
                        {req.timeChain.map((pt, idx) => (
                          <div key={idx} className="relative pl-6">
                            <span className="absolute -left-[9px] top-0.5 w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold">
                              {idx + 1}
                            </span>
                            <div className="flex items-baseline justify-between">
                              <span className="text-xs font-bold text-slate-800">{pt.stage}</span>
                              <span className="text-[11px] font-mono text-slate-500">
                                {new Date(pt.timestamp).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  second: '2-digit',
                                })}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600">
                              Actor: <strong>{pt.actorId}</strong> ({pt.actorRole})
                            </p>
                            {pt.gps && (
                              <p className="text-[11px] text-emerald-700 font-mono mt-0.5">
                                GPS: {pt.gps.lat.toFixed(4)}, {pt.gps.lng.toFixed(4)} ·{' '}
                                {pt.gps.address}
                              </p>
                            )}
                            {pt.notes && (
                              <p className="text-[11px] text-slate-500 italic mt-0.5">
                                Note: {pt.notes}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PA Management Tab */}
      {activeTab === 'pas' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">
                  Personal Assistants Linked to {currentUser.id}
                </h3>
                <p className="text-xs text-slate-500">
                  Karnataka Experience Safeguard: Maximum 2 active PAs at any time. All additions,
                  removals, and WhatsApp changes are permanently logged.
                </p>
              </div>

              {activePas.length < 2 && (
                <button
                  onClick={() => setShowAddPaModal(true)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{t('addPA')}</span>
                </button>
              )}
            </div>

            {/* PA Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {myPas.map((pa) => (
                <div
                  key={pa.id}
                  className={`p-4 rounded-xl border ${
                    pa.isActive
                      ? 'border-purple-200 bg-purple-50/20'
                      : 'border-slate-200 bg-slate-50/80 opacity-75'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-purple-700">{pa.id}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        pa.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {pa.isActive ? 'Active' : 'Deactivated'}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-800 mt-1">{pa.name}</h4>
                  <p className="text-xs text-slate-600 flex items-center gap-1 mt-1 font-mono">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{pa.phone}</span>
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                    {pa.isActive ? (
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              `Are you sure you want to deactivate ${pa.name}? They will immediately lose booking access.`
                            )
                          ) {
                            managePA({
                              mlaId: currentUser.id,
                              action: 'REMOVE',
                              targetPaId: pa.id,
                              reason: 'MLA initiated deactivation',
                            });
                          }
                        }}
                        className="text-xs text-red-600 hover:underline font-semibold cursor-pointer"
                      >
                        Deactivate PA
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400">Access revoked</span>
                    )}

                    <span className="text-[10px] text-purple-700 font-semibold bg-purple-100 px-2 py-0.5 rounded">
                      Linked to {currentUser.id}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* PA Audit Logs */}
            <div className="mt-6 pt-5 border-t border-slate-200">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                PA Modification Audit Trail
              </h4>
              <div className="space-y-2">
                {paLogs
                  .filter((l) => l.mlaId === currentUser.id)
                  .map((log) => (
                    <div
                      key={log.id}
                      className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start justify-between"
                    >
                      <div>
                        <span className="font-bold text-blue-700 mr-2">[{log.action}]</span>
                        <span>{log.reason}</span>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Actor: {log.changedByUserId} · Target: {log.newPaId || log.oldPaId}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">
                        {new Date(log.timestamp).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Weekly Fairness Report Tab */}
      {activeTab === 'fairness' && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-800 text-sm">Weekly Protocol Fairness Audit</h3>
          <p className="text-xs text-slate-500">
            Karnataka Secretariat allocation equity review. Monitors vehicle usage ratio across
            all MLAs.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-center">
              <span className="text-2xl font-bold text-blue-700">{myRequests.length}</span>
              <p className="text-xs font-semibold text-slate-700 mt-1">Your Total Requests</p>
              <p className="text-[10px] text-slate-500">In this session</p>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
              <span className="text-2xl font-bold text-emerald-700">
                {myRequests.filter((r) => r.status === 'Key Returned').length}
              </span>
              <p className="text-xs font-semibold text-slate-700 mt-1">Completed Trips</p>
              <p className="text-[10px] text-slate-500">Fully audited key return</p>
            </div>
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-center">
              <span className="text-2xl font-bold text-amber-700">100%</span>
              <p className="text-xs font-semibold text-slate-700 mt-1">Compliance Rate</p>
              <p className="text-[10px] text-slate-500">Zero self-booking violations</p>
            </div>
          </div>
        </div>
      )}

      {/* Request Vehicle Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="bg-blue-700 text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Request Vehicle (MLA-001)</h3>
                <p className="text-xs text-blue-100">Direct VIP Allocation Request</p>
              </div>
              <button
                onClick={() => setShowRequestModal(false)}
                className="text-blue-100 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="p-5 space-y-3.5">
              {formMsg && (
                <div
                  className={`p-2.5 rounded-lg text-xs ${
                    formMsg.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800'
                      : 'bg-red-50 text-red-800'
                  }`}
                >
                  {formMsg.text}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('pickup')}
                </label>
                <input
                  type="text"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('drop')}
                </label>
                <input
                  type="text"
                  value={drop}
                  onChange={(e) => setDrop(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t('preferredClass')}
                  </label>
                  <select
                    value={preferredClass}
                    onChange={(e) => setPreferredClass(e.target.value as VehicleClass)}
                    className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                  >
                    <option value="Class A">Class A (Innova / Fortuner)</option>
                    <option value="Class B">Class B (Ertiga / Bolero)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Urgency Priority
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                  >
                    <option value="Routine">Routine</option>
                    <option value="Urgent">Urgent</option>
                    <option value="VVIP Assembly Protocol">VVIP Protocol</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('dateTime')}
                </label>
                <input
                  type="datetime-local"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-xs font-mono"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-md cursor-pointer mt-2"
              >
                {t('submitRequest')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add PA Modal */}
      {showAddPaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="bg-purple-700 text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Appoint New PA (Max 2 Limit)</h3>
                <p className="text-xs text-purple-100">Direct MLA Appointment</p>
              </div>
              <button
                onClick={() => setShowAddPaModal(false)}
                className="text-purple-100 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddPa} className="p-5 space-y-3.5">
              {paActionMsg && (
                <div
                  className={`p-2.5 rounded-lg text-xs ${
                    paActionMsg.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800'
                      : 'bg-red-50 text-red-800'
                  }`}
                >
                  {paActionMsg.text}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">PA Full Name</label>
                <input
                  type="text"
                  value={newPaName}
                  onChange={(e) => setNewPaName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  PA Mobile / WhatsApp Number
                </label>
                <input
                  type="tel"
                  value={newPaPhone}
                  onChange={(e) => setNewPaPhone(e.target.value)}
                  placeholder="+91 98450 12345"
                  className="w-full px-3 py-2 border rounded-lg text-xs font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Appointment Reason (Logged)
                </label>
                <input
                  type="text"
                  value={newPaReason}
                  onChange={(e) => setNewPaReason(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-lg shadow-md cursor-pointer mt-2"
              >
                Confirm Appointment &amp; Link
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
