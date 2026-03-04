import { useState } from 'react'
import { motion } from 'framer-motion'

export default function BookingForm({ doctor, date, slot, session, onConfirm, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    reason: ''
  })
  const [errors, setErrors] = useState({})

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}
    
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required'
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Enter valid 10-digit number'
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    onConfirm(formData)
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const isToken = doctor.bookingType === 'token'

  // Only close if click is on overlay, not inside modal
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="booking-modal-overlay" onClick={handleOverlayClick}>
      <motion.div 
        className="booking-form-modal"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        onClick={e => e.stopPropagation()}
      >
        <button className="booking-modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <h3 className="booking-form-title">
          <span>📝</span> Complete Your Booking
        </h3>

        <div className="booking-summary">
        <div className="summary-item">
          <span className="summary-label"><span>👨‍⚕️</span> Doctor</span>
          <span className="summary-value">{doctor.name}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label"><span>📅</span> Date</span>
          <span className="summary-value">{new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
        </div>
        {isToken ? (
          <>
            <div className="summary-item">
              <span className="summary-label"><span>🕐</span> Session</span>
              <span className="summary-value">{session?.name} ({session?.startTime} - {session?.endTime})</span>
            </div>
            <div className="summary-item" style={{ background: 'rgba(99, 102, 241, 0.1)', margin: '8px -20px', padding: '14px 20px', borderRadius: 'var(--radius-md)' }}>
              <span className="summary-label"><span>🎫</span> Token Number</span>
              <span className="summary-value token-number">#{session?.currentToken + 1}</span>
            </div>
          </>
        ) : (
          <div className="summary-item">
            <span className="summary-label"><span>⏰</span> Time</span>
            <span className="summary-value">{slot}</span>
          </div>
        )}
        <div className="summary-item">
          <span className="summary-label"><span>💰</span> Fee</span>
          <span className="summary-value fee">₹{doctor.consultationFee}</span>
        </div>
      </div>

        <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-group">
          <label><span>👤</span> Patient Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label><span>📱</span> Phone Number</label>
          <div className="phone-input-wrapper">
            <span className="country-code">+91</span>
            <input
              type="tel"
              placeholder="Enter 10-digit number"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
              className={errors.phone ? 'error' : ''}
            />
          </div>
          {errors.phone && <span className="error-text">{errors.phone}</span>}
          <span className="helper-text">You'll receive booking confirmation on WhatsApp</span>
        </div>

        <div className="form-group">
          <label><span>📋</span> Reason for Visit (Optional)</label>
          <textarea
            placeholder="Brief description of your symptoms or reason for consultation"
            value={formData.reason}
            onChange={(e) => handleChange('reason', e.target.value)}
            rows={3}
          />
        </div>

        <motion.button
          type="submit"
          className="confirm-booking-btn"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <span>✅</span>
          <span>Confirm Booking</span>
          <span className="btn-price">₹{doctor.consultationFee}</span>
        </motion.button>

        <p className="booking-note">
          💡 No payment required now. Pay at the clinic.
        </p>
        </form>
      </motion.div>
    </div>
  )
}
