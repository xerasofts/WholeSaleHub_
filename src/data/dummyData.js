// Comprehensive dummy data for the Online Shopping Platform

export const categories = [
  { id: 1, name: "Rice Items", icon: "🍚", description: "Premium quality rice varieties" },
  { id: 2, name: "Dals & Pulses", icon: "🫘", description: "Organic dals and lentils" },
  { id: 3, name: "Spices", icon: "🌶️", description: "Authentic Indian spices" },
  { id: 4, name: "Frozen Vegetables", icon: "🥕", description: "Fresh frozen vegetables" },
  { id: 5, name: "Frozen Foods", icon: "❄️", description: "Quality frozen products" },
  { id: 6, name: "Dry Items", icon: "**", description: "Essential dry goods" },
]

export const brands = [
  { id: 1, name: "VIS***", icon: "🎁", description: "Premium wholesale supplier" },
  { id: 2, name: "AS***", icon: "💚", description: "South Indian specialty brand" },
  { id: 3, name: "MAL***", icon: "🏪", description: "Wholesale frozen specialist" },
  { id: 4, name: "MAR***", icon: "⭐", description: "Premium selections brand" },
]

export const products = [
  // Groceries
  {
    id: 1,
    name: "Basmati Rice (5kg)",
    category: "Rice Items",
    categoryId: 1,
    price: 185,
    originalPrice: 220,
    rating: 4.8,
    reviewCount: 520,
    image: "https://picsum.photos/300/300?random=1",
    description: "Premium basmati rice perfect for wholesale",
    stock: 500,
    unit: "per bag",
    badge: "Premium",
    tags: ["rice", "wholesale", "basmati"]
  },
  {
    id: 2,
    name: "Toor Dal (2kg)",
    category: "Dals & Pulses",
    categoryId: 2,
    price: 95,
    originalPrice: 120,
    rating: 4.6,
    reviewCount: 340,
    image: "https://picsum.photos/300/300?random=2",
    description: "High quality toor dal for Indian cooking",
    stock: 400,
    unit: "per bag",
    badge: "Organic",
    tags: ["dal", "pulses", "healthy"]
  },
  {
    id: 3,
    name: "Garam Masala Powder (500g)",
    category: "Spices",
    categoryId: 3,
    price: 75,
    originalPrice: 95,
    rating: 4.7,
    reviewCount: 420,
    image: "https://picsum.photos/300/300?random=3",
    description: "Premium blend of warm spices perfect for authentic Indian cooking",
    stock: 380,
    unit: "per pack",
    badge: "Pure",
    tags: ["spices", "masala", "cooking"]
  },
  {
    id: 4,
    name: "Frozen Mixed Vegetables (1kg)",
    category: "Frozen Vegetables",
    categoryId: 4,
    price: 85,
    originalPrice: 110,
    rating: 4.5,
    reviewCount: 195,
    image: "https://picsum.photos/300/300?random=4",
    description: "Fresh frozen vegetable mix ready to cook",
    stock: 300,
    unit: "per pack",
    badge: "Frozen",
    tags: ["frozen", "vegetables", "organic"]
  },
  {
    id: 5,
    name: "Frozen Samosas (500g)",
    category: "Frozen Foods",
    categoryId: 5,
    price: 125,
    originalPrice: 160,
    rating: 4.8,
    reviewCount: 410,
    image: "https://picsum.photos/300/300?random=5",
    description: "Crispy frozen samosas ready to deep fry",
    stock: 250,
    unit: "per pack",
    badge: "Premium",
    tags: ["frozen", "samosas", "snack"]
  },
  {
    id: 6,
    name: "Coriander Seeds (200g)",
    category: "Dry Items",
    categoryId: 6,
    price: 55,
    originalPrice: 70,
    rating: 4.4,
    reviewCount: 165,
    image: "https://picsum.photos/300/300?random=6",
    description: "Fresh dried coriander seeds full of aroma",
    stock: 280,
    unit: "per pack",
    badge: "Fresh",
    tags: ["spices", "coriander", "dry"]
  },


  // South Indian Dry & Frozen Foods
  {
    id: 7,
    name: "Chana Dal (2kg)",
    category: "Dals & Pulses",
    categoryId: 2,
    price: 75,
    originalPrice: 95,
    rating: 4.6,
    reviewCount: 320,
    image: "https://picsum.photos/300/300?random=7",
    description: "Premium quality chana dal for cooking",
    stock: 400,
    unit: "per bag",
    badge: "Organic",
    tags: ["dal", "pulses", "cooking"]
  },
  {
    id: 8,
    name: "Black Cumin Seeds (300g)",
    category: "Spices",
    categoryId: 3,
    price: 85,
    originalPrice: 110,
    rating: 4.5,
    reviewCount: 210,
    image: "https://picsum.photos/300/300?random=8",
    description: "Aromatic black cumin seeds for authentic flavor",
    stock: 300,
    unit: "per pack",
    badge: "Premium",
    tags: ["spices", "cumin", "authentic"]
  },
  {
    id: 9,
    name: "Frozen Idli (500g)",
    category: "Frozen Foods",
    categoryId: 5,
    price: 95,
    originalPrice: 120,
    rating: 4.7,
    reviewCount: 275,
    image: "https://picsum.photos/300/300?random=9",
    description: "Ready to steam frozen South Indian idli",
    stock: 220,
    unit: "per pack",
    badge: "Premium",
    tags: ["frozen", "idli", "breakfast"]
  },
  {
    id: 10,
    name: "White Rice (5kg)",
    category: "Rice Items",
    categoryId: 1,
    price: 155,
    originalPrice: 190,
    rating: 4.4,
    reviewCount: 290,
    image: "https://picsum.photos/300/300?random=10",
    description: "Premium white rice for daily cooking",
    stock: 450,
    unit: "per bag",
    badge: "Fresh",
    tags: ["rice", "daily", "cooking"]
  },
  {
    id: 11,
    name: "Moong Dal (2kg)",
    category: "Dals & Pulses",
    categoryId: 2,
    price: 85,
    originalPrice: 110,
    rating: 4.6,
    reviewCount: 340,
    image: "https://picsum.photos/300/300?random=11",
    description: "Premium moong dal for healthy cooking",
    stock: 350,
    unit: "per bag",
    badge: "Organic",
    tags: ["dal", "pulses", "healthy"]
  },

  // More Spices
  {
    id: 12,
    name: "Chili Powder - Hot (500g)",
    category: "Spices",
    categoryId: 3,
    price: 65,
    originalPrice: 80,
    rating: 4.5,
    reviewCount: 350,
    image: "https://picsum.photos/300/300?random=12",
    description: "Extra hot red chili powder for authentic South Indian taste",
    stock: 320,
    unit: "per pack",
    badge: "Premium",
    tags: ["spices", "chili", "authentic"]
  },
  {
    id: 13,
    name: "Frozen Dosa (500g)",
    category: "Frozen Foods",
    categoryId: 5,
    price: 105,
    originalPrice: 135,
    rating: 4.7,
    reviewCount: 310,
    image: "https://picsum.photos/300/300?random=13",
    description: "Crispy frozen dosa ready to cook",
    stock: 270,
    unit: "per pack",
    badge: "Premium",
    tags: ["frozen", "dosa", "breakfast"]
  },
  {
    id: 14,
    name: "Matta Rice (5kg)",
    category: "Rice Items",
    categoryId: 1,
    price: 195,
    originalPrice: 245,
    rating: 4.8,
    reviewCount: 380,
    image: "https://picsum.photos/300/300?random=14",
    description: "Premium Kerala Matta rice with rich aroma",
    stock: 180,
    unit: "per bag",
    badge: "Premium",
    tags: ["rice", "matta", "premium"]
  },
  {
    id: 15,
    name: "Sambar Powder (250g)",
    category: "Spices",
    categoryId: 3,
    price: 85,
    originalPrice: 110,
    rating: 4.7,
    reviewCount: 380,
    image: "https://picsum.photos/300/300?random=15",
    description: "Traditional South Indian sambar masala blend for authentic flavor",
    stock: 280,
    unit: "per pack",
    badge: "Premium",
    tags: ["spices", "masala", "sambar"]
  },

  // More Frozen Foods
  {
    id: 16,
    name: "Frozen Rasam Balls (400g)",
    category: "Frozen Foods",
    categoryId: 5,
    price: 125,
    originalPrice: 160,
    rating: 4.6,
    reviewCount: 280,
    image: "https://picsum.photos/300/300?random=16",
    description: "South Indian rasam balls - ready to boil or fry",
    stock: 200,
    unit: "per pack",
    badge: "Authentic",
    tags: ["frozen", "rasam", "breakfast"]
  },
  {
    id: 17,
    name: "Urad Dal (2kg)",
    category: "Dals & Pulses",
    categoryId: 2,
    price: 95,
    originalPrice: 125,
    rating: 4.6,
    reviewCount: 275,
    image: "https://picsum.photos/300/300?random=17",
    description: "Premium urad dal for detailed cooking",
    stock: 280,
    unit: "per bag",
    badge: "Organic",
    tags: ["dal", "pulses", "premium"]
  },
  {
    id: 18,
    name: "Curry Leaves Powder (100g)",
    category: "Spices",
    categoryId: 3,
    price: 75,
    originalPrice: 100,
    rating: 4.6,
    reviewCount: 240,
    image: "https://picsum.photos/300/300?random=18",
    description: "Dried curry leaves powder for authentic South Indian flavor",
    stock: 260,
    unit: "per pack",
    badge: "Fresh",
    tags: ["spices", "curry", "leaves"]
  },
  {
    id: 19,
    name: "Murukku (Seedless) - 200g",
    category: "Dry Items",
    categoryId: 6,
    price: 95,
    originalPrice: 125,
    rating: 4.7,
    reviewCount: 310,
    image: "https://picsum.photos/300/300?random=19",
    description: "Crispy spiral murukku snack - authentic Tamil Nadu specialty",
    stock: 220,
    unit: "per pack",
    badge: "Premium",
    tags: ["snacks", "murukku", "authentic"]
  },

  // Snacks & Dry Items
  {
    id: 20,
    name: "Banana Chips (300g)",
    category: "Dry Items",
    categoryId: 6,
    price: 65,
    originalPrice: 85,
    rating: 4.6,
    reviewCount: 520,
    image: "https://picsum.photos/300/300?random=20",
    description: "Crispy South Indian style banana chips, perfect snack for wholesale",
    stock: 450,
    unit: "per pack",
    badge: "Popular",
    tags: ["chips", "banana", "snack"]
  },
  {
    id: 21,
    name: "Cashew Nuts (500g)",
    category: "Dry Items",
    categoryId: 6,
    price: 280,
    originalPrice: 350,
    rating: 4.7,
    reviewCount: 420,
    image: "https://picsum.photos/300/300?random=21",
    description: "Premium roasted cashew nuts",
    stock: 120,
    unit: "per pack",
    badge: "Premium",
    tags: ["nuts", "premium", "snacks"]
  },
  {
    id: 22,
    name: "Almond Nuts (500g)",
    category: "Dry Items",
    categoryId: 6,
    price: 280,
    originalPrice: 350,
    rating: 4.8,
    reviewCount: 380,
    image: "https://picsum.photos/300/300?random=22",
    description: "Premium raw almonds rich in nutrients",
    stock: 180,
    unit: "per pack",
    badge: "Healthy",
    tags: ["nuts", "healthy", "organic"]
  },
  {
    id: 23,
    name: "Frozen Pakora Mix (500g)",
    category: "Frozen Foods",
    categoryId: 5,
    price: 90,
    originalPrice: 120,
    rating: 4.5,
    reviewCount: 295,
    image: "https://picsum.photos/300/300?random=23",
    description: "Ready to fry frozen pakora mix",
    stock: 200,
    unit: "per pack",
    badge: "Popular",
    tags: ["frozen", "pakora", "snack"]
  },
  {
    id: 24,
    name: "Sesame Seeds (200g)",
    category: "Spices",
    categoryId: 3,
    price: 80,
    originalPrice: 100,
    rating: 4.6,
    reviewCount: 210,
    image: "https://picsum.photos/300/300?random=24",
    description: "Fresh white sesame seeds",
    stock: 250,
    unit: "per pack",
    badge: "Fresh",
    tags: ["sesame", "seeds", "spices"]
  },

  // More Rice Varieties
  {
    id: 25,
    name: "Jasmine Rice (5kg)",
    category: "Rice Items",
    categoryId: 1,
    price: 175,
    originalPrice: 220,
    rating: 4.5,
    reviewCount: 320,
    image: "https://picsum.photos/300/300?random=25",
    description: "Fragrant jasmine rice for cooking",
    stock: 280,
    unit: "per bag",
    badge: "Popular",
    tags: ["shampoo", "haircare", "popular"]
  },
  {
    id: 26,
    name: "Colgate Toothpaste (100g)",
    category: "Personal Care",
    categoryId: 6,
    price: 50,
    originalPrice: 65,
    rating: 4.4,
    reviewCount: 520,
    image: "https://picsum.photos/300/300?random=26",
    description: "Cavity protection toothpaste",
    stock: 600,
    unit: "per tube",
    badge: "Popular",
    tags: ["toothpaste", "dental", "popular"]
  },
  {
    id: 27,
    name: "Neutrogena Body Lotion (400ml)",
    category: "Personal Care",
    categoryId: 6,
    price: 280,
    originalPrice: 350,
    rating: 4.7,
    reviewCount: 385,
    image: "https://picsum.photos/300/300?random=27",
    description: "Lightweight hydrating body lotion",
    stock: 200,
    unit: "per bottle",
    badge: "Premium",
    tags: ["lotion", "skincare", "premium"]
  },
]

export const getProductsByCategory = (categoryId) => {
  return products.filter(p => p.categoryId === categoryId)
}

export const getFeaturedProducts = (count = 6) => {
  return [...products]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, count)
}

export const searchProducts = (query) => {
  const lowerQuery = query.toLowerCase()
  return products.filter(p =>
    p.name.toLowerCase().includes(lowerQuery) ||
    p.description?.toLowerCase()?.includes(lowerQuery) ||
    p.category.toLowerCase().includes(lowerQuery) ||
    p.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  )
}

export const filterByRating = (minRating = 0) => {
  return products.filter(p => p.rating >= minRating)
}

export const filterByPrice = (minPrice = 0, maxPrice = Infinity) => {
  return products.filter(p => p.price >= minPrice && p.price <= maxPrice)
}

export const filterByBadge = (badge) => {
  return products.filter(p => p.badge === badge)
}

export const filterByStock = (inStockOnly = false) => {
  if (inStockOnly) {
    return products.filter(p => p.stock > 0)
  }
  return products
}

export const getUniqueBadges = () => {
  const badges = new Set(products.map(p => p.badge))
  return Array.from(badges)
}

export const getUniqueCategories = () => {
  const cats = new Set(products.map(p => p.category))
  return Array.from(cats)
}

export const getProductsByTags = (tags) => {
  return products.filter(p =>
    tags.some(tag => p.tags.includes(tag))
  )
}

export const getSimilarProducts = (productId, count = 4) => {
  const product = products.find(p => p.id === productId)
  if (!product) return []
  
  return products
    .filter(p => 
      p.id !== productId && 
      (p.categoryId === product.categoryId || 
       p.tags.some(tag => product.tags.includes(tag)))
    )
    .slice(0, count)
}

export const getDiscountedProducts = (minDiscount = 0) => {
  return products.filter(p => {
    const discount = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
    return discount >= minDiscount
  }).sort((a, b) => {
    const discountA = Math.round(((a.originalPrice - a.price) / a.originalPrice) * 100)
    const discountB = Math.round(((b.originalPrice - b.price) / b.originalPrice) * 100)
    return discountB - discountA
  })
}

export const getNewArrivals = () => {
  return [...products].sort((a, b) => b.id - a.id).slice(0, 8)
}
