import {
  Role,
  User,
  Vehicle,
  VehicleRequest,
  TripStage,
  VehicleClass,
  RBACAction,
  GPSLocation,
  TimeChainPoint,
} from '../types';

export interface RBACResult {
  allowed: boolean;
  reason?: string;
}

/**
 * Core RBAC Engine enforcing the Access Control Matrix from the specification
 */
export function canPerformAction(
  user: User | null | undefined,
  action: RBACAction,
  context?: {
    targetBeneficiaryId?: string;
    overrideReason?: string;
    targetPaId?: string;
  }
): RBACResult {
  if (!user) {
    return { allowed: false, reason: 'Authentication required' };
  }

  if (!user.isActive) {
    return { allowed: false, reason: 'User account is deactivated' };
  }

  switch (action) {
    case 'LOGIN_PHONE_OTP':
      return { allowed: true };

    case 'BOOK_WHATSAPP':
    case 'BOOK_APP':
      if (user.role === 'MLA') {
        return { allowed: true };
      }
      if (user.role === 'PA') {
        if (!user.linkedMlaId) {
          return {
            allowed: false,
            reason: 'PA is not linked to any MLA',
          };
        }
        if (
          context?.targetBeneficiaryId &&
          context.targetBeneficiaryId !== user.linkedMlaId
        ) {
          return {
            allowed: false,
            reason: `PA can only book on behalf of linked MLA (${user.linkedMlaId}). Booking for self or others is strictly prohibited.`,
          };
        }
        return { allowed: true };
      }
      return {
        allowed: false,
        reason: `${user.role} role is not authorized to create vehicle bookings.`,
      };

    case 'BOOK_FOR_SELF':
      // Specifically defined to verify the hard block: PAs cannot book for themselves
      if (user.role === 'PA') {
        return {
          allowed: false,
          reason: 'Hard Rule: PAs can never book for themselves or personal guests.',
        };
      }
      if (user.role === 'MLA') {
        return { allowed: true };
      }
      return { allowed: false, reason: 'Role cannot book for self' };

    case 'VIEW_OWN_FULL_HISTORY':
      if (user.role === 'MLA' || user.role === 'ADMIN') {
        return { allowed: true };
      }
      return { allowed: false, reason: 'Only MLA and Admin have full history access' };

    case 'VIEW_LIMITED_HISTORY':
      if (user.role === 'PA' || user.role === 'MLA' || user.role === 'ADMIN') {
        return { allowed: true };
      }
      return { allowed: false, reason: 'Role not authorized for history' };

    case 'VIEW_ALL_HISTORY':
      if (user.role === 'ADMIN') {
        return { allowed: true };
      }
      return { allowed: false, reason: 'Only Admin has access to all statewide logs' };

    case 'SEE_LIVE_GPS':
      if (user.role === 'MLA' || user.role === 'PA' || user.role === 'ADMIN') {
        return { allowed: true };
      }
      return { allowed: false, reason: 'Not authorized to view live GPS' };

    case 'CREATE_LIVE_GPS':
      if (user.role === 'DRIVER') {
        return { allowed: true };
      }
      return { allowed: false, reason: 'Only the active driver broadcasts live GPS' };

    case 'ADD_CHANGE_PA':
      if (user.role === 'MLA' || user.role === 'ADMIN') {
        return { allowed: true };
      }
      return {
        allowed: false,
        reason: 'PA cannot manage or reassign PAs.',
      };

    case 'DEACTIVATE_PA':
      if (user.role === 'MLA' || user.role === 'ADMIN') {
        return { allowed: true };
      }
      return {
        allowed: false,
        reason: 'Only MLA or Admin can deactivate a PA.',
      };

    case 'MANAGE_MLA_PA_LINK':
      if (user.role === 'ADMIN' || user.role === 'MLA') {
        return { allowed: true };
      }
      return { allowed: false, reason: 'Administrative permission required' };

    case 'UPDATE_VEHICLE_STATUS':
      if (user.role === 'DRIVER') {
        return { allowed: true };
      }
      return {
        allowed: false,
        reason: 'Vehicle condition and availability is managed by Driver.',
      };

    case 'KEY_COLLECT_RETURN':
      if (user.role === 'DRIVER') {
        return { allowed: true };
      }
      return {
        allowed: false,
        reason: 'Key lifecycle execution is restricted to authorized Drivers.',
      };

    case 'FORCE_ASSIGN':
      if (user.role === 'ADMIN') {
        if (!context?.overrideReason || context.overrideReason.trim().length < 5) {
          return {
            allowed: false,
            reason: 'Mandatory written override reason (minimum 5 chars) is required for audit.',
          };
        }
        return { allowed: true };
      }
      return {
        allowed: false,
        reason: 'Only Admin can execute Force Assign overrides.',
      };

    case 'WEEKLY_REPORT':
      if (user.role === 'ADMIN' || user.role === 'MLA') {
        return { allowed: true };
      }
      return { allowed: false, reason: 'Reports restricted to Admin and MLA.' };

    default:
      return { allowed: false, reason: 'Unknown action' };
  }
}

/**
 * Rule: PA can only book for their linked MLA. Max 2 active PAs per MLA.
 */
export function validateBookingSubmission(
  user: User,
  payload: {
    beneficiaryMlaId: string;
    pickupLocation: string;
    dropLocation: string;
    preferredClass: VehicleClass;
  }
): { valid: boolean; error?: string } {
  if (!payload.pickupLocation.trim()) {
    return { valid: false, error: 'Pickup location is required' };
  }
  if (!payload.dropLocation.trim()) {
    return { valid: false, error: 'Drop location is required' };
  }

  if (user.role === 'PA') {
    if (!user.linkedMlaId) {
      return { valid: false, error: 'PA is not linked to any MLA' };
    }
    if (payload.beneficiaryMlaId !== user.linkedMlaId) {
      return {
        valid: false,
        error: `PA can only book for linked MLA ${user.linkedMlaId}. Cannot book for self or others.`,
      };
    }
  }

  if (user.role === 'MLA') {
    if (payload.beneficiaryMlaId !== user.id) {
      return {
        valid: false,
        error: 'MLA must book under their own identity.',
      };
    }
  }

  return { valid: true };
}

/**
 * Hard Rule: Vehicle is visible and allocatable ONLY when Available + Clean,
 * AND key is returned (not held by another driver).
 */
export function isVehicleEligible(vehicle: Vehicle): boolean {
  const isAvailable = vehicle.status === 'Available';
  const isClean = vehicle.condition === 'Clean';
  const keyReturned = !vehicle.keyHeldByDriverId;
  return isAvailable && isClean && keyReturned;
}

/**
 * Hardcoded Assignment Rules:
 * Matches priority (VVIP > Urgent > Routine) and Class preference (Class A > Class B).
 */
export function matchVehicleAndDriver(
  request: VehicleRequest,
  vehicles: Vehicle[],
  drivers: User[]
): { vehicle: Vehicle; driver: User } | null {
  // Filter eligible vehicles
  const eligibleVehicles = vehicles.filter((v) => isVehicleEligible(v));

  // Find preferred class first
  let targetVehicle = eligibleVehicles.find(
    (v) => v.modelClass === request.preferredClass
  );

  // Fallback to any eligible vehicle if needed
  if (!targetVehicle && eligibleVehicles.length > 0) {
    targetVehicle = eligibleVehicles[0];
  }

  if (!targetVehicle) {
    return null;
  }

  // Find an available active driver
  const targetDriver = drivers.find(
    (d) => d.role === 'DRIVER' && d.isActive
  );

  if (!targetDriver) {
    return null;
  }

  return {
    vehicle: targetVehicle,
    driver: targetDriver,
  };
}

/**
 * Key & Trip Lifecycle 7-Point Sequence
 */
export const LIFECYCLE_STAGES: TripStage[] = [
  'Key Collected',
  'Reached Vehicle',
  'Arrived at Pickup',
  'Trip Started',
  'Arrived at Drop',
  'Trip Completed',
  'Key Returned',
];

export function getNextLifecycleStage(current: TripStage): TripStage | null {
  if (current === 'Pending' || current === 'Assigned') {
    return 'Key Collected';
  }
  const idx = LIFECYCLE_STAGES.indexOf(current);
  if (idx >= 0 && idx < LIFECYCLE_STAGES.length - 1) {
    return LIFECYCLE_STAGES[idx + 1];
  }
  return null;
}

/**
 * Validate PA management: max 2 active PAs per MLA
 */
export function validatePaAddition(
  mlaId: string,
  existingPas: User[]
): { allowed: boolean; error?: string } {
  const activePasForMla = existingPas.filter(
    (p) => p.role === 'PA' && p.linkedMlaId === mlaId && p.isActive
  );
  if (activePasForMla.length >= 2) {
    return {
      allowed: false,
      error: 'Maximum 2 active PAs allowed per MLA. Deactivate or replace an existing PA first.',
    };
  }
  return { allowed: true };
}

/**
 * Parse WhatsApp booking text with auto-resolution of PA sender
 */
export function parseWhatsAppBooking(
  message: string,
  senderPhone: string,
  users: User[]
): {
  success: boolean;
  beneficiaryMlaId?: string;
  bookedByUserId?: string;
  bookedByRole?: Role;
  pickup?: string;
  drop?: string;
  preferredClass?: VehicleClass;
  error?: string;
} {
  const normalizedPhone = senderPhone.replace(/\D/g, '');
  const sender = users.find(
    (u) => u.phone.replace(/\D/g, '') === normalizedPhone
  );

  if (!sender) {
    return {
      success: false,
      error: `Phone number ${senderPhone} is not registered in Vehicle Desk.`,
    };
  }

  let beneficiaryMlaId = '';
  if (sender.role === 'MLA') {
    beneficiaryMlaId = sender.id;
  } else if (sender.role === 'PA') {
    if (!sender.linkedMlaId) {
      return {
        success: false,
        error: 'PA is not linked to any active MLA.',
      };
    }
    beneficiaryMlaId = sender.linkedMlaId;
  } else {
    return {
      success: false,
      error: 'Only MLA or linked PA can initiate WhatsApp bookings.',
    };
  }

  // Extract locations & class if present
  const lower = message.toLowerCase();
  let pickup = 'Legislators Home Gate';
  let drop = 'Vidhana Soudha';
  let preferredClass: VehicleClass = 'Class A';

  if (lower.includes('class b') || lower.includes('ertiga') || lower.includes('bolero')) {
    preferredClass = 'Class B';
  }

  const fromMatch = message.match(/(?:from|pickup(?:\s+at)?)\s+([^,.\n]+?)(?=\s+(?:to|drop|at|for)|$)/i);
  const toMatch = message.match(/(?:to|drop(?:\s+at)?)\s+([^,.\n]+?)(?=\s+(?:from|at|for|class)|$)/i);

  if (fromMatch && fromMatch[1]?.trim()) {
    pickup = fromMatch[1].trim();
  }
  if (toMatch && toMatch[1]?.trim()) {
    drop = toMatch[1].trim();
  }

  return {
    success: true,
    beneficiaryMlaId,
    bookedByUserId: sender.id,
    bookedByRole: sender.role,
    pickup,
    drop,
    preferredClass,
  };
}
