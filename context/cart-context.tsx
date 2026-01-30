"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { Product } from "@/lib/products"

export interface CartItem {
  product: Product
  quantity: number
  size: string
  color: { name: string; value: string }
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: number, size: string, colorName: string) => void
  updateQuantity: (productId: number, size: string, colorName: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

// Demo cart items for showcase
const demoCartItems: CartItem[] = [
  {
    product: {
      id: 1,
      name: "Modern Blazer",
      price: 125,
      originalPrice: 165,
      description: "A sophisticated modern blazer crafted from premium wool blend fabric.",
      images: ["https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=2080&auto=format&fit=crop"],
      category: "JACKETS",
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: [{ name: "Black", value: "#110A0B" }],
      isNew: true,
      inStock: true,
      rating: 4.8,
      reviews: 124,
    },
    quantity: 1,
    size: "M",
    color: { name: "Black", value: "#110A0B" },
  },
  {
    product: {
      id: 4,
      name: "Running Sneakers",
      price: 165,
      originalPrice: 195,
      description: "High-performance running sneakers designed for comfort and speed.",
      images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop"],
      category: "SHOES",
      sizes: ["7", "8", "9", "10", "11", "12"],
      colors: [{ name: "Red", value: "#DC2626" }],
      isNew: false,
      inStock: true,
      rating: 4.6,
      reviews: 178,
    },
    quantity: 2,
    size: "10",
    color: { name: "Red", value: "#DC2626" },
  },
  {
    product: {
      id: 3,
      name: "Classic White Tee",
      price: 45,
      description: "The perfect everyday essential made from 100% organic cotton.",
      images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2080&auto=format&fit=crop"],
      category: "T-SHIRT",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      colors: [{ name: "White", value: "#FFFFFF" }],
      isNew: true,
      inStock: true,
      rating: 4.7,
      reviews: 256,
    },
    quantity: 1,
    size: "L",
    color: { name: "White", value: "#FFFFFF" },
  },
]

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(demoCartItems)

  const addItem = (newItem: CartItem) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === newItem.product.id &&
          item.size === newItem.size &&
          item.color.name === newItem.color.name
      )

      if (existingIndex > -1) {
        const updated = [...prev]
        updated[existingIndex].quantity += newItem.quantity
        return updated
      }

      return [...prev, newItem]
    })
  }

  const removeItem = (productId: number, size: string, colorName: string) => {
    setItems((prev) =>
      prev.filter(
        (item) =>
          !(item.product.id === productId && item.size === size && item.color.name === colorName)
      )
    )
  }

  const updateQuantity = (productId: number, size: string, colorName: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, size, colorName)
      return
    }

    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.size === size && item.color.name === colorName
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
