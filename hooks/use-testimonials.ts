import { useCallback, useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export type TestimonialStatus = "pending" | "approved" | "rejected"

export interface Testimonial {
  id: string
  user_id: string
  name: string | null
  avatar_url: string | null
  rating: number
  comment: string
  status: TestimonialStatus
  created_at: string
}

type FetchMode = "approved" | "all"

export function useTestimonials(mode: FetchMode = "approved") {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTestimonials = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from("testimonials")
        .select("id,user_id,name,avatar_url,rating,comment,status,created_at")
        .order("created_at", { ascending: false })
        .limit(50)

      if (mode === "approved") {
        query = query.eq("status", "approved")
      }

      const { data, error: fetchError } = await query
      if (fetchError) throw fetchError

      setItems((data || []) as Testimonial[])
    } catch (e: any) {
      setError(e?.message || "Erreur lors du chargement des témoignages")
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [mode])

  useEffect(() => {
    fetchTestimonials()
  }, [fetchTestimonials])

  const total = useMemo(() => items.length, [items.length])

  const submitTestimonial = useCallback(
    async (payload: { user_id: string; name?: string | null; avatar_url?: string | null; rating: number; comment: string }) => {
      const { error: insertError } = await supabase.from("testimonials").insert({
        user_id: payload.user_id,
        name: payload.name ?? null,
        avatar_url: payload.avatar_url ?? null,
        rating: payload.rating,
        comment: payload.comment,
        status: "pending",
      })

      if (insertError) throw insertError
      // Ne refetch pas automatiquement en mode approved (il sera pending)
      if (mode === "all") {
        await fetchTestimonials()
      }
    },
    [fetchTestimonials, mode]
  )

  const updateStatus = useCallback(
    async (id: string, status: TestimonialStatus) => {
      const { error: updateError } = await supabase.from("testimonials").update({ status }).eq("id", id)
      if (updateError) throw updateError
      await fetchTestimonials()
    },
    [fetchTestimonials]
  )

  const remove = useCallback(
    async (id: string) => {
      const { error: deleteError } = await supabase.from("testimonials").delete().eq("id", id)
      if (deleteError) throw deleteError
      await fetchTestimonials()
    },
    [fetchTestimonials]
  )

  return {
    testimonials: items,
    total,
    loading,
    error,
    refetch: fetchTestimonials,
    submitTestimonial,
    updateStatus,
    remove,
  }
}

