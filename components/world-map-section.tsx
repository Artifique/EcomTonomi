"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Globe, Users, X } from "lucide-react"
import { AnimatedCounter } from "@/components/animated-counter"
import { ScrollAnimation } from "@/components/scroll-animation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Image from "next/image"
import { useCustomerLocations, type CustomerLocation } from "@/hooks/use-customer-locations"

export function WorldMapSection() {
  const { locations, loading: locationsLoading } = useCustomerLocations()
  const totalCustomers = locations.reduce((sum, loc) => sum + (Number(loc.count) || 0), 0)

  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const [selectedLocation, setSelectedLocation] = useState<CustomerLocation | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    // Dynamically import mapbox-gl to avoid SSR issues
    const loadMap = async () => {
      // Vérifier que le conteneur existe
      if (!mapContainer.current) {
        return
      }

      // Nettoyer le conteneur pour éviter les doublons en cas de re-render
      mapContainer.current.innerHTML = ""

      try {
        // Dynamic import to avoid SSR issues
        const mapboxglModule = await import("mapbox-gl")
        const mapboxgl = mapboxglModule.default

        // You'll need to add your Mapbox token to .env.local
        // NEXT_PUBLIC_MAPBOX_TOKEN=your_token_here
        const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

        if (!token || token === "your_token_here") {
          // Fallback: Show a static map or placeholder
          if (mapContainer.current) {
            const fallbackDiv = document.createElement("div")
            fallbackDiv.className =
              "w-full h-full flex items-center justify-center bg-secondary rounded-xl"
            const innerDiv = document.createElement("div")
            innerDiv.className = "text-center p-8"

            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
            svg.setAttribute("class", "w-16 h-16 mx-auto mb-4 text-muted-foreground")
            svg.setAttribute("fill", "none")
            svg.setAttribute("stroke", "currentColor")
            svg.setAttribute("viewBox", "0 0 24 24")
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path")
            path.setAttribute("stroke-linecap", "round")
            path.setAttribute("stroke-linejoin", "round")
            path.setAttribute("stroke-width", "2")
            path.setAttribute(
              "d",
              "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            )
            svg.appendChild(path)

            const p1 = document.createElement("p")
            p1.className = "text-muted-foreground"
            p1.textContent = "Carte interactive disponible"

            const p2 = document.createElement("p")
            p2.className = "text-sm text-muted-foreground mt-2"
            p2.textContent = "Ajoutez NEXT_PUBLIC_MAPBOX_TOKEN dans .env.local"

            innerDiv.appendChild(svg)
            innerDiv.appendChild(p1)
            innerDiv.appendChild(p2)
            fallbackDiv.appendChild(innerDiv)
            mapContainer.current.appendChild(fallbackDiv)
          }
          return
        }

        mapboxgl.accessToken = token

        // Vérifier que le conteneur existe et est valide
        if (!mapContainer.current) {
          console.error("Map container not found")
          return
        }

        // Vérifier que c'est un HTMLElement valide et qu'il est dans le DOM
        if (!(mapContainer.current instanceof HTMLElement)) {
          console.error("Map container is not a valid HTMLElement")
          return
        }

        // Vérifier que l'élément est bien attaché au DOM
        if (!mapContainer.current.isConnected) {
          console.error("Map container is not connected to the DOM")
          return
        }

        // S'assurer que le conteneur a une taille
        if (mapContainer.current.offsetWidth === 0 || mapContainer.current.offsetHeight === 0) {
          console.warn("Map container has no dimensions, waiting...")
          // Attendre un peu pour que le layout soit calculé
          setTimeout(() => {
            if (mapContainer.current && mapContainer.current.offsetWidth > 0) {
              initializeMap()
            }
          }, 100)
          return
        }

        // Fonction pour initialiser la carte
        const initializeMap = () => {
          if (!mapContainer.current) return

          try {
            // Initialize map
            const map = new mapboxgl.Map({
              container: mapContainer.current,
              style: "mapbox://styles/mapbox/light-v11",
              center: [2.3522, 48.8566], // Center on Paris
              zoom: 2,
              attributionControl: false,
            })

            mapRef.current = map

            // Add navigation controls
            map.addControl(new mapboxgl.NavigationControl(), "top-right")

            // Add markers with animations
            locations.forEach((location, index) => {
              // Determine marker size and color based on count
              const size =
                location.count >= 50
                  ? 50
                  : location.count >= 20
                  ? 40
                  : location.count >= 10
                  ? 35
                  : location.count >= 5
                  ? 29
                  : 23
              
              // Utiliser les mêmes couleurs que dans le code source fourni
              // Vert pour les grandes villes, bleu pour les moyennes, gris pour les petites
              const color =
                location.count >= 20
                  ? location.count >= 50
                    ? "rgb(34, 197, 94)" // green (vert)
                    : "rgb(59, 130, 246)" // blue (bleu)
                  : "rgb(31, 41, 55)" // gray (gris foncé)

              // Convertir rgb en rgba pour les ombres
              const rgbMatch = color.match(/\d+/g)
              const shadowColor = rgbMatch
                ? `rgba(${rgbMatch[0]}, ${rgbMatch[1]}, ${rgbMatch[2]}, 0.5)`
                : `rgba(59, 130, 246, 0.5)`
              const shadowColorHover = rgbMatch
                ? `rgba(${rgbMatch[0]}, ${rgbMatch[1]}, ${rgbMatch[2]}, 0.8)`
                : `rgba(59, 130, 246, 0.8)`

              // Create marker element
              const el = document.createElement("div")
              el.className = "map-marker"
              el.setAttribute("aria-label", `Map marker`)
              el.setAttribute("role", "img")
              el.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                background-color: ${color};
                border-radius: 50%;
                border: 3px solid rgba(255, 255, 255, 0.8);
                box-shadow: ${shadowColor} 0px 0px 15px, rgba(0, 0, 0, 0.3) 0px 4px 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: ${size > 30 ? "12px" : "14px"};
                cursor: pointer;
                transition: box-shadow 0.2s, border-color 0.2s, transform 0.2s;
                opacity: 0;
              `

              el.textContent = location.count.toString()

              // Add click event to open modal
              el.addEventListener("click", () => {
                setSelectedLocation(location)
                setIsModalOpen(true)
              })

              // Add hover effect
              el.addEventListener("mouseenter", () => {
                el.style.transform = "scale(1.2)"
                el.style.boxShadow = `${shadowColorHover} 0px 0px 20px, rgba(0, 0, 0, 0.4) 0px 6px 15px`
              })

              el.addEventListener("mouseleave", () => {
                el.style.transform = "scale(1)"
                el.style.boxShadow = `${shadowColor} 0px 0px 15px, rgba(0, 0, 0, 0.3) 0px 4px 10px`
              })

              // Create marker
              const marker = new mapboxgl.Marker(el)
                .setLngLat([location.lng, location.lat])
                .addTo(map)

              markersRef.current.push(marker)

              // Animate marker appearance
              setTimeout(() => {
                el.style.transition = "opacity 0.5s ease-in-out"
                el.style.opacity = "1"
              }, index * 100)
            })

            // Add gradient overlay
            const gradientOverlay = document.createElement("div")
            gradientOverlay.className =
              "absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-background/20 rounded-xl"
            mapContainer.current.appendChild(gradientOverlay)
          } catch (error) {
            console.error("Error initializing map:", error)
          }
        }

        // Initialiser la carte
        initializeMap()
      } catch (error) {
        console.error("Error loading map:", error)
        if (mapContainer.current) {
          const errorDiv = document.createElement("div")
          errorDiv.className =
            "w-full h-full flex items-center justify-center bg-secondary rounded-xl"
          const innerDiv = document.createElement("div")
          innerDiv.className = "text-center p-8"

          const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
          svg.setAttribute("class", "w-16 h-16 mx-auto mb-4 text-muted-foreground")
          svg.setAttribute("fill", "none")
          svg.setAttribute("stroke", "currentColor")
          svg.setAttribute("viewBox", "0 0 24 24")
          const path = document.createElementNS("http://www.w3.org/2000/svg", "path")
          path.setAttribute("stroke-linecap", "round")
          path.setAttribute("stroke-linejoin", "round")
          path.setAttribute("stroke-width", "2")
          path.setAttribute(
            "d",
            "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          )
          svg.appendChild(path)

          const p1 = document.createElement("p")
          p1.className = "text-muted-foreground"
          p1.textContent = "Carte interactive"

          const p2 = document.createElement("p")
          p2.className = "text-sm text-muted-foreground mt-2"
          p2.textContent = "Chargement de la carte..."

          innerDiv.appendChild(svg)
          innerDiv.appendChild(p1)
          innerDiv.appendChild(p2)
          errorDiv.appendChild(innerDiv)
          mapContainer.current.appendChild(errorDiv)
        }
      }
    }

    // Attendre que le DOM soit prêt avant d'initialiser
    // Utiliser requestAnimationFrame pour s'assurer que le DOM est rendu
    const initTimer = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (mapContainer.current) {
          loadMap()
        } else {
          // Si le conteneur n'est toujours pas disponible, réessayer après un délai
          setTimeout(() => {
            if (mapContainer.current) {
              loadMap()
            }
          }, 200)
        }
      })
    })

    return () => {
      cancelAnimationFrame(initTimer)
      // Cleanup
      if (mapRef.current) {
        mapRef.current.remove()
      }
      markersRef.current = []
    }
  }, [locations])

  return (
    <>
      <ScrollAnimation direction="fade">
        <section className="py-16 bg-gradient-to-b from-background to-muted/30">
          <div className="container mx-auto px-4 text-center mb-12">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-primary/80 mb-4 bg-primary/10 text-primary border-primary/20">
              <Globe className="h-3 w-3 mr-1" />
              Répartition Mondiale
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nos clients dans le monde</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Découvrez nos clients satisfaits répartis à travers le monde
            </p>
          </div>
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-lg font-semibold">
                  <span className="text-primary">
                    <AnimatedCounter value={totalCustomers} />
                  </span>{" "}
                  clients satisfaits dans le monde
                </span>
              </div>
            </div>
            <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-xl overflow-hidden">
              <div
                ref={mapContainer}
                className="absolute inset-0 w-full h-full mapboxgl-map"
                style={{ minHeight: "400px" }}
              />
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-background/20"></div>
            </div>
          </div>
        </section>
      </ScrollAnimation>

      {/* Modal pour afficher les clients d'une ville */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Globe className="h-5 w-5" />
              {selectedLocation && (
                <>
                  {selectedLocation.city}, {selectedLocation.country}
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          {selectedLocation && (
            <div className="mt-4">
              <div className="mb-4 p-4 bg-primary/10 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-primary text-lg">
                    {selectedLocation.count}
                  </span>{" "}
                  {selectedLocation.count === 1 ? "client" : "clients"} dans cette ville
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-lg mb-3">Clients de cette ville</h3>
                <div className="grid gap-3">
                  {selectedLocation.customers.map((customer) => (
                    <motion.div
                      key={customer.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-4 p-4 border rounded-lg hover:bg-secondary/50 transition-colors"
                    >
                      <div className="relative w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        {customer.avatar ? (
                          <Image
                            src={customer.avatar}
                            alt={customer.name}
                            fill
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-lg font-semibold text-primary">
                            {customer.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{customer.name}</p>
                        {customer.joinedDate && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Client depuis le {new Date(customer.joinedDate).toLocaleDateString("fr-FR")}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
