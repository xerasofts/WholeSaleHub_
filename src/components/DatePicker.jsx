import { motion } from 'framer-motion'
import { getNextDays, formatDate } from '../data/dummyData'

export default function DatePicker({ selectedDate, onSelectDate }) {
  const dates = getNextDays(7)
  const today = new Date().toISOString().split('T')[0]

  return (
    <div>
      <h4 className="date-picker-title">
        <span>📅</span> Select Date
      </h4>
      <div className="date-picker-grid">
        {dates.map((d, index) => {
          const isToday = d.date === today
          const isSelected = d.date === selectedDate
          return (
            <motion.button
              key={d.date}
              className={`date-item ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectDate(d.date)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isToday && <span className="today-badge">TODAY</span>}
              <span className="date-day">{d.day}</span>
              <span className="date-num">{d.dayNum}</span>
              <span className="date-month">{d.month}</span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
