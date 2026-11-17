import test from 'node:test';
import assert from 'node:assert/strict';
import {
  canPerformAction,
  validateBookingSubmission,
  isVehicleEligible,
  matchVehicleAndDriver,
  getNextLifecycleStage,
  validatePaAddition,
  parseWhatsAppBooking,
  LIFECYCLE_STAGES,
} from './rules';
import { User, Vehicle, VehicleRequest } from '../types';

// Mock users based on developer brief specs
const mockMla: User = {
  id: 'MLA-001',
  name: 'Shri. R. Patil',
  nameKn: 'ಶ್ರೀ. ಆರ್. ಪಾಟೀಲ್',
  phone: '+91 98765 43210',
  role: 'MLA',
  isActive: true,
};

const mockPa: User = {
  id: 'PA-A1',
  name: 'Ramesh K.',
  nameKn: 'ರಮೇಶ್ ಕೆ.',
  phone: '+91 98450 11223',
  role: 'PA',
  linkedMlaId: 'MLA-001',
  isActive: true,
};

const mockDriver: User = {
  id: 'Driver-D12',
  name: 'Basavaraj',
  nameKn: 'ಬಸವರಾಜ್',
  phone: '+91 94480 99887',
  role: 'DRIVER',
  isActive: true,
};

const mockAdmin: User = {
  id: 'Admin-AD01',
  name: 'Desk Officer',
  nameKn: 'ಡೆಸ್ಕ್ ಆಫೀಸರ್',
  phone: '+91 80220 34000',
  role: 'ADMIN',
  isActive: true,
};

test('RBAC: PA CANNOT book for self or unlinked MLA (Hard Rule)', () => {
  // Booking for self
  const selfCheck = canPerformAction(mockPa, 'BOOK_FOR_SELF');
  assert.equal(selfCheck.allowed, false, 'PA must be blocked from self-booking');

  // Booking for linked MLA
  const linkedCheck = canPerformAction(mockPa, 'BOOK_APP', {
    targetBeneficiaryId: 'MLA-001',
  });
  assert.equal(linkedCheck.allowed, true, 'PA can book for linked MLA');

  // Booking for another MLA
  const unlinkedCheck = canPerformAction(mockPa, 'BOOK_APP', {
    targetBeneficiaryId: 'MLA-002',
  });
  assert.equal(unlinkedCheck.allowed, false, 'PA cannot book for unlinked MLA');
});

test('RBAC: MLA has full view, can manage PAs and view own full history', () => {
  assert.equal(canPerformAction(mockMla, 'VIEW_OWN_FULL_HISTORY').allowed, true);
  assert.equal(canPerformAction(mockMla, 'ADD_CHANGE_PA').allowed, true);
  assert.equal(canPerformAction(mockMla, 'SEE_LIVE_GPS').allowed, true);
  assert.equal(canPerformAction(mockMla, 'UPDATE_VEHICLE_STATUS').allowed, false);
});

test('RBAC: Driver manages vehicle status & key lifecycle only', () => {
  assert.equal(canPerformAction(mockDriver, 'UPDATE_VEHICLE_STATUS').allowed, true);
  assert.equal(canPerformAction(mockDriver, 'KEY_COLLECT_RETURN').allowed, true);
  assert.equal(canPerformAction(mockDriver, 'CREATE_LIVE_GPS').allowed, true);
  assert.equal(canPerformAction(mockDriver, 'BOOK_APP').allowed, false);
  assert.equal(canPerformAction(mockDriver, 'FORCE_ASSIGN').allowed, false);
});

test('RBAC: Admin Force Assign requires mandatory written reason', () => {
  // Without reason
  const failCheck = canPerformAction(mockAdmin, 'FORCE_ASSIGN');
  assert.equal(failCheck.allowed, false, 'Force assign without reason must fail');

  // With short reason (<5 chars)
  const shortCheck = canPerformAction(mockAdmin, 'FORCE_ASSIGN', {
    overrideReason: 'urg',
  });
  assert.equal(shortCheck.allowed, false, 'Too short reason must fail');

  // With valid reason
  const passCheck = canPerformAction(mockAdmin, 'FORCE_ASSIGN', {
    overrideReason: 'Emergency Assembly Session call for MLA',
  });
  assert.equal(passCheck.allowed, true, 'Force assign with valid reason must succeed');
});

test('Vehicle Eligibility: Only Available + Clean and Key Returned is allocatable', () => {
  const cleanAvailable: Vehicle = {
    id: 'KA-01-AB-1234',
    model: 'Innova Hycross',
    modelClass: 'Class A',
    status: 'Available',
    condition: 'Clean',
    currentMileageKm: 12000,
    lastCleanedTime: '2026-10-29T08:00:00Z',
  };

  assert.equal(isVehicleEligible(cleanAvailable), true);

  // Needs cleaning
  assert.equal(
    isVehicleEligible({ ...cleanAvailable, condition: 'Needs Cleaning' }),
    false,
    'Unclean vehicle must not appear available'
  );

  // Busy status
  assert.equal(
    isVehicleEligible({ ...cleanAvailable, status: 'Busy' }),
    false,
    'Busy vehicle must not appear available'
  );

  // Key held by driver
  assert.equal(
    isVehicleEligible({ ...cleanAvailable, keyHeldByDriverId: 'Driver-D12' }),
    false,
    'Vehicle with unreturned key must not appear available'
  );
});

test('PA Limit: MLA can have maximum 2 active PAs', () => {
  const existingPas: User[] = [
    { ...mockPa, id: 'PA-A1', isActive: true },
    { ...mockPa, id: 'PA-A2', isActive: true },
  ];

  const checkFail = validatePaAddition('MLA-001', existingPas);
  assert.equal(checkFail.allowed, false, 'Should reject 3rd PA');

  // With 1 active and 1 deactivated
  const checkPass = validatePaAddition('MLA-001', [
    { ...mockPa, id: 'PA-A1', isActive: true },
    { ...mockPa, id: 'PA-A2', isActive: false },
  ]);
  assert.equal(checkPass.allowed, true, 'Should allow 2nd active PA');
});

test('Lifecycle: 7-point sequence progresses strictly and finishes with Key Returned', () => {
  assert.equal(getNextLifecycleStage('Pending'), 'Key Collected');
  assert.equal(getNextLifecycleStage('Key Collected'), 'Reached Vehicle');
  assert.equal(getNextLifecycleStage('Reached Vehicle'), 'Arrived at Pickup');
  assert.equal(getNextLifecycleStage('Arrived at Pickup'), 'Trip Started');
  assert.equal(getNextLifecycleStage('Trip Started'), 'Arrived at Drop');
  assert.equal(getNextLifecycleStage('Arrived at Drop'), 'Trip Completed');
  assert.equal(getNextLifecycleStage('Trip Completed'), 'Key Returned');
  assert.equal(getNextLifecycleStage('Key Returned'), null);
});

test('WhatsApp Dual-Channel: auto-resolves PA sender to linked MLA', () => {
  const users = [mockMla, mockPa, mockDriver, mockAdmin];

  // PA WhatsApp message
  const parsed = parseWhatsAppBooking(
    'Need Innova from Legislators Home Gate to Vidhana Soudha at 10:30 AM',
    '+91 98450 11223',
    users
  );

  assert.equal(parsed.success, true);
  assert.equal(parsed.beneficiaryMlaId, 'MLA-001');
  assert.equal(parsed.bookedByUserId, 'PA-A1');
  assert.equal(parsed.bookedByRole, 'PA');
  assert.equal(parsed.pickup, 'Legislators Home Gate');
  assert.equal(parsed.drop, 'Vidhana Soudha');
});
