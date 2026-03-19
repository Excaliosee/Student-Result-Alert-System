require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mysql = require('mysql2/promise')

const app = express()
app.use(cors())
app.use(express.json())

// DB Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'StudentResultSystem',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
})

// Test DB connection on startup
pool.getConnection()
  .then(conn => {
    console.log('✅ MySQL connected successfully')
    conn.release()
  })
  .catch(err => {
    console.error('❌ MySQL connection failed:', err.message)
    process.exit(1)
  })

// Attach pool to every request
app.use((req, _res, next) => {
  req.db = pool
  next()
})

// Routes
app.use('/api/students',      require('./routes/students'))
app.use('/api/subjects',      require('./routes/subjects'))
app.use('/api/admins',        require('./routes/admins'))
app.use('/api/results',       require('./routes/results'))
app.use('/api/notifications', require('./routes/notifications'))
app.use('/api/dashboard',     require('./routes/dashboard'))

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok', time: new Date() }))

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ error: err.message || 'Internal server error' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`))
