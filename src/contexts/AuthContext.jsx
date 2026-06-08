/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from 'react'

export const AuthContext = createContext(null)

function parseStored(raw) {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    return parsed?.user || parsed || null
  } catch {
    return null
  }
}

function getInitialUser() {
  if (typeof window === 'undefined') {
    return { id: 'PHARM-1', role: 'pharmacy' }
  }

  const raw = localStorage.getItem('user') || localStorage.getItem('auth') || localStorage.getItem('currentUser')
  const storedUser = parseStored(raw)
  if (storedUser) return storedUser

  if (window.APP_USER || window.CURRENT_USER || window.user) {
    return window.APP_USER || window.CURRENT_USER || window.user
  }

  return { id: 'PHARM-1', role: 'pharmacy' }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getInitialUser)

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>
}

export default AuthContext
