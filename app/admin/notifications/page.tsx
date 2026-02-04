"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
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
  Sparkles,
  ArrowUpRight,
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
        return 'bg-gradient-to-br from-red-500/20 to-rose-500/20 text-red-700 border border-red-500/30'
      case 'warning':
        return 'bg-gradient-to-br from-yellow-500/20 to-amber-500/20 text-yellow-700 border border-yellow-500/30'
      case 'info':
        return 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-blue-700 border border-blue-500/30'
      default:
        return 'bg-gradient-to-br from-gray-500/20 to-slate-500/20 text-gray-700 border border-gray-500/30'
    }
  }

  const getSeverityGradient = (severity: Notification['severity']) => {
    switch (severity) {
      case 'error':
        return 'from-red-500 to-rose-500'
      case 'warning':
        return 'from-yellow-500 to-amber-500'
      case 'info':
        return 'from-blue-500 to-cyan-500'
      default:
        return 'from-gray-500 to-slate-500'
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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground">Notifications</h1>
          <div className="flex items-center gap-2 mt-2">
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="w-2 h-2 rounded-full bg-gradient-to-r from-red-500 to-rose-500 animate-pulse"
              />
            )}
            <p className="text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} notification(s) non lue(s)` : "Toutes les notifications sont lues"}
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <Button
              variant="outline"
              onClick={markAllAsRead}
              className="rounded-full bg-gradient-to-r from-accent/10 to-accent-rose/10 border-accent/30 hover:from-accent/20 hover:to-accent-rose/20 transition-all"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Tout marquer comme lu
            </Button>
          </motion.div>
        )}
      </motion.div>

      {/* Notifications list */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : notifications.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-0 shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-accent-rose/5 to-accent-blue/5" />
            <div className="absolute inset-[1px] bg-background/90 backdrop-blur-xl rounded-xl" />
            <CardContent className="p-12 text-center relative z-10">
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-accent/20 to-accent-rose/20 flex items-center justify-center">
                  <Bell className="w-10 h-10 text-muted-foreground" />
                </div>
              </motion.div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Aucune notification
              </h3>
              <p className="text-muted-foreground">
                Vous n'avez aucune notification pour le moment.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, height: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3, ease: "easeOut" }}
                layout
              >
                <Card
                  className={cn(
                    "border-0 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden group",
                    !notification.read && "ring-2 ring-accent/30"
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
                  {/* Gradient background for unread */}
                  {!notification.read && (
                    <motion.div
                      className={cn(
                        "absolute inset-0 bg-gradient-to-r opacity-50",
                        notification.severity === 'error' && "from-red-500/10 to-rose-500/10",
                        notification.severity === 'warning' && "from-yellow-500/10 to-amber-500/10",
                        notification.severity === 'info' && "from-blue-500/10 to-cyan-500/10"
                      )}
                      animate={{
                        opacity: [0.3, 0.5, 0.3],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}
                  
                  {/* Glassmorphism overlay */}
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" />
                  
                  {/* Animated border for unread */}
                  {!notification.read && (
                    <motion.div
                      className={cn(
                        "absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b",
                        getSeverityGradient(notification.severity)
                      )}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: index * 0.05 + 0.2, duration: 0.3 }}
                    />
                  )}

                  <CardContent className="p-5 relative z-10">
                    <div className="flex items-start gap-4">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className={cn(
                          "w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg",
                          "bg-gradient-to-br",
                          getSeverityGradient(notification.severity)
                        )}
                      >
                        <div className="text-white">
                          {getNotificationIcon(notification.type)}
                        </div>
                      </motion.div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-bold text-base text-foreground">
                                {notification.title}
                              </h3>
                              {!notification.read && (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg"
                                />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-4 text-xs">
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{formatTimestamp(notification.timestamp)}</span>
                              </div>
                              {notification.productId && (
                                <Link
                                  href="/admin/products"
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-accent hover:text-accent-rose font-medium transition-colors flex items-center gap-1"
                                >
                                  Voir le produit
                                  <ArrowUpRight className="w-3 h-3" />
                                </Link>
                              )}
                              {notification.orderId && (
                                <Link
                                  href="/admin/orders"
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-accent hover:text-accent-rose font-medium transition-colors flex items-center gap-1"
                                >
                                  Voir la commande
                                  <ArrowUpRight className="w-3 h-3" />
                                </Link>
                              )}
                            </div>
                          </div>
                          
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation()
                                markAsRead(notification.id)
                              }}
                              className="flex-shrink-0 h-9 w-9 rounded-full hover:bg-accent/10"
                            >
                              {notification.read ? (
                                <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                              ) : (
                                <motion.div
                                  animate={{ rotate: [0, 10, -10, 0] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                >
                                  <XCircle className="w-4 h-4 text-foreground" />
                                </motion.div>
                              )}
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
