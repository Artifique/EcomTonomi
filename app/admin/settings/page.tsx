"use client"

import { useState } from "react"
import {
  Store,
  CreditCard,
  Truck,
  Bell,
  Shield,
  Globe,
  Mail,
  Palette,
  Save,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)
  
  // Store settings
  const [storeSettings, setStoreSettings] = useState({
    name: "Nextgen",
    email: "contact@nextgen.com",
    phone: "+33 1 23 45 67 89",
    address: "123 Fashion Street, Paris, France",
    description: "Mode de qualité qui reflète votre style et rend chaque jour agréable.",
    currency: "EUR",
    timezone: "Europe/Paris",
  })

  // Notification settings
  const [notifications, setNotifications] = useState({
    orderConfirmation: true,
    orderShipped: true,
    orderDelivered: true,
    newCustomer: true,
    lowStock: true,
    weeklyReport: false,
  })

  // Shipping settings
  const [shipping, setShipping] = useState({
    freeShippingThreshold: "50",
    standardRate: "5.99",
    expressRate: "12.99",
    internationalRate: "19.99",
  })

  // Payment settings
  const [payment, setPayment] = useState({
    stripEnabled: true,
    paypalEnabled: true,
    bankTransferEnabled: false,
    testMode: false,
  })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Paramètres</h1>
          <p className="text-muted-foreground">Gérez la configuration de votre boutique</p>
        </div>
        <Button
          onClick={handleSave}
          className={cn(
            "rounded-full gap-2 transition-all",
            saved
              ? "bg-green-600 hover:bg-green-600"
              : "bg-foreground text-background hover:bg-foreground/90"
          )}
        >
          {saved ? (
            <>
              <Check className="w-4 h-4" />
              Enregistré !
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Enregistrer les modifications
            </>
          )}
        </Button>
      </div>

      {/* Settings tabs */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-secondary p-1 rounded-full">
          <TabsTrigger value="general" className="rounded-full data-[state=active]:bg-background">
            <Store className="w-4 h-4 mr-2" />
            Général
          </TabsTrigger>
          <TabsTrigger value="payments" className="rounded-full data-[state=active]:bg-background">
            <CreditCard className="w-4 h-4 mr-2" />
            Paiements
          </TabsTrigger>
          <TabsTrigger value="shipping" className="rounded-full data-[state=active]:bg-background">
            <Truck className="w-4 h-4 mr-2" />
            Expédition
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-full data-[state=active]:bg-background">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="w-5 h-5" />
                Informations de la boutique
              </CardTitle>
              <CardDescription>Informations de base sur votre boutique</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Nom de la boutique</Label>
                  <Input
                    id="storeName"
                    value={storeSettings.name}
                    onChange={(e) =>
                      setStoreSettings({ ...storeSettings, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeEmail">E-mail de contact</Label>
                  <Input
                    id="storeEmail"
                    type="email"
                    value={storeSettings.email}
                    onChange={(e) =>
                      setStoreSettings({ ...storeSettings, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storePhone">Numéro de téléphone</Label>
                  <Input
                    id="storePhone"
                    value={storeSettings.phone}
                    onChange={(e) =>
                      setStoreSettings({ ...storeSettings, phone: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeAddress">Adresse</Label>
                  <Input
                    id="storeAddress"
                    value={storeSettings.address}
                    onChange={(e) =>
                      setStoreSettings({ ...storeSettings, address: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeDescription">Description de la boutique</Label>
                <Textarea
                  id="storeDescription"
                  value={storeSettings.description}
                  onChange={(e) =>
                    setStoreSettings({ ...storeSettings, description: e.target.value })
                  }
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Paramètres régionaux
              </CardTitle>
              <CardDescription>Préférences de devise et de fuseau horaire</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Devise</Label>
                  <Select
                    value={storeSettings.currency}
                    onValueChange={(value) =>
                      setStoreSettings({ ...storeSettings, currency: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      <SelectItem value="USD">US Dollar (USD)</SelectItem>
                      <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                      <SelectItem value="CAD">Canadian Dollar (CAD)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Fuseau horaire</Label>
                  <Select
                    value={storeSettings.timezone}
                    onValueChange={(value) =>
                      setStoreSettings({ ...storeSettings, timezone: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
                      <SelectItem value="Europe/London">Europe/London</SelectItem>
                      <SelectItem value="America/New_York">America/New York</SelectItem>
                      <SelectItem value="America/Los_Angeles">America/Los Angeles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payments" className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Méthodes de paiement
              </CardTitle>
              <CardDescription>Configurez les méthodes de paiement acceptées</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-secondary rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#635BFF] flex items-center justify-center text-white font-bold">
                    S
                  </div>
                  <div>
                    <p className="font-medium">Stripe</p>
                    <p className="text-sm text-muted-foreground">Accepter les paiements par carte</p>
                  </div>
                </div>
                <Switch
                  checked={payment.stripEnabled}
                  onCheckedChange={(checked) =>
                    setPayment({ ...payment, stripEnabled: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-secondary rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#003087] flex items-center justify-center text-white font-bold">
                    P
                  </div>
                  <div>
                    <p className="font-medium">PayPal</p>
                    <p className="text-sm text-muted-foreground">Accepter les paiements PayPal</p>
                  </div>
                </div>
                <Switch
                  checked={payment.paypalEnabled}
                  onCheckedChange={(checked) =>
                    setPayment({ ...payment, paypalEnabled: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-secondary rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-foreground flex items-center justify-center text-background font-bold">
                    B
                  </div>
                  <div>
                    <p className="font-medium">Virement bancaire</p>
                    <p className="text-sm text-muted-foreground">Accepter les virements bancaires directs</p>
                  </div>
                </div>
                <Switch
                  checked={payment.bankTransferEnabled}
                  onCheckedChange={(checked) =>
                    setPayment({ ...payment, bankTransferEnabled: checked })
                  }
                />
              </div>

              <div className="border-t border-border pt-6">
                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                  <div className="flex items-center gap-4">
                    <Shield className="w-6 h-6 text-yellow-600" />
                    <div>
                      <p className="font-medium text-yellow-900">Mode test</p>
                      <p className="text-sm text-yellow-700">Activer le mode test pour tester les paiements</p>
                    </div>
                  </div>
                  <Switch
                    checked={payment.testMode}
                    onCheckedChange={(checked) =>
                      setPayment({ ...payment, testMode: checked })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shipping Settings */}
        <TabsContent value="shipping" className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Tarifs d'expédition
              </CardTitle>
              <CardDescription>Configurez les coûts et options d'expédition</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <Label className="text-green-900 font-medium">Seuil de livraison gratuite</Label>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Commandes supérieures à</span>
                  <Input
                    value={shipping.freeShippingThreshold}
                    onChange={(e) =>
                      setShipping({ ...shipping, freeShippingThreshold: e.target.value })
                    }
                    className="w-24"
                  />
                  <span className="text-muted-foreground">bénéficient de la livraison gratuite</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Livraison standard</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">$</span>
                    <Input
                      value={shipping.standardRate}
                      onChange={(e) =>
                        setShipping({ ...shipping, standardRate: e.target.value })
                      }
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">5-7 jours ouvrables</p>
                </div>
                <div className="space-y-2">
                  <Label>Livraison express</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">$</span>
                    <Input
                      value={shipping.expressRate}
                      onChange={(e) =>
                        setShipping({ ...shipping, expressRate: e.target.value })
                      }
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">2-3 jours ouvrables</p>
                </div>
                <div className="space-y-2">
                  <Label>International</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">$</span>
                    <Input
                      value={shipping.internationalRate}
                      onChange={(e) =>
                        setShipping({ ...shipping, internationalRate: e.target.value })
                      }
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">7-14 jours ouvrables</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Notifications par e-mail
              </CardTitle>
              <CardDescription>Configurez quels e-mails envoyer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: "orderConfirmation", label: "Confirmation de commande", desc: "Envoyer lorsqu'une nouvelle commande est passée" },
                { key: "orderShipped", label: "Commande expédiée", desc: "Envoyer lorsqu'une commande est expédiée" },
                { key: "orderDelivered", label: "Commande livrée", desc: "Envoyer lorsqu'une commande est livrée" },
                { key: "newCustomer", label: "Bienvenue nouveau client", desc: "Envoyer un e-mail de bienvenue aux nouveaux clients" },
                { key: "lowStock", label: "Alerte stock faible", desc: "Être notifié lorsque les produits sont en rupture de stock" },
                { key: "weeklyReport", label: "Rapport hebdomadaire", desc: "Recevoir un résumé hebdomadaire des ventes" },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-4 bg-secondary rounded-xl"
                >
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch
                    checked={notifications[item.key as keyof typeof notifications]}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, [item.key]: checked })
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
