// Données mockées pour l'application frontend-only

export interface MockUser {
  id: string
  email: string
  password: string // En production, ne jamais stocker en clair, mais pour frontend-only c'est OK
  name: string | null
  role: 'admin' | 'customer'
}

export interface MockProduct {
  id: string
  name: string
  price: number
  originalPrice?: number
  description: string
  images: string[]
  category: string
  categoryId: string
  sizes: string[]
  colors: { name: string; value: string }[]
  isNew: boolean
  inStock: boolean
  rating: number
  reviews: number
  stock: number
  sku: string
}

export interface MockCategory {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface MockOrder {
  id: string
  customer: {
    name: string
    email: string
    phone?: string | null
    address?: string | null
  }
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    size?: string
    color?: string
    image: string
  }>
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'refunded'
  paymentMethod?: string
  trackingNumber?: string
  createdAt: string
  updatedAt: string
}

export interface MockCustomer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  totalOrders: number
  totalSpent: number
  status: 'active' | 'inactive' | 'banned'
  createdAt: string
  lastOrder?: string
}

export interface MockCoupon {
  id: string
  code: string
  type: 'percentage' | 'fixed'
  value: number
  minPurchase: number
  maxUses: number | null
  usedCount: number
  expiresAt: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Utilisateurs mockés
export const mockUsers: MockUser[] = [
  {
    id: 'user-admin-1',
    email: 'admin@nextgen.com',
    password: 'admin123', // Pas de hash pour frontend-only
    name: 'Admin User',
    role: 'admin',
  },
  {
    id: 'user-customer-1',
    email: 'sophie@email.com',
    password: 'password123',
    name: 'Sophie Martin',
    role: 'customer',
  },
  {
    id: 'user-customer-2',
    email: 'lucas@email.com',
    password: 'password123',
    name: 'Lucas Dubois',
    role: 'customer',
  },
  {
    id: 'user-customer-3',
    email: 'emma@email.com',
    password: 'password123',
    name: 'Emma Bernard',
    role: 'customer',
  },
]

// Catégories mockées
export const mockCategories: MockCategory[] = [
  {
    id: 'cat-1',
    name: 'JACKETS',
    slug: 'jackets',
    description: 'Stylish jackets for all seasons',
    image: null,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat-2',
    name: 'T-SHIRT',
    slug: 't-shirt',
    description: 'Comfortable t-shirts for everyday wear',
    image: null,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat-3',
    name: 'SHOES',
    slug: 'shoes',
    description: 'Footwear for every occasion',
    image: null,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat-4',
    name: 'SHORTS',
    slug: 'shorts',
    description: 'Casual shorts for warm weather',
    image: null,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat-5',
    name: 'BAGS',
    slug: 'bags',
    description: 'Stylish bags and accessories',
    image: null,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// Produits mockés
export const mockProducts: MockProduct[] = [
  {
    id: 'prod-1',
    name: 'Modern Blazer',
    price: 125,
    originalPrice: 165,
    description: 'A sophisticated modern blazer crafted from premium wool blend fabric.',
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=2080&auto=format&fit=crop',
    ],
    category: 'JACKETS',
    categoryId: 'cat-1',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Black', value: '#110A0B' },
      { name: 'Navy', value: '#184D6B' },
    ],
    stock: 45,
    sku: 'SKU-00001',
    isNew: true,
    inStock: true,
    rating: 4.8,
    reviews: 124,
  },
  {
    id: 'prod-2',
    name: 'Premium Jacket',
    price: 189,
    description: 'Elevate your outerwear collection with this premium leather jacket.',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1935&auto=format&fit=crop',
    ],
    category: 'JACKETS',
    categoryId: 'cat-1',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Black', value: '#110A0B' },
      { name: 'Brown', value: '#8B4513' },
    ],
    stock: 32,
    sku: 'SKU-00002',
    isNew: false,
    inStock: true,
    rating: 4.9,
    reviews: 89,
  },
  {
    id: 'prod-3',
    name: 'Classic White Tee',
    price: 45,
    description: 'The perfect everyday essential. Made from 100% organic cotton.',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2080&auto=format&fit=crop',
    ],
    category: 'T-SHIRT',
    categoryId: 'cat-2',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'White', value: '#FFFFFF' },
      { name: 'Black', value: '#110A0B' },
    ],
    stock: 78,
    sku: 'SKU-00003',
    isNew: true,
    inStock: true,
    rating: 4.7,
    reviews: 256,
  },
  {
    id: 'prod-4',
    name: 'Running Sneakers',
    price: 165,
    originalPrice: 195,
    description: 'High-performance running sneakers designed for comfort and speed.',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop',
    ],
    category: 'SHOES',
    categoryId: 'cat-3',
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: [
      { name: 'Red', value: '#DC2626' },
      { name: 'Black', value: '#110A0B' },
    ],
    stock: 56,
    sku: 'SKU-00004',
    isNew: false,
    inStock: true,
    rating: 4.6,
    reviews: 178,
  },
  {
    id: 'prod-5',
    name: 'Summer Shorts',
    price: 55,
    description: 'Lightweight and breathable summer shorts perfect for warm weather.',
    images: [
      'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=2070&auto=format&fit=crop',
    ],
    category: 'SHORTS',
    categoryId: 'cat-4',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Khaki', value: '#C3B091' },
      { name: 'Navy', value: '#184D6B' },
    ],
    stock: 42,
    sku: 'SKU-00005',
    isNew: true,
    inStock: true,
    rating: 4.5,
    reviews: 67,
  },
]

// Commandes mockées
export const mockOrders: MockOrder[] = [
  {
    id: 'ORD-001',
    customer: {
      name: 'Sophie Martin',
      email: 'sophie@email.com',
      phone: '+33 6 12 34 56 78',
      address: '123 Rue de Paris, 75001 Paris, France',
    },
    items: [
      {
        id: 'item-1',
        name: 'Modern Blazer',
        price: 125,
        quantity: 1,
        size: 'M',
        color: 'Black',
        image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=200&auto=format&fit=crop',
      },
    ],
    total: 125,
    status: 'completed',
    paymentStatus: 'paid',
    paymentMethod: 'Credit Card',
    createdAt: '2024-01-15T10:30:00',
    updatedAt: '2024-01-16T14:20:00',
  },
  {
    id: 'ORD-002',
    customer: {
      name: 'Lucas Dubois',
      email: 'lucas@email.com',
      phone: '+33 6 98 76 54 32',
      address: '456 Avenue des Champs, 69001 Lyon, France',
    },
    items: [
      {
        id: 'item-2',
        name: 'Premium Jacket',
        price: 189,
        quantity: 1,
        size: 'L',
        color: 'Brown',
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=200&auto=format&fit=crop',
      },
      {
        id: 'item-3',
        name: 'Classic White Tee',
        price: 45,
        quantity: 2,
        size: 'L',
        color: 'White',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=200&auto=format&fit=crop',
      },
    ],
    total: 279,
    status: 'processing',
    paymentStatus: 'paid',
    paymentMethod: 'PayPal',
    createdAt: '2024-01-15T14:45:00',
    updatedAt: '2024-01-15T14:45:00',
  },
  {
    id: 'ORD-003',
    customer: {
      name: 'Emma Bernard',
      email: 'emma@email.com',
      phone: '+33 6 11 22 33 44',
      address: '789 Boulevard Saint-Germain, 75006 Paris, France',
    },
    items: [
      {
        id: 'item-4',
        name: 'Running Sneakers',
        price: 165,
        quantity: 1,
        size: '10',
        color: 'Red',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200&auto=format&fit=crop',
      },
    ],
    total: 165,
    status: 'shipped',
    paymentStatus: 'paid',
    paymentMethod: 'Credit Card',
    trackingNumber: 'FR123456789',
    createdAt: '2024-01-14T11:30:00',
    updatedAt: '2024-01-15T11:30:00',
  },
]

// Clients mockés
export const mockCustomers: MockCustomer[] = [
  {
    id: 'cust-1',
    name: 'Sophie Martin',
    email: 'sophie@email.com',
    phone: '+33 6 12 34 56 78',
    address: '123 Rue de Paris, 75001 Paris, France',
    totalOrders: 12,
    totalSpent: 1250,
    status: 'active',
    createdAt: '2023-06-15T10:00:00',
    lastOrder: '2024-01-15T10:30:00',
  },
  {
    id: 'cust-2',
    name: 'Lucas Dubois',
    email: 'lucas@email.com',
    phone: '+33 6 98 76 54 32',
    address: '456 Avenue des Champs, 69001 Lyon, France',
    totalOrders: 8,
    totalSpent: 890,
    status: 'active',
    createdAt: '2023-08-20T14:00:00',
    lastOrder: '2024-01-15T14:45:00',
  },
  {
    id: 'cust-3',
    name: 'Emma Bernard',
    email: 'emma@email.com',
    phone: '+33 6 11 22 33 44',
    address: '789 Boulevard Saint-Germain, 75006 Paris, France',
    totalOrders: 5,
    totalSpent: 450,
    status: 'active',
    createdAt: '2023-09-10T09:00:00',
    lastOrder: '2024-01-14T11:30:00',
  },
]

// Coupons mockés
export const mockCoupons: MockCoupon[] = [
  {
    id: 'coupon-1',
    code: 'SUMMER25',
    type: 'percentage',
    value: 25,
    minPurchase: 50,
    maxUses: 100,
    usedCount: 45,
    expiresAt: '2024-08-31T23:59:59',
    isActive: true,
    createdAt: '2024-01-01T00:00:00',
    updatedAt: '2024-01-15T00:00:00',
  },
  {
    id: 'coupon-2',
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    minPurchase: 0,
    maxUses: null,
    usedCount: 234,
    expiresAt: null,
    isActive: true,
    createdAt: '2024-01-01T00:00:00',
    updatedAt: '2024-01-15T00:00:00',
  },
  {
    id: 'coupon-3',
    code: 'FREESHIP',
    type: 'fixed',
    value: 9.99,
    minPurchase: 0,
    maxUses: 50,
    usedCount: 12,
    expiresAt: '2024-06-30T23:59:59',
    isActive: false,
    createdAt: '2024-01-01T00:00:00',
    updatedAt: '2024-01-10T00:00:00',
  },
]

