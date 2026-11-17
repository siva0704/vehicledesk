import React, { useState } from 'react';
import { useVehicleDesk } from '../../context/VehicleDeskContext';
import {
  TripStage,
  VehicleStatus,
  VehicleCondition,
  GPSLocation,
} from '../../types';
import {
  Key,
  Car,
  Navigation,
  CheckCircle2,
  Clock,
  ExternalLink,
  Sparkles,
  MapPin,
  AlertCircle,
  Play,
} from 'lucide-react';

export const DriverView: React.FC = () => {
  const {
    currentUser,
    vehicles,
    requests,
    updateVehicleStatusByDriver,
    progressTripStage,
    t,
  } = useVehicleDesk();

  const [notes, setNotes] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  if (!currentUser) return null;

  // Active assigned vehicle (e.g. KA-01-AB-1234)
  const assignedVehicle =
    vehicles.find((v) => v.currentDriverId === currentUser.id) ||
    vehicles.find((v) => v.id === 'KA-01-AB-1234') ||
    vehicles[0];

  // Active assigned request
  const activeTrip = requests.find(
    (r) =>
      r.assignedDriverId === currentUser.id &&
      r.status !== 'Trip Completed' &&
      r.status !== 'Key Returned'
  ) || requests.find((r) => r.assignedDriverId === currentUser.id);

  // Status updates
  const handleStatusChange = (status: VehicleStatus) => {
    if (!assignedVehicle) return;
    const res = updateVehicleStatusByDriver(
      assignedVehicle.id,
      status,
      assignedVehicle.condition
    );
    setFeedbackMsg({
      type: res.success ? 'success' : 'error',
      text: res.message,
    });
  };

  const handleConditionChange = (condition: VehicleCondition) => {
    if (!assignedVehicle) return;
    const res = updateVehicleStatusByDriver(
      assignedVehicle.id,
      assignedVehicle.status,
      condition
    );
    setFeedbackMsg({
      type: res.success ? 'success' : 'error',
      text: res.message,
    });
  };

  const handleStageAction = (stage: TripStage) => {
    if (!activeTrip) {
      setFeedbackMsg({
        type: 'error',
        text: 'No active trip assigned to execute lifecycle on.',
      });
      return;
    }

    const res = progressTripStage(activeTrip.id, stage, notes);
    setFeedbackMsg({
      type: res.success ? 'success' : 'error',
      text: res.message,
    });
    setNotes('');
  };

  return (
    <div className="max-w-md md:max-w-xl mx-auto space-y-4">
      {/* Official Emerald Green Header matching PDF Page 6 Wireframe */}
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 text-white rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-bold font-mono">
                {currentUser.id}
              </span>
              <span className="text-xs uppercase tracking-wider font-semibold text-emerald-200">
                {t('driverExecution')}
              </span>
            </div>
            <h2 className="text-lg font-bold mt-1">{currentUser.name}</h2>
            <p className="text-xs text-emerald-100">
              Assigned Vehicle: <strong className="font-mono text-white">{assignedVehicle?.id}</strong>{' '}
              ({assignedVehicle?.model})
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-emerald-200 block">Duty Shift</span>
            <span className="text-xs font-bold bg-white text-emerald-800 px-2 py-0.5 rounded">
              Active Shift A
            </span>
          </div>
        </div>
      </div>

      {feedbackMsg && (
        <div
          className={`p-3 rounded-xl text-xs flex items-center justify-between ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-50 border border-emerald-300 text-emerald-900'
              : 'bg-red-50 border border-red-300 text-red-900'
          }`}
        >
          <span>{feedbackMsg.text}</span>
          <button
            onClick={() => setFeedbackMsg(null)}
            className="text-xs font-bold ml-2 text-slate-500 hover:text-slate-800"
          >
            ✕
          </button>
        </div>
      )}

      {/* Current Status - 2x2 Grid matching PDF Page 6 */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
        <h3 className="font-bold text-slate-900 text-sm">{t('currentStatus')}</h3>
        <div className="grid grid-cols-2 gap-3">
          {(['Available', 'Busy', 'Off', 'Maintenance'] as VehicleStatus[]).map((st) => {
            const isSelected = assignedVehicle?.status === st;
            return (
              <button
                key={st}
                onClick={() => handleStatusChange(st)}
                className={`py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                  isSelected
                    ? st === 'Available'
                      ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                      : st === 'Busy'
                      ? 'bg-amber-600 text-white shadow-amber-500/20'
                      : 'bg-slate-800 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {isSelected && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                <span>{t(st.toLowerCase() as any) || st}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Vehicle Condition - Clean / Needs Cleaning matching PDF Page 6 */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-slate-900 text-sm">{t('vehicleCondition')}</h3>
          <span className="text-[11px] text-slate-500 font-medium">
            Rule: Visible to VIPs only if Clean
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleConditionChange('Clean')}
            className={`py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
              assignedVehicle?.condition === 'Clean'
                ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{t('clean')}</span>
          </button>

          <button
            onClick={() => handleConditionChange('Needs Cleaning')}
            className={`py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
              assignedVehicle?.condition === 'Needs Cleaning'
                ? 'bg-amber-600 text-white shadow-amber-500/20'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            <span>{t('needsCleaning')}</span>
          </button>
        </div>
      </div>

      {/* Key & Trip Lifecycle Actions matching PDF Page 6 */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">{t('keyActions')}</h3>
          {activeTrip && (
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              Trip: {activeTrip.id} ({activeTrip.status})
            </span>
          )}
        </div>

        {activeTrip ? (
          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs space-y-1 mb-2">
            <p className="font-bold text-emerald-950">
              Active Beneficiary: {activeTrip.beneficiaryMlaId}
            </p>
            <p className="text-emerald-800">
              Route: <strong>{activeTrip.pickupLocation}</strong> &rarr;{' '}
              <strong>{activeTrip.dropLocation}</strong>
            </p>
            <p className="text-[11px] text-emerald-700 font-mono">
              GPS Broadcast: 12.9795, 77.5909 (Live tracking enabled)
            </p>
          </div>
        ) : (
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 text-center">
            No active assignment assigned to Driver-D12 yet. Check Live Board or assign trip.
          </div>
        )}

        {/* 7-Point Key Stages buttons */}
        <div className="space-y-2">
          {/* Key Collected */}
          <button
            onClick={() => handleStageAction('Key Collected')}
            className={`w-full py-2.5 px-4 rounded-xl border text-xs font-bold transition flex items-center justify-between cursor-pointer ${
              activeTrip?.status === 'Key Collected'
                ? 'bg-emerald-100 border-emerald-300 text-emerald-900 ring-2 ring-emerald-500'
                : 'bg-slate-50 hover:bg-emerald-50 border-slate-200 text-slate-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-emerald-600" />
              <span>1. {t('keyCollected')}</span>
            </div>
            <span className="text-[10px] text-slate-400 font-normal">Time + GPS (Locker)</span>
          </button>

          {/* Reached Vehicle */}
          <button
            onClick={() => handleStageAction('Reached Vehicle')}
            className={`w-full py-2.5 px-4 rounded-xl border text-xs font-bold transition flex items-center justify-between cursor-pointer ${
              activeTrip?.status === 'Reached Vehicle'
                ? 'bg-emerald-100 border-emerald-300 text-emerald-900 ring-2 ring-emerald-500'
                : 'bg-slate-50 hover:bg-emerald-50 border-slate-200 text-slate-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-emerald-600" />
              <span>2. {t('reachedVehicle')}</span>
            </div>
            <span className="text-[10px] text-slate-400 font-normal">Time + GPS (Bay 4)</span>
          </button>

          {/* Arrived at Pickup */}
          <button
            onClick={() => handleStageAction('Arrived at Pickup')}
            className={`w-full py-2.5 px-4 rounded-xl border text-xs font-bold transition flex items-center justify-between cursor-pointer ${
              activeTrip?.status === 'Arrived at Pickup'
                ? 'bg-emerald-100 border-emerald-300 text-emerald-900 ring-2 ring-emerald-500'
                : 'bg-slate-50 hover:bg-emerald-50 border-slate-200 text-slate-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>3. {t('arrivedPickup')}</span>
            </div>
            <span className="text-[10px] text-slate-400 font-normal">LH Gate</span>
          </button>

          {/* Trip Started */}
          <button
            onClick={() => handleStageAction('Trip Started')}
            className={`w-full py-2.5 px-4 rounded-xl border text-xs font-bold transition flex items-center justify-between cursor-pointer ${
              activeTrip?.status === 'Trip Started'
                ? 'bg-emerald-100 border-emerald-300 text-emerald-900 ring-2 ring-emerald-500'
                : 'bg-slate-50 hover:bg-emerald-50 border-slate-200 text-slate-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4 text-emerald-600" />
              <span>4. {t('tripStarted')}</span>
            </div>
            <span className="text-[10px] text-slate-400 font-normal">En route</span>
          </button>

          {/* Arrived at Drop */}
          <button
            onClick={() => handleStageAction('Arrived at Drop')}
            className={`w-full py-2.5 px-4 rounded-xl border text-xs font-bold transition flex items-center justify-between cursor-pointer ${
              activeTrip?.status === 'Arrived at Drop'
                ? 'bg-emerald-100 border-emerald-300 text-emerald-900 ring-2 ring-emerald-500'
                : 'bg-slate-50 hover:bg-emerald-50 border-slate-200 text-slate-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>5. {t('arrivedDrop')}</span>
            </div>
            <span className="text-[10px] text-slate-400 font-normal">Vidhana Soudha</span>
          </button>

          {/* Trip Completed */}
          <button
            onClick={() => handleStageAction('Trip Completed')}
            className={`w-full py-2.5 px-4 rounded-xl border text-xs font-bold transition flex items-center justify-between cursor-pointer ${
              activeTrip?.status === 'Trip Completed'
                ? 'bg-emerald-100 border-emerald-300 text-emerald-900 ring-2 ring-emerald-500'
                : 'bg-slate-50 hover:bg-emerald-50 border-slate-200 text-slate-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>6. {t('tripCompleted')}</span>
            </div>
            <span className="text-[10px] text-slate-400 font-normal">Passenger alighted</span>
          </button>

          {/* Key Returned - Critical Step to Free Vehicle! */}
          <button
            onClick={() => handleStageAction('Key Returned')}
            className={`w-full py-3 px-4 rounded-xl border text-xs font-bold transition flex items-center justify-between cursor-pointer ${
              activeTrip?.status === 'Key Returned'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-900 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-emerald-700" />
              <span className="font-bold">7. {t('keyReturned')} (Frees Vehicle)</span>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded">
              Locker Safe Return
            </span>
          </button>
        </div>

        <p className="text-[11px] text-slate-500 italic text-center pt-2">
          Hard Karnataka Protocol: Vehicle never enters the Available pool until the driver records
          Key Returned in the biometric lockbox.
        </p>
      </div>
    </div>
  );
};
