import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'

export default function CatalogListing({ products, onAddToCart }) {
  const [quantity, setQuantity] = useState({})
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  // Group products by category
  const groupedProducts = useMemo(() => {
    const grouped = {}
    products.forEach(product => {
      if (!grouped[product.category]) {
        grouped[product.category] = []
      }
      grouped[product.category].push(product)
    })
    return grouped
  }, [products])

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    const qty = quantity[product.id] || 1
    onAddToCart(product, qty)
    setQuantity(prev => ({ ...prev, [product.id]: 1 }))
  }

  const getCategoryEmoji = (category) => {
    const emojiMap = {
      'Rice Items': '🍚',
      'Dals & Pulses': '🫘',
      'Spices': '🌶️',
      'Frozen Vegetables': '🥕',
      'Frozen Foods': '❄️',
      'Dry Items': '🌾',
      'Personal Care': '🧴'
    }
    return emojiMap[category] || '📦'
  }

  const handleImageError = (e) => {
    const emoji = getCategoryEmoji(e.target.dataset.category)
    e.target.parentElement.innerHTML = `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 2rem; background: var(--bg-input);">${emoji}</div>`
  }

  return (
    <div className="catalog-listing">
      {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
        <div key={category} className="catalog-category">
          <h3 className="catalog-category-title">
            <span className="category-emoji">{getCategoryEmoji(category)}</span>
            {category}
          </h3>
          
          <div className="catalog-products">
            {categoryProducts.map((product) => (
              <motion.div 
                key={product.id} 
                className="catalog-product-row"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => navigate(`/product/${product.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="catalog-product-image">
                  <img 
                    src={product.image}
                    alt={product.name}
                    data-category={product.category}
                    onError={handleImageError}
                  />
                </div>
                
                <div className="catalog-product-info">
                  <h4 className="catalog-product-name">{product.name}</h4>
                  <p className="catalog-product-meta">{product.unit}</p>
                  <div className="catalog-product-rating">
                    ⭐ {product.rating} ({product.reviewCount})
                  </div>
                </div>
                
                <div className="catalog-product-price">
                  <div className="price-display">
                    <span className="price-current">£{product.price}</span>
                    {product.originalPrice && (
                      <span className="price-original">£{product.originalPrice}</span>
                    )}
                  </div>
                  
                  <button
                    className="catalog-add-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAddToCart(product)
                    }}
                    title="Add to cart"
                  >
                    +
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
