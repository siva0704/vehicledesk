import React from 'react';
import { X, ArrowRight, UserCheck, Key, Shield, Smartphone } from 'lucide-react';

interface SwimlaneModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SwimlaneModal: React.FC<SwimlaneModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full overflow-hidden border border-slate-200 my-8 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-bold">
              Detailed Work Personas Swimlane (with Examples)
            </h2>
            <p className="text-xs text-slate-300">
              Vehicle Desk · End-to-End Persona Workflow &amp; Interaction Lifecycle
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-6">
          {/* MLA Lane */}
          <div className="border border-blue-200 rounded-xl overflow-hidden bg-blue-50/20">
            <div className="bg-blue-600 text-white px-4 py-2 font-bold text-xs flex items-center justify-between">
              <span>MLA-001 (Full View Access)</span>
              <span className="text-blue-100 text-[11px] font-normal">VIP / Beneficiary Persona</span>
            </div>
            <div className="p-4 grid grid-cols-2 md:grid-cols-6 gap-3">
              <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-xs">
                <span className="text-[10px] font-bold text-blue-600 block mb-1">1. Login OTP</span>
                <p className="text-xs font-semibold text-slate-800">Phone + OTP</p>
                <p className="text-[11px] text-slate-500 mt-1">Sees full history of trips</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-xs">
                <span className="text-[10px] font-bold text-blue-600 block mb-1">2. Dual Channel</span>
                <p className="text-xs font-semibold text-slate-800">WhatsApp or App</p>
                <p className="text-[11px] text-slate-500 mt-1">Can message or open app</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-xs">
                <span className="text-[10px] font-bold text-blue-600 block mb-1">3. View Request</span>
                <p className="text-xs font-semibold text-slate-800">Full Visibility</p>
                <p className="text-[11px] text-slate-500 mt-1">Made by MLA or linked PA</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-xs">
                <span className="text-[10px] font-bold text-blue-600 block mb-1">4. Live GPS</span>
                <p className="text-xs font-semibold text-slate-800">Track Location</p>
                <p className="text-[11px] text-slate-500 mt-1">Sees Driver-D12 live spot</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-xs">
                <span className="text-[10px] font-bold text-blue-600 block mb-1">5. Full Log</span>
                <p className="text-xs font-semibold text-slate-800">7-Point Chain</p>
                <p className="text-[11px] text-slate-500 mt-1">Key times + trip stages</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-xs">
                <span className="text-[10px] font-bold text-blue-600 block mb-1">6. Manage PAs</span>
                <p className="text-xs font-semibold text-slate-800">Max 2 Active PAs</p>
                <p className="text-[11px] text-slate-500 mt-1">Add/change/remove logged</p>
              </div>
            </div>
          </div>

          {/* PA Lane */}
          <div className="border border-purple-200 rounded-xl overflow-hidden bg-purple-50/20">
            <div className="bg-purple-600 text-white px-4 py-2 font-bold text-xs flex items-center justify-between">
              <span>PA-A1 (Booking Access on behalf of MLA only)</span>
              <span className="text-purple-100 text-[11px] font-normal">Personal Assistant Persona</span>
            </div>
            <div className="p-4 grid grid-cols-2 md:grid-cols-6 gap-3">
              <div className="bg-white p-3 rounded-lg border border-purple-100 shadow-xs">
                <span className="text-[10px] font-bold text-purple-600 block mb-1">1. Login OTP</span>
                <p className="text-xs font-semibold text-slate-800">Bound to MLA</p>
                <p className="text-[11px] text-slate-500 mt-1">Linked strictly to MLA-001</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-purple-100 shadow-xs">
                <span className="text-[10px] font-bold text-purple-600 block mb-1">2. Create Request</span>
                <p className="text-xs font-semibold text-slate-800">MLA Beneficiary</p>
                <p className="text-[11px] text-slate-500 mt-1">Only for MLA-001 (never self)</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-purple-100 shadow-xs">
                <span className="text-[10px] font-bold text-purple-600 block mb-1">3. Submit</span>
                <p className="text-xs font-semibold text-slate-800">Rule Engine</p>
                <p className="text-[11px] text-slate-500 mt-1">System applies allocation</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-purple-100 shadow-xs">
                <span className="text-[10px] font-bold text-purple-600 block mb-1">4. Track</span>
                <p className="text-xs font-semibold text-slate-800">Fleet Assignment</p>
                <p className="text-[11px] text-slate-500 mt-1">Sees assigned vehicle &amp; driver</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-purple-100 shadow-xs">
                <span className="text-[10px] font-bold text-purple-600 block mb-1">5. GPS Link</span>
                <p className="text-xs font-semibold text-slate-800">Live Breadcrumb</p>
                <p className="text-[11px] text-slate-500 mt-1">Shares with MLA if needed</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-purple-100 shadow-xs">
                <span className="text-[10px] font-bold text-purple-600 block mb-1">6. Limited History</span>
                <p className="text-xs font-semibold text-slate-800">Restricted View</p>
                <p className="text-[11px] text-slate-500 mt-1">Only own requests for MLA</p>
              </div>
            </div>
          </div>

          {/* Driver Lane */}
          <div className="border border-emerald-200 rounded-xl overflow-hidden bg-emerald-50/20">
            <div className="bg-emerald-600 text-white px-4 py-2 font-bold text-xs flex items-center justify-between">
              <span>Driver-D12 (Execution &amp; Key Lifecycle)</span>
              <span className="text-emerald-100 text-[11px] font-normal">Fleet Driver Persona</span>
            </div>
            <div className="p-4 grid grid-cols-2 md:grid-cols-6 gap-3">
              <div className="bg-white p-3 rounded-lg border border-emerald-100 shadow-xs">
                <span className="text-[10px] font-bold text-emerald-600 block mb-1">1. Status Update</span>
                <p className="text-xs font-semibold text-slate-800">Available + Clean</p>
                <p className="text-[11px] text-slate-500 mt-1">Toggles condition &amp; duty</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-emerald-100 shadow-xs">
                <span className="text-[10px] font-bold text-emerald-600 block mb-1">2. Key Collected</span>
                <p className="text-xs font-semibold text-slate-800">Time + GPS</p>
                <p className="text-[11px] text-slate-500 mt-1">Locks vehicle to driver</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-emerald-100 shadow-xs">
                <span className="text-[10px] font-bold text-emerald-600 block mb-1">3. Reached Vehicle</span>
                <p className="text-xs font-semibold text-slate-800">Pre-Trip Check</p>
                <p className="text-[11px] text-slate-500 mt-1">Time + GPS timestamped</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-emerald-100 shadow-xs">
                <span className="text-[10px] font-bold text-emerald-600 block mb-1">4. Accept + GPS</span>
                <p className="text-xs font-semibold text-slate-800">Live Broadcast</p>
                <p className="text-[11px] text-slate-500 mt-1">Shares live GPS location</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-emerald-100 shadow-xs">
                <span className="text-[10px] font-bold text-emerald-600 block mb-1">5. Trip Stages</span>
                <p className="text-xs font-semibold text-slate-800">Pickup &rarr; Drop</p>
                <p className="text-[11px] text-slate-500 mt-1">Arrived, Started, Completed</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-emerald-100 shadow-xs">
                <span className="text-[10px] font-bold text-emerald-600 block mb-1">6. Key Returned</span>
                <p className="text-xs font-semibold text-slate-800">Frees Vehicle</p>
                <p className="text-[11px] text-slate-500 mt-1">Vehicle becomes Free pool</p>
              </div>
            </div>
          </div>

          {/* Admin Lane */}
          <div className="border border-amber-200 rounded-xl overflow-hidden bg-amber-50/20">
            <div className="bg-amber-600 text-white px-4 py-2 font-bold text-xs flex items-center justify-between">
              <span>Admin-AD01 (Full Operational Control &amp; Audit)</span>
              <span className="text-amber-100 text-[11px] font-normal">Desk Officer Persona</span>
            </div>
            <div className="p-4 grid grid-cols-2 md:grid-cols-6 gap-3">
              <div className="bg-white p-3 rounded-lg border border-amber-100 shadow-xs">
                <span className="text-[10px] font-bold text-amber-600 block mb-1">1. Live Board</span>
                <p className="text-xs font-semibold text-slate-800">Real-time Grid</p>
                <p className="text-[11px] text-slate-500 mt-1">All requests visible</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-amber-100 shadow-xs">
                <span className="text-[10px] font-bold text-amber-600 block mb-1">2. Monitor</span>
                <p className="text-xs font-semibold text-slate-800">VIP Queue</p>
                <p className="text-[11px] text-slate-500 mt-1">Auto-assign rule engine</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-amber-100 shadow-xs">
                <span className="text-[10px] font-bold text-amber-600 block mb-1">3. Override</span>
                <p className="text-xs font-semibold text-slate-800">Force Assign</p>
                <p className="text-[11px] text-slate-500 mt-1">Reason strictly mandatory</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-amber-100 shadow-xs">
                <span className="text-[10px] font-bold text-amber-600 block mb-1">4. Link PA</span>
                <p className="text-xs font-semibold text-slate-800">Manage Relations</p>
                <p className="text-[11px] text-slate-500 mt-1">Manage MLA &harr; PA links</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-amber-100 shadow-xs">
                <span className="text-[10px] font-bold text-amber-600 block mb-1">5. Report</span>
                <p className="text-xs font-semibold text-slate-800">Fairness Metrics</p>
                <p className="text-[11px] text-slate-500 mt-1">Weekly fairness &amp; audit</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-amber-100 shadow-xs">
                <span className="text-[10px] font-bold text-amber-600 block mb-1">6. Audit</span>
                <p className="text-xs font-semibold text-slate-800">7-Point Audit</p>
                <p className="text-[11px] text-slate-500 mt-1">Full immutable event log</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
