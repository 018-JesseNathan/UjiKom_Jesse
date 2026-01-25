import React, { useState } from "react";
import { UserPlus } from "lucide-react";
import "../App.css"
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    id_number: "",
    phone: "",
    address: "",
    date_of_birth: "",
    gender: "male",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validasi semua field wajib diisi
    if (!formData.email || !formData.password || !formData.name || 
        !formData.id_number || !formData.phone || !formData.address || 
        !formData.date_of_birth) {
      setError('Semua field wajib diisi!');
      setLoading(false);
      return;
    }

    // Dummy registration (tanpa API)
    setTimeout(() => {
      // Ambil daftar user yang sudah terdaftar
      const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      
      // Cek apakah email sudah terdaftar
      const emailExists = existingUsers.find(user => user.email === formData.email);
      if (emailExists) {
        setError('Email sudah terdaftar!');
        setLoading(false);
        return;
      }

      // Buat user baru (tanpa password di storage untuk keamanan)
      const newUser = {
        id: Date.now(),
        email: formData.email,
        name: formData.name,
        password: formData.password, // Simpan password untuk validasi login
        role: 'pasien',
        id_number: formData.id_number,
        phone: formData.phone,
        address: formData.address,
        date_of_birth: formData.date_of_birth,
        gender: formData.gender,
        createdAt: new Date().toISOString()
      };

      // Simpan ke daftar user terdaftar
      existingUsers.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));

      // Alert dan arahkan ke login
      alert("Registrasi berhasil! Silakan login dengan akun Anda.");
      navigate('/');
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-[#232230] mb-2">
            Registrasi Pasien
          </h1>
          <p className="text-base text-[#64748b]">
            Lengkapi data diri Anda untuk membuat akun
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#232230] mb-2 uppercase tracking-wider">
                Nama Lengkap *
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Nama lengkap sesuai KTP"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#232230] mb-2 uppercase tracking-wider">
                Nomor KTP *
              </label>
              <input
                name="id_number"
                value={formData.id_number}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="16 digit nomor KTP"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#232230] mb-2 uppercase tracking-wider">
                Nomor Telepon *
              </label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="08xxxxxxxxxx"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#232230] mb-2 uppercase tracking-wider">
                Tanggal Lahir *
              </label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#232230] mb-2 uppercase tracking-wider ">
                Jenis Kelamin *
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="male">Laki-laki</option>
                <option value="female">Perempuan</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#232230] mb-2 uppercase tracking-wider">
                Alamat Lengkap *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows="3"
                className="input-field"
                placeholder="Alamat lengkap sesuai KTP"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#232230] mb-2 uppercase tracking-wider">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="nama@email.com"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#232230] mb-2 uppercase tracking-wider">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Minimal 6 karakter"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center gap-2 "
          >
            {loading ? "Memproses..." : (
              <>
                <UserPlus size={30} />
                Daftar
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-[#64748b]">
            Sudah punya akun?{" "}
            <Link to="/" className="text-[#f5470d] font-medium cursor-pointer hover:underline">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

