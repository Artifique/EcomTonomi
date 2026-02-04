"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingBag, Check } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

interface AddToCartAnimationProps {
  product: {
    id: string
    name: string
    image?: string
    price: number
  }
  onAdd: () => Promise<void>
  className?: string
}

export function AddToCartButton({ product, onAdd, className }: AddToCartAnimationProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([])

  const handleAdd = async () => {
    setIsAdding(true)
    
    // Create particles
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }))
    setParticles(newParticles)

    try {
      await onAdd()
      setIsSuccess(true)
      
      // Show toast with product image
      toast.success("Ajouté au panier !", {
        description: product.name,
        icon: product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            width={40}
            height={40}
            className="rounded"
          />
        ) : undefined,
        duration: 3000,
      })

      setTimeout(() => {
        setIsSuccess(false)
        setIsAdding(false)
        setParticles([])
      }, 2000)
    } catch (error) {
      setIsAdding(false)
      setParticles([])
      toast.error("Erreur lors de l'ajout au panier")
    }
  }

  return (
    <div className={`relative ${className}`}>
      <motion.button
        onClick={handleAdd}
        disabled={isAdding || isSuccess}
        className="relative w-full bg-foreground text-background hover:bg-foreground/90 rounded-full px-8 py-3 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center justify-center gap-2"
            >
              <Check className="h-5 w-5" />
              <span>Ajouté !</span>
            </motion.div>
          ) : isAdding ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-2"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <ShoppingBag className="h-5 w-5" />
              </motion.div>
              <span>Ajout...</span>
            </motion.div>
          ) : (
            <motion.div
              key="default"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-2"
            >
              <ShoppingBag className="h-5 w-5" />
              <span>Ajouter au panier</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Particles animation */}
        <AnimatePresence>
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-2 h-2 bg-accent rounded-full"
              initial={{
                x: "50%",
                y: "50%",
                scale: 0,
                opacity: 1,
              }}
              animate={{
                x: `${particle.x}%`,
                y: `${particle.y}%`,
                scale: [0, 1, 0],
                opacity: [1, 1, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.6,
                ease: "easeOut",
              }}
            />
          ))}
        </AnimatePresence>

        {/* Ripple effect */}
        {isAdding && (
          <motion.div
            className="absolute inset-0 bg-background/20 rounded-full"
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        )}
      </motion.button>
    </div>
  )
}

