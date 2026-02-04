"use client"

import { motion } from "framer-motion"

export function ProductSkeleton() {
  return (
    <div className="group">
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-secondary mb-3">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/50 to-secondary"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
          }}
        />
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-secondary rounded w-3/4 animate-pulse" />
        <div className="h-4 bg-secondary rounded w-1/2 animate-pulse" />
      </div>
    </div>
  )
}

export function ProductSkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <ProductSkeleton />
        </motion.div>
      ))}
    </div>
  )
}

