"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Heart, SlidersHorizontal, X } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { products } from "@/lib/products"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const categories = ["ALL", "JACKETS", "T-SHIRT", "SHOES", "SHORTS", "BAGS"]
const sortOptions = [
  { value: "featured", label: "En vedette" },
  { value: "newest", label: "Plus récents" },
  { value: "price-low", label: "Prix : croissant" },
  { value: "price-high", label: "Prix : décroissant" },
]

export default function ShopPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const categoryParam = searchParams.get("category")?.toUpperCase() || "ALL"
  const filterParam = searchParams.get("filter")
  
  const [selectedCategory, setSelectedCategory] = useState(categoryParam)
  const [sortBy, setSortBy] = useState("featured")
  const [favorites, setFavorites] = useState<number[]>([])
  const [showNewOnly, setShowNewOnly] = useState(filterParam === "new")
  
  // Update state when URL params change
  useEffect(() => {
    const cat = searchParams.get("category")?.toUpperCase() || "ALL"
    const filter = searchParams.get("filter")
    setSelectedCategory(cat)
    setShowNewOnly(filter === "new")
  }, [searchParams])

  // Filter products by category and new arrivals
  let filteredProducts = selectedCategory === "ALL"
    ? products
    : products.filter((product) => product.category === selectedCategory)
  
  if (showNewOnly) {
    filteredProducts = filteredProducts.filter((product) => product.isNew)
  }
  
  // Function to update category and URL
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    const params = new URLSearchParams(searchParams.toString())
    if (category === "ALL") {
      params.delete("category")
    } else {
      params.set("category", category)
    }
    router.push(`/shop?${params.toString()}`)
  }
  
  const clearFilters = () => {
    setSelectedCategory("ALL")
    setShowNewOnly(false)
    router.push("/shop")
  }

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "newest":
        return b.id - a.id
      default:
        return 0
    }
  })

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main id="main-content" className="flex-1">
        <div className="container mx-auto px-4 py-6 lg:py-12">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
              Tous les produits
            </h1>
            <p className="text-muted-foreground">
              {sortedProducts.length} produit{sortedProducts.length > 1 ? 's' : ''}
            </p>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            {/* Categories - Desktop */}
            <div className="hidden md:flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryChange(category)}
                  className={cn(
                    "rounded-full text-xs",
                    selectedCategory === category
                      ? "bg-foreground text-background"
                      : "bg-transparent border-border text-foreground hover:bg-secondary"
                  )}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Mobile Filter Button */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full bg-transparent border-border"
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filtres
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px]">
                <SheetHeader>
                  <SheetTitle>Filtres</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  <div>
                    <h3 className="font-medium text-foreground mb-3">Catégorie</h3>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <Button
                          key={category}
                          variant={selectedCategory === category ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleCategoryChange(category)}
                          className={cn(
                            "rounded-full text-xs",
                            selectedCategory === category
                              ? "bg-foreground text-background"
                              : "bg-transparent border-border text-foreground"
                          )}
                        >
                          {category}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-3">Trier par</h3>
                    <div className="space-y-2">
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setSortBy(option.value)}
                          className={cn(
                            "block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                            sortBy === option.value
                              ? "bg-foreground text-background"
                              : "text-foreground hover:bg-secondary"
                          )}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Sort - Desktop */}
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Trier par :</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm bg-transparent border border-border rounded-full px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(selectedCategory !== "ALL" || showNewOnly) && (
            <div className="flex items-center gap-2 mb-6">
              <span className="text-sm text-muted-foreground">Filtres actifs :</span>
              {selectedCategory !== "ALL" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCategoryChange("ALL")}
                  className="rounded-full bg-transparent border-border text-foreground text-xs"
                >
                  {selectedCategory}
                  <X className="w-3 h-3 ml-1" />
                </Button>
              )}
              {showNewOnly && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowNewOnly(false)
                    const params = new URLSearchParams(searchParams.toString())
                    params.delete("filter")
                    router.push(`/shop?${params.toString()}`)
                  }}
                  className="rounded-full bg-transparent border-border text-foreground text-xs"
                >
                  Nouveautés
                  <X className="w-3 h-3 ml-1" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground text-xs hover:text-foreground"
              >
                Tout effacer
              </Button>
            </div>
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {sortedProducts.map((product) => (
              <div key={product.id} className="group">
                <Link href={`/product/${product.id}`}>
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-secondary mb-3">
                    <Image
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.isNew && (
                      <span className="absolute top-3 left-3 px-2 py-1 text-[10px] font-semibold tracking-wider uppercase bg-accent text-accent-foreground rounded-full">
                        Nouveau
                      </span>
                    )}
                    {product.originalPrice && (
                      <span className="absolute top-3 left-3 px-2 py-1 text-[10px] font-semibold tracking-wider uppercase bg-red-500 text-white rounded-full">
                        Promo
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        toggleFavorite(product.id)
                      }}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
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
                  <div className="flex items-center gap-2">
                    <p className="text-foreground font-semibold">${product.price}</p>
                    {product.originalPrice && (
                      <p className="text-muted-foreground text-sm line-through">
                        ${product.originalPrice}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
