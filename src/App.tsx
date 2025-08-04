// src/App.tsx

import React, { useState, useEffect } from 'react';
import { User } from './types/index.ts';
import Login from './components/Login.tsx';
import Sidebar from './components/Sidebar.tsx';
import SatisOranlari from './components/SatisOranlari.tsx';
// DEĞİŞİKLİK: KategorikGidisat bileşenini tekrar import ediyoruz.
import KategorikGidisat from './components/KategorikGidisat.tsx';
import CografiAnalizNew from './components/CografiAnalizNew.tsx';
import StokTahmin from './components/StokTahmin.tsx';
import { TrendingUp, MapPin, Package } from 'lucide-react';
import UrunYonetimi from './components/UrunYonetimi.tsx';

const initialDataState = {
  toplamSatis: 0,
  kritikStok: 0,
  bolgeSayisi: 0,
  satisOranlari: [],
  detayliAnaliz: [],
  // YENİ EKLENEN BÖLÜM:
  stokTahminDetaylari: {
    kritikStokSayisi: 0,
    normalStokSayisi: 0,
    toplamCiroFarki: 0,
    urunListesi: [],
  },
    cografiAnalizDetaylari: {
    toplamBolge: 0,
    toplamHacim: 0,
    bolgeDetaylari: [], // Sadece bu tek liste yeterli
  },
  sidebarKategoriSayilari: [],
};

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(initialDataState);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/dashboard_data.json');
        if (!response.ok) {
          throw new Error(`Veri dosyası bulunamadı veya sunucu hatası: ${response.status}`);
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (e: any) {
        console.error("Veri yüklenirken hata oluştu:", e);
        setError("Dashboard verileri yüklenemedi. 'analyze_electronics.py' script'ini çalıştırdığınızdan emin olun.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setError(null);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveSection('dashboard');
    setError(null);
  };
  
  const renderContent = () => {
    if (isLoading) {
      return <div className="flex items-center justify-center h-full text-lg text-gray-500">Veriler Yükleniyor...</div>;
    }
    if (error) {
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Hata!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      );
    }
    
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Üst Kartlar (Aynı kalıyor) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg">
                <p className="text-sm opacity-90">Toplam Satış Değeri</p>
                <p className="text-3xl font-bold">{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(dashboardData.toplamSatis)}</p>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white shadow-lg">
                <p className="text-sm opacity-90">Kritik Stok</p>
                <p className="text-3xl font-bold">{dashboardData.kritikStok}</p>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white shadow-lg">
                <p className="text-sm opacity-90">Bölge Sayısı</p>
                <p className="text-3xl font-bold">{dashboardData.bolgeSayisi}</p>
              </div>
            </div>

            {/* Pasta Grafik (Aynı kalıyor) */}
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-white p-6 rounded-xl shadow">
                <SatisOranlari data={dashboardData.satisOranlari} />
              </div>
            </div>
            
            {/* DEĞİŞİKLİK: Detaylı Analiz tablosunu tekrar ekliyoruz */}
            <div className="bg-white p-6 rounded-xl shadow">
              <KategorikGidisat data={dashboardData.detayliAnaliz} />
            </div>
          </div>
        );

      // Diğer sayfalar aynı kalıyor
      case 'stok-tahmin':
        return <StokTahmin data={dashboardData.stokTahminDetaylari} />;
      case 'cografi-analiz':
        return <CografiAnalizNew data={dashboardData.cografiAnalizDetaylari} />;
      case 'urun-yonetimi':
    return <UrunYonetimi />;
      default:
        return <div>Sayfa bulunamadı</div>;
    }
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentUser={currentUser} activeSection={activeSection} onSectionChange={setActiveSection} onLogout={handleLogout} sidebarKategoriSayilari={dashboardData.sidebarKategoriSayilari} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200">
           {/* Header aynı kalıyor */}
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-900">{activeSection.charAt(0).toUpperCase() + activeSection.slice(1).replace(/-/g, ' ')}</h1>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;