// Service de stockage localStorage pour frontend-only

import {
  mockUsers,
  mockProducts,
  mockCategories,
  mockOrders,
  mockCustomers,
  mockCoupons,
  type MockUser,
  type MockProduct,
  type MockCategory,
  type MockOrder,
  type MockCustomer,
  type MockCoupon,
} from './mock-data'

// Clés localStorage
const STORAGE_KEYS = {
  PRODUCTS: 'ecommerce_products',
  CATEGORIES: 'ecommerce_categories',
  ORDERS: 'ecommerce_orders',
  CUSTOMERS: 'ecommerce_customers',
  COUPONS: 'ecommerce_coupons',
  USERS: 'ecommerce_users',
  CURRENT_USER: 'ecommerce_current_user',
  INITIALIZED: 'ecommerce_initialized',
} as const

// Initialiser localStorage avec données mockées si vide
export function initializeStorage() {
  if (typeof window === 'undefined') return

  const initialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED)
  if (initialized === 'true') return

  // Initialiser avec données mockées
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(mockProducts))
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(mockCategories))
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(mockOrders))
  localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(mockCustomers))
  localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(mockCoupons))
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(mockUsers))
  localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true')
}

// Produits
export function getProducts(): MockProduct[] {
  if (typeof window === 'undefined') return []
  initializeStorage()
  const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS)
  return data ? JSON.parse(data) : []
}

export function saveProducts(products: MockProduct[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products))
}

// Catégories
export function getCategories(): MockCategory[] {
  if (typeof window === 'undefined') return []
  initializeStorage()
  const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES)
  return data ? JSON.parse(data) : []
}

export function saveCategories(categories: MockCategory[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories))
}

// Commandes
export function getOrders(): MockOrder[] {
  if (typeof window === 'undefined') return []
  initializeStorage()
  const data = localStorage.getItem(STORAGE_KEYS.ORDERS)
  return data ? JSON.parse(data) : []
}

export function saveOrders(orders: MockOrder[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders))
}

// Clients
export function getCustomers(): MockCustomer[] {
  if (typeof window === 'undefined') return []
  initializeStorage()
  const data = localStorage.getItem(STORAGE_KEYS.CUSTOMERS)
  return data ? JSON.parse(data) : []
}

export function saveCustomers(customers: MockCustomer[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers))
}

// Coupons
export function getCoupons(): MockCoupon[] {
  if (typeof window === 'undefined') return []
  initializeStorage()
  const data = localStorage.getItem(STORAGE_KEYS.COUPONS)
  return data ? JSON.parse(data) : []
}

export function saveCoupons(coupons: MockCoupon[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons))
}

// Utilisateurs
export function getUsers(): MockUser[] {
  if (typeof window === 'undefined') return []
  initializeStorage()
  const data = localStorage.getItem(STORAGE_KEYS.USERS)
  return data ? JSON.parse(data) : []
}

export function saveUsers(users: MockUser[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
}

// Utilisateur actuel
export function getCurrentUser(): MockUser | null {
  if (typeof window === 'undefined') return null
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
  return data ? JSON.parse(data) : null
}

export function setCurrentUser(user: MockUser | null) {
  if (typeof window === 'undefined') return
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
  }
}

// Générer un ID unique
export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

