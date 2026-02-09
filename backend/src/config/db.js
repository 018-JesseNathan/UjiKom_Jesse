import mysql from "mysql2/promise"

const db = mysql.createPool({
    host: "localhost",
    port: 3306,
    user: 'root',
    password: '',
    database: 'db_pasien',
    
})

export default db

