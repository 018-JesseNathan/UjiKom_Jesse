import React, { useState, useEffect, useRef } from 'react';
import { LogOut, RefreshCw, Plus } from 'lucide-react';
import "../App.css"
import { useNavigate } from "react-router-dom";

export default function PatientDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Use ref to track if this is the initial mount
  const isInitialMount = useRef(true);
  
  const polyclinics = [
    { id: 1, name: 'Poliklinik Umum', prefix: 'A', loket: 1, description: 'Pelayanan kesehatan umum', schedule: 'Senin - Jumat, 08:00 - 16:00' },
    { id: 2, name: 'Poliklinik Gigi', prefix: 'B', loket: 2, description: 'Pelayanan kesehatan gigi', schedule: 'Senin - Jumat, 09:00 - 15:00' },
    { id: 3, name: 'Poliklinik Anak', prefix: 'C', loket: 3, description: 'Pelayanan kesehatan bayi dan anak', schedule: 'Senin - Jumat, 08:00 - 14:00' },
    { id: 4, name: 'Poliklinik Mata', prefix: 'D', loket: 4, description: 'Pelayanan kesehatan mata', schedule: 'Senin - Jumat, 09:00 - 16:00' },
    { id: 5, name: 'Poliklinik Kandungan', prefix: 'E', loket: 5, description: 'Pelayanan kesehatan ibu hamil', schedule: 'Senin - Jumat, 08:00 - 15:00' }
  ];

  // Track queue count per poliklinik - load from localStorage
  const [queueCounters, setQueueCounters] = useState(() => {
    const savedCounters = localStorage.getItem('queueCounters');
    return savedCounters ? JSON.parse(savedCounters) : {
      1: 1, // A
      2: 1, // B
      3: 1, // C
      4: 1, // D
      5: 1  // E
    };
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
        const newCounters = e.newValue ? JSON.parse(e.newValue) : {
          1: 1, 2: 1, 3: 1, 4: 1, 5: 1
        };
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
    setQueueLoading(true);
    setTimeout(() => {
      const polyclinicData = polyclinics.find(p => p.id === selectedPolyclinic);
      const currentCounter = queueCounters[selectedPolyclinic];
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
        {loading ? (
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
                >
                  {polyclinics.map(poly => (
                    <option key={poly.id} value={poly.id}>{poly.name}</option>
                  ))}
                </select>

                {selectedPolyclinicData && (
                  <div className="p-4 bg-[#f8f9fa] border rounded mb-4">
                    <p className="text-sm text-[#232230] font-medium">{selectedPolyclinicData.description}</p>
                    <p className="text-xs text-[#64748b] mt-1">{selectedPolyclinicData.schedule}</p>
                  </div>
                )}

                <button
                  onClick={handleCreateQueue}
                  disabled={myQueue || queueLoading}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  {queueLoading ? 'Memproses...' : myQueue ? 'Anda Sudah Terdaftar' : (
                    <><Plus size={18} /> Ambil Nomor Antrian</>
                  )}
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
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-[#232230]">Daftar Antrian</h2>
                  <button onClick={() => window.location.reload()} className="btn-secondary flex items-center gap-2">
                    <RefreshCw size={16} /> Refresh
                  </button>
                </div>

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
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

