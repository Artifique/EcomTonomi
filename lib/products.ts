export interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  description: string
  images: string[]
  category: string
  sizes: string[]
  colors: { name: string; value: string }[]
  isNew: boolean
  inStock: boolean
  rating: number
  reviews: number
}

export const products: Product[] = [
  {
    id: 1,
    name: "Modern Blazer",
    price: 125,
    originalPrice: 165,
    description: "A sophisticated modern blazer crafted from premium wool blend fabric. Perfect for both formal occasions and smart-casual looks. Features a slim fit design with notched lapels and two-button closure.",
    images: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=2080&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2071&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=2080&auto=format&fit=crop",
    ],
    category: "JACKETS",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Black", value: "#110A0B" },
      { name: "Navy", value: "#184D6B" },
      { name: "Beige", value: "#DCB265" },
    ],
    isNew: true,
    inStock: true,
    rating: 4.8,
    reviews: 124,
  },
  {
    id: 2,
    name: "Premium Jacket",
    price: 189,
    description: "Elevate your outerwear collection with this premium leather jacket. Made from genuine leather with a soft cotton lining for comfort. Features multiple pockets and a classic zipper closure.",
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1935&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1520975954732-35dd22299614?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=1974&auto=format&fit=crop",
    ],
    category: "JACKETS",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Black", value: "#110A0B" },
      { name: "Brown", value: "#8B4513" },
    ],
    isNew: false,
    inStock: true,
    rating: 4.9,
    reviews: 89,
  },
  {
    id: 3,
    name: "Classic White Tee",
    price: 45,
    description: "The perfect everyday essential. This classic white t-shirt is made from 100% organic cotton for superior comfort. Features a relaxed fit and crew neckline.",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2080&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1622445275576-721325763afe?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=2015&auto=format&fit=crop",
    ],
    category: "T-SHIRT",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "White", value: "#FFFFFF" },
      { name: "Black", value: "#110A0B" },
      { name: "Gray", value: "#6B6B6B" },
    ],
    isNew: true,
    inStock: true,
    rating: 4.7,
    reviews: 256,
  },
  {
    id: 4,
    name: "Running Sneakers",
    price: 165,
    originalPrice: 195,
    description: "High-performance running sneakers designed for comfort and speed. Features responsive cushioning, breathable mesh upper, and durable rubber outsole.",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1974&auto=format&fit=crop",
    ],
    category: "SHOES",
    sizes: ["7", "8", "9", "10", "11", "12"],
    colors: [
      { name: "Red", value: "#DC2626" },
      { name: "Black", value: "#110A0B" },
      { name: "White", value: "#FFFFFF" },
    ],
    isNew: false,
    inStock: true,
    rating: 4.6,
    reviews: 178,
  },
  {
    id: 5,
    name: "Summer Shorts",
    price: 55,
    description: "Lightweight and breathable summer shorts perfect for warm weather. Made from quick-dry fabric with an elastic waistband for comfort.",
    images: [
      "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1598522325074-042db73aa4e6?q=80&w=1974&auto=format&fit=crop",
    ],
    category: "SHORTS",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Khaki", value: "#C3B091" },
      { name: "Navy", value: "#184D6B" },
      { name: "Black", value: "#110A0B" },
    ],
    isNew: true,
    inStock: true,
    rating: 4.5,
    reviews: 67,
  },
  {
    id: 6,
    name: "Leather Boots",
    price: 225,
    description: "Classic leather boots crafted from premium full-grain leather. Features a cushioned insole and durable rubber sole for all-day comfort.",
    images: [
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542840410-3092f99611a3?q=80&w=1974&auto=format&fit=crop",
    ],
    category: "SHOES",
    sizes: ["7", "8", "9", "10", "11", "12"],
    colors: [
      { name: "Brown", value: "#8B4513" },
      { name: "Black", value: "#110A0B" },
    ],
    isNew: false,
    inStock: true,
    rating: 4.9,
    reviews: 203,
  },
  {
    id: 7,
    name: "Denim Jacket",
    price: 145,
    description: "Timeless denim jacket made from high-quality cotton denim. Features classic button closure, chest pockets, and a comfortable regular fit.",
    images: [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?q=80&w=1974&auto=format&fit=crop",
    ],
    category: "JACKETS",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Blue", value: "#1E40AF" },
      { name: "Light Blue", value: "#60A5FA" },
      { name: "Black", value: "#110A0B" },
    ],
    isNew: false,
    inStock: true,
    rating: 4.7,
    reviews: 145,
  },
  {
    id: 8,
    name: "Graphic Tee",
    price: 39,
    description: "Express yourself with this unique graphic t-shirt. Made from soft cotton with a modern print design. Features a relaxed fit for everyday comfort.",
    images: [
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=2069&auto=format&fit=crop",
    ],
    category: "T-SHIRT",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Black", value: "#110A0B" },
      { name: "White", value: "#FFFFFF" },
    ],
    isNew: true,
    inStock: true,
    rating: 4.4,
    reviews: 89,
  },
]

export function getProductById(id: number): Product | undefined {
  return products.find((product) => product.id === id)
}

export function getRelatedProducts(productId: number, category: string): Product[] {
  return products
    .filter((product) => product.id !== productId && product.category === category)
    .slice(0, 4)
}
