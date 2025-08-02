import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { CografiBolge } from '../types/index.ts';
import { formatPara } from '../utils/formatters.ts';
import { MapPin, Warehouse, Truck, TrendingUp, Search } from 'lucide-react';

interface CografiAnalizProps {
  data: CografiBolge[];
}

const CografiAnalizNew: React.FC<CografiAnalizProps> = ({ data }) => {
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  
  // Filtreleme state'leri
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'sales' | 'logistics' | 'economic'>('sales');

  // Filtrelenmiş ve sıralanmış veri
  const filteredData = useMemo(() => {
    let filtered = data;

    // Arama filtresi
    if (searchTerm) {
      filtered = filtered.filter(bolge =>
        bolge.bolgeAdi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bolge.sehirler.some(sehir => sehir.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Bölge filtresi
    if (selectedRegion !== 'all') {
      filtered = filtered.filter(bolge => bolge.bolgeAdi === selectedRegion);
    }

    // Sıralama
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'sales':
          return b.toplamSatis - a.toplamSatis;
        case 'logistics':
          return b.lojistikMaliyet - a.lojistikMaliyet;
        case 'economic':
          return b.ekonomikHacim - a.ekonomikHacim;
        default:
          return 0;
      }
    });

    return filtered;
  }, [data, searchTerm, selectedRegion, sortBy]);

  // Benzersiz bölgeler
  const uniqueRegions = useMemo(() => {
    const regions = data.map(bolge => bolge.bolgeAdi);
    return ['all', ...regions];
  }, [data]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Coğrafi Satış Analizi</h2>
      
      {/* Filtreleme Kontrolleri */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Arama */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Bölge veya şehir ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Bölge Seçimi */}
          <div>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {uniqueRegions.map(region => (
                <option key={region} value={region}>
                  {region === 'all' ? 'Tüm Bölgeler' : region}
                </option>
              ))}
            </select>
          </div>
          
          {/* Sıralama */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'sales' | 'logistics' | 'economic')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="sales">Satışa Göre Sırala</option>
              <option value="logistics">Lojistik Maliyete Göre Sırala</option>
              <option value="economic">Ekonomik Hacme Göre Sırala</option>
            </select>
          </div>
        </div>
        
        {/* Aktif Filtreler */}
        {(searchTerm || selectedRegion !== 'all') && (
          <div className="mt-3 flex flex-wrap gap-2">
            {searchTerm && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Arama: {searchTerm}
                <button
                  onClick={() => setSearchTerm('')}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {selectedRegion !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Bölge: {selectedRegion}
                <button
                  onClick={() => setSelectedRegion('all')}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
      </div>
      
      {/* Özet Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <MapPin className="text-blue-600 w-5 h-5 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Toplam Bölge</p>
              <p className="text-lg font-semibold text-blue-600">{data.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <TrendingUp className="text-green-600 w-5 h-5 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Toplam Hacim</p>
              <p className="text-lg font-semibold text-green-600">
                {formatPara(filteredData.reduce((sum, item) => sum + item.ekonomikHacim, 0))}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Truck className="text-yellow-600 w-5 h-5 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Toplam Lojistik</p>
              <p className="text-lg font-semibold text-yellow-600">
                {formatPara(filteredData.reduce((sum, item) => sum + item.lojistikMaliyet, 0))}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Warehouse className="text-purple-600 w-5 h-5 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Depo Önerisi</p>
              <p className="text-lg font-semibold text-purple-600">{filteredData.length} Bölge</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grafikler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Ekonomik Hacim Grafiği */}
        <div className="h-80">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Ekonomik Hacim Dağılımı</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="bolgeAdi" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="ekonomikHacim" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pasta Grafik */}
        <div className="h-80">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Bölge Dağılımı</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={filteredData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ bolgeAdi, ekonomikHacim }) => `${bolgeAdi} (${formatPara(ekonomikHacim)})`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="ekonomikHacim"
              >
                {filteredData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bölge Detayları */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Bölge Detayları ve Depo Önerileri</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredData.map((bolge, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold text-gray-800">{bolge.bolgeAdi}</h4>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {bolge.sehirler.length} Şehir
                </span>
              </div>
              
              <div className="space-y-2 mb-3">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Şehirler:</span> {bolge.sehirler.join(', ')}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Ekonomik Hacim:</span> {formatPara(bolge.ekonomikHacim)}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Lojistik Gideri:</span> {formatPara(bolge.lojistikMaliyet)}
                </p>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-blue-800 mb-1">Depo Tavsiyesi</p>
                <p className="text-sm text-blue-700">{bolge.depoOnerisi}</p>
                <p className="text-sm text-blue-600 mt-1">
                  <span className="font-medium">Önerilen Şehir:</span> {bolge.depoOnerisi}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CografiAnalizNew; 