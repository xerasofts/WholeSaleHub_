import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ProductCard from './ProductCard'
import { getUniqueBadges, getUniqueCategories } from '../data/dummyData'

export default function ProductListing({ products, onAddToCart, title, showFilters = true }) {
  const [filtered, setFiltered] = useState(products)
  const [sortBy, setSortBy] = useState('rating')
  const [priceRange, setPriceRange] = useState([0, 5000])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBadges, setSelectedBadges] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [minRating, setMinRating] = useState(0)
  const [inStockOnly, setInStockOnly] = useState(false)

  useEffect(() => {
    let result = [...products]

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p?.description?.toLowerCase().includes(query) ||
        p.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Filter by category
    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category))
    }

    // Filter by badge
    if (selectedBadges.length > 0) {
      result = result.filter(p => selectedBadges.includes(p.badge))
    }

    // Filter by price
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])

    // Filter by rating
    result = result.filter(p => p.rating >= minRating)

    // Filter by stock
    if (inStockOnly) {
      result = result.filter(p => p.stock > 0)
    }

    // Sort
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating)
    } else if (sortBy === 'discount') {
      result.sort((a, b) => {
        const discountA = ((b.originalPrice - b.price) / b.originalPrice) * 100
        const discountB = ((a.originalPrice - a.price) / a.originalPrice) * 100
        return discountA - discountB
      })
    } else if (sortBy === 'reviews') {
      result.sort((a, b) => b.reviewCount - a.reviewCount)
    } else if (sortBy === 'newest') {
      result.sort((a, b) => b.id - a.id)
    }

    setFiltered(result)
  }, [products, sortBy, priceRange, searchQuery, selectedBadges, selectedCategories, minRating, inStockOnly])

  const maxPrice = Math.max(...products.map(p => p.price), 5000)
  const badges = getUniqueBadges()
  const categories = getUniqueCategories()

  const toggleBadge = (badge) => {
    setSelectedBadges(prev =>
      prev.includes(badge)
        ? prev.filter(b => b !== badge)
        : [...prev, badge]
    )
  }

  const toggleCategory = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSortBy('rating')
    setPriceRange([0, maxPrice])
    setSelectedBadges([])
    setSelectedCategories([])
    setMinRating(0)
    setInStockOnly(false)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  }

  const hasActiveFilters = 
    searchQuery || 
    selectedBadges.length > 0 || 
    selectedCategories.length > 0 || 
    minRating > 0 || 
    inStockOnly || 
    priceRange[0] > 0 || 
    priceRange[1] < maxPrice

  return (
    <div className="product-listing">
      <div className="listing-header">
        <h2>{title || 'Products'}</h2>
        <span className="result-count">{filtered.length} products found</span>
      </div>

      {showFilters && (
        <div className="advanced-filters">
          {/* Search Bar */}
          <div className="search-container">
            <input
              type="text"
              placeholder="🔍 Search products, ingredients, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filters-grid">
            {/* Sort By */}
            <div className="filter-group">
              <label>📊 Sort By:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="filter-select">
                <option value="rating">⭐ Highest Rated</option>
                <option value="price-low">💰 Price: Low to High</option>
                <option value="price-high">💸 Price: High to Low</option>
                <option value="discount">🎉 Highest Discount</option>
                <option value="reviews">💬 Most Reviewed</option>
                <option value="newest">✨ Newest</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="filter-group">
              <label>💵 Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}</label>
              <input
                type="range"
                min="0"
                max={maxPrice}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                className="price-slider"
              />
            </div>

            {/* Minimum Rating */}
            <div className="filter-group">
              <label>⭐ Minimum Rating:</label>
              <select value={minRating} onChange={(e) => setMinRating(parseFloat(e.target.value))} className="filter-select">
                <option value={0}>All Ratings</option>
                <option value={3}>3+ Stars</option>
                <option value={3.5}>3.5+ Stars</option>
                <option value={4}>4+ Stars</option>
                <option value={4.5}>4.5+ Stars</option>
              </select>
            </div>

            {/* Stock Availability */}
            <div className="filter-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="checkbox-input"
                />
                📦 In Stock Only
              </label>
            </div>
          </div>

          {/* Badge Filters */}
          <div className="filter-section">
            <label>🏷️ Product Type:</label>
            <div className="badge-filters">
              {badges.map(badge => (
                <button
                  key={badge}
                  className={`badge-filter-btn ${selectedBadges.includes(badge) ? 'active' : ''}`}
                  onClick={() => toggleBadge(badge)}
                >
                  {badge}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filters */}
          <div className="filter-section">
            <label>🛍️ Categories:</label>
            <div className="category-filters">
              {categories.map(category => (
                <button
                  key={category}
                  className={`category-filter-btn ${selectedCategories.includes(category) ? 'active' : ''}`}
                  onClick={() => toggleCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button className="clear-filters-btn" onClick={clearFilters}>
              ✕ Clear All Filters
            </button>
          )}
        </div>
      )}

      {/* Products Grid */}
      <motion.div
        className="products-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filtered.length > 0 ? (
          filtered.map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <ProductCard
                product={product}
                onAddToCart={onAddToCart}
              />
            </motion.div>
          ))
        ) : (
          <div className="no-products">
            <p>😢 No products found matching your criteria</p>
            <button className="reset-btn" onClick={clearFilters}>
              Reset Filters
            </button>
          </div>
        )}
      </motion.div>
    </div>
  )
}
