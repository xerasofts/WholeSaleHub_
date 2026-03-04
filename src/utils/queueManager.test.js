/**
 * Queue Manager Test File
 * Run this in browser console or create a test page
 * 
 * To test in browser console:
 * 1. Open your app in browser (npm run dev)
 * 2. Open Developer Tools (F12)
 * 3. Go to Console tab
 * 4. Import and test:
 *    import qm from '/src/utils/queueManager.js'
 *    // Then run the tests below
 */

import queueManager from './queueManager.js';

const {
  resetQueue,
  addAppBooking,
  addWalkIn,
  addEmergency,
  addEnquiry,
  getQueueList,
  getWaitingPatients,
  getNowServing,
  getNextPatient,
  getEnquiries,
  getQueueStats,
  markPatientInside,
  completePatient,
  completeAndAdvance,
  callNextPatient,
  updatePatientDetails,
  getState
} = queueManager;

// Test runner
const tests = [];
let passed = 0;
let failed = 0;

function test(name, fn) {
  tests.push({ name, fn });
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}: Expected ${expected}, got ${actual}`);
  }
}

function assertNotNull(value, message) {
  if (value === null || value === undefined) {
    throw new Error(`${message}: Expected non-null value`);
  }
}

function runTests() {
  console.log('\n🧪 Running Queue Manager Tests...\n');
  console.log('='.repeat(50));
  
  for (const { name, fn } of tests) {
    try {
      resetQueue(); // Reset before each test
      fn();
      console.log(`✅ PASS: ${name}`);
      passed++;
    } catch (error) {
      console.log(`❌ FAIL: ${name}`);
      console.log(`   Error: ${error.message}`);
      failed++;
    }
  }
  
  console.log('='.repeat(50));
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);
  
  return { passed, failed };
}

// ============================================
// TEST CASES
// ============================================

test('Should add app booking with sequential token', () => {
  const patient1 = addAppBooking({ name: 'John Doe' });
  const patient2 = addAppBooking({ name: 'Jane Doe' });
  
  assertEqual(patient1.tokenNumber, 1, 'First token');
  assertEqual(patient2.tokenNumber, 2, 'Second token');
  assertEqual(patient1.visitType, 'app', 'Visit type');
  assertEqual(patient1.status, 'waiting', 'Status');
});

test('Should add walk-in with sequential token', () => {
  const patient1 = addWalkIn({ name: 'Walk In 1' });
  const patient2 = addWalkIn({ name: 'Walk In 2' });
  
  assertEqual(patient1.tokenNumber, 1, 'First token');
  assertEqual(patient2.tokenNumber, 2, 'Second token');
  assertEqual(patient1.visitType, 'walkin', 'Visit type');
});

test('Should add emergency without normal token', () => {
  addAppBooking({ name: 'Regular Patient' }); // Token 1
  const emergency = addEmergency({ name: 'Emergency Case' });
  
  assertEqual(emergency.tokenNumber, null, 'Emergency should not have token');
  assertEqual(emergency.visitType, 'emergency', 'Visit type');
  assertNotNull(emergency.emergencyNumber, 'Should have emergency number');
});

test('Should add enquiry to separate list', () => {
  const enquiry = addEnquiry({ name: 'Visitor', purpose: 'Timing enquiry' });
  const enquiries = getEnquiries();
  const queue = getQueueList();
  
  assertEqual(enquiry.visitType, 'enquiry', 'Visit type');
  assertEqual(enquiries.length, 1, 'Enquiry count');
  assertEqual(queue.length, 0, 'Queue should not contain enquiry');
});

test('Should order queue with emergencies first', () => {
  addAppBooking({ name: 'Patient 1' }); // Token 1
  addWalkIn({ name: 'Patient 2' }); // Token 2
  addEmergency({ name: 'Emergency 1' });
  addAppBooking({ name: 'Patient 3' }); // Token 3
  
  const queue = getQueueList();
  
  assertEqual(queue[0].visitType, 'emergency', 'First should be emergency');
  assertEqual(queue[1].tokenNumber, 1, 'Second should be token 1');
  assertEqual(queue[2].tokenNumber, 2, 'Third should be token 2');
  assertEqual(queue[3].tokenNumber, 3, 'Fourth should be token 3');
});

test('Should get next patient (emergency priority)', () => {
  addAppBooking({ name: 'Patient 1' });
  addEmergency({ name: 'Emergency 1' });
  
  const next = getNextPatient();
  assertEqual(next.visitType, 'emergency', 'Next should be emergency');
});

test('Should mark patient as inside', () => {
  const patient = addAppBooking({ name: 'Test Patient' });
  const updated = markPatientInside(patient.id);
  
  assertEqual(updated.status, 'inside', 'Status should be inside');
  
  const serving = getNowServing();
  assertEqual(serving.id, patient.id, 'Now serving should match');
});

test('Should complete patient and get next', () => {
  const patient1 = addAppBooking({ name: 'Patient 1' });
  addAppBooking({ name: 'Patient 2' });
  
  markPatientInside(patient1.id);
  const result = completePatient(patient1.id);
  
  assertEqual(result.completedPatient.status, 'completed', 'Should be completed');
  assertNotNull(result.nextPatient, 'Should have next patient');
  assertEqual(result.nextPatient.tokenNumber, 2, 'Next should be token 2');
});

test('Should auto-advance to next patient', () => {
  const patient1 = addAppBooking({ name: 'Patient 1' });
  const patient2 = addAppBooking({ name: 'Patient 2' });
  
  markPatientInside(patient1.id);
  const result = completeAndAdvance(patient1.id);
  
  assertEqual(result.completedPatient.status, 'completed', 'First completed');
  assertEqual(result.nowServing.id, patient2.id, 'Second now serving');
  assertEqual(result.nowServing.status, 'inside', 'Second status inside');
});

test('Should call next patient', () => {
  addAppBooking({ name: 'Patient 1' });
  addEmergency({ name: 'Emergency' });
  
  const called = callNextPatient();
  
  assertEqual(called.visitType, 'emergency', 'Should call emergency first');
  assertEqual(called.status, 'inside', 'Should be inside');
});

test('Should prevent duplicate patients', () => {
  const patient = addAppBooking({ id: 'unique-id', name: 'Test' });
  
  try {
    addAppBooking({ id: 'unique-id', name: 'Duplicate' });
    throw new Error('Should have thrown');
  } catch (e) {
    assertEqual(e.message, 'Patient already exists in queue', 'Error message');
  }
});

test('Should update patient details', () => {
  const patient = addAppBooking({ name: 'Original Name' });
  
  const updated = updatePatientDetails(patient.id, {
    name: 'Updated Name',
    age: 30,
    gender: 'Male',
    symptoms: 'Headache'
  });
  
  assertEqual(updated.name, 'Updated Name', 'Name updated');
  assertEqual(updated.age, 30, 'Age updated');
  assertEqual(updated.gender, 'Male', 'Gender updated');
  assertEqual(updated.symptoms, 'Headache', 'Symptoms updated');
});

test('Should get correct queue stats', () => {
  addAppBooking({ name: 'P1' });
  addWalkIn({ name: 'P2' });
  addEmergency({ name: 'E1' });
  addEnquiry({ name: 'Visitor' });
  
  const p1 = getQueueList()[0];
  markPatientInside(p1.id);
  
  const stats = getQueueStats();
  
  assertEqual(stats.total, 3, 'Total patients (excluding enquiries)');
  assertEqual(stats.waiting, 2, 'Waiting count');
  assertEqual(stats.inside, 1, 'Inside count');
  assertEqual(stats.enquiries, 1, 'Enquiry count');
});

test('Should handle empty queue', () => {
  const queue = getQueueList();
  const next = getNextPatient();
  const serving = getNowServing();
  
  assertEqual(queue.length, 0, 'Queue empty');
  assertEqual(next, null, 'No next patient');
  assertEqual(serving, null, 'No one serving');
});

test('Should maintain FIFO among emergencies', () => {
  addEmergency({ name: 'Emergency 1' });
  addEmergency({ name: 'Emergency 2' });
  addEmergency({ name: 'Emergency 3' });
  
  const queue = getQueueList();
  
  assertEqual(queue[0].name, 'Emergency 1', 'First emergency');
  assertEqual(queue[1].name, 'Emergency 2', 'Second emergency');
  assertEqual(queue[2].name, 'Emergency 3', 'Third emergency');
});

test('Should save and restore state', () => {
  addAppBooking({ name: 'Patient 1' });
  addAppBooking({ name: 'Patient 2' });
  addEnquiry({ name: 'Visitor' });
  
  const savedState = getState();
  
  resetQueue();
  assertEqual(getQueueList().length, 0, 'Queue reset');
  
  queueManager.restoreState(savedState);
  assertEqual(getQueueList().length, 2, 'Queue restored');
  assertEqual(getEnquiries().length, 1, 'Enquiries restored');
});

// ============================================
// RUN TESTS
// ============================================

// Auto-run if this file is executed directly
runTests();

// Export for manual testing
export { runTests, tests };
