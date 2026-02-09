import React from 'react';
import { Plus } from 'lucide-react';

export default function QueueRegistration({
  polyclinics,
  selectedPolyclinic,
  setSelectedPolyclinic,
  queueLoading,
  myQueue,
  handleCreateQueue
}) {
  const selectedPolyclinicData = polyclinics.find(p => p.id === selectedPolyclinic);

  return (
    <div className="card border-t-4 border-[#f5470d]">
      <h2 className="text-2xl font-bold text-[#232230] mb-6">Daftar Antrian</h2>
      <label className="block text-sm font-medium mb-2 uppercase tracking-wider">
        Pilih Poliklinik
      </label>
      <select
        value={selectedPolyclinic}
        onChange={(e) => setSelectedPolyclinic(Number(e.target.value))}
        className="input-field mb-4"
        disabled={polyclinics.length === 0}
      >
        {polyclinics.length === 0 ? (
          <option value="">Tidak ada poliklinik</option>
        ) : (
          polyclinics.map(poly => (
            <option key={poly.id} value={poly.id}>{poly.name}</option>
          ))
        )}
      </select>

      {selectedPolyclinicData && (
        <div className="p-4 bg-[#f8f9fa] border rounded mb-4">
          <p className="text-sm text-[#232230] font-medium">{selectedPolyclinicData.description}</p>
          <p className="text-xs text-[#64748b] mt-1">{selectedPolyclinicData.schedule}</p>
        </div>
      )}

      <button
        onClick={handleCreateQueue}
        disabled={myQueue || queueLoading || polyclinics.length === 0}
        className="w-full btn-primary flex items-center justify-center gap-2"
      >
        {queueLoading ? 'Memproses...' : myQueue ? 'Anda Sudah Terdaftar' : (polyclinics.length === 0 ? 'Tidak Ada Poliklinik' : (
          <><Plus size={18} /> Ambil Nomor Antrian</>
        ))}
      </button>
    </div>
  );
}

