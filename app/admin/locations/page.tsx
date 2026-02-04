"use client"

import { useMemo, useState, useEffect } from "react"
import { MapPin, Pencil, Plus, Trash2, Loader2, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { useCustomerLocations, type CustomerLocation } from "@/hooks/use-customer-locations"
import { useCustomers } from "@/hooks/use-customers"

// Liste des pays (les plus courants pour commencer)
const COUNTRIES = [
  "Mali", "France", "Sénégal", "Côte d'Ivoire", "Burkina Faso", "Niger", "Guinée", "Bénin",
  "Togo", "Cameroun", "Gabon", "Congo", "RDC", "Madagascar", "Mauritanie", "Tchad",
  "Algérie", "Maroc", "Tunisie", "Égypte", "Nigeria", "Ghana", "Kenya", "Tanzanie",
  "Afrique du Sud", "Éthiopie", "Ouganda", "Rwanda", "Burundi", "Mozambique", "Angola",
  "Belgique", "Suisse", "Canada", "États-Unis", "Royaume-Uni", "Allemagne", "Espagne",
  "Italie", "Portugal", "Pays-Bas", "Suède", "Norvège", "Danemark", "Finlande",
  "Brésil", "Argentine", "Chili", "Colombie", "Mexique", "Inde", "Chine", "Japon",
  "Corée du Sud", "Thaïlande", "Vietnam", "Indonésie", "Malaisie", "Singapour",
  "Philippines", "Australie", "Nouvelle-Zélande", "Autre"
].sort()

// Fonction pour géocoder une ville (obtenir lat/lng)
async function geocodeCity(city: string, country: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const query = encodeURIComponent(`${city}, ${country}`)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`,
      {
        headers: {
          'User-Agent': 'Tonomi E-commerce App', // Requis par Nominatim
        },
      }
    )
    
    if (!response.ok) {
      throw new Error('Erreur de géocodage')
    }
    
    const data = await response.json()
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      }
    }
    return null
  } catch (error) {
    console.error('Erreur de géocodage:', error)
    return null
  }
}

export default function AdminLocationsPage() {
  const { locations, loading, upsertLocation, remove } = useCustomerLocations()
  const { customers, loading: customersLoading } = useCustomers()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<CustomerLocation | null>(null)
  const [geocoding, setGeocoding] = useState(false)

  const [form, setForm] = useState({
    country: "",
    city: "",
    selectedCustomerIds: [] as string[],
  })

  // Réinitialiser le formulaire
  const openForCreate = () => {
    setEditing(null)
    setForm({
      country: "",
      city: "",
      selectedCustomerIds: [],
    })
    setOpen(true)
  }

  const openForEdit = (loc: CustomerLocation) => {
    setEditing(loc)
    setForm({
      country: loc.country,
      city: loc.city,
      selectedCustomerIds: loc.customers?.map((c) => c.id) || [],
    })
    setOpen(true)
  }

  // Géocoder automatiquement quand ville et pays sont remplis
  const handleGeocode = async () => {
    if (!form.city.trim() || !form.country.trim()) {
      toast.error("Veuillez remplir la ville et le pays")
      return
    }

    setGeocoding(true)
    try {
      const coords = await geocodeCity(form.city.trim(), form.country.trim())
      if (coords) {
        toast.success(`Coordonnées trouvées: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`)
        // Les coordonnées seront utilisées lors de la sauvegarde
      } else {
        toast.error("Impossible de trouver les coordonnées pour cette ville")
      }
    } catch (error: any) {
      toast.error(error?.message || "Erreur lors du géocodage")
    } finally {
      setGeocoding(false)
    }
  }

  const onSave = async () => {
    if (!form.city.trim() || !form.country.trim()) {
      toast.error("Ville et pays sont obligatoires")
      return
    }

    if (form.selectedCustomerIds.length === 0) {
      toast.error("Veuillez sélectionner au moins un client")
      return
    }

    setGeocoding(true)
    try {
      // Géocoder la ville
      const coords = await geocodeCity(form.city.trim(), form.country.trim())
      if (!coords) {
        toast.error("Impossible de trouver les coordonnées pour cette ville. Vérifiez le nom de la ville.")
        setGeocoding(false)
        return
      }

      // Récupérer les données des clients sélectionnés
      const selectedCustomers = customers
        .filter((c) => form.selectedCustomerIds.includes(c.id))
        .map((c) => ({
          id: c.id,
          name: c.name || "Client sans nom",
          avatar: c.avatar || null,
          joinedDate: c.created_at || null,
        }))

      // Sauvegarder
      await upsertLocation({
        id: editing?.id,
        city: form.city.trim(),
        country: form.country.trim(),
        lat: coords.lat,
        lng: coords.lng,
        count: form.selectedCustomerIds.length,
        customers: selectedCustomers,
      })

      toast.success("Localisation enregistrée avec succès")
      setOpen(false)
    } catch (e: any) {
      toast.error(e?.message || "Erreur lors de l'enregistrement")
    } finally {
      setGeocoding(false)
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

  // Filtrer les clients pour la recherche
  const [customerSearch, setCustomerSearch] = useState("")
  const filteredCustomers = useMemo(() => {
    if (!customerSearch.trim()) return customers
    const searchLower = customerSearch.toLowerCase()
    return customers.filter(
      (c) =>
        c.name?.toLowerCase().includes(searchLower) ||
        c.email?.toLowerCase().includes(searchLower)
    )
  }, [customers, customerSearch])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clients dans le monde</h1>
          <p className="text-muted-foreground">
            Gérez les points affichés sur la carte. Sélectionnez simplement le pays, la ville et les clients.
          </p>
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
                    <p className="text-xs text-muted-foreground">
                      ({loc.lat.toFixed(4)}, {loc.lng.toFixed(4)})
                    </p>
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Modifier une localisation" : "Ajouter une localisation"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-6">
            {/* Pays et Ville */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Pays *</label>
                <Select value={form.country} onValueChange={(value) => setForm((p) => ({ ...p, country: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un pays" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Ville *</label>
                <Input
                  value={form.city}
                  onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                  placeholder="Ex: Bamako, Paris, Dakar..."
                />
              </div>
            </div>

            {/* Info sur le géocodage automatique */}
            <div className="p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
              <p>
                💡 Les coordonnées (latitude/longitude) seront automatiquement récupérées lors de l'enregistrement.
              </p>
            </div>

            {/* Sélection des clients */}
            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Clients *</label>
                <span className="text-xs text-muted-foreground">
                  {form.selectedCustomerIds.length} sélectionné(s)
                </span>
              </div>

              {/* Recherche de clients */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un client..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Liste des clients avec checkboxes */}
              <div className="border rounded-lg p-3 max-h-[300px] overflow-y-auto space-y-2">
                {customersLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                  </div>
                ) : filteredCustomers.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    {customerSearch ? "Aucun client trouvé" : "Aucun client disponible"}
                  </p>
                ) : (
                  filteredCustomers.map((customer) => (
                    <div
                      key={customer.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <Checkbox
                        checked={form.selectedCustomerIds.includes(customer.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setForm((p) => ({
                              ...p,
                              selectedCustomerIds: [...p.selectedCustomerIds, customer.id],
                            }))
                          } else {
                            setForm((p) => ({
                              ...p,
                              selectedCustomerIds: p.selectedCustomerIds.filter((id) => id !== customer.id),
                            }))
                          }
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{customer.name || "Client sans nom"}</p>
                        {customer.email && (
                          <p className="text-xs text-muted-foreground truncate">{customer.email}</p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {form.selectedCustomerIds.length === 0 && (
                <p className="text-xs text-destructive">Veuillez sélectionner au moins un client</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button variant="ghost" onClick={() => setOpen(false)} disabled={geocoding}>
                Annuler
              </Button>
              <Button onClick={onSave} disabled={geocoding || form.selectedCustomerIds.length === 0}>
                {geocoding ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Géocodage...
                  </>
                ) : (
                  "Enregistrer"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
