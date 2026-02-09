import React from 'react';
import { X } from 'lucide-react';

export default function PolyclinicModal({
  isOpen,
  onClose,
  onSubmit,
  mode,
  formData,
  onInputChange,
  loading,
  error
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-bold">
            {mode === 'add' ? 'Tambah Poliklinik' : 'Edit Poliklinik'}
          </h3>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-[#f1f5f9] rounded"
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={onSubmit} className="p-4 space-y-4">
          {error && (
            <div className="p-3 bg-[#fef2f2] text-[#ef4444] text-sm rounded">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium mb-1">Kode *</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={onInputChange}
              className="input-field"
              required
              placeholder="Contoh: POL-001"
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Nama *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={onInputChange}
              className="input-field"
              required
              placeholder="Contoh: Poliklinik Umum"
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Deskripsi</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={onInputChange}
              className="input-field"
              rows="2"
              placeholder="Deskripsi poliklinik"
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Jadwal</label>
            <input
              type="text"
              name="schedule"
              value={formData.schedule}
              onChange={onInputChange}
              className="input-field"
              placeholder="Contoh: Senin - Jumat, 08:00 - 16:00"
              disabled={loading}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Prefix *</label>
              <input
                type="text"
                name="prefix"
                value={formData.prefix}
                onChange={onInputChange}
                className="input-field"
                required
                maxLength="5"
                placeholder="Contoh: A"
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Loket *</label>
              <input
                type="number"
                name="loket"
                value={formData.loket}
                onChange={onInputChange}
                className="input-field"
                required
                min="1"
                placeholder="Contoh: 1"
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary"
              disabled={loading}
            >
              {loading ? 'Memproses...' : (mode === 'add' ? 'Tambah' : 'Simpan')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

