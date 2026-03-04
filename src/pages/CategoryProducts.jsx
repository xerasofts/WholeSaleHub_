import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import ProductListing from '../components/ProductListing'
import { categories, getProductsByCategory } from '../data/dummyData'

export default function CategoryProducts({ onAddToCart }) {
  const { id } = useParams()
  const [category, setCategory] = useState(null)
  const [products, setProducts] = useState([])

  useEffect(() => {
    const categoryId = parseInt(id)
    const foundCategory = categories.find(c => c.id === categoryId)
    setCategory(foundCategory)
    
    if (foundCategory) {
      const categoryProducts = getProductsByCategory(categoryId)
      setProducts(categoryProducts)
    }
  }, [id])

  if (!category) {
    return <div className="page">Category not found</div>
  }

  return (
    <div className="page">
      <section className="section">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span style={{ fontSize: '3rem', marginBottom: 16, display: 'block' }}>{category.icon}</span>
          <h1 style={{ fontSize: '2.5rem', marginBottom: 8 }}>{category.name}</h1>
          <p>{category.description}</p>
        </motion.div>

        <ProductListing
          products={products}
          onAddToCart={onAddToCart}
          title=""
          showFilters={true}
        />
      </section>
    </div>
  )
}
