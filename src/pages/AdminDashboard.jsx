import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { products } from '../data/dummyData'
import { sampleUsers, demoAdminCredentials } from '../data/usersData'

export default function AdminDashboard() {
  const { logout, user } = useAuth()
  const [activeTab, setActiveTab] = useState('products')
  const [productsList, setProductsList] = useState(products)
  const [usersList, setUsersList] = useState(sampleUsers)
  const [editingProduct, setEditingProduct] = useState(null)
  const [showImportModal, setShowImportModal] = useState(false)
  const [importFile, setImportFile] = useState(null)

  // Product Edit Handler
  const handleProductChange = (field, value) => {
    setEditingProduct(prev => ({
      ...prev,
      [field]: field === 'price' || field === 'originalPrice' || field === 'rating' ? parseFloat(value) : value
    }))
  }

  const saveProduct = () => {
    setProductsList(prev =>
      prev.map(p => p.id === editingProduct.id ? editingProduct : p)
    )
    setEditingProduct(null)
  }

  // Bulk Import Handler for Excel
  const handleBulkImport = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls') && !file.name.endsWith('.csv')) {
        alert('Please upload an Excel file (.xlsx, .xls) or CSV file')
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const text = event.target.result
          let rows = []

          if (file.name.endsWith('.csv')) {
            // Parse CSV
            rows = text.split('\n').map(row => row.split(','))
          } else {
            alert('For Excel files, please use a spreadsheet application to save as CSV first, then import.')
            return
          }

          if (rows.length < 2) {
            alert('Invalid file format')
            return
          }

          const headers = rows[0].map(h => h.trim().toLowerCase())
          const products = rows.slice(1).filter(row => row[0]).map(row => ({
            id: parseInt(row[0]) || Math.random(),
            name: row[1] || '',
            price: parseFloat(row[2]) || 0,
            originalPrice: parseFloat(row[3]) || 0,
            rating: parseFloat(row[4]) || 4.5,
            reviewCount: parseInt(row[5]) || 0,
            stock: parseInt(row[6]) || 0,
            category: row[7] || '',
            categoryId: parseInt(row[8]) || 1,
            image: row[9] || '',
            description: row[10] || '',
            badge: row[11] || '',
            tags: (row[12] || '').split('|').filter(t => t.trim())
          }))

          if (products.length > 0) {
            setProductsList(prev => [...prev, ...products])
            alert(`Successfully imported ${products.length} products!`)
            setImportFile(null)
          } else {
            alert('No valid products found in file')
          }
        } catch (err) {
          alert('Error parsing file: ' + err.message)
        }
      }
      reader.readAsText(file)
    }
  }

  // Download Template Handler
  const downloadTemplate = () => {
    const templateData = `ID,Product Name,Price,Original Price,Rating,Review Count,Stock,Category,Category ID,Image URL,Description,Badge,Tags
1,Sample Product,100,150,4.5,100,50,Groceries,1,https://images.unsplash.com/photo-xxx,Fresh organic product,Fresh,organic|fresh|vegetables
2,Another Product,200,250,4.8,200,100,Dairy,2,https://images.unsplash.com/photo-yyy,Quality dairy product,Premium,dairy|fresh|milk`

    const element = document.createElement('a')
    const file = new Blob([templateData], { type: 'text/csv;charset=utf-8;' })
    element.href = URL.createObjectURL(file)
    element.download = 'product_import_template.csv'
    element.click()
  }

  // Add User Handler
  const addUser = () => {
    const newUser = {
      id: Math.max(...usersList.map(u => u.id), 0) + 1,
      username: `user_${Math.random().toString(36).substr(2, 9)}`,
      email: `user${usersList.length + 1}@demo.com`,
      phone: `987654${String(usersList.length).padStart(4, '0')}`,
      role: 'user',
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0],
      totalOrders: 0
    }
    setUsersList(prev => [...prev, newUser])
  }

  const deleteUser = (userId) => {
    setUsersList(prev => prev.filter(u => u.id !== userId))
  }

  const deleteProduct = (productId) => {
    setProductsList(prev => prev.filter(p => p.id !== productId))
  }

  return (
    <div className="admin-dashboard">
      <motion.div
        className="admin-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="admin-header-content">
          <div>
            <h1>🛡️ Admin Dashboard</h1>
            <p>Welcome, {user?.username}</p>
          </div>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </motion.div>

      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          📦 Manage Products
        </button>
        <button
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Manage Users
        </button>
        <button
          className={`tab-btn ${activeTab === 'import' ? 'active' : ''}`}
          onClick={() => setActiveTab('import')}
        >
          📥 Bulk Import
        </button>
      </div>

      <div className="admin-content">
        {/* Products Tab */}
        {activeTab === 'products' && (
          <motion.div
            className="admin-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="section-header">
              <h2>Product Management</h2>
              <span className="badge">{productsList.length} items</span>
            </div>

            {editingProduct ? (
              <motion.div
                className="edit-form"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <h3>Edit Product</h3>
                <div className="form-grid">
                  <input
                    type="text"
                    placeholder="Product Name"
                    value={editingProduct.name}
                    onChange={(e) => handleProductChange('name', e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={editingProduct.price}
                    onChange={(e) => handleProductChange('price', e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Original Price"
                    value={editingProduct.originalPrice}
                    onChange={(e) => handleProductChange('originalPrice', e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Stock"
                    value={editingProduct.stock}
                    onChange={(e) => handleProductChange('stock', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Category"
                    value={editingProduct.category}
                    onChange={(e) => handleProductChange('category', e.target.value)}
                  />
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Rating"
                    value={editingProduct.rating}
                    onChange={(e) => handleProductChange('rating', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Badge"
                    value={editingProduct.badge}
                    onChange={(e) => handleProductChange('badge', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={editingProduct.image}
                    onChange={(e) => handleProductChange('image', e.target.value)}
                  />
                </div>
                <textarea
                  placeholder="Description"
                  value={editingProduct.description}
                  onChange={(e) => handleProductChange('description', e.target.value)}
                  rows="3"
                />
                <div className="form-actions">
                  <button className="save-btn" onClick={saveProduct}>
                    ✓ Save Changes
                  </button>
                  <button className="cancel-btn" onClick={() => setEditingProduct(null)}>
                    ✕ Cancel
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="products-table">
                <div className="table-header">
                  <div className="col-id">ID</div>
                  <div className="col-name">Name</div>
                  <div className="col-price">Price</div>
                  <div className="col-stock">Stock</div>
                  <div className="col-actions">Actions</div>
                </div>
                {productsList.map(product => (
                  <motion.div
                    key={product.id}
                    className="table-row"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="col-id">{product.id}</div>
                    <div className="col-name">{product.name}</div>
                    <div className="col-price">₹{product.price}</div>
                    <div className="col-stock">{product.stock}</div>
                    <div className="col-actions">
                      <button
                        className="edit-btn"
                        onClick={() => setEditingProduct(product)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => deleteProduct(product.id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <motion.div
            className="admin-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="section-header">
              <h2>User Management</h2>
              <button className="add-btn" onClick={addUser}>
                + Add User
              </button>
            </div>
            <div className="users-table">
              <div className="table-header">
                <div className="col-user">Username</div>
                <div className="col-email">Email</div>
                <div className="col-phone">Phone</div>
                <div className="col-status">Status</div>
                <div className="col-orders">Orders</div>
                <div className="col-actions">Actions</div>
              </div>
              {usersList.map(u => (
                <motion.div
                  key={u.id}
                  className="table-row"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="col-user">{u.username}</div>
                  <div className="col-email">{u.email}</div>
                  <div className="col-phone">{u.phone}</div>
                  <div className="col-status">
                    <span className={`status-badge ${u.status}`}>{u.status}</span>
                  </div>
                  <div className="col-orders">{u.totalOrders}</div>
                  <div className="col-actions">
                    <button
                      className="delete-btn"
                      onClick={() => deleteUser(u.id)}
                    >
                      🗑️ Remove
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Bulk Import Tab */}
        {activeTab === 'import' && (
          <motion.div
            className="admin-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <h2>📥 Bulk Import Products</h2>
            <div className="import-section">
              <div className="import-card">
                <div className="import-icon">�</div>
                <h3>Import from Excel/CSV</h3>
                <p>Upload an Excel or CSV file with product data to bulk import items</p>
                
                <div className="import-buttons">
                  <label className="file-input-label">
                    <input
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleBulkImport}
                      style={{ display: 'none' }}
                    />
                    📁 Choose File
                  </label>
                  <button className="template-download-btn" onClick={downloadTemplate}>
                    📥 Download Template
                  </button>
                </div>

                <div className="import-example">
                  <h4>📋 Expected Columns:</h4>
                  <div className="column-list">
                    <code>ID</code>
                    <code>Product Name</code>
                    <code>Price</code>
                    <code>Original Price</code>
                    <code>Rating</code>
                    <code>Review Count</code>
                    <code>Stock</code>
                    <code>Category</code>
                    <code>Category ID</code>
                    <code>Image URL</code>
                    <code>Description</code>
                    <code>Badge</code>
                    <code>Tags</code>
                  </div>
                  
                  <h4>📝 Example Row:</h4>
                  <pre>{`1,Organic Tomatoes,45,60,4.5,128,150,Groceries,1,https://images.unsplash.com/photo-xxx,Fresh vegetables,Fresh,organic|fresh|vegetables`}</pre>

                  <h4>💡 Tips:</h4>
                  <ul>
                    <li>Download the template to see the correct format</li>
                    <li>Use pipe (|) to separate multiple tags: "organic|fresh|vegetables"</li>
                    <li>Image URLs should be valid HTTPS URLs</li>
                    <li>Keep the first row as column headers</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Demo Credentials Info */}
      <div className="credentials-info">
        <h4>📌 Demo Admin Credentials:</h4>
        <p>Username: <code>{demoAdminCredentials.username}</code> | Password: <code>{demoAdminCredentials.password}</code></p>
      </div>
    </div>
  )
}
