"use client"

"use client"

import { use, useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Minus, Plus, Star, Truck, RotateCcw, Shield, ChevronLeft, Check, ShoppingBag } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getProductById, getRelatedProducts } from "@/lib/products"
import { useCart } from "@/context/cart-context"
import { ImageGallery } from "@/components/image-gallery"
import { toast } from "sonner"

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const product = getProductById(Number(id))

  if (!product) {
    notFound()
  }

  const relatedProducts = getRelatedProducts(product.id, product.category)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main id="main-content" className="flex-1">
        <ProductDetail product={product} />
        {relatedProducts.length > 0 && (
          <RelatedProducts products={relatedProducts} />
        )}
      </main>
      <Footer />
    </div>
  )
}

function ProductDetail({ product }: { product: ReturnType<typeof getProductById> }) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState(product!.colors[0])
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const { addItem } = useCart()
  const cartButtonRef = useRef<HTMLButtonElement>(null)

  if (!product) return null

  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast.error("Veuillez sélectionner une taille")
      return
    }
    
    setIsAdding(true)
    
    // Animation "fly to cart" - créer un élément temporaire
    if (cartButtonRef.current) {
      const buttonRect = cartButtonRef.current.getBoundingClientRect()
      const flyElement = document.createElement('div')
      flyElement.style.position = 'fixed'
      flyElement.style.left = `${buttonRect.left}px`
      flyElement.style.top = `${buttonRect.top}px`
      flyElement.style.width = '40px'
      flyElement.style.height = '40px'
      flyElement.style.background = 'var(--foreground)'
      flyElement.style.borderRadius = '50%'
      flyElement.style.pointerEvents = 'none'
      flyElement.style.zIndex = '9999'
      document.body.appendChild(flyElement)

      // Animation vers l'icône panier (header)
      const cartIcon = document.querySelector('[data-cart-icon]')
      if (cartIcon) {
        const cartRect = cartIcon.getBoundingClientRect()
        flyElement.animate([
          { transform: 'translate(0, 0) scale(1)' },
          { transform: `translate(${cartRect.left - buttonRect.left}px, ${cartRect.top - buttonRect.top}px) scale(0.3)` }
        ], {
          duration: 600,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        }).onfinish = () => {
          document.body.removeChild(flyElement)
        }
      } else {
        setTimeout(() => document.body.removeChild(flyElement), 600)
      }
    }

    // Simuler un délai pour l'animation
    await new Promise(resolve => setTimeout(resolve, 300))
    
    addItem({
      product,
      quantity,
      size: selectedSize,
      color: selectedColor,
    })
    
    toast.success("Produit ajouté au panier !", {
      duration: 3000,
    })
    
    setIsAdding(false)
  }

  return (
    <section className="container mx-auto px-4 py-6 lg:py-12">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Retour à la boutique
        </Link>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Images avec nouvelle galerie */}
        <ImageGallery
          images={product.images}
          productName={product.name}
          isNew={product.isNew}
          hasSale={!!product.originalPrice}
        />

        {/* Product Info */}
        <div className="lg:py-4">
          <div className="mb-4">
            <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
              {product.category}
            </p>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-4 h-4",
                      i < Math.floor(product.rating)
                        ? "fill-accent text-accent"
                        : "fill-muted text-muted"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviews} avis)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-foreground">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-muted-foreground mb-6 leading-relaxed">
            {product.description}
          </p>

          {/* Color Selection avec animations */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-3">
              Couleur : <motion.span 
                key={selectedColor.name}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-normal text-muted-foreground"
              >
                {selectedColor.name}
              </motion.span>
            </label>
            <div className="flex gap-2">
              {product.colors.map((color) => (
                <motion.button
                  key={color.name}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "w-10 h-10 rounded-full border-2 transition-all relative",
                    selectedColor.name === color.name
                      ? "border-foreground ring-2 ring-foreground ring-offset-2"
                      : "border-muted hover:border-muted-foreground"
                  )}
                  style={{ backgroundColor: color.value }}
                  aria-label={color.name}
                  aria-pressed={selectedColor.name === color.name}
                >
                  {selectedColor.name === color.name && (
                    <motion.div
                      layoutId="colorSelection"
                      className="absolute inset-0 rounded-full border-2 border-foreground ring-2 ring-foreground ring-offset-2"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Size Selection avec animations */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-foreground">
                Taille
              </label>
              <Link href="/size-guide" className="text-sm text-muted-foreground hover:text-foreground underline">
                Guide des tailles
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => {
                const isSelected = selectedSize === size
                return (
                  <motion.button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      "min-w-[48px] h-12 px-4 rounded-lg border text-sm font-medium transition-colors relative",
                      isSelected
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-transparent text-foreground hover:border-foreground"
                    )}
                    aria-pressed={isSelected}
                  >
                    {size}
                    {isSelected && (
                      <motion.div
                        layoutId="sizeSelection"
                        className="absolute inset-0 rounded-lg border-2 border-foreground bg-foreground"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        style={{ zIndex: -1 }}
                      />
                    )}
                  </motion.button>
                )
              })}
            </div>
            {!selectedSize && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500 mt-2"
              >
                Veuillez sélectionner une taille
              </motion.p>
            )}
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-3">
              Quantité
            </label>
            <div className="inline-flex items-center border border-border rounded-lg">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 hover:bg-secondary transition-colors"
                aria-label="Diminuer la quantité"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="p-3 hover:bg-secondary transition-colors"
                aria-label="Augmenter la quantité"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Actions avec animation fly to cart */}
          <div className="flex gap-3 mb-8">
            <Button
              ref={cartButtonRef}
              size="lg"
              loading={isAdding}
              className="flex-1 rounded-full"
              disabled={!selectedSize || isAdding}
              onClick={handleAddToCart}
            >
              {isAdding ? (
                "Ajout en cours..."
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Ajouter au panier
                </>
              )}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className={cn(
                "rounded-full px-4 border-border",
                isFavorite && "bg-red-50 border-red-200"
              )}
              onClick={() => setIsFavorite(!isFavorite)}
              aria-label={isFavorite ? "Retirer de la liste de souhaits" : "Ajouter à la liste de souhaits"}
            >
              <Heart
                className={cn(
                  "w-5 h-5",
                  isFavorite ? "fill-red-500 text-red-500" : ""
                )}
              />
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 py-6 border-t border-border">
            <div className="text-center">
              <Truck className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Livraison gratuite</p>
            </div>
            <div className="text-center">
              <RotateCcw className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Retours faciles</p>
            </div>
            <div className="text-center">
              <Shield className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Paiement sécurisé</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function RelatedProducts({ products }: { products: ReturnType<typeof getRelatedProducts> }) {
  return (
    <section className="container mx-auto px-4 py-12 lg:py-16 border-t border-border">
      <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-8">
        Vous pourriez aussi aimer
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
        {products.map((product) => (
          <Link key={product.id} href={`/product/${product.id}`} className="group">
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
            </div>
            <h3 className="font-medium text-foreground text-sm lg:text-base mb-1 truncate">
              {product.name}
            </h3>
            <p className="text-foreground font-semibold">${product.price}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
