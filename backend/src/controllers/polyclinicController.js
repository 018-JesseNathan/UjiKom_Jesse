import db from "../config/db.js"

// Get all polyclinics
export const getAllPolyclinics = async (req, res) => {
    try {
        const [polyclinics] = await db.query(
            'SELECT * FROM polyclinics ORDER BY id ASC'
        )
        res.json({ success: true, data: polyclinics })
    } catch (error) {
        console.error('Error getAllPolyclinics:', error)
        res.status(500).json({ 
            success: false, 
            message: 'Terjadi kesalahan pada server!' 
        })
    }
}

// Get polyclinic by ID
export const getPolyclinicById = async (req, res) => {
    try {
        const { id } = req.params
        const [polyclinics] = await db.query(
            'SELECT * FROM polyclinics WHERE id = ?',
            [id]
        )

        if (polyclinics.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Poliklinik tidak ditemukan!' 
            })
        }

        res.json({ success: true, data: polyclinics[0] })
    } catch (error) {
        console.error('Error getPolyclinicById:', error)
        res.status(500).json({ 
            success: false, 
            message: 'Terjadi kesalahan pada server!' 
        })
    }
}

// Create new polyclinic
export const createPolyclinic = async (req, res) => {
    try {
        console.log('Received data:', req.body);
        const { code, name, description, schedule, prefix, loket } = req.body

        if (!code || !name || !prefix || !loket) {
            return res.status(400).json({ 
                success: false, 
                message: 'Kode, Nama, Prefix, dan Loket wajib diisi!',
                received: req.body
            })
        }

        // Check if code already exists
        const [existing] = await db.query(
            'SELECT * FROM polyclinics WHERE code = ?',
            [code]
        )

        if (existing.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Kode poliklinik sudah digunakan!' 
            })
        }

        const [result] = await db.query(
            `INSERT INTO polyclinics (code, name, description, schedule, prefix, loket) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [code, name, description || '', schedule || '', prefix, loket]
        )

        const newId = result.insertId
        const [newPolyclinic] = await db.query(
            'SELECT * FROM polyclinics WHERE id = ?',
            [newId]
        )

        res.status(201).json({
            success: true,
            message: 'Poliklinik berhasil ditambahkan!',
            data: newPolyclinic[0]
        })

    } catch (error) {
        console.error('Error createPolyclinic:', error)
        res.status(500).json({ 
            success: false, 
            message: 'Terjadi kesalahan pada server!' 
        })
    }
}

// Update polyclinic
export const updatePolyclinic = async (req, res) => {
    try {
        const { id } = req.params
        const { code, name, description, schedule, prefix, loket } = req.body

        if (!code || !name || !prefix || !loket) {
            return res.status(400).json({ 
                success: false, 
                message: 'Kode, Nama, Prefix, dan Loket wajib diisi!' 
            })
        }

        // Check if polyclinic exists
        const [existing] = await db.query(
            'SELECT * FROM polyclinics WHERE id = ?',
            [id]
        )

        if (existing.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Poliklinik tidak ditemukan!' 
            })
        }

        // Check if code is used by another polyclinic
        const [codeCheck] = await db.query(
            'SELECT * FROM polyclinics WHERE code = ? AND id != ?',
            [code, id]
        )

        if (codeCheck.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Kode poliklinik sudah digunakan oleh poliklinik lain!' 
            })
        }

        await db.query(
            `UPDATE polyclinics SET code = ?, name = ?, description = ?, schedule = ?, prefix = ?, loket = ? 
             WHERE id = ?`,
            [code, name, description || '', schedule || '', prefix, loket, id]
        )

        const [updatedPolyclinic] = await db.query(
            'SELECT * FROM polyclinics WHERE id = ?',
            [id]
        )

        res.json({
            success: true,
            message: 'Poliklinik berhasil diperbarui!',
            data: updatedPolyclinic[0]
        })

    } catch (error) {
        console.error('Error updatePolyclinic:', error)
        res.status(500).json({ 
            success: false, 
            message: 'Terjadi kesalahan pada server!' 
        })
    }
}

// Delete polyclinic
export const deletePolyclinic = async (req, res) => {
    try {
        const { id } = req.params

        // Check if polyclinic exists
        const [existing] = await db.query(
            'SELECT * FROM polyclinics WHERE id = ?',
            [id]
        )

        if (existing.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Poliklinik tidak ditemukan!' 
            })
        }

        await db.query('DELETE FROM polyclinics WHERE id = ?', [id])

        res.json({
            success: true,
            message: 'Poliklinik berhasil dihapus!'
        })

    } catch (error) {
        console.error('Error deletePolyclinic:', error)
        res.status(500).json({ 
            success: false, 
            message: 'Terjadi kesalahan pada server!' 
        })
    }
}

