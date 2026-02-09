  # Aplikasi Antrian Pasien Poliklinik

Aplikasi web full-stack untuk mengelola antrian pasien di poliklinik. Aplikasi ini memungkinkan admin untuk mengelola data poliklinik dan pasien untuk mendaftar antrian.

## Fitur

- **Autentikasi Pengguna**: Registrasi dan login untuk admin dan pasien
- **Dashboard Admin**: Mengelola poliklinik (tambah, edit, hapus, lihat)
- **Dashboard Pasien**: Mendaftar antrian ke poliklinik
- **Manajemen Poliklinik**: CRUD operations untuk data poliklinik
- **Antarmuka Responsif**: Menggunakan Tailwind CSS untuk UI yang modern

## Teknologi yang Digunakan

### Backend
- **Node.js** dengan **Express.js** untuk server API
- **MySQL** sebagai database
- **CORS** untuk cross-origin requests

### Frontend
- **React** dengan **Vite** sebagai build tool
- **React Router** untuk routing
- **Tailwind CSS** untuk styling
- **Axios** untuk HTTP requests
- **Lucide React** untuk ikon

## Struktur Proyek

```
UjiKom_Jesse/
├── backend/
│   ├── src/
│   │   ├── app.js              # Konfigurasi Express app
│   │   ├── server.js           # Entry point server
│   │   ├── config/
│   │   │   └── db.js           # Konfigurasi database MySQL
│   │   ├── controllers/
│   │   │   └── polyclinicController.js  # Controller untuk poliklinik
│   │   ├── routes/
│   │   │   └── polyclinicRoutes.js      # Routes API poliklinik
│   │   └── services/
│   │       └── api.js          # Service layer (jika ada)
│   ├── package.json
│   └── package-lock.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx             # Komponen utama dengan routing
│   │   ├── main.jsx            # Entry point React
│   │   ├── Pages/
│   │   │   ├── Login.jsx       # Halaman login
│   │   │   ├── Register.jsx    # Halaman registrasi
│   │   │   ├── AdminDashboard.jsx  # Dashboard admin
│   │   │   └── PasienDashboard.jsx  # Dashboard pasien
│   │   ├── Components/
│   │   │   ├── PolyclinicTable.jsx   # Tabel poliklinik
│   │   │   ├── PolyclinicModal.jsx   # Modal untuk CRUD poliklinik
│   │   │   └── QueueRegistration.jsx # Komponen registrasi antrian
│   │   └── assets/
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
└── README.md
```

## Instalasi

### Prasyarat
- Node.js (versi 16 atau lebih baru)
- MySQL Server
- npm atau yarn

### Langkah Instalasi

1. **Clone repository ini:**
   ```bash
   git clone <repository-url>
   cd UjiKom_Jesse
   ```

2. **Setup Database:**
   - Buat database MySQL dengan nama `db_pasien`
   - Buat tabel `polyclinics` dengan struktur berikut:
     ```sql
     CREATE TABLE polyclinics (
       id INT AUTO_INCREMENT PRIMARY KEY,
       code VARCHAR(10) NOT NULL UNIQUE,
       name VARCHAR(100) NOT NULL,
       description TEXT,
       schedule VARCHAR(255),
       prefix VARCHAR(10) NOT NULL,
       loket INT NOT NULL
     );
     ```

3. **Install dependencies Backend:**
   ```bash
   cd backend
   npm install
   ```

4. **Install dependencies Frontend:**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Konfigurasi Database:**
   - Pastikan MySQL server berjalan
   - Update konfigurasi database di `backend/src/config/db.js` jika diperlukan

## Menjalankan Aplikasi

1. **Jalankan Backend:**
   ```bash
   cd backend
   npm run dev
   ```
   Server akan berjalan di `http://localhost:3000` (atau port yang dikonfigurasi)

2. **Jalankan Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```
   Aplikasi akan berjalan di `http://localhost:5173` (default Vite)

## API Endpoints

### Poliklinik
- `GET /api/polyclinics` - Mendapatkan semua poliklinik
- `GET /api/polyclinics/:id` - Mendapatkan poliklinik berdasarkan ID
- `POST /api/polyclinics` - Membuat poliklinik baru
- `PUT /api/polyclinics/:id` - Update poliklinik
- `DELETE /api/polyclinics/:id` - Hapus poliklinik

### Request Body untuk POST/PUT
```json
{
  "code": "UMUM",
  "name": "Poliklinik Umum",
  "description": "Pelayanan kesehatan umum",
  "schedule": "Senin-Jumat 08:00-16:00",
  "prefix": "A",
  "loket": 1
}
```

## Penggunaan

1. **Login/Register**: Akses aplikasi melalui halaman login atau registrasi
2. **Admin Dashboard**: Kelola data poliklinik (tambah, edit, hapus)
3. **Pasien Dashboard**: Pilih poliklinik dan daftar antrian

## Kontribusi

1. Fork repository
2. Buat branch fitur baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## Lisensi

Distributed under the ISC License. See `LICENSE` for more information.
