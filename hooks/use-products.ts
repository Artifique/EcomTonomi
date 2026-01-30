"use client"

import { useState, useEffect } from 'react'
import { getProducts, saveProducts, generateId, initializeStorage } from '@/lib/storage'
import type { MockProduct } from '@/lib/mock-data'

export interface Product {
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

export function useProducts(category?: string, search?: string) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [category, search])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 200))

      initializeStorage()
      let allProducts = getProducts()

      // Filtrer par catégorie
      if (category && category !== 'ALL') {
        allProducts = allProducts.filter(p => p.category === category)
      }

      // Filtrer par recherche
      if (search) {
        const searchLower = search.toLowerCase()
        allProducts = allProducts.filter(
          p => p.name.toLowerCase().includes(searchLower) || 
               p.sku.toLowerCase().includes(searchLower)
        )
      }

      setProducts(allProducts)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des produits')
    } finally {
      setLoading(false)
    }
  }

  const createProduct = async (productData: Omit<Product, 'id' | 'rating' | 'reviews'>) => {
    try {
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 300))

      const newProduct: MockProduct = {
        id: generateId('prod'),
        ...productData,
        rating: 0,
        reviews: 0,
      }

      const allProducts = getProducts()
      allProducts.unshift(newProduct)
      saveProducts(allProducts)
      setProducts((prev) => [newProduct, ...prev])

      return newProduct
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la création du produit')
    }
  }

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 300))

      const allProducts = getProducts()
      const index = allProducts.findIndex(p => p.id === id)
      
      if (index === -1) {
        throw new Error('Produit non trouvé')
      }

      const updatedProduct = { ...allProducts[index], ...productData }
      allProducts[index] = updatedProduct
      saveProducts(allProducts)

      setProducts((prev) =>
        prev.map((p) => (p.id === id ? updatedProduct : p))
      )
      return updatedProduct
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la mise à jour du produit')
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 300))

      const allProducts = getProducts()
      const filtered = allProducts.filter(p => p.id !== id)
      saveProducts(filtered)

      setProducts((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la suppression du produit')
    }
  }

  return {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    refetch: fetchProducts,
  }
}

