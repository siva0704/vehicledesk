import React, { useState } from 'react';
import { useVehicleDesk } from '../../context/VehicleDeskContext';
import { isVehicleEligible } from '../../utils/rules';
import { VehicleStatus, VehicleCondition } from '../../types';
import {
  Car,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Layers,
  FileText,
  UserCheck,
  MapPin,
  Clock,
  Sparkles,
  Link,
  Ban,
  TrendingUp,
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const {
    currentUser,
    users,
    vehicles,
    requests,
    paLogs,
    overrideLogs,
    forceAssign,
    autoAssignPending,
    managePA,
    t,
  } = useVehicleDesk();

  const [activeTab, setActiveTab] = useState<'board' | 'links' | 'overrides' | 'fairness'>('board');
  const [showForceAssignModal, setShowForceAssignModal] = useState(false);

  // Force Assign modal form states
  const [targetReqId, setTargetReqId] = useState(
    requests.find((r) => r.status === 'Pending')?.id || requests[0]?.id || ''
  );
  const [targetVehicleId, setTargetVehicleId] = useState(vehicles[0]?.id || '');
  const [targetDriverId, setTargetDriverId] = useState('Driver-D12');
  const [overrideReason, setOverrideReason] = useState(
    'Special Assembly Session urgent requisition by Hon. Speaker'
  );
  const [actionMsg, setActionMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  if (!currentUser) return null;

  const pendingRequests = requests.filter((r) => r.status === 'Pending');
  const mlas = users.filter((u) => u.role === 'MLA');
  const pas = users.filter((u) => u.role === 'PA');
  const drivers = users.filter((u) => u.role === 'DRIVER');

  const handleForceAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActionMsg(null);

    const res = forceAssign(targetReqId, targetVehicleId, targetDriverId, overrideReason);
    if (res.success) {
      setActionMsg({ type: 'success', text: res.message });
      setTimeout(() => {
        setShowForceAssignModal(false);
        setActionMsg(null);
      }, 1000);
    } else {
      setActionMsg({ type: 'error', text: res.message });
    }
  };

  const handleRunAutoAssign = () => {
    const res = autoAssignPending();
    setActionMsg({
      type: res.assignedCount > 0 ? 'success' : 'error',
      text: res.message,
    });
  };

  return (
    <div className="max-w-md md:max-w-4xl mx-auto space-y-4">
      {/* Official Ochre / Amber Header matching PDF Page 7 Wireframe */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-bold font-mono">
                {currentUser.id}
              </span>
              <span className="text-xs uppercase tracking-wider font-semibold text-amber-100">
                {t('adminControl')}
              </span>
            </div>
            <h2 className="text-lg font-bold mt-1 tracking-tight">{currentUser.name}</h2>
            <p className="text-xs text-amber-100">{currentUser.designation}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunAutoAssign}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-amber-300 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition cursor-pointer"
              title="Run Hardcoded Priority Rule Engine"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Rule Engine</span>
            </button>
            <button
              onClick={() => setShowForceAssignModal(true)}
              className="px-3.5 py-2 bg-white text-amber-800 hover:bg-amber-50 rounded-xl text-xs font-bold shadow-md transition cursor-pointer"
            >
              {t('forceAssign')}
            </button>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex items-center gap-1 mt-5 pt-3 border-t border-amber-500/60 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('board')}
            className={`px-3 py-1.5 rounded-lg transition shrink-0 cursor-pointer ${
              activeTab === 'board'
                ? 'bg-white text-amber-900 shadow-xs'
                : 'text-amber-100 hover:bg-amber-500/50'
            }`}
          >
            {t('liveBoard')} ({pendingRequests.length} pending)
          </button>
          <button
            onClick={() => setActiveTab('links')}
            className={`px-3 py-1.5 rounded-lg transition shrink-0 cursor-pointer ${
              activeTab === 'links'
                ? 'bg-white text-amber-900 shadow-xs'
                : 'text-amber-100 hover:bg-amber-500/50'
            }`}
          >
            MLA &harr; PA Linking
          </button>
          <button
            onClick={() => setActiveTab('overrides')}
            className={`px-3 py-1.5 rounded-lg transition shrink-0 cursor-pointer ${
              activeTab === 'overrides'
                ? 'bg-white text-amber-900 shadow-xs'
                : 'text-amber-100 hover:bg-amber-500/50'
            }`}
          >
            Override Audit ({overrideLogs.length})
          </button>
          <button
            onClick={() => setActiveTab('fairness')}
            className={`px-3 py-1.5 rounded-lg transition shrink-0 cursor-pointer ${
              activeTab === 'fairness'
                ? 'bg-white text-amber-900 shadow-xs'
                : 'text-amber-100 hover:bg-amber-500/50'
            }`}
          >
            {t('weeklyFairness')}
          </button>
        </div>
      </div>

      {actionMsg && (
        <div
          className={`p-3 rounded-xl text-xs flex items-center justify-between ${
            actionMsg.type === 'success'
              ? 'bg-emerald-50 border border-emerald-300 text-emerald-900'
              : 'bg-red-50 border border-red-300 text-red-900'
          }`}
        >
          <span>{actionMsg.text}</span>
          <button
            onClick={() => setActionMsg(null)}
            className="text-xs font-bold ml-2 text-slate-500"
          >
            ✕
          </button>
        </div>
      )}

      {/* Live Board View matching PDF Page 7 */}
      {activeTab === 'board' && (
        <div className="space-y-4">
          {/* Section: Pending Requests matching wireframe */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">{t('pendingRequests')}</h3>
              <span className="text-xs font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                {pendingRequests.length} Waiting
              </span>
            </div>

            <div className="space-y-2.5">
              {pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 hover:bg-amber-50/60 transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-xs">
                        {req.beneficiaryMlaId} via {req.requestedByUserId}
                      </span>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        {new Date(req.scheduledTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        | {req.pickupLocation} &rarr; {req.dropLocation} | {req.preferredClass}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                        Waiting for vehicle
                      </span>
                      <button
                        onClick={() => {
                          setTargetReqId(req.id);
                          setShowForceAssignModal(true);
                        }}
                        className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg cursor-pointer"
                      >
                        Assign
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {pendingRequests.length === 0 && (
                <p className="text-xs text-slate-400 py-4 text-center">
                  All requests currently allocated. Ready for new bookings.
                </p>
              )}
            </div>
          </div>

          {/* Section: Vehicles Status matching wireframe */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">{t('vehiclesStatus')}</h3>
              <span className="text-xs text-slate-500 font-mono">
                {vehicles.length} Total Fleet
              </span>
            </div>

            <div className="space-y-2">
              {vehicles.map((v) => {
                const isReady = isVehicleEligible(v);
                return (
                  <div
                    key={v.id}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 text-xs">{v.id}</span>
                        <span className="text-[11px] text-slate-600">({v.model})</span>
                        <span className="text-[10px] font-semibold px-1.5 py-0.2 bg-slate-200 text-slate-800 rounded">
                          {v.modelClass}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Driver:{' '}
                        <strong>
                          {v.currentDriverId || (isReady ? 'Unassigned' : 'None')}
                        </strong>{' '}
                        {v.keyHeldByDriverId && (
                          <span className="text-amber-700 font-semibold">
                            · [Key Held: {v.keyHeldByDriverId}]
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="text-right">
                      {isReady ? (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full inline-block">
                          Available + Clean
                        </span>
                      ) : (
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full inline-block ${
                            v.status === 'Busy'
                              ? 'bg-amber-100 text-amber-800'
                              : v.status === 'Maintenance'
                              ? 'bg-slate-200 text-slate-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {v.status === 'Available' ? v.condition : v.status}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Force Assign Button matching wireframe */}
            <button
              onClick={() => setShowForceAssignModal(true)}
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-amber-600/20 cursor-pointer mt-3"
            >
              {t('forceAssign')}
            </button>
          </div>
        </div>
      )}

      {/* MLA ↔ PA Linkages Management */}
      {activeTab === 'links' && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Secretariat MLA &harr; PA Linkage Directory
            </h3>
            <p className="text-xs text-slate-500">
              Admin audit controls. Ensure no rogue bookings. Maximum 2 active PAs enforced per MLA.
            </p>
          </div>

          <div className="space-y-4">
            {mlas.map((mla) => {
              const linkedPas = pas.filter((p) => p.linkedMlaId === mla.id);
              const activeCount = linkedPas.filter((p) => p.isActive).length;

              return (
                <div key={mla.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div>
                      <span className="font-mono font-bold text-xs text-blue-700 mr-2">
                        {mla.id}
                      </span>
                      <strong className="text-sm text-slate-900">{mla.name}</strong>
                      <p className="text-xs text-slate-500">{mla.constituency} · {mla.phone}</p>
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        activeCount === 2
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {activeCount} / 2 Active PAs
                    </span>
                  </div>

                  {/* Linked PAs list */}
                  <div className="mt-3 space-y-2">
                    {linkedPas.map((pa) => (
                      <div
                        key={pa.id}
                        className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-bold font-mono text-purple-700 mr-2">
                            {pa.id}
                          </span>
                          <span className="font-semibold text-slate-800">{pa.name}</span>
                          <span className="text-slate-500 ml-2 font-mono">{pa.phone}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              pa.isActive
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {pa.isActive ? 'Active' : 'Deactivated'}
                          </span>

                          {pa.isActive && (
                            <button
                              onClick={() => {
                                if (
                                  window.confirm(
                                    `Instant Admin Revocation: Deactivate PA ${pa.name}?`
                                  )
                                ) {
                                  managePA({
                                    mlaId: mla.id,
                                    action: 'REMOVE',
                                    targetPaId: pa.id,
                                    reason: 'Admin security revocation',
                                  });
                                }
                              }}
                              className="text-xs text-red-600 hover:underline font-semibold cursor-pointer"
                            >
                              Deactivate
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    {linkedPas.length === 0 && (
                      <p className="text-xs text-slate-400 italic">No PAs registered yet.</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Override Audit Logs Tab */}
      {activeTab === 'overrides' && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <h3 className="font-bold text-slate-900 text-sm">Force Assign &amp; Override Audit Trail</h3>
          <p className="text-xs text-slate-500">
            Mandatory written reason required for any priority bypass. Inspected during weekly protocol audit.
          </p>

          <div className="space-y-2 mt-4">
            {overrideLogs.map((ovr) => (
              <div
                key={ovr.id}
                className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-900">{ovr.id}</span>
                    <span className="text-slate-500">for {ovr.requestId}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    {new Date(ovr.timestamp).toLocaleTimeString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <p className="text-slate-800 font-semibold">
                  Reason: &quot;{ovr.reason}&quot;
                </p>

                <p className="text-[11px] text-slate-600">
                  Officer: <strong>{ovr.adminId}</strong> · Allocated:{' '}
                  <strong>{ovr.assignedVehicleId}</strong> (Driver: {ovr.assignedDriverId})
                </p>
              </div>
            ))}

            {overrideLogs.length === 0 && (
              <p className="text-xs text-slate-400 py-4 text-center">
                No manual overrides recorded. System has operated strictly on hardcoded rules.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Weekly Fairness Report Tab */}
      {activeTab === 'fairness' && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Secretariat Weekly Fairness Metrics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-2xl font-bold text-slate-900">{requests.length}</span>
              <p className="text-xs font-semibold text-slate-700 mt-1">Total Requests</p>
              <p className="text-[10px] text-slate-500">Across all MLAs</p>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-center">
              <span className="text-2xl font-bold text-amber-800">{overrideLogs.length}</span>
              <p className="text-xs font-semibold text-slate-700 mt-1">Logged Overrides</p>
              <p className="text-[10px] text-slate-500">100% justified with reason</p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
              <span className="text-2xl font-bold text-emerald-800">0</span>
              <p className="text-xs font-semibold text-slate-700 mt-1">PA Misuse Violations</p>
              <p className="text-[10px] text-slate-500">Hard block 100% active</p>
            </div>
          </div>
        </div>
      )}

      {/* Force Assign Modal */}
      {showForceAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="bg-amber-600 text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Force Assign (Admin Override)</h3>
                <p className="text-xs text-amber-100">Mandatory Reason Logged for Audit</p>
              </div>
              <button
                onClick={() => setShowForceAssignModal(false)}
                className="text-amber-100 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleForceAssignSubmit} className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Request
                </label>
                <select
                  value={targetReqId}
                  onChange={(e) => setTargetReqId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                  required
                >
                  {requests.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.id} - {r.beneficiaryMlaId} ({r.pickupLocation} &rarr; {r.dropLocation})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Vehicle (Any fleet status)
                </label>
                <select
                  value={targetVehicleId}
                  onChange={(e) => setTargetVehicleId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                  required
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.id} - {v.model} ({v.status}, {v.condition})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assign Driver
                </label>
                <select
                  value={targetDriverId}
                  onChange={(e) => setTargetDriverId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                  required
                >
                  {drivers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.id} - {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mandatory Written Reason (Min 5 chars)
                </label>
                <textarea
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg text-xs text-slate-800"
                  placeholder="State official reason for protocol override..."
                  required
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  This justification will be permanently stored in the statewide weekly fairness audit.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-lg shadow-md cursor-pointer mt-2"
              >
                Confirm Force Assignment
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
