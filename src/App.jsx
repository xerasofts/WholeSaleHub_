import Header from './components/Header'
import { useState, useEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import useCart from './hooks/useCart'
import Home from './pages/Home'
import Cart from './pages/Cart'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import CategoryProducts from './pages/CategoryProducts'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'

const lightTheme = {
  '--bg-dark': '#f7f7fa',
  '--bg-card': '#ffffff',
  '--bg-card-hover': '#f0f4f8',
  '--bg-elevated': '#e9eef3',
  '--bg-input': '#f3f6fa',
  '--primary': '#2563eb',
  '--primary-glow': 'rgba(37, 99, 235, 0.15)',
  '--primary-light': '#60a5fa',
  '--primary-dark': '#1d4ed8',
  '--accent-cyan': '#06b6d4',
  '--accent-green': '#22c55e',
  '--accent-amber': '#fbbf24',
  '--accent-rose': '#e11d48',
  '--text-primary': '#22223b',
  '--text-secondary': '#4b5563',
  '--text-muted': '#6b7280',
  '--border-color': '#d1d5db',
  '--border-light': '#e5e7eb',
  '--glow-primary': '0 0 60px rgba(37, 99, 235, 0.12)',
  '--header-scrolled-bg': 'rgba(255,255,255,0.92)',
}
const darkTheme = {
  '--bg-dark': '#0a0a0f',
  '--bg-card': '#111118',
  '--bg-card-hover': '#18181f',
  '--bg-elevated': '#141419',
  '--bg-input': '#1a1a22',
  '--primary': '#6366f1',
  '--primary-glow': 'rgba(99, 102, 241, 0.4)',
  '--primary-light': '#818cf8',
  '--primary-dark': '#4f46e5',
  '--accent-cyan': '#22d3ee',
  '--accent-green': '#10b981',
  '--accent-amber': '#f59e0b',
  '--accent-rose': '#f43f5e',
  '--text-primary': '#ffffff',
  '--text-secondary': '#a1a1aa',
  '--text-muted': '#71717a',
  '--border-color': 'rgba(255, 255, 255, 0.06)',
  '--border-light': 'rgba(255, 255, 255, 0.1)',
  '--glow-primary': '0 0 60px rgba(99, 102, 241, 0.25)',
  '--header-scrolled-bg': 'rgba(10, 10, 15, 0.85)',
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

function AppContent() {
  const [theme, setTheme] = useState('light')
  const { isAuthenticated, isAdmin } = useAuth()
  const location = useLocation()
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, getTotalPrice, getTotalItems, getTotalDiscount } = useCart()

  useEffect(() => {
    const themeVars = theme === 'light' ? lightTheme : darkTheme
    for (const key in themeVars) {
      document.documentElement.style.setProperty(key, themeVars[key])
    }
  }, [theme])

  // Show header only for non-admin pages
  const showHeader = !location.pathname.startsWith('/admin') && location.pathname !== '/login'

  return (
    <>
      {showHeader && <Header theme={theme} setTheme={setTheme} cartCount={getTotalItems()} />}
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={isAuthenticated && isAdmin() ? <AdminDashboard /> : <Navigate to="/login" />} 
        />
        
        {/* User Routes */}
        <Route path="/" element={<Home onAddToCart={addToCart} />} />
        <Route path="/home" element={<Home onAddToCart={addToCart} />} />
        <Route path="/products" element={<Products onAddToCart={addToCart} />} />
        <Route path="/product/:id" element={<ProductDetail onAddToCart={addToCart} />} />
        <Route path="/category/:id" element={<CategoryProducts onAddToCart={addToCart} />} />
        <Route path="/cart" element={<Cart cartItems={cart} onUpdateQuantity={updateQuantity} onRemove={removeFromCart} getTotalPrice={getTotalPrice} getTotalDiscount={getTotalDiscount} />} />
      </Routes>
    </>
  )
}
