import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function Header({ theme, setTheme, cartCount = 0 }) {
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, user, logout } = useAuth()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header 
      className={`header ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="header-content">
        {isHome ? (
          <Link to="/" className="logo">
            <motion.span 
              className="logo-icon"
              whileHover={{ rotate: 10 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              🛒
            </motion.span>
            <span>Wholesale hub</span>
          </Link>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <motion.button
              className="back-btn"
              onClick={() => navigate(-1)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </motion.button>
            <Link to="/" className="logo">
              <span className="logo-icon">🛒</span>
              <span>Wholesale hub</span>
            </Link>
          </div>
        )}

        <nav className="header-nav" style={{ alignItems: 'center', gap: 12 }}>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/products" className="nav-link">Products</Link>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link to="/cart" className="cart-btn">
              🛒 Cart
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          </motion.div>
          
          {isAuthenticated && (
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', padding: '0 8px' }}>
              {user?.role === 'admin' ? '🛡️ Admin' : '👤 User'}: {user?.username}
            </div>
          )}
          
          <button
            aria-label="Toggle theme"
            style={{
              marginLeft: 8,
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              transition: 'all 0.2s'
            }}
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
          
          {isAuthenticated ? (
            <motion.button
              onClick={() => {
                logout()
                navigate('/')
              }}
              className="logout-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🚪 Logout
            </motion.button>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to="/login"
                className="login-header-btn"
              >
                🔑 Login
              </Link>
            </motion.div>
          )}
        </nav>
      </div>
    </motion.header>
  )
}

