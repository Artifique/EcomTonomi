"use client"

import { useState, useEffect } from 'react'
import { getCustomers, saveCustomers, initializeStorage } from '@/lib/storage'
import type { MockCustomer } from '@/lib/mock-data'

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  avatar: string | null
  status: string
  totalOrders: number
  totalSpent: number
  createdAt: string
  lastOrderAt: string
  address: string
}

export function useCustomers(search?: string) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCustomers()
  }, [search])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 200))

      initializeStorage()
      let allCustomers = getCustomers()

      // Filtrer par recherche
      if (search) {
        const searchLower = search.toLowerCase()
        allCustomers = allCustomers.filter(
          c => c.name.toLowerCase().includes(searchLower) || 
               c.email.toLowerCase().includes(searchLower)
        )
      }

      // Transformer en format Customer avec avatar
      const transformedCustomers: Customer[] = allCustomers.map(c => ({
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        avatar: null, // Pas d'avatar dans mock-data pour l'instant
        status: c.status,
        totalOrders: c.totalOrders,
        totalSpent: c.totalSpent,
        createdAt: c.createdAt,
        lastOrderAt: c.lastOrder || '',
        address: c.address,
      }))

      setCustomers(transformedCustomers)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des clients')
    } finally {
      setLoading(false)
    }
  }

  const toggleCustomerStatus = async (customerId: string, currentStatus: string) => {
    try {
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 300))

      const allCustomers = getCustomers()
      const index = allCustomers.findIndex(c => c.id === customerId)
      
      if (index === -1) {
        throw new Error('Client non trouvé')
      }

      const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
      const updatedCustomer: MockCustomer = {
        ...allCustomers[index],
        status: newStatus as any,
      }

      allCustomers[index] = updatedCustomer
      saveCustomers(allCustomers)

      setCustomers((prev) =>
        prev.map((c) => (c.id === customerId ? { ...c, status: newStatus } : c))
      )
      return updatedCustomer
    } catch (error) {
      throw error
    }
  }

  return {
    customers,
    loading,
    error,
    toggleCustomerStatus,
    refetch: fetchCustomers,
  }
}
