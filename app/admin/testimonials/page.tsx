"use client"

import { useMemo, useState } from "react"
import { Check, Trash2, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { useTestimonials, type TestimonialStatus } from "@/hooks/use-testimonials"

export default function AdminTestimonialsPage() {
  const { testimonials, loading, updateStatus, remove } = useTestimonials("all")
  const [filter, setFilter] = useState<TestimonialStatus | "all">("pending")

  const filtered = useMemo(() => {
    if (filter === "all") return testimonials
    return testimonials.filter((t) => t.status === filter)
  }, [filter, testimonials])

  const onApprove = async (id: string) => {
    try {
      await updateStatus(id, "approved")
      toast.success("Témoignage approuvé")
    } catch (e: any) {
      toast.error(e?.message || "Erreur lors de l'approbation")
    }
  }

  const onReject = async (id: string) => {
    try {
      await updateStatus(id, "rejected")
      toast.success("Témoignage rejeté")
    } catch (e: any) {
      toast.error(e?.message || "Erreur lors du rejet")
    }
  }

  const onDelete = async (id: string) => {
    try {
      await remove(id)
      toast.success("Témoignage supprimé")
    } catch (e: any) {
      toast.error(e?.message || "Erreur lors de la suppression")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Témoignages</h1>
          <p className="text-muted-foreground">Approuvez ou rejetez les avis clients avant publication.</p>
        </div>

        <div className="flex gap-2">
          {[
            { key: "pending", label: "En attente" },
            { key: "approved", label: "Approuvés" },
            { key: "rejected", label: "Rejetés" },
            { key: "all", label: "Tous" },
          ].map((t) => (
            <Button
              key={t.key}
              variant={filter === (t.key as any) ? "default" : "outline"}
              className="rounded-full"
              onClick={() => setFilter(t.key as any)}
            >
              {t.label}
            </Button>
          ))}
        </div>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Liste</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <div className="text-sm text-muted-foreground">Chargement...</div>
          ) : filtered.length === 0 ? (
            <div className="text-sm text-muted-foreground">Aucun témoignage pour ce filtre.</div>
          ) : (
            filtered.map((t) => (
              <div key={t.id} className="p-4 rounded-xl border bg-background flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold truncate">{t.name || "Client"}</p>
                      <Badge variant="secondary" className="capitalize">
                        {t.status}
                      </Badge>
                      <Badge variant="outline">{t.rating}/5</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(t.created_at).toLocaleString("fr-FR")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {t.status !== "approved" && (
                      <Button size="sm" className="gap-2" onClick={() => onApprove(t.id)}>
                        <Check className="w-4 h-4" />
                        Approuver
                      </Button>
                    )}
                    {t.status !== "rejected" && (
                      <Button size="sm" variant="outline" className="gap-2" onClick={() => onReject(t.id)}>
                        <X className="w-4 h-4" />
                        Rejeter
                      </Button>
                    )}
                    <Button size="sm" variant="destructive" className="gap-2" onClick={() => onDelete(t.id)}>
                      <Trash2 className="w-4 h-4" />
                      Supprimer
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{t.comment}</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}

