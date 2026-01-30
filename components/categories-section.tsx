import Link from "next/link"
import Image from "next/image"

const categories = [
  {
    id: 1,
    name: "SHOES",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop",
    href: "/shop?category=SHOES",
  },
  {
    id: 2,
    name: "BAGS",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=2069&auto=format&fit=crop",
    href: "/shop?category=BAGS",
  },
  {
    id: 3,
    name: "T-SHIRT",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2080&auto=format&fit=crop",
    href: "/shop?category=T-SHIRT",
  },
  {
    id: 4,
    name: "JACKETS",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1935&auto=format&fit=crop",
    href: "/shop?category=JACKETS",
  },
  {
    id: 5,
    name: "SHORTS",
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=2070&auto=format&fit=crop",
    href: "/shop?category=SHORTS",
  },
  {
    id: 6,
    name: "NEW",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1983&auto=format&fit=crop",
    href: "/shop?filter=new",
  },
]

export function CategoriesSection() {
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
        {categories.map((category) => (
          <Link
            key={category.id}
            href={category.href}
            className="group"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-secondary">
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
        ))}
      </div>
    </section>
  )
}
