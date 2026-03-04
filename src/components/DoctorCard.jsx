import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { formatDate } from '../data/dummyData'

export default function DoctorCard({ doctor }) {
  const navigate = useNavigate()

  return (
    <motion.div
      className="doctor-card"
      onClick={() => navigate(`/doctor/${doctor.id}`)}
      whileHover={{ y: -8, boxShadow: '0 20px 60px rgba(99, 102, 241, 0.15)' }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3 }}
    >
      <div className="doctor-card-header">
        <div className="doctor-avatar-wrapper">
          <img src={doctor.image} alt={doctor.name} className="doctor-avatar" />
          {doctor.isAvailable && <div className="doctor-status" />}
        </div>
        <div className="doctor-card-info">
          <h3 className="doctor-name">{doctor.name}</h3>
          <p className="doctor-qualification">{doctor.qualification}</p>
          <span className="doctor-specialty">
            <span>🩺</span>
            {doctor.specialty}
          </span>
        </div>
      </div>

      <div className="doctor-card-stats">
        <div className="doctor-stat">
          <div className="stat-icon">⭐</div>
          <div className="stat-info">
            <span className="stat-value">{doctor.rating}</span>
            <span className="stat-label">Rating</span>
          </div>
        </div>
        <div className="doctor-stat">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <span className="stat-value">{doctor.experience} yrs</span>
            <span className="stat-label">Experience</span>
          </div>
        </div>
        <div className="doctor-stat">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <span className="stat-value">{doctor.patientsCount}+</span>
            <span className="stat-label">Patients</span>
          </div>
        </div>
      </div>


      <div className="doctor-card-footer">
        <div className="doctor-location">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>{doctor.location}</span>
        </div>
        <span className={`booking-type-badge ${doctor.bookingType}`}>
          {doctor.bookingType === 'timeslot' ? '⏰ Timeslot' : '🎫 Token'}
        </span>
      </div>

      {/* Show session timings for today if available */}
      {doctor.availability && (() => {
        const today = new Date().toISOString().split('T')[0];
        const avail = doctor.availability[today];
        if (avail && avail.sessions && avail.sessions.length > 0) {
          return (
            <div style={{ padding: '0 24px 12px', color: 'var(--text-muted)', fontSize: '0.95em' }}>
              {avail.sessions.map((s, i) => (
                <div key={i} style={{ marginBottom: 2 }}>
                  <span style={{ fontWeight: 500 }}>{s.name}
                    {s.start && s.end ? `: ${s.start} - ${s.end}` : ''}
                  </span>
                </div>
              ))}
            </div>
          );
        }
        return null;
      })()}

      <div style={{ padding: '0 24px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="doctor-fee">₹{doctor.consultationFee}</span>
        <motion.button
          style={{
            padding: '12px 24px',
            background: 'var(--primary)',
            color: 'white',
            borderRadius: 'var(--radius-lg)',
            fontWeight: 600,
            fontSize: '0.9375rem'
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Book Now
        </motion.button>
      </div>
    </motion.div>
  )
}
