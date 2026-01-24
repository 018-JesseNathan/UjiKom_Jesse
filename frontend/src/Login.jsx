import { useState } from "react";
import './App.css'
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // simulasi login
    setTimeout(() => {
      console.log({ email, password });
      setLoading(false);
      alert("Login berhasil (simulasi)");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login form */}
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

          {/* Register text (tanpa router) */}
          <div className="mt-6 text-center">
            <p className="text-sm text-[#64748b]">
              Belum punya akun?{" "}
              <span className="text-[#f5470d] font-medium cursor-pointer hover:underline">
                Daftar sebagai Pasien
              </span>
            </p>
          </div>

          {/* Admin Demo */}
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

      {/* Right side - Image */}
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
