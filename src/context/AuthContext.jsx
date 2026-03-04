import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
        setIsAuthenticated(true)
      } catch (e) {
        console.error('Failed to load user from localStorage:', e)
      }
    }
    setLoading(false)
  }, [])

  const login = (username, password, role) => {
    // Demo credentials
    const validLogins = {
      admin: { username: 'admin', password: 'admin123', role: 'admin' },
      user: { username: 'user@demo.com', password: 'user123', role: 'user' }
    }

    const credentialSet = validLogins[role]
    if (credentialSet && credentialSet.username === username && credentialSet.password === password) {
      const userData = {
        id: Date.now(),
        username,
        role,
        loginTime: new Date().toISOString()
      }
      setUser(userData)
      setIsAuthenticated(true)
      localStorage.setItem('currentUser', JSON.stringify(userData))
      return { success: true }
    }
    return { success: false, message: 'Invalid credentials' }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('currentUser')
  }

  const isAdmin = () => user?.role === 'admin'
  const isUser = () => user?.role === 'user'

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        isAdmin,
        isUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
