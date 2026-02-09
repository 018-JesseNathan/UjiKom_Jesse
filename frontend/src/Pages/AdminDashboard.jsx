import React, { useState, useEffect } from 'react';
import { LogOut, Plus, RefreshCw, AlertCircle, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { polyclinicAPI } from '../../../backend/src/services/api';
import PolyclinicTable from '../Components/PolyclinicTable';
import PolyclinicModal from '../Components/PolyclinicModal';

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
  const [modalMode, setModalMode] = useState('add');  
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
          <div className="flex gap-2">
            <button onClick={() => navigate('/')} className="btn-secondary flex items-center gap-2">
              <LogOut size={18} />
              Keluar
            </button>
          </div>
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

          <PolyclinicTable
            polyclinics={polyclinics}
            polyclinicLoading={polyclinicLoading}
            onEdit={handleEditClick}
            onDelete={handleDelete}
          />
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
      <PolyclinicModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        mode={modalMode}
        formData={formData}
        onInputChange={handleInputChange}
        loading={submitLoading}
        error={errorMessage}
      />
    </div>
  );
}
