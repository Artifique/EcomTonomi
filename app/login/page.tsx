"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirection vers la page de login des visiteurs
    router.replace("/account")
  }, [router])

  return null
}

