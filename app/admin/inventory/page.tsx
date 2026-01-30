"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {
  Search,
  Filter,
  AlertTriangle,
  Package,
  Save,
  Download,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useProducts, type Product } from "@/hooks/use-products"
import { toast } from "sonner"

// Stock thresholds
const LOW_STOCK_THRESHOLD = 10
const OUT_OF_STOCK_THRESHOLD = 0

type InventoryItem = Product & {
  reserved?: number
  lastRestocked?: string
}

// Stock history mock data
const stockHistory = [
  { date: "2024-01-15", type: "in", quantity: 50, note: "Réapprovisionnement fournisseur" },
  { date: "2024-01-14", type: "out", quantity: 12, note: "Commandes honorées" },
  { date: "2024-01-13", type: "out", quantity: 8, note: "Commandes honorées" },
  { date: "2024-01-12", type: "in", quantity: 30, note: "Réapprovisionnement d'urgence" },
  { date: "2024-01-10", type: "out", quantity: 15, note: "Commandes honorées" },
]

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [stockFilter, setStockFilter] = useState("ALL")
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [adjustmentType, setAdjustmentType] = useState<"add" | "remove">("add")
  const [adjustmentAmount, setAdjustmentAmount] = useState("")
  const [adjustmentNote, setAdjustmentNote] = useState("")
  const [saving, setSaving] = useState(false)

  const { products, loading, refetch, updateProduct } = useProducts()
  
  // Transform products to inventory items
  const inventory: InventoryItem[] = products.map((product) => ({
    ...product,
    reserved: 0, // You can add reserved stock logic later
    lastRestocked: undefined, // You can add this field to the product schema later
  }))

  // Filter inventory
  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase())
    
    let matchesStock = true
    if (stockFilter === "low") {
      matchesStock = item.stock <= LOW_STOCK_THRESHOLD && item.stock > OUT_OF_STOCK_THRESHOLD
    } else if (stockFilter === "out") {
      matchesStock = item.stock <= OUT_OF_STOCK_THRESHOLD
    } else if (stockFilter === "in") {
      matchesStock = item.stock > LOW_STOCK_THRESHOLD
    }
    
    return matchesSearch && matchesStock
  })

  // Get stock status
  const getStockStatus = (stock: number) => {
    if (stock <= OUT_OF_STOCK_THRESHOLD) return { label: "Rupture de stock", color: "bg-red-100 text-red-700" }
    if (stock <= LOW_STOCK_THRESHOLD) return { label: "Stock faible", color: "bg-yellow-100 text-yellow-700" }
    return { label: "En stock", color: "bg-green-100 text-green-700" }
  }

  // Open adjustment dialog
  const handleOpenAdjustment = (item: InventoryItem) => {
    setSelectedItem(item)
    setAdjustmentType("add")
    setAdjustmentAmount("")
    setAdjustmentNote("")
    setIsDialogOpen(true)
  }

  // Save stock adjustment
  const handleSaveAdjustment = async () => {
    if (!selectedItem || !adjustmentAmount) return

    const amount = parseInt(adjustmentAmount)
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount")
      return
    }

    const newStock =
      adjustmentType === "add"
        ? selectedItem.stock + amount
        : Math.max(0, selectedItem.stock - amount)

    setSaving(true)
    try {
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 300))

      // Utiliser updateProduct du hook
      await updateProduct(selectedItem.id, {
        stock: newStock,
        inStock: newStock > 0,
      })

      toast.success('Stock mis à jour avec succès')
      setIsDialogOpen(false)
      refetch()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la mise à jour du stock')
    } finally {
      setSaving(false)
    }
  }

  // Stats
  const stats = [
    {
      label: "Total des produits",
      value: inventory.length,
      icon: Package,
      color: "bg-blue-100 text-blue-700",
    },
    {
      label: "Stock faible",
      value: inventory.filter((i) => i.stock <= LOW_STOCK_THRESHOLD && i.stock > 0).length,
      icon: AlertTriangle,
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      label: "Rupture de stock",
      value: inventory.filter((i) => i.stock <= 0).length,
      icon: AlertTriangle,
      color: "bg-red-100 text-red-700",
    },
    {
      label: "Total des unités",
      value: inventory.reduce((acc, i) => acc + i.stock, 0).toLocaleString(),
      icon: Package,
      color: "bg-green-100 text-green-700",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inventaire</h1>
          <p className="text-muted-foreground">Gérer les niveaux de stock des produits</p>
        </div>
        <Button variant="outline" className="gap-2 rounded-full bg-transparent border-border">
          <Download className="w-4 h-4" />
          Exporter le rapport
        </Button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.color)}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Low stock alerts */}
      {inventory.filter((i) => i.stock <= LOW_STOCK_THRESHOLD).length > 0 && (
        <Card className="border-0 shadow-sm bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <p className="text-sm text-yellow-800">
                <strong>{inventory.filter((i) => i.stock <= LOW_STOCK_THRESHOLD).length} produit(s)</strong> nécessitent une attention - stock faible ou rupture
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom ou SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary border-0 rounded-full"
              />
            </div>

            {/* Stock filter */}
            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-secondary border-0 rounded-full">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Statut du stock" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tous les produits</SelectItem>
                <SelectItem value="in">En stock</SelectItem>
                <SelectItem value="low">Stock faible</SelectItem>
                <SelectItem value="out">Rupture de stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Inventory table */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="text-left py-4 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Produit
                    </th>
                    <th className="text-left py-4 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                      SKU
                    </th>
                    <th className="text-left py-4 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="text-left py-4 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                      Réservé
                    </th>
                    <th className="text-left py-4 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="text-right py-4 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.map((item) => {
                  const status = getStockStatus(item.stock)
                  return (
                    <tr
                      key={item.id}
                      className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
                            <Image
                              src={Array.isArray(item.images) && item.images.length > 0 
                                ? item.images[0] 
                                : "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate">{item.name}</p>
                            <p className="text-xs text-muted-foreground md:hidden">{item.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 hidden md:table-cell">
                        <code className="text-sm text-muted-foreground">{item.sku}</code>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-lg font-semibold">{item.stock}</span>
                      </td>
                      <td className="py-4 px-4 hidden sm:table-cell">
                        <span className="text-sm text-muted-foreground">{item.reserved ?? 0}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={cn("inline-flex px-2 py-1 rounded-full text-xs font-medium", status.color)}>
                          {status.label}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Button
                          size="sm"
                          onClick={() => handleOpenAdjustment(item)}
                          className="rounded-full bg-foreground text-background hover:bg-foreground/90"
                        >
                          Ajuster
                        </Button>
                      </td>
                    </tr>
                  )
                })}
                </tbody>
              </table>
            </div>
          )}

          {!loading && filteredInventory.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <Package className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucun produit trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stock Adjustment Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle>Ajuster le stock</DialogTitle>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Product info */}
                <div className="flex items-center gap-4 p-4 bg-secondary rounded-xl">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-background">
                    <Image
                      src={selectedItem.images[0] || "/placeholder.svg"}
                      alt={selectedItem.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{selectedItem.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedItem.sku}</p>
                    <p className="text-sm mt-1">
                      Stock actuel : <strong>{selectedItem.stock}</strong>
                    </p>
                  </div>
                </div>

                {/* Adjustment type */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={adjustmentType === "add" ? "default" : "outline"}
                    onClick={() => setAdjustmentType("add")}
                    className={cn(
                      "rounded-full gap-2",
                      adjustmentType === "add"
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-transparent"
                    )}
                  >
                    <TrendingUp className="w-4 h-4" />
                    Ajouter du stock
                  </Button>
                  <Button
                    variant={adjustmentType === "remove" ? "default" : "outline"}
                    onClick={() => setAdjustmentType("remove")}
                    className={cn(
                      "rounded-full gap-2",
                      adjustmentType === "remove"
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-transparent"
                    )}
                  >
                    <TrendingDown className="w-4 h-4" />
                    Retirer du stock
                  </Button>
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <Label htmlFor="amount">Quantité</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="1"
                    value={adjustmentAmount}
                    onChange={(e) => setAdjustmentAmount(e.target.value)}
                    placeholder="Entrez la quantité"
                  />
                </div>

                {/* Note */}
                <div className="space-y-2">
                  <Label htmlFor="note">Note (optionnel)</Label>
                  <Input
                    id="note"
                    value={adjustmentNote}
                    onChange={(e) => setAdjustmentNote(e.target.value)}
                    placeholder="Raison de l'ajustement"
                  />
                </div>

                {/* Preview */}
                {adjustmentAmount && (
                  <div className="p-4 bg-secondary rounded-xl">
                    <p className="text-sm text-muted-foreground">Nouveau niveau de stock :</p>
                    <p className="text-2xl font-bold">
                      {adjustmentType === "add"
                        ? selectedItem.stock + parseInt(adjustmentAmount || "0")
                        : Math.max(0, selectedItem.stock - parseInt(adjustmentAmount || "0"))}
                    </p>
                  </div>
                )}

                {/* Recent history */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <History className="w-4 h-4" />
                    Historique récent
                  </div>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {stockHistory.slice(0, 3).map((entry, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          {entry.type === "in" ? (
                            <TrendingUp className="w-3 h-3 text-green-600" />
                          ) : (
                            <TrendingDown className="w-3 h-3 text-red-600" />
                          )}
                          <span className="text-muted-foreground">{entry.date}</span>
                        </div>
                        <span className={entry.type === "in" ? "text-green-600" : "text-red-600"}>
                          {entry.type === "in" ? "+" : "-"}{entry.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="flex-1 rounded-full bg-transparent"
                  >
                    Annuler
                  </Button>
              <Button
                onClick={handleSaveAdjustment}
                disabled={!adjustmentAmount || saving}
                className="flex-1 bg-foreground text-background hover:bg-foreground/90 rounded-full gap-2"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Enregistrer l'ajustement
              </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
