import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { StokTahmin as StokTahminType } from '../types/index.ts';
import { formatPara, formatSayi } from '../utils/formatters.ts';
import { AlertTriangle, TrendingUp, TrendingDown, CheckCircle } from 'lucide-react';

interface StokTahminProps {
  data: StokTahminType[];
}

const StokTahmin: React.FC<StokTahminProps> = ({ data }) => {


  const kritikUrunler = data.filter(item => item.stokDurumu === 'kritik');
  const normalUrunler = data.filter(item => item.stokDurumu === 'normal');
  const fazlaUrunler = data.filter(item => item.stokDurumu === 'fazla');

  const toplamEksikStok = data.reduce((sum, item) => sum + item.eksikStok, 0);
  const toplamCiroFarki = data.reduce((sum, item) => sum + item.ciroFarki, 0);

  return (
    <div className="space-y-6">
      {/* Özet Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-red-50 p-6 rounded-xl border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Kritik Stok</p>
              <p className="text-2xl font-bold text-red-700">{kritikUrunler.length}</p>
              <p className="text-xs text-red-500">Ürün</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Normal Stok</p>
              <p className="text-2xl font-bold text-green-700">{normalUrunler.length}</p>
              <p className="text-xs text-green-500">Ürün</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Toplam Eksik</p>
              <p className="text-2xl font-bold text-yellow-700">{formatSayi(toplamEksikStok)}</p>
              <p className="text-xs text-yellow-500">Adet</p>
            </div>
            <TrendingDown className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Ciro Farkı</p>
              <p className={`text-2xl font-bold ${toplamCiroFarki >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
                {formatPara(Math.abs(toplamCiroFarki))}
              </p>
              <p className="text-xs text-blue-500">
                {toplamCiroFarki >= 0 ? 'Fazla' : 'Eksik'}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Grafikler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stok Durumu Grafiği */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Stok Durumu Dağılımı</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="urunAdi" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="mevcutStok" fill="#3B82F6" name="Mevcut Stok" />
                <Bar dataKey="tahminiSatis" fill="#10B981" name="Tahmini Satış" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stok Durumu Pasta Grafiği */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Stok Durumu Oranları</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Kritik', value: kritikUrunler.length, color: '#EF4444' },
                    { name: 'Normal', value: normalUrunler.length, color: '#10B981' },
                    { name: 'Fazla', value: fazlaUrunler.length, color: '#F59E0B' }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {[
                    { name: 'Kritik', value: kritikUrunler.length, color: '#EF4444' },
                    { name: 'Normal', value: normalUrunler.length, color: '#10B981' },
                    { name: 'Fazla', value: fazlaUrunler.length, color: '#F59E0B' }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detaylı Tablo */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Stok Tahmin Detayları</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ürün
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mevcut Stok
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tahmini Satış
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Eksik/Fazla
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ciro Farkı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Öneri
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.urunAdi}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatSayi(item.mevcutStok)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatSayi(item.tahminiSatis)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      item.stokDurumu === 'kritik' 
                        ? 'bg-red-100 text-red-800' 
                        : item.stokDurumu === 'normal'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.stokDurumu === 'kritik' ? 'Kritik' : 
                       item.stokDurumu === 'normal' ? 'Normal' : 'Fazla'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.eksikStok > 0 ? (
                      <span className="text-red-600">-{formatSayi(item.eksikStok)}</span>
                    ) : (
                      <span className="text-green-600">+{formatSayi(item.fazlaStok)}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={item.ciroFarki >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatPara(Math.abs(item.ciroFarki))}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.oneri}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StokTahmin; 