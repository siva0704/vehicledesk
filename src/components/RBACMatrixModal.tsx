import React, { useState } from 'react';
import { useVehicleDesk } from '../context/VehicleDeskContext';
import { RBAC_MATRIX_DATA } from '../data/initialData';
import { Role, RBACAction } from '../types';
import { canPerformAction } from '../utils/rules';
import { Shield, Check, X as XIcon, AlertTriangle, Play, HelpCircle } from 'lucide-react';

interface RBACMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RBACMatrixModal: React.FC<RBACMatrixModalProps> = ({ isOpen, onClose }) => {
  const { users, currentUser } = useVehicleDesk();
  const [testRole, setTestRole] = useState<Role>('PA');
  const [testAction, setTestAction] = useState<RBACAction>('BOOK_FOR_SELF');
  const [testOverrideReason, setTestOverrideReason] = useState('');
  const [testResult, setTestResult] = useState<{ allowed: boolean; reason?: string } | null>(null);

  if (!isOpen) return null;

  const runLiveTest = () => {
    // Pick an example user matching testRole
    const exampleUser =
      users.find((u) => u.role === testRole && u.isActive) ||
      users.find((u) => u.role === testRole) ||
      currentUser;

    const res = canPerformAction(exampleUser, testAction, {
      overrideReason: testOverrideReason,
      targetBeneficiaryId: testRole === 'PA' ? 'MLA-001' : undefined,
    });
    setTestResult(res);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden border border-slate-200 my-8 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/40 text-indigo-400 flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                Updated Role-Based Access Control (with PA)
              </h2>
              <p className="text-xs text-slate-300">
                Official Karnataka Protocol Security Rules &amp; Hard Enforcement Matrix
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            aria-label="Close"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-6">
          {/* Exact Matrix matching PDF Page 4 Screenshot */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="bg-blue-800 text-white px-4 py-2 text-xs font-bold tracking-wide uppercase flex justify-between items-center">
              <span>Security Access Control Matrix</span>
              <span className="text-blue-200 text-[11px] normal-case font-normal">
                Strict Backend &amp; UI Gating
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-3 text-center bg-blue-50 text-blue-900">MLA / VIP</th>
                    <th className="py-3 px-3 text-center bg-purple-50 text-purple-900">PA</th>
                    <th className="py-3 px-3 text-center bg-emerald-50 text-emerald-900">Driver</th>
                    <th className="py-3 px-3 text-center bg-amber-50 text-amber-900">Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium">
                  {RBAC_MATRIX_DATA.map((row) => (
                    <tr key={row.action} className="hover:bg-slate-50/70 transition">
                      <td className="py-2.5 px-4 font-semibold text-slate-800">
                        {row.label}
                        <span className="block text-[10px] text-slate-500 font-normal">
                          {row.labelKn}
                        </span>
                      </td>

                      {/* MLA Cell */}
                      <td className="py-2.5 px-3 text-center bg-blue-50/40">
                        {row.mla === true ? (
                          <span className="inline-flex items-center text-emerald-700 font-bold">
                            <Check className="w-4 h-4 mr-0.5" /> Yes
                          </span>
                        ) : row.mla === false ? (
                          <span className="inline-flex items-center text-slate-400 font-bold">
                            <XIcon className="w-3.5 h-3.5 mr-0.5" /> No
                          </span>
                        ) : (
                          <span className="font-bold text-blue-700">{row.mla}</span>
                        )}
                      </td>

                      {/* PA Cell */}
                      <td className="py-2.5 px-3 text-center bg-purple-50/40">
                        {row.pa === true ? (
                          <span className="inline-flex items-center text-emerald-700 font-bold">
                            <Check className="w-4 h-4 mr-0.5" /> Yes
                          </span>
                        ) : row.pa === false ? (
                          <span className="inline-flex items-center text-rose-500 font-bold">
                            <XIcon className="w-3.5 h-3.5 mr-0.5" /> No
                          </span>
                        ) : row.pa === 'RESTRICTED' ? (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 text-[11px] font-bold">
                            Yes* (MLA only)
                          </span>
                        ) : (
                          <span className="font-bold text-purple-700">{row.pa}</span>
                        )}
                      </td>

                      {/* Driver Cell */}
                      <td className="py-2.5 px-3 text-center bg-emerald-50/40">
                        {row.driver === true ? (
                          <span className="inline-flex items-center text-emerald-700 font-bold">
                            <Check className="w-4 h-4 mr-0.5" /> Yes
                          </span>
                        ) : row.driver === false ? (
                          <span className="inline-flex items-center text-slate-400 font-bold">
                            <XIcon className="w-3.5 h-3.5 mr-0.5" /> No
                          </span>
                        ) : row.driver === 'CREATE' ? (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                            Create (GPS)
                          </span>
                        ) : (
                          <span className="font-bold text-emerald-700">{row.driver}</span>
                        )}
                      </td>

                      {/* Admin Cell */}
                      <td className="py-2.5 px-3 text-center bg-amber-50/40">
                        {row.admin === true ? (
                          <span className="inline-flex items-center text-emerald-700 font-bold">
                            <Check className="w-4 h-4 mr-0.5" /> Yes
                          </span>
                        ) : row.admin === false ? (
                          <span className="inline-flex items-center text-slate-400 font-bold">
                            <XIcon className="w-3.5 h-3.5 mr-0.5" /> No
                          </span>
                        ) : row.admin === 'OVERRIDE_REQUIRED' ? (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[11px] font-bold">
                            Yes + Reason
                          </span>
                        ) : (
                          <span className="font-bold text-amber-700">{row.admin}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-600">
              <span className="font-bold text-slate-800">* Core Karnataka Protocol Safeguard:</span> PA can book
              only on behalf of their linked MLA. PAs can never book for themselves, family, or personal guests. MLA always maintains full visibility.
            </div>
          </div>

          {/* Interactive Live Permission Tester */}
          <div className="bg-indigo-50/60 border border-indigo-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Play className="w-4 h-4 text-indigo-700" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                Interactive RBAC Tester &amp; Assertion Check
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Select Role to Test
                </label>
                <select
                  value={testRole}
                  onChange={(e) => setTestRole(e.target.value as Role)}
                  className="w-full px-2.5 py-1.5 bg-white border border-indigo-200 rounded-lg text-xs font-semibold text-slate-800"
                >
                  <option value="MLA">MLA (e.g. MLA-001)</option>
                  <option value="PA">PA (e.g. PA-A1)</option>
                  <option value="DRIVER">Driver (e.g. Driver-D12)</option>
                  <option value="ADMIN">Admin (e.g. Admin-AD01)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Target Operation / Action
                </label>
                <select
                  value={testAction}
                  onChange={(e) => setTestAction(e.target.value as RBACAction)}
                  className="w-full px-2.5 py-1.5 bg-white border border-indigo-200 rounded-lg text-xs font-semibold text-slate-800"
                >
                  <option value="BOOK_FOR_SELF">BOOK_FOR_SELF (Critical PA Test)</option>
                  <option value="BOOK_APP">BOOK_APP (On behalf of linked MLA)</option>
                  <option value="BOOK_WHATSAPP">BOOK_WHATSAPP</option>
                  <option value="KEY_COLLECT_RETURN">KEY_COLLECT_RETURN (Key Lifecycle)</option>
                  <option value="UPDATE_VEHICLE_STATUS">UPDATE_VEHICLE_STATUS</option>
                  <option value="FORCE_ASSIGN">FORCE_ASSIGN (Admin Override)</option>
                  <option value="ADD_CHANGE_PA">ADD_CHANGE_PA (Max 2 rule)</option>
                  <option value="DEACTIVATE_PA">DEACTIVATE_PA</option>
                  <option value="VIEW_ALL_HISTORY">VIEW_ALL_HISTORY</option>
                  <option value="CREATE_LIVE_GPS">CREATE_LIVE_GPS</option>
                </select>
              </div>

              {testAction === 'FORCE_ASSIGN' && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Override Reason (Admin only)
                  </label>
                  <input
                    type="text"
                    value={testOverrideReason}
                    onChange={(e) => setTestOverrideReason(e.target.value)}
                    placeholder="Enter written justification..."
                    className="w-full px-2.5 py-1.5 bg-white border border-indigo-200 rounded-lg text-xs text-slate-800"
                  />
                </div>
              )}

              <div className="sm:self-end">
                <button
                  type="button"
                  onClick={runLiveTest}
                  className="w-full py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Execute Gating Check</span>
                </button>
              </div>
            </div>

            {testResult && (
              <div
                className={`mt-3 p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
                  testResult.allowed
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-rose-50 border-rose-300 text-rose-900'
                }`}
              >
                {testResult.allowed ? (
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-bold">
                    Permission Result:{' '}
                    {testResult.allowed ? '✅ ALLOWED (200 OK)' : '🚫 BLOCKED (403 Forbidden)'}
                  </p>
                  <p className="text-[11px] mt-0.5">
                    {testResult.reason || 'Action permitted under the current role credentials.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
