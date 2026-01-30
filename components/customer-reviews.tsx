import Image from "next/image"
import { Star } from "lucide-react"

const reviews = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop",
    rating: 5,
    comment: "Qualité exceptionnelle et livraison rapide ! Les vêtements sont parfaitement ajustés et le tissu est de qualité premium.",
  },
  {
    id: 2,
    name: "Michael Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop",
    rating: 5,
    comment: "La meilleure expérience d'achat en ligne que j'ai eue. Le service client est remarquable !",
  },
  {
    id: 3,
    name: "Emily Davis",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop",
    rating: 5,
    comment: "J'adore les designs minimalistes. Tout ce que j'ai commandé a dépassé mes attentes.",
  },
]

export function CustomerReviews() {
  return (
    <section className="container mx-auto px-4 py-12 lg:py-16">
      <div className="text-center mb-12">
        <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
          350+ Avis clients
        </h2>
        <p className="text-muted-foreground">
          Découvrez ce que nos clients disent de nous
        </p>
      </div>

      {/* Avatars */}
      <div className="flex justify-center items-center mb-10">
        <div className="flex -space-x-3">
          {reviews.map((review, index) => (
            <div
              key={review.id}
              className="relative w-12 h-12 rounded-full border-2 border-background overflow-hidden"
              style={{ zIndex: reviews.length - index }}
            >
              <Image
                src={review.avatar || "/placeholder.svg"}
                alt={review.name}
                fill
                className="object-cover"
              />
            </div>
          ))}
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent text-accent-foreground text-sm font-semibold border-2 border-background">
            +347
          </div>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-secondary rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden">
                <Image
                  src={review.avatar || "/placeholder.svg"}
                  alt={review.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">{review.name}</h4>
                <div className="flex gap-0.5">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-accent text-accent"
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              &quot;{review.comment}&quot;
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
