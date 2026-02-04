"use client"

import Image from "next/image"
import { Star } from "lucide-react"
import { AnimatedCounter } from "@/components/animated-counter"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useAuth } from "@/context/auth-context"
import { useTestimonials } from "@/hooks/use-testimonials"
import { useEffect, useMemo, useState } from "react"

export function CustomerReviews() {
  const { user } = useAuth()
  const { testimonials, loading, submitTestimonial } = useTestimonials("approved")

  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [rating, setRating] = useState<number>(5)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const totalReviews = testimonials.length
  const avatars = useMemo(() => testimonials.slice(0, 3), [testimonials])

  useEffect(() => {
    if (!open) return
    const fallbackName = user?.name || user?.email?.split("@")[0] || ""
    setName((prev) => (prev ? prev : fallbackName))
  }, [open, user?.email, user?.name])

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Veuillez vous connecter pour laisser un témoignage")
      return
    }
    const trimmed = comment.trim()
    if (!trimmed || trimmed.length < 10) {
      toast.error("Votre message doit contenir au moins 10 caractères")
      return
    }
    if (rating < 1 || rating > 5) {
      toast.error("Veuillez sélectionner une note entre 1 et 5")
      return
    }

    try {
      setSubmitting(true)
      await submitTestimonial({
        user_id: user.id,
        name: name.trim() || user.name || user.email || null,
        avatar_url: (user.user_metadata as any)?.avatar_url ?? null,
        rating,
        comment: trimmed,
      })
      toast.success("Merci ! Votre témoignage est en attente de validation.")
      setOpen(false)
      setRating(5)
      setComment("")
    } catch (e: any) {
      toast.error(e?.message || "Erreur lors de l'envoi du témoignage")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="container mx-auto px-4 py-12 lg:py-16">
      <div className="text-center mb-12">
        <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
          <AnimatedCounter value={totalReviews} prefix="" suffix="+ Avis clients" />
        </h2>
        <p className="text-muted-foreground">
          Découvrez ce que nos clients disent de nous
        </p>
        <div className="mt-6 flex justify-center">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full">Laisser un témoignage</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Laisser un témoignage</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Votre note</p>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => {
                      const star = i + 1
                      const active = star <= rating
                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 rounded focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          aria-label={`Donner ${star} étoile${star > 1 ? "s" : ""}`}
                        >
                          <Star className={active ? "w-5 h-5 fill-accent text-accent" : "w-5 h-5 text-muted-foreground"} />
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="grid gap-2">
                  <p className="text-sm font-medium text-foreground">Nom</p>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Votre nom" />
                </div>

                <div className="grid gap-2">
                  <p className="text-sm font-medium text-foreground">Message</p>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Partagez votre expérience..."
                    rows={4}
                  />
                </div>

                {!user && (
                  <p className="text-sm text-muted-foreground">
                    Vous devez être connecté pour envoyer un témoignage.
                  </p>
                )}

                <div className="flex justify-end gap-2">
                  <Button variant="ghost" onClick={() => setOpen(false)} disabled={submitting}>
                    Annuler
                  </Button>
                  <Button onClick={handleSubmit} disabled={submitting}>
                    {submitting ? "Envoi..." : "Envoyer"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Avatars */}
      <div className="flex justify-center items-center mb-10">
        <div className="flex -space-x-3">
          {avatars.map((review, index) => (
            <div
              key={review.id}
              className="relative w-12 h-12 rounded-full border-2 border-background overflow-hidden"
              style={{ zIndex: avatars.length - index }}
            >
              <Image
                src={review.avatar_url || "/placeholder-user.jpg"}
                alt={review.name || "Client"}
                fill
                className="object-cover"
              />
            </div>
          ))}
          {totalReviews > avatars.length && (
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent text-accent-foreground text-sm font-semibold border-2 border-background">
              +{Math.max(0, totalReviews - avatars.length)}
            </div>
          )}
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-secondary rounded-xl p-6 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-muted" />
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-muted rounded" />
                  <div className="h-4 w-24 bg-muted rounded" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-muted rounded" />
                <div className="h-4 w-5/6 bg-muted rounded" />
                <div className="h-4 w-2/3 bg-muted rounded" />
              </div>
            </div>
          ))
        ) : testimonials.length === 0 ? (
          <div className="md:col-span-3 text-center text-muted-foreground py-6">
            Aucun témoignage pour le moment. Soyez le premier à partager votre avis.
          </div>
        ) : (
          testimonials.slice(0, 6).map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
            className="bg-secondary rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden">
                <Image
                  src={review.avatar_url || "/placeholder-user.jpg"}
                  alt={review.name || "Client"}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">{review.name || "Client"}</h4>
                <div className="flex gap-0.5">
                  {Array.from({ length: review.rating }).map((_, i) => (
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
          </motion.div>
          ))
        )}
      </div>
    </section>
  )
}
