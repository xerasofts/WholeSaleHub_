import { motion } from 'framer-motion'

export default function TimeSlotGrid({ slots, selectedSlot, onSelectSlot }) {
  if (!slots || slots.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
        <span style={{ fontSize: '2.5rem', marginBottom: '12px', display: 'block' }}>📅</span>
        <p>No slots available for this date</p>
      </div>
    )
  }

  return (
    <div>
      <h4 className="time-slots-title">
        <span>⏰</span> Available Time Slots
      </h4>
      <div className="time-slots-grid">
        {slots.map((slot, index) => (
          <motion.button
            key={slot.time}
            className={`time-slot ${selectedSlot === slot.time ? 'selected' : ''}`}
            onClick={() => !slot.booked && onSelectSlot(slot.time)}
            disabled={slot.booked}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.02 }}
            whileHover={{ scale: slot.booked ? 1 : 1.02 }}
            whileTap={{ scale: slot.booked ? 1 : 0.98 }}
          >
            {slot.time}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
