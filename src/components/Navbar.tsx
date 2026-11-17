import React from 'react';
import { useVehicleDesk } from '../context/VehicleDeskContext';
import {
  Shield,
  Car,
  MessageSquare,
  Key,
  Users,
  FileSpreadsheet,
  Globe,
  RotateCcw,
  LogIn,
  CheckCircle2,
} from 'lucide-react';

interface NavbarProps {
  onOpenLogin: () => void;
  onOpenWhatsApp: () => void;
  onOpenRBAC: () => void;
  onOpenSwimlane: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenLogin,
  onOpenWhatsApp,
  onOpenRBAC,
  onOpenSwimlane,
}) => {
  const { currentUser, users, loginUser, language, toggleLanguage, resetData, t } =
    useVehicleDesk();

  // Role color theme
  const getRoleBadge = () => {
    if (!currentUser) return 'bg-gray-100 text-gray-700 border-gray-300';
    switch (currentUser.role) {
      case 'MLA':
        return 'bg-blue-600 text-white border-blue-700';
      case 'PA':
        return 'bg-purple-600 text-white border-purple-700';
      case 'DRIVER':
        return 'bg-emerald-600 text-white border-emerald-700';
      case 'ADMIN':
        return 'bg-amber-600 text-white border-amber-700';
      default:
        return 'bg-gray-700 text-white';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-xs">
      {/* Top Protocol Utility Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-slate-100 tracking-wide uppercase">
              Govt. of Karnataka · Secretariat Fleet Allocation Desk
            </span>
            <span className="hidden sm:inline text-slate-400">|</span>
            <span className="hidden sm:inline text-slate-300 font-mono">
              Secure RBAC System · Phase 1 MVP
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 font-medium transition cursor-pointer"
              title="Toggle English / Kannada"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'ಕನ್ನಡ (KN)' : 'English (EN)'}</span>
            </button>

            {/* Reset Seed Data */}
            <button
              onClick={() => {
                if (window.confirm('Reset all demo state to fresh default seed?')) {
                  resetData();
                }
              }}
              className="flex items-center gap-1 px-2 py-0.5 rounded-sm text-slate-400 hover:text-white transition cursor-pointer"
              title="Reset initial seed data"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden md:inline">Reset Demo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Logo & System Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-amber-400 shadow-md">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
                    {t('appTitle')}
                  </h1>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm bg-amber-100 text-amber-800 border border-amber-200">
                    BETA MVP
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {t('appSubtitle')}
                </p>
              </div>
            </div>

            {/* Mobile quick persona badge */}
            {currentUser && (
              <div className="md:hidden">
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full shadow-xs ${getRoleBadge()}`}
                >
                  {currentUser.id}
                </span>
              </div>
            )}
          </div>

          {/* Persona Switcher & Tool Triggers */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Quick Switch Buttons matching the 4 key roles */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 px-2 hidden lg:inline">
                Role:
              </span>
              <button
                onClick={() => loginUser('MLA-001')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
                  currentUser?.id === 'MLA-001'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                MLA-001
              </button>
              <button
                onClick={() => loginUser('PA-A1')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
                  currentUser?.id === 'PA-A1'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                PA-A1
              </button>
              <button
                onClick={() => loginUser('Driver-D12')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
                  currentUser?.id === 'Driver-D12'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                Driver-D12
              </button>
              <button
                onClick={() => loginUser('Admin-AD01')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
                  currentUser?.id === 'Admin-AD01'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                Admin-AD01
              </button>
            </div>

            {/* Modal Launchers */}
            <button
              onClick={onOpenWhatsApp}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold transition cursor-pointer"
              title="Open WhatsApp Booking Simulator"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp Desk</span>
            </button>

            <button
              onClick={onOpenRBAC}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 text-xs font-semibold transition cursor-pointer"
              title="Inspect RBAC Matrix & Run Permission Tester"
            >
              <Shield className="w-3.5 h-3.5 text-indigo-600" />
              <span>RBAC Matrix</span>
            </button>

            <button
              onClick={onOpenSwimlane}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 text-xs font-semibold transition cursor-pointer"
              title="View Personas Swimlane"
            >
              <Users className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Swimlane</span>
            </button>

            <button
              onClick={onOpenLogin}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 text-white hover:bg-slate-700 text-xs font-semibold transition cursor-pointer"
              title="Phone + OTP Login Modal"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Phone / OTP</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
