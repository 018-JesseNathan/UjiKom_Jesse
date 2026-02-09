import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

export default function PolyclinicTable({
  polyclinics,
  polyclinicLoading,
  onEdit,
  onDelete
}) {
  return (
    <div className="card overflow-x-auto">
      {polyclinicLoading ? (
        <p className="text-center text-[#64748b] py-6">Memuat data...</p>
      ) : polyclinics.length === 0 ? (
        <p className="text-center text-[#64748b] py-6">Belum ada poliklinik</p>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 text-xs uppercase">Kode</th>
              <th className="text-left py-3 px-4 text-xs uppercase">Nama</th>
              <th className="text-left py-3 px-4 text-xs uppercase">Deskripsi</th>
              <th className="text-left py-3 px-4 text-xs uppercase">Jadwal</th>
              <th className="text-center py-3 px-4 text-xs uppercase">Prefix</th>
              <th className="text-center py-3 px-4 text-xs uppercase">Loket</th>
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
                <td className="py-3 px-4 text-center">{poly.prefix}</td>
                <td className="py-3 px-4 text-center">{poly.loket}</td>
                <td className="py-3 px-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => onEdit(poly)}
                      className="p-2 text-[#64748b] hover:text-[#f5470d]"
                    >   
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => onDelete(poly.id)}
                      className="p-2 text-[#64748b] hover:text-[#ef4444]"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

