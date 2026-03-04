import { useState, useEffect, useCallback } from 'react';

const QUEUE_STORAGE_KEY = 'clinic_queue_data';

// Initial demo patients with visit history
const defaultPatients = [
  {
    id: 1,
    name: "John Doe",
    phone: "9876543210",
    tokenNumber: "T1",
    visitType: "app",
    status: "waiting",
    age: 45,
    gender: "Male",
    issue: "Fever and headache",
    assignedDoctorId: "dr1",
    symptoms: "",
    notes: "",
    medicalHistory: "No known drug allergies. Past surgery: appendectomy (2018).",
    visitHistory: [
      {
        date: "2026-02-07",
        symptoms: "Mild fever, sore throat",
        diagnosis: "Viral pharyngitis",
        prescription: "Paracetamol 500mg as needed, salt gargles",
        doctor: "Dr. Sarah Johnson",
        caseRecord: "Presented with sore throat for 2 days, no breathing difficulty.",
        treatments: "Symptomatic treatment, fluids, rest"
      },
      {
        date: "2025-12-15",
        symptoms: "High fever, body ache, fatigue",
        diagnosis: "Viral fever",
        prescription: "Paracetamol 500mg, Rest advised, Plenty of fluids",
        doctor: "Dr. Sarah Johnson"
      },
      {
        date: "2025-08-22",
        symptoms: "Persistent cough, mild fever",
        diagnosis: "Upper respiratory infection",
        prescription: "Cough syrup, Azithromycin 500mg for 3 days",
        doctor: "Dr. Sarah Johnson"
      }
    ]
  },
  {
    id: 2,
    name: "Mary Smith",
    phone: "9876543211",
    tokenNumber: "T2",
    visitType: "walkin",
    status: "inside",
    age: 60,
    gender: "Female",
    issue: "Regular checkup",
    assignedDoctorId: "dr1",
    symptoms: "",
    notes: "",
    medicalHistory: "Hypertension diagnosed 2019. On Amlodipine 5mg daily.",
    visitHistory: [
      {
        date: "2026-02-06",
        symptoms: "Routine check - mild dizziness",
        diagnosis: "Stable hypertension",
        prescription: "Continue Amlodipine 5mg",
        doctor: "Dr. Sarah Johnson",
        caseRecord: "BP 130/80, no new complaints.",
        treatments: "Continue current antihypertensive; advise diet"
      },
      {
        date: "2025-11-10",
        symptoms: "Routine BP check, mild dizziness",
        diagnosis: "Hypertension - controlled",
        prescription: "Continue Amlodipine 5mg, reduce salt intake",
        doctor: "Dr. Sarah Johnson"
      },
      {
        date: "2025-06-05",
        symptoms: "Joint pain, stiffness in knees",
        diagnosis: "Osteoarthritis",
        prescription: "Calcium supplements, physiotherapy recommended",
        doctor: "Dr. Sarah Johnson"
      },
      {
        date: "2025-02-18",
        symptoms: "Fatigue, shortness of breath",
        diagnosis: "Anemia, low hemoglobin",
        prescription: "Iron supplements, dietary changes",
        doctor: "Dr. Sarah Johnson"
      }
    ]
  },
  {
    id: 3,
    name: "Emergency Case",
    phone: "9876543212",
    tokenNumber: "E1",
    visitType: "emergency",
    status: "waiting",
    age: 35,
    gender: "Male",
    issue: "Chest pain",
    assignedDoctorId: "dr1",
    symptoms: "",
    notes: "",
    visitHistory: []
  },
  {
    id: 4,
    name: "Alice Brown",
    phone: "9876543213",
    tokenNumber: "T1",
    visitType: "app",
    status: "waiting",
    age: 28,
    gender: "Female",
    issue: "Child vaccination",
    assignedDoctorId: "dr2",
    symptoms: "",
    notes: "",
    medicalHistory: "Childhood vaccinations up to date.",
    visitHistory: [
      {
        date: "2025-09-30",
        symptoms: "Routine vaccination - 6 month checkup",
        diagnosis: "Healthy, vaccinations up to date",
        prescription: "DPT vaccine administered",
        doctor: "Dr. Priya Nair",
        caseRecord: "Routine vaccination visit; no adverse events.",
        treatments: "Vaccine administered, advise observation for 30 minutes"
      }
    ]
  },
  {
    id: 6,
    name: "Baby Kumar",
    phone: "9876543214",
    tokenNumber: "T2",
    visitType: "walkin",
    status: "waiting",
    age: 2,
    gender: "Male",
    issue: "Mild fever and cold",
    assignedDoctorId: "dr2",
    symptoms: "",
    notes: "",
    visitHistory: [
      {
        date: "2025-11-20",
        symptoms: "Cough, runny nose",
        diagnosis: "Common cold",
        prescription: "Paracetamol syrup, nasal drops",
        doctor: "Dr. Priya Nair"
      }
    ]
  },
  {
    id: 5,
    name: "Visitor",
    phone: "",
    tokenNumber: null,
    visitType: "enquiry",
    status: "completed",
    age: null,
    gender: null,
    issue: "Enquiry about timings",
    assignedDoctorId: "dr1",
    symptoms: "",
    notes: "",
    visitHistory: []
  }
];

// Get initial state from localStorage or use defaults
const getInitialPatients = () => {
  try {
    const stored = localStorage.getItem(QUEUE_STORAGE_KEY);
    if (stored) {
      const patients = JSON.parse(stored);
      // Migrate existing patients: assign to dr1 if no doctor assigned
      const migratedPatients = patients.map(p => ({
        ...p,
        assignedDoctorId: p.assignedDoctorId || 'dr1'
      }));
      // Save migrated data back to localStorage
      if (patients.some(p => !p.assignedDoctorId)) {
        localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(migratedPatients));
      }
      return migratedPatients;
    }
  } catch (e) {
    console.error('Error reading queue from localStorage:', e);
  }
  return defaultPatients;
};

// Custom hook for shared queue state
export function useSharedQueue() {
  const [patients, setPatients] = useState(getInitialPatients);

  // Save to localStorage whenever patients change
  useEffect(() => {
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(patients));
  }, [patients]);

  // Listen for changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === QUEUE_STORAGE_KEY && e.newValue) {
        try {
          const newPatients = JSON.parse(e.newValue);
          setPatients(newPatients);
        } catch (err) {
          console.error('Error parsing queue data:', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Update patient status
  const updatePatientStatus = useCallback((id, status, extraData = {}) => {
    setPatients(prev => {
      const updated = prev.map(p => 
        p.id === id ? { ...p, status, ...extraData } : p
      );
      return updated;
    });
  }, []);

  // Add new patient
  const addPatient = useCallback((patient) => {
    setPatients(prev => {
      // For emergencies, add at beginning
      if (patient.visitType === 'emergency') {
        return [patient, ...prev];
      }
      return [...prev, patient];
    });
  }, []);

  // Update patient details
  const updatePatient = useCallback((id, updates) => {
    setPatients(prev => prev.map(p => 
      p.id === id ? { ...p, ...updates } : p
    ));
  }, []);

  // Get next token number for regular patients (T1, T2, T3...)
  const getNextToken = useCallback(() => {
    const tokens = patients
      .filter(p => typeof p.tokenNumber === 'string' && p.tokenNumber.startsWith('T'))
      .map(p => parseInt(p.tokenNumber.replace('T', '')) || 0);
    return tokens.length ? Math.max(...tokens) + 1 : 1;
  }, [patients]);

  // Get next emergency token number (E0, E1, E2...)
  const getNextEmergencyToken = useCallback(() => {
    const tokens = patients
      .filter(p => typeof p.tokenNumber === 'string' && p.tokenNumber.startsWith('E'))
      .map(p => parseInt(p.tokenNumber.replace('E', '')) || 0);
    return tokens.length ? Math.max(...tokens) + 1 : 0;
  }, [patients]);

  // Reset queue to defaults
  const resetQueue = useCallback(() => {
    setPatients(defaultPatients);
  }, []);

  return {
    patients,
    setPatients,
    updatePatientStatus,
    addPatient,
    updatePatient,
    getNextToken,
    getNextEmergencyToken,
    resetQueue
  };
}

export default useSharedQueue;
