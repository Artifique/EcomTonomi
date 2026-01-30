"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { useSwipeable } from "react-swipeable"

const heroSlides = [
  {
    id: 1,
    badge: "Nouvelle Collection 2026",
    title: "Arrivée estivale de la collection",
    description: "Découvrez une mode de qualité qui reflète votre style et rend chaque jour agréable.",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
    cta: "DÉCOUVRIR LES PRODUITS",
    link: "/shop",
  },
  {
    id: 2,
    badge: "Édition Limitée",
    title: "Collection Mode Premium",
    description: "Élevez votre garde-robe avec nos pièces premium exclusives conçues pour le mode de vie moderne.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop",
    cta: "ACHETER MAINTENANT",
    link: "/shop",
  },
  {
    id: 3,
    badge: "Soldes jusqu'à 50%",
    title: "Soldes de fin de saison",
    description: "Ne manquez pas nos offres exceptionnelles. Achetez maintenant et économisez sur vos articles de mode préférés.",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2070&auto=format&fit=crop",
    cta: "VOIR LES SOLDES",
    link: "/shop",
  },
]

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Auto-play avec pause au hover
  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isPaused])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const swipeHandlers = useSwipeable({
    onSwipedLeft: nextSlide,
    onSwipedRight: prevSlide,
    trackMouse: true,
  })

  const currentSlideData = heroSlides[currentSlide]

  return (
    <section className="container mx-auto px-4 py-6 lg:py-8">
      <div
        className="relative overflow-hidden rounded-3xl bg-secondary"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        {...swipeHandlers}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="grid lg:grid-cols-2 gap-8 items-center"
          >
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="p-8 lg:p-12 xl:p-16 relative z-10"
            >
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="inline-block px-4 py-1.5 mb-4 text-xs font-medium tracking-wider uppercase bg-accent/20 text-foreground rounded-full"
              >
                {currentSlideData.badge}
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-foreground mb-6 text-balance"
              >
                {currentSlideData.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-muted-foreground text-lg lg:text-xl max-w-md mb-8 text-pretty"
              >
                {currentSlideData.description}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <Link href={currentSlideData.link}>
                  <Button
                    size="lg"
                    className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-8 group"
                  >
                    {currentSlideData.cta}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Image avec Ken Burns effect */}
            <motion.div
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative h-[400px] lg:h-[500px] xl:h-[600px] overflow-hidden"
            >
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0"
              >
                <Image
                  src={currentSlideData.image}
                  alt={currentSlideData.title}
                  fill
                  className="object-cover object-center"
                  priority={currentSlide === 0}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors shadow-lg"
          aria-label="Slide précédent"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors shadow-lg"
          aria-label="Slide suivant"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Indicateurs */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`
                h-2 rounded-full transition-all duration-300
                ${index === currentSlide ? 'w-8 bg-foreground' : 'w-2 bg-foreground/40 hover:bg-foreground/60'}
              `}
              aria-label={`Aller au slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
