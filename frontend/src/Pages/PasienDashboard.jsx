import React, { useState, useEffect, useRef } from 'react';
import { LogOut, Plus } from 'lucide-react';
import "../App.css"
import { useNavigate } from "react-router-dom";
import { polyclinicAPI } from '../../../backend/src/services/api';

export default function PatientDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [polyclinics, setPolyclinics] = useState([]);
  const [polyclinicLoading, setPolyclinicLoading] = useState(true);
  
  // Use ref to track if this is the initial mount
  const isInitialMount = useRef(true);
  
  // Track queue count per poliklinik - load from localStorage
  const [queueCounters, setQueueCounters] = useState(() => {
    const savedCounters = localStorage.getItem('queueCounters');
    return savedCounters ? JSON.parse(savedCounters) : {};
  });

  // Load queues from localStorage on initial render
  const [queues, setQueues] = useState(() => {
    const savedQueues = localStorage.getItem('queues');
    return savedQueues ? JSON.parse(savedQueues) : [];
  });
  
  // Load myQueue from localStorage on initial render
  const [myQueue, setMyQueue] = useState(() => {
    const savedMyQueue = localStorage.getItem('myQueue');
    if (savedMyQueue) {
      const parsed = JSON.parse(savedMyQueue);
      // Check if this queue still exists in the queues list
      const savedQueues = localStorage.getItem('queues');
      if (savedQueues) {
        const queues = JSON.parse(savedQueues);
        const queueExists = queues.some(q => q.id === parsed.id);
        if (queueExists) {
          return parsed;
        }
      }
    }
    return null;
  });
  const [selectedPolyclinic, setSelectedPolyclinic] = useState(1);
  const [queueLoading, setQueueLoading] = useState(false);

  // Fetch polyclinics from backend
  const fetchPolyclinics = async () => {
    try {
      const response = await polyclinicAPI.getAll();
      if (response.data.success && response.data.data.length > 0) {
        setPolyclinics(response.data.data);
        // Only set selectedPolyclinic if it's not already set
        if (!selectedPolyclinic) {
          setSelectedPolyclinic(response.data.data[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching polyclinics:', error);
    } finally {
      setPolyclinicLoading(false);
    }
  };

  useEffect(() => {
    fetchPolyclinics();
  }, []); // Empty dependency - only fetch on mount

  // Save myQueue to localStorage whenever it changes
  useEffect(() => {
    if (myQueue) {
      localStorage.setItem('myQueue', JSON.stringify(myQueue));
    } else {
      localStorage.removeItem('myQueue');
    }
  }, [myQueue]);

  // Save queues to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('queues', JSON.stringify(queues));
  }, [queues]);

  // Save queue counters to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('queueCounters', JSON.stringify(queueCounters));
  }, [queueCounters]);

  // Listen for storage changes (when admin resets queues from another tab/window)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'queues') {
        const newQueues = e.newValue ? JSON.parse(e.newValue) : [];
        setQueues(newQueues);
        
        // Check if user's queue still exists after reset
        if (myQueue) {
          const queueStillExists = newQueues.some(q => q.id === myQueue.id);
          if (!queueStillExists) {
            setMyQueue(null);
            localStorage.removeItem('myQueue');
          }
        }
      }
      if (e.key === 'queueCounters') {
        const newCounters = e.newValue ? JSON.parse(e.newValue) : {};
        setQueueCounters(newCounters);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [myQueue]);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    
    if (!currentUser) {
      // Tidak ada user yang login, redirect ke login
      navigate('/');
    } else if (currentUser.role !== 'pasien') {
      // User login tapi bukan pasien, redirect ke halaman yang sesuai
      if (currentUser.role === 'admin') {
        navigate('/adminDashboard');
      } else {
        navigate('/');
      }
    } else {
      // User adalah pasien yang valid
      setUser(currentUser);
    }
    setLoading(false);
  }, [navigate]);

  // Reset personal queue data when user changes (for new user login without refresh)
  useEffect(() => {
    // Skip the initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    // User changed, reset personal queue data only (keep shared queues)
    if (user) {
      setMyQueue(null);
    }
  }, [user]);

  const logout = () => {
    // Only clear personal queue data, NOT the shared queue state
    setMyQueue(null);
    localStorage.removeItem('myQueue');
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  const handleCreateQueue = () => {
    if (polyclinics.length === 0) {
      alert('Tidak ada poliklinik tersedia');
      return;
    }
    
    setQueueLoading(true);
    setTimeout(() => {
      const polyclinicData = polyclinics.find(p => p.id === selectedPolyclinic);
      const currentCounter = queueCounters[selectedPolyclinic] || 1;
      const queueNumber = `${polyclinicData.prefix}${String(currentCounter).padStart(3, '0')}`;
      
      const newQueue = {
        id: Date.now(),
        queue_number: queueNumber,
        patient_name: user.name,
        status: 'Menunggu',
        patient_id: user.id,
        polyclinic_id: selectedPolyclinic,
        polyclinic_name: polyclinicData.name,
        loket: polyclinicData.loket
      };
      
      setQueues([...queues, newQueue]);
      setMyQueue(newQueue);
      setQueueCounters({
        ...queueCounters,
        [selectedPolyclinic]: currentCounter + 1
      });
      setQueueLoading(false);
    }, 800);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <p className="text-[#64748b]">Memuat...</p>
      </div>
    );
  }

  const selectedPolyclinicData = polyclinics.find(p => p.id === selectedPolyclinic);

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <header className="bg-white border-b border-[#e2e8f0]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#232230]">Dashboard Pasien</h1>
            <p className="text-sm text-[#64748b]">Selamat datang, {user.name}</p>
          </div>
          <button onClick={logout} className="btn-secondary flex items-center gap-2">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {loading || polyclinicLoading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-[#64748b]">Memuat data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div>
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

              {myQueue && (
                <div className="card mt-6 border-l-4 border-[#f5470d]">
                  <p className="text-xs uppercase tracking-wider text-[#64748b]">Nomor Antrian Anda</p>
                  <h2 className="text-6xl font-bold text-[#f5470d] mt-2">{myQueue.queue_number}</h2>
                </div>
              )}
            </div>

            <div className="lg:col-span-2">
              <div className="card">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-[#232230]">Daftar Antrian</h2>
                </div>

                {queues.length === 0 ? (
                  <p className="text-center text-[#64748b] py-6">Belum ada antrian</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {queues.map((queue) => (
                      <div key={queue.id} className={`queue-card p-4 ${queue.patient_id === user.id ? 'border-l-4 border-[#10b981]' : ''}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-3xl font-bold text-[#f5470d]">{queue.queue_number}</div>
                            <p className="font-medium text-[#232230]">{queue.patient_name}</p>
                          </div>
                          <div className="text-right">
                            <span className="inline-block px-2 py-1 bg-[#e2e8f0] text-[#64748b] text-xs rounded">
                              Loket {queue.loket}
                            </span>
                            <p className="text-xs text-[#64748b] mt-1">{queue.polyclinic_name}</p>
                          </div>
                        </div>
                        <p className="text-xs text-[#64748b] uppercase tracking-wider mt-2">{queue.status}</p>
                        {queue.patient_id === user.id && <p className="text-xs text-[#10b981] mt-1">Anda</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
