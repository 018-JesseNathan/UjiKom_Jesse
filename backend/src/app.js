import express from 'express'
import cors from 'cors'
import polyclinicRoutes from './routes/polyclinicRoutes.js'
import db from './config/db.js'

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api', polyclinicRoutes)

// Test database connection
app.get('/api/test-db', async (req, res) => {
  try {
    const [result] = await db.query('SELECT 1 as test');
    res.json({ success: true, message: 'Database connected!', data: result });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ success: false, message: 'Database connection failed!', error: error.message });
  }
});

// Test if polyclinics table exists
app.get('/api/test-table', async (req, res) => {
  try {
    const [tables] = await db.query('SHOW TABLES');
    res.json({ success: true, tables });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ success: false, message: 'Failed to get tables', error: error.message });
  }
});

app.get('/', (req, res) => {
    res.json({ message: 'Server berjalan dengan baik!', status: 'OK' })
})

app.use((req, res) => {
    res.status(404).json({ message: 'Route tidak ditemukan!' })
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ message: 'Terjadi kesalahan pada server!' })
})

export default app

