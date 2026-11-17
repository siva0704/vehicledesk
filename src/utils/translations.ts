export interface Translations {
  appTitle: string;
  appSubtitle: string;
  loginWithPhone: string;
  phonePlaceholder: string;
  sendOtp: string;
  verifyOtp: string;
  otpPlaceholder: string;
  exampleUsers: string;
  fullView: string;
  bookingOnly: string;
  driverExecution: string;
  adminControl: string;
  requestVehicle: string;
  availableNow: string;
  allVehicles: string;
  myTrips: string;
  myPAs: string;
  liveBoard: string;
  pendingRequests: string;
  vehiclesStatus: string;
  forceAssign: string;
  keyCollected: string;
  reachedVehicle: string;
  arrivedPickup: string;
  tripStarted: string;
  arrivedDrop: string;
  tripCompleted: string;
  keyReturned: string;
  currentStatus: string;
  vehicleCondition: string;
  available: string;
  busy: string;
  off: string;
  maintenance: string;
  clean: string;
  needsCleaning: string;
  keyActions: string;
  submitRequest: string;
  pickup: string;
  drop: string;
  preferredClass: string;
  dateTime: string;
  paBookingNotice: string;
  hardRuleNotice: string;
  rbacMatrix: string;
  whatsappDesk: string;
  swimlane: string;
  auditTrail: string;
  weeklyFairness: string;
  logout: string;
  switchPersona: string;
  viewLiveGps: string;
  viewTimeChain: string;
  languageToggle: string;
  reasonRequired: string;
  managePAs: string;
  activePAsCount: string;
  addPA: string;
  replacePA: string;
  deactivate: string;
  changePhone: string;
}

export const TRANSLATIONS: Record<'en' | 'kn', Translations> = {
  en: {
    appTitle: 'Vehicle Desk',
    appSubtitle: 'VIP/MLA Fleet & Key Allocation System',
    loginWithPhone: 'Login with Phone',
    phonePlaceholder: '+91 98765 43210',
    sendOtp: 'Send OTP',
    verifyOtp: 'Verify OTP & Enter',
    otpPlaceholder: 'Enter 6-digit OTP (e.g. 123456)',
    exampleUsers: 'Example Users (Quick Switch)',
    fullView: 'Full View Access',
    bookingOnly: 'Booking on behalf of MLA',
    driverExecution: 'Driver Status & Key Lifecycle',
    adminControl: 'Live Board & Fleet Control',
    requestVehicle: 'Request Vehicle',
    availableNow: 'Available Now (Available + Clean)',
    allVehicles: 'All Fleet Vehicles',
    myTrips: 'My Trips',
    myPAs: 'My Personal Assistants',
    liveBoard: 'Live Board',
    pendingRequests: 'Pending Requests',
    vehiclesStatus: 'Vehicles Status',
    forceAssign: 'Force Assign (Reason Required)',
    keyCollected: 'Key Collected',
    reachedVehicle: 'Reached Vehicle',
    arrivedPickup: 'Arrived at Pickup',
    tripStarted: 'Trip Started',
    arrivedDrop: 'Arrived at Drop',
    tripCompleted: 'Trip Completed',
    keyReturned: 'Key Returned',
    currentStatus: 'Current Status',
    vehicleCondition: 'Vehicle Condition',
    available: 'Available',
    busy: 'Busy',
    off: 'Off Duty',
    maintenance: 'Maintenance',
    clean: 'Clean',
    needsCleaning: 'Needs Cleaning',
    keyActions: 'Key & Trip Lifecycle Actions',
    submitRequest: 'Submit Request',
    pickup: 'Pickup Location',
    drop: 'Drop Location',
    preferredClass: 'Preferred Class',
    dateTime: 'Date & Time',
    paBookingNotice: 'Note: You can only book on behalf of your linked MLA.',
    hardRuleNotice: 'Hard Rule: PAs can never book for themselves. Every request is permanently linked to the MLA.',
    rbacMatrix: 'Access Control Matrix (RBAC)',
    whatsappDesk: 'WhatsApp Official Desk',
    swimlane: 'Personas Swimlane',
    auditTrail: 'Audit & Override Logs',
    weeklyFairness: 'Weekly Fairness Report',
    logout: 'Logout',
    switchPersona: 'Switch Role / Persona',
    viewLiveGps: 'Live GPS Location',
    viewTimeChain: '7-Point Time Chain',
    languageToggle: 'ಕನ್ನಡ',
    reasonRequired: 'Mandatory written reason is required for administrative override',
    managePAs: 'Manage Personal Assistants (Max 2)',
    activePAsCount: 'Active PAs',
    addPA: 'Add New PA',
    replacePA: 'Replace PA',
    deactivate: 'Deactivate',
    changePhone: 'Update WhatsApp Number',
  },
  kn: {
    appTitle: 'ವೆಹಿಕಲ್ ಡೆಸ್ಕ್ (Vehicle Desk)',
    appSubtitle: 'ವಿಐಪಿ / ಶಾಸಕರ ವಾಹನ ಹಂಚಿಕೆ ಮತ್ತು ಕೀ ನಿರ್ವಹಣಾ ವ್ಯವಸ್ಥೆ',
    loginWithPhone: 'ದೂರವಾಣಿ ಮೂಲಕ ಲಾಗಿನ್ ಮಾಡಿ',
    phonePlaceholder: '+91 98765 43210',
    sendOtp: 'OTP ಕಳುಹಿಸಿ',
    verifyOtp: 'OTP ಪರಿಶೀಲಿಸಿ ಲಾಗಿನ್ ಮಾಡಿ',
    otpPlaceholder: '6 ಅಂಕಿಗಳ OTP ನಮೂದಿಸಿ (ಉದಾ: 123456)',
    exampleUsers: 'ಮಾದರಿ ಬಳಕೆದಾರರು (ತ್ವರಿತ ಆಯ್ಕೆ)',
    fullView: 'ಪೂರ್ಣ ವೀಕ್ಷಣೆ ಪ್ರವೇಶ',
    bookingOnly: 'ಶಾಸಕರ ಪರವಾಗಿ ಮಾತ್ರ ಬುಕಿಂಗ್',
    driverExecution: 'ಚಾಲಕ ಸ್ಥಿತಿ ಮತ್ತು ಕೀ ಹಂತಗಳು',
    adminControl: 'ಲೈವ್ ಬೋರ್ಡ್ ಮತ್ತು ಆಡಳಿತ ನಿಯಂತ್ರಣ',
    requestVehicle: 'ವಾಹನ ವಿನಂತಿಸಿ',
    availableNow: 'ಈಗ ಲಭ್ಯವಿದೆ (ಸ್ವಚ್ಛ + ಲಭ್ಯ)',
    allVehicles: 'ಎಲ್ಲಾ ವಾಹನಗಳು',
    myTrips: 'ನನ್ನ ಪ್ರವಾಸಗಳು',
    myPAs: 'ನನ್ನ ಆಪ್ತ ಸಹಾಯಕರು (PA)',
    liveBoard: 'ಲೈವ್ ಬೋರ್ಡ್',
    pendingRequests: 'ಬಾಕಿ ಉಳಿದಿರುವ ವಿನಂತಿಗಳು',
    vehiclesStatus: 'ವಾಹನಗಳ ಪ್ರಸ್ತುತ ಸ್ಥಿತಿ',
    forceAssign: 'ಬಲವಂತದ ನಿಯೋಜನೆ (ಕಾರಣ ಕಡ್ಡಾಯ)',
    keyCollected: 'ಕೀ ಸಂಗ್ರಹಿಸಲಾಗಿದೆ',
    reachedVehicle: 'ವಾಹನ ತಲುಪಲಾಗಿದೆ',
    arrivedPickup: 'ಪಿಕ್ಅಪ್ ಸ್ಥಳ ತಲುಪಿದೆ',
    tripStarted: 'ಪ್ರವಾಸ ಪ್ರಾರಂಭವಾಯಿತು',
    arrivedDrop: 'ಡ್ರಾಪ್ ಸ್ಥಳ ತಲುಪಿದೆ',
    tripCompleted: 'ಪ್ರವಾಸ ಪೂರ್ಣಗೊಂಡಿದೆ',
    keyReturned: 'ಕೀ ಹಿಂತಿರುಗಿಸಲಾಗಿದೆ',
    currentStatus: 'ಪ್ರಸ್ತುತ ಸ್ಥಿತಿ',
    vehicleCondition: 'ವಾಹನದ ಸ್ವಚ್ಛತೆ ಸ್ಥಿತಿ',
    available: 'ಲಭ್ಯವಿದೆ',
    busy: 'ಕಾರ್ಯನಿರತ',
    off: 'ರಜೆ / ಕರ್ತವ್ಯದಲ್ಲಿಲ್ಲ',
    maintenance: 'ದುರಸ್ತಿಯಲ್ಲಿದೆ',
    clean: 'ಸ್ವಚ್ಛವಾಗಿದೆ',
    needsCleaning: 'ಸ್ವಚ್ಛಗೊಳಿಸಬೇಕಾಗಿದೆ',
    keyActions: 'ಕೀ ಮತ್ತು ಪ್ರವಾಸದ ಹಂತಗಳು',
    submitRequest: 'ವಿನಂತಿ ಸಲ್ಲಿಸಿ',
    pickup: 'ಪಿಕ್ಅಪ್ ಸ್ಥಳ',
    drop: 'ಡ್ರಾಪ್ ಸ್ಥಳ',
    preferredClass: 'ಆದ್ಯತೆಯ ವಾಹನ ವರ್ಗ',
    dateTime: 'ದಿನಾಂಕ ಮತ್ತು ಸಮಯ',
    paBookingNotice: 'ಸೂಚನೆ: ನಿಮ್ಮ ನಿಯೋಜಿತ ಶಾಸಕರ ಪರವಾಗಿ ಮಾತ್ರ ನೀವು ವಾಹನ ಬುಕ್ ಮಾಡಬಹುದು.',
    hardRuleNotice: 'ಮುಖ್ಯ ನಿಯಮ: ಆಪ್ತ ಸಹಾಯಕರು ಸ್ವಂತ ಬಳಕೆಗೆ ಬುಕ್ ಮಾಡಲು ಅವಕಾಶವಿಲ್ಲ. ಶಾಸಕರಿಗೆ ಪೂರ್ಣ ಪಾರದರ್ಶಕತೆ ಇರುತ್ತದೆ.',
    rbacMatrix: 'ಅನುಮತಿ ಕೋಷ್ಟಕ (RBAC ಮ್ಯಾಟ್ರಿಕ್ಸ್)',
    whatsappDesk: 'ಅಧಿಕೃತ ವಾಟ್ಸಾಪ್ ಡೆಸ್ಕ್',
    swimlane: 'ಪಾತ್ರಗಳ ಹರಿವು (Swimlane)',
    auditTrail: 'ಆಡಿಟ್ ಮತ್ತು ಓವರ್‌ರೈಡ್ ಲಾಗ್‌ಗಳು',
    weeklyFairness: 'ವಾರದ ನ್ಯಾಯಸಮ್ಮತ ವರದಿ',
    logout: 'ನಿರ್ಗಮಿಸಿ (Logout)',
    switchPersona: 'ಪಾತ್ರ ಬದಲಾಯಿಸಿ',
    viewLiveGps: 'ಲೈವ್ ಜಿಪಿಎಸ್ ವೀಕ್ಷಿಸಿ',
    viewTimeChain: '೭-ಹಂತಗಳ ಸಮಯ ಸರಪಳಿ',
    languageToggle: 'English',
    reasonRequired: 'ಆಡಳಿತಾತ್ಮಕ ನಿಯೋಜನೆಗೆ ಲಿಖಿತ ಕಾರಣ ಕಡ್ಡಾಯವಾಗಿದೆ',
    managePAs: 'ಆಪ್ತ ಸಹಾಯಕರ ನಿರ್ವಹಣೆ (ಗರಿಷ್ಠ ೨)',
    activePAsCount: 'ಸಕ್ರಿಯ ಆಪ್ತ ಸಹಾಯಕರು',
    addPA: 'ಹೊಸ PA ಸೇರಿಸಿ',
    replacePA: 'PA ಬದಲಾಯಿಸಿ',
    deactivate: 'ನಿಷ್ಕ್ರಿಯಗೊಳಿಸಿ',
    changePhone: 'ವಾಟ್ಸಾಪ್ ಸಂಖ್ಯೆ ನವೀಕರಿಸಿ',
  },
};
