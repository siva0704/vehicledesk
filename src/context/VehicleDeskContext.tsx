import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Vehicle,
  VehicleRequest,
  PALog,
  OverrideLog,
  TripStage,
  VehicleStatus,
  VehicleCondition,
  VehicleClass,
  GPSLocation,
  Language,
  Role,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_VEHICLES,
  INITIAL_REQUESTS,
  INITIAL_PA_LOGS,
  INITIAL_OVERRIDE_LOGS,
} from '../data/initialData';
import {
  canPerformAction,
  validateBookingSubmission,
  isVehicleEligible,
  matchVehicleAndDriver,
  getNextLifecycleStage,
  validatePaAddition,
  parseWhatsAppBooking,
} from '../utils/rules';
import { TRANSLATIONS } from '../utils/translations';

interface VehicleDeskContextType {
  currentUser: User | null;
  users: User[];
  vehicles: Vehicle[];
  requests: VehicleRequest[];
  paLogs: PALog[];
  overrideLogs: OverrideLog[];
  language: Language;
  t: (key: keyof typeof TRANSLATIONS.en) => string;
  loginUser: (userId: string) => void;
  loginWithPhone: (phone: string, otp: string) => { success: boolean; message: string };
  logout: () => void;
  toggleLanguage: () => void;
  createBooking: (payload: {
    beneficiaryMlaId: string;
    pickupLocation: string;
    dropLocation: string;
    scheduledTime: string;
    preferredClass: VehicleClass;
    urgency: 'Routine' | 'Urgent' | 'VVIP Assembly Protocol';
    channel?: 'App' | 'WhatsApp';
  }) => { success: boolean; message: string; request?: VehicleRequest };
  updateVehicleStatusByDriver: (
    vehicleId: string,
    status: VehicleStatus,
    condition: VehicleCondition
  ) => { success: boolean; message: string };
  progressTripStage: (
    requestId: string,
    nextStage: TripStage,
    notes?: string
  ) => { success: boolean; message: string };
  forceAssign: (
    requestId: string,
    vehicleId: string,
    driverId: string,
    reason: string
  ) => { success: boolean; message: string };
  autoAssignPending: () => { assignedCount: number; message: string };
  managePA: (params: {
    mlaId: string;
    action: 'ADD' | 'REMOVE' | 'REPLACE' | 'NUMBER_CHANGE';
    name?: string;
    phone?: string;
    targetPaId?: string;
    reason: string;
  }) => { success: boolean; message: string };
  sendWhatsAppBookingMessage: (
    senderPhone: string,
    messageText: string
  ) => { success: boolean; reply: string; request?: VehicleRequest };
  resetData: () => void;
}

const VehicleDeskContext = createContext<VehicleDeskContextType | undefined>(undefined);

const STORAGE_KEY = 'vehicle_desk_state_v1';

export const VehicleDeskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_users`);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_currentUser`);
    if (saved) return JSON.parse(saved);
    return INITIAL_USERS[0]; // Default to MLA-001
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_vehicles`);
    return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
  });

  const [requests, setRequests] = useState<VehicleRequest[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_requests`);
    return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
  });

  const [paLogs, setPaLogs] = useState<PALog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_paLogs`);
    return saved ? JSON.parse(saved) : INITIAL_PA_LOGS;
  });

  const [overrideLogs, setOverrideLogs] = useState<OverrideLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_overrideLogs`);
    return saved ? JSON.parse(saved) : INITIAL_OVERRIDE_LOGS;
  });

  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_lang`);
    return saved === 'kn' ? 'kn' : 'en';
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_currentUser`, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_vehicles`, JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_requests`, JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_paLogs`, JSON.stringify(paLogs));
  }, [paLogs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_overrideLogs`, JSON.stringify(overrideLogs));
  }, [overrideLogs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_lang`, language);
  }, [language]);

  const t = (key: keyof typeof TRANSLATIONS.en): string => {
    return TRANSLATIONS[language][key] || TRANSLATIONS.en[key] || (key as string);
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'kn' : 'en'));
  };

  const loginUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (target) {
      setCurrentUser(target);
    }
  };

  const loginWithPhone = (phone: string, otp: string) => {
    const normalized = phone.replace(/\D/g, '');
    const user = users.find((u) => u.phone.replace(/\D/g, '') === normalized);
    if (!user) {
      return { success: false, message: 'Phone number not registered in system.' };
    }
    if (otp !== '123456' && otp !== '999999' && otp.length !== 6) {
      return { success: false, message: 'Invalid OTP. Demo OTP is 123456.' };
    }
    setCurrentUser(user);
    return { success: true, message: `Welcome, ${user.name} (${user.id})` };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Create booking request with RBAC validation
  const createBooking = (payload: {
    beneficiaryMlaId: string;
    pickupLocation: string;
    dropLocation: string;
    scheduledTime: string;
    preferredClass: VehicleClass;
    urgency: 'Routine' | 'Urgent' | 'VVIP Assembly Protocol';
    channel?: 'App' | 'WhatsApp';
  }) => {
    if (!currentUser) {
      return { success: false, message: 'Authentication required' };
    }

    const rbacCheck = canPerformAction(currentUser, 'BOOK_APP', {
      targetBeneficiaryId: payload.beneficiaryMlaId,
    });

    if (!rbacCheck.allowed) {
      return { success: false, message: rbacCheck.reason || 'Permission denied' };
    }

    const validation = validateBookingSubmission(currentUser, {
      beneficiaryMlaId: payload.beneficiaryMlaId,
      pickupLocation: payload.pickupLocation,
      dropLocation: payload.dropLocation,
      preferredClass: payload.preferredClass,
    });

    if (!validation.valid) {
      return { success: false, message: validation.error || 'Validation failed' };
    }

    const newId = `REQ-${1000 + requests.length + 1}`;
    const nowIso = new Date().toISOString();

    const newRequest: VehicleRequest = {
      id: newId,
      requestedByUserId: currentUser.id,
      requestedByRole: currentUser.role,
      beneficiaryMlaId: payload.beneficiaryMlaId,
      pickupLocation: payload.pickupLocation,
      dropLocation: payload.dropLocation,
      scheduledTime: payload.scheduledTime || nowIso,
      preferredClass: payload.preferredClass,
      urgency: payload.urgency,
      channel: payload.channel || 'App',
      status: 'Pending',
      createdAt: nowIso,
      timeChain: [
        {
          stage: 'Pending',
          timestamp: nowIso,
          actorId: currentUser.id,
          actorRole: currentUser.role,
          notes:
            currentUser.role === 'PA'
              ? `Booked by PA ${currentUser.name} strictly for linked MLA ${payload.beneficiaryMlaId}`
              : `Booked by MLA directly`,
        },
      ],
    };

    setRequests((prev) => [newRequest, ...prev]);

    return {
      success: true,
      message: `Request ${newId} created successfully for MLA ${payload.beneficiaryMlaId}`,
      request: newRequest,
    };
  };

  // Driver updates vehicle status & condition
  const updateVehicleStatusByDriver = (
    vehicleId: string,
    status: VehicleStatus,
    condition: VehicleCondition
  ) => {
    if (!currentUser) {
      return { success: false, message: 'Authentication required' };
    }

    const rbac = canPerformAction(currentUser, 'UPDATE_VEHICLE_STATUS');
    if (!rbac.allowed) {
      return { success: false, message: rbac.reason || 'Permission denied' };
    }

    setVehicles((prev) =>
      prev.map((v) =>
        v.id === vehicleId
          ? {
              ...v,
              status,
              condition,
              lastCleanedTime: condition === 'Clean' ? new Date().toISOString() : v.lastCleanedTime,
            }
          : v
      )
    );

    return {
      success: true,
      message: `Vehicle ${vehicleId} updated: Status = ${status}, Condition = ${condition}`,
    };
  };

  // Driver advances Key & Trip 7-Point Lifecycle
  const progressTripStage = (
    requestId: string,
    nextStage: TripStage,
    notes?: string
  ) => {
    if (!currentUser) {
      return { success: false, message: 'Authentication required' };
    }

    const rbac = canPerformAction(currentUser, 'KEY_COLLECT_RETURN');
    if (!rbac.allowed) {
      return { success: false, message: rbac.reason || 'Permission denied' };
    }

    const targetReq = requests.find((r) => r.id === requestId);
    if (!targetReq) {
      return { success: false, message: 'Request not found' };
    }

    const nowIso = new Date().toISOString();
    // Simulate real GPS location based on stage
    const gpsMap: Record<TripStage, GPSLocation> = {
      'Key Collected': { lat: 12.9798, lng: 77.5912, address: 'Fleet Key Locker Room B-2' },
      'Reached Vehicle': { lat: 12.9795, lng: 77.5909, address: 'Parking Bay 04, LH Compound' },
      'Arrived at Pickup': { lat: 12.9784, lng: 77.5906, address: targetReq.pickupLocation },
      'Trip Started': { lat: 12.9812, lng: 77.5925, address: 'En route via Sheshadri Road' },
      'Arrived at Drop': { lat: 12.9792, lng: 77.5918, address: targetReq.dropLocation },
      'Trip Completed': { lat: 12.9792, lng: 77.5918, address: 'Drop destination reached' },
      'Key Returned': { lat: 12.9798, lng: 77.5912, address: 'Fleet Key Locker Room B-2' },
      Pending: { lat: 12.9798, lng: 77.5912, address: 'Vidhana Soudha' },
      Assigned: { lat: 12.9798, lng: 77.5912, address: 'Vidhana Soudha' },
      Cancelled: { lat: 12.9798, lng: 77.5912, address: 'Vidhana Soudha' },
    };

    const currentGps = gpsMap[nextStage];
    const liveShareUrl = `https://maps.google.com/?q=${currentGps.lat},${currentGps.lng}`;

    const newPoint = {
      stage: nextStage,
      timestamp: nowIso,
      gps: currentGps,
      actorId: currentUser.id,
      actorRole: currentUser.role,
      notes: notes || `Recorded by Driver ${currentUser.name}`,
    };

    // Update request
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: nextStage,
              liveGps: currentGps,
              liveGpsShareUrl: liveShareUrl,
              timeChain: [...r.timeChain, newPoint],
            }
          : r
      )
    );

    // Update vehicle key state and status
    if (targetReq.assignedVehicleId) {
      setVehicles((prev) =>
        prev.map((v) => {
          if (v.id === targetReq.assignedVehicleId) {
            if (nextStage === 'Key Collected') {
              return {
                ...v,
                keyHeldByDriverId: currentUser.id,
                currentDriverId: currentUser.id,
                status: 'Busy',
              };
            }
            if (nextStage === 'Key Returned') {
              // Key Returned frees vehicle!
              return {
                ...v,
                keyHeldByDriverId: undefined,
                currentDriverId: undefined,
                status: 'Available', // Freed!
                condition: 'Clean',
              };
            }
          }
          return v;
        })
      );
    }

    return {
      success: true,
      message: `Stage updated to "${nextStage}". Time & GPS recorded in 7-point audit chain.`,
    };
  };

  // Admin Force Assign with mandatory reason
  const forceAssign = (
    requestId: string,
    vehicleId: string,
    driverId: string,
    reason: string
  ) => {
    if (!currentUser) {
      return { success: false, message: 'Authentication required' };
    }

    const rbac = canPerformAction(currentUser, 'FORCE_ASSIGN', {
      overrideReason: reason,
    });

    if (!rbac.allowed) {
      return { success: false, message: rbac.reason || 'Permission denied' };
    }

    const targetReq = requests.find((r) => r.id === requestId);
    if (!targetReq) {
      return { success: false, message: 'Request not found' };
    }

    const nowIso = new Date().toISOString();

    // Log override in audit trail
    const overrideEntry: OverrideLog = {
      id: `OVR-${Date.now().toString().slice(-4)}`,
      timestamp: nowIso,
      requestId,
      adminId: currentUser.id,
      previousVehicleId: targetReq.assignedVehicleId,
      previousDriverId: targetReq.assignedDriverId,
      assignedVehicleId: vehicleId,
      assignedDriverId: driverId,
      reason,
      priorityBypass: true,
    };

    setOverrideLogs((prev) => [overrideEntry, ...prev]);

    // Update request
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'Assigned',
              assignedVehicleId: vehicleId,
              assignedDriverId: driverId,
              isForceAssigned: true,
              forceAssignReason: reason,
              forceAssignedBy: currentUser.id,
              timeChain: [
                ...r.timeChain,
                {
                  stage: 'Assigned',
                  timestamp: nowIso,
                  actorId: currentUser.id,
                  actorRole: currentUser.role,
                  notes: `ADMIN FORCE ASSIGN: ${reason}`,
                },
              ],
            }
          : r
      )
    );

    // Mark vehicle as busy / reserved
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === vehicleId
          ? { ...v, status: 'Busy', currentDriverId: driverId }
          : v
      )
    );

    return {
      success: true,
      message: `Request ${requestId} force-assigned to ${vehicleId} with logged justification.`,
    };
  };

  // Run hardcoded assignment rules on all pending requests
  const autoAssignPending = () => {
    let count = 0;
    const pendingList = requests.filter((r) => r.status === 'Pending');

    if (pendingList.length === 0) {
      return { assignedCount: 0, message: 'No pending requests in queue.' };
    }

    let currentVehicles = [...vehicles];

    pendingList.forEach((req) => {
      const match = matchVehicleAndDriver(req, currentVehicles, users);
      if (match) {
        count++;
        const nowIso = new Date().toISOString();

        // Update request
        setRequests((prev) =>
          prev.map((r) =>
            r.id === req.id
              ? {
                  ...r,
                  status: 'Assigned',
                  assignedVehicleId: match.vehicle.id,
                  assignedDriverId: match.driver.id,
                  timeChain: [
                    ...r.timeChain,
                    {
                      stage: 'Assigned',
                      timestamp: nowIso,
                      actorId: 'RULE_ENGINE',
                      actorRole: 'ADMIN',
                      notes: `Auto-assigned via Protocol Rule Engine (Class: ${match.vehicle.modelClass})`,
                    },
                  ],
                }
              : r
          )
        );

        // Update local vehicle tracker
        currentVehicles = currentVehicles.map((v) =>
          v.id === match.vehicle.id
            ? { ...v, status: 'Busy', currentDriverId: match.driver.id }
            : v
        );
      }
    });

    setVehicles(currentVehicles);

    return {
      assignedCount: count,
      message: `Rule engine matched and allocated ${count} request(s).`,
    };
  };

  // Manage PA (MLA can manage up to 2 PAs, change is fully logged)
  const managePA = (params: {
    mlaId: string;
    action: 'ADD' | 'REMOVE' | 'REPLACE' | 'NUMBER_CHANGE';
    name?: string;
    phone?: string;
    targetPaId?: string;
    reason: string;
  }) => {
    if (!currentUser) {
      return { success: false, message: 'Authentication required' };
    }

    const rbac = canPerformAction(currentUser, 'ADD_CHANGE_PA');
    if (!rbac.allowed) {
      return { success: false, message: rbac.reason || 'Permission denied' };
    }

    // MLA can only manage their own PAs unless Admin
    if (currentUser.role === 'MLA' && currentUser.id !== params.mlaId) {
      return { success: false, message: 'Cannot manage PAs of another MLA.' };
    }

    const nowIso = new Date().toISOString();

    if (params.action === 'ADD') {
      const validation = validatePaAddition(params.mlaId, users);
      if (!validation.allowed) {
        return { success: false, message: validation.error || 'Max 2 PAs reached' };
      }

      const paCount = users.filter((u) => u.role === 'PA').length + 1;
      const newPaId = `PA-A${paCount}`;

      const newPaUser: User = {
        id: newPaId,
        name: params.name || `Assistant ${newPaId}`,
        nameKn: `${params.name || newPaId} (ಸಹಾಯಕ)`,
        phone: params.phone || '+91 98450 99999',
        role: 'PA',
        linkedMlaId: params.mlaId,
        designation: `Personal Assistant to ${params.mlaId}`,
        isActive: true,
      };

      setUsers((prev) => [...prev, newPaUser]);

      const log: PALog = {
        id: `LOG-PA-${Date.now().toString().slice(-4)}`,
        timestamp: nowIso,
        mlaId: params.mlaId,
        action: 'ADD',
        newPaId,
        newPaPhone: newPaUser.phone,
        changedByUserId: currentUser.id,
        reason: params.reason || 'Appointed new official PA',
      };

      setPaLogs((prev) => [log, ...prev]);

      return {
        success: true,
        message: `PA ${newPaUser.name} (${newPaId}) successfully appointed and linked to ${params.mlaId}.`,
      };
    }

    if (params.action === 'REMOVE') {
      if (!params.targetPaId) {
        return { success: false, message: 'Target PA ID required' };
      }

      setUsers((prev) =>
        prev.map((u) => (u.id === params.targetPaId ? { ...u, isActive: false } : u))
      );

      const target = users.find((u) => u.id === params.targetPaId);

      const log: PALog = {
        id: `LOG-PA-${Date.now().toString().slice(-4)}`,
        timestamp: nowIso,
        mlaId: params.mlaId,
        action: 'DEACTIVATE',
        oldPaId: params.targetPaId,
        oldPaPhone: target?.phone,
        changedByUserId: currentUser.id,
        reason: params.reason || 'Deactivated PA access',
      };

      setPaLogs((prev) => [log, ...prev]);

      return {
        success: true,
        message: `PA ${params.targetPaId} deactivated. Access immediately revoked.`,
      };
    }

    if (params.action === 'NUMBER_CHANGE') {
      if (!params.targetPaId || !params.phone) {
        return { success: false, message: 'Target PA ID and new phone number required' };
      }

      const oldPa = users.find((u) => u.id === params.targetPaId);

      setUsers((prev) =>
        prev.map((u) =>
          u.id === params.targetPaId ? { ...u, phone: params.phone! } : u
        )
      );

      const log: PALog = {
        id: `LOG-PA-${Date.now().toString().slice(-4)}`,
        timestamp: nowIso,
        mlaId: params.mlaId,
        action: 'NUMBER_CHANGE',
        oldPaId: params.targetPaId,
        oldPaPhone: oldPa?.phone,
        newPaPhone: params.phone,
        changedByUserId: currentUser.id,
        reason: params.reason || 'Updated official WhatsApp booking number',
      };

      setPaLogs((prev) => [log, ...prev]);

      return {
        success: true,
        message: `PA ${params.targetPaId} phone updated to ${params.phone}. Auto-relations preserved.`,
      };
    }

    return { success: false, message: 'Unsupported action' };
  };

  // WhatsApp dual channel simulation
  const sendWhatsAppBookingMessage = (senderPhone: string, messageText: string) => {
    const parsed = parseWhatsAppBooking(messageText, senderPhone, users);

    if (!parsed.success || !parsed.beneficiaryMlaId) {
      return {
        success: false,
        reply: `❌ Booking failed: ${parsed.error || 'Could not verify authorized VIP or PA identity.'}`,
      };
    }

    const newId = `REQ-${1000 + requests.length + 1}`;
    const nowIso = new Date().toISOString();

    const newRequest: VehicleRequest = {
      id: newId,
      requestedByUserId: parsed.bookedByUserId!,
      requestedByRole: parsed.bookedByRole!,
      beneficiaryMlaId: parsed.beneficiaryMlaId,
      pickupLocation: parsed.pickup || 'Legislators Home Gate',
      dropLocation: parsed.drop || 'Vidhana Soudha',
      scheduledTime: nowIso,
      preferredClass: parsed.preferredClass || 'Class A',
      urgency: 'Routine',
      channel: 'WhatsApp',
      status: 'Pending',
      createdAt: nowIso,
      timeChain: [
        {
          stage: 'Pending',
          timestamp: nowIso,
          actorId: parsed.bookedByUserId!,
          actorRole: parsed.bookedByRole!,
          notes: `WhatsApp Channel message from ${senderPhone}: "${messageText}"`,
        },
      ],
    };

    setRequests((prev) => [newRequest, ...prev]);

    const beneficiary = users.find((u) => u.id === parsed.beneficiaryMlaId);

    const reply = `✅ Official Vehicle Desk: Request #${newId} recorded for ${beneficiary?.name || parsed.beneficiaryMlaId}. Pickup: ${newRequest.pickupLocation} → Drop: ${newRequest.dropLocation} (${newRequest.preferredClass}). System auto-allocation initiated.`;

    return {
      success: true,
      reply,
      request: newRequest,
    };
  };

  const resetData = () => {
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setVehicles(INITIAL_VEHICLES);
    setRequests(INITIAL_REQUESTS);
    setPaLogs(INITIAL_PA_LOGS);
    setOverrideLogs(INITIAL_OVERRIDE_LOGS);
    localStorage.removeItem(`${STORAGE_KEY}_users`);
    localStorage.removeItem(`${STORAGE_KEY}_currentUser`);
    localStorage.removeItem(`${STORAGE_KEY}_vehicles`);
    localStorage.removeItem(`${STORAGE_KEY}_requests`);
    localStorage.removeItem(`${STORAGE_KEY}_paLogs`);
    localStorage.removeItem(`${STORAGE_KEY}_overrideLogs`);
  };

  return (
    <VehicleDeskContext.Provider
      value={{
        currentUser,
        users,
        vehicles,
        requests,
        paLogs,
        overrideLogs,
        language,
        t,
        loginUser,
        loginWithPhone,
        logout,
        toggleLanguage,
        createBooking,
        updateVehicleStatusByDriver,
        progressTripStage,
        forceAssign,
        autoAssignPending,
        managePA,
        sendWhatsAppBookingMessage,
        resetData,
      }}
    >
      {children}
    </VehicleDeskContext.Provider>
  );
};

export const useVehicleDesk = () => {
  const context = useContext(VehicleDeskContext);
  if (!context) {
    throw new Error('useVehicleDesk must be used within VehicleDeskProvider');
  }
  return context;
};
