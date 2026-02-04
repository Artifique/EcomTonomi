"use client"

import { useMemo, useState } from "react"
import { MapPin, Pencil, Plus, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"
import { useCustomerLocations, type CustomerLocation } from "@/hooks/use-customer-locations"

function safeParseCustomers(input: string): CustomerLocation["customers"] {
  if (!input.trim()) return []
  try {
    const parsed = JSON.parse(input)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((x) => x && typeof x === "object")
      .map((x: any) => ({
        id: String(x.id ?? ""),
        name: String(x.name ?? ""),
        avatar: x.avatar ? String(x.avatar) : null,
        joinedDate: x.joinedDate ? String(x.joinedDate) : null,
      }))
      .filter((x) => x.id && x.name)
  } catch {
    return []
  }
}

export default function AdminLocationsPage() {
  const { locations, loading, upsertLocation, remove } = useCustomerLocations()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<CustomerLocation | null>(null)

  const initial = useMemo(
    () => ({
      city: editing?.city || "",
      country: editing?.country || "",
      lat: editing?.lat?.toString?.() || "",
      lng: editing?.lng?.toString?.() || "",
      count: editing?.count?.toString?.() || "0",
      customersJson: editing ? JSON.stringify(editing.customers || [], null, 2) : "[]",
    }),
    [editing]
  )

  const [form, setForm] = useState(initial)

  // réinitialiser le form quand on ouvre/édite
  const openForCreate = () => {
    setEditing(null)
    setForm({
      city: "",
      country: "",
      lat: "",
      lng: "",
      count: "0",
      customersJson: "[]",
    })
    setOpen(true)
  }

  const openForEdit = (loc: CustomerLocation) => {
    setEditing(loc)
    setForm({
      city: loc.city,
      country: loc.country,
      lat: String(loc.lat),
      lng: String(loc.lng),
      count: String(loc.count),
      customersJson: JSON.stringify(loc.customers || [], null, 2),
    })
    setOpen(true)
  }

  const onSave = async () => {
    const lat = Number(form.lat)
    const lng = Number(form.lng)
    const count = Math.max(0, Number(form.count) || 0)
    if (!form.city.trim() || !form.country.trim()) {
      toast.error("Ville et pays sont obligatoires")
      return
    }
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      toast.error("Latitude / longitude invalides")
      return
    }

    const customers = safeParseCustomers(form.customersJson)

    try {
      await upsertLocation({
        id: editing?.id,
        city: form.city.trim(),
        country: form.country.trim(),
        lat,
        lng,
        count,
        customers,
      })
      toast.success("Localisation enregistrée")
      setOpen(false)
    } catch (e: any) {
      toast.error(e?.message || "Erreur lors de l'enregistrement")
    }
  }

  const onDelete = async (id: string) => {
    try {
      await remove(id)
      toast.success("Localisation supprimée")
    } catch (e: any) {
      toast.error(e?.message || "Erreur lors de la suppression")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clients dans le monde</h1>
          <p className="text-muted-foreground">Gérez les points affichés sur la carte de la page d'accueil.</p>
        </div>
        <Button className="rounded-full gap-2" onClick={openForCreate}>
          <Plus className="w-4 h-4" />
          Ajouter une ville
        </Button>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Localisations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <div className="text-sm text-muted-foreground">Chargement...</div>
          ) : locations.length === 0 ? (
            <div className="text-sm text-muted-foreground">Aucune localisation. Ajoutez votre première ville.</div>
          ) : (
            locations.map((loc) => (
              <div key={loc.id} className="p-4 rounded-xl border bg-background flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <p className="font-semibold truncate">
                      {loc.city}, {loc.country}
                    </p>
                    <p className="text-xs text-muted-foreground">({loc.lat}, {loc.lng})</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {loc.count} client(s) • {loc.customers?.length || 0} fiche(s) client
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button size="sm" variant="outline" className="gap-2" onClick={() => openForEdit(loc)}>
                    <Pencil className="w-4 h-4" />
                    Modifier
                  </Button>
                  <Button size="sm" variant="destructive" className="gap-2" onClick={() => onDelete(loc.id)}>
                    <Trash2 className="w-4 h-4" />
                    Supprimer
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <span />
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Modifier une localisation" : "Ajouter une localisation"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="grid gap-2">
                <p className="text-sm font-medium">Ville</p>
                <Input value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} />
              </div>
              <div className="grid gap-2">
                <p className="text-sm font-medium">Pays</p>
                <Input value={form.country} onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))} />
              </div>
              <div className="grid gap-2">
                <p className="text-sm font-medium">Latitude</p>
                <Input value={form.lat} onChange={(e) => setForm((p) => ({ ...p, lat: e.target.value }))} />
              </div>
              <div className="grid gap-2">
                <p className="text-sm font-medium">Longitude</p>
                <Input value={form.lng} onChange={(e) => setForm((p) => ({ ...p, lng: e.target.value }))} />
              </div>
              <div className="grid gap-2">
                <p className="text-sm font-medium">Nombre de clients</p>
                <Input value={form.count} onChange={(e) => setForm((p) => ({ ...p, count: e.target.value }))} />
              </div>
            </div>

            <div className="grid gap-2">
              <p className="text-sm font-medium">Clients (JSON)</p>
              <Textarea
                value={form.customersJson}
                onChange={(e) => setForm((p) => ({ ...p, customersJson: e.target.value }))}
                rows={8}
                placeholder='[{"id":"1","name":"Marie","avatar":null,"joinedDate":"2024-01-10"}]'
              />
              <p className="text-xs text-muted-foreground">
                Optionnel. Sert au contenu du modal sur la carte (liste des clients par ville).
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              <Button onClick={onSave}>Enregistrer</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

