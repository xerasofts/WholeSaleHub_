import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProductCard({ product, onAddToCart }) {
  const [quantity, setQuantity] = useState(1)
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    onAddToCart(product, quantity)
    setQuantity(1)
  }

  const handleImageLoad = () => {
    setImageLoading(false)
    setImageError(false)
  }

  const handleImageError = () => {
    setImageLoading(false)
    setImageError(true)
  }

  const getCategoryEmoji = () => {
    const emojiMap = {
      'Rice Items': '🍚',
      'Dals & Pulses': '🫘',
      'Spices': '🌶️',
      'Frozen Vegetables': '🥕',
      'Frozen Foods': '❄️',
      'Dry Items': '🌾',
      'Personal Care': '🧴'
    }
    return emojiMap[product.category] || '📦'
  }

  return (
    <motion.div
      className="product-card"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.2 }}
    >
      <div className="product-image-container">
        {imageLoading && (
          <div className="product-image-placeholder">⏳ Loading...</div>
        )}
        {imageError ? (
          <div className="product-image-placeholder">{getCategoryEmoji()}</div>
        ) : (
          <img 
            src={product.image} 
            alt={product.name} 
            className="product-image"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}
        {discount > 0 && (
          <div className="discount-badge">-{discount}%</div>
        )}
        {product.badge && (
          <div className="product-badge">{product.badge}</div>
        )}
      </div>

      <div className="product-content">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>

        <div className="product-rating">
          <span className="stars">⭐ {product.rating}</span>
          <span className="reviews">({product.reviewCount})</span>
        </div>

        <div className="product-price-section">
          <div className="price-info">
            <span className="current-price">£{product.price}</span>
            {product.originalPrice && (
              <span className="original-price">£{product.originalPrice}</span>
            )}
          </div>
          <span className="product-unit">{product.unit}</span>
        </div>

        <div className="product-quantity">
          <button
            className="qty-btn"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            −
          </button>
          <span className="qty-display">{quantity}</span>
          <button
            className="qty-btn"
            onClick={() => setQuantity(quantity + 1)}
          >
            +
          </button>
        </div>

        <motion.button
          className="add-to-cart-btn"
          onClick={handleAddToCart}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          🛒 Add to Cart
        </motion.button>
      </div>
    </motion.div>
  )
}
