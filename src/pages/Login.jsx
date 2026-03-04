import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { demoAdminCredentials, demoUserCredentials } from '../data/usersData'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [loginType, setLoginType] = useState('user') // 'user' | 'admin'
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    setTimeout(() => {
      const result = login(username, password, loginType)
      setLoading(false)
      
      if (result.success) {
        if (loginType === 'admin') {
          navigate('/admin')
        } else {
          navigate('/home')
        }
      } else {
        setError(result.message)
      }
    }, 800)
  }

  const fillDemoCredentials = () => {
    if (loginType === 'admin') {
      setUsername(demoAdminCredentials.username)
      setPassword(demoAdminCredentials.password)
    } else {
      setUsername(demoUserCredentials.username)
      setPassword(demoUserCredentials.password)
    }
    setError('')
  }

  const getDemoCredentials = () => {
    return loginType === 'admin' ? demoAdminCredentials : demoUserCredentials
  }

  const demoCredentials = getDemoCredentials()

  return (
    <div className="login-page">
      <motion.div
        className="login-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="login-card">
          <div className="login-header">
            <motion.div
              className="login-logo"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              {loginType === 'admin' ? '🛡️' : '🛒'}
            </motion.div>
            <h1>{loginType === 'admin' ? 'Admin Portal' : 'Shop Login'}</h1>
            <p>{loginType === 'admin' ? 'Manage your store' : 'Welcome to our grocery store'}</p>
          </div>

          {/* Login Type Toggle */}
          <div className="login-type-toggle">
            <button
              type="button"
              className={`toggle-btn ${loginType === 'user' ? 'active' : ''}`}
              onClick={() => {
                setLoginType('user')
                setUsername('')
                setPassword('')
                setError('')
              }}
            >
              <span>🛒</span> User Login
            </button>
            <button
              type="button"
              className={`toggle-btn ${loginType === 'admin' ? 'active' : ''}`}
              onClick={() => {
                setLoginType('admin')
                setUsername('')
                setPassword('')
                setError('')
              }}
            >
              <span>🛡️</span> Admin Login
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={loginType}
              className="login-form"
              onSubmit={handleLogin}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="input-group">
                <label>Username</label>
                <input
                  type="text"
                  placeholder={loginType === 'admin' ? 'Admin username' : 'Email or username'}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="input-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && (
                <motion.p
                  className="error-message"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  ❌ {error}
                </motion.p>
              )}

              <motion.button
                type="submit"
                className="login-btn"
                disabled={loading || !username || !password}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <span className="loading-spinner"></span>
                ) : (
                  <>
                    <span>Login</span>
                    <span>→</span>
                  </>
                )}
              </motion.button>
            </motion.form>
          </AnimatePresence>

          {/* Demo Credentials */}
          <div className="demo-section">
            <div className="demo-card">
              <h4>📌 Demo Credentials</h4>
              <p className="demo-label">Username:</p>
              <p className="demo-value">{demoCredentials.username}</p>
              <p className="demo-label">Password:</p>
              <p className="demo-value">{demoCredentials.password}</p>
              <button
                type="button"
                className="fill-demo-btn"
                onClick={fillDemoCredentials}
              >
                ✓ Use Demo Account
              </button>
            </div>
          </div>

          <div className="login-divider">or</div>

          <Link to="/" className="back-home-btn">
            <span>←</span> Back to Home
          </Link>
        </div>

        <div className="login-features">
          {loginType === 'user' ? (
            <>
              <div className="feature">
                <span className="feature-icon">🛍️</span>
                <div>
                  <h3>Browse & Shop</h3>
                  <p>Thousands of products at great prices</p>
                </div>
              </div>
              <div className="feature">
                <span className="feature-icon">🚚</span>
                <div>
                  <h3>Fast Delivery</h3>
                  <p>Get your orders delivered quickly</p>
                </div>
              </div>
              <div className="feature">
                <span className="feature-icon">💳</span>
                <div>
                  <h3>Secure Payments</h3>
                  <p>Safe and easy checkout process</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="feature">
                <span className="feature-icon">📊</span>
                <div>
                  <h3>Manage Products</h3>
                  <p>Add, edit, and manage inventory</p>
                </div>
              </div>
              <div className="feature">
                <span className="feature-icon">👥</span>
                <div>
                  <h3>User Management</h3>
                  <p>Bulk add and manage customers</p>
                </div>
              </div>
              <div className="feature">
                <span className="feature-icon">📥</span>
                <div>
                  <h3>Bulk Import</h3>
                  <p>Import products from JSON files</p>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}
