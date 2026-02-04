"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff, Mail, Lock, Loader2, Sparkles, ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/auth-context"
import { toast } from "sonner"
import Image from "next/image"

// Composant de particules animées
function FloatingParticles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-br from-accent/30 to-accent-rose/20 blur-sm"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

// Formes géométriques animées
function AnimatedShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Cercle doré animé */}
      <motion.div
        className="absolute top-20 right-20 w-64 h-64 rounded-full bg-gradient-to-br from-accent/20 to-[#DCB265]/5 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      
      {/* Forme rose animée */}
      <motion.div
        className="absolute bottom-20 left-20 w-96 h-96 rounded-full bg-gradient-to-br from-[#C2A8A6]/20 to-accent-rose/5 blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Forme bleue animée */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gradient-to-br from-[#184D6B]/20 to-[#184D6B]/5 blur-3xl"
        animate={{
          scale: [1, 1.4, 1],
          x: [0, 50, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  )
}

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { user } = useAuth()

  // Rediriger si déjà connecté
  useEffect(() => {
    if (user) {
      router.push("/account/dashboard")
    }
  }, [user, router])

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-gradient-to-br from-[#F8F7F4] via-white to-[#F8F7F4]">
      {/* Background animé */}
      <AnimatedShapes />
      <FloatingParticles />

      {/* Split screen layout */}
      <div className="w-full lg:grid lg:grid-cols-2">
        {/* Côté gauche - Visuel animé */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hidden lg:flex flex-col items-center justify-center p-12 relative z-10"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
            className="text-center space-y-6 max-w-md"
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="inline-block"
            >
              <div className="w-24 h-24 mx-auto mb-8 rounded-xl bg-gradient-to-br from-accent to-accent-rose p-1 shadow-2xl">
                <div className="w-full h-full rounded-xl bg-foreground flex items-center justify-center">
                  <Sparkles className="w-12 h-12 text-accent" />
                </div>
              </div>
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
              className="text-5xl font-bold text-foreground leading-tight"
            >
              Bienvenue sur{" "}
              <span className="bg-gradient-to-r from-accent to-accent-rose bg-clip-text text-transparent">
                EcomTonomi
              </span>
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6, ease: "easeOut" }}
              className="text-lg text-muted-foreground leading-relaxed"
            >
              Découvrez une expérience d'achat exceptionnelle avec notre collection de mode premium
            </motion.p>

            {/* Features animées */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6, ease: "easeOut" }}
              className="space-y-4 mt-8"
            >
              {[
                "Livraison rapide et sécurisée",
                "Paiement 100% sécurisé",
                "Retours gratuits sous 30 jours",
              ].map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1 + index * 0.1, duration: 0.5, ease: "easeOut" }}
                  className="flex items-center gap-3 text-left"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent to-accent-rose flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-foreground" />
                  </div>
                  <span className="text-muted-foreground">{feature}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Côté droit - Formulaire */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center justify-center p-6 lg:p-12 relative z-10"
        >
          <div className="w-full max-w-md relative">
            {/* Formes animées autour du container */}
            <div className="absolute -inset-1 rounded-xl opacity-75">
              <motion.div
                className="absolute top-0 left-0 w-32 h-32 rounded-full bg-gradient-to-br from-accent/30 to-transparent blur-2xl"
                animate={{
                  x: [0, 20, 0],
                  y: [0, 20, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute bottom-0 right-0 w-40 h-40 rounded-full bg-gradient-to-tl from-accent-rose/30 to-transparent blur-2xl"
                animate={{
                  x: [0, -20, 0],
                  y: [0, -20, 0],
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute top-1/2 right-0 w-24 h-24 rounded-full bg-gradient-to-l from-accent-blue/20 to-transparent blur-xl"
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </div>

            {/* Bordure animée avec gradient */}
            <motion.div
              className="absolute -inset-0.5 rounded-xl"
              style={{
                background: "linear-gradient(45deg, #DCB265, #C2A8A6, #184D6B, #DCB265)",
                backgroundSize: "300% 300%",
              }}
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            {/* Card avec glassmorphism et dégradé animé */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
              className="relative backdrop-blur-xl bg-gradient-to-br from-white/90 via-white/80 to-white/70 border-2 border-white/30 rounded-xl shadow-2xl p-8 overflow-hidden"
            >
              {/* Dégradé animé en arrière-plan du container */}
              <motion.div
                className="absolute inset-0 opacity-30"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--accent) / 0.2), hsl(var(--accent-rose) / 0.2), hsl(var(--accent-blue) / 0.2), hsl(var(--accent) / 0.2))",
                  backgroundSize: "400% 400%",
                }}
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Petites particules colorées animées */}
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: Math.random() * 8 + 4,
                    height: Math.random() * 8 + 4,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    background: i % 3 === 0 
                      ? "hsl(var(--accent) / 0.4)" 
                      : i % 3 === 1 
                      ? "hsl(var(--accent-rose) / 0.4)" 
                      : "hsl(var(--accent-blue) / 0.4)",
                  }}
                  animate={{
                    y: [0, -20, 0],
                    x: [0, Math.random() * 20 - 10, 0],
                    opacity: [0.3, 0.7, 0.3],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: Math.random() * 3 + 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                    ease: "easeInOut",
                  }}
                />
              ))}

              {/* Formes géométriques animées dans les coins */}
              <motion.div
                className="absolute top-0 right-0 w-20 h-20 opacity-20"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--accent)), transparent)",
                  clipPath: "polygon(100% 0, 100% 100%, 0 0)",
                }}
                animate={{
                  rotate: [0, 90, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute bottom-0 left-0 w-16 h-16 opacity-20"
                style={{
                  background: "linear-gradient(315deg, hsl(var(--accent-rose)), transparent)",
                  clipPath: "polygon(0 100%, 100% 100%, 0 0)",
                }}
                animate={{
                  rotate: [0, -90, 0],
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Ligne de couleur animée en haut */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent via-accent-rose via-accent-blue to-transparent"
                animate={{
                  backgroundPosition: ["-200% 0", "200% 0"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              {/* Effet de brillance animé qui traverse le container */}
              <motion.div
                className="absolute inset-0 opacity-20"
                style={{
                  background: "linear-gradient(90deg, transparent, hsl(var(--accent) / 0.3), transparent)",
                  transform: "skewX(-20deg)",
                }}
                animate={{
                  x: ["-100%", "200%"],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatDelay: 2,
                  ease: "easeInOut",
                }}
              />

              {/* Points lumineux animés aux coins */}
              {[
                { top: "10%", left: "5%", color: "hsl(var(--accent))" },
                { top: "15%", right: "8%", color: "hsl(var(--accent-rose))" },
                { bottom: "12%", left: "7%", color: "hsl(var(--accent-blue))" },
                { bottom: "8%", right: "5%", color: "hsl(var(--accent))" },
              ].map((point, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    top: point.top,
                    left: point.left,
                    right: point.right,
                    bottom: point.bottom,
                    background: point.color,
                    boxShadow: `0 0 10px ${point.color}`,
                  }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 2 + i * 0.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeInOut",
                  }}
                />
              ))}

              {/* Contenu relatif pour le z-index */}
              <div className="relative z-10">
                {/* Tabs avec effets animés */}
                <div className="flex mb-8 relative">
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#E5E5E5] via-[#DCB265]/30 to-[#E5E5E5] rounded-full" />
                  <motion.button
                    type="button"
                    onClick={() => setActiveTab("login")}
                    className="flex-1 pb-4 text-center font-semibold text-lg relative z-10 transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.span
                      className={activeTab === "login" ? "text-foreground" : "text-muted-foreground"}
                      animate={{
                        color: activeTab === "login" ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))",
                      }}
                    >
                      Connexion
                    </motion.span>
                    {activeTab === "login" && (
                      <>
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                          style={{
                            background: "linear-gradient(90deg, hsl(var(--accent)), hsl(var(--accent-rose)), hsl(var(--accent-blue)), hsl(var(--accent)))",
                            backgroundSize: "200% 100%",
                          }}
                          animate={{
                            backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                        <motion.div
                          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#DCB265]"
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                      </>
                    )}
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setActiveTab("register")}
                    className="flex-1 pb-4 text-center font-semibold text-lg relative z-10 transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.span
                      className={activeTab === "register" ? "text-foreground" : "text-muted-foreground"}
                      animate={{
                        color: activeTab === "register" ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))",
                      }}
                    >
                      Inscription
                    </motion.span>
                    {activeTab === "register" && (
                      <>
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                          style={{
                            background: "linear-gradient(90deg, hsl(var(--accent)), hsl(var(--accent-rose)), hsl(var(--accent-blue)), hsl(var(--accent)))",
                            backgroundSize: "200% 100%",
                          }}
                          animate={{
                            backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                        <motion.div
                          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-accent-rose"
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                      </>
                    )}
                  </motion.button>
                </div>

                {/* Forms */}
                <AnimatePresence mode="wait">
                  {activeTab === "login" ? (
                    <LoginForm
                      key="login"
                      showPassword={showPassword}
                      setShowPassword={setShowPassword}
                    />
                  ) : (
                    <RegisterForm
                      key="register"
                      showPassword={showPassword}
                      setShowPassword={setShowPassword}
                    />
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Lien vers la page d'accueil */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 text-center"
            >
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Retour à l'accueil
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function LoginForm({
  showPassword,
  setShowPassword,
}: {
  showPassword: boolean
  setShowPassword: (value: boolean) => void
}) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const result = await login(email, password)
    setLoading(false)

    if (result.success) {
      toast.success("Connexion réussie !")
      router.push("/account/dashboard")
    } else {
      if (result.error === "Email not confirmed") {
        toast.error("Veuillez confirmer votre e-mail avant de vous connecter.")
      } else {
        toast.error(result.error || "Échec de la connexion")
      }
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
      onSubmit={handleSubmit}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-center mb-6"
      >
        <h2 className="text-2xl font-bold text-foreground mb-2">Bon retour !</h2>
        <p className="text-muted-foreground text-sm">
          Connectez-vous pour continuer vos achats
        </p>
      </motion.div>

      <div className="space-y-5">
        {/* Email Input */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          <Label htmlFor="email" className="text-foreground font-medium">
            E-mail <span className="text-accent">*</span>
          </Label>
          <div className="relative group">
            <Mail
              className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${
                focusedField === "email" ? "text-accent" : "text-muted-foreground"
              }`}
            />
            <Input
              id="email"
              type="email"
              placeholder="votre.nom@exemple.com"
              className={`pl-12 pr-4 h-12 rounded-xl border-2 transition-all ${
                focusedField === "email"
                  ? "border-accent ring-2 ring-accent/20"
                  : "border-border hover:border-accent/50"
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              autoComplete="email"
              required
            />
          </div>
        </motion.div>

        {/* Password Input */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-foreground font-medium">
              Mot de passe <span className="text-accent">*</span>
            </Label>
            <Link
              href="/forgot-password"
              className="text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              Oublié ?
            </Link>
          </div>
          <div className="relative group">
            <Lock
              className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${
                focusedField === "password" ? "text-accent" : "text-muted-foreground"
              }`}
            />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Entrez votre mot de passe"
              className={`pl-12 pr-12 h-12 rounded-xl border-2 transition-all ${
                focusedField === "password"
                  ? "border-accent ring-2 ring-accent/20"
                  : "border-border hover:border-accent/50"
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent transition-colors"
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.3, ease: "easeOut" }}
      >
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-xl bg-gradient-to-r from-accent to-accent-rose text-foreground font-semibold hover:from-accent/90 hover:to-accent-rose/90 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Connexion...
            </>
          ) : (
            <>
              Se connecter
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      </motion.div>
    </motion.form>
  )
}

function RegisterForm({
  showPassword,
  setShowPassword,
}: {
  showPassword: boolean
  setShowPassword: (value: boolean) => void
}) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const { register } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const name = `${firstName} ${lastName}`.trim() || undefined
    const result = await register(email, password, name)
    setLoading(false)

    if (result.success) {
      toast.success("Compte créé avec succès !")
      router.push("/account/dashboard")
    } else {
      if (result.error?.includes("rate limit") || result.error?.includes("Email rate limit exceeded")) {
        toast.error("Limite d'envoi d'e-mails dépassée. Désactivez la confirmation d'email dans Supabase pour le développement.")
      } else if (result.error?.includes("email service not configured")) {
        toast.error("Le service d'e-mail n'est pas configuré. Veuillez contacter l'administrateur.")
      } else if (result.error?.includes("Failed to send confirmation mail")) {
        toast.error("Échec de l'envoi de l'e-mail de confirmation. Vérifiez votre configuration Supabase.")
      } else {
        toast.error(result.error || "Échec de l'inscription")
      }
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
      onSubmit={handleSubmit}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-center mb-6"
      >
        <h2 className="text-2xl font-bold text-foreground mb-2">Créer un compte</h2>
        <p className="text-muted-foreground text-sm">
          Rejoignez-nous pour commencer votre expérience d'achat
        </p>
      </motion.div>

      <div className="space-y-5">
        {/* Name Inputs */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.3, ease: "easeOut" }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-foreground font-medium">
              Prénom
            </Label>
            <Input
              id="firstName"
              type="text"
              placeholder="John"
              className="h-12 rounded-xl border-2 border-border hover:border-accent/50 transition-all"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-foreground font-medium">
              Nom
            </Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Doe"
              className="h-12 rounded-xl border-2 border-border hover:border-accent/50 transition-all"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </motion.div>

        {/* Email Input */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-2"
        >
          <Label htmlFor="registerEmail" className="text-foreground font-medium">
            E-mail <span className="text-accent">*</span>
          </Label>
          <div className="relative">
            <Mail
              className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${
                focusedField === "email" ? "text-accent" : "text-muted-foreground"
              }`}
            />
            <Input
              id="registerEmail"
              type="email"
              placeholder="votre.nom@exemple.com"
              className={`pl-12 pr-4 h-12 rounded-xl border-2 transition-all ${
                focusedField === "email"
                  ? "border-accent ring-2 ring-accent/20"
                  : "border-border hover:border-accent/50"
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              autoComplete="email"
              required
            />
          </div>
        </motion.div>

        {/* Password Input */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-2"
        >
          <Label htmlFor="registerPassword" className="text-foreground font-medium">
            Mot de passe <span className="text-accent">*</span>
          </Label>
          <div className="relative">
            <Lock
              className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${
                focusedField === "password" ? "text-accent" : "text-muted-foreground"
              }`}
            />
            <Input
              id="registerPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Créez un mot de passe"
              className={`pl-12 pr-12 h-12 rounded-xl border-2 transition-all ${
                focusedField === "password"
                  ? "border-accent ring-2 ring-accent/20"
                  : "border-border hover:border-accent/50"
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              autoComplete="new-password"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent transition-colors"
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Doit contenir au moins 6 caractères
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-xl bg-gradient-to-r from-accent to-accent-rose text-foreground font-semibold hover:from-accent/90 hover:to-accent-rose/90 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Création...
            </>
          ) : (
            <>
              Créer le compte
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center text-xs text-muted-foreground"
      >
        En créant un compte, vous acceptez nos{" "}
        <Link href="/terms" className="text-accent hover:underline">
          Conditions d'utilisation
        </Link>{" "}
        et notre{" "}
        <Link href="/privacy" className="text-accent hover:underline">
          Politique de confidentialité
        </Link>
      </motion.p>
    </motion.form>
  )
}
