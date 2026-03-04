import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function BookingSuccess() {
  const location = useLocation()
  const booking = location.state?.booking

  if (!booking) {
    return (
      <div className="success-page">
        <div className="error-container">
          <span className="error-icon">❌</span>
          <h2>No Booking Found</h2>
          <p>It seems you arrived here without completing a booking.</p>
          <Link to="/" className="back-home-btn">
            <span>←</span> Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const isToken = booking.bookingType === 'token'

  return (
    <div className="success-page">
      <motion.div 
        className="success-container"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="success-icon"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        >
          ✅
        </motion.div>

        <motion.h1 
          className="success-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Booking Confirmed!
        </motion.h1>

        <motion.p 
          className="success-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Your appointment has been successfully booked
        </motion.p>

        <motion.div 
          className="booking-details-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="booking-id-row">
            <span className="booking-id-label">Booking ID</span>
            <div className="booking-id-value">
              <span>{booking.id}</span>
              <button className="copy-btn" onClick={() => navigator.clipboard.writeText(booking.id)}>
                Copy
              </button>
            </div>
          </div>

          <div className="booking-detail-row">
            <span className="detail-icon">👨‍⚕️</span>
            <div className="detail-content">
              <span className="detail-label">Doctor</span>
              <span className="detail-value">{booking.doctorName}</span>
            </div>
          </div>

          <div className="booking-detail-row">
            <span className="detail-icon">🩺</span>
            <div className="detail-content">
              <span className="detail-label">Specialty</span>
              <span className="detail-value">{booking.specialty}</span>
            </div>
          </div>

          <div className="booking-detail-row">
            <span className="detail-icon">📅</span>
            <div className="detail-content">
              <span className="detail-label">Date</span>
              <span className="detail-value">
                {new Date(booking.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>

          {isToken ? (
            <>
              <div className="booking-detail-row">
                <span className="detail-icon">🕐</span>
                <div className="detail-content">
                  <span className="detail-label">Session</span>
                  <span className="detail-value">{booking.session?.name} ({booking.session?.startTime} - {booking.session?.endTime})</span>
                </div>
              </div>
              <div className="booking-detail-row highlight">
                <span className="detail-icon">🎫</span>
                <div className="detail-content">
                  <span className="detail-label">Your Token Number</span>
                  <span className="detail-value token">#{booking.tokenNumber}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="booking-detail-row">
              <span className="detail-icon">⏰</span>
              <div className="detail-content">
                <span className="detail-label">Time</span>
                <span className="detail-value">{booking.slot}</span>
              </div>
            </div>
          )}

          <div className="booking-detail-row">
            <span className="detail-icon">👤</span>
            <div className="detail-content">
              <span className="detail-label">Patient</span>
              <span className="detail-value">{booking.name}</span>
            </div>
          </div>

          <div className="booking-detail-row">
            <span className="detail-icon">💰</span>
            <div className="detail-content">
              <span className="detail-label">Consultation Fee</span>
              <span className="detail-value fee">₹{booking.fee}</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="account-prompt-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="success-icon">✅</div>
          <h3>Booking Confirmed!</h3>
          <h4>Your appointment has been successfully booked</h4>
          <p>
            We've created an account for you using your phone number{' '}
            <strong>+91 {booking.phone}</strong>
          </p>
          <p className="account-hint">
            Next time, just login with OTP to view and manage your appointments.
          </p>
        </motion.div>

        <motion.div 
          className="whatsapp-notification"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <span className="whatsapp-icon">📱</span>
          <p>
            Booking confirmation sent to WhatsApp
            <br />
            <strong>+91 {booking.phone}</strong>
          </p>
        </motion.div>

        <motion.div 
          className="success-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Link to="/" className="action-btn primary">
            <span>🏠</span>
            <span>Back to Home</span>
          </Link>
          <Link to="/login" className="action-btn secondary">
            <span>👤</span>
            <span>View Appointments</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
