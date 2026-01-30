"use client"

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { getOrders, saveOrders, initializeStorage } from '@/lib/storage'
import type { MockOrder } from '@/lib/mock-data'

export interface Order {
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
  status: string
  paymentStatus: string
  paymentMethod?: string
  trackingNumber?: string
  createdAt: string
  updatedAt: string
}

export function useOrders(status?: string) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [status])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 200))

      initializeStorage()
      let allOrders = getOrders()

      // Filtrer par statut
      if (status && status !== 'ALL') {
        allOrders = allOrders.filter(o => o.status === status)
      }

      setOrders(allOrders)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des commandes')
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, status: string, trackingNumber?: string) => {
    try {
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 300))

      const allOrders = getOrders()
      const index = allOrders.findIndex(o => o.id === orderId)
      
      if (index === -1) {
        throw new Error('Commande non trouvée')
      }

      const updatedOrder: MockOrder = {
        ...allOrders[index],
        status: status as any,
        trackingNumber: trackingNumber || allOrders[index].trackingNumber,
        updatedAt: new Date().toISOString(),
      }

      allOrders[index] = updatedOrder
      saveOrders(allOrders)

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? updatedOrder : o))
      )
      toast.success('Commande mise à jour avec succès')
      return updatedOrder
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la mise à jour')
      throw error
    }
  }

  return {
    orders,
    loading,
    error,
    updateOrderStatus,
    refetch: fetchOrders,
  }
}

