import React, { useState } from 'react';
import { mockDashboardVerileri } from './data/mockData.ts';
import { createDashboardData } from './data/realDataProcessor.ts';
import { User } from './types/index.ts';
import Login from './components/Login.tsx';
import Sidebar from './components/Sidebar.tsx';
import SatisOranlari from './components/SatisOranlari.tsx';
import AylikTahminler from './components/AylikTahminler.tsx';
import KategorikGidisat from './components/KategorikGidisat.tsx';
import CografiAnalizNew from './components/CografiAnalizNew.tsx';
import StokTahmin from './components/StokTahmin.tsx';
import CiroAnalizi from './components/CiroAnalizi.tsx';
import GeminiAI from './components/GeminiAI.tsx';
import { 
  TrendingUp, 
  MapPin, 
  Package,
  DollarSign,
  Bell,
  Search,
  Settings
} from 'lucide-react';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [dashboardData, setDashboardData] = useState(mockDashboardVerileri);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (user: User) => {
    setCurrentUser(user);
    setError(null);
    // Login olduktan sonra mock veriyi kullan
    console.log('Login başarılı, mock veri kullanılıyor');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveSection('dashboard');
    setError(null);
  };

  const loadRealData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Mock veriyi yeniden yükle (gerçek veri yerine)
      setDashboardData(mockDashboardVerileri);
      console.log('Mock veri başarıyla yüklendi');
    } catch (error) {
      console.error('Mock veri yüklenirken hata:', error);
      setError(error instanceof Error ? error.message : 'Veri yüklenirken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Özet Kartları */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Toplam Satış</p>
                    <p className="text-2xl font-bold">
                      {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(
                        dashboardData.satisOranlari.reduce((sum, item) => sum + item.miktar, 0)
                      )}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 opacity-80" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Kritik Stok</p>
                    <p className="text-2xl font-bold">
                      {dashboardData.stokTahminleri.filter(item => item.stokDurumu === 'kritik').length}
                    </p>
                  </div>
                  <Package className="h-8 w-8 opacity-80" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Ciro Farkı</p>
                    <p className="text-2xl font-bold">
                      {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(
                        Math.abs(dashboardData.ciroAnalizi.reduce((sum, item) => sum + item.ciroFarki, 0))
                      )}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 opacity-80" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Bölge Sayısı</p>
                    <p className="text-2xl font-bold">{dashboardData.cografiAnaliz.length}</p>
                  </div>
                  <MapPin className="h-8 w-8 opacity-80" />
                </div>
              </div>
            </div>

            {/* Ana Bileşenler */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SatisOranlari data={dashboardData.satisOranlari} />
              <AylikTahminler data={dashboardData.aylikTahminler} />
            </div>

            <KategorikGidisat data={dashboardData.kategorikGidisat} />
          </div>
        );

      case 'satis-oranlari':
        return <SatisOranlari data={dashboardData.satisOranlari} />;

      case 'aylik-tahminler':
        return <AylikTahminler data={dashboardData.aylikTahminler} />;

      case 'kategorik-gidisat':
        return <KategorikGidisat data={dashboardData.kategorikGidisat} />;

      case 'stok-tahmin':
        return <StokTahmin data={dashboardData.stokTahminleri} />;

      case 'ciro-analizi':
        return <CiroAnalizi data={dashboardData.ciroAnalizi} />;

      case 'cografi-analiz':
        return <CografiAnalizNew data={dashboardData.cografiAnaliz} />;

      case 'urun-yonetimi':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Ürün Yönetimi</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ürün Adı
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kategori
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fiyat
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stok
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tedarikçi
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Son Güncelleme
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dashboardData.teknolojiUrunleri.map((urun, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {urun.urunAdi}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {urun.kategori}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(urun.fiyat)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {urun.mevcutStok}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {urun.tedarikci}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(urun.sonGuncelleme).toLocaleDateString('tr-TR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* AI Analiz */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GeminiAI dashboardData={dashboardData} onAnalysis={setAiAnalysis} />
              
              {aiAnalysis && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">AI Analiz Sonucu</h3>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700 leading-relaxed">{aiAnalysis}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return <div>Sayfa bulunamadı</div>;
    }
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        currentUser={currentUser}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">
                {activeSection === 'dashboard' && 'Ana Dashboard'}
                {activeSection === 'satis-oranlari' && 'Satış Oranları'}
                {activeSection === 'aylik-tahminler' && 'Aylık Tahminler'}
                {activeSection === 'kategorik-gidisat' && 'Kategorik Gidişat'}
                {activeSection === 'stok-tahmin' && 'Stok Tahmin'}
                {activeSection === 'ciro-analizi' && 'Ciro Analizi'}
                {activeSection === 'cografi-analiz' && 'Coğrafi Analiz'}
                {activeSection === 'urun-yonetimi' && 'Ürün Yönetimi'}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
                             <button
                 onClick={loadRealData}
                 disabled={isLoading}
                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 {isLoading ? 'Veri Yükleniyor...' : 'Mock Veri Yükle'}
               </button>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Ara..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button className="relative p-2 text-gray-400 hover:text-gray-600">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>

              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Settings className="h-6 w-6" />
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">Hata!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App; 