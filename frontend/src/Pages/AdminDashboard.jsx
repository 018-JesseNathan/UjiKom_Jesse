import React, { useState, useEffect } from 'react';
import { LogOut, Plus, Edit2, Trash2, RefreshCw, AlertCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { polyclinicAPI } from '../services/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  
  // State for polyclinics - loaded from backend
  const [polyclinics, setPolyclinics] = useState([]);
  const [polyclinicLoading, setPolyclinicLoading] = useState(true);
  
  // State for queues - loaded from localStorage (same data as PatientDashboard)
  const [queues, setQueues] = useState([]);
  const [queueLoading, setQueueLoading] = useState(true);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [selectedPolyclinic, setSelectedPolyclinic] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    schedule: '',
    prefix: '',
    loket: ''
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Load polyclinics from backend
  const loadPolyclinics = async () => {
    try {
      const response = await polyclinicAPI.getAll();
      if (response.data.success) {
        setPolyclinics(response.data.data);
      }
    } catch (error) {
      console.error('Error loading polyclinics:', error);
      setErrorMessage('Gagal memuat data poliklinik');
    } finally {
      setPolyclinicLoading(false);
    }
  };

  // Load polyclinics on component mount
  useEffect(() => {
    loadPolyclinics();
  }, []);

  // Load queues from localStorage
  const loadQueues = () => {
    const savedQueues = localStorage.getItem('queues');
    const parsedQueues = savedQueues ? JSON.parse(savedQueues) : [];
    setQueues(parsedQueues);
    setQueueLoading(false);
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

  // Open modal for creating new polyclinic
  const handleOpenCreateModal = () => {
    setModalMode('create');
    setSelectedPolyclinic(null);
    setFormData({
      code: '',
      name: '',
      description: '',
      schedule: '',
      prefix: '',
      loket: ''
    });
    setErrorMessage('');
    setSuccessMessage('');
    setShowModal(true);
  };

  // Open modal for editing polyclinic
  const handleOpenEditModal = (poly) => {
    setModalMode('edit');
    setSelectedPolyclinic(poly);
    setFormData({
      code: poly.code,
      name: poly.name,
      description: poly.description || '',
      schedule: poly.schedule || '',
      prefix: poly.prefix,
      loket: poly.loket
    });
    setErrorMessage('');
    setSuccessMessage('');
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPolyclinic(null);
    setFormData({
      code: '',
      name: '',
      description: '',
      schedule: '',
      prefix: '',
      loket: ''
    });
    setErrorMessage('');
    setSuccessMessage('');
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle submit (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (modalMode === 'create') {
        const response = await polyclinicAPI.create(formData);
        if (response.data.success) {
          setSuccessMessage('Poliklinik berhasil ditambahkan!');
          loadPolyclinics();
          setTimeout(handleCloseModal, 1500);
        } else {
          setErrorMessage(response.data.message || 'Gagal menambahkan poliklinik');
        }
      } else {
        const response = await polyclinicAPI.update(selectedPolyclinic.id, formData);
        if (response.data.success) {
          setSuccessMessage('Poliklinik berhasil diperbarui!');
          loadPolyclinics();
          setTimeout(handleCloseModal, 1500);
        } else {
          setErrorMessage(response.data.message || 'Gagal memperbarui poliklinik');
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage(error.response?.data?.message || 'Terjadi kesalahan pada server!');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Handle delete polyclinic
  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus poliklinik ini?')) {
      return;
    }

    try {
      const response = await polyclinicAPI.delete(id);
      if (response.data.success) {
        setSuccessMessage('Poliklinik berhasil dihapus!');
        loadPolyclinics();
      } else {
        setErrorMessage(response.data.message || 'Gagal menghapus poliklinik');
      }
    } catch (error) {
      console.error('Error deleting polyclinic:', error);
      setErrorMessage(error.response?.data?.message || 'Terjadi kesalahan pada server!');
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
        {/* Success/Error Messages */}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {errorMessage}
          </div>
        )}

        {/* Kelola Poliklinik */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#232230]">Daftar Poliklinik</h2>
            <button onClick={handleOpenCreateModal} className="btn-primary flex items-center gap-2">
              <Plus size={20} />
              Tambah Poliklinik
            </button>
          </div>

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
                          <button 
                            onClick={() => handleOpenEditModal(poly)}
                            className="p-2 text-[#64748b] hover:text-[#f5470d]"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(poly.id)}
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

          {queueLoading ? (
            <p className="text-center text-[#64748b] py-6">Memuat data...</p>
          ) : polyclinics.length === 0 ? (
            <p className="text-center text-[#64748b] py-6">Tidak ada poliklinik untuk menampilkan antrian</p>
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-4">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-bold">
                {modalMode === 'create' ? 'Tambah Poliklinik' : 'Edit Poliklinik'}
              </h3>
              <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 rounded">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4">
              {errorMessage && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">
                  {errorMessage}
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Kode Poliklinik *</label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    placeholder="Contoh: POL-001"
                    className="input-field"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Nama Poliklinik *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Contoh: Poliklinik Umum"
                    className="input-field"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Deskripsi</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Deskripsi poliklinik"
                    className="input-field"
                    rows="2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Jadwal</label>
                  <input
                    type="text"
                    name="schedule"
                    value={formData.schedule}
                    onChange={handleInputChange}
                    placeholder="Contoh: Senin - Jumat, 08:00 - 16:00"
                    className="input-field"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Prefix *</label>
                    <input
                      type="text"
                      name="prefix"
                      value={formData.prefix}
                      onChange={handleInputChange}
                      placeholder="Contoh: A"
                      maxLength="5"
                      className="input-field"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Loket *</label>
                    <input
                      type="number"
                      name="loket"
                      value={formData.loket}
                      onChange={handleInputChange}
                      placeholder="1"
                      min="1"
                      className="input-field"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn-secondary"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="btn-primary flex items-center gap-2"
                >
                  {submitLoading ? 'Memproses...' : modalMode === 'create' ? 'Tambah' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

