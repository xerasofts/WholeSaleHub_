import { motion } from 'framer-motion'
import ShoppingCart from '../components/ShoppingCart'

export default function Cart({ cartItems, onUpdateQuantity, onRemove, getTotalPrice, getTotalDiscount }) {
  return (
    <div className="page">
      <section className="section">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 style={{ fontSize: '2.5rem' }}>Shopping Cart</h1>
        </motion.div>

        <ShoppingCart
          cartItems={cartItems}
          onUpdateQuantity={onUpdateQuantity}
          onRemove={onRemove}
          getTotalPrice={getTotalPrice}
          getTotalDiscount={getTotalDiscount}
        />
      </section>
    </div>
  )
}
