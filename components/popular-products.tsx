"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Heart, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { QuickViewModal } from "@/components/quick-view-modal"

const filters = ["ALL", "SHORTS", "JACKETS", "SHOES", "T-SHIRT"]

const products = [
  {
    id: 1,
    name: "Modern Blazer",
    price: 125,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=2080&auto=format&fit=crop",
    category: "JACKETS",
    isNew: true,
  },
  {
    id: 2,
    name: "Premium Jacket",
    price: 189,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1935&auto=format&fit=crop",
    category: "JACKETS",
    isNew: false,
  },
  {
    id: 3,
    name: "Classic White Tee",
    price: 45,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2080&auto=format&fit=crop",
    category: "T-SHIRT",
    isNew: true,
  },
  {
    id: 4,
    name: "Running Sneakers",
    price: 165,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop",
    category: "SHOES",
    isNew: false,
  },
  {
    id: 5,
    name: "Summer Shorts",
    price: 55,
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=2070&auto=format&fit=crop",
    category: "SHORTS",
    isNew: true,
  },
  {
    id: 6,
    name: "Leather Boots",
    price: 225,
    image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=1974&auto=format&fit=crop",
    category: "SHOES",
    isNew: false,
  },
  {
    id: 7,
    name: "Denim Jacket",
    price: 145,
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=2070&auto=format&fit=crop",
    category: "JACKETS",
    isNew: false,
  },
  {
    id: 8,
    name: "Graphic Tee",
    price: 39,
    image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?q=80&w=1974&auto=format&fit=crop",
    category: "T-SHIRT",
    isNew: true,
  },
]

export function PopularProducts() {
  const [activeFilter, setActiveFilter] = useState("ALL")
  const [favorites, setFavorites] = useState<number[]>([])
  const [quickViewProduct, setQuickViewProduct] = useState<typeof products[0] | null>(null)
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null)

  const filteredProducts =
    activeFilter === "ALL"
      ? products
      : products.filter((product) => product.category === activeFilter)

  const toggleFavorite = (productId: number, e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    )
  }

  const openQuickView = (product: typeof products[0], e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setQuickViewProduct(product)
  }

  return (
    <section className="container mx-auto px-4 py-12 lg:py-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
          Produits populaires
        </h2>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "rounded-full text-xs",
                activeFilter === filter
                  ? "bg-foreground text-background"
                  : "bg-transparent border-border text-foreground hover:bg-secondary"
              )}
            >
              {filter}
            </Button>
          ))}
        </div>
      </div>

      {/* Products Grid avec animations staggered */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="group"
            onMouseEnter={() => setHoveredProduct(product.id)}
            onMouseLeave={() => setHoveredProduct(null)}
          >
            <Link href={`/product/${product.id}`}>
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-secondary mb-3">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover object-center transition-transform duration-500"
                  loading={index < 4 ? "eager" : "lazy"}
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                {product.isNew && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                    className="absolute top-3 left-3 px-2 py-1 text-[10px] font-semibold tracking-wider uppercase bg-accent text-accent-foreground rounded-full"
                  >
                    Nouveau
                  </motion.span>
                )}
                
                {/* Overlay avec actions au hover (desktop) */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: hoveredProduct === product.id ? 1 : 0,
                    scale: hoveredProduct === product.id ? 1.05 : 1
                  }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center gap-2"
                >
                  <Button
                    size="sm"
                    variant="secondary"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => openQuickView(product, e)}
                    onMouseEnter={(e) => e.stopPropagation()}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Aperçu rapide
                  </Button>
                </motion.div>

                <button
                  type="button"
                  onClick={(e) => toggleFavorite(product.id, e)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors z-10"
                  aria-label={
                    favorites.includes(product.id)
                      ? "Retirer des favoris"
                      : "Ajouter aux favoris"
                  }
                >
                  <Heart
                    className={cn(
                      "h-4 w-4 transition-colors",
                      favorites.includes(product.id)
                        ? "fill-red-500 text-red-500"
                        : "text-foreground"
                    )}
                  />
                </button>
              </div>
            </Link>
            <div>
              <h3 className="font-medium text-foreground text-sm lg:text-base mb-1 truncate">
                {product.name}
              </h3>
              <p className="text-foreground font-semibold">${product.price}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}

      {/* View All Button */}
      <div className="flex justify-center mt-10">
        <Link href="/shop">
          <Button
            variant="outline"
            size="lg"
            className="rounded-full px-8 border-foreground text-foreground hover:bg-foreground hover:text-background bg-transparent"
          >
            Voir tous les produits
          </Button>
        </Link>
      </div>
    </section>
  )
}
