"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useToast } from "@/hooks/use-toast"
import {
  Store,
  CreditCard,
  Truck,
  Bell,
  Shield,
  Globe,
  Mail,
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

// Type pour les paramètres de notification
type NotificationSettings = {
  orderConfirmation: boolean;
  orderShipped: boolean;
  orderDelivered: boolean;
  newCustomer: boolean;
  lowStock: boolean;
  weeklyReport: boolean;
  lowStockThreshold: number;
};

// Type pour les paramètres d'expédition
type ShippingSettings = {
  freeShippingThreshold: string;
  standardRate: string;
  expressRate: string;
  internationalRate: string;
};

// Type pour les paramètres de paiement
type PaymentSettings = {
  stripEnabled: boolean;
  paypalEnabled: boolean;
  bankTransferEnabled: boolean;
  testMode: boolean;
};

// Type pour les paramètres généraux, correspondant à la table Supabase
type StoreSettings = {
  id: number;
  name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  description: string | null;
  currency: string | null;
  timezone: string | null;
  notification_settings: NotificationSettings | null; // Utiliser le type spécifique
  shipping_settings: ShippingSettings | null;     // Utiliser le type spécifique
  payment_settings: PaymentSettings | null;      // Utiliser le type spécifique
  updated_at: string | null;
};

export default function SettingsPage() {
  const { toast } = useToast()
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  // --- ÉTATS DU COMPOSANT ---

  // Paramètres généraux de la boutique (dynamiques)
  const [storeSettings, setStoreSettings] = useState<Partial<StoreSettings>>({})

  // NOTE: Les états suivants sont statiques pour l'instant.
  // Ils pourraient être déplacés dans des colonnes JSONB dans la table store_settings à l'avenir.

  // NOTE: Les états suivants sont désormais gérés via storeSettings (colonnes JSONB)
  // et ne sont plus des états locaux séparés avec des valeurs statiques.

  // --- EFFETS ---

  // Charger les paramètres depuis Supabase au montage du composant
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from("store_settings")
        .select("*")
        .eq("id", 1)
        .single()

      if (error) {
        toast({
          title: "Erreur de chargement",
          description: "Impossible de récupérer les paramètres de la boutique.",
          variant: "destructive",
        })
        console.error("Error fetching settings:", error)
                } else if (data) {
                  setStoreSettings({
                    ...data,
                    notification_settings: data.notification_settings || {
                      orderConfirmation: true,
                      orderShipped: true,
                      orderDelivered: true,
                      newCustomer: true,
                      lowStock: true,
                      weeklyReport: false,
                      lowStockThreshold: 10,
                    },
                    shipping_settings: data.shipping_settings || {
                      freeShippingThreshold: "50",
                      standardRate: "5.99",
                      expressRate: "12.99",
                      internationalRate: "19.99",
                    },
                    payment_settings: data.payment_settings || {
                      stripEnabled: true,
                      paypalEnabled: true,
                      bankTransferEnabled: false,
                      testMode: false,
                    },
                  })
                }
                setLoading(false)
              }
    fetchSettings()
  }, [toast])

  // --- GESTIONNAIRES D'ÉVÉNEMENTS ---

  const handleSave = async () => {
    setLoading(true)
    try {
      // Vérifier d'abord si la ligne existe, sinon l'insérer
      const { data: existingData, error: checkError } = await supabase
        .from("store_settings")
        .select("id")
        .eq("id", 1)
        .single()

      let error
      
      if (checkError && checkError.code === 'PGRST116') {
        // La ligne n'existe pas, on l'insère
        const { error: insertError } = await supabase
          .from("store_settings")
          .insert({ 
            id: 1,
            ...storeSettings, 
            notification_settings: storeSettings.notification_settings,
            shipping_settings: storeSettings.shipping_settings,
            payment_settings: storeSettings.payment_settings,
            updated_at: new Date().toISOString() 
          })
        error = insertError
      } else if (checkError) {
        error = checkError
      } else {
        // La ligne existe, on la met à jour
        const { error: updateError } = await supabase
          .from("store_settings")
          .update({ 
            ...storeSettings, 
            notification_settings: storeSettings.notification_settings,
            shipping_settings: storeSettings.shipping_settings,
            payment_settings: storeSettings.payment_settings,
            updated_at: new Date().toISOString() 
          })
          .eq("id", 1)
        error = updateError
      }

      if (error) {
        console.error("Error saving settings:", error)
        // Message d'erreur plus détaillé selon le type d'erreur
        let errorMessage = "Une erreur est survenue lors de l'enregistrement."
        
        if (error.code === '42501') {
          errorMessage = "Permission refusée. Vérifiez que vous êtes connecté en tant qu'administrateur et que la fonction is_admin() existe dans Supabase."
        } else if (error.code === 'PGRST116') {
          errorMessage = "Aucune ligne trouvée. La ligne de paramètres par défaut n'existe pas dans la base de données."
        } else if (error.message) {
          errorMessage = error.message
        }
        
        toast({
          title: "Échec de la sauvegarde",
          description: errorMessage,
          variant: "destructive",
        })
      } else {
        setSaved(true)
        toast({
          title: "Enregistré !",
          description: "Les paramètres de votre boutique ont été mis à jour.",
        })
        setTimeout(() => setSaved(false), 2000)
      }
    } catch (err: any) {
      console.error("Unexpected error saving settings:", err)
      toast({
        title: "Erreur inattendue",
        description: err.message || "Une erreur inattendue est survenue.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Affiche un état de chargement pendant la récupération des données
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Chargement des paramètres...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* En-tête de la page */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Paramètres</h1>
          <p className="text-muted-foreground">Gérez la configuration de votre boutique</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={loading}
          className={cn(
            "rounded-full gap-2 transition-all",
            saved
              ? "bg-green-600 hover:bg-green-600"
              : "bg-foreground text-background hover:bg-foreground/90"
          )}
        >
          {loading ? (
            <>
              <Save className="w-4 h-4 animate-spin" />
              Enregistrement...
            </>
          ) : saved ? (
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

      {/* Onglets des paramètres */}
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

        {/* Paramètres généraux */}
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
                    value={storeSettings.name || ""}
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
                    value={storeSettings.email || ""}
                    onChange={(e) =>
                      setStoreSettings({ ...storeSettings, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storePhone">Numéro de téléphone</Label>
                  <Input
                    id="storePhone"
                    value={storeSettings.phone || ""}
                    onChange={(e) =>
                      setStoreSettings({ ...storeSettings, phone: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeAddress">Adresse</Label>
                  <Input
                    id="storeAddress"
                    value={storeSettings.address || ""}
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
                  value={storeSettings.description || ""}
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
                    value={storeSettings.currency || "EUR"}
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
                    value={storeSettings.timezone || "Europe/Paris"}
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

        {/* NOTE: Les sections suivantes sont encore statiques */}
        
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
                  checked={storeSettings.payment_settings?.stripEnabled}
                  onCheckedChange={(checked) =>
                    setStoreSettings({
                      ...storeSettings,
                      payment_settings: {
                        ...(storeSettings.payment_settings || {}),
                        stripEnabled: checked,
                      },
                    })
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
                  checked={storeSettings.payment_settings?.paypalEnabled}
                  onCheckedChange={(checked) =>
                    setStoreSettings({
                      ...storeSettings,
                      payment_settings: {
                        ...(storeSettings.payment_settings || {}),
                        paypalEnabled: checked,
                      },
                    })
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
                  checked={storeSettings.payment_settings?.bankTransferEnabled}
                  onCheckedChange={(checked) =>
                    setStoreSettings({
                      ...storeSettings,
                      payment_settings: {
                        ...(storeSettings.payment_settings || {}),
                        bankTransferEnabled: checked,
                      },
                    })
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
                    checked={storeSettings.payment_settings?.testMode}
                    onCheckedChange={(checked) =>
                      setStoreSettings({
                        ...storeSettings,
                        payment_settings: {
                          ...(storeSettings.payment_settings || {}),
                          testMode: checked,
                        },
                      })
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
                Tarifs d&apos;expédition
              </CardTitle>
              <CardDescription>Configurez les coûts et options d&apos;expédition</CardDescription>
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
                    value={storeSettings.shipping_settings?.freeShippingThreshold || ""}
                    onChange={(e) =>
                      setStoreSettings({
                        ...storeSettings,
                        shipping_settings: {
                          ...(storeSettings.shipping_settings || {}),
                          freeShippingThreshold: e.target.value,
                        },
                      })
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
                    <span className="text-muted-foreground">FCFA</span>
                    <Input
                      value={storeSettings.shipping_settings?.standardRate || ""}
                      onChange={(e) =>
                        setStoreSettings({
                          ...storeSettings,
                          shipping_settings: {
                            ...(storeSettings.shipping_settings || {}),
                            standardRate: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">5-7 jours ouvrables</p>
                </div>
                <div className="space-y-2">
                  <Label>Livraison express</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">FCFA</span>
                    <Input
                      value={storeSettings.shipping_settings?.expressRate || ""}
                      onChange={(e) =>
                        setStoreSettings({
                          ...storeSettings,
                          shipping_settings: {
                            ...(storeSettings.shipping_settings || {}),
                            expressRate: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">2-3 jours ouvrables</p>
                </div>
                <div className="space-y-2">
                  <Label>International</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">FCFA</span>
                    <Input
                      value={storeSettings.shipping_settings?.internationalRate || ""}
                      onChange={(e) =>
                        setStoreSettings({
                          ...storeSettings,
                          shipping_settings: {
                            ...(storeSettings.shipping_settings || {}),
                            internationalRate: e.target.value,
                          },
                        })
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
              {[{
                key: "orderConfirmation",
                label: "Confirmation de commande",
                desc: "Envoyer lorsqu&apos;une nouvelle commande est passée"
              }, {
                key: "orderShipped",
                label: "Commande expédiée",
                desc: "Envoyer lorsqu'une commande est expédiée"
              }, {
                key: "orderDelivered",
                label: "Commande livrée",
                desc: "Envoyer lorsqu'une commande est livrée"
              }, {
                key: "newCustomer",
                label: "Bienvenue nouveau client",
                desc: "Envoyer un e-mail de bienvenue aux nouveaux clients"
              }, {
                key: "lowStock",
                label: "Alerte stock faible",
                desc: "Être notifié lorsque les produits sont en rupture de stock"
              }, {
                key: "weeklyReport",
                label: "Rapport hebdomadaire",
                desc: "Recevoir un résumé hebdomadaire des ventes"
              }].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-4 bg-secondary rounded-xl"
                >
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch
                    checked={storeSettings.notification_settings?.[item.key as keyof typeof storeSettings.notification_settings]}
                    onCheckedChange={(checked) =>
                      setStoreSettings({
                        ...storeSettings,
                        notification_settings: {
                          ...(storeSettings.notification_settings || {}),
                          [item.key]: checked,
                        },
                      })
                    }
                  />
                </div>
              ))}
              {/* Nouveau champ pour le seuil d'alerte stock faible */}
              <div className="flex items-center justify-between p-4 bg-secondary rounded-xl">
                <div>
                  <p className="font-medium">Seuil d'alerte stock faible</p>
                  <p className="text-sm text-muted-foreground">Recevoir une alerte si le stock est inférieur ou égal à ce nombre</p>
                </div>
                <Input
                  type="number"
                  value={storeSettings.notification_settings?.lowStockThreshold || ""}
                  onChange={(e) =>
                    setStoreSettings({
                      ...storeSettings,
                      notification_settings: {
                        ...(storeSettings.notification_settings || {}),
                        lowStockThreshold: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-24"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
