import React, { useState, useEffect } from 'react';
import { LogOut, Plus, Edit2, Trash2, RefreshCw, AlertCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { polyclinicAPI } from '../../../backend/src/services/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  
  // State for polyclinics from backend
  const [polyclinics, setPolyclinics] = useState([]);
  const [polyclinicLoading, setPolyclinicLoading] = useState(true);
  
  // State for queues - loaded from localStorage
  const [queues, setQueues] = useState([]);
  const [queueLoading, setQueueLoading] = useState(true);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
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
  
  // Fetch polyclinics from backend
  const fetchPolyclinics = async () => {
    setPolyclinicLoading(true);
    try {
      console.log('Fetching polyclinics from API...');
      const response = await polyclinicAPI.getAll();
      console.log('API Response:', response.data);
      
      if (response.data.success) {
        setPolyclinics(response.data.data || []);
        setErrorMessage('');
      } else {
        console.error('API returned error:', response.data.message);
        setErrorMessage(response.data.message || 'Gagal memuat data poliklinik');
      }
    } catch (error) {
      console.error('Error fetching polyclinics:', error);
      console.error('Error response:', error.response?.data);
      setErrorMessage(error.response?.data?.message || 'Gagal memuat data poliklinik: ' + (error.response?.data?.error || error.message));
      setPolyclinics([]); // Ensure empty array on error
    } finally {
      setPolyclinicLoading(false);
    }
  };
  
  // Load polyclinics on mount
  useEffect(() => {
    fetchPolyclinics();
  }, []);
  
  // Load queues from localStorage
  const loadQueues = () => {
    const savedQueues = localStorage.getItem('queues');
    const parsedQueues = savedQueues ? JSON.parse(savedQueues) : [];
    setQueues(parsedQueues);
    setQueueLoading(false);
  };
  
  useEffect(() => {
    loadQueues();
  }, []);
  
  // Group queues by polyclinic_id
  const getQueByPolyclinic = (polyclinicId) => {
    return queues.filter(q => q.polyclinic_id === polyclinicId);
  };
  
  // Get queue counter for a poliklinik
  const getQueueCount = (polyclinicId) => {
    return getQueByPolyclinic(polyclinicId).length;
  };
  
  // Reset all queues
  const handleResetAll = () => {
    if (window.confirm('Apakah Anda yakin ingin mereset semua antrian? Tindakan ini tidak dapat dibatalkan.')) {
      localStorage.removeItem('queues');
      localStorage.removeItem('queueCounters');
      setQueues([]);
    }
  };
  
  // Open modal for adding new polyclinic
  const handleAddClick = () => {
    setModalMode('add');
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
    setShowModal(true);
  };
  
  // Open modal for editing polyclinic
  const handleEditClick = (poly) => {
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
    setShowModal(true);
  };
  
  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle submit (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setErrorMessage('');
    
    try {
      const data = {
        ...formData,
        loket: parseInt(formData.loket)
      };
      
      let response;
      if (modalMode === 'add') {
        response = await polyclinicAPI.create(data);
      } else {
        response = await polyclinicAPI.update(selectedPolyclinic.id, data);
      }
      
      if (response.data.success) {
        setShowModal(false);
        // Await the fetch to ensure data is refreshed before showing success
        await fetchPolyclinics();
        alert(modalMode === 'add' ? 'Poliklinik berhasil ditambahkan!' : 'Poliklinik berhasil diperbarui!');
      } else {
        setErrorMessage(response.data.message || 'Terjadi kesalahan');
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
        fetchPolyclinics();
        alert('Poliklinik berhasil dihapus!');
      } else {
        alert(response.data.message || 'Gagal menghapus poliklinik');
      }
    } catch (error) {
      console.error('Error deleting polyclinic:', error);
      alert(error.response?.data?.message || 'Terjadi kesalahan pada server!');
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
            <div className="flex gap-2">
              <button onClick={fetchPolyclinics} className="btn-secondary flex items-center gap-2" title="Refresh Data">
                <RefreshCw size={18} />
                Refresh
              </button>
              <button onClick={handleAddClick} className="btn-primary flex items-center gap-2">
                <Plus size={20} />
                Tambah Poliklinik
              </button>
            </div>
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
                      <td className="py-3 px-4 text-ce">{poly.loket}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleEditClick(poly)}
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

                {getQueByPolyclinic(poly.id).length === 0 ? (
                  <p className="text-center text-[#64748b] py-6">Belum ada antrian</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {getQueByPolyclinic(poly.id).map((q) => (
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-4">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-bold">
                {modalMode === 'add' ? 'Tambah Poliklinik' : 'Edit Poliklinik'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-[#f1f5f9] rounded">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              {errorMessage && (
                <div className="p-3 bg-[#fef2f2] text-[#ef4444] text-sm rounded">
                  {errorMessage}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium mb-1">Kode *</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                  placeholder="Contoh: POL-001"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Nama *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                  placeholder="Contoh: Poliklinik Umum"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Deskripsi</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="input-field"
                  rows="2"
                  placeholder="Deskripsi poliklinik"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Jadwal</label>
                <input
                  type="text"
                  name="schedule"
                  value={formData.schedule}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Contoh: Senin - Jumat, 08:00 - 16:00"
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
                    className="input-field"
                    required
                    maxLength="5"
                    placeholder="Contoh: A"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Loket *</label>
                  <input
                    type="number"
                    name="loket"
                    value={formData.loket}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                    min="1"
                    placeholder="Contoh: 1"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 btn-secondary"
                  disabled={submitLoading}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                  disabled={submitLoading}
                >
                  {submitLoading ? 'Memproses...' : (modalMode === 'add' ? 'Tambah' : 'Simpan')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}