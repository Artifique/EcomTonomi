"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getCurrentUser, setCurrentUser, getUsers, saveUsers, generateId, initializeStorage } from "@/lib/storage"

interface User {
  id: string
  email: string
  name: string | null
  role: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialiser le storage
    initializeStorage()
    // Vérifier si un utilisateur est connecté
    checkAuth()
  }, [])

  const checkAuth = () => {
    try {
      const currentUser = getCurrentUser()
      if (currentUser) {
        setUser({
          id: currentUser.id,
          email: currentUser.email,
          name: currentUser.name,
          role: currentUser.role,
        })
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 300))

      const users = getUsers()
      const foundUser = users.find(u => u.email === email && u.password === password)

      if (foundUser) {
        const userData = {
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name,
          role: foundUser.role,
        }
        setCurrentUser(foundUser)
        setUser(userData)
        return { success: true }
      } else {
        return { success: false, error: 'Email ou mot de passe incorrect' }
      }
    } catch (error) {
      return { success: false, error: 'Erreur de connexion' }
    }
  }

  const register = async (email: string, password: string, name?: string) => {
    try {
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 300))

      const users = getUsers()
      const existingUser = users.find(u => u.email === email)

      if (existingUser) {
        return { success: false, error: 'Cet email est déjà utilisé' }
      }

      const newUser = {
        id: generateId('user'),
        email,
        password, // En production, hasher le mot de passe
        name: name || null,
        role: 'customer' as const,
      }

      users.push(newUser)
      saveUsers(users)

      const userData = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      }

      setCurrentUser(newUser)
      setUser(userData)
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Erreur lors de l\'inscription' }
    }
  }

  const logout = () => {
    setCurrentUser(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

