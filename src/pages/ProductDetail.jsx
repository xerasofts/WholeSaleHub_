import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { products } from '../data/dummyData'
import { useAuth } from '../context/AuthContext'

export default function ProductDetail({ onAddToCart }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    const foundProduct = products.find(p => p.id === parseInt(id))
    if (foundProduct) {
      setProduct(foundProduct)
    } else {
      navigate('/products')
    }
  }, [id, navigate])

  if (!product) {
    return (
      <div className="page">
        <div style={{ textAlign: 'center', paddingTop: 100 }}>
          <p>Loading product...</p>
        </div>
      </div>
    )
  }

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    onAddToCart(product, quantity)
    setQuantity(1)
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

  const handleImageError = (e) => {
    setImageError(true)
    e.target.style.display = 'none'
  }

  return (
    <div className="page">
      <section className="section">
        <motion.button
          className="back-btn"
          onClick={() => navigate(-1)}
          style={{ marginBottom: 30 }}
        >
          ← Back
        </motion.button>

        <motion.div
          className="product-detail-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Left: Product Image */}
          <div className="product-detail-image-section">
            <div className="product-detail-image">
              {!imageError ? (
                <img
                  src={product.image}
                  alt={product.name}
                  onError={handleImageError}
                />
              ) : (
                <div className="product-image-fallback">
                  <span style={{ fontSize: '5rem' }}>{getCategoryEmoji()}</span>
                </div>
              )}
            </div>
            {discount > 0 && (
              <div className="detail-discount-badge">-{discount}% OFF</div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="product-detail-info">
            {/* Breadcrumb */}
            <div className="breadcrumb">
              {getCategoryEmoji()} {product.category}
            </div>

            {/* Title */}
            <h1 className="product-detail-title">{product.name}</h1>

            {/* Rating */}
            <div className="rating-section">
              <span className="rating-stars">⭐ {product.rating}</span>
              <span className="rating-count">({product.reviewCount} reviews)</span>
            </div>

            {/* Price Section */}
            <div className="price-section">
              <div className="price-display">
                <span className="price-current">£{product.price}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="price-original">£{product.originalPrice}</span>
                )}
              </div>
              <span className="unit-info">{product.unit}</span>
            </div>

            {/* Description */}
            <div className="description-section">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            {/* Features */}
            <div className="features-section">
              <h3>Product Details</h3>
              <ul className="features-list">
                <li>✓ Stock Available: {product.stock} units</li>
                <li>✓ Premium Quality Assured</li>
                <li>✓ Fast Shipping</li>
                <li>✓ Easy Returns</li>
              </ul>
            </div>

            {/* Stock Status */}
            <div className={`stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {product.stock > 0 ? `✓ In Stock (${product.stock} available)` : '✗ Out of Stock'}
            </div>

            {/* Add to Cart Section */}
            {product.stock > 0 && (
              <motion.div
                className="add-to-cart-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="quantity-selector">
                  <button
                    className="qty-control-btn"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="qty-input"
                  />
                  <button
                    className="qty-control-btn"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>

                <motion.button
                  className="add-to-cart-btn-large"
                  onClick={handleAddToCart}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  🛒 Add to Cart
                </motion.button>
              </motion.div>
            )}

            {/* Tags */}
            <div className="tags-section">
              <h4>Tags:</h4>
              <div className="tags">
                {product.tags && product.tags.map((tag, idx) => (
                  <span key={idx} className="tag">#{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Additional Info Section */}
        <motion.div
          className="product-detail-extra"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="info-card">
            <div className="info-icon">🚚</div>
            <h4>Fast Delivery</h4>
            <p>Quick shipping available on most items</p>
          </div>

          <div className="info-card">
            <div className="info-icon">💰</div>
            <h4>Best Price</h4>
            <p>Wholesale prices guaranteed</p>
          </div>

          <div className="info-card">
            <div className="info-icon">⭐</div>
            <h4>Quality Assured</h4>
            <p>Premium products from trusted suppliers</p>
          </div>

          <div className="info-card">
            <div className="info-icon">✓</div>
            <h4>Easy Returns</h4>
            <p>Hassle-free return policy</p>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
