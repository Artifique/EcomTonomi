"use client"

import { useEffect, useMemo } from "react"
import { usePathname } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { useAuth } from "@/context/auth-context"

function getOrCreateSessionId() {
  if (typeof window === "undefined") return null

  const key = "tonomi_session_id"
  const existing = window.localStorage.getItem(key)
  if (existing) return existing

  const id =
    (typeof crypto !== "undefined" && "randomUUID" in crypto && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`)

  window.localStorage.setItem(key, id)
  return id
}

export function PageViewTracker() {
  const pathname = usePathname()
  const { user } = useAuth()

  const sessionId = useMemo(() => getOrCreateSessionId(), [])

  useEffect(() => {
    if (!sessionId) return
    if (!pathname) return

    // Ignorer certains chemins techniques si besoin
    if (pathname.startsWith("/_next")) return

    const ua = typeof navigator !== "undefined" ? navigator.userAgent : null

    // Fire-and-forget
    supabase
      .from("page_views")
      .insert({
        session_id: sessionId,
        path: pathname,
        user_id: user?.id ?? null,
        user_agent: ua,
      })
      .then(({ error }) => {
        // Silencieux en prod; utile en dev si besoin
        if (error && process.env.NODE_ENV === "development") {
          // eslint-disable-next-line no-console
          console.warn("PageViewTracker insert error:", error.message)
        }
      })
  }, [pathname, sessionId, user?.id])

  return null
}

