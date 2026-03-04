import { useState } from 'react'
import { motion } from 'framer-motion'
import CatalogListing from '../components/CatalogListing'
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

        <CatalogListing
          products={products}
          onAddToCart={onAddToCart}
        />
      </section>
    </div>
  )
}
