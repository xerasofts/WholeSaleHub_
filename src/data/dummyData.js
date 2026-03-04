// Comprehensive dummy data for the Online Shopping Platform

export const categories = [
  { id: 1, name: "VIS***", icon: "🥬", description: "Premium dry & frozen foods" },
  { id: 2, name: "AS***", icon: "🥛", description: "South Indian specialties" },
  { id: 3, name: "MAL***", icon: "🍞", description: "Wholesale frozen items" },
  { id: 4, name: "MAR***", icon: "☕", description: "Premium selections" },
  { id: 5, name: "Frozen Foods", icon: "🍿", description: "Quality frozen products" },
  { id: 6, name: "Dry Items", icon: "🧴", description: "Essential dry goods" },
]

export const products = [
  // Groceries
  {
    id: 1,
    name: "Organic Tomatoes",
    category: "Groceries",
    categoryId: 1,
    price: 45,
    originalPrice: 60,
    rating: 4.5,
    reviewCount: 128,
    image: "https://images.unsplash.com/photo-1598512752271-33f913a53133?w=300&h=300&fit=crop",
    description: "Fresh, organic tomatoes directly from local farms",
    stock: 150,
    unit: "per kg",
    badge: "Fresh",
    tags: ["vegetables", "organic", "fresh"]
  },
  {
    id: 2,
    name: "Carrots (1kg Pack)",
    category: "Groceries",
    categoryId: 1,
    price: 35,
    originalPrice: 45,
    rating: 4.6,
    reviewCount: 95,
    image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=300&h=300&fit=crop",
    description: "Crispy and sweet carrots perfect for salads and cooking",
    stock: 200,
    unit: "per pack",
    badge: "Healthy",
    tags: ["vegetables", "healthy", "organic"]
  },
  {
    id: 3,
    name: "Red Onions (500g)",
    category: "Groceries",
    categoryId: 1,
    price: 25,
    originalPrice: 35,
    rating: 4.3,
    reviewCount: 72,
    image: "https://images.unsplash.com/photo-1518688606217-e707fc6f361f?w=300&h=300&fit=crop",
    description: "Premium red onions with strong flavor",
    stock: 180,
    unit: "per pack",
    badge: "Fresh",
    tags: ["vegetables", "fresh", "spices"]
  },
  {
    id: 4,
    name: "Bananas (1kg)",
    category: "Groceries",
    categoryId: 1,
    price: 40,
    originalPrice: 50,
    rating: 4.7,
    reviewCount: 210,
    image: "https://images.unsplash.com/photo-1528825871115-3581a5387919?w=300&h=300&fit=crop",
    description: "Golden yellow bananas rich in potassium",
    stock: 300,
    unit: "per kg",
    badge: "Fresh",
    tags: ["fruits", "fresh", "healthy"]
  },
  {
    id: 5,
    name: "Apples (6pcs)",
    category: "Groceries",
    categoryId: 1,
    price: 120,
    originalPrice: 150,
    rating: 4.8,
    reviewCount: 340,
    image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=300&h=300&fit=crop",
    description: "Crispy red apples imported from Kashmir",
    stock: 250,
    unit: "per pack",
    badge: "Premium",
    tags: ["fruits", "premium", "imported"]
  },
  {
    id: 6,
    name: "Spinach (250g)",
    category: "Groceries",
    categoryId: 1,
    price: 30,
    originalPrice: 40,
    rating: 4.4,
    reviewCount: 85,
    image: "https://images.unsplash.com/photo-1576045057995-568f588f2f28?w=300&h=300&fit=crop",
    description: "Fresh leafy spinach packed with nutrients",
    stock: 120,
    unit: "per pack",
    badge: "Healthy",
    tags: ["vegetables", "healthy", "organic"]
  },

  // Dairy
  {
    id: 7,
    name: "Whole Milk (1L)",
    category: "Dairy",
    categoryId: 2,
    price: 55,
    originalPrice: 65,
    rating: 4.6,
    reviewCount: 420,
    image: "https://images.unsplash.com/photo-1563636619-0bda4a2e87d2?w=300&h=300&fit=crop",
    description: "Pure whole milk from trusted dairy farms",
    stock: 500,
    unit: "per liter",
    badge: "Fresh",
    tags: ["dairy", "milk", "fresh"]
  },
  {
    id: 8,
    name: "Yogurt (500g)",
    category: "Dairy",
    categoryId: 2,
    price: 45,
    originalPrice: 55,
    rating: 4.5,
    reviewCount: 280,
    image: "https://images.unsplash.com/photo-1562119432-5735235213a4?w=300&h=300&fit=crop",
    description: "Creamy and delicious plain yogurt",
    stock: 350,
    unit: "per pack",
    badge: "Fresh",
    tags: ["dairy", "yogurt", "healthy"]
  },
  {
    id: 9,
    name: "Cheddar Cheese (200g)",
    category: "Dairy",
    categoryId: 2,
    price: 180,
    originalPrice: 220,
    rating: 4.7,
    reviewCount: 195,
    image: "https://images.unsplash.com/photo-1618164436241-4475a44d934b?w=300&h=300&fit=crop",
    description: "Premium imported cheddar cheese",
    stock: 100,
    unit: "per pack",
    badge: "Premium",
    tags: ["cheese", "premium", "imported"]
  },
  {
    id: 10,
    name: "Butter (200g)",
    category: "Dairy",
    categoryId: 2,
    price: 120,
    originalPrice: 150,
    rating: 4.4,
    reviewCount: 310,
    image: "https://images.unsplash.com/photo-1628779234038-2d9b9d4b35b6?w=300&h=300&fit=crop",
    description: "Pure unsalted butter for cooking and baking",
    stock: 200,
    unit: "per pack",
    badge: "Fresh",
    tags: ["butter", "dairy", "cooking"]
  },
  {
    id: 11,
    name: "Paneer (400g)",
    category: "Dairy",
    categoryId: 2,
    price: 150,
    originalPrice: 185,
    rating: 4.6,
    reviewCount: 425,
    image: "https://images.unsplash.com/photo-1589659318372-a5b75b42aaff?w=300&h=300&fit=crop",
    description: "Fresh cottage cheese perfect for Indian curries",
    stock: 280,
    unit: "per pack",
    badge: "Fresh",
    tags: ["cheese", "paneer", "fresh"]
  },

  // Bakery
  {
    id: 12,
    name: "Whole Wheat Bread",
    category: "Bakery",
    categoryId: 3,
    price: 40,
    originalPrice: 50,
    rating: 4.5,
    reviewCount: 1,
    image: "https://images.unsplash.com/photo-1534620808146-d336b3624510?w=300&h=300&fit=crop",
    tags: ["bread", "healthy", "bakery"]
  },
  {
    id: 13,
    name: "Croissants (4pcs)",
    category: "Bakery",
    categoryId: 3,
    price: 80,
    originalPrice: 100,
    rating: 4.7,
    reviewCount: 240,
    image: "https://images.unsplash.com/photo-1533134242443-742a28dd9d38?w=300&h=300&fit=crop",
    description: "Buttery and flaky French croissants",
    stock: 80,
    unit: "per pack",
    badge: "Fresh",
    tags: ["pastries", "bakery", "fresh"]
  },
  {
    id: 14,
    name: "Chocolate Cake (500g)",
    category: "Bakery",
    categoryId: 3,
    price: 250,
    originalPrice: 320,
    rating: 4.8,
    reviewCount: 380,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=300&fit=crop",
    description: "Rich and moist chocolate cake",
    stock: 50,
    unit: "per cake",
    badge: "Premium",
    tags: ["cake", "chocolate", "bakery"]
  },
  {
    id: 15,
    name: "Multigrain Bread",
    category: "Bakery",
    categoryId: 3,
    price: 50,
    originalPrice: 65,
    rating: 4.6,
    reviewCount: 198,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=300&fit=crop",
    description: "Healthy multigrain bread with seeds",
    stock: 100,
    unit: "per loaf",
    badge: "Healthy",
    tags: ["bread", "healthy", "organic"]
  },

  // Beverages
  {
    id: 16,
    name: "Orange Juice (1L)",
    category: "Beverages",
    categoryId: 4,
    price: 65,
    originalPrice: 80,
    rating: 4.5,
    reviewCount: 285,
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=300&h=300&fit=crop",
    description: "Fresh squeezed orange juice",
    stock: 200,
    unit: "per liter",
    badge: "Fresh",
    tags: ["juice", "fresh", "healthy"]
  },
  {
    id: 17,
    name: "Green Tea (25 bags)",
    category: "Beverages",
    categoryId: 4,
    price: 120,
    originalPrice: 150,
    rating: 4.6,
    reviewCount: 310,
    image: "https://images.unsplash.com/photo-1597318426071-2a1ae3b46150?w=300&h=300&fit=crop",
    description: "Premium organic green tea bags",
    stock: 150,
    unit: "per pack",
    badge: "Healthy",
    tags: ["tea", "healthy", "organic"]
  },
  {
    id: 18,
    name: "Coffee Beans (500g)",
    category: "Beverages",
    categoryId: 4,
    price: 280,
    originalPrice: 350,
    rating: 4.7,
    reviewCount: 420,
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b8d5?w=300&h=300&fit=crop",
    description: "Premium arabica coffee beans",
    stock: 120,
    unit: "per pack",
    badge: "Premium",
    tags: ["coffee", "premium", "imported"]
  },
  {
    id: 19,
    name: "Coca-Cola (1.5L)",
    category: "Beverages",
    categoryId: 4,
    price: 60,
    originalPrice: 75,
    rating: 4.4,
    reviewCount: 215,
    image: "https://images.unsplash.com/photo-1554866585-d7180ba3c412?w=300&h=300&fit=crop",
    description: "Refreshing coca-cola beverage",
    stock: 300,
    unit: "per bottle",
    badge: "Popular",
    tags: ["cola", "beverage", "popular"]
  },

  // Snacks
  {
    id: 20,
    name: "Lay's Potato Chips (50g)",
    category: "Snacks",
    categoryId: 5,
    price: 35,
    originalPrice: 45,
    rating: 4.3,
    reviewCount: 520,
    image: "https://images.unsplash.com/photo-1576483573623-a652402166a3?w=300&h=300&fit=crop",
    description: "Crispy potato chips original flavor",
    stock: 400,
    unit: "per pack",
    badge: "Popular",
    tags: ["snacks", "chips", "salty"]
  },
  {
    id: 21,
    name: "Almonds (250g)",
    category: "Snacks",
    categoryId: 5,
    price: 280,
    originalPrice: 350,
    rating: 4.8,
    reviewCount: 380,
    image: "https://images.unsplash.com/photo-1607582278043-57c980b436b9?w=300&h=300&fit=crop",
    description: "Premium raw almonds rich in nutrients",
    stock: 180,
    unit: "per pack",
    badge: "Healthy",
    tags: ["nuts", "healthy", "organic"]
  },
  {
    id: 22,
    name: "Cookies (200g)",
    category: "Snacks",
    categoryId: 5,
    price: 90,
    originalPrice: 120,
    rating: 4.5,
    reviewCount: 295,
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=300&h=300&fit=crop",
    description: "Delicious chocolate chip cookies",
    stock: 200,
    unit: "per pack",
    badge: "Popular",
    tags: ["cookies", "chocolate", "bakery"]
  },
  {
    id: 23,
    name: "Granola Bar (Pack of 6)",
    category: "Snacks",
    categoryId: 5,
    price: 120,
    originalPrice: 150,
    rating: 4.6,
    reviewCount: 310,
    image: "https://images.unsplash.com/photo-1597021588519-db089d3744ee?w=300&h=300&fit=crop",
    description: "Healthy granola bars with oats",
    stock: 250,
    unit: "per pack",
    badge: "Healthy",
    tags: ["granola", "healthy", "organic"]
  },

  // Personal Care
  {
    id: 24,
    name: "Dove Soap (75g)",
    category: "Personal Care",
    categoryId: 6,
    price: 45,
    originalPrice: 60,
    rating: 4.5,
    reviewCount: 680,
    image: "https://images.unsplash.com/photo-1628521579422-a96b758863d1?w=300&h=300&fit=crop",
    description: "Gentle moisturizing soap bar",
    stock: 500,
    unit: "per piece",
    badge: "Popular",
    tags: ["soap", "skincare", "popular"]
  },
  {
    id: 25,
    name: "Head & Shoulders Shampoo (200ml)",
    category: "Personal Care",
    categoryId: 6,
    price: 150,
    originalPrice: 190,
    rating: 4.6,
    reviewCount: 450,
    image: "https://images.unsplash.com/photo-1621352454266-71b8764bfa4a?w=300&h=300&fit=crop",
    description: "Anti-dandruff shampoo for healthy scalp",
    stock: 300,
    unit: "per bottle",
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
    image: "https://images.unsplash.com/photo-1631558485989-86c6d2f3475f?w=300&h=300&fit=crop",
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
    image: "https://images.unsplash.com/photo-1620916566398-39f168a7d7c6?w=300&h=300&fit=crop",
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
