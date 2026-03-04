import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import CategoryCard from '../components/CategoryCard'
import ProductListing from '../components/ProductListing'
import { categories, brands, getFeaturedProducts } from '../data/dummyData'

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

export default function Home({ onAddToCart }) {
  const featuredProducts = getFeaturedProducts(6)

  return (
    <div className="page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg" />
        <div className="hero-grid" />
        
        <motion.div 
          className="hero-content"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div className="hero-badge" variants={fadeIn}>
            <span className="hero-badge-dot" />
            <span>Wholesale dry and frozen foods supplier</span>
          </motion.div>
          
          <motion.h1 className="hero-title" variants={fadeIn}>
            <span className="hero-title-line">South Indian Dry and Frozen Foods</span>
            <span className="hero-title-line">In Wholesale Quantity</span>
            <span className="hero-title-line hero-title-gradient">Delivered all over UK</span>
          </motion.h1>
          
          <motion.p className="hero-subtitle" variants={fadeIn}>
            Browse all dry and frozen items from reputed brands like VIS***, AS***, MAL***, MAR***, and more — 
            all in one place with the best wholesale prices.
          </motion.p>

          <motion.div className="search-quick-links" variants={fadeIn}>
            <Link to="/products" className="quick-link">
              <span>🛒</span> All Products
            </Link>
            <Link to="/category/1" className="quick-link">
              <span>�</span> VIS***
            </Link>
            <Link to="/category/2" className="quick-link">
              <span>🏢</span> AS***
            </Link>
            <Link to="/category/3" className="quick-link">
              <span>🏢</span> MAL***
            </Link>
            <Link to="/category/4" className="quick-link">
              <span>🏢</span> MAR***
            </Link>
          </motion.div>

          <motion.div className="hero-stats" variants={fadeIn}>
            <div className="stat-item">
              <div className="stat-number">1000<span>+</span></div>
              <div className="stat-label">Products</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">6<span></span></div>
              <div className="stat-label">Brands</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">4.8<span>★</span></div>
              <div className="stat-label">Avg Rating</div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Categories Section */}
      <section className="section">
        <div className="section-header">
          <motion.span 
            className="section-label"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            🛍️ Shop by Category
          </motion.span>
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Explore Our Premium Categories
          </motion.h2>
          <motion.p 
            className="section-subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Find exactly what you're looking for
          </motion.p>
        </div>

        <motion.div 
          className="categories-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {categories.map((category) => (
            <motion.div key={category.id} variants={fadeIn}>
              <CategoryCard category={category} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Brands Section */}
      <section className="section section-dark">
        <div className="section-header">
          <motion.span 
            className="section-label"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            🏢 Shop by Brands
          </motion.span>
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Trusted Wholesale Suppliers
          </motion.h2>
          <motion.p 
            className="section-subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Browse products from our trusted brand partners
          </motion.p>
        </div>

        <motion.div 
          className="categories-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {brands.map((brand) => (
            <motion.div key={brand.id} variants={fadeIn}>
              <CategoryCard category={brand} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Featured Products Section */}
      <section className="section section-dark">
        <div className="section-header">
          <motion.span 
            className="section-label"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            ⭐ Best Sellers
          </motion.span>
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Featured Products
          </motion.h2>
          <motion.p 
            className="section-subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Highest rated and most popular items
          </motion.p>
        </div>

        <ProductListing
          products={featuredProducts}
          onAddToCart={onAddToCart}
          title=""
          showFilters={false}
          hideAddToCart={true}
        />

        <motion.div
          style={{ textAlign: 'center', marginTop: 32 }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Link to="/products" className="view-all-btn">
            View All Products →
          </Link>
        </motion.div>
      </section>

      {/* Promo Section */}
      <section className="section">
        <motion.div
          className="promo-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="promo-content">
            <h3>🚚 Free Delivery on Orders Above £499</h3>
            <p>Get fast and free delivery on all orders over £499. Shop now!</p>
            <Link to="/products" className="promo-btn">
              Start Shopping
            </Link>
          </div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="section">
        <div className="section-header">
          <motion.span 
            className="section-label"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            📋 Simple Process
          </motion.span>
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            How It Works
          </motion.h2>
          <motion.p 
            className="section-subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Shop easily in 3 simple steps
          </motion.p>
        </div>

        <motion.div 
          className="steps-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div className="step-card" variants={fadeIn}>
            <span className="step-number">1</span>
            <div className="step-icon">🔍</div>
            <h3 className="step-title">Browse</h3>
            <p className="step-description">
              Browse through our wide collection of products across multiple categories. Find what you need.
            </p>
          </motion.div>

          <motion.div className="step-card" variants={fadeIn}>
            <span className="step-number">2</span>
            <div className="step-icon">🛒</div>
            <h3 className="step-title">Add to Cart</h3>
            <p className="step-description">
              Add your favorite items to the cart. Adjust quantities and review your selection anytime.
            </p>
          </motion.div>

          <motion.div className="step-card" variants={fadeIn}>
            <span className="step-number">3</span>
            <div className="step-icon">✅</div>
            <h3 className="step-title">Checkout</h3>
            <p className="step-description">
              Proceed to checkout, enter your delivery details, and confirm your order. Fast and secure!
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-bg" />
        <motion.div 
          className="cta-content"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="cta-title">Ready to Start Shopping?</h2>
          <p className="cta-text">
            Explore thousands of products from your favorite brands. Fast delivery guaranteed!
          </p>
          <motion.button 
            className="cta-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>🛍️</span>
            <span>Shop Now</span>
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">
                <span className="logo-icon">🛒</span>
                <span>IAF HUB</span>
              </div>
              <p className="footer-tagline">
                Your trusted wholesale supplier for South Indian dry and frozen foods. 
                Premium quality products delivered all over UK.
              </p>
            </div>

            <div className="footer-col">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/products">All Products</Link></li>
                <li><Link to="/cart">My Cart</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Categories</h4>
              <ul>
                <li><Link to="/category/1">Rice Items</Link></li>
                <li><Link to="/category/2">Dals & Pulses</Link></li>
                <li><Link to="/category/3">Spices</Link></li>
                <li><Link to="/category/4">Frozen Vegetables</Link></li>
                <li><Link to="/category/5">Frozen Foods</Link></li>
                <li><Link to="/category/6">Dry Items</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Support</h4>
              <ul>
                <li><a href="#">Help Center</a></li>
                <li><a href="#">Contact Us</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="footer-copyright">
              © 2026 XeraSofts. All rights reserved.
            </p>
            <div className="footer-social">
              {/* <a href="#" className="social-link">𝕏</a>
              <a href="#" className="social-link">in</a>
              <a href="#" className="social-link">📘</a> */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
