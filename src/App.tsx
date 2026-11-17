import React, { useState } from 'react';
import { VehicleDeskProvider, useVehicleDesk } from './context/VehicleDeskContext';
import { Navbar } from './components/Navbar';
import { PhoneOTPModal } from './components/PhoneOTPModal';
import { WhatsAppChannelModal } from './components/WhatsAppChannelModal';
import { RBACMatrixModal } from './components/RBACMatrixModal';
import { SwimlaneModal } from './components/SwimlaneModal';
import { MLAView } from './components/views/MLAView';
import { PAView } from './components/views/PAView';
import { DriverView } from './components/views/DriverView';
import { AdminView } from './components/views/AdminView';
import { ShieldCheck, Lock, Car, CheckCircle } from 'lucide-react';

const VehicleDeskApp: React.FC = () => {
  const { currentUser, t } = useVehicleDesk();

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [isRBACOpen, setIsRBACOpen] = useState(false);
  const [isSwimlaneOpen, setIsSwimlaneOpen] = useState(false);

  // Render view corresponding to current active persona
  const renderPersonaView = () => {
    if (!currentUser) {
      return (
        <div className="max-w-md mx-auto text-center py-16 px-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-200 shadow-sm">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Please Sign In to Vehicle Desk</h2>
          <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto">
            Access is gated by verified Phone + OTP for MLAs, Personal Assistants, Drivers, and Admin Officers.
          </p>
          <button
            onClick={() => setIsLoginOpen(true)}
            className="mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md cursor-pointer transition"
          >
            Open Phone + OTP Login
          </button>
        </div>
      );
    }

    switch (currentUser.role) {
      case 'MLA':
        return <MLAView />;
      case 'PA':
        return <PAView />;
      case 'DRIVER':
        return <DriverView />;
      case 'ADMIN':
        return <AdminView />;
      default:
        return <MLAView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 selection:bg-blue-500 selection:text-white">
      {/* Top Navbar with quick role switcher & tool buttons */}
      <Navbar
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
        onOpenRBAC={() => setIsRBACOpen(true)}
        onOpenSwimlane={() => setIsSwimlaneOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-6">
        {renderPersonaView()}
      </main>

      {/* Protocol Compliance Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-5 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Karnataka Secretariat Fleet Rules:</strong> Hard rule active &mdash; PAs can never book for self. Vehicle visible only when Available + Clean.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsRBACOpen(true)}
              className="text-blue-600 hover:underline font-semibold cursor-pointer"
            >
              RBAC Matrix
            </button>
            <span>&bull;</span>
            <button
              onClick={() => setIsSwimlaneOpen(true)}
              className="text-blue-600 hover:underline font-semibold cursor-pointer"
            >
              Swimlane Guide
            </button>
            <span>&bull;</span>
            <button
              onClick={() => setIsWhatsAppOpen(true)}
              className="text-emerald-600 hover:underline font-semibold cursor-pointer"
            >
              WhatsApp Desk
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <PhoneOTPModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <WhatsAppChannelModal isOpen={isWhatsAppOpen} onClose={() => setIsWhatsAppOpen(false)} />
      <RBACMatrixModal isOpen={isRBACOpen} onClose={() => setIsRBACOpen(false)} />
      <SwimlaneModal isOpen={isSwimlaneOpen} onClose={() => setIsSwimlaneOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <VehicleDeskProvider>
      <VehicleDeskApp />
    </VehicleDeskProvider>
  );
}
