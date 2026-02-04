"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Globe, Users } from "lucide-react"
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
import dynamic from "next/dynamic"
import type { LatLngExpression } from "leaflet"

// Import dynamique de Leaflet pour éviter les problèmes SSR
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false })

export function WorldMapSection() {
  const { locations, loading: locationsLoading } = useCustomerLocations()
  const totalCustomers = locations.reduce((sum, loc) => sum + (Number(loc.count) || 0), 0)
  const [selectedLocation, setSelectedLocation] = useState<CustomerLocation | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Calculer le centre de la carte basé sur les locations
  const getMapCenter = (): LatLngExpression => {
    if (locations.length === 0) return [48.8566, 2.3522] // Paris par défaut [lat, lng]
    
    const avgLat = locations.reduce((sum, loc) => sum + Number(loc.lat), 0) / locations.length
    const avgLng = locations.reduce((sum, loc) => sum + Number(loc.lng), 0) / locations.length
    return [avgLat, avgLng] // Leaflet utilise [lat, lng]
  }

  // Créer une icône personnalisée pour un marqueur
  const createCustomIcon = (location: CustomerLocation) => {
    const count = Number(location.count) || 0
    const size = count >= 50 ? 50 : count >= 20 ? 40 : count >= 10 ? 35 : count >= 5 ? 29 : 23
    
    const color = count >= 20
      ? count >= 50
        ? "rgb(34, 197, 94)" // green
        : "rgb(59, 130, 246)" // blue
      : "rgb(31, 41, 55)" // gray

    // Utiliser dynamic import pour Leaflet
    if (typeof window !== 'undefined') {
      const L = require('leaflet')
      return L.divIcon({
        className: 'custom-marker',
        html: `<div style="
          width: ${size}px;
          height: ${size}px;
          background-color: ${color};
          border-radius: 50%;
          border: 3px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0px 0px 15px ${color}50, rgba(0, 0, 0, 0.3) 0px 4px 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: ${size > 30 ? '12px' : '14px'};
          cursor: pointer;
          transition: all 0.2s;
        ">${count}</div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      })
    }
    return null
  }

  if (!isClient) {
    return (
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
            <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-xl overflow-hidden bg-secondary flex items-center justify-center">
              <p className="text-muted-foreground">Chargement de la carte...</p>
            </div>
          </div>
        </section>
      </ScrollAnimation>
    )
  }

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
              {locationsLoading || locations.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center bg-secondary rounded-xl">
                  <p className="text-muted-foreground">
                    {locationsLoading ? "Chargement..." : "Aucune localisation disponible"}
                  </p>
                </div>
              ) : (
                <div className="w-full h-full">
                  <MapContainer
                    center={getMapCenter()}
                    zoom={2}
                    style={{ height: "100%", width: "100%", zIndex: 0 }}
                    scrollWheelZoom={true}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {locations.map((location, index) => {
                      const icon = createCustomIcon(location)
                      if (!icon) return null
                      
                      return (
                        <Marker
                          key={`${location.city}-${location.country}-${index}`}
                          position={[Number(location.lat), Number(location.lng)]}
                          icon={icon}
                          eventHandlers={{
                            click: () => {
                              setSelectedLocation(location)
                              setIsModalOpen(true)
                            },
                          }}
                        >
                          <Popup>
                            <div className="text-center p-2">
                              <p className="font-semibold">{location.city}, {location.country}</p>
                              <p className="text-sm text-muted-foreground">
                                {location.count} {location.count === 1 ? "client" : "clients"}
                              </p>
                            </div>
                          </Popup>
                        </Marker>
                      )
                    })}
                  </MapContainer>
                </div>
              )}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-background/20 rounded-xl"></div>
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
                  {selectedLocation.customers && selectedLocation.customers.length > 0 ? (
                    selectedLocation.customers.map((customer: any) => (
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
                              {customer.name?.charAt(0) || "?"}
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{customer.name || "Client"}</p>
                          {customer.joinedDate && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Client depuis le {new Date(customer.joinedDate).toLocaleDateString("fr-FR")}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Aucun détail client disponible pour cette localisation
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        .leaflet-container {
          background: hsl(var(--background));
          border-radius: 0.75rem;
        }
        .leaflet-popup-content-wrapper {
          background: hsl(var(--background));
          color: hsl(var(--foreground));
          border-radius: 0.5rem;
        }
        .leaflet-popup-tip {
          background: hsl(var(--background));
        }
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
        .custom-marker div:hover {
          transform: scale(1.2);
        }
      `}</style>
    </>
  )
}
