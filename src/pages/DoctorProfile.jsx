import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '../components/Header'
import DatePicker from '../components/DatePicker'
import TimeSlotGrid from '../components/TimeSlotGrid'
import TokenSessionPicker from '../components/TokenSessionPicker'
import BookingForm from '../components/BookingForm'
import { doctors, clinicDoctors, getNextDays, generateTimeSlots } from '../data/dummyData'

export default function DoctorProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  let doctor = doctors.find((d) => d.id === Number(id))
  if (!doctor) {
    // Try to find in clinicDoctors (string id)
    doctor = clinicDoctors.find((d) => String(d.id) === String(id))
  }

  // Use date string for selectedDate
  const [selectedDate, setSelectedDate] = useState(getNextDays(1)[0].date)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [selectedSession, setSelectedSession] = useState(null)
  const [showBookingForm, setShowBookingForm] = useState(false)

  if (!doctor) {
    return (
      <div className="page">
        <div className="error-container">
          <span className="error-icon">🔍</span>
          <h2>Doctor Not Found</h2>
          <p>The doctor you're looking for doesn't exist.</p>
          <Link to="/" className="back-home-btn">
            <span>←</span> Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const availability = doctor.availability?.[selectedDate]
  const isToken = doctor.bookingType === 'token'

  // For timeslot-based doctors, generate slots dynamically
  let slots = []
  if (!isToken && availability && availability.sessions) {
    slots = generateTimeSlots(
      availability.sessions,
      doctor.slotDuration,
      availability.bookedSlots || []
    )
  }

  const handleDateChange = (date) => {
    setSelectedDate(date)
    setSelectedSlot(null)
    setSelectedSession(null)
    setShowBookingForm(false)
  }

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot)
    setShowBookingForm(true)
  }

  const handleSessionSelect = (session) => {
    setSelectedSession(session)
    setShowBookingForm(true)
  }

  const handleConfirmBooking = (formData) => {
    const booking = {
      id: `BK${Date.now()}`,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorImage: doctor.image,
      specialty: doctor.specialty,
      date: selectedDate,
      slot: selectedSlot,
      session: selectedSession,
      tokenNumber: selectedSession ? selectedSession.currentToken + 1 : null,
      ...formData,
      fee: doctor.consultationFee,
      bookingType: doctor.bookingType
    }
    navigate('/booking-success', { state: { booking } })
  }

  return (
    <div className="page profile-page">

      {/* Doctor Header */}
      <motion.div 
        className="profile-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="profile-header-content">
          <img src={doctor.image} alt={doctor.name} className="profile-avatar" />
          <div className="profile-info">
            <h1 className="profile-name">{doctor.name}</h1>
            <p className="profile-qualification">{doctor.qualification}</p>
            <span className="profile-specialty-badge">🩺 {doctor.specialty}</span>
            
            <div className="profile-stats">
              <div className="profile-stat">
                <div className="profile-stat-icon">⭐</div>
                <div className="profile-stat-info">
                  <span className="value">{doctor.rating}</span>
                  <span className="label">Rating</span>
                </div>
              </div>
              <div className="profile-stat">
                <div className="profile-stat-icon">📋</div>
                <div className="profile-stat-info">
                  <span className="value">{doctor.experience} yrs</span>
                  <span className="label">Experience</span>
                </div>
              </div>
              <div className="profile-stat">
                <div className="profile-stat-icon">👥</div>
                <div className="profile-stat-info">
                  <span className="value">{doctor.patientsCount}+</span>
                  <span className="label">Patients</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="profile-content">
        {/* About Section */}
        <motion.section 
          className="profile-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="profile-section-title"><span>ℹ️</span> About</h2>
          <p className="profile-about">{doctor.about}</p>
        </motion.section>

        {/* Info Cards */}
        <motion.section 
          className="profile-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="profile-info-grid">
            <div className="profile-info-card">
              <span className="icon">📍</span>
              <span className="label">Location</span>
              <span className="value">{doctor.location}</span>
            </div>
            <div className="profile-info-card">
              <span className="icon">💰</span>
              <span className="label">Consultation Fee</span>
              <span className="value" style={{ color: 'var(--accent-green)' }}>₹{doctor.consultationFee}</span>
            </div>
            <div className="profile-info-card">
              <span className="icon">{isToken ? '🎫' : '⏰'}</span>
              <span className="label">Booking Type</span>
              <span className="value">{isToken ? 'Token System' : 'Time Slots'}</span>
            </div>
            <div className="profile-info-card">
              <span className="icon">🏥</span>
              <span className="label">Languages</span>
              <span className="value">{doctor.languages?.join(', ') || 'English, Hindi'}</span>
            </div>
          </div>
        </motion.section>

        {/* Booking Section */}
        <motion.section 
          className="booking-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="booking-section-title"><span>📅</span> Book Appointment</h2>
          
          <DatePicker 
            selectedDate={selectedDate} 
            onSelectDate={handleDateChange} 
          />

          <AnimatePresence mode="wait">
            {isToken ? (
              <motion.div
                key="token"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <TokenSessionPicker
                  sessions={availability?.sessions}
                  selectedSession={selectedSession}
                  onSelectSession={handleSessionSelect}
                />
              </motion.div>
            ) : (
              <motion.div
                key="timeslot"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <TimeSlotGrid
                  slots={slots}
                  selectedSlot={selectedSlot}
                  onSelectSlot={handleSlotSelect}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* Booking Form */}
        <AnimatePresence>
          {showBookingForm && (
            <BookingForm
              doctor={doctor}
              date={selectedDate}
              slot={selectedSlot}
              session={selectedSession}
              onConfirm={handleConfirmBooking}
              onClose={() => setShowBookingForm(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
