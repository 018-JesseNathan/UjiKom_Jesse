import app from './app.js'
import db from './config/db.js'

const PORT = 3000

// Initialize database tables
const initializeDatabase = async () => {
    try {
        console.log('Checking database connection...')
        await db.query('SELECT 1')
        console.log('Database connected successfully')
        
        console.log('Creating polyclinics table if not exists...')
        await db.query(`
            CREATE TABLE IF NOT EXISTS polyclinics (
                id INT AUTO_INCREMENT PRIMARY KEY,
                code VARCHAR(50) NOT NULL UNIQUE,
                name VARCHAR(100) NOT NULL,
                description TEXT,
                schedule VARCHAR(255),
                prefix VARCHAR(10) NOT NULL,
                loket INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `)
        console.log('Polyclinics table ready')
        
        // Check if table has data
        const [polyclinics] = await db.query('SELECT COUNT(*) as count FROM polyclinics')
        if (polyclinics[0].count === 0) {
            console.log('Adding sample polyclinic data...')
            await db.query(`
                INSERT INTO polyclinics (code, name, description, schedule, prefix, loket) VALUES
                ('POL-001', 'Poliklinik Umum', 'Pelayanan kesehatan umum', 'Senin - Jumat, 08:00 - 16:00', 'A', 1),
                ('POL-002', 'Poliklinik Gigi', 'Pelayanan kesehatan gigi', 'Senin - Kamis, 09:00 - 14:00', 'B', 2),
                ('POL-003', 'Poliklinik Anak', 'Pelayanan kesehatan bayi dan anak', 'Senin - Jumat, 08:00 - 14:00', 'C', 3)
            `)
            console.log('Sample data added')
        }
        
    } catch (error) {
        console.error('Database initialization error:', error.message)
        console.error('Make sure MySQL is running and database "db_pasien" exists')
    }
}

// Initialize database and start server
initializeDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Server backend berjalan di http://localhost:${PORT}`)
    })
})

