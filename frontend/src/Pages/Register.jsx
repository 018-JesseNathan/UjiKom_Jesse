import React, { useState } from "react";
import { UserPlus } from "lucide-react";
import "./App.css"

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // simulasi register
    setTimeout(() => {
      console.log("DATA REGISTER:", formData);
      setLoading(false);
      alert("Registrasi berhasil (simulasi)");
    }, 1500);
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

        {/* tanpa router */}
        <div className="mt-6 text-center">
          <p className="text-sm text-[#64748b]">
            Sudah punya akun?{" "}
            <span className="text-[#f5470d] font-medium cursor-pointer hover:underline">
              Masuk
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
