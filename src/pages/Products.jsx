import { useState } from 'react'
import { motion } from 'framer-motion'
import ProductListing from '../components/ProductListing'
import { products } from '../data/dummyData'

export default function Products({ onAddToCart }) {
  return (
    <div className="page">
      <section className="section">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 style={{ fontSize: '2.5rem', marginBottom: 8 }}>All Products</h1>
          <p>Browse our complete collection of quality products</p>
        </motion.div>

        <ProductListing
          products={products}
          onAddToCart={onAddToCart}
          title=""
          showFilters={true}
        />
      </section>
    </div>
  )
}
