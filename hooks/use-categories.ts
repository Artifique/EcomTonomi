"use client"

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { getCategories, saveCategories, getProducts, generateId, initializeStorage } from '@/lib/storage'
import type { MockCategory } from '@/lib/mock-data'

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  isActive: boolean
  productCount?: number
  createdAt: string
  updatedAt: string
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 200))

      initializeStorage()
      let allCategories = getCategories()
      const products = getProducts()

      // Calculer le nombre de produits par catégorie
      allCategories = allCategories.map(cat => ({
        ...cat,
        productCount: products.filter(p => p.categoryId === cat.id).length,
      }))

      setCategories(allCategories)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des catégories')
    } finally {
      setLoading(false)
    }
  }

  const createCategory = async (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'productCount'>) => {
    try {
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 300))

      const newCategory: MockCategory = {
        id: generateId('cat'),
        ...categoryData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const allCategories = getCategories()
      allCategories.unshift(newCategory)
      saveCategories(allCategories)
      setCategories((prev) => [{ ...newCategory, productCount: 0 }, ...prev])
      
      toast.success('Catégorie créée avec succès')
      return newCategory
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la création de la catégorie')
    }
  }

  const updateCategory = async (id: string, categoryData: Partial<Category>) => {
    try {
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 300))

      const allCategories = getCategories()
      const index = allCategories.findIndex(c => c.id === id)
      
      if (index === -1) {
        throw new Error('Catégorie non trouvée')
      }

      const updatedCategory: MockCategory = {
        ...allCategories[index],
        ...categoryData,
        updatedAt: new Date().toISOString(),
      }

      allCategories[index] = updatedCategory
      saveCategories(allCategories)

      const products = getProducts()
      const productCount = products.filter(p => p.categoryId === id).length

      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...updatedCategory, productCount } : c))
      )
      toast.success('Catégorie mise à jour avec succès')
      return updatedCategory
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la mise à jour de la catégorie')
    }
  }

  const deleteCategory = async (id: string) => {
    try {
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 300))

      const allCategories = getCategories()
      const filtered = allCategories.filter(c => c.id !== id)
      saveCategories(filtered)

      setCategories((prev) => prev.filter((c) => c.id !== id))
      toast.success('Catégorie supprimée avec succès')
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la suppression de la catégorie')
    }
  }

  return {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    refetch: fetchCategories,
  }
}

