import React, { useState, useEffect } from 'react';
import { LogOut, Plus, Edit2, Trash2, RefreshCw, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();
  // Polyclinics configuration - same as PatientDashboard
  const polyclinics = [
    { id: 1, code: 'POL-001', name: 'Poliklinik Umum', description: 'Pelayanan kesehatan umum', schedule: 'Senin - Jumat, 08:00 - 16:00', prefix: 'A', loket: 1 },
    { id: 2, code: 'POL-002', name: 'Poliklinik Gigi', description: 'Pelayanan kesehatan gigi', schedule: 'Senin - Kamis, 09:00 - 14:00', prefix: 'B', loket: 2 },
    { id: 3, code: 'POL-003', name: 'Poliklinik Anak', description: 'Pelayanan kesehatan bayi dan anak', schedule: 'Senin - Jumat, 08:00 - 14:00', prefix: 'C', loket: 3 },
    { id: 4, code: 'POL-004', name: 'Poliklinik Mata', description: 'Pelayanan kesehatan mata', schedule: 'Senin - Jumat, 09:00 - 16:00', prefix: 'D', loket: 4 },
    { id: 5, code: 'POL-005', name: 'Poliklinik Kandungan', description: 'Pelayanan kesehatan ibu hamil', schedule: 'Senin - Jumat, 08:00 - 15:00', prefix: 'E', loket: 5 }
  ];

  // State for queues - loaded from localStorage (same data as PatientDashboard)
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load queues from localStorage
  const loadQueues = () => {
    const savedQueues = localStorage.getItem('queues');
    const parsedQueues = savedQueues ? JSON.parse(savedQueues) : [];
    setQueues(parsedQueues);
    setLoading(false);
  };

  // Load queues on component mount
  useEffect(() => {
    loadQueues();
  }, []);

  // Group queues by polyclinic_id
  const getQueuesByPolyclinic = (polyclinicId) => {
    return queues.filter(q => q.polyclinic_id === polyclinicId);
  };

  // Get queue counter for a poliklinik
  const getQueueCount = (polyclinicId) => {
    return getQueuesByPolyclinic(polyclinicId).length;
  };

  // Reset all queues
  const handleResetAll = () => {
    if (window.confirm('Apakah Anda yakin ingin mereset semua antrian? Tindakan ini tidak dapat dibatalkan.')) {
      localStorage.removeItem('queues');
      localStorage.removeItem('queueCounters');
      setQueues([]);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Header */}
      <header className="bg-white border-b border-[#e2e8f0]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#232230]">Dashboard Admin</h1>
            <p className="text-sm text-[#64748b]">Mode Tampilan - Sinkron dengan PatientDashboard</p>
          </div>
          <button onClick={() => navigate('/')} className="btn-secondary flex items-center gap-2">
            <LogOut size={18} />
            Keluar
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-12">
        {/* Kelola Poliklinik */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#232230]">Daftar Poliklinik</h2>
            <button className="btn-primary flex items-center gap-2">
              <Plus size={20} />
              Tambah Poliklinik
            </button>
          </div>

          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-xs uppercase">Kode</th>
                  <th className="text-left py-3 px-4 text-xs uppercase">Nama</th>
                  <th className="text-left py-3 px-4 text-xs uppercase">Deskripsi</th>
                  <th className="text-left py-3 px-4 text-xs uppercase">Jadwal</th>
                  <th className="text-right py-3 px-4 text-xs uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {polyclinics.map((poly) => (
                  <tr key={poly.id} className="border-b hover:bg-[#f1f5f9]">
                    <td className="py-3 px-4 font-mono">{poly.code}</td>
                    <td className="py-3 px-4 font-medium">{poly.name}</td>
                    <td className="py-3 px-4 text-sm text-[#64748b]">{poly.description}</td>
                    <td className="py-3 px-4 text-sm text-[#64748b]">{poly.schedule}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 text-[#64748b] hover:text-[#f5470d]">
                          <Edit2 size={18} />
                        </button>
                        <button className="p-2 text-[#64748b] hover:text-[#ef4444]">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Antrian */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#232230]">Antrian Hari Ini</h2>
            <div className="flex gap-3">
              <button onClick={loadQueues} className="btn-secondary flex items-center gap-2">
                <RefreshCw size={18} />
                Refresh
              </button>
              <button onClick={handleResetAll} className="btn-primary bg-[#ef4444] flex items-center gap-2">
                <AlertCircle size={18} />
                Reset Semua
              </button>
            </div>
          </div>

          {loading ? (
            <p className="text-center text-[#64748b] py-6">Memuat data...</p>
          ) : (
            polyclinics.map((poly) => (
              <div key={poly.id} className="card mb-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{poly.name}</h3>
                    <p className="text-sm text-[#64748b]">{poly.code}</p>
                  </div>
                  <span className="text-sm">Total: <b>{getQueueCount(poly.id)}</b> antrian</span>
                </div>

                {getQueuesByPolyclinic(poly.id).length === 0 ? (
                  <p className="text-center text-[#64748b] py-6">Belum ada antrian</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {getQueuesByPolyclinic(poly.id).map((q) => (
                      <div key={q.id} className="queue-card p-4">
                        <div className="text-3xl font-bold text-[#f5470d]">{q.queue_number}</div>
                        <p className="font-medium">{q.patient_name}</p>
                        <p className="text-xs uppercase text-[#64748b]">{q.status}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

