import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function CategoryCard({ category }) {
  return (
    <Link to={`/category/${category.id}`} style={{ textDecoration: 'none' }}>
      <motion.div
        className="category-card"
        whileHover={{ scale: 1.05, y: -4 }}
        transition={{ duration: 0.2 }}
      >
        <div className="category-icon">{category.icon}</div>
        <h3 className="category-name">{category.name}</h3>
        <p className="category-description">{category.description}</p>
        <motion.div
          className="category-arrow"
          whileHover={{ x: 4 }}
        >
          →
        </motion.div>
      </motion.div>
    </Link>
  )
}
