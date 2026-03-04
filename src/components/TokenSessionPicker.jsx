import { motion } from 'framer-motion'

function formatTime12h(time) {
  if (!time) return '';
  const [h, m] = time.split(':');
  const date = new Date();
  date.setHours(Number(h));
  date.setMinutes(Number(m));
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).replace(':00 ', ' ');
}

export default function TokenSessionPicker({ sessions, selectedSession, onSelectSession }) {
  if (!sessions || sessions.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
        <span style={{ fontSize: '2.5rem', marginBottom: '12px', display: 'block' }}>🎫</span>
        <p>No sessions available for this date</p>
      </div>
    )
  }

  return (
    <div className="token-container">
      <h4 className="token-title">
        <span>🎫</span> Select Session
      </h4>
      <div className="sessions-list">
        {sessions.map((session, index) => {
          const isSelected = selectedSession?.name === session.name
          const isFull = session.currentToken >= session.totalTokens
          const progress = (session.currentToken / session.totalTokens) * 100
          
          return (
            <motion.button
              key={session.name}
              className={`session-card ${isSelected ? 'selected' : ''}`}
              onClick={() => !isFull && onSelectSession(session)}
              disabled={isFull}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: isFull ? 1 : 1.01 }}
              whileTap={{ scale: isFull ? 1 : 0.99 }}
            >
              <div className="session-info">
                <span className="session-icon">
                  {session.name === 'Morning' ? '🌅' : session.name === 'Afternoon' ? '☀️' : '🌙'}
                </span>
                <div className="session-details">
                  <h4>{session.name} Session</h4>
                  <p>
                    {session.start && session.end
                      ? `${formatTime12h(session.start)} - ${formatTime12h(session.end)}`
                      : session.startTime && session.endTime
                        ? `${formatTime12h(session.startTime)} - ${formatTime12h(session.endTime)}`
                        : ''}
                  </p>
                </div>
              </div>
              
              <div className="session-token">
                <span className="token-label">Your Token</span>
                <span className="token-value">#{session.currentToken + 1}</span>
                <div className="session-progress">
                  <div className="progress-bar">
                    <motion.div 
                      className="progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    />
                  </div>
                  <span className="progress-text">
                    {session.currentToken}/{session.totalTokens} tokens used
                  </span>
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
