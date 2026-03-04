import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { doctors } from '../data/dummyData'

export default function ClinicCard({ clinic }) {
  const navigate = useNavigate()
  const clinicDoctors = doctors.filter((d) => clinic.doctorIds.includes(d.id))

  return (
    <motion.div 
      className="clinic-card" 
      onClick={() => navigate(`/clinic/${clinic.id}`)}
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="clinic-card-image">
        <img src={clinic.image} alt={clinic.name} />
        <span className="clinic-specialty-badge">{clinic.specialty}</span>
      </div>

      <div className="clinic-card-content">
        <h3 className="clinic-name">{clinic.name}</h3>
        <p className="clinic-description">{clinic.description}</p>

        <div className="clinic-stats">
          <div className="clinic-stat">
            <span>⭐</span>
            <span>{clinic.rating}</span>
            <span style={{ color: 'var(--text-muted)' }}>({clinic.reviewCount})</span>
          </div>
          <div className="clinic-stat">
            <span>👨‍⚕️</span>
            <span>{clinicDoctors.length} doctors</span>
          </div>
        </div>

        <div className="clinic-location">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>{clinic.address}</span>
        </div>

        <div className="clinic-timings">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          <span>{clinic.timings}</span>
        </div>

        <div className="clinic-facilities">
          {clinic.facilities.slice(0, 4).map((facility, idx) => (
            <span key={idx} className="facility-tag">{facility}</span>
          ))}
        </div>

        <div className="clinic-doctors-preview">
          {clinicDoctors.slice(0, 3).map((doc) => (
            <img key={doc.id} src={doc.image} alt={doc.name} className="doctor-preview-avatar" />
          ))}
          {clinicDoctors.length > 3 && (
            <span className="more-doctors">+{clinicDoctors.length - 3}</span>
          )}
        </div>
      </div>

      <button className="view-clinic-btn">View Clinic →</button>
    </motion.div>
  )
}
