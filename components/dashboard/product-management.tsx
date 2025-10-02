"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, Plus, Star, Users, Edit, Eye, Trash2 } from "lucide-react"
import { apiClient, type Product } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"

export function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState<Partial<Product>>({})
  const toast  = useToast()

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.getProducts()
      if (response.success) {
        // Normalize numeric fields to ensure consistent rendering
        const normalized = response.data.map((p) => ({
          ...p,
          rating: typeof (p as any).rating === "number" ? (p as any).rating : Number((p as any).rating) || 0,
          usersCount:
            typeof (p as any).usersCount === "number" ? (p as any).usersCount : Number((p as any).usersCount) || 0,
        }))
        setProducts(normalized)
      }
    } catch (error) {
      console.error("Failed to load products:", error)
      toast({
        title: "Error",
        description: "Failed to load products. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateProduct = async () => {
    try {
      if (!formData.name || !formData.category || !formData.shortDescription) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        })
        return
      }

      const productData = {
        ...formData,
        slug: formData.name?.toLowerCase().replace(/\s+/g, "-") || "",
        features: formData.features || [],
        gallery: formData.gallery || [],
        rating: Number(formData.rating ?? 0),
        usersCount: Number(formData.usersCount ?? 0),
        status: formData.status || "ACTIVE",
        priceModel: formData.priceModel || "Free",
        heroImageUrl: formData.heroImageUrl || "/placeholder.svg?height=200&width=300",
        longDescription: formData.longDescription || formData.shortDescription || "",
      } as Omit<Product, "isArchived">

      const response = await apiClient.createProduct(productData)
      if (response.success) {
        await loadProducts()
        setIsCreateDialogOpen(false)
        setFormData({})
        toast({
          title: "Success",
          description: "Product created successfully.",
        })
      }
    } catch (error) {
      console.error("Failed to create product:", error)
      toast({
        title: "Error",
        description: "Failed to create product. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateProduct = async () => {
    try {
      if (!selectedProduct || !formData.name) return

      const response = await apiClient.updateProduct(selectedProduct.slug, formData)
      if (response.success) {
        await loadProducts()
        setIsEditDialogOpen(false)
        setSelectedProduct(null)
        setFormData({})
        toast({
          title: "Success",
          description: "Product updated successfully.",
        })
      }
    } catch (error) {
      console.error("Failed to update product:", error)
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteProduct = async (slug: string) => {
    try {
      const response = await apiClient.deleteProduct(slug)
      if (response.success) {
        await loadProducts()
        toast({
          title: "Success",
          description: "Product archived successfully.",
        })
      }
    } catch (error) {
      console.error("Failed to delete product:", error)
      toast({
        title: "Error",
        description: "Failed to archive product. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleStatusChange = async (slug: string, status: Product["status"]) => {
    try {
      const response = await apiClient.updateProductStatus(slug, status)
      if (response.success) {
        await loadProducts()
        toast({
          title: "Success",
          description: "Product status updated successfully.",
        })
      }
    } catch (error) {
      console.error("Failed to update status:", error)
      toast({
        title: "Error",
        description: "Failed to update product status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: Product["status"]) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "COMING_SOON":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "DISCONTINUED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const openEditDialog = (product: Product) => {
    setSelectedProduct(product)
    setFormData(product)
    setIsEditDialogOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Product Management</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage your software products and their lifecycle</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Product</DialogTitle>
              <DialogDescription>Add a new software product to your catalog.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product-name">Product Name *</Label>
                  <Input
                    id="product-name"
                    placeholder="Enter product name"
                    value={formData.name || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Input
                    id="category"
                    placeholder="e.g., Web Development, Mobile App"
                    value={formData.category || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="short-description">Short Description *</Label>
                <Input
                  id="short-description"
                  placeholder="Brief description of the product"
                  value={formData.shortDescription || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, shortDescription: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="long-description">Long Description</Label>
                <Textarea
                  id="long-description"
                  placeholder="Detailed product description..."
                  rows={3}
                  value={formData.longDescription || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, longDescription: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price-model">Price Model</Label>
                  <Select
                    value={formData.priceModel || ""}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, priceModel: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select pricing model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Free">Free</SelectItem>
                      <SelectItem value="Freemium">Freemium</SelectItem>
                      <SelectItem value="Subscription">Subscription</SelectItem>
                      <SelectItem value="One-time">One-time Purchase</SelectItem>
                      <SelectItem value="Enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status || "ACTIVE"}
                    onValueChange={(value: Product["status"]) => setFormData((prev) => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="COMING_SOON">Coming Soon</SelectItem>
                      <SelectItem value="DISCONTINUED">Discontinued</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero-image">Hero Image URL</Label>
                <Input
                  id="hero-image"
                  placeholder="https://example.com/image.jpg"
                  value={formData.heroImageUrl || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, heroImageUrl: e.target.value }))}
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateProduct}>Create Product</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Products Grid */}
      <div className="grid gap-6">
        {products.length === 0 ? (
          <Card className="p-8 text-center">
            <Package className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">No products found</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-4">Get started by creating your first product.</p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Product
            </Button>
          </Card>
        ) : (
          products.map((product) => {
            const ratingNum = Math.max(0, Math.min(5, Number((product as any).rating ?? 0)))
            const usersCountNum = Number((product as any).usersCount ?? 0)
            return (
            <Card key={product.slug} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-xl">{product.name}</CardTitle>
                      <Badge className={getStatusColor(product.status)}>{product.status.replace("_", " ")}</Badge>
                    </div>
                    <CardDescription>{product.shortDescription}</CardDescription>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        {product.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        {ratingNum.toFixed(1)}/5
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {usersCountNum.toLocaleString()} users
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedProduct(product)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Package className="w-5 h-5" />
                            {product.name}
                          </DialogTitle>
                          <DialogDescription>{product.shortDescription}</DialogDescription>
                        </DialogHeader>
                        {selectedProduct && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <img
                                  src={selectedProduct.heroImageUrl || "/placeholder.svg"}
                                  alt={selectedProduct.name}
                                  className="w-full h-48 object-cover rounded-lg bg-slate-100 dark:bg-slate-800"
                                />
                                <div className="space-y-2">
                                  <h4 className="font-medium">Description</h4>
                                  <p className="text-sm text-slate-600 dark:text-slate-400">
                                    {selectedProduct.longDescription}
                                  </p>
                                </div>
                              </div>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Category</p>
                                    <p className="text-lg">{selectedProduct.category}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                      Price Model
                                    </p>
                                    <p className="text-lg">{selectedProduct.priceModel}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Rating</p>
                                    <div className="flex items-center gap-1">
                                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                      <span className="text-lg">{Number(selectedProduct.rating ?? 0).toFixed(1)}/5</span>
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Users</p>
                                    <p className="text-lg">{Number(selectedProduct.usersCount ?? 0).toLocaleString()}</p>
                                  </div>
                                </div>
                                {selectedProduct.features.length > 0 && (
                                  <div className="space-y-2">
                                    <h4 className="font-medium">Features</h4>
                                    <ul className="space-y-1">
                                      {selectedProduct.features.map((feature, index) => (
                                        <li
                                          key={index}
                                          className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                                        >
                                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                                          {feature}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(product)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteProduct(product.slug)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                    <span>Price Model: {product.priceModel}</span>
                    <div className="flex items-center gap-2">
                      <Select
                        value={product.status}
                        onValueChange={(value: Product["status"]) => handleStatusChange(product.slug, value)}
                      >
                        <SelectTrigger className="w-32 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ACTIVE">Active</SelectItem>
                          <SelectItem value="COMING_SOON">Coming Soon</SelectItem>
                          <SelectItem value="DISCONTINUED">Discontinued</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            )
          })
        )}
      </div>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update product information.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-product-name">Product Name *</Label>
                <Input
                  id="edit-product-name"
                  placeholder="Enter product name"
                  value={formData.name || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category *</Label>
                <Input
                  id="edit-category"
                  placeholder="e.g., Web Development, Mobile App"
                  value={formData.category || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-short-description">Short Description *</Label>
              <Input
                id="edit-short-description"
                placeholder="Brief description of the product"
                value={formData.shortDescription || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, shortDescription: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-long-description">Long Description</Label>
              <Textarea
                id="edit-long-description"
                placeholder="Detailed product description..."
                rows={3}
                value={formData.longDescription || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, longDescription: e.target.value }))}
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateProduct}>Update Product</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
