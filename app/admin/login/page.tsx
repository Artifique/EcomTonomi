"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, Loader2, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Nettoyer les espaces
    const cleanEmail = email.trim()
    const cleanPassword = password.trim()

    if (!cleanEmail || !cleanPassword) {
      toast.error("Veuillez remplir tous les champs")
      setLoading(false)
      return
    }

    try {
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 500))

      // Utiliser le service de stockage
      const { getUsers, setCurrentUser, initializeStorage } = await import('@/lib/storage')
      initializeStorage()

      const users = getUsers()
      const foundUser = users.find(u => u.email === cleanEmail && u.password === cleanPassword)

      if (!foundUser) {
        toast.error("Email ou mot de passe incorrect")
        setLoading(false)
        return
      }

      // Vérifier que l'utilisateur est admin
      if (foundUser.role !== 'admin') {
        toast.error("Accès réservé aux administrateurs")
        setLoading(false)
        return
      }

      // Stocker l'utilisateur connecté
      setCurrentUser(foundUser)

      toast.success("Connexion réussie !")
      router.push("/admin")
    } catch (error: any) {
      console.error('Login error:', error)
      toast.error(error?.message || "Erreur de connexion")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary/20 p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-card border border-border rounded-2xl shadow-xl p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Admin</h1>
            <p className="text-muted-foreground">
              Connexion au tableau de bord administrateur
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  className="pl-10 rounded-lg h-11"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Entrez votre mot de passe"
                  className="pl-10 pr-10 rounded-lg h-11"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-lg h-11 font-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                "Se connecter"
              )}
            </Button>
          </form>

          {/* Footer note */}
          <p className="text-xs text-center text-muted-foreground pt-4 border-t border-border">
            Accès réservé aux administrateurs autorisés
          </p>
        </div>
      </div>
    </div>
  )
}

