import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function ShoppingCart({ cartItems, onUpdateQuantity, onRemove, getTotalPrice, getTotalDiscount }) {
  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <div className="empty-cart-icon">🛒</div>
        <h2>Your Cart is Empty</h2>
        <p>Add some products to get started!</p>
        <Link to="/" className="continue-shopping-btn">
          Continue Shopping
        </Link>
      </div>
    )
  }

  const totalPrice = getTotalPrice()
  const totalDiscount = getTotalDiscount()
  const finalPrice = totalPrice

  return (
    <div className="shopping-cart">
      <div className="cart-items">
        {cartItems.map((item, index) => (
          <motion.div
            key={item.id}
            className="cart-item"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <img src={item.image} alt={item.name} className="cart-item-image" />

            <div className="cart-item-details">
              <h4>{item.name}</h4>
              <p className="cart-item-category">{item.category}</p>
              <p className="cart-item-unit">{item.unit}</p>
            </div>

            <div className="cart-item-quantity">
              <button
                className="qty-btn-sm"
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              >
                −
              </button>
              <span>{item.quantity}</span>
              <button
                className="qty-btn-sm"
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              >
                +
              </button>
            </div>

            <div className="cart-item-price">
              <span className="price">£{item.price * item.quantity}</span>
              {item.originalPrice && (
                <span className="original">£{item.originalPrice * item.quantity}</span>
              )}
            </div>

            <button
              className="remove-btn"
              onClick={() => onRemove(item.id)}
              title="Remove item"
            >
              ✕
            </button>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="cart-summary"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="summary-row">
          <span>Subtotal:</span>
          <span>£{totalPrice.toFixed(2)}</span>
        </div>

        {totalDiscount > 0 && (
          <div className="summary-row savings">
            <span>You Save:</span>
            <span>-£{totalDiscount.toFixed(2)}</span>
          </div>
        )}

        <div className="summary-divider"></div>

        <div className="summary-row total">
          <span>Total:</span>
          <span>£{finalPrice.toFixed(2)}</span>
        </div>

        <motion.button
          className="checkout-btn"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Proceed to Checkout
        </motion.button>

        <Link to="/" className="continue-shopping-link">
          ← Continue Shopping
        </Link>
      </motion.div>
    </div>
  )
}
