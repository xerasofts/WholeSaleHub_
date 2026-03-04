import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { products, getUniqueCategories } from '../data/dummyData'
import ProductCard from '../components/ProductCard'
import SearchBar from '../components/SearchBar'
import useCart from '../hooks/useCart'

export default function SearchResults() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const { addToCart } = useCart()

  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'relevance'
  })
  const [showFilters, setShowFilters] = useState(false)

  const uniqueCategories = useMemo(() => getUniqueCategories(), [])

  const filteredProducts = useMemo(() => {
    let results = products.filter(p => {
      const searchLower = query.toLowerCase()
      return (
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.category.toLowerCase().includes(searchLower) ||
        p.tags.some(tag => tag.toLowerCase().includes(searchLower))
      )
    })

    if (filters.category) {
      results = results.filter(p => p.category === filters.category)
    }
    if (filters.minPrice) {
      results = results.filter(p => p.price >= Number(filters.minPrice))
    }
    if (filters.maxPrice) {
      results = results.filter(p => p.price <= Number(filters.maxPrice))
    }

    switch (filters.sortBy) {
      case 'rating':
        results.sort((a, b) => b.rating - a.rating)
        break
      case 'price-low':
        results.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        results.sort((a, b) => b.price - a.price)
        break
      default:
        break
    }

    return results
  }, [query, filters])

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'relevance'
    })
  }

  const activeFiltersCount = Object.values(filters).filter(v => v && v !== 'relevance').length

  return (
    <div className="search-results-page">
      <div className="search-results-header">
        <div className="search-header-content">
          <SearchBar />
        </div>
      </div>

      <div className="search-results-container">
        <motion.div 
          className="results-info"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {query && (
            <>
              <h1>
                Results for "<span className="search-query">{query}</span>"
              </h1>
              <p>{filteredProducts.length} products found</p>
            </>
          )}
        </motion.div>

        <div className="filters-row">
          <div className="filter-buttons">
            <button 
              className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <span>⚙️</span>
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="filter-count">{activeFiltersCount}</span>
              )}
            </button>

            <div className="sort-dropdown">
              <label>Sort by:</label>
              <select 
                value={filters.sortBy} 
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
              >
                <option value="relevance">Relevance</option>
                <option value="rating">Highest Rating</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {activeFiltersCount > 0 && (
            <button className="clear-filters-btn" onClick={clearFilters}>
              <span>✕</span>
              <span>Clear all filters</span>
            </button>
          )}
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div 
              className="filters-panel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="filter-group">
                <label>Category</label>
                <select 
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                >
                  <option value="">All Categories</option>
                  {uniqueCategories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="filter-group">
                <label>Price Range</label>
                <div className="price-inputs">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          className="product-listing-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {filteredProducts.length === 0 ? (
            <div className="no-results">
              <span className="no-results-icon">🔍</span>
              <h2>No results found</h2>
              <p>Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
            ))
          )}
        </motion.div>
      </div>
    </div>
  )
}
