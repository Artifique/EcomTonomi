"use client"

import React, { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Bell,
  Search,
  Tag,
  Loader2,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/context/auth-context" // Import useAuth
import { supabase } from "@/lib/supabaseClient"

const sidebarLinks = [
  { name: "Tableau de bord", href: "/admin", icon: LayoutDashboard },
  { name: "Produits", href: "/admin/products", icon: Package },
  { name: "Catégories", href: "/admin/categories", icon: Tag },
  { name: "Commandes", href: "/admin/orders", icon: ShoppingCart },
  { name: "Clients", href: "/admin/customers", icon: Users },
  { name: "Paramètres", href: "/admin/settings", icon: Settings },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notificationCount, setNotificationCount] = useState(0)
  const { user, loading, logout } = useAuth() // Use useAuth hook
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // Only check auth if not on the login page and user loading is complete
    if (pathname === '/admin/login') {
      return
    }

    if (!loading) { // Wait for auth state to load
      if (!user || user.role !== 'admin') {
        router.push('/admin/login')
      }
    }
  }, [user, loading, router, pathname])

  // Calculer le nombre de notifications non lues (stock faible + rupture)
  useEffect(() => {
    if (!user || user.role !== 'admin' || pathname === '/admin/login') return

    const calculateNotificationCount = async () => {
      try {
        if (typeof window === 'undefined') return // Ne pas exécuter côté serveur
        
        // Récupérer les notifications lues depuis localStorage
        let readIds: string[] = []
        try {
          const readNotifications = localStorage.getItem('readNotifications')
          if (readNotifications) {
            readIds = JSON.parse(readNotifications) as string[]
          }
        } catch (localStorageError) {
          // Ignorer les erreurs de localStorage silencieusement
          readIds = []
        }
        
        const { data: products, error } = await supabase
          .from('products')
          .select('stock, id')
          .limit(200)

        // Vérifier si l'erreur existe vraiment (pas juste un objet vide)
        if (error && (error.message || Object.keys(error).length > 0)) {
          // Seulement logger si c'est une vraie erreur avec un message
          if (error.message) {
            console.error('Error fetching products for notifications:', error.message)
          }
          setNotificationCount(0)
          return
        }

        // Si pas de données, retourner 0
        if (!products || !Array.isArray(products) || products.length === 0) {
          setNotificationCount(0)
          return
        }

        // Compter seulement les notifications non lues
        let unreadCount = 0
        try {
          products.forEach((p: any) => {
            // Vérifier que le produit a les propriétés nécessaires
            if (!p || typeof p.stock !== 'number' || !p.id) return
            
            if (p.stock <= 0) {
              const notificationId = `out-of-stock-${p.id}`
              if (!readIds.includes(notificationId)) {
                unreadCount++
              }
            } else if (p.stock <= 10) {
              const notificationId = `low-stock-${p.id}`
              if (!readIds.includes(notificationId)) {
                unreadCount++
              }
            }
          })
        } catch (countError) {
          // Ignorer les erreurs de comptage silencieusement
          console.warn('Error counting notifications:', countError)
        }

        setNotificationCount(unreadCount)
      } catch (error) {
        // Gérer toutes les erreurs silencieusement pour ne pas polluer la console
        // Seulement logger si c'est une vraie erreur avec un message
        if (error instanceof Error && error.message) {
          console.error('Error in calculateNotificationCount:', error.message)
        }
        setNotificationCount(0)
      }
    }

    calculateNotificationCount()
    
    // Écouter les événements de mise à jour des notifications
    const handleNotificationsUpdate = () => {
      calculateNotificationCount()
    }
    
    if (typeof window !== 'undefined') {
      window.addEventListener('notificationsUpdated', handleNotificationsUpdate)
      
      // Rafraîchir toutes les 30 secondes
      const interval = setInterval(calculateNotificationCount, 30000)
      
      return () => {
        clearInterval(interval)
        window.removeEventListener('notificationsUpdated', handleNotificationsUpdate)
      }
    }
  }, [user, pathname])

  // Do not show the admin layout on the login page
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  // Show a loading state until authentication is confirmed
  if (loading || !user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-secondary via-background to-secondary relative overflow-hidden">
        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-accent/20 to-accent-rose/20 blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-accent-blue/20 to-accent/20 blur-3xl"
            animate={{
              x: [0, -100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Main loading content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center justify-center gap-8"
        >
          {/* Logo container with premium animation */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative"
          >
            {/* Outer glow ring */}
            <motion.div
              className="absolute inset-0 rounded-3xl"
              animate={{
                boxShadow: [
                  "0 0 0px rgba(220, 178, 101, 0.3)",
                  "0 0 40px rgba(220, 178, 101, 0.5)",
                  "0 0 0px rgba(220, 178, 101, 0.3)",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            
            {/* Main logo container */}
            <motion.div
              animate={{
                rotate: [0, 2, -2, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative"
            >
              <div className="w-40 h-40 rounded-3xl bg-gradient-to-br from-accent via-accent-rose to-accent-blue p-1.5 shadow-2xl relative overflow-hidden">
                {/* Animated gradient border */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-accent via-accent-rose via-accent-blue to-accent"
                  style={{
                    backgroundSize: "200% 200%",
                  }}
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                
                {/* Inner container with glassmorphism */}
                <div className="w-full h-full rounded-3xl bg-background/95 backdrop-blur-2xl flex items-center justify-center relative z-10 border border-white/10">
                  <motion.div
                    animate={{
                      scale: [1, 1.05, 1],
                      opacity: [0.9, 1, 0.9],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="relative"
                  >
                    <Image
                      src="/logo.png"
                      alt="Tonomi Logo"
                      width={200}
                      height={93}
                      className="h-24 w-auto drop-shadow-lg"
                      priority
                    />
                    
                    {/* Shine effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      style={{
                        transform: "skewX(-20deg)",
                      }}
                      animate={{
                        x: ["-100%", "200%"],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatDelay: 1,
                        ease: "easeInOut",
                      }}
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>
            
            {/* Floating particles around logo */}
            {[
              { top: "-10%", left: "10%", delay: 0, size: "w-1.5 h-1.5" },
              { top: "20%", left: "-5%", delay: 0.3, size: "w-2 h-2" },
              { top: "80%", left: "15%", delay: 0.6, size: "w-1.5 h-1.5" },
              { top: "10%", left: "90%", delay: 0.2, size: "w-2 h-2" },
              { top: "70%", left: "85%", delay: 0.4, size: "w-1.5 h-1.5" },
              { top: "50%", left: "-8%", delay: 0.5, size: "w-2 h-2" },
            ].map((particle, i) => (
              <motion.div
                key={i}
                className={cn(
                  "absolute rounded-full bg-gradient-to-br from-accent to-accent-rose",
                  particle.size
                )}
                style={{
                  top: particle.top,
                  left: particle.left,
                }}
                animate={{
                  y: [0, -30, 0],
                  x: [0, 15, 0],
                  opacity: [0.4, 1, 0.4],
                  scale: [0.8, 1.3, 0.8],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: particle.delay,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>

          {/* Loading text with gradient */}
          <div className="text-center space-y-4">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
              className="text-3xl font-bold bg-gradient-to-r from-foreground via-accent to-foreground bg-clip-text text-transparent bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite]"
            >
              Chargement de l'administration
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-muted-foreground flex items-center justify-center gap-2 text-base"
            >
              <motion.span
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                Veuillez patienter
              </motion.span>
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                ...
              </motion.span>
            </motion.p>
          </div>

          {/* Premium loading spinner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="relative w-16 h-16"
          >
            {/* Outer rotating ring */}
            <motion.div
              className="absolute inset-0 border-4 border-transparent border-t-accent border-r-accent-rose rounded-full"
              animate={{ rotate: 360 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            {/* Inner rotating ring */}
            <motion.div
              className="absolute inset-2 border-4 border-transparent border-b-accent-blue border-l-accent rounded-full"
              animate={{ rotate: -360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            {/* Center dot */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gradient-to-br from-accent to-accent-rose"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>

          {/* Premium progress indicator */}
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-3"
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-3 h-3 rounded-full bg-gradient-to-br from-accent to-accent-rose shadow-lg"
                animate={{
                  scale: [1, 1.6, 1],
                  opacity: [0.5, 1, 0.5],
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  delay: i * 0.25,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    )
  }

  const handleLogout = async () => {
    try {
      await logout()
      // Nettoyer le localStorage si nécessaire
      if (typeof window !== 'undefined') {
        localStorage.removeItem('readNotifications')
      }
      // Rediriger vers la page de login
      router.push('/admin/login')
      // Forcer un rechargement pour s'assurer que l'état est réinitialisé
      router.refresh()
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
      // Même en cas d'erreur, rediriger vers la page de login
      router.push('/admin/login')
    }
  }

  return (
    <Suspense fallback={null}>
      <div className="min-h-screen bg-secondary">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-foreground/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            "fixed top-0 left-0 z-50 h-full w-64 bg-foreground text-background transform lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center justify-center h-24 px-6 border-b border-background/10 relative">
              <Link href="/admin" className="flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="Tonomi Logo"
                  width={240}
                  height={112}
                  className="h-20 w-auto"
                  priority
                />
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-background hover:bg-background/10 absolute right-4"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
              {sidebarLinks.map((link) => {
                const isActive = pathname === link.href || 
                  (link.href !== "/admin" && pathname.startsWith(link.href))
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-background/70 hover:bg-background/10 hover:text-background"
                    )}
                  >
                    <link.icon className="w-5 h-5" />
                    {link.name}
                  </Link>
                )
              })}
            </nav>

            {/* User section */}
            <div className="p-4 border-t border-background/10">
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start gap-3 text-background/70 hover:bg-background/10 hover:text-background"
              >
                <LogOut className="w-5 h-5" />
                Déconnexion
              </Button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="lg:pl-64">
          {/* Top header */}
          <header className="sticky top-0 z-30 h-16 bg-background border-b border-border flex items-center px-4 lg:px-6">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden mr-4"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>

            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  className="pl-10 bg-secondary border-0 rounded-full"
                />
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-2 ml-auto">
              <Link href="/admin/notifications">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  {notificationCount > 0 && (
                    <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                      {notificationCount > 99 ? '99+' : notificationCount}
                    </span>
                  )}
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-semibold text-sm">
                      {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Paramètres
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Déconnexion
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/">
                      Retour à la boutique
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Page content */}
          <main id="main-content" className="p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </Suspense>
  )
}
