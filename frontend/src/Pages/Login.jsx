import { useState } from "react";
import '../App.css'
import { Link, useNavigate } from "react-router-dom";
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validasi input
    if (!email || !password) {
      setError('Email dan password wajib diisi!');
      setLoading(false);
      return;
    }

    // Dummy login dengan validasi
    setTimeout(() => {
      // Cek admin login
      if (email === 'admin@hospital.com' && password === 'admin123') {
        // Login sebagai admin
        const adminUser = {
          id: 1,
          email: 'admin@hospital.com',
          role: 'admin',
          name: 'Administrator'
        };
        localStorage.setItem('currentUser', JSON.stringify(adminUser));
        navigate('/adminDashboard');
      } else {
        // Validasi pasien terhadap daftar user terdaftar
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const user = registeredUsers.find(u => u.email === email && u.password === password);
        
        if (user) {
          // Login berhasil sebagai pasien
          const pasienUser = {
            id: user.id,
            email: user.email,
            role: 'pasien',
            name: user.name
          };
          localStorage.setItem('currentUser', JSON.stringify(pasienUser));
          navigate('/pasienDashboard');
        } else {
          // Login gagal
          setError('Email atau password tidak sesuai!');
        }
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-6xl font-bold tracking-tight text-[#232230] mb-2">
              Sistem Antrian
            </h1>
            <p className="text-xl text-[#64748b]">
              Masuk ke akun Anda untuk melanjutkan
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#232230] mb-2 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
                placeholder="nama@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#232230] mb-2 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-field "
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary btn-primary:hover flex items-center justify-center gap-2 "
            >
              {loading ? (
                'Memproses...'
              ) : (
                <>
                  <LogIn size={20} />
                  Masuk
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-[#64748b]">
              Belum punya akun?{" "}
              <Link
                to="/register"
                className="text-[#f5470d] font-medium cursor-pointer hover:underline"
              >
                Daftar sebagai Pasien 
              </Link>
            </p>
          </div>

          <div className="mt-8 p-4 bg-[#f8f9fa] rounded-sm border border-[#e2e8f0]">
            <p className="text-xs text-[#64748b] uppercase tracking-wider mb-2 font-medium">
              Admin Demo
            </p>
            <p className="text-sm text-[#232230]">
              Email: admin@hospital.com
            </p>
            <p className="text-sm text-[#232230]">
              Password: admin123
            </p>
          </div>
        </div>
      </div>

      <div
        className="hidden lg:flex flex-1 bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1580615633399-a69c661568c9?auto=format&fit=crop&w=1350&q=80)",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative z-10 p-12 flex flex-col justify-end text-white">
          <h2 className="text-5xl font-bold mb-4">
            Kelola Antrian dengan Mudah
          </h2>
          <p className="text-lg opacity-90">
            Sistem manajemen antrian pasien yang efisien untuk rumah sakit dan klinik
          </p>
        </div>
      </div>
    </div>
  );
}

