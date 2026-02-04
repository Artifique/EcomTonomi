"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  ArrowUpRight,
  Loader2,
  AlertTriangle,
  Receipt,
  Award,
  Eye,
  Calendar,
} from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useOrders } from "@/hooks/use-orders"
import { useProducts } from "@/hooks/use-products"
import { useCustomers } from "@/hooks/use-customers"

// Mock data for dashboard (fallback)
const stats = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Orders",
    value: "2,350",
    change: "+15.2%",
    trend: "up",
    icon: ShoppingCart,
  },
  {
    title: "Customers",
    value: "12,234",
    change: "+8.1%",
    trend: "up",
    icon: Users,
  },
  {
    title: "Products",
    value: "573",
    change: "-2.4%",
    trend: "down",
    icon: Package,
  },
]

const recentOrders = [
  {
    id: "ORD-001",
    customer: "Amadou Diallo",
    email: "amadou.d@example.com",
    product: "Boubou Élégant",
    amount: "FCFA 45,000",
    status: "completed",
    date: "2024-01-15",
  },
  {
    id: "ORD-002",
    customer: "Mariam Traoré",
    email: "mariam.t@example.com",
    product: "Pagne Bogolan",
    amount: "FCFA 30,000",
    status: "processing",
    date: "2024-01-15",
  },
  {
    id: "ORD-003",
    customer: "Bakary Coulibaly",
    email: "bakary.c@example.com",
    product: "Chaussures Traditionnelles",
    amount: "FCFA 25,000",
    status: "shipped",
    date: "2024-01-14",
  },
  {
    id: "ORD-004",
    customer: "Fatoumata Konaté",
    email: "fatoumata.k@example.com",
    product: "T-shirt Coton Bio",
    amount: "FCFA 10,000",
    status: "pending",
    date: "2024-01-14",
  },
  {
    id: "ORD-005",
    customer: "Moussa Keïta",
    email: "moussa.k@example.com",
    product: "Bijoux Touareg",
    amount: "FCFA 75,000",
    status: "completed",
    date: "2024-01-13",
  },
]

const topProducts = [
  {
    id: 1,
    name: "Boubou Élégant",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=200&auto=format&fit=crop",
    sales: 245,
    revenue: "FCFA 450,000",
  },
  {
    id: 2,
    name: "Pagne Bogolan",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=200&auto=format&fit=crop",
    sales: 189,
    revenue: "FCFA 300,000",
  },
  {
    id: 3,
    name: "Chaussures Traditionnelles",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200&auto=format&fit=crop",
    sales: 156,
    revenue: "FCFA 250,000",
  },
  {
    id: 4,
    name: "T-shirt Coton Bio",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=200&auto=format&fit=crop",
    sales: 312,
    revenue: "FCFA 100,000",
  },
]

const statusStyles: Record<string, string> = {
  completed: "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-700 border border-green-500/30",
  processing: "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-700 border border-blue-500/30",
  shipped: "bg-gradient-to-r from-purple-500/20 to-violet-500/20 text-purple-700 border border-purple-500/30",
  pending: "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-700 border border-yellow-500/30",
  cancelled: "bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-700 border border-red-500/30",
}

// Gradient configurations for stat cards
const statGradients = [
  "from-accent/20 via-accent-rose/10 to-accent-blue/20",
  "from-accent-blue/20 via-accent/10 to-accent-rose/20",
  "from-accent-rose/20 via-accent-blue/10 to-accent/20",
  "from-accent/20 via-accent-blue/20 to-accent-rose/10",
]

// Mock data for charts (frontend only)
const generateDailySalesData = () => {
  const days = []
  const today = new Date()
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    days.push({
      name: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
      date: date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
      ventes: Math.floor(Math.random() * 50000) + 20000,
      commandes: Math.floor(Math.random() * 15) + 5,
    })
  }
  return days
}

const generateMonthlySalesData = () => {
  const months = []
  const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']
  const currentMonth = new Date().getMonth()
  for (let i = 5; i >= 0; i--) {
    const monthIndex = (currentMonth - i + 12) % 12
    months.push({
      name: monthNames[monthIndex],
      ventes: Math.floor(Math.random() * 200000) + 100000,
      commandes: Math.floor(Math.random() * 80) + 30,
    })
  }
  return months
}

const generateVisitorsData = () => {
  const days = []
  const today = new Date()
  
  // Données fixes avec variation réaliste pour garantir la visibilité
  const baseData = [
    { visiteurs: 285, pagesVues: 420 },
    { visiteurs: 312, pagesVues: 468 },
    { visiteurs: 298, pagesVues: 445 },
    { visiteurs: 325, pagesVues: 487 },
    { visiteurs: 340, pagesVues: 510 },
    { visiteurs: 318, pagesVues: 477 },
    { visiteurs: 352, pagesVues: 528 },
    { visiteurs: 368, pagesVues: 552 },
    { visiteurs: 345, pagesVues: 518 },
    { visiteurs: 375, pagesVues: 563 },
    { visiteurs: 390, pagesVues: 585 },
    { visiteurs: 365, pagesVues: 548 },
    { visiteurs: 405, pagesVues: 608 },
    { visiteurs: 420, pagesVues: 630 },
  ]
  
  for (let i = 13; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dataIndex = 13 - i
    
    days.push({
      name: date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
      visiteurs: baseData[dataIndex]?.visiteurs || 300,
      pagesVues: baseData[dataIndex]?.pagesVues || 450,
    })
  }
  return days
}

const dailySalesData = generateDailySalesData()
const monthlySalesData = generateMonthlySalesData()
const visitorsData = generateVisitorsData()



export default function AdminDashboard() {
  const [period, setPeriod] = useState("7d") // This can now be used to filter data if needed, but not implemented for now
  // Analytics are now derived directly from hooks, no separate state needed for `analytics`
  // const [analytics, setAnalytics] = useState<any>(null)
  // const [loading, setLoading] = useState(true) // Loading now comes from individual hooks

  // Optimisation : charger seulement les données nécessaires pour le dashboard
  const { orders, loading: ordersLoading } = useOrders()
  const { products, loading: productsLoading } = useProducts()
  const { customers, loading: customersLoading } = useCustomers()

  const loading = ordersLoading || productsLoading || customersLoading; // Combined loading state

  // Derived analytics from real-time data - Optimisé avec early return
  const { totalRevenue, totalOrders, totalCustomers, topProductsCalculated } = useMemo(() => {
    // Early return si les données ne sont pas encore chargées
    if (orders.length === 0 && products.length === 0) {
      return {
        totalRevenue: 0,
        totalOrders: 0,
        totalCustomers: customers.length,
        topProductsCalculated: [],
      };
    }

    let revenue = 0;
    let numOrders = orders.length; // Compter toutes les commandes
    let numCustomers = customers.length;
    // Utiliser Map pour de meilleures performances
    const productSalesMap = new Map<string, { sales: number; revenue: number; product: any }>();

    // Traiter toutes les commandes pour un calcul précis
    orders.forEach(order => {
      // Calculer le revenu : compter toutes les commandes (payées, complétées, ou en traitement)
      // Exclure seulement les commandes annulées
      if (order.status !== 'cancelled') {
        const orderTotal = parseFloat(order.total?.toString() || '0');
        if (!isNaN(orderTotal)) {
          revenue += orderTotal;
        }
      }
      
      // Traiter tous les order_items pour les statistiques de produits
      const orderItems = order.order_items || [];
      orderItems.forEach(item => {
        // Find the product from the products array for details, or use item.product_name
        const productDetail = products.find(p => p.id === item.product_id);
        
        const existing = productSalesMap.get(item.product_id);
        if (existing) {
          existing.sales += item.quantity;
          existing.revenue += item.quantity * parseFloat(item.price.toString());
        } else {
          productSalesMap.set(item.product_id, {
            sales: item.quantity,
            revenue: item.quantity * parseFloat(item.price.toString()),
            product: productDetail
          });
        }
      });
    });

    const topProductsSorted = Array.from(productSalesMap.values())
      .sort((a, b) => b.sales - a.sales) // Sort by sales
      .slice(0, 4) // Take top 4
      .map((item, index) => ({
        id: item.product?.id || `product-sales-${index}-${item.sales}`, // ID unique avec index et sales pour éviter les doublons
        name: item.product?.name || "Produit inconnu",
        image: item.product?.images?.[0] || "/placeholder.svg",
        sales: item.sales,
        revenue: item.revenue,
      }))
      .filter(item => item.id); // Filtrer les items sans ID valide

    return {
      totalRevenue: revenue,
      totalOrders: numOrders,
      totalCustomers: numCustomers,
      topProductsCalculated: topProductsSorted,
    };
  }, [orders, products, customers]); // Recalculate when dependencies change

  // Calculate stats from real data
  const stats = [
    {
      title: "Revenu total",
      value: `FCFA ${Number(totalRevenue).toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      change: "+0%", // You can calculate this from previous period
      trend: "up" as const,
      icon: DollarSign,
    },
    {
      title: "Commandes",
      value: totalOrders.toLocaleString('fr-FR'),
      change: "+0%",
      trend: "up" as const,
      icon: ShoppingCart,
    },
    {
      title: "Clients",
      value: totalCustomers.toLocaleString(),
      change: "+0%",
      trend: "up" as const,
      icon: Users,
    },
    {
      title: "Produits",
      value: products.length.toString(),
      change: "+0%",
      trend: "up" as const,
      icon: Package,
    },
  ]

  // Get recent orders
  const recentOrders = orders.slice(0, 5).map((order) => ({
    id: order.id,
    customer: order.customer_details?.name || "N/A", // Use customer_details
    email: order.customer_details?.email || "N/A", // Use customer_details
    product: order.order_items[0]?.product_name || "Multiple items", // Use product_name from order_items
    amount: `FCFA ${order.total.toFixed(2)}`,
    status: order.status,
    date: new Date(order.created_at).toLocaleDateString(), // Use created_at
  }))

  // Get top products from analytics
  const topProducts = topProductsCalculated;

  // Calculer les alertes de stock
  const lowStockProducts = useMemo(() => {
    if (loading || products.length === 0) return [];
    return products.filter(p => p.stock <= 10 && p.stock > 0);
  }, [products, loading]);

  const outOfStockProducts = useMemo(() => {
    if (loading || products.length === 0) return [];
    return products.filter(p => p.stock <= 0);
  }, [products, loading]);

  const totalStockAlerts = lowStockProducts.length + outOfStockProducts.length;

  return (
    <div className="space-y-3 sm:space-y-4 px-4 sm:px-0 pb-6">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Tableau de bord</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Bon retour, Admin</p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          {["24h", "7d", "30d", "90d"].map((p) => (
            <motion.button
              key={p}
              onClick={() => setPeriod(p)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-xs font-medium min-h-[36px] px-3 flex-shrink-0 disabled:pointer-events-none disabled:opacity-50 outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                period === p 
                  ? "bg-gradient-to-r from-accent to-accent-rose text-foreground shadow-lg shadow-accent/20" 
                  : "bg-background/50 backdrop-blur-sm border border-border hover:border-accent/50 hover:bg-secondary/50"
              )}
            >
              {p}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Alertes de stock faible */}
      {!loading && totalStockAlerts > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-r from-yellow-500/10 via-amber-500/10 to-yellow-500/10 border-yellow-500/30 relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 via-yellow-500/20 to-yellow-500/0"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            <CardContent className="p-3 relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center shadow-lg flex-shrink-0">
                    <AlertTriangle className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-foreground">
                    Alertes de stock
                  </p>
                    <p className="text-xs text-muted-foreground break-words">
                    {lowStockProducts.length > 0 && `${lowStockProducts.length} produit(s) en stock faible`}
                    {lowStockProducts.length > 0 && outOfStockProducts.length > 0 && " • "}
                    {outOfStockProducts.length > 0 && `${outOfStockProducts.length} produit(s) en rupture de stock`}
                  </p>
                </div>
              </div>
                <Link href="/admin/inventory?filter=low" className="flex-shrink-0">
                  <Button variant="outline" size="sm" className="rounded-full bg-background/80 backdrop-blur-sm border-accent/30 hover:bg-accent hover:text-foreground transition-all w-full sm:w-auto text-xs h-8 px-3">
                  Voir les détails
                    <ArrowUpRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        </motion.div>
      )}

      {/* Stats cards */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3, ease: "easeOut" }}
            >
              <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                {/* Gradient background */}
                  <div className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-50",
                  statGradients[index % statGradients.length]
                )} />
                
                {/* Glassmorphism overlay */}
                <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" />
                
                <CardContent className="p-4 relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shadow-lg",
                        "bg-gradient-to-br",
                        index === 0 && "from-accent to-accent-rose",
                        index === 1 && "from-accent-blue to-accent",
                        index === 2 && "from-accent-rose to-accent-blue",
                        index === 3 && "from-accent to-accent-blue"
                      )}
                    >
                      <stat.icon className="w-5 h-5 text-foreground" />
                    </motion.div>
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                      className={cn(
                        "flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full",
                        stat.trend === "up" 
                          ? "bg-green-500/20 text-green-700 border border-green-500/30" 
                          : "bg-red-500/20 text-red-700 border border-red-500/30"
                      )}
                    >
                    {stat.trend === "up" ? (
                        <TrendingUp className="w-3 h-3" />
                    ) : (
                        <TrendingDown className="w-3 h-3" />
                    )}
                    {stat.change}
                    </motion.div>
                  </div>
                  <div>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                      className="text-lg sm:text-xl font-bold text-foreground mb-0.5 break-words line-clamp-2"
                    >
                      {stat.value}
                    </motion.p>
                    <p className="text-xs text-muted-foreground font-medium">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
            </motion.div>
          ))}
        </div>
      )}
    
      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">

        {/* Recent orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3, ease: "easeOut" }}
          className="lg:col-span-2 flex"
        >
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden w-full flex flex-col">
            {/* Gradient border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-accent/20 via-accent-rose/20 to-accent-blue/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-[1px] bg-background/90 backdrop-blur-xl rounded-xl" />
            
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10 p-4">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-blue/10 via-accent-blue/5 to-accent/10 backdrop-blur-sm border border-accent-blue/20 flex items-center justify-center shadow-sm group flex-shrink-0"
                >
                  <Receipt className="w-4 h-4 text-accent-blue group-hover:text-accent-blue/80 transition-colors" />
                </motion.div>
                <CardTitle className="text-base font-semibold truncate">Commandes récentes</CardTitle>
              </div>
              <Link href="/admin/orders" className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg flex-shrink-0">
                <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-all text-xs h-8 px-2">
                  <span className="hidden sm:inline">Voir tout</span>
                  <span className="sm:hidden">Tout</span>
                  <ArrowUpRight className="w-3 h-3" />
              </Button>
            </Link>
          </CardHeader>
            <CardContent className="relative z-10 p-4">
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Commande
                      </th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Client
                      </th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Produit
                      </th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="text-right py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Montant
                      </th>
                    </tr>
                </thead>
                <tbody>
                  {recentOrders.length === 0 ? (
                    <tr>
                        <td colSpan={5} className="py-12">
                          <div className="flex flex-col items-center justify-center text-center">
                            <ShoppingCart className="w-12 h-12 text-muted-foreground/50 mb-4" />
                            <h3 className="text-lg font-semibold text-foreground mb-2">Aucune commande</h3>
                            <p className="text-sm text-muted-foreground mb-6">
                              Les nouvelles commandes apparaîtront ici
                            </p>
                            <Link href="/admin/orders">
                              <Button variant="outline" size="sm" className="rounded-full">
                                Voir toutes les commandes
                              </Button>
                            </Link>
                          </div>
                      </td>
                    </tr>
                  ) : (
                      recentOrders.map((order, idx) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + idx * 0.05, duration: 0.3 }}
                        className="border-b border-border/30 last:border-0 hover:bg-gradient-to-r hover:from-accent/5 hover:to-accent-rose/5 transition-all duration-200"
                      >
                        <td className="py-2.5 px-3">
                          <span className="font-semibold text-xs text-foreground">{order.id}</span>
                      </td>
                        <td className="py-2.5 px-3">
                        <div>
                            <p className="font-semibold text-xs text-foreground">{order.customer}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{order.email}</p>
                        </div>
                      </td>
                        <td className="py-2.5 px-3">
                          <span className="text-xs text-muted-foreground">{order.product}</span>
                      </td>
                        <td className="py-2.5 px-3">
                          <motion.span
                            whileHover={{ scale: 1.05 }}
                            className={cn(
                              "inline-flex px-2 py-1 rounded-full text-xs font-semibold capitalize shadow-sm",
                          statusStyles[order.status]
                            )}
                          >
                          {order.status}
                          </motion.span>
                      </td>
                        <td className="py-2.5 px-3 text-right">
                          <span className="font-bold text-xs text-foreground">FCFA {order.amount}</span>
                      </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-3">
                {recentOrders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center py-8">
                    <ShoppingCart className="w-12 h-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">Aucune commande</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Les nouvelles commandes apparaîtront ici
                    </p>
                    <Link href="/admin/orders">
                      <Button variant="outline" size="sm" className="rounded-full">
                        Voir toutes les commandes
                      </Button>
                    </Link>
                  </div>
                ) : (
                  recentOrders.map((order, idx) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + idx * 0.05, duration: 0.3 }}
                      className="p-3 rounded-xl border border-border/30 bg-background/50 hover:bg-gradient-to-r hover:from-accent/5 hover:to-accent-rose/5 transition-all duration-200"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-xs text-foreground mb-0.5">{order.id}</p>
                          <p className="font-medium text-xs text-foreground truncate">{order.customer}</p>
                          <p className="text-xs text-muted-foreground truncate">{order.email}</p>
                        </div>
                        <motion.span
                          whileHover={{ scale: 1.05 }}
                          className={cn(
                            "inline-flex px-2 py-0.5 rounded-full text-xs font-semibold capitalize shadow-sm flex-shrink-0 ml-2",
                            statusStyles[order.status]
                          )}
                        >
                          {order.status}
                        </motion.span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-border/20">
                        <div>
                          <p className="text-xs text-muted-foreground mb-0.5">Produit</p>
                          <p className="text-xs text-foreground truncate">{order.product}</p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-xs text-muted-foreground mb-0.5">Montant</p>
                          <p className="font-bold text-xs text-foreground">FCFA {order.amount}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
            </div>
          </CardContent>
        </Card>
        </motion.div>

        {/* Top products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3, ease: "easeOut" }}
          className="flex"
        >
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden w-full flex flex-col">
            {/* Gradient border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-accent-rose/20 via-accent/20 to-accent-blue/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-[1px] bg-background/90 backdrop-blur-xl rounded-xl" />
            
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10 p-4">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent/10 via-accent-rose/5 to-accent/10 backdrop-blur-sm border border-accent/20 flex items-center justify-center shadow-sm group flex-shrink-0"
                >
                  <Award className="w-4 h-4 text-accent group-hover:text-accent/80 transition-colors" />
                </motion.div>
                <CardTitle className="text-base font-semibold truncate">Meilleurs produits</CardTitle>
              </div>
              <Link href="/admin/products" className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg flex-shrink-0">
                <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-all text-xs h-8 px-2">
                  <span className="hidden sm:inline">Voir tout</span>
                  <span className="sm:hidden">Tout</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="relative z-10 flex-1 flex flex-col p-4">
              <div className="space-y-2 flex-1">
              {topProducts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center py-8">
                    <Package className="w-12 h-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">Aucun produit</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Les meilleurs produits apparaîtront ici
                    </p>
                    <Link href="/admin/products">
                      <Button variant="outline" size="sm" className="rounded-full">
                        Voir tous les produits
                      </Button>
                    </Link>
                  </div>
              ) : (
                topProducts.map((product: any, index: number) => (
                    <motion.div
                      key={product.id || `product-${index}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
                      className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-gradient-to-r hover:from-accent/5 hover:to-accent-rose/5 transition-all duration-200 group"
                    >
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-secondary flex-shrink-0 ring-2 ring-border group-hover:ring-accent/50 transition-all shadow-md">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name || "Product"}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-xs truncate text-foreground">{product.name || "Produit"}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{product.sales || 0} ventes</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-xs text-foreground whitespace-nowrap">FCFA {Number(product.revenue || 0).toLocaleString()}</p>
                      </div>
                    </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Daily Sales Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.3, ease: "easeOut" }}
        >
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden w-full flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-accent-rose/10 to-accent-blue/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-[1px] bg-background/90 backdrop-blur-xl rounded-xl" />
            
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10 p-4">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent/10 via-accent-rose/5 to-accent/10 backdrop-blur-sm border border-accent/20 flex items-center justify-center shadow-sm group flex-shrink-0"
                >
                  <Calendar className="w-4 h-4 text-accent group-hover:text-accent/80 transition-colors" />
                </motion.div>
                <div>
                  <CardTitle className="text-base font-semibold">Ventes du jour</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">7 derniers jours</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10 p-4 pt-0">
              <div className="h-[220px] sm:h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailySalesData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorVentes" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis 
                      dataKey="name" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '0.75rem',
                        padding: '0.5rem',
                      }}
                      labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
                      formatter={(value: any) => [`${Number(value).toLocaleString('fr-FR')} FCFA`, 'Ventes']}
                    />
                    <Area
                      type="monotone"
                      dataKey="ventes"
                      stroke="hsl(var(--accent))"
                      strokeWidth={2}
                      fill="url(#colorVentes)"
                      dot={{ fill: 'hsl(var(--accent))', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Monthly Sales Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.3, ease: "easeOut" }}
        >
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden w-full flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-r from-accent-blue/10 via-accent/10 to-accent-rose/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-[1px] bg-background/90 backdrop-blur-xl rounded-xl" />
            
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10 p-4">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-blue/10 via-accent-blue/5 to-accent/10 backdrop-blur-sm border border-accent-blue/20 flex items-center justify-center shadow-sm group flex-shrink-0"
                >
                  <TrendingUp className="w-4 h-4 text-accent-blue group-hover:text-accent-blue/80 transition-colors" />
                </motion.div>
                <div>
                  <CardTitle className="text-base font-semibold">Ventes du mois</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">6 derniers mois</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10 p-4 pt-0">
              <div className="h-[220px] sm:h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlySalesData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis 
                      dataKey="name" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '0.75rem',
                        padding: '0.5rem',
                      }}
                      labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
                      formatter={(value: any) => [`${Number(value).toLocaleString('fr-FR')} FCFA`, 'Ventes']}
                    />
                    <defs>
                      <linearGradient id="colorBarGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.9} />
                        <stop offset="100%" stopColor="hsl(var(--accent-rose))" stopOpacity={0.7} />
                      </linearGradient>
                    </defs>
                    <Bar 
                      dataKey="ventes" 
                      fill="url(#colorBarGradient)"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Visitors Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.3, ease: "easeOut" }}
          className="lg:col-span-2"
        >
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden w-full flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-r from-accent-rose/10 via-accent/10 to-accent-blue/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-[1px] bg-background/90 backdrop-blur-xl rounded-xl" />
            
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10 p-4">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-rose/10 via-accent-rose/5 to-accent-blue/10 backdrop-blur-sm border border-accent-rose/20 flex items-center justify-center shadow-sm group flex-shrink-0"
                >
                  <Eye className="w-4 h-4 text-accent-rose group-hover:text-accent-rose/80 transition-colors" />
                </motion.div>
                <div>
                  <CardTitle className="text-base font-semibold">Nombre de visiteurs</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">14 derniers jours</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10 p-4 pt-0">
              <div className="h-[220px] sm:h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={visitorsData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                    <defs>
                      {/* Gradient pour Visiteurs - Accent (Or/Doré) */}
                      <linearGradient id="colorVisiteursGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#DCB265" stopOpacity={0.4} />
                        <stop offset="50%" stopColor="#DCB265" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="#DCB265" stopOpacity={0.05} />
                      </linearGradient>
                      {/* Gradient pour Pages vues - Accent Blue */}
                      <linearGradient id="colorPagesVuesGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#184D6B" stopOpacity={0.4} />
                        <stop offset="50%" stopColor="#184D6B" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="#184D6B" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
                    <XAxis 
                      dataKey="name" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={11}
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={11}
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '0.75rem',
                        padding: '0.75rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      }}
                      labelStyle={{ 
                        color: 'hsl(var(--foreground))', 
                        fontWeight: 600,
                        fontSize: '12px',
                        marginBottom: '4px'
                      }}
                      itemStyle={{ 
                        color: 'hsl(var(--foreground))',
                        fontSize: '12px',
                        padding: '2px 0'
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ paddingTop: '0.5rem', paddingBottom: '0.5rem' }}
                      iconType="circle"
                      iconSize={8}
                      formatter={(value) => <span style={{ fontSize: '12px', color: 'hsl(var(--foreground))' }}>{value}</span>}
                    />
                    {/* Ligne Visiteurs - Accent (Or/Doré) */}
                    <Area
                      type="monotone"
                      dataKey="visiteurs"
                      stroke="#DCB265"
                      strokeWidth={3}
                      fill="url(#colorVisiteursGradient)"
                      dot={{ fill: '#DCB265', r: 4, strokeWidth: 2, stroke: '#FFFFFF' }}
                      activeDot={{ r: 6, strokeWidth: 2, stroke: '#FFFFFF', fill: '#DCB265' }}
                      name="Visiteurs"
                    />
                    {/* Ligne Pages vues - Accent Blue */}
                    <Area
                      type="monotone"
                      dataKey="pagesVues"
                      stroke="#184D6B"
                      strokeWidth={3}
                      fill="url(#colorPagesVuesGradient)"
                      dot={{ fill: '#184D6B', r: 4, strokeWidth: 2, stroke: '#FFFFFF' }}
                      activeDot={{ r: 6, strokeWidth: 2, stroke: '#FFFFFF', fill: '#184D6B' }}
                      name="Pages vues"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75, duration: 0.3, ease: "easeOut" }}
      >
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
          {/* Gradient border effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-accent-rose/10 to-accent-blue/10" />
          <div className="absolute inset-[1px] bg-background/90 backdrop-blur-xl rounded-xl" />
          
          <CardHeader className="relative z-10 p-4">
            <CardTitle className="text-base font-semibold">Actions rapides</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 p-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { href: "/admin/products?action=new", icon: Package, label: "Ajouter un produit", gradient: "from-accent to-accent-rose" },
                { href: "/admin/orders", icon: ShoppingCart, label: "Voir les commandes", gradient: "from-accent-blue to-accent" },
                { href: "/admin/customers", icon: Users, label: "Gérer les utilisateurs", gradient: "from-accent-rose to-accent-blue" },
                { href: "/admin/settings", icon: DollarSign, label: "Rapport de ventes", gradient: "from-accent to-accent-blue" },
              ].map((action, index) => (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.3 }}
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href={action.href} className="block focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl">
                    <div className="w-full h-auto py-3 flex flex-col gap-2 bg-background/50 backdrop-blur-sm border border-border rounded-xl hover:border-accent/50 hover:shadow-lg hover:shadow-accent/20 transition-all duration-300 group cursor-pointer">
                      <div className={cn(
                        "w-9 h-9 rounded-full bg-gradient-to-br mx-auto mb-1 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300",
                        action.gradient
                      )}>
                        <action.icon className="w-4 h-4 text-foreground" />
                      </div>
                      <span className="text-xs font-semibold text-foreground text-center block group-hover:text-accent transition-colors leading-tight px-1">
                        {action.label}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
          </div>
        </CardContent>
      </Card>
      </motion.div>
    </div>
  )
}