import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ProductCard from './ProductCard'

export default function ProductListing({ products, onAddToCart, title, showFilters = true, hideAddToCart = false }) {
  const [filtered, setFiltered] = useState(products)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    let result = [...products]

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p?.description?.toLowerCase().includes(query) ||
        p.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    setFiltered(result)
  }, [products, searchQuery])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  }

  return (
    <div className="product-listing">
      <div className="listing-header">
        <h2>{title || 'Products'}</h2>
        <span className="result-count">{filtered.length} products found</span>
      </div>

      {showFilters && (
        <div className="simple-search-container">
          <input
            type="text"
            placeholder="🔍 Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="simple-search-input"
          />
        </div>
      )}

      {/* Products Grid */}
      <motion.div
        className="products-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filtered.length > 0 ? (
          filtered.map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <ProductCard
                product={product}
                onAddToCart={onAddToCart}
                hideAddToCart={hideAddToCart}
              />
            </motion.div>
          ))
        ) : (
          <div className="no-products">
            <p>😢 No products found</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
