/**
 * Queue Management Logic Module
 * Handles patient queue for clinic appointment system
 * 
 * Patient Types:
 * - app: App bookings (get sequential tokens)
 * - walkin: Walk-in patients (get sequential tokens)
 * - emergency: Emergency patients (priority, no normal token)
 * - enquiry: Enquiry visits (separate list, no queue)
 * 
 * Queue Priority:
 * 1. Emergency patients (FIFO among emergencies)
 * 2. Regular patients (app + walk-in ordered by token number)
 */

// In-memory data storage
let queue = [];
let enquiries = [];
let tokenCounter = 1;
let emergencyCounter = 1;

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Generate unique ID
 */
const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Get current timestamp
 */
const getCurrentTime = () => Date.now();

/**
 * Check if patient already exists in queue
 */
const patientExists = (patientId) => {
  return queue.some(p => p.id === patientId) || enquiries.some(p => p.id === patientId);
};

/**
 * Find patient by ID in queue
 */
const findPatientById = (patientId) => {
  return queue.find(p => p.id === patientId);
};

/**
 * Find enquiry by ID
 */
const findEnquiryById = (patientId) => {
  return enquiries.find(p => p.id === patientId);
};

// ============================================
// QUEUE STATE FUNCTIONS
// ============================================

/**
 * Reset the queue (useful for testing or daily reset)
 */
const resetQueue = () => {
  queue = [];
  enquiries = [];
  tokenCounter = 1;
  emergencyCounter = 1;
};

/**
 * Get current token counter value
 */
const getCurrentTokenCounter = () => tokenCounter;

/**
 * Set token counter (for restoring state)
 */
const setTokenCounter = (value) => {
  tokenCounter = value;
};

/**
 * Get all data (for persistence)
 */
const getState = () => ({
  queue: [...queue],
  enquiries: [...enquiries],
  tokenCounter,
  emergencyCounter
});

/**
 * Restore state (from persistence)
 */
const restoreState = (state) => {
  if (state.queue) queue = [...state.queue];
  if (state.enquiries) enquiries = [...state.enquiries];
  if (state.tokenCounter) tokenCounter = state.tokenCounter;
  if (state.emergencyCounter) emergencyCounter = state.emergencyCounter;
};

// ============================================
// ADD PATIENT FUNCTIONS
// ============================================

/**
 * Add an app booking patient to the queue
 * @param {Object} patient - Patient details
 * @returns {Object} - Added patient with token
 */
const addAppBooking = (patient) => {
  if (!patient) {
    throw new Error('Patient data is required');
  }

  const patientId = patient.id || generateId();
  
  if (patientExists(patientId)) {
    throw new Error('Patient already exists in queue');
  }

  const newPatient = {
    id: patientId,
    name: patient.name || 'Unknown',
    phone: patient.phone || null,
    tokenNumber: tokenCounter++,
    visitType: 'app',
    status: 'waiting',
    arrivalTime: patient.arrivalTime || getCurrentTime(),
    age: patient.age || null,
    gender: patient.gender || null,
    issue: patient.issue || '',
    symptoms: patient.symptoms || '',
    notes: patient.notes || ''
  };

  queue.push(newPatient);
  return { ...newPatient };
};

/**
 * Add a walk-in patient to the queue
 * @param {Object} patient - Patient details
 * @returns {Object} - Added patient with token
 */
const addWalkIn = (patient) => {
  if (!patient) {
    throw new Error('Patient data is required');
  }

  const patientId = patient.id || generateId();
  
  if (patientExists(patientId)) {
    throw new Error('Patient already exists in queue');
  }

  const newPatient = {
    id: patientId,
    name: patient.name || 'Unknown',
    phone: patient.phone || null,
    tokenNumber: tokenCounter++,
    visitType: 'walkin',
    status: 'waiting',
    arrivalTime: patient.arrivalTime || getCurrentTime(),
    age: patient.age || null,
    gender: patient.gender || null,
    issue: patient.issue || '',
    symptoms: patient.symptoms || '',
    notes: patient.notes || ''
  };

  queue.push(newPatient);
  return { ...newPatient };
};

/**
 * Add an emergency patient to the queue
 * Emergency patients do NOT use normal token sequence
 * They are placed at the front of the queue (after current patient if any)
 * @param {Object} patient - Patient details
 * @returns {Object} - Added patient
 */
const addEmergency = (patient) => {
  if (!patient) {
    throw new Error('Patient data is required');
  }

  const patientId = patient.id || generateId();
  
  if (patientExists(patientId)) {
    throw new Error('Patient already exists in queue');
  }

  const newPatient = {
    id: patientId,
    name: patient.name || 'Emergency Patient',
    phone: patient.phone || null,
    tokenNumber: null, // Emergency patients don't get regular tokens
    emergencyNumber: emergencyCounter++, // Internal tracking for FIFO among emergencies
    visitType: 'emergency',
    status: 'waiting',
    arrivalTime: patient.arrivalTime || getCurrentTime(),
    age: patient.age || null,
    gender: patient.gender || null,
    issue: patient.issue || 'Emergency',
    symptoms: patient.symptoms || '',
    notes: patient.notes || ''
  };

  queue.push(newPatient);
  return { ...newPatient };
};

/**
 * Add an enquiry visit (not part of medical queue)
 * @param {Object} patient - Visitor details
 * @returns {Object} - Added enquiry
 */
const addEnquiry = (patient) => {
  if (!patient) {
    throw new Error('Visitor data is required');
  }

  const visitorId = patient.id || generateId();
  
  if (patientExists(visitorId)) {
    throw new Error('Visitor already exists');
  }

  const newEnquiry = {
    id: visitorId,
    name: patient.name || 'Visitor',
    phone: patient.phone || null,
    tokenNumber: null, // Enquiries don't get tokens
    visitType: 'enquiry',
    status: 'completed', // Enquiries are immediately marked as completed
    arrivalTime: patient.arrivalTime || getCurrentTime(),
    purpose: patient.purpose || patient.issue || ''
  };

  enquiries.push(newEnquiry);
  return { ...newEnquiry };
};

// ============================================
// QUEUE RETRIEVAL FUNCTIONS
// ============================================

/**
 * Get ordered queue list
 * Priority: Emergency (FIFO) > Regular (by token number)
 * @returns {Array} - Ordered queue
 */
const getQueueList = () => {
  // Separate emergencies and regular patients
  const emergencies = queue
    .filter(p => p.visitType === 'emergency' && p.status !== 'completed')
    .sort((a, b) => a.emergencyNumber - b.emergencyNumber);

  const regular = queue
    .filter(p => p.visitType !== 'emergency' && p.status !== 'completed')
    .sort((a, b) => a.tokenNumber - b.tokenNumber);

  // Find current patient (status === 'inside')
  const currentPatient = queue.find(p => p.status === 'inside');

  // Build ordered list
  let orderedQueue = [];

  // Current patient first (if any)
  if (currentPatient) {
    orderedQueue.push(currentPatient);
  }

  // Then waiting emergencies
  const waitingEmergencies = emergencies.filter(p => p.status === 'waiting');
  orderedQueue = orderedQueue.concat(waitingEmergencies);

  // Then waiting regular patients
  const waitingRegular = regular.filter(p => p.status === 'waiting');
  orderedQueue = orderedQueue.concat(waitingRegular);

  return orderedQueue;
};

/**
 * Get all patients (including completed)
 * @returns {Array} - All patients in queue
 */
const getAllPatients = () => {
  return [...queue];
};

/**
 * Get waiting patients only
 * @returns {Array} - Waiting patients ordered by priority
 */
const getWaitingPatients = () => {
  const emergencies = queue
    .filter(p => p.visitType === 'emergency' && p.status === 'waiting')
    .sort((a, b) => a.emergencyNumber - b.emergencyNumber);

  const regular = queue
    .filter(p => p.visitType !== 'emergency' && p.status === 'waiting')
    .sort((a, b) => a.tokenNumber - b.tokenNumber);

  return [...emergencies, ...regular];
};

/**
 * Get completed patients
 * @returns {Array} - Completed patients
 */
const getCompletedPatients = () => {
  return queue.filter(p => p.status === 'completed');
};

/**
 * Get the patient currently being served (status === 'inside')
 * @returns {Object|null} - Current patient or null
 */
const getNowServing = () => {
  return queue.find(p => p.status === 'inside') || null;
};

/**
 * Get next patient in queue (first waiting patient by priority)
 * @returns {Object|null} - Next patient or null
 */
const getNextPatient = () => {
  // Check for waiting emergencies first
  const nextEmergency = queue
    .filter(p => p.visitType === 'emergency' && p.status === 'waiting')
    .sort((a, b) => a.emergencyNumber - b.emergencyNumber)[0];

  if (nextEmergency) return nextEmergency;

  // Then check for regular waiting patients
  const nextRegular = queue
    .filter(p => p.visitType !== 'emergency' && p.status === 'waiting')
    .sort((a, b) => a.tokenNumber - b.tokenNumber)[0];

  return nextRegular || null;
};

/**
 * Get all enquiries
 * @returns {Array} - All enquiries
 */
const getEnquiries = () => {
  return [...enquiries];
};

/**
 * Get queue statistics
 * @returns {Object} - Queue stats
 */
const getQueueStats = () => {
  const total = queue.length;
  const waiting = queue.filter(p => p.status === 'waiting').length;
  const inside = queue.filter(p => p.status === 'inside').length;
  const completed = queue.filter(p => p.status === 'completed').length;
  const emergencies = queue.filter(p => p.visitType === 'emergency' && p.status !== 'completed').length;
  const enquiryCount = enquiries.length;

  return {
    total,
    waiting,
    inside,
    completed,
    emergencies,
    enquiries: enquiryCount
  };
};

// ============================================
// PATIENT STATUS FUNCTIONS
// ============================================

/**
 * Mark a patient as 'inside' (currently with doctor)
 * @param {string} patientId - Patient ID
 * @returns {Object|null} - Updated patient or null
 */
const markPatientInside = (patientId) => {
  const patient = findPatientById(patientId);
  
  if (!patient) {
    throw new Error('Patient not found');
  }

  if (patient.status === 'completed') {
    throw new Error('Cannot mark completed patient as inside');
  }

  // Check if another patient is already inside
  const currentInside = getNowServing();
  if (currentInside && currentInside.id !== patientId) {
    throw new Error('Another patient is currently inside. Complete their visit first.');
  }

  patient.status = 'inside';
  patient.consultationStartTime = getCurrentTime();
  
  return { ...patient };
};

/**
 * Mark a patient as 'completed'
 * @param {string} patientId - Patient ID
 * @returns {Object} - Result with completed patient and next patient
 */
const completePatient = (patientId) => {
  const patient = findPatientById(patientId);
  
  if (!patient) {
    throw new Error('Patient not found');
  }

  if (patient.status === 'completed') {
    throw new Error('Patient already completed');
  }

  patient.status = 'completed';
  patient.completionTime = getCurrentTime();

  // Get next patient
  const nextPatient = getNextPatient();

  return {
    completedPatient: { ...patient },
    nextPatient: nextPatient ? { ...nextPatient } : null
  };
};

/**
 * Auto-advance: Complete current patient and start next
 * @param {string} patientId - Current patient ID to complete
 * @returns {Object} - Result with completed and now serving patients
 */
const completeAndAdvance = (patientId) => {
  const result = completePatient(patientId);
  
  if (result.nextPatient) {
    markPatientInside(result.nextPatient.id);
    return {
      completedPatient: result.completedPatient,
      nowServing: { ...findPatientById(result.nextPatient.id) }
    };
  }

  return {
    completedPatient: result.completedPatient,
    nowServing: null
  };
};

/**
 * Call next patient (mark as inside)
 * @returns {Object|null} - Patient now being served or null
 */
const callNextPatient = () => {
  // Check if someone is already inside
  const currentInside = getNowServing();
  if (currentInside) {
    throw new Error('Complete current patient first');
  }

  const nextPatient = getNextPatient();
  if (!nextPatient) {
    return null;
  }

  return markPatientInside(nextPatient.id);
};

/**
 * Reset patient status to waiting
 * @param {string} patientId - Patient ID
 * @returns {Object} - Updated patient
 */
const resetPatientStatus = (patientId) => {
  const patient = findPatientById(patientId);
  
  if (!patient) {
    throw new Error('Patient not found');
  }

  patient.status = 'waiting';
  delete patient.consultationStartTime;
  delete patient.completionTime;
  
  return { ...patient };
};

// ============================================
// PATIENT UPDATE FUNCTIONS
// ============================================

/**
 * Update patient details
 * @param {string} patientId - Patient ID
 * @param {Object} details - Details to update
 * @returns {Object} - Updated patient
 */
const updatePatientDetails = (patientId, details) => {
  const patient = findPatientById(patientId);
  
  if (!patient) {
    // Check if it's an enquiry
    const enquiry = findEnquiryById(patientId);
    if (enquiry) {
      Object.assign(enquiry, {
        name: details.name !== undefined ? details.name : enquiry.name,
        phone: details.phone !== undefined ? details.phone : enquiry.phone,
        purpose: details.purpose !== undefined ? details.purpose : enquiry.purpose
      });
      return { ...enquiry };
    }
    throw new Error('Patient not found');
  }

  // Update allowed fields
  const allowedFields = ['name', 'phone', 'age', 'gender', 'issue', 'symptoms', 'notes'];
  
  allowedFields.forEach(field => {
    if (details[field] !== undefined) {
      patient[field] = details[field];
    }
  });

  return { ...patient };
};

/**
 * Remove patient from queue
 * @param {string} patientId - Patient ID
 * @returns {boolean} - Success status
 */
const removePatient = (patientId) => {
  const index = queue.findIndex(p => p.id === patientId);
  
  if (index === -1) {
    // Check enquiries
    const enquiryIndex = enquiries.findIndex(p => p.id === patientId);
    if (enquiryIndex !== -1) {
      enquiries.splice(enquiryIndex, 1);
      return true;
    }
    throw new Error('Patient not found');
  }

  queue.splice(index, 1);
  return true;
};

// ============================================
// SEARCH FUNCTIONS
// ============================================

/**
 * Search patients by name
 * @param {string} searchTerm - Search term
 * @returns {Array} - Matching patients
 */
const searchPatientsByName = (searchTerm) => {
  const term = searchTerm.toLowerCase();
  return queue.filter(p => p.name.toLowerCase().includes(term));
};

/**
 * Search patients by phone
 * @param {string} phone - Phone number
 * @returns {Array} - Matching patients
 */
const searchPatientsByPhone = (phone) => {
  return queue.filter(p => p.phone && p.phone.includes(phone));
};

/**
 * Get patient by token number
 * @param {number} tokenNumber - Token number
 * @returns {Object|null} - Patient or null
 */
const getPatientByToken = (tokenNumber) => {
  return queue.find(p => p.tokenNumber === tokenNumber) || null;
};

// ============================================
// EXPORTS
// ============================================

export {
  // State management
  resetQueue,
  getCurrentTokenCounter,
  setTokenCounter,
  getState,
  restoreState,
  
  // Add patients
  addAppBooking,
  addWalkIn,
  addEmergency,
  addEnquiry,
  
  // Queue retrieval
  getQueueList,
  getAllPatients,
  getWaitingPatients,
  getCompletedPatients,
  getNowServing,
  getNextPatient,
  getEnquiries,
  getQueueStats,
  
  // Status management
  markPatientInside,
  completePatient,
  completeAndAdvance,
  callNextPatient,
  resetPatientStatus,
  
  // Patient updates
  updatePatientDetails,
  removePatient,
  
  // Search
  searchPatientsByName,
  searchPatientsByPhone,
  getPatientByToken,
  
  // Utilities
  generateId,
  patientExists,
  findPatientById
};

// Default export as object for convenience
export default {
  resetQueue,
  getCurrentTokenCounter,
  setTokenCounter,
  getState,
  restoreState,
  addAppBooking,
  addWalkIn,
  addEmergency,
  addEnquiry,
  getQueueList,
  getAllPatients,
  getWaitingPatients,
  getCompletedPatients,
  getNowServing,
  getNextPatient,
  getEnquiries,
  getQueueStats,
  markPatientInside,
  completePatient,
  completeAndAdvance,
  callNextPatient,
  resetPatientStatus,
  updatePatientDetails,
  removePatient,
  searchPatientsByName,
  searchPatientsByPhone,
  getPatientByToken,
  generateId,
  patientExists,
  findPatientById
};
