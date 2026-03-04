import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { clinics, doctors, clinicDoctors } from '../data/dummyData'
import DoctorCard from '../components/DoctorCard'
import Header from '../components/Header'

export default function ClinicProfile() {
  const { id } = useParams()
  const clinic = clinics.find(c => c.id === parseInt(id))
  const [activeTab, setActiveTab] = useState('doctors')

  if (!clinic) {
    return (
      <div className="clinic-profile-page">
        <div className="error-container">
          <span className="error-icon">❌</span>
          <h2>Clinic Not Found</h2>
          <p>The clinic you're looking for doesn't exist.</p>
          <Link to="/" className="back-home-btn">
            <span>←</span> Back to Home
          </Link>
        </div>
      </div>
    )
  }

  // Support both numeric and string doctorIds (for clinics like MediBook Clinic)
  const mainDoctors = doctors.filter(doc => clinic.doctorIds.includes(doc.id))
  const extraDoctors = clinicDoctors.filter(doc => clinic.doctorIds.includes(doc.id))
  const allDoctors = [...mainDoctors, ...extraDoctors]

  return (
    <div className="clinic-profile-page">
      <motion.div 
        className="clinic-banner"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="banner-gradient"></div>
        <div className="banner-content">
          <motion.div 
            className="clinic-logo"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            🏥
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {clinic.name}
          </motion.h1>
          <motion.div 
            className="clinic-meta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="meta-item">
              <span>📍</span>
              <span>{clinic.location}</span>
            </span>
            <span className="meta-item">
              <span>⭐</span>
              <span>{clinic.rating}</span>
            </span>
            <span className="meta-item">
              <span>👨‍⚕️</span>
              <span>{clinicDoctors.length} Doctors</span>
            </span>
          </motion.div>
        </div>
      </motion.div>

      <div className="clinic-content">
        <motion.div 
          className="clinic-info-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="info-section">
            <h3>📍 Address</h3>
            <p>{clinic.location}</p>
          </div>

          <div className="info-section">
            <h3>🕐 Timings</h3>
            <p>{clinic.timings}</p>
          </div>

          <div className="info-section">
            <h3>📞 Contact</h3>
            <p>+91 98765 43210</p>
          </div>

          <div className="info-section">
            <h3>🩺 Specialty</h3>
            <div className="specialty-tags">
              <span className="specialty-tag">{clinic.specialty}</span>
            </div>
          </div>

          <div className="info-section">
            <h3>✨ Facilities</h3>
            <div className="facility-tags">
              {clinic.facilities.map((facility, index) => (
                <span key={index} className="facility-tag">
                  {facility}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="clinic-stats"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="stat-item">
            <span className="stat-value">15+</span>
            <span className="stat-label">Years</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">50K+</span>
            <span className="stat-label">Patients</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{clinic.rating}</span>
            <span className="stat-label">Rating</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{clinicDoctors.length}</span>
            <span className="stat-label">Doctors</span>
          </div>
        </motion.div>

        <motion.div 
          className="clinic-tabs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <button 
            className={`tab-btn ${activeTab === 'doctors' ? 'active' : ''}`}
            onClick={() => setActiveTab('doctors')}
          >
            <span>👨‍⚕️</span>
            <span>Our Doctors</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            <span>ℹ️</span>
            <span>About</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            <span>🖼️</span>
            <span>Gallery</span>
          </button>
        </motion.div>

        {activeTab === 'doctors' && (
          <motion.div 
            className="doctors-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2>Our Doctors</h2>
            <div className="doctors-grid">
              {allDoctors.map((doctor, index) => (
                <motion.div
                  key={doctor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <DoctorCard doctor={doctor} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'about' && (
          <motion.div 
            className="about-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2>About {clinic.name}</h2>
            <div className="about-content">
              <p>
                {clinic.name} is a premier healthcare facility dedicated to providing exceptional 
                medical care to our community. With a team of highly qualified doctors and 
                state-of-the-art facilities, we ensure that every patient receives personalized 
                attention and the best possible treatment.
              </p>
              <p>
                Our clinic offers comprehensive healthcare services across multiple specialties,
                including {Array.isArray(clinic.specialties) ? clinic.specialties.join(', ') : clinic.specialty}.
                We are committed to maintaining the highest standards of medical practice while ensuring a comfortable and welcoming environment for all our patients.
              </p>
              <div className="about-features">
                <div className="feature-item">
                  <span className="feature-icon">✅</span>
                  <div>
                    <h4>Expert Care</h4>
                    <p>Highly qualified and experienced medical professionals</p>
                  </div>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🏥</span>
                  <div>
                    <h4>Modern Facilities</h4>
                    <p>State-of-the-art medical equipment and infrastructure</p>
                  </div>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">💝</span>
                  <div>
                    <h4>Patient First</h4>
                    <p>Compassionate care with focus on patient well-being</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'gallery' && (
          <motion.div 
            className="gallery-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2>Gallery</h2>
            <div className="gallery-grid">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="gallery-item">
                  <div className="gallery-placeholder">
                    <span>🏥</span>
                    <span>Clinic Photo {item}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
