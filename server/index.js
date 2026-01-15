import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import todoRoutes from './routes/todoRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/todos', todoRoutes)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' })
})

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI 

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to DB')
    // Start server only after DB connection
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`)
    })
  })
  .catch((error) => {
    console.error('DB connection error:', error)
    process.exit(1)
  })

export default app
