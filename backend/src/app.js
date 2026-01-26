import express from 'express'
import cors from 'cors'
import polyclinicRoutes from './routes/polyclinicRoutes.js'

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api', polyclinicRoutes)

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

