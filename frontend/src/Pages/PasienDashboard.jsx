import React, { useState } from 'react';
import { LogOut, RefreshCw, Plus } from 'lucide-react';

export default function PatientDashboard() {
    const user = {
        id: 99,
        name: 'Jesse Nathan Rickum'
      };
    
      const logout = () => {
        alert('Logout clicked');
      };

  // dummy data poliklinik
  const polyclinics = [
    {
      id: 1,
      name: 'Poliklinik Umum',
      code: 'UMUM',
      description: 'Pelayanan kesehatan umum',
      schedule: 'Senin - Jumat, 08:00 - 16:00'
    },
    {
      id: 2,
      name: 'Poliklinik Gigi',
      code: 'GIGI',
      description: 'Pelayanan kesehatan gigi',
      schedule: 'Senin - Jumat, 09:00 - 15:00'
    }
  ];

  // dummy antrian
  const [queues, setQueues] = useState([
    { id: 1, queue_number: 'A001', patient_name: 'Budi', status: 'Menunggu', patient_id: 2 },
    { id: 2, queue_number: 'A002', patient_name: 'Siti', status: 'Menunggu', patient_id: 3 }
  ]);

  const [selectedPolyclinic, setSelectedPolyclinic] = useState(1);
  const [myQueue, setMyQueue] = useState(null);
  const [loading, setLoading] = useState(false);

  const selectedPolyclinicData = polyclinics.find(p => p.id === selectedPolyclinic);

  const handleCreateQueue = () => {
    setLoading(true);

    setTimeout(() => {
      const newQueue = {
        id: Date.now(),
        queue_number: `A00${queues.length + 1}`,
        patient_name: user.name,
        status: 'Menunggu',
        patient_id: user.id
      };

      setQueues([...queues, newQueue]);
      setMyQueue(newQueue);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Header */}
      <header className="bg-white border-b border-[#e2e8f0]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#232230]">Dashboard Pasien</h1>
            <p className="text-sm text-[#64748b]">Selamat datang, {user.name}</p>
          </div>
          <button
  onClick={logout}
  className="btn-secondary flex items-center gap-2"
>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Daftar Antrian */}
          <div>
            <div className="card">
              <h2 className="text-2xl font-bold text-[#232230] mb-6">
                Daftar Antrian
              </h2>

              <label className="block text-sm font-medium mb-2 uppercase tracking-wider">
                Pilih Poliklinik
              </label>
              <select
                value={selectedPolyclinic}
                onChange={(e) => setSelectedPolyclinic(Number(e.target.value))}
                className="input-field mb-4"
              >
                {polyclinics.map(poly => (
                  <option key={poly.id} value={poly.id}>
                    {poly.name}
                  </option>
                ))}
              </select>

              {selectedPolyclinicData && (
                <div className="p-4 bg-[#f8f9fa] border rounded mb-4">
                  <p className="text-sm text-[#232230] font-medium">
                    {selectedPolyclinicData.description}
                  </p>
                  <p className="text-xs text-[#64748b] mt-1">
                    {selectedPolyclinicData.schedule}
                  </p>
                </div>
              )}

              <button
                onClick={handleCreateQueue}
                disabled={myQueue || loading}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                {myQueue ? 'Anda Sudah Terdaftar' : (
                  <>
                    <Plus size={18} />
                    Ambil Nomor Antrian
                  </>
                )}
              </button>
            </div>

            {/* Nomor Antrian Saya */}
            {myQueue && (
              <div className="card mt-6 border-l-4 border-[#f5470d]">
                <p className="text-xs uppercase tracking-wider text-[#64748b]">
                  Nomor Antrian Anda
                </p>
                <h2 className="text-6xl font-bold text-[#f5470d] mt-2">
                  {myQueue.queue_number}
                </h2>
              </div>
            )}
          </div>

          {/* Daftar Antrian */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#232230]">
                  Daftar Antrian
                </h2>
                <button className="btn-secondary flex items-center gap-2">
                  <RefreshCw size={16} />
                  Refresh
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {queues.map((queue) => (
                  <div
                    key={queue.id}
                    className={`queue-card p-4 ${
                      queue.patient_id === user.id ? 'border-l-4 border-[#10b981]' : ''
                    }`}
                  >
                    <div className="text-3xl font-bold text-[#f5470d]">
                      {queue.queue_number}
                    </div>
                    <p className="font-medium text-[#232230]">
                      {queue.patient_name}
                    </p>
                    <p className="text-xs text-[#64748b] uppercase tracking-wider">
                      {queue.status}
                    </p>
                    {queue.patient_id === user.id && (
                      <p className="text-xs text-[#10b981] mt-1">Anda</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
