"use client"

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { getCoupons, saveCoupons, generateId, initializeStorage } from '@/lib/storage'
import type { MockCoupon } from '@/lib/mock-data'

export interface Coupon {
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

export function useCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCoupons()
  }, [])

  const fetchCoupons = async () => {
    try {
      setLoading(true)
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 200))

      initializeStorage()
      const allCoupons = getCoupons()
      setCoupons(allCoupons)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des coupons')
    } finally {
      setLoading(false)
    }
  }

  const createCoupon = async (couponData: Omit<Coupon, 'id' | 'usedCount' | 'createdAt' | 'updatedAt'>) => {
    try {
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 300))

      const newCoupon: MockCoupon = {
        id: generateId('coupon'),
        ...couponData,
        usedCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const allCoupons = getCoupons()
      allCoupons.unshift(newCoupon)
      saveCoupons(allCoupons)
      setCoupons((prev) => [newCoupon, ...prev])
      
      toast.success('Coupon créé avec succès')
      return newCoupon
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la création du coupon')
    }
  }

  const updateCoupon = async (id: string, couponData: Partial<Coupon>) => {
    try {
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 300))

      const allCoupons = getCoupons()
      const index = allCoupons.findIndex(c => c.id === id)
      
      if (index === -1) {
        throw new Error('Coupon non trouvé')
      }

      const updatedCoupon: MockCoupon = {
        ...allCoupons[index],
        ...couponData,
        updatedAt: new Date().toISOString(),
      }

      allCoupons[index] = updatedCoupon
      saveCoupons(allCoupons)

      setCoupons((prev) =>
        prev.map((c) => (c.id === id ? updatedCoupon : c))
      )
      toast.success('Coupon mis à jour avec succès')
      return updatedCoupon
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la mise à jour du coupon')
    }
  }

  const deleteCoupon = async (id: string) => {
    try {
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 300))

      const allCoupons = getCoupons()
      const filtered = allCoupons.filter(c => c.id !== id)
      saveCoupons(filtered)

      setCoupons((prev) => prev.filter((c) => c.id !== id))
      toast.success('Coupon supprimé avec succès')
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la suppression du coupon')
    }
  }

  return {
    coupons,
    loading,
    error,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    refetch: fetchCoupons,
  }
}

