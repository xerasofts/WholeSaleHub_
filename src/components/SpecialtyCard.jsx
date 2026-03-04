import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function SpecialtyCard({ specialty }) {
  const navigate = useNavigate()

  return (
    <motion.div
      className="specialty-card"
      onClick={() => navigate(`/search?specialty=${specialty.name}`)}
      whileHover={{ y: -4, borderColor: 'var(--primary)' }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <span className="specialty-icon">{specialty.icon}</span>
      <span className="specialty-name">{specialty.name}</span>
      <span className="specialty-count">{specialty.doctorCount} doctors</span>
    </motion.div>
  )
}
