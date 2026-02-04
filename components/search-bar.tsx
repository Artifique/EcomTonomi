"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X, Loader2, TrendingUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useDebounce } from "@/hooks/use-debounce"
import { useProducts } from "@/hooks/use-products"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface SearchBarProps {
  className?: string
  onClose?: () => void
}

export function SearchBar({ className, onClose }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const debouncedQuery = useDebounce(query, 300)
  const { products, loading } = useProducts(undefined, debouncedQuery)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  // Filter products based on search query
  const searchResults = debouncedQuery.length > 0
    ? products.filter(product =>
        product.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(debouncedQuery.toLowerCase())
      ).slice(0, 5)
    : []

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : prev
        )
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
      } else if (e.key === "Enter" && selectedIndex >= 0) {
        e.preventDefault()
        const product = searchResults[selectedIndex]
        if (product) {
          router.push(`/product/${product.id}`)
          setIsOpen(false)
          setQuery("")
          onClose?.()
        }
      } else if (e.key === "Escape") {
        setIsOpen(false)
        setQuery("")
        onClose?.()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, selectedIndex, searchResults, router, onClose])

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: "nearest", behavior: "smooth" })
      }
    }
  }, [selectedIndex])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    setIsOpen(true)
    setSelectedIndex(-1)
  }

  const handleProductClick = (productId: string) => {
    router.push(`/product/${productId}`)
    setIsOpen(false)
    setQuery("")
    onClose?.()
  }

  const highlightText = (text: string, query: string) => {
    if (!query) return text
    const parts = text.split(new RegExp(`(${query})`, "gi"))
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-accent/30 text-foreground px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    )
  }

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          ref={inputRef}
          type="search"
          placeholder="Rechercher des produits..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          className="w-full pl-10 pr-10 bg-secondary border-0 rounded-full"
          autoComplete="off"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            onClick={() => {
              setQuery("")
              setIsOpen(false)
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && debouncedQuery.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-xl shadow-lg z-50 max-h-[400px] overflow-hidden"
          >
            {loading ? (
              <div className="p-8 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : searchResults.length > 0 ? (
              <div ref={resultsRef} className="overflow-y-auto max-h-[400px]">
                <div className="p-2">
                  {searchResults.map((product, index) => {
                    const isSelected = index === selectedIndex
                    const productImage = product.images?.[0] || "/placeholder.svg"
                    
                    return (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <button
                          onClick={() => handleProductClick(product.id)}
                          className={`w-full p-3 rounded-lg text-left transition-colors ${
                            isSelected
                              ? "bg-accent/50"
                              : "hover:bg-secondary"
                          }`}
                          onMouseEnter={() => setSelectedIndex(index)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                              <Image
                                src={productImage}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-foreground truncate">
                                {highlightText(product.name, debouncedQuery)}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                FCFA {product.price}
                              </p>
                            </div>
                            {index === 0 && (
                              <TrendingUp className="h-4 w-4 text-accent flex-shrink-0" />
                            )}
                          </div>
                        </button>
                      </motion.div>
                    )
                  })}
                </div>
                <div className="border-t border-border p-3">
                  <Link
                    href={`/shop?search=${encodeURIComponent(debouncedQuery)}`}
                    className="text-sm font-medium text-accent hover:underline flex items-center justify-center gap-2"
                    onClick={() => {
                      setIsOpen(false)
                      onClose?.()
                    }}
                  >
                    Voir tous les résultats pour "{debouncedQuery}"
                    <Search className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-muted-foreground text-sm">
                  Aucun produit trouvé pour "{debouncedQuery}"
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 -mt-2"
          onClick={() => {
            setIsOpen(false)
            onClose?.()
          }}
        />
      )}
    </div>
  )
}

