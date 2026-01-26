// import db from "../config/db.js"

// export const registerPasien = async (req, res) => {
//     try {
//         const { email, password, name, id_number, phone, address, date_of_birth, gender } = req.body

//         if (!email || !password || !name || !id_number || !phone || !address || !date_of_birth) {
//             return res.status(400).json({ 
//                 success: false, 
//                 message: 'Semua field wajib diisi!' 
//             })
//         }

//         const [existingUsers] = await db.query(
//             'SELECT * FROM users WHERE email = ?',
//             [email]
//         )

//         if (existingUsers.length > 0) {
//             return res.status(400).json({ 
//                 success: false, 
//                 message: 'Email sudah terdaftar!' 
//             })
//         }

//         const [userResult] = await db.query(
//             'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
//             [email, password, 'pasien']
//         )

//         const userId = userResult.insertId
//         await db.query(
//             `INSERT INTO pasien (user_id, name, id_number, phone, address, date_of_birth, gender) 
//              VALUES (?, ?, ?, ?, ?, ?, ?)`,
//             [userId, name, id_number, phone, address, date_of_birth, gender]
//         )

//         res.status(201).json({
//             success: true,
//             message: 'Registrasi berhasil!',
//             data: { id: userId, email, name }
//         })

//     } catch (error) {
//         console.error('Error register:', error)
//         res.status(500).json({ 
//             success: false, 
//             message: 'Terjadi kesalahan pada server!' 
//         })
//     }
// }

// export const loginPasien = async (req, res) => {
//     try {
//         const { email, password } = req.body

//         if (!email || !password) {
//             return res.status(400).json({ 
//                 success: false, 
//                 message: 'Email dan password wajib diisi!' 
//             })
//         }

//         const [users] = await db.query(
//             'SELECT u.id, u.email, u.role, p.name, p.id_number, p.phone, p.address, p.date_of_birth, p.gender FROM users u LEFT JOIN pasien p ON u.id = p.user_id WHERE u.email = ? AND u.password = ?',
//             [email, password]
//         )

//         if (users.length === 0) {
//             return res.status(401).json({ 
//                 success: false, 
//                 message: 'Email atau password tidak sesuai!' 
//             })
//         }

//         const user = users[0]
//         const { password: _, ...userWithoutPassword } = user

//         res.json({
//             success: true,
//             message: 'Login berhasil!',
//             data: userWithoutPassword
//         })

//     } catch (error) {
//         console.error('Error login:', error)
//         res.status(500).json({ 
//             success: false, 
//             message: 'Terjadi kesalahan pada server!' 
//         })
//     }
// }

// export const getPasienById = async (req, res) => {
//     try {
//         const { id } = req.params
//         const [patients] = await db.query(
//             `SELECT p.*, u.email FROM pasien p JOIN users u ON p.user_id = u.id WHERE p.id = ?`,
//             [id]
//         )

//         if (patients.length === 0) {
//             return res.status(404).json({ 
//                 success: false, 
//                 message: 'Pasien tidak ditemukan!' 
//             })
//         }

//         res.json({ success: true, data: patients[0] })
//     } catch (error) {
//         console.error('Error getPasienById:', error)
//         res.status(500).json({ 
//             success: false, 
//             message: 'Terjadi kesalahan pada server!' 
//         })
//     }
// }

// export const getAllPasien = async (req, res) => {
//     try {
//         const [patients] = await db.query(
//             `SELECT p.id, p.name, p.id_number, p.phone, p.address, p.date_of_birth, p.gender, u.email 
//              FROM pasien p JOIN users u ON p.user_id = u.id ORDER BY p.id DESC`
//         )

//         res.json({ success: true, data: patients })
//     } catch (error) {
//         console.error('Error getAllPasien:', error)
//         res.status(500).json({ 
//             success: false, 
//             message: 'Terjadi kesalahan pada server!' 
//         })
//     }
// }

