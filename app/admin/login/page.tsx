"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import Image from "next/image"
import { motion } from "framer-motion"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { login, user, loading: authLoading } = useAuth()

  useEffect(() => {
    // Si l'utilisateur est déjà connecté et est un admin, rediriger
    if (user && user.role === 'admin') {
      router.push("/admin")
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const cleanEmail = email.trim()
    const cleanPassword = password.trim()

    if (!cleanEmail || !cleanPassword) {
      toast.error("Veuillez remplir tous les champs")
      setLoading(false)
      return
    }

    const { success, error } = await login(cleanEmail, cleanPassword)

    if (success) {
      // Le useEffect gérera la redirection si l'utilisateur est admin.
      // Nous devons attendre que l'état de l'utilisateur soit mis à jour.
      // Une vérification supplémentaire peut être faite ici si nécessaire.
      toast.success("Vérification en cours...")
    } else {
      toast.error(error || "Email ou mot de passe incorrect")
    }

    setLoading(false)
  }
  
  // Un petit effet pour vérifier le rôle après la mise à jour de l'utilisateur
  useEffect(() => {
    if (!authLoading && user) {
        if(user.role === 'admin') {
            toast.success("Connexion réussie ! Redirection...")
            router.push("/admin")
        } else {
            toast.error("Accès réservé aux administrateurs")
        }
    }
  }, [user, authLoading, router])


  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4">
      {/* Background sombre avec gradients modernes */}
      <div className="absolute inset-0 bg-gradient-to-br from-foreground via-foreground/98 to-foreground/95" />
      
      {/* Overlay avec pattern subtil */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.03)_1px,transparent_0)] bg-[length:50px_50px]" />
      
      {/* Grille de fond subtile */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Orbes animés colorés pour la profondeur */}
      <motion.div
        className="absolute top-0 left-0 w-[700px] h-[700px] bg-accent/25 rounded-full blur-[140px]"
        animate={{
          x: [0, 120, 0],
          y: [0, 180, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent-blue/25 rounded-full blur-[120px]"
        animate={{
          x: [0, -100, 0],
          y: [0, -120, 0],
          scale: [1, 1.4, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-rose/20 rounded-full blur-[100px]"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Contenu principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-card/90 backdrop-blur-2xl border border-border/30 rounded-xl shadow-2xl p-8 space-y-8 relative overflow-hidden"
        >
          {/* Bordure lumineuse animée */}
          <motion.div
            className="absolute inset-0 rounded-xl opacity-50"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--accent) / 0.3), hsl(var(--accent-blue) / 0.3), hsl(var(--accent-rose) / 0.3))',
              backgroundSize: '200% 200%',
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <div className="absolute inset-[1px] rounded-xl bg-card/95 backdrop-blur-2xl" />

          {/* Contenu avec z-index pour être au-dessus */}
          <div className="relative z-10">
            {/* Logo avec animation */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex justify-center mb-3"
              >
                <div className="inline-block cursor-default">
                  <Image
                    src="/logo.png"
                    alt="Tonomi Logo"
                    width={280}
                    height={130}
                    className="h-32 md:h-40 w-auto drop-shadow-2xl pointer-events-none"
                    priority
                  />
                </div>
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-muted-foreground text-sm md:text-base font-medium -mt-1 mb-8"
              >
                Connexion au tableau de bord administrateur
              </motion.p>
            </motion.div>

            {/* Formulaire avec animations */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="space-y-6 mt-2"
              onSubmit={handleSubmit}
            >
              {/* Champ Email */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="space-y-2.5"
              >
                <Label htmlFor="email" className="text-sm font-semibold text-foreground">
                  E-mail
                </Label>
                <motion.div
                  className="relative group"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors z-10" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    className="pl-12 pr-4 rounded-xl h-12 border-2 border-border/40 bg-background/80 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/30 transition-all duration-200"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </motion.div>
              </motion.div>

              {/* Champ Mot de passe */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="space-y-2.5"
              >
                <Label htmlFor="password" className="text-sm font-semibold text-foreground">
                  Mot de passe
                </Label>
                <motion.div
                  className="relative group"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors z-10" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Entrez votre mot de passe"
                    className="pl-12 pr-12 rounded-xl h-12 border-2 border-border/40 bg-background/80 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/30 transition-all duration-200"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent transition-colors z-10"
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    disabled={loading}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </motion.button>
                </motion.div>
              </motion.div>

              {/* Bouton de connexion */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="pt-2"
              >
                <Button
                  type="submit"
                  size="lg"
                  disabled={loading || authLoading}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl h-12 font-semibold text-base shadow-lg hover:shadow-xl hover:shadow-accent/20 transition-all duration-200 relative overflow-hidden group"
                >
                  <motion.span
                    className="relative z-10 flex items-center justify-center"
                    initial={false}
                    animate={loading || authLoading ? { opacity: 0.8 } : { opacity: 1 }}
                  >
                    {loading || authLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Connexion en cours...
                      </>
                    ) : (
                      "Se connecter"
                    )}
                  </motion.span>
                  
                  {/* Effet de brillance au hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full"
                    transition={{ duration: 0.7 }}
                  />
                </Button>
              </motion.div>
            </motion.form>

            {/* Footer */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="text-xs text-center text-muted-foreground pt-6 mt-6 border-t border-border/30"
            >
              Accès réservé aux administrateurs autorisés
            </motion.p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
