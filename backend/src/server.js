import { default as app } from './app.js'
import { default as db } from './config/db.js'

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
        return true
        
    } catch (error) {
        console.error('Database initialization error:', error.message)
        console.error('Make sure MySQL is running and database "db_pasien" exists')
        console.error('Error code:', error.code)
        console.error('SQL state:', error.sqlState)
        return false
    }
}

// Initialize database and start server
const startServer = async () => {
    const dbReady = await initializeDatabase()
    
    if (dbReady) {
        app.listen(PORT, () => {
            console.log(`Server backend berjalan di http://localhost:${PORT}`)
        })
    } else {
        console.error('Failed to initialize database. Server not starting.')
        process.exit(1)
    }
}

startServer()

