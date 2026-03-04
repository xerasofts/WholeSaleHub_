import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSharedQueue } from "../hooks/useSharedQueue";
import { clinicDoctors } from "../data/dummyData";
import "../index.css";

const today = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

const visitTypeLabels = {
  app: { label: "App Booking", icon: "📱", color: "visit-badge-app" },
  walkin: { label: "Walk-in", icon: "🚶", color: "visit-badge-walkin" },
  emergency: { label: "Emergency", icon: "🚨", color: "visit-badge-emergency" },
  enquiry: { label: "Enquiry", icon: "❓", color: "visit-badge-enquiry" }
};

const statusLabels = {
  waiting: { label: "Waiting", color: "status-badge-waiting" },
  inside: { label: "With Doctor", color: "status-badge-inside" },
  completed: { label: "Completed", color: "status-badge-completed" },
  'awaiting-staff': { label: 'Awaiting Staff', color: 'status-badge-pending' },
  "lab-testing": { label: "At Lab", color: "status-badge-lab" },
  "lab-returned": { label: "Lab Done", color: "status-badge-lab-returned" }
};

function ClinicAssistantDashboard() {
  // Use shared queue for cross-tab sync
  const { patients, setPatients, updatePatientStatus, getNextToken, getNextEmergencyToken } = useSharedQueue();
  const [modal, setModal] = useState(null);
  const [editPatient, setEditPatient] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", purpose: "", doctorId: "" });
  const [selectedDoctorFilter, setSelectedDoctorFilter] = useState('all'); // 'all' or doctor id
  const [searchQuery, setSearchQuery] = useState(''); // Global search
  const [queueExpanded, setQueueExpanded] = useState(false); // For show more/less
  const QUEUE_LIMIT = 7;
  const queueSectionRef = useRef(null);
  
  // Per-doctor consultation status
  const [doctorStatuses, setDoctorStatuses] = useState(() => {
    const saved = localStorage.getItem('doctorStatuses');
    if (saved) return JSON.parse(saved);
    // Initialize all doctors as 'idle'
    const initial = {};
    clinicDoctors.forEach(doc => {
      initial[doc.id] = 'idle';
    });
    return initial;
  });
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const devMode = searchParams.get('dev') === 'true';

  useEffect(() => {
    if (devMode) return; // Skip auth in dev mode
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    const parsed = JSON.parse(storedUser);
    if (!parsed.role || parsed.role !== 'assistant') {
      navigate('/patient');
    }
  }, [navigate, devMode]);

  // Save doctor statuses to localStorage
  useEffect(() => {
    localStorage.setItem('doctorStatuses', JSON.stringify(doctorStatuses));
  }, [doctorStatuses]);

  // Listen for doctor status changes from doctor dashboards
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'doctorStatuses' && e.newValue) {
        setDoctorStatuses(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Update a single doctor's status
  const updateDoctorStatus = (doctorId, status) => {
    setDoctorStatuses(prev => ({ ...prev, [doctorId]: status }));
  };

  // Auto-queue logic per doctor
  useEffect(() => {
    clinicDoctors.forEach(doctor => {
      if (doctorStatuses[doctor.id] !== 'active') return;

      const hasPatientInside = patients.some(
        p => p.status === "inside" && p.assignedDoctorId === doctor.id && p.visitType !== "enquiry"
      );
      
      if (!hasPatientInside) {
        const eligiblePatients = patients
          .filter(p => 
            (p.status === "waiting" || p.status === "lab-returned") && 
            p.assignedDoctorId === doctor.id && 
            p.visitType !== "enquiry"
          )
          .sort((a, b) => {
            if (a.visitType === "emergency" && b.visitType !== "emergency") return -1;
            if (b.visitType === "emergency" && a.visitType !== "emergency") return 1;
            if (a.status === "lab-returned" && b.status !== "lab-returned") return -1;
            if (b.status === "lab-returned" && a.status !== "lab-returned") return 1;
            const tokenA = typeof a.tokenNumber === 'string' ? parseInt(a.tokenNumber.replace(/\D/g, '')) || 999 : a.tokenNumber || 999;
            const tokenB = typeof b.tokenNumber === 'string' ? parseInt(b.tokenNumber.replace(/\D/g, '')) || 999 : b.tokenNumber || 999;
            return tokenA - tokenB;
          });

        if (eligiblePatients.length > 0) {
          const nextPatient = eligiblePatients[0];
          setTimeout(() => {
            setPatients(prev => 
              prev.map(p => p.id === nextPatient.id ? { ...p, status: "inside" } : p)
            );
          }, 500);
        }
      }
    });
  }, [patients, doctorStatuses, setPatients]);

  // Header counters
  const totalPatients = patients.filter(p => p.visitType !== "enquiry").length;
  const waitingCount = patients.filter(
    p => (p.status === "waiting" || p.status === "lab-returned") && p.visitType !== "enquiry"
  ).length;
  const labCount = patients.filter(p => p.status === "lab-testing").length;

  // Get per-doctor stats
  const getDoctorStats = (doctorId) => {
    const doctorPatients = patients.filter(p => p.assignedDoctorId === doctorId && p.visitType !== "enquiry");
    return {
      total: doctorPatients.length,
      waiting: doctorPatients.filter(p => p.status === "waiting" || p.status === "lab-returned").length,
      inside: doctorPatients.find(p => p.status === "inside"),
      nowServing: doctorPatients.find(p => p.status === "inside")?.tokenNumber || "-"
    };
  };

  // Get next patient for a specific doctor
  const getNextPatientForDoctor = (doctorId) => {
    return patients
      .filter(p => 
        (p.status === "waiting" || p.status === "lab-returned") && 
        p.assignedDoctorId === doctorId && 
        p.visitType !== "enquiry"
      )
      .sort((a, b) => {
        if (a.visitType === "emergency" && b.visitType !== "emergency") return -1;
        if (b.visitType === "emergency" && a.visitType !== "emergency") return 1;
        if (a.status === "lab-returned" && b.status !== "lab-returned") return -1;
        if (b.status === "lab-returned" && a.status !== "lab-returned") return 1;
        const tokenA = typeof a.tokenNumber === 'string' ? parseInt(a.tokenNumber.replace(/\D/g, '')) || 999 : a.tokenNumber || 999;
        const tokenB = typeof b.tokenNumber === 'string' ? parseInt(b.tokenNumber.replace(/\D/g, '')) || 999 : b.tokenNumber || 999;
        return tokenA - tokenB;
      })[0] || null;
  };

  // Find doctor with shortest queue for auto-assignment
  const getDoctorWithShortestQueue = () => {
    let shortestDoctor = clinicDoctors[0];
    let shortestCount = getDoctorStats(shortestDoctor.id).waiting;
    
    clinicDoctors.forEach(doc => {
      const count = getDoctorStats(doc.id).waiting;
      // Prefer active doctors
      if (doctorStatuses[doc.id] === 'active' && doctorStatuses[shortestDoctor.id] !== 'active') {
        shortestDoctor = doc;
        shortestCount = count;
      } else if (count < shortestCount && doctorStatuses[doc.id] === doctorStatuses[shortestDoctor.id]) {
        shortestDoctor = doc;
        shortestCount = count;
      }
    });
    return shortestDoctor.id;
  };

  // Get patients at lab
  const labTestingPatients = patients.filter(p => p.status === "lab-testing");

  // Patients awaiting staff processing (completed by doctor but need assistant to finish)
  // Include patients that were finished by assistant but we want them to remain visible here
  const awaitingStaffPatients = patients.filter(p => p.status === 'awaiting-staff' || (p.status === 'completed' && p.awaitingStaffCompleted));

  // Filter patients based on selected doctor and search query
  const filteredPatients = patients.filter(p => {
    if (p.visitType === "enquiry") return false;
    
    // Doctor filter
    if (selectedDoctorFilter !== 'all' && p.assignedDoctorId !== selectedDoctorFilter) return false;
    
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      const nameMatch = p.name?.toLowerCase().includes(query);
      const visitTypeMatch = p.visitType?.toLowerCase().includes(query) || 
        visitTypeLabels[p.visitType]?.label.toLowerCase().includes(query);
      const statusMatch = p.status?.toLowerCase().includes(query) ||
        statusLabels[p.status]?.label.toLowerCase().includes(query);
      const tokenMatch = p.tokenNumber?.toString().toLowerCase().includes(query);
      const phoneMatch = p.phone?.toLowerCase().includes(query);
      const issueMatch = p.issue?.toLowerCase().includes(query);
      
      if (!nameMatch && !visitTypeMatch && !statusMatch && !tokenMatch && !phoneMatch && !issueMatch) {
        return false;
      }
    }
    
    return true;
  });

  // Modal handlers
  const openModal = type => {
    setModal(type);
    setForm({ name: "", phone: "", purpose: "", age: "", gender: "", issue: "", doctorId: getDoctorWithShortestQueue() });
  };
  const closeModal = () => setModal(null);

  // Add patient logic
  const handleAddPatient = e => {
    e.preventDefault();
    if (modal === "walkin" && !form.name.trim()) return;
    if ((modal === "walkin" || modal === "emergency") && !form.doctorId) return;
    
    if (modal === "walkin") {
      setPatients([
        ...patients,
        {
          id: Date.now(),
          name: form.name,
          tokenNumber: `T${getNextToken()}`,
          visitType: "walkin",
          status: "waiting",
          age: form.age || null,
          gender: form.gender || null,
          issue: form.issue || "",
          phone: form.phone,
          assignedDoctorId: form.doctorId
        }
      ]);
    } else if (modal === "emergency") {
      setPatients([
        {
          id: Date.now(),
          name: form.name || "Emergency Patient",
          tokenNumber: `E${getNextEmergencyToken()}`,
          visitType: "emergency",
          status: "waiting",
          age: form.age || null,
          gender: form.gender || null,
          issue: form.issue || "",
          phone: form.phone,
          assignedDoctorId: form.doctorId
        },
        ...patients
      ]);
    } else if (modal === "enquiry") {
      setPatients([
        ...patients,
        {
          id: Date.now(),
          name: form.name || "Visitor",
          tokenNumber: null,
          visitType: "enquiry",
          status: "completed",
          age: form.age || null,
          gender: form.gender || null,
          issue: form.purpose || form.issue || ""
        }
      ]);
    }
    closeModal();
  };

  // Mark patient returned from lab (priority return)
  const markLabReturned = (id) => {
    setPatients(patients =>
      patients.map(p => (p.id === id ? { ...p, status: "lab-returned" } : p))
    );
  };

  // Edit patient details
  const [editingVisitDetails, setEditingVisitDetails] = useState(null);

  const openEdit = patient => {
    setEditPatient(patient);
    const firstVisit = (patient.visitHistory && patient.visitHistory.length > 0) ? { ...patient.visitHistory[0] } : null;
    setEditingVisitDetails(firstVisit);
  };
  const closeEdit = () => { setEditPatient(null); setEditingVisitDetails(null); };
  const handleEditSave = updated => {
    setPatients(patients =>
      patients.map(p => (p.id === updated.id ? { ...p, ...updated } : p))
    );
    closeEdit();
  };

  const handleSaveVisitEdits = () => {
    if (!editPatient || !editingVisitDetails) return;
    setPatients(prev => prev.map(p => {
      if (p.id === editPatient.id) {
        const rest = (p.visitHistory || []).slice(1) || [];
        return { ...p, visitHistory: [editingVisitDetails, ...rest] };
      }
      return p;
    }));
    setEditPatient(prev => prev ? { ...prev, visitHistory: [editingVisitDetails, ...((prev.visitHistory||[]).slice(1))] } : prev);
  };

  const handleFinishVisit = () => {
    handleSaveVisitEdits();
    if (editPatient) {
      setPatients(prev => prev.map(p => p.id === editPatient.id ? { ...p, status: 'completed', awaitingStaffCompleted: true } : p));
    }
    closeEdit();
  };

  // UI
  return (
    <div className="assistant-dashboard">
      {/* Header */}
      <motion.header 
        className="assistant-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="assistant-header-left">
          <div className="assistant-logo">🏥</div>
          <div>
            <h1 className="assistant-title">MediBook Clinic</h1>
            <p className="assistant-date">{today}</p>
          </div>
        </div>
        <div className="assistant-stats">
          <div className="stat-card">
            <span className="stat-icon">👥</span>
            <div>
              <div className="stat-value">{totalPatients}</div>
              <div className="stat-label">Total Patients</div>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">⏳</span>
            <div>
              <div className="stat-value">{waitingCount}</div>
              <div className="stat-label">Waiting</div>
            </div>
          </div>
          {labCount > 0 && (
            <div className="stat-card">
              <span className="stat-icon">🔬</span>
              <div>
                <div className="stat-value">{labCount}</div>
                <div className="stat-label">At Lab</div>
              </div>
            </div>
          )}
        </div>
        <button className="assistant-logout-btn" onClick={() => {
          localStorage.removeItem('user');
          navigate('/');
        }}>
          <span>Logout</span>
          <span>→</span>
        </button>
      </motion.header>

      {/* Action Buttons */}
      <motion.div 
        className="assistant-actions"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.03 }}
      >
        <button className="action-btn action-walkin" onClick={() => openModal("walkin")}>
          <span className="action-icon">➕</span>
          <span>Walk-in Patient</span>
        </button>
        <button className="action-btn action-emergency" onClick={() => openModal("emergency")}>
          <span className="action-icon">🚨</span>
          <span>Emergency Entry</span>
        </button>
        <button className="action-btn action-enquiry" onClick={() => openModal("enquiry")}>
          <span className="action-icon">❓</span>
          <span>Enquiry Visit</span>
        </button>
      </motion.div>

      {/* Doctor Status Bar - Multi Doctor View */}
      <motion.div 
        className="doctor-status-bar"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        {clinicDoctors.map(doctor => {
          const stats = getDoctorStats(doctor.id);
          const status = doctorStatuses[doctor.id];
          const isSelected = selectedDoctorFilter === doctor.id;
          const nextPatient = getNextPatientForDoctor(doctor.id);
          
          return (
            <div 
              key={doctor.id}
              className={`doctor-card status-${status} ${isSelected ? 'selected' : ''}`}
              style={{ '--doctor-color': doctor.color, '--doctor-color-light': doctor.colorLight }}
              onClick={() => {
                setSelectedDoctorFilter(isSelected ? 'all' : doctor.id);
                setTimeout(() => {
                  document.getElementById('patient-queue-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 150);
              }}
            >
              <div className="doctor-card-header">
                <div className="doctor-card-info">
                  <span className="doctor-card-name">{doctor.shortName}</span>
                  <span className="doctor-card-specialty">{doctor.specialty}</span>
                </div>
                <div className={`doctor-status-dot ${status}`}></div>
              </div>
              <div className="doctor-card-stats">
                <div className="doctor-stat">
                  <span className="doctor-stat-value">{stats.total}</span>
                  <span className="doctor-stat-label">Total</span>
                </div>
                <div className="doctor-stat">
                  <span className="doctor-stat-value">{stats.waiting}</span>
                  <span className="doctor-stat-label">Waiting</span>
                </div>
                <div className="doctor-stat">
                  <span className="doctor-stat-value">{stats.nowServing}</span>
                  <span className="doctor-stat-label">Serving</span>
                </div>
              </div>
              <div className="doctor-card-status">
                {status === 'idle' && '⏳ Not Started'}
                {status === 'active' && '🟢 Available'}
                {status === 'paused' && '☕ On Break'}
                {status === 'ended' && '🏁 Ended'}
              </div>
              {nextPatient && (
                <div className={`doctor-card-next ${nextPatient.visitType === 'emergency' ? 'emergency' : ''}`}>
                  Next: <strong>{nextPatient.tokenNumber}</strong> {nextPatient.name}
                </div>
              )}
            </div>
          );
        })}
      </motion.div>

      {/* Filter Info */}
      {selectedDoctorFilter !== 'all' && (
        <motion.div 
          className="filter-info-bar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span>Showing patients for: <strong>{clinicDoctors.find(d => d.id === selectedDoctorFilter)?.shortName}</strong></span>
          <button className="clear-filter-btn" onClick={() => setSelectedDoctorFilter('all')}>
            Show All Doctors
          </button>
        </motion.div>
      )}

      {/* Queue Section */}
      <div id="patient-queue-section"></div>
      <motion.div 
        ref={queueSectionRef}
        className="queue-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="queue-header">
          <h2 className="section-title">
            <span>📋</span> Patient Queue
          </h2>
          <div className="queue-toolbar">
            <div className="queue-filter-group">
              <label className="queue-filter-label">Doctor</label>
              <select 
                className="queue-filter-select-new"
                value={selectedDoctorFilter} 
                onChange={(e) => setSelectedDoctorFilter(e.target.value)}
              >
                <option value="all">All Doctors</option>
                {clinicDoctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>{doctor.shortName}</option>
                ))}
              </select>
            </div>
            <div className="queue-search-group">
              <div className="queue-search-box">
                <span className="queue-search-icon">🔍</span>
                <input
                  type="text"
                  className="queue-search-input"
                  placeholder="Search what u need..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button 
                    className="queue-search-clear" 
                    onClick={() => setSearchQuery('')}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        {(selectedDoctorFilter !== 'all' || searchQuery) && (
          <div className="queue-active-filters">
            {selectedDoctorFilter !== 'all' && (() => {
              const doctor = clinicDoctors.find(d => d.id === selectedDoctorFilter);
              const stats = getDoctorStats(selectedDoctorFilter);
              return (
                <span className="active-filter-chip" style={{ background: doctor?.colorLight, color: doctor?.color, borderColor: doctor?.color }}>
                  {doctor?.shortName}: {stats.waiting} waiting, {stats.total} total
                  <button onClick={() => setSelectedDoctorFilter('all')}>✕</button>
                </span>
              );
            })()}
            {searchQuery && (
              <span className="active-filter-chip search-chip">
                Search: "{searchQuery}"
                <button onClick={() => setSearchQuery('')}>✕</button>
              </span>
            )}
            <button className="clear-all-filters" onClick={() => { setSelectedDoctorFilter('all'); setSearchQuery(''); }}>
              Clear all
            </button>
          </div>
        )}
        <div className="patient-queue-grid">
          <AnimatePresence>
            {(() => {
              const sortedPatients = filteredPatients
                .filter(p => p.status !== "lab-testing" && p.status !== 'awaiting-staff' && !p.awaitingStaffCompleted)
                .sort((a, b) => {
                  // Emergency first
                  if (a.visitType === "emergency" && b.visitType !== "emergency") return -1;
                  if (b.visitType === "emergency" && a.visitType !== "emergency") return 1;
                  // Lab-returned second (priority)
                  if (a.status === "lab-returned" && b.status !== "lab-returned") return -1;
                  if (b.status === "lab-returned" && a.status !== "lab-returned") return 1;
                  // Then by token number
                  const tokenA = typeof a.tokenNumber === 'string' ? parseInt(a.tokenNumber.replace(/\D/g, '')) || 999 : a.tokenNumber || 999;
                  const tokenB = typeof b.tokenNumber === 'string' ? parseInt(b.tokenNumber.replace(/\D/g, '')) || 999 : b.tokenNumber || 999;
                  return tokenA - tokenB;
                });
              
              const displayedPatients = queueExpanded ? sortedPatients : sortedPatients.slice(0, QUEUE_LIMIT);
              const hiddenCount = sortedPatients.length - QUEUE_LIMIT;
              
              return (
                <>
                  {displayedPatients.map(patient => {
                    const doctor = clinicDoctors.find(d => d.id === patient.assignedDoctorId);
                    return (
                      <motion.div
                        key={patient.id}
                        className={`patient-card ${patient.visitType === "emergency" ? "emergency" : ""} ${patient.status === "inside" ? "active" : ""} ${patient.status === "lab-returned" ? "lab-priority" : ""}`}
                        style={{ '--doctor-color': doctor?.color || '#6366f1', '--doctor-color-light': doctor?.colorLight || 'rgba(99, 102, 241, 0.15)' }}
                        onClick={() => openEdit(patient)}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="patient-card-header">
                          <div className="token-number">
                            {patient.tokenNumber !== null ? patient.tokenNumber : "-"}
                          </div>
                          <div className="patient-info">
                            <div className="patient-name">{patient.name}</div>
                            <div className="patient-badges">
                              <span className={`visit-badge ${visitTypeLabels[patient.visitType].color}`}>
                                {visitTypeLabels[patient.visitType].icon} {visitTypeLabels[patient.visitType].label}
                              </span>
                              <span className={`status-badge ${statusLabels[patient.status]?.color || 'status-badge-waiting'}`}>
                                {statusLabels[patient.status]?.label || patient.status}
                              </span>
                            </div>
                            {doctor && (
                              <div className="patient-doctor-tag" style={{ background: doctor.colorLight, color: doctor.color }}>
                                {doctor.shortName}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="patient-card-actions">
                          {(patient.status === "waiting" || patient.status === "lab-returned") && (
                            <button
                              className="card-action-btn send-btn"
                              onClick={e => {
                                e.stopPropagation();
                                updatePatientStatus(patient.id, "inside");
                              }}
                            >
                              <span>🩺</span> {patient.status === "lab-returned" ? "Resume" : "Send In"}
                            </button>
                          )}
                          {patient.status === "inside" && (
                            <button
                              className="card-action-btn complete-btn"
                              onClick={e => {
                                e.stopPropagation();
                                updatePatientStatus(patient.id, "completed");
                              }}
                            >
                              <span>✓</span> Complete
                            </button>
                          )}
                          {patient.status === "completed" && (
                            <button
                              className="card-action-btn reset-btn"
                              onClick={e => {
                                e.stopPropagation();
                                updatePatientStatus(patient.id, "waiting");
                              }}
                            >
                              <span>↺</span> Reset
                            </button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                  {/* Show More / Show Less button */}
                  {hiddenCount > 0 && (
                    <motion.div
                      className="show-more-card"
                      onClick={() => setQueueExpanded(!queueExpanded)}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="show-more-content">
                        <span className="show-more-icon">{queueExpanded ? '↑' : '↓'}</span>
                        <span className="show-more-text">
                          {queueExpanded ? 'Show Less' : `+${hiddenCount} more patient${hiddenCount > 1 ? 's' : ''}`}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </>
              );
            })()}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Awaiting Staff Section */}
      {awaitingStaffPatients.length > 0 && (
        <motion.div 
          className="awaiting-staff-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.22 }}
        >
          <h2 className="section-title">
            <span>📦</span> Awaiting Staff ({awaitingStaffPatients.length})
          </h2>
          <div className="awaiting-staff-grid">
            <AnimatePresence>
              {awaitingStaffPatients.map(patient => (
                <motion.div
                  key={patient.id}
                  className="awaiting-staff-card"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  onClick={() => openEdit(patient)}
                >
                  <div className="as-header">
                    <div className="token-number">{patient.tokenNumber}</div>
                    <div className="patient-info">
                      <div className="patient-name">{patient.name}</div>
                      <span className={`status-badge ${statusLabels[patient.status]?.color || 'status-badge-waiting'}`}>
                        {statusLabels[patient.status]?.label || patient.status}
                      </span>
                    </div>
                  </div>
                  <div className="as-actions">
                    <button className="card-action-btn finish-btn" onClick={(e) => {
                        e.stopPropagation();
                        // mark as completed and keep visible in awaiting-staff list
                        setPatients(prev => prev.map(p => p.id === patient.id ? { ...p, status: 'completed', awaitingStaffCompleted: true } : p));
                      }}>
                      <span>✅</span> Finish
                    </button>
                    <button className="card-action-btn view-btn" onClick={(e) => { e.stopPropagation(); openEdit(patient); }}>
                      <span>🔎</span> View / Edit
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* At Lab Section */}
      {labTestingPatients.length > 0 && (
        <motion.div 
          className="lab-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          <h2 className="section-title">
            <span>🔬</span> At Lab ({labCount})
          </h2>
          <div className="lab-patient-grid">
            <AnimatePresence>
              {labTestingPatients.map(patient => (
                  <motion.div
                    key={patient.id}
                    className="lab-patient-card"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <div className="lab-patient-header">
                      <div className="token-number">{patient.tokenNumber}</div>
                      <div className="patient-info">
                        <div className="patient-name">{patient.name}</div>
                        <span className="status-badge status-badge-lab">
                          🧪 Testing in Progress
                        </span>
                      </div>
                    </div>
                    <div className="lab-patient-actions">
                      <button
                        className="card-action-btn lab-return-btn"
                        onClick={() => markLabReturned(patient.id)}
                      >
                        <span>✓</span> Patient Returned
                      </button>
                    </div>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      

      {/* Enquiry Section */}
      <motion.div 
        className="enquiry-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="section-title">
          <span>💬</span> Enquiries Today
        </h2>
        <div className="enquiry-grid">
          {patients
            .filter(p => p.visitType === "enquiry")
            .map(enq => (
              <div key={enq.id} className="enquiry-card">
                <div className="enquiry-name">{enq.name}</div>
                <div className="enquiry-purpose">{enq.issue}</div>
              </div>
            ))}
          {patients.filter(p => p.visitType === "enquiry").length === 0 && (
            <div className="empty-state">No enquiries today</div>
          )}
        </div>
      </motion.div>

      {/* Add Patient Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div 
            className="assistant-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="assistant-modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              <button className="modal-close-btn" onClick={closeModal}>✕</button>
              <form onSubmit={handleAddPatient}>
                <div className="modal-header">
                  <span className="modal-icon">
                    {modal === "walkin" && "➕"}
                    {modal === "emergency" && "🚨"}
                    {modal === "enquiry" && "❓"}
                  </span>
                  <h3>
                    {modal === "walkin" && "Add Walk-in Patient"}
                    {modal === "emergency" && "Emergency Entry"}
                    {modal === "enquiry" && "Log Enquiry"}
                  </h3>
                </div>
                {modal !== "enquiry" && (
                  <>
                    <div className="modal-input-group">
                      <label>Assign to Doctor <span className="required">*</span></label>
                      <div className="doctor-select-grid">
                        {clinicDoctors.map(doctor => {
                          const stats = getDoctorStats(doctor.id);
                          const isSelected = form.doctorId === doctor.id;
                          return (
                            <div 
                              key={doctor.id}
                              className={`doctor-select-card ${isSelected ? 'selected' : ''} ${doctorStatuses[doctor.id]}`}
                              style={{ '--doctor-color': doctor.color, '--doctor-color-light': doctor.colorLight }}
                              onClick={() => setForm({ ...form, doctorId: doctor.id })}
                            >
                              <div className="doctor-select-name">{doctor.shortName}</div>
                              <div className="doctor-select-info">
                                <span>{stats.waiting} waiting</span>
                                <span className={`doctor-select-status ${doctorStatuses[doctor.id]}`}>
                                  {doctorStatuses[doctor.id] === 'active' ? '🟢' : doctorStatuses[doctor.id] === 'paused' ? '🟠' : '⚫'}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="modal-input-group">
                      <label>Patient Name {modal === "walkin" && <span className="required">*</span>}</label>
                      <input
                        type="text"
                        placeholder="Enter patient name"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        required={modal === "walkin"}
                        autoFocus
                      />
                    </div>
                    <div className="modal-input-group">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        placeholder="Optional"
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                        maxLength={10}
                      />
                    </div>
                    <div className="modal-row">
                      <div className="modal-input-group half">
                        <label>Age</label>
                        <input
                          type="number"
                          placeholder="Optional"
                          value={form.age}
                          onChange={e => setForm({ ...form, age: e.target.value })}
                          maxLength={3}
                          min="0"
                          max="150"
                        />
                      </div>
                      <div className="modal-input-group half">
                        <label>Gender</label>
                        <select
                          value={form.gender}
                          onChange={e => setForm({ ...form, gender: e.target.value })}
                        >
                          <option value="">Select</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div className="modal-input-group">
                      <label>Issue / Symptoms</label>
                      <input
                        type="text"
                        placeholder="Brief description (optional)"
                        value={form.issue}
                        onChange={e => setForm({ ...form, issue: e.target.value })}
                      />
                    </div>
                  </>
                )}
                {modal === "enquiry" && (
                  <>
                    <div className="modal-input-group">
                      <label>Visitor Name</label>
                      <input
                        type="text"
                        placeholder="Optional"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        autoFocus
                      />
                    </div>
                    <div className="modal-input-group">
                      <label>Purpose / Query</label>
                      <input
                        type="text"
                        placeholder="What did they ask about?"
                        value={form.purpose}
                        onChange={e => setForm({ ...form, purpose: e.target.value })}
                      />
                    </div>
                  </>
                )}
                <div className="modal-actions">
                  <button type="submit" className="modal-btn primary">
                    <span>✓</span> Add
                  </button>
                  <button type="button" className="modal-btn secondary" onClick={closeModal}>
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Patient Modal */}
      <AnimatePresence>
        {editPatient && (
          <motion.div 
            className="assistant-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="assistant-modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              <button className="modal-close-btn" onClick={closeEdit}>✕</button>
              <div className="modal-header">
                <span className="modal-icon">📝</span>
                <h3>Edit Patient Details</h3>
              </div>
              <div className="edit-patient-name">{editPatient.name}</div>
              
              {/* Reassign Doctor */}
              {editPatient.visitType !== 'enquiry' && (
                <div className="modal-input-group">
                  <label>Assigned Doctor</label>
                  <div className="doctor-select-grid">
                    {clinicDoctors.map(doctor => {
                      const isSelected = editPatient.assignedDoctorId === doctor.id;
                      return (
                        <div 
                          key={doctor.id}
                          className={`doctor-select-card ${isSelected ? 'selected' : ''}`}
                          style={{ '--doctor-color': doctor.color, '--doctor-color-light': doctor.colorLight }}
                          onClick={() => setEditPatient({ ...editPatient, assignedDoctorId: doctor.id })}
                        >
                          <div className="doctor-select-name">{doctor.shortName}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              <div className="modal-input-group">
                <label>Age</label>
                <input
                  type="number"
                  placeholder="Enter age"
                  value={editPatient.age || ""}
                  onChange={e => setEditPatient({ ...editPatient, age: e.target.value })}
                />
              </div>
              <div className="modal-input-group">
                <label>Gender</label>
                <select
                  value={editPatient.gender || ""}
                  onChange={e => setEditPatient({ ...editPatient, gender: e.target.value })}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="modal-input-group">
                <label>Issue / Symptoms</label>
                <input
                  type="text"
                  placeholder="Brief description"
                  value={editPatient.issue || ""}
                  onChange={e => setEditPatient({ ...editPatient, issue: e.target.value })}
                />
              </div>
              {/* Visit editing for assistants */}
              {editingVisitDetails && (
                <>
                  <div className="modal-section">
                    <h4>Most Recent Visit</h4>
                    <div className="modal-input-group">
                      <label>Case Record</label>
                      <textarea rows={3} value={editingVisitDetails.caseRecord || ''} onChange={(e) => setEditingVisitDetails(prev => ({ ...prev, caseRecord: e.target.value }))} />
                    </div>
                    <div className="modal-input-group">
                      <label>Treatments / Notes</label>
                      <textarea rows={3} value={editingVisitDetails.treatments || ''} onChange={(e) => setEditingVisitDetails(prev => ({ ...prev, treatments: e.target.value }))} />
                    </div>
                    <div className="modal-input-group">
                      <label>Prescription - Medicines</label>
                      {(editingVisitDetails.medicines || []).length === 0 && <div className="empty-state">No medicines prescribed</div>}
                      {(editingVisitDetails.medicines || []).map((m, idx) => (
                        <div key={m.id || idx} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                          <div style={{ flex: 1 }}>{m.name}</div>
                          <input type="number" min="0" value={m.qty || 0} onChange={(e) => { const v = parseFloat(e.target.value) || 0; setEditingVisitDetails(prev => ({ ...prev, medicines: (prev.medicines || []).map(it => it.id === m.id ? { ...it, qty: v, totalPrice: v * (parseFloat(it.unitPrice || 0) || 0) } : it) })); }} style={{ width: 80 }} />
                          <input type="number" min="0" value={m.unitPrice || 0} onChange={(e) => { const up = parseFloat(e.target.value) || 0; setEditingVisitDetails(prev => ({ ...prev, medicines: (prev.medicines || []).map(it => it.id === m.id ? { ...it, unitPrice: up, totalPrice: (parseFloat(it.qty || 0) || 0) * up } : it) })); }} style={{ width: 100 }} />
                          <div>₹{(parseFloat(m.totalPrice) || 0).toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                    <div className="modal-input-group">
                      <label>Procedures</label>
                      {(editingVisitDetails.procedures || []).map(pr => (
                        <div key={pr.id} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                          <div style={{ flex: 1 }}>{pr.name}</div>
                          <input type="number" min="0" value={pr.fee || 0} onChange={(e) => { const f = parseFloat(e.target.value) || 0; setEditingVisitDetails(prev => ({ ...prev, procedures: (prev.procedures || []).map(it => it.id === pr.id ? { ...it, fee: f } : it) })); }} style={{ width: 100 }} />
                        </div>
                      ))}
                    </div>
                    <div className="modal-input-group">
                      <label>Final Amount</label>
                      <input type="number" min="0" value={editingVisitDetails.finalAmount || ''} onChange={(e) => setEditingVisitDetails(prev => ({ ...prev, finalAmount: e.target.value }))} />
                    </div>
                  </div>
                  <div className="modal-actions">
                    <button className="modal-btn primary" onClick={(e) => { e.preventDefault(); handleSaveVisitEdits(); }}>
                      <span>💾</span> Save Visit
                    </button>
                    <button className="modal-btn primary" onClick={(e) => { e.preventDefault(); handleFinishVisit(); }}>
                      <span>✅</span> Finish Visit
                    </button>
                  </div>
                </>
              )}
              <div className="modal-actions">
                <button className="modal-btn primary" onClick={() => handleEditSave(editPatient)}>
                  <span>✓</span> Save
                </button>
                <button className="modal-btn secondary" onClick={closeEdit}>
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ClinicAssistantDashboard;
