import { useCallback, useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export interface PageViewRow {
  created_at: string
  session_id: string
  path: string
}

export function usePageViews(rangeDays: number) {
  const [rows, setRows] = useState<PageViewRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const sinceIso = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() - Math.max(1, rangeDays))
    return d.toISOString()
  }, [rangeDays])

  const fetchViews = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from("page_views")
        .select("created_at,session_id,path")
        .gte("created_at", sinceIso)
        .order("created_at", { ascending: true })
        .limit(10000)

      if (fetchError) throw fetchError
      setRows((data || []) as PageViewRow[])
    } catch (e: any) {
      setError(e?.message || "Erreur lors du chargement des pages vues")
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [sinceIso])

  useEffect(() => {
    fetchViews()
  }, [fetchViews])

  return { pageViews: rows, loading, error, refetch: fetchViews }
}

