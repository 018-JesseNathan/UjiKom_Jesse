# TODO - Connect Frontend with Backend for Poliklinik CRUD

## Task
Connect frontend (React) with backend (Express) using Laragon MySQL database for Admin CRUD operations on Poliklinik.

## Database Configuration (Laragon)
- Host: localhost
- User: root
- Password: (empty)
- Database: db_pasien

## Implementation Plan - COMPLETED ✓

### Backend (Express API)
1. ✓ **Create polyclinic controller** (`backend/src/controllers/polyclinicController.js`)
   - GET all polyclinics
   - GET polyclinic by ID
   - POST create new polyclinic
   - PUT update polyclinic
   - DELETE polyclinic

2. ✓ **Create polyclinic routes** (`backend/src/routes/polyclinicRoutes.js`)
   - Define API endpoints

3. ✓ **Update app.js** to include polyclinic routes

4. ✓ **Create database schema SQL** for polyclinics table

### Frontend (React)
5. ✓ **Install axios** for HTTP requests
6. ✓ **Create API service** for poliklinik operations
7. ✓ **Update AdminDashboard.jsx**:
   - Fetch polyclinics from backend
   - Add create polyclinic modal/form
   - Add edit polyclinic modal/form
   - Add delete polyclinic functionality
   - Replace hardcoded polyclinics with dynamic data

## API Endpoints
- GET `/api/poliklinik` - Get all polyclinics
- GET `/api/poliklinik/:id` - Get polyclinic by ID
- POST `/api/poliklinik` - Create new polyclinic
- PUT `/api/poliklinik/:id` - Update polyclinic
- DELETE `/api/poliklinik/:id` - Delete polyclinic

## Setup Instructions

### 1. Setup Database in Laragon
1. Open Laragon
2. Open phpMyAdmin (http://localhost/phpmyadmin)
3. Create database named `db_pasien`
4. Import or run the SQL from `backend/database_schema.sql`

### 2. Run Backend Server
```bash
cd c:/Users/ricku/UjiKom_Jesse/backend
npm install
npm run dev
```
Backend akan berjalan di http://localhost:3000

### 3. Run Frontend
```bash
cd c:/Users/ricku/UjiKom_Jesse/frontend
npm install
npm run dev
```
Frontend akan berjalan di http://localhost:5173

## Files Created/Modified

### Backend
- `backend/src/controllers/polyclinicController.js` - CRUD controller
- `backend/src/routes/polyclinicRoutes.js` - API routes
- `backend/src/app.js` - Updated with polyclinic routes
- `backend/database_schema.sql` - Database schema

### Frontend
- `frontend/src/services/api.js` - Axios API service
- `frontend/src/Pages/adminDashboard.jsx` - Full CRUD + modal
- `frontend/src/Pages/pasienDashboard.jsx` - Fetches polyclinics from backend

