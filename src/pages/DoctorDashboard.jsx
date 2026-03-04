import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSharedQueue } from "../hooks/useSharedQueue";
import { useInventory } from "../hooks/useInventory";
import { clinicDoctors } from "../data/dummyData";
import { useProcedures } from "../hooks/useProcedures";
import "../index.css";

const today = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

// Current logged-in doctor (dr1 = Dr. Sarah Johnson)
// In a real app, this would come from authentication
const CURRENT_DOCTOR_ID = 'dr1';
const currentDoctor = clinicDoctors.find(d => d.id === CURRENT_DOCTOR_ID);

const doctorInfo = {
  id: currentDoctor?.id || 'dr1',
  name: currentDoctor?.name || "Dr. Sarah Johnson",
  specialty: currentDoctor?.specialty || "General Physician",
  clinic: "MediBook Clinic"
};

const visitTypeLabels = {
  app: { label: "App Booking", icon: "📱", color: "visit-badge-app" },
  walkin: { label: "Walk-in", icon: "🚶", color: "visit-badge-walkin" },
  emergency: { label: "Emergency", icon: "🚨", color: "visit-badge-emergency" },
  enquiry: { label: "Enquiry", icon: "❓", color: "visit-badge-enquiry" }
};

// Fallback for unknown visit types
const getVisitTypeLabel = (visitType) => {
  return visitTypeLabels[visitType] || { label: visitType || "Unknown", icon: "👤", color: "visit-badge-default" };
};

const statusLabels = {
  waiting: { label: "Waiting", color: "status-badge-waiting" },
  inside: { label: "With Doctor", color: "status-badge-inside" },
  completed: { label: "Completed", color: "status-badge-completed" },
  "lab-testing": { label: "At Lab", color: "status-badge-lab" },
  "lab-returned": { label: "Lab Done", color: "status-badge-lab-returned" }
};

function DoctorDashboard() {
  // Use shared queue for cross-tab sync
  const { patients, setPatients } = useSharedQueue();
  const { inventory, decrementStock } = useInventory();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [consultationForm, setConsultationForm] = useState({ symptoms: "", notes: "", caseRecord: "", treatments: "", medicines: [], procedures: [], serviceFee: 0, finalAmount: '' });
  const { procedures } = useProcedures();
  const [selectedMedicine, setSelectedMedicine] = useState('');
  const [selectedMedicineQty, setSelectedMedicineQty] = useState(1);
  const [selectedProcedure, setSelectedProcedure] = useState('');
  const [selectedVisit, setSelectedVisit] = useState(null); // For visit history popup
  const [editingVisit, setEditingVisit] = useState(null); // For editing visit in popup
  
  // Per-doctor consultation status: 'idle' | 'active' | 'paused' | 'ended'
  // Uses shared doctorStatuses object for cross-tab sync with assistant dashboard
  const [consultationStatus, setConsultationStatus] = useState(() => {
    const saved = localStorage.getItem('doctorStatuses');
    if (saved) {
      const statuses = JSON.parse(saved);
      return statuses[CURRENT_DOCTOR_ID] || 'idle';
    }
    return 'idle';
  });
  
  // For backward compatibility, derive autoQueueEnabled from status
  const autoQueueEnabled = consultationStatus === 'active';
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const devMode = searchParams.get('dev') === 'true';

  // Save consultation status to doctorStatuses localStorage (syncs with assistant dashboard)
  useEffect(() => {
    const saved = localStorage.getItem('doctorStatuses');
    const statuses = saved ? JSON.parse(saved) : {};
    statuses[CURRENT_DOCTOR_ID] = consultationStatus;
    localStorage.setItem('doctorStatuses', JSON.stringify(statuses));
    // Also update the old key for backward compatibility
    localStorage.setItem('consultationStatus', consultationStatus);
    localStorage.setItem('autoQueueEnabled', JSON.stringify(consultationStatus === 'active'));
  }, [consultationStatus]);

  useEffect(() => {
    if (devMode) return; // Skip auth in dev mode
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    const parsed = JSON.parse(storedUser);
    if (!parsed.role || parsed.role !== 'doctor') {
      navigate('/patient');
    }
  }, [navigate, devMode]);

  // Listen for consultation status changes from assistant dashboard (uses doctorStatuses)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'doctorStatuses' && e.newValue) {
        const statuses = JSON.parse(e.newValue);
        const myStatus = statuses[CURRENT_DOCTOR_ID];
        if (myStatus && myStatus !== consultationStatus) {
          setConsultationStatus(myStatus);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [consultationStatus]);

  // Get current patient (status === "inside") for this doctor
  const currentPatient = patients.find(p => p.status === "inside" && p.assignedDoctorId === CURRENT_DOCTOR_ID);
  
  // Get waiting patients for this doctor, sorted by: emergency first, lab-returned second, then by token
  const waitingPatients = patients
    .filter(p => (p.status === "waiting" || p.status === "lab-returned") && p.assignedDoctorId === CURRENT_DOCTOR_ID)
    .sort((a, b) => {
      // Emergency first
      if (a.visitType === "emergency" && b.visitType !== "emergency") return -1;
      if (b.visitType === "emergency" && a.visitType !== "emergency") return 1;
      // Lab-returned second (priority over regular waiting)
      if (a.status === "lab-returned" && b.status !== "lab-returned") return -1;
      if (b.status === "lab-returned" && a.status !== "lab-returned") return 1;
      // Then by token number (handle string tokens like 'E0', 'T1')
      const tokenA = typeof a.tokenNumber === 'string' ? parseInt(a.tokenNumber.replace(/\D/g, '')) || 999 : a.tokenNumber || 999;
      const tokenB = typeof b.tokenNumber === 'string' ? parseInt(b.tokenNumber.replace(/\D/g, '')) || 999 : b.tokenNumber || 999;
      return tokenA - tokenB;
    });

  // Get patients currently at lab (for this doctor)
  const labTestingPatients = patients.filter(p => p.status === "lab-testing" && p.assignedDoctorId === CURRENT_DOCTOR_ID);

  // Get completed patients (for this doctor)
  const completedPatients = patients.filter(p => p.status === "completed" && p.assignedDoctorId === CURRENT_DOCTOR_ID);

  // Counters (for this doctor only)
  const myPatients = patients.filter(p => p.assignedDoctorId === CURRENT_DOCTOR_ID);
  const totalPatients = myPatients.length;
  const waitingCount = waitingPatients.length;
  const completedCount = completedPatients.length;
  const labCount = labTestingPatients.length;

  // Start consultation - move patient to "inside"
  const startConsultation = (patientId) => {
    setPatients(prev => prev.map(p => 
      p.id === patientId ? { ...p, status: "inside" } : p
    ));
  };

  // Send patient to lab for testing
  const sendToLab = (patientId) => {
    setPatients(prev => {
      const updated = prev.map(p => 
        p.id === patientId 
          ? { ...p, status: "lab-testing", symptoms: consultationForm.symptoms, notes: consultationForm.notes } 
          : p
      );
      
      // Auto-start next patient if AUTO mode is enabled
      if (autoQueueEnabled) {
        const nextPatient = updated
          .filter(p => p.status === "waiting" || p.status === "lab-returned")
          .sort((a, b) => {
            if (a.visitType === "emergency" && b.visitType !== "emergency") return -1;
            if (b.visitType === "emergency" && a.visitType !== "emergency") return 1;
            if (a.status === "lab-returned" && b.status !== "lab-returned") return -1;
            if (b.status === "lab-returned" && a.status !== "lab-returned") return 1;
            const tokenA = typeof a.tokenNumber === 'string' ? parseInt(a.tokenNumber.replace(/\D/g, '')) || 999 : a.tokenNumber || 999;
            const tokenB = typeof b.tokenNumber === 'string' ? parseInt(b.tokenNumber.replace(/\D/g, '')) || 999 : b.tokenNumber || 999;
            return tokenA - tokenB;
          })[0];
        
        if (nextPatient) {
          return updated.map(p => p.id === nextPatient.id ? { ...p, status: "inside" } : p);
        }
      }
      return updated;
    });
    setSelectedPatient(null);
    setConsultationForm({ symptoms: "", notes: "" });
  };

  // Complete visit - only auto-advance if AUTO mode is enabled
  const completeVisit = (patientId) => {
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    
    setPatients(prev => {
      const updated = prev.map(p => {
        if (p.id === patientId) {
          // Add current consultation to visit history with richer data
          const medicines = (consultationForm.medicines || []).map(m => ({
            id: m.id,
            name: m.name,
            qty: m.qty,
            unitPrice: m.unitPrice,
            totalPrice: m.totalPrice
          }));

          const medicinesTotal = medicines.reduce((s, it) => s + (it.totalPrice || 0), 0);
          const proceduresList = consultationForm.procedures || [];
          const proceduresTotal = (proceduresList || []).reduce((s, it) => s + (parseFloat(it.fee || 0) || 0), 0);
          const serviceFee = parseFloat(consultationForm.serviceFee || 0) || 0;
          const computedTotal = medicinesTotal + proceduresTotal + serviceFee;
          const finalAmountValue = (!isNaN(parseFloat(consultationForm.finalAmount)) && consultationForm.finalAmount !== '') ? parseFloat(consultationForm.finalAmount) : computedTotal;

          const newVisit = {
            date: today,
            symptoms: consultationForm.symptoms || "Not recorded",
            diagnosis: consultationForm.notes || "Not recorded",
            prescription: medicines.map(m => `${m.name} x ${m.qty}`).join('; '),
            doctor: doctorInfo.name,
            caseRecord: consultationForm.caseRecord || "",
            treatments: consultationForm.treatments || "",
            medicines,
            finalAmount: finalAmountValue
          };

          // Decrement inventory for prescribed medicines
          medicines.forEach(m => {
            if (m.id) decrementStock(m.id, m.qty || 0);
          });

          return { 
            ...p, 
            status: "awaiting-staff", 
            symptoms: "", // Clear the temporary fields
            notes: "",
            visitHistory: [newVisit, ...(p.visitHistory || [])] // Add to beginning of history
          };
        }
        return p;
      });
      
      // Only auto-start next patient if AUTO mode is enabled
      if (autoQueueEnabled) {
        const nextPatient = updated
          .filter(p => p.status === "waiting" || p.status === "lab-returned")
          .sort((a, b) => {
            if (a.visitType === "emergency" && b.visitType !== "emergency") return -1;
            if (b.visitType === "emergency" && a.visitType !== "emergency") return 1;
            if (a.status === "lab-returned" && b.status !== "lab-returned") return -1;
            if (b.status === "lab-returned" && a.status !== "lab-returned") return 1;
            const tokenA = typeof a.tokenNumber === 'string' ? parseInt(a.tokenNumber.replace(/\D/g, '')) || 999 : a.tokenNumber || 999;
            const tokenB = typeof b.tokenNumber === 'string' ? parseInt(b.tokenNumber.replace(/\D/g, '')) || 999 : b.tokenNumber || 999;
            return tokenA - tokenB;
          })[0];
        
        if (nextPatient) {
          return updated.map(p => p.id === nextPatient.id ? { ...p, status: "inside" } : p);
        }
      }
      return updated;
    });
    setSelectedPatient(null);
    setConsultationForm({ symptoms: "", notes: "", caseRecord: "", treatments: "", medicines: [], procedures: [], serviceFee: 0, finalAmount: '' });
  };

  // Call next patient manually
  const callNextPatient = () => {
    if (waitingPatients.length > 0) {
      // Start session if not active
      if (consultationStatus !== 'active') {
        setConsultationStatus('active');
      }
      startConsultation(waitingPatients[0].id);
    }
  };

  // Select patient for detail view
  const selectPatient = (patient) => {
    setSelectedPatient(patient);
    setConsultationForm({ 
      symptoms: patient.symptoms || "", 
      notes: patient.notes || "",
      caseRecord: "",
      treatments: "",
      medicines: [],
      serviceFee: 0,
      finalAmount: computedTotal || ''
    });
  };

  // Save notes without completing
  const saveNotes = () => {
    if (!selectedPatient) return;
    setPatients(prev => prev.map(p => 
      p.id === selectedPatient.id 
        ? { ...p, symptoms: consultationForm.symptoms, notes: consultationForm.notes, lastUpdated: new Date().toISOString() } 
        : p
    ));
  };

  // Medicines / Invoice helpers
  const calculateMedicinesTotal = (meds) => {
    return (meds || []).reduce((s, m) => s + (parseFloat(m.totalPrice || 0) || 0), 0);
  };

  const calculateProceduresTotal = (procs) => {
    return (procs || []).reduce((s, p) => s + (parseFloat(p.fee || 0) || 0), 0);
  };

  // Editable handlers
  const updateMedicineQty = (medicineId, qty) => {
    setConsultationForm(prev => ({
      ...prev,
      medicines: (prev.medicines || []).map(m => m.id === medicineId ? { ...m, qty: parseFloat(qty) || 0, totalPrice: ((parseFloat(qty) || 0) * (parseFloat(m.unitPrice || 0) || 0)) } : m)
    }));
  };

  const updateMedicineUnitPrice = (medicineId, unitPrice) => {
    setConsultationForm(prev => ({
      ...prev,
      medicines: (prev.medicines || []).map(m => m.id === medicineId ? { ...m, unitPrice: parseFloat(unitPrice) || 0, totalPrice: ((parseFloat(m.qty || 0) || 0) * (parseFloat(unitPrice) || 0)) } : m)
    }));
  };

  const updateProcedureFee = (procedureId, fee) => {
    setConsultationForm(prev => ({
      ...prev,
      procedures: (prev.procedures || []).map(p => p.id === procedureId ? { ...p, fee: parseFloat(fee) || 0 } : p)
    }));
  };

  const addMedicineToForm = (medicineId, qty) => {
    if (!medicineId || !qty) return;
    const item = inventory.find(i => i.id === medicineId);
    if (!item) return;
    const existing = (consultationForm.medicines || []).find(m => m.id === medicineId);
    const parsedQty = parseFloat(qty) || 0;
    const unitPrice = parseFloat(item.price || 0) || 0;
    const totalPrice = parsedQty * unitPrice;
    let updated;
    if (existing) {
      updated = (consultationForm.medicines || []).map(m => m.id === medicineId ? { ...m, qty: (m.qty || 0) + parsedQty, totalPrice: ((m.qty || 0) + parsedQty) * unitPrice } : m);
    } else {
      updated = [...(consultationForm.medicines || []), { id: item.id, name: item.name, qty: parsedQty, unitPrice, totalPrice }];
    }
    setConsultationForm(prev => ({ ...prev, medicines: updated }));
  };

  const addProcedureToForm = (procedureId) => {
    if (!procedureId) return;
    const proc = procedures.find(p => p.id === procedureId);
    if (!proc) return;
    const updated = [...(consultationForm.procedures || []), { id: proc.id, name: proc.name, fee: proc.fee }];
    setConsultationForm(prev => ({ ...prev, procedures: updated }));
  };

  const removeProcedureFromForm = (procedureId) => {
    setConsultationForm(prev => ({ ...prev, procedures: (prev.procedures || []).filter(p => p.id !== procedureId) }));
  };

  const removeMedicineFromForm = (medicineId) => {
    setConsultationForm(prev => ({ ...prev, medicines: (prev.medicines || []).filter(m => m.id !== medicineId) }));
  };

  return (
    <div className="doctor-dashboard">
      {/* Header */}
      <motion.header 
        className="doctor-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="doctor-header-left">
          <div className="doctor-avatar">👨‍⚕️</div>
          <div className="doctor-info">
            <h1 className="doctor-name">{doctorInfo.name}</h1>
            <p className="doctor-specialty">{doctorInfo.specialty} • {doctorInfo.clinic}</p>
            <p className="doctor-date">{today}</p>
          </div>
        </div>
        <div className="doctor-stats">
          <div className="doc-stat-card">
            <div className="doc-stat-value">{totalPatients}</div>
            <div className="doc-stat-label">Total</div>
          </div>
          <div className="doc-stat-card waiting">
            <div className="doc-stat-value">{waitingCount}</div>
            <div className="doc-stat-label">Waiting</div>
          </div>
          <div className="doc-stat-card completed">
            <div className="doc-stat-value">{completedCount}</div>
            <div className="doc-stat-label">Done</div>
          </div>
          
          {/* Compact Consultation Status */}
          <div className={`consultation-status-compact ${consultationStatus}`}>
            <div className="status-indicator">
              <span className="status-dot"></span>
              <span className="status-label">
                {consultationStatus === 'idle' && 'Ready to Start'}
                {consultationStatus === 'active' && 'Consulting'}
                {consultationStatus === 'paused' && 'On Break'}
                {consultationStatus === 'ended' && 'Ended'}
              </span>
            </div>
            <div className="status-actions-compact">
              {consultationStatus === 'idle' && (
                <button className="status-btn-sm start" onClick={() => setConsultationStatus('active')}>
                  ▶ Start
                </button>
              )}
              {consultationStatus === 'active' && (
                <>
                  <button className="status-btn-sm pause" onClick={() => setConsultationStatus('paused')}>
                    ⏸ Break
                  </button>
                  <button className="status-btn-sm end" onClick={() => setConsultationStatus('ended')}>
                    ⏹ End
                  </button>
                </>
              )}
              {consultationStatus === 'paused' && (
                <>
                  <button className="status-btn-sm resume" onClick={() => setConsultationStatus('active')}>
                    ▶ Resume
                  </button>
                  <button className="status-btn-sm end" onClick={() => setConsultationStatus('ended')}>
                    ⏹ End
                  </button>
                </>
              )}
              {consultationStatus === 'ended' && (
                <button className="status-btn-sm start" onClick={() => setConsultationStatus('active')}>
                  ▶ Start
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="doctor-header-actions">
          <button className="doctor-logs-btn" onClick={() => navigate('/doctor/logs')}>📊 Logs</button>
          <button className="doctor-logout-btn" onClick={() => {
            localStorage.removeItem('user');
            navigate('/');
          }}>
            <span>Logout</span>
            <span>→</span>
          </button>
        </div>
      </motion.header>

      {/* Status Info Bar */}
      <motion.div 
        className={`status-info-bar ${consultationStatus}`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <span className="status-info-icon">
          {consultationStatus === 'idle' && '💡'}
          {consultationStatus === 'active' && '👨‍⚕️'}
          {consultationStatus === 'paused' && '☕'}
          {consultationStatus === 'ended' && '🏁'}
        </span>
        <span className="status-info-text">
          {consultationStatus === 'idle' && 'You haven\'t started yet. Click "Start" when you\'re ready to see patients.'}
          {consultationStatus === 'active' && 'You\'ve started the consultation. Patients are now coming in to see you.'}
          {consultationStatus === 'paused' && 'You\'re on a break. Patients are waiting. Click "Resume" when you\'re back.'}
          {consultationStatus === 'ended' && 'You\'ve finished for today. Click "Start" to begin a new session.'}
        </span>
      </motion.div>

      <div className="doctor-main-content">
        {/* Left Panel - Queue */}
        <div className="doctor-queue-panel">
          {/* Now Serving */}
          <motion.div 
            className="now-serving-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="panel-title">
              <span>🔔</span> Now Serving
            </h2>
            {currentPatient ? (
              <div className={`now-serving-card ${currentPatient.visitType === "emergency" ? "emergency" : ""}`}>
                <div className="now-serving-header">
                  <div className="now-serving-token">
                    {currentPatient.tokenNumber !== null ? currentPatient.tokenNumber : "E"}
                  </div>
                  <div className="now-serving-info">
                    <div className="now-serving-name">{currentPatient.name}</div>
                    <div className="now-serving-badges">
                      <span className={`visit-badge ${getVisitTypeLabel(currentPatient.visitType).color}`}>
                        {getVisitTypeLabel(currentPatient.visitType).icon} {getVisitTypeLabel(currentPatient.visitType).label}
                      </span>
                    </div>
                    <div className="now-serving-details">
                      {currentPatient.age && <span>{currentPatient.age} yrs</span>}
                      {currentPatient.gender && <span>{currentPatient.gender}</span>}
                    </div>
                    {currentPatient.issue && (
                      <div className="now-serving-issue">
                        <span>💬</span> {currentPatient.issue}
                      </div>
                    )}
                  </div>
                </div>
                <div className="now-serving-actions">
                  <button 
                    className="now-serving-btn view-btn"
                    onClick={() => selectPatient(currentPatient)}
                  >
                    <span>📋</span> View Details
                  </button>
                  <button 
                    className="now-serving-btn complete-btn"
                    onClick={() => completeVisit(currentPatient.id)}
                  >
                    <span>✓</span> Complete
                  </button>
                </div>
              </div>
            ) : (
              <div className="empty-serving">
                <div className="empty-icon">👋</div>
                <p>No patient currently</p>
                {waitingPatients.length > 0 && (
                  <button className="call-next-btn" onClick={callNextPatient}>
                    Bring In Next Patient
                  </button>
                )}
              </div>
            )}
          </motion.div>

          {/* Waiting Queue */}
          <motion.div 
            className="waiting-queue-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="panel-title">
              <span>⏳</span> Waiting Queue ({waitingCount})
            </h2>
            <div className="queue-list">
              <AnimatePresence>
                {waitingPatients.map((patient, index) => (
                  <motion.div
                    key={patient.id}
                    className={`queue-card ${patient.visitType === "emergency" ? "emergency" : ""} ${patient.status === "lab-returned" ? "lab-returned" : ""}`}
                    onClick={() => selectPatient(patient)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="queue-token">
                      {patient.tokenNumber !== null ? patient.tokenNumber : "E"}
                    </div>
                    <div className="queue-info">
                      <div className="queue-name">{patient.name}</div>
                      <div className="queue-meta">
                        <span className={`visit-badge small ${getVisitTypeLabel(patient.visitType).color}`}>
                          {getVisitTypeLabel(patient.visitType).icon}
                        </span>
                        {patient.status === "lab-returned" && (
                          <span className="lab-returned-badge">🔬 Lab Done</span>
                        )}
                        {patient.issue && <span className="queue-issue">{patient.issue}</span>}
                      </div>
                    </div>
                    <button 
                      className="queue-call-btn text-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!currentPatient) startConsultation(patient.id);
                      }}
                      disabled={!!currentPatient}
                    >
                      {patient.status === "lab-returned" ? "Resume" : "Bring In"}
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              {waitingPatients.length === 0 && (
                <div className="empty-queue">
                  <span>✨</span>
                  <p>No patients waiting</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* At Lab Section */}
          {labTestingPatients.length > 0 && (
            <motion.div 
              className="lab-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <h2 className="panel-title">
                <span>🔬</span> At Lab ({labCount})
              </h2>
              <div className="lab-list">
                {labTestingPatients.map(patient => (
                  <div 
                    key={patient.id} 
                    className="lab-card"
                    onClick={() => selectPatient(patient)}
                  >
                    <div className="lab-token">{patient.tokenNumber}</div>
                    <div className="lab-name">{patient.name}</div>
                    <span className="lab-badge">🧪 Testing</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Completed Today */}
          {completedPatients.length > 0 && (
            <motion.div 
              className="completed-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="panel-title">
                <span>✅</span> Completed Today ({completedCount})
              </h2>
              <div className="completed-list">
                {completedPatients.map(patient => (
                  <div 
                    key={patient.id} 
                    className="completed-card"
                    onClick={() => selectPatient(patient)}
                  >
                    <div className="completed-token">{patient.tokenNumber}</div>
                    <div className="completed-name">{patient.name}</div>
                    <span className="completed-badge">✓</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Panel - Patient Detail / Consultation */}
        <AnimatePresence>
          {selectedPatient && (
            <motion.div 
              className="consultation-panel"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
            >
              <div className="consultation-header">
                <h2>
                  <span>📋</span> Patient Details
                </h2>
                <button className="close-panel-btn" onClick={() => setSelectedPatient(null)}>
                  ✕
                </button>
              </div>

              <div className="patient-detail-card">
                <div className="patient-detail-header">
                  <div className={`detail-token ${selectedPatient.visitType === "emergency" ? "emergency" : ""}`}>
                    {selectedPatient.tokenNumber !== null ? selectedPatient.tokenNumber : "E"}
                  </div>
                  <div>
                    <div className="detail-name">{selectedPatient.name}</div>
                    <span className={`visit-badge ${getVisitTypeLabel(selectedPatient.visitType).color}`}>
                      {getVisitTypeLabel(selectedPatient.visitType).icon} {getVisitTypeLabel(selectedPatient.visitType).label}
                    </span>
                  </div>
                </div>

                <div className="patient-info-grid">
                  <div className="info-item">
                    <span className="info-label">Phone</span>
                    {selectedPatient.phone ? (
                      <span className="info-value">{selectedPatient.phone}</span>
                    ) : (
                      <input
                        type="tel"
                        className="info-edit-input"
                        placeholder="Enter phone"
                        maxLength={10}
                        onBlur={(e) => {
                          if (e.target.value) {
                            setPatients(prev => prev.map(p => 
                              p.id === selectedPatient.id ? { ...p, phone: e.target.value } : p
                            ));
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.target.value) {
                            setPatients(prev => prev.map(p => 
                              p.id === selectedPatient.id ? { ...p, phone: e.target.value } : p
                            ));
                            e.target.blur();
                          }
                        }}
                      />
                    )}
                  </div>
                  <div className="info-item">
                    <span className="info-label">Age</span>
                    {selectedPatient.age ? (
                      <span className="info-value">{selectedPatient.age} yrs</span>
                    ) : (
                      <input
                        type="number"
                        className="info-edit-input"
                        placeholder="Enter age"
                        min="0"
                        max="150"
                        onInput={(e) => {
                          if (e.target.value.length > 3) {
                            e.target.value = e.target.value.slice(0, 3);
                          }
                        }}
                        onBlur={(e) => {
                          if (e.target.value) {
                            setPatients(prev => prev.map(p => 
                              p.id === selectedPatient.id ? { ...p, age: parseInt(e.target.value) } : p
                            ));
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.target.value) {
                            setPatients(prev => prev.map(p => 
                              p.id === selectedPatient.id ? { ...p, age: parseInt(e.target.value) } : p
                            ));
                            e.target.blur();
                          }
                        }}
                      />
                    )}
                  </div>
                  <div className="info-item">
                    <span className="info-label">Gender</span>
                    {selectedPatient.gender ? (
                      <span className="info-value">{selectedPatient.gender}</span>
                    ) : (
                      <select
                        className="info-edit-input"
                        defaultValue=""
                        onChange={(e) => {
                          if (e.target.value) {
                            setPatients(prev => prev.map(p => 
                              p.id === selectedPatient.id ? { ...p, gender: e.target.value } : p
                            ));
                          }
                        }}
                      >
                        <option value="" disabled>Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    )}
                  </div>
                  <div className="info-item">
                    <span className="info-label">Status</span>
                    <span className={`status-badge ${statusLabels[selectedPatient.status].color}`}>
                      {statusLabels[selectedPatient.status].label}
                    </span>
                  </div>
                </div>

                {selectedPatient.issue && (
                  <div className="patient-issue-box">
                    <span className="issue-label">Chief Complaint</span>
                    <p>{selectedPatient.issue}</p>
                  </div>
                )}
              </div>

              {/* Visit History - Minimal Pills */}
              {selectedPatient.visitHistory && selectedPatient.visitHistory.length > 0 && (
                <div className="history-section">
                  <div className="history-header">
                    <span>🕐 Past Visits</span>
                    <span className="history-count">{selectedPatient.visitHistory.length}</span>
                  </div>
                  <div className="history-pills">
                    {selectedPatient.visitHistory.map((visit, index) => (
                      <button 
                        key={index} 
                        className="history-pill"
                        onClick={() => setSelectedVisit(visit)}
                      >
                        <span className="pill-date">
                          {new Date(visit.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        <span className="pill-diagnosis">{visit.diagnosis}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedPatient.visitHistory && selectedPatient.visitHistory.length === 0 && (
                <div className="new-patient-badge">
                  ✨ New Patient
                </div>
              )}

              {/* Case Record / Treatment & Prescription / Final Invoice */}
              <div className="consultation-notes">
                <h3>
                  <span>📝</span> Case Record
                </h3>
                <div className="notes-input-group">
                  <label>Case Record</label>
                  <textarea
                    placeholder="Enter case details, history, observations..."
                    value={consultationForm.caseRecord}
                    onChange={(e) => setConsultationForm(prev => ({ ...prev, caseRecord: e.target.value }))}
                    rows={3}
                    disabled={selectedPatient.status === "completed"}
                  />
                </div>

                <h3>
                  <span>💊</span> Treatment & Prescription
                </h3>
                <div className="notes-input-group">
                  <label>Treatments / Notes</label>
                  <textarea
                    placeholder="Describe treatments, procedures, or advice..."
                    value={consultationForm.treatments}
                    onChange={(e) => setConsultationForm(prev => ({ ...prev, treatments: e.target.value }))}
                    rows={3}
                    disabled={selectedPatient.status === "completed"}
                  />
                </div>

                <div className="prescription-row">
                  <div className="prescription-select">
                    <label>Medicine</label>
                    <select value={selectedMedicine} onChange={(e)=>setSelectedMedicine(e.target.value)}>
                      <option value="" disabled>Select medicine</option>
                      {inventory.filter(i=> (i.quantityAvailable || 0) > 0).map(item => (
                        <option key={item.id} value={item.id}>{item.name} — {item.unit} — ₹{item.price} (Avail: {item.quantityAvailable})</option>
                      ))}
                    </select>
                  </div>
                  <div className="prescription-qty">
                    <label>Qty</label>
                    <input type="number" min="1" value={selectedMedicineQty} onChange={(e)=>setSelectedMedicineQty(e.target.value)} />
                  </div>
                  <div className="prescription-add">
                    <label>&nbsp;</label>
                    <button className="add-medicine-btn" onClick={() => { addMedicineToForm(selectedMedicine, selectedMedicineQty); setSelectedMedicine(''); setSelectedMedicineQty(1); }}>Add</button>
                  </div>
                </div>

                {(consultationForm.medicines || []).length > 0 && (
                  <div className="medicines-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Medicine</th>
                          <th>Qty</th>
                          <th>Unit Price</th>
                          <th>Total</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {consultationForm.medicines.map(m => (
                          <tr key={m.id}>
                            <td>{m.name}</td>
                            <td>
                              <input type="number" min="0" value={m.qty} onChange={(e)=>updateMedicineQty(m.id, e.target.value)} style={{width:72, padding:6, borderRadius:6, border:'1px solid var(--border-color)', background:'var(--bg-input)', color:'var(--text-primary)'}} />
                            </td>
                            <td>
                              <input type="number" min="0" value={m.unitPrice} onChange={(e)=>updateMedicineUnitPrice(m.id, e.target.value)} style={{width:100, padding:6, borderRadius:6, border:'1px solid var(--border-color)', background:'var(--bg-input)', color:'var(--text-primary)'}} />
                            </td>
                            <td>₹{(parseFloat(m.totalPrice)||0).toFixed(2)}</td>
                            <td><button className="text-btn" onClick={() => removeMedicineFromForm(m.id)}>Remove</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div style={{marginTop:12}}>
                  <label style={{display:'block', color:'var(--text-secondary)', marginBottom:6}}>Procedures</label>
                  <div style={{display:'flex', gap:12, alignItems:'center', flexWrap:'wrap'}}>
                    <select className="info-edit-input" value={selectedProcedure} onChange={(e)=>setSelectedProcedure(e.target.value)}>
                      <option value="" disabled>Select procedure</option>
                      {procedures.map(p => (
                        <option key={p.id} value={p.id}>{p.name} — ₹{p.fee}</option>
                      ))}
                    </select>
                    <button className="add-medicine-btn" onClick={()=>{ addProcedureToForm(selectedProcedure); setSelectedProcedure(''); }}>Add Procedure</button>
                  </div>

                  {(consultationForm.procedures || []).length > 0 && (
                    <div className="procedures-table" style={{marginTop:8}}>
                      <table>
                        <thead>
                          <tr>
                            <th>Procedure</th>
                            <th>Fee</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {consultationForm.procedures.map(p => (
                            <tr key={p.id}>
                              <td>{p.name}</td>
                              <td>
                                <input type="number" min="0" value={p.fee} onChange={(e)=>updateProcedureFee(p.id, e.target.value)} style={{width:100, padding:6, borderRadius:6, border:'1px solid var(--border-color)', background:'var(--bg-input)', color:'var(--text-primary)'}} />
                              </td>
                              <td><button className="text-btn" onClick={()=>removeProcedureFromForm(p.id)}>Remove</button></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <h3>
                  <span>🧾</span> Final Invoice
                </h3>
                <div className="invoice-row">
                  <div className="invoice-item">
                    <label>Service Fee</label>
                    <input type="number" min="0" value={consultationForm.serviceFee} onChange={(e) => setConsultationForm(prev => ({ ...prev, serviceFee: e.target.value }))} />
                  </div>
                  <div className="invoice-item">
                    <label>Medicines Total</label>
                    <div className="invoice-value">₹{calculateMedicinesTotal(consultationForm.medicines || [])}</div>
                  </div>
                  <div className="invoice-item">
                    <label>Procedures Total</label>
                    <div className="invoice-value">₹{calculateProceduresTotal(consultationForm.procedures || [])}</div>
                  </div>
                   <div className="invoice-item">
                    <label>Total</label>
                    <div className="invoice-value">₹{((!isNaN(parseFloat(consultationForm.finalAmount)) ? parseFloat(consultationForm.finalAmount) : (calculateMedicinesTotal(consultationForm.medicines || []) + calculateProceduresTotal(consultationForm.procedures || []) + (parseFloat(consultationForm.serviceFee || 0) || 0)))).toFixed(2)}</div>
                  </div>
                  {/* <div className="invoice-item">
                    <label>Final Amount</label>
                    <input type="number" value={consultationForm.finalAmount} onChange={(e) => setConsultationForm(prev => ({ ...prev, finalAmount: e.target.value }))} />
                  </div> */}
                </div>

                {selectedPatient.status !== "completed" && selectedPatient.status !== "lab-testing" && (
                  <div className="consultation-actions">
                    <button className="consult-btn save-btn" onClick={saveNotes}>
                      <span>💾</span> Save Notes
                    </button>
                    {selectedPatient.status === "inside" && (
                      <>
                        <button 
                          className="consult-btn lab-btn" 
                          onClick={() => sendToLab(selectedPatient.id)}
                        >
                          <span>🔬</span> Send to Lab
                        </button>
                        <button 
                          className="consult-btn complete-btn" 
                          onClick={() => completeVisit(selectedPatient.id)}
                        >
                          <span>✓</span> Finalize & Complete
                        </button>
                      </>
                    )}
                    {(selectedPatient.status === "waiting" || selectedPatient.status === "lab-returned") && !currentPatient && (
                      <button 
                        className="consult-btn start-btn" 
                        onClick={() => startConsultation(selectedPatient.id)}
                      >
                        <span>▶</span> {selectedPatient.status === "lab-returned" ? "Resume with Results" : "Start Consultation"}
                      </button>
                    )}
                  </div>
                )}

                {selectedPatient.status === "lab-testing" && (
                  <div className="visit-lab-badge">
                    <span>🔬</span> Patient at Lab - Awaiting Results
                  </div>
                )}

                {selectedPatient.status === "completed" && (
                  <div className="visit-completed-badge">
                    <span>✓</span> Visit Completed
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state when no patient selected */}
        {!selectedPatient && (
          <motion.div 
            className="consultation-panel empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="empty-consultation">
              <div className="empty-icon">👆</div>
              <h3>Select a Patient</h3>
              <p>Click on a patient card to view details and add consultation notes</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Visit History Detail Modal */}
      <AnimatePresence>
        {selectedVisit && (
          <motion.div 
            className="visit-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setSelectedVisit(null); setEditingVisit(null); }}
          >
            <motion.div 
              className="visit-modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="visit-modal-header">
                <div className="vm-date">
                  📅 {new Date(selectedVisit.date).toLocaleDateString('en-US', { 
                    weekday: 'long',
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <button className="vm-close" onClick={() => { setSelectedVisit(null); setEditingVisit(null); }}>✕</button>
              </div>
              
              <div className="visit-modal-body">
                {editingVisit ? (
                  // Edit Mode
                  <>
                    <div className="vm-section">
                      <div className="vm-label">Symptoms</div>
                      <textarea 
                        className="vm-edit-input"
                        value={editingVisit.symptoms}
                        onChange={(e) => setEditingVisit({...editingVisit, symptoms: e.target.value})}
                        rows={2}
                      />
                    </div>
                    
                    <div className="vm-section highlight">
                      <div className="vm-label">Diagnosis</div>
                      <textarea 
                        className="vm-edit-input"
                        value={editingVisit.diagnosis}
                        onChange={(e) => setEditingVisit({...editingVisit, diagnosis: e.target.value})}
                        rows={2}
                      />
                    </div>
                    
                    <div className="vm-section">
                      <div className="vm-label">Prescription</div>
                      <textarea 
                        className="vm-edit-input"
                        value={editingVisit.prescription || ''}
                        onChange={(e) => setEditingVisit({...editingVisit, prescription: e.target.value})}
                        rows={2}
                      />
                    </div>
                    
                    <div className="vm-actions">
                      <button 
                        className="vm-btn save"
                        onClick={() => {
                          // Save the edited visit to patient's history
                          setPatients(prev => prev.map(p => {
                            if (p.id === selectedPatient.id) {
                              const updatedHistory = p.visitHistory.map(v => 
                                v.date === selectedVisit.date ? editingVisit : v
                              );
                              return { ...p, visitHistory: updatedHistory };
                            }
                            return p;
                          }));
                          setSelectedVisit(editingVisit);
                          setEditingVisit(null);
                        }}
                      >
                        <span>✓</span> Save Changes
                      </button>
                      <button 
                        className="vm-btn cancel"
                        onClick={() => setEditingVisit(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  // View Mode
                  <>
                    <div className="vm-section">
                      <div className="vm-label">Symptoms</div>
                      <div className="vm-content">{selectedVisit.symptoms}</div>
                    </div>
                    
                    <div className="vm-section highlight">
                      <div className="vm-label">Diagnosis</div>
                      <div className="vm-content diagnosis">{selectedVisit.diagnosis}</div>
                    </div>
                    
                    <div className="vm-section">
                      <div className="vm-label">Prescription</div>
                      <div className="vm-content">{selectedVisit.prescription || 'Not recorded'}</div>
                    </div>
                    
                    <div className="vm-footer">
                      <div className="vm-doctor">
                        👨‍⚕️ {selectedVisit.doctor}
                      </div>
                      <button 
                        className="vm-edit-btn"
                        onClick={() => setEditingVisit({...selectedVisit})}
                      >
                        ✏️ Edit
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default DoctorDashboard;
