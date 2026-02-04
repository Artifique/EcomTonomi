"use client"

import Link from "next/link"
import Image from "next/image"
import { useCategories } from "@/hooks/use-categories"
import { Loader2 } from "lucide-react"
import { ScrollAnimation } from "@/components/scroll-animation"

export function CategoriesSection() {
  const { categories, loading, error } = useCategories()

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-12 lg:py-16 text-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </section>
    )
  }

  if (error) {
    return (
      <section className="container mx-auto px-4 py-12 lg:py-16 text-center">
        <p className="text-red-500">Erreur lors du chargement des catégories: {error}</p>
      </section>
    )
  }

  // Filter out categories that are not active or have no name/slug
  const activeCategories = categories.filter(cat => cat.is_active && cat.name && cat.slug);

  return (
    <section className="container mx-auto px-4 py-12 lg:py-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
          Parcourir par catégories
        </h2>
        <Link
          href="/shop"
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Voir tout
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {activeCategories.map((category, index) => (
          <ScrollAnimation
            key={category.id}
            delay={index * 0.1}
            direction="up"
          >
            <Link
              href={`/shop?category=${category.slug}`}
              className="group block focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden bg-secondary">
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  fill
                  className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <span className="text-white text-sm font-semibold tracking-wide">
                    {category.name}
                  </span>
                </div>
              </div>
            </Link>
          </ScrollAnimation>
        ))}
      </div>
    </section>
  )
}
