export type Role = 'MLA' | 'PA' | 'DRIVER' | 'ADMIN';

export type Language = 'en' | 'kn';

export type VehicleClass = 'Class A' | 'Class B';

export type VehicleStatus = 'Available' | 'Busy' | 'Off' | 'Maintenance';

export type VehicleCondition = 'Clean' | 'Needs Cleaning';

export type TripStage =
  | 'Pending'
  | 'Assigned'
  | 'Key Collected'
  | 'Reached Vehicle'
  | 'Arrived at Pickup'
  | 'Trip Started'
  | 'Arrived at Drop'
  | 'Trip Completed'
  | 'Key Returned'
  | 'Cancelled';

export interface GPSLocation {
  lat: number;
  lng: number;
  address: string;
}

export interface TimeChainPoint {
  stage: TripStage;
  timestamp: string;
  gps?: GPSLocation;
  actorId: string;
  actorRole: Role;
  notes?: string;
}

export interface User {
  id: string; // e.g., 'MLA-001', 'PA-A1', 'Driver-D12', 'Admin-AD01'
  name: string;
  nameKn: string;
  phone: string;
  role: Role;
  linkedMlaId?: string; // For PA: strictly bound to this MLA
  constituency?: string;
  designation?: string;
  isActive: boolean;
  avatar?: string;
}

export interface Vehicle {
  id: string; // Registration e.g., 'KA-01-AB-1234'
  model: string;
  modelClass: VehicleClass; // 'Class A' (Innova / Fortuner) or 'Class B' (Ertiga / Bolero)
  status: VehicleStatus;
  condition: VehicleCondition;
  currentDriverId?: string;
  keyHeldByDriverId?: string; // key lifecycle tracking: if set, vehicle is locked!
  currentMileageKm: number;
  lastCleanedTime: string;
}

export interface VehicleRequest {
  id: string; // e.g. 'REQ-1001'
  requestedByUserId: string; // Can be MLA or PA
  requestedByRole: Role;
  beneficiaryMlaId: string; // MUST always be the MLA! Hard rule: PA cannot book for self.
  pickupLocation: string;
  dropLocation: string;
  scheduledTime: string;
  preferredClass: VehicleClass;
  urgency: 'Routine' | 'Urgent' | 'VVIP Assembly Protocol';
  channel: 'App' | 'WhatsApp';
  status: TripStage;
  assignedVehicleId?: string;
  assignedDriverId?: string;
  timeChain: TimeChainPoint[];
  liveGps?: GPSLocation;
  liveGpsShareUrl?: string;
  isForceAssigned?: boolean;
  forceAssignReason?: string;
  forceAssignedBy?: string;
  createdAt: string;
}

export interface PALog {
  id: string;
  timestamp: string;
  mlaId: string;
  action: 'ADD' | 'REMOVE' | 'REPLACE' | 'NUMBER_CHANGE' | 'DEACTIVATE';
  oldPaId?: string;
  oldPaPhone?: string;
  newPaId?: string;
  newPaPhone?: string;
  changedByUserId: string;
  reason: string;
}

export interface OverrideLog {
  id: string;
  timestamp: string;
  requestId: string;
  adminId: string;
  previousVehicleId?: string;
  previousDriverId?: string;
  assignedVehicleId: string;
  assignedDriverId: string;
  reason: string;
  priorityBypass: boolean;
}

export type RBACAction =
  | 'LOGIN_PHONE_OTP'
  | 'BOOK_WHATSAPP'
  | 'BOOK_APP'
  | 'VIEW_OWN_FULL_HISTORY'
  | 'VIEW_LIMITED_HISTORY'
  | 'VIEW_ALL_HISTORY'
  | 'SEE_LIVE_GPS'
  | 'CREATE_LIVE_GPS'
  | 'ADD_CHANGE_PA'
  | 'UPDATE_VEHICLE_STATUS'
  | 'KEY_COLLECT_RETURN'
  | 'FORCE_ASSIGN'
  | 'WEEKLY_REPORT'
  | 'DEACTIVATE_PA'
  | 'BOOK_FOR_SELF' // Specifically tested to ensure PA gets FALSE
  | 'MANAGE_MLA_PA_LINK';

export interface RBACMatrixEntry {
  action: RBACAction;
  label: string;
  labelKn: string;
  mla: boolean;
  pa: boolean | 'RESTRICTED';
  driver: boolean | 'CREATE';
  admin: boolean | 'OVERRIDE_REQUIRED';
  notes: string;
}
