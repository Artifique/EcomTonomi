import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

const banners = [
  {
    id: 1,
    title: "Où les rêves rencontrent la couture",
    subtitle: "Découvrez les dernières tendances de la mode masculine",
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1974&auto=format&fit=crop",
    href: "/shop?category=men",
    bgColor: "bg-[#C2A8A6]",
  },
  {
    id: 2,
    title: "Styles envoûtants pour chaque femme",
    subtitle: "Pièces élégantes pour toutes les occasions",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop",
    href: "/shop?category=women",
    bgColor: "bg-[#184D6B]",
  },
]

export function PromotionalBanners() {
  return (
    <section className="container mx-auto px-4 py-6">
      <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className={`relative overflow-hidden rounded-2xl ${banner.bgColor} group`}
          >
            <div className="grid grid-cols-2 items-center min-h-[200px] lg:min-h-[240px]">
              {/* Content */}
              <div className="p-6 lg:p-8">
                <h3 className="text-xl lg:text-2xl font-bold text-white mb-2 text-balance">
                  {banner.title}
                </h3>
                <p className="text-white/80 text-sm mb-4 hidden sm:block">
                  {banner.subtitle}
                </p>
                <Link href={banner.href}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-transparent border-white text-white hover:bg-white hover:text-foreground rounded-full text-xs"
                  >
                    Acheter maintenant
                  </Button>
                </Link>
              </div>

              {/* Image */}
              <div className="relative h-full min-h-[200px] lg:min-h-[240px]">
                <Image
                  src={banner.image || "/placeholder.svg"}
                  alt={banner.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
