import { useCallback, useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export interface CustomerLocationCustomer {
  id: string
  name: string
  avatar?: string | null
  joinedDate?: string | null
}

export interface CustomerLocation {
  id: string
  city: string
  country: string
  lat: number
  lng: number
  count: number
  customers: CustomerLocationCustomer[]
  updated_at?: string
}

export function useCustomerLocations() {
  const [locations, setLocations] = useState<CustomerLocation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLocations = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from("customer_locations")
        .select("id,city,country,lat,lng,count,customers,updated_at")
        .order("count", { ascending: false })
        .limit(200)

      if (fetchError) throw fetchError

      const normalized = (data || []).map((row: any) => ({
        ...row,
        customers: Array.isArray(row.customers) ? row.customers : [],
      })) as CustomerLocation[]

      setLocations(normalized)
    } catch (e: any) {
      setError(e?.message || "Erreur lors du chargement des localisations")
      setLocations([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLocations()
  }, [fetchLocations])

  const upsertLocation = useCallback(
    async (payload: Omit<CustomerLocation, "id"> & { id?: string }) => {
      const dataToSave = {
        city: payload.city,
        country: payload.country,
        lat: payload.lat,
        lng: payload.lng,
        count: payload.count,
        customers: payload.customers ?? [],
        updated_at: new Date().toISOString(),
      }

      if (payload.id) {
        // Mise à jour d'une localisation existante
        const { error: updateError } = await supabase
          .from("customer_locations")
          .update(dataToSave)
          .eq("id", payload.id)
        
        if (updateError) throw updateError
      } else {
        // Création d'une nouvelle localisation
        const { error: insertError } = await supabase
          .from("customer_locations")
          .insert(dataToSave)
        
        if (insertError) throw insertError
      }
      
      await fetchLocations()
    },
    [fetchLocations]
  )

  const remove = useCallback(
    async (id: string) => {
      const { error: deleteError } = await supabase.from("customer_locations").delete().eq("id", id)
      if (deleteError) throw deleteError
      await fetchLocations()
    },
    [fetchLocations]
  )

  return { locations, loading, error, refetch: fetchLocations, upsertLocation, remove }
}

