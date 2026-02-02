"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  AlertTriangle,
  Package,
  ShoppingCart,
  Users,
  Bell,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useProducts } from "@/hooks/use-products"
import { useOrders } from "@/hooks/use-orders"
import { supabase } from "@/lib/supabaseClient"

interface Notification {
  id: string
  type: 'low_stock' | 'out_of_stock' | 'new_order' | 'new_customer'
  title: string
  message: string
  productId?: string
  productName?: string
  orderId?: string
  customerId?: string
  customerName?: string
  timestamp: Date
  read: boolean
  severity: 'info' | 'warning' | 'error'
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const { products, loading: productsLoading } = useProducts()
  const { orders, loading: ordersLoading } = useOrders()

  // Générer les notifications depuis les données
  useEffect(() => {
    if (productsLoading || ordersLoading) return

    const newNotifications: Notification[] = []

    // Notifications de stock faible
    products.forEach(product => {
      if (product.stock <= 0) {
        newNotifications.push({
          id: `out-of-stock-${product.id}`,
          type: 'out_of_stock',
          title: 'Rupture de stock',
          message: `Le produit "${product.name}" est en rupture de stock (${product.stock} unités)`,
          productId: product.id,
          productName: product.name,
          timestamp: new Date(),
          read: false,
          severity: 'error'
        })
      } else if (product.stock <= 10) {
        newNotifications.push({
          id: `low-stock-${product.id}`,
          type: 'low_stock',
          title: 'Stock faible',
          message: `Le produit "${product.name}" a un stock faible (${product.stock} unités restantes)`,
          productId: product.id,
          productName: product.name,
          timestamp: new Date(),
          read: false,
          severity: 'warning'
        })
      }
    })

    // Notifications de nouvelles commandes (dernières 24h)
    const last24Hours = new Date()
    last24Hours.setHours(last24Hours.getHours() - 24)

    orders
      .filter(order => {
        if (!order.created_at) return false
        try {
          const orderDate = new Date(order.created_at)
          return !isNaN(orderDate.getTime()) && orderDate > last24Hours
        } catch {
          return false
        }
      })
      .slice(0, 10) // Limiter à 10 dernières commandes
      .forEach(order => {
        if (!order.created_at) return
        try {
          const orderDate = new Date(order.created_at)
          if (isNaN(orderDate.getTime())) return
          
          newNotifications.push({
            id: `new-order-${order.id}`,
            type: 'new_order',
            title: 'Nouvelle commande',
            message: `Nouvelle commande de ${order.customer_details?.name || 'Client'} - ${order.total} FCFA`,
            orderId: order.id,
            customerName: order.customer_details?.name,
            timestamp: orderDate,
            read: false,
            severity: 'info'
          })
        } catch (error) {
          console.error('Error creating notification for order:', order.id, error)
        }
      })

    // Trier par date (plus récentes en premier)
    newNotifications.sort((a, b) => {
      try {
        const timeA = a.timestamp instanceof Date && !isNaN(a.timestamp.getTime()) ? a.timestamp.getTime() : 0
        const timeB = b.timestamp instanceof Date && !isNaN(b.timestamp.getTime()) ? b.timestamp.getTime() : 0
        return timeB - timeA
      } catch {
        return 0
      }
    })

    // Charger l'état "read" depuis localStorage
    if (typeof window !== 'undefined') {
      const readNotifications = localStorage.getItem('readNotifications')
      if (readNotifications) {
        try {
          const readIds = JSON.parse(readNotifications) as string[]
          newNotifications.forEach(notification => {
            if (readIds.includes(notification.id)) {
              notification.read = true
            }
          })
        } catch (error) {
          console.error('Error loading read notifications:', error)
        }
      }
    }

    setNotifications(newNotifications)
    setLoading(false)
  }, [products, orders, productsLoading, ordersLoading])

  // Charger les notifications lues depuis localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const readNotifications = localStorage.getItem('readNotifications')
      if (readNotifications) {
        try {
          const readIds = JSON.parse(readNotifications) as string[]
          setNotifications(prev => prev.map(n => 
            readIds.includes(n.id) ? { ...n, read: true } : n
          ))
        } catch (error) {
          console.error('Error loading read notifications:', error)
        }
      }
    }
  }, [])

  // Sauvegarder les notifications lues dans localStorage
  const saveReadNotifications = (readIds: string[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('readNotifications', JSON.stringify(readIds))
      // Déclencher un événement pour mettre à jour le compteur dans le layout
      window.dispatchEvent(new CustomEvent('notificationsUpdated'))
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, read: true } : n)
      const readIds = updated.filter(n => n.read).map(n => n.id)
      saveReadNotifications(readIds)
      return updated
    })
  }

  const markAllAsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }))
      const readIds = updated.map(n => n.id)
      saveReadNotifications(readIds)
      return updated
    })
  }

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'low_stock':
      case 'out_of_stock':
        return <Package className="w-5 h-5" />
      case 'new_order':
        return <ShoppingCart className="w-5 h-5" />
      case 'new_customer':
        return <Users className="w-5 h-5" />
      default:
        return <Bell className="w-5 h-5" />
    }
  }

  const getSeverityColor = (severity: Notification['severity']) => {
    switch (severity) {
      case 'error':
        return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'
      case 'warning':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400'
      case 'info':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-950 dark:text-gray-400'
    }
  }

  const formatTimestamp = (date: Date) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return "Date invalide"
    }
    
    try {
      const now = new Date()
      const diff = now.getTime() - date.getTime()
      const minutes = Math.floor(diff / 60000)
      const hours = Math.floor(diff / 3600000)
      const days = Math.floor(diff / 86400000)

      if (minutes < 1) return "À l'instant"
      if (minutes < 60) return `Il y a ${minutes} min`
      if (hours < 24) return `Il y a ${hours}h`
      if (days < 7) return `Il y a ${days}j`
      return date.toLocaleDateString('fr-FR')
    } catch (error) {
      console.error('Error formatting timestamp:', error)
      return "Date invalide"
    }
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} notification(s) non lue(s)` : "Toutes les notifications sont lues"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            onClick={markAllAsRead}
            className="rounded-full"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Tout marquer comme lu
          </Button>
        )}
      </div>

      {/* Notifications list */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : notifications.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Aucune notification
            </h3>
            <p className="text-muted-foreground">
              Vous n'avez aucune notification pour le moment.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={cn(
                "border-0 shadow-sm transition-all cursor-pointer hover:shadow-md",
                !notification.read && "bg-blue-50 dark:bg-blue-950 border-l-4 border-l-blue-500"
              )}
              onClick={() => {
                markAsRead(notification.id)
                if (notification.productId) {
                  window.location.href = `/admin/products`
                } else if (notification.orderId) {
                  window.location.href = `/admin/orders`
                }
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                    getSeverityColor(notification.severity)
                  )}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <span className="h-2 w-2 bg-blue-500 rounded-full" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{formatTimestamp(notification.timestamp)}</span>
                          {notification.productId && (
                            <Link
                              href="/admin/products"
                              onClick={(e) => e.stopPropagation()}
                              className="hover:text-foreground"
                            >
                              Voir le produit
                            </Link>
                          )}
                          {notification.orderId && (
                            <Link
                              href="/admin/orders"
                              onClick={(e) => e.stopPropagation()}
                              className="hover:text-foreground"
                            >
                              Voir la commande
                            </Link>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          markAsRead(notification.id)
                        }}
                        className="flex-shrink-0"
                      >
                        {notification.read ? (
                          <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
