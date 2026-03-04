import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('upcoming')
  
  // Demo appointments data
  const [appointments] = useState([
    {
      id: 'APT001',
      doctorName: 'Dr. Sarah Johnson',
      specialty: 'Cardiologist',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      time: '10:00 AM',
      type: 'slot',
      status: 'confirmed',
      fee: 500,
      avatar: 'SJ'
    },
    {
      id: 'APT002',
      doctorName: 'Dr. Michael Chen',
      specialty: 'Dermatologist',
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      tokenNumber: 12,
      session: 'Morning (9 AM - 12 PM)',
      type: 'token',
      status: 'confirmed',
      fee: 400,
      avatar: 'MC'
    },
    {
      id: 'APT003',
      doctorName: 'Dr. Emily Williams',
      specialty: 'General Physician',
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      time: '2:30 PM',
      type: 'slot',
      status: 'completed',
      fee: 300,
      avatar: 'EW'
    },
    {
      id: 'APT004',
      doctorName: 'Dr. Sarah Johnson',
      specialty: 'Cardiologist',
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      time: '11:00 AM',
      type: 'slot',
      status: 'completed',
      fee: 500,
      avatar: 'SJ'
    }
  ])

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const parsed = JSON.parse(storedUser)
      if (parsed.role && parsed.role === 'assistant') {
        navigate('/assistant')
        return
      }
      if (parsed.role && parsed.role === 'doctor') {
        navigate('/doctor')
        return
      }
      setUser(parsed)
    } else {
      navigate('/login')
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/')
  }

  const upcomingAppointments = appointments.filter(apt => 
    new Date(apt.date) > new Date() && apt.status !== 'cancelled'
  )
  const pastAppointments = appointments.filter(apt => 
    new Date(apt.date) <= new Date() || apt.status === 'completed'
  )

  const currentAppointments = activeTab === 'upcoming' ? upcomingAppointments : pastAppointments

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  if (!user) {
    return null
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <motion.div 
          className="dashboard-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="user-info">
            <div className="user-avatar">
              {user.phone?.slice(-2) || '👤'}
            </div>
            <div className="user-details">
              <h1>My Appointments</h1>
              <p>+91 {user.phone}</p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <span>Logout</span>
            <span>→</span>
          </button>
        </motion.div>

        <motion.div 
          className="stats-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="stat-card">
            <span className="stat-icon">📅</span>
            <div className="stat-content">
              <span className="stat-value">{upcomingAppointments.length}</span>
              <span className="stat-label">Upcoming</span>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">✅</span>
            <div className="stat-content">
              <span className="stat-value">{pastAppointments.length}</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">⭐</span>
            <div className="stat-content">
              <span className="stat-value">2</span>
              <span className="stat-label">Reviews</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="tabs-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <button 
            className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            <span>📅</span>
            <span>Upcoming</span>
            {upcomingAppointments.length > 0 && (
              <span className="tab-badge">{upcomingAppointments.length}</span>
            )}
          </button>
          <button 
            className={`tab-btn ${activeTab === 'past' ? 'active' : ''}`}
            onClick={() => setActiveTab('past')}
          >
            <span>📋</span>
            <span>Past</span>
          </button>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            className="appointments-list"
            initial={{ opacity: 0, x: activeTab === 'upcoming' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: activeTab === 'upcoming' ? 20 : -20 }}
          >
            {currentAppointments.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">{activeTab === 'upcoming' ? '📅' : '📋'}</span>
                <h3>No {activeTab} appointments</h3>
                <p>
                  {activeTab === 'upcoming' 
                    ? 'Book an appointment with our top doctors'
                    : 'Your past appointments will appear here'
                  }
                </p>
                {activeTab === 'upcoming' && (
                  <Link to="/" className="book-now-btn">
                    <span>🔍</span>
                    <span>Find Doctors</span>
                  </Link>
                )}
              </div>
            ) : (
              currentAppointments.map((apt, index) => (
                <motion.div 
                  key={apt.id}
                  className="appointment-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="apt-header">
                    <div className="doctor-avatar">{apt.avatar}</div>
                    <div className="apt-info">
                      <h3>{apt.doctorName}</h3>
                      <p className="apt-specialty">{apt.specialty}</p>
                    </div>
                    <span className={`status-badge ${apt.status}`}>
                      {apt.status}
                    </span>
                  </div>

                  <div className="apt-details">
                    <div className="detail-item">
                      <span className="detail-icon">📅</span>
                      <span>{formatDate(apt.date)}</span>
                    </div>
                    {apt.type === 'token' ? (
                      <>
                        <div className="detail-item">
                          <span className="detail-icon">🕐</span>
                          <span>{apt.session}</span>
                        </div>
                        <div className="detail-item highlight">
                          <span className="detail-icon">🎫</span>
                          <span>Token #{apt.tokenNumber}</span>
                        </div>
                      </>
                    ) : (
                      <div className="detail-item">
                        <span className="detail-icon">⏰</span>
                        <span>{apt.time}</span>
                      </div>
                    )}
                    <div className="detail-item">
                      <span className="detail-icon">💰</span>
                      <span>₹{apt.fee}</span>
                    </div>
                  </div>

                  <div className="apt-actions">
                    {apt.status === 'confirmed' && (
                      <>
                        <button className="apt-btn reschedule">
                          <span>🔄</span>
                          <span>Reschedule</span>
                        </button>
                        <button className="apt-btn cancel">
                          <span>✕</span>
                          <span>Cancel</span>
                        </button>
                      </>
                    )}
                    {apt.status === 'completed' && (
                      <button className="apt-btn rebook">
                        <span>📅</span>
                        <span>Book Again</span>
                      </button>
                    )}
                    <button className="apt-btn details">
                      <span>→</span>
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>

        <motion.div 
          className="quick-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link to="/" className="quick-action-btn">
            <span className="qa-icon">🔍</span>
            <span className="qa-text">Find Doctors</span>
          </Link>
          <Link to="/" className="quick-action-btn">
            <span className="qa-icon">🏥</span>
            <span className="qa-text">Browse Clinics</span>
          </Link>
          <Link to="/" className="quick-action-btn">
            <span className="qa-icon">💊</span>
            <span className="qa-text">Specialties</span>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
