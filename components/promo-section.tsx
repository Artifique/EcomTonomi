import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function PromoSection() {
  return (
    <section className="container mx-auto px-4 py-12 lg:py-16">
      <div className="relative overflow-hidden rounded-xl bg-accent">
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-16">
          <span className="inline-block px-4 py-1.5 mb-4 text-xs font-medium tracking-wider uppercase bg-white/20 text-foreground rounded-full">
            Temps limité
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-4 max-w-3xl text-balance">
            OFFRES MODE EXCLUSIVES
          </h2>
          <p className="text-foreground/80 text-lg lg:text-xl mb-8 max-w-xl">
            Jusqu&apos;à 50% de réduction sur les articles sélectionnés. Ne manquez pas ces offres exceptionnelles !
          </p>
          <Link href="/shop?filter=new">
            <Button
              size="lg"
              className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-8 group"
            >
              DÉCOUVRIR MAINTENANT
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-32 lg:w-48 lg:h-48 rounded-full bg-white/10 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-40 h-40 lg:w-64 lg:h-64 rounded-full bg-white/10 translate-x-1/3 translate-y-1/3" />
      </div>
    </section>
  )
}
