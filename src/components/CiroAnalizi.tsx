import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CiroAnalizi as CiroAnaliziType } from '../types/index.ts';
import { formatPara, formatYuzde } from '../utils/formatters.ts';
import { DollarSign, TrendingUp, TrendingDown, Minus, Target } from 'lucide-react';

interface CiroAnaliziProps {
  data: CiroAnaliziType[];
}

const CiroAnalizi: React.FC<CiroAnaliziProps> = ({ data }) => {


  const artisUrunler = data.filter(item => item.durum === 'artis');
  const azalisUrunler = data.filter(item => item.durum === 'azalis');
  const sabitUrunler = data.filter(item => item.durum === 'sabit');

  const toplamTahminiCiro = data.reduce((sum, item) => sum + item.tahminiCiro, 0);
  const toplamDepodakiCiro = data.reduce((sum, item) => sum + item.depodakiCiro, 0);
  const toplamCiroFarki = data.reduce((sum, item) => sum + item.ciroFarki, 0);

  return (
    <div className="space-y-6">
      {/* Özet Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Toplam Tahmini Ciro</p>
              <p className="text-2xl font-bold text-blue-700">{formatPara(toplamTahminiCiro)}</p>
              <p className="text-xs text-blue-500">Bu ay</p>
            </div>
            <Target className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Depodaki Ciro</p>
              <p className="text-2xl font-bold text-green-700">{formatPara(toplamDepodakiCiro)}</p>
              <p className="text-xs text-green-500">Mevcut</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Ciro Farkı</p>
              <p className={`text-2xl font-bold ${toplamCiroFarki >= 0 ? 'text-purple-700' : 'text-red-700'}`}>
                {formatPara(Math.abs(toplamCiroFarki))}
              </p>
              <p className="text-xs text-purple-500">
                {toplamCiroFarki >= 0 ? 'Fazla' : 'Eksik'}
              </p>
            </div>
            {toplamCiroFarki >= 0 ? (
              <TrendingUp className="h-8 w-8 text-purple-500" />
            ) : (
              <TrendingDown className="h-8 w-8 text-red-500" />
            )}
          </div>
        </div>

        <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Artış Gösteren</p>
              <p className="text-2xl font-bold text-orange-700">{artisUrunler.length}</p>
              <p className="text-xs text-orange-500">Ürün</p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Grafikler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ciro Karşılaştırma Grafiği */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Ciro Karşılaştırması</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="urunAdi" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="tahminiCiro" fill="#3B82F6" name="Tahmini Ciro" />
                <Bar dataKey="depodakiCiro" fill="#10B981" name="Depodaki Ciro" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ciro Farkı Grafiği */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Ciro Farkı Analizi</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="urunAdi" />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="ciroFarki" 
                  fill={(entry) => entry.ciroFarki >= 0 ? '#10B981' : '#EF4444'}
                  name="Ciro Farkı"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detaylı Tablo */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Ciro Analizi Detayları</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ürün
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tahmini Ciro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Depodaki Ciro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ciro Farkı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Yüzde Fark
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
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
                    {formatPara(item.tahminiCiro)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatPara(item.depodakiCiro)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={item.ciroFarki >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatPara(Math.abs(item.ciroFarki))}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={item.yuzdeFark >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatYuzde(Math.abs(item.yuzdeFark))}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {item.durum === 'artis' ? (
                        <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
                      ) : item.durum === 'azalis' ? (
                        <TrendingDown className="h-4 w-4 text-red-500 mr-2" />
                      ) : (
                        <Minus className="h-4 w-4 text-gray-500 mr-2" />
                      )}
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        item.durum === 'artis' 
                          ? 'bg-green-100 text-green-800' 
                          : item.durum === 'azalis'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {item.durum === 'artis' ? 'Artış' : 
                         item.durum === 'azalis' ? 'Azalış' : 'Sabit'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Özet İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Durum Dağılımı</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Artış</span>
              <span className="text-sm font-semibold text-green-600">{artisUrunler.length} ürün</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Azalış</span>
              <span className="text-sm font-semibold text-red-600">{azalisUrunler.length} ürün</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Sabit</span>
              <span className="text-sm font-semibold text-gray-600">{sabitUrunler.length} ürün</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Ortalama Değerler</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Ort. Tahmini Ciro</span>
              <span className="text-sm font-semibold text-blue-600">
                {formatPara(toplamTahminiCiro / data.length)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Ort. Depodaki Ciro</span>
              <span className="text-sm font-semibold text-green-600">
                {formatPara(toplamDepodakiCiro / data.length)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Ort. Ciro Farkı</span>
              <span className={`text-sm font-semibold ${toplamCiroFarki >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPara(Math.abs(toplamCiroFarki) / data.length)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Performans</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Hedef Gerçekleşme</span>
              <span className="text-sm font-semibold text-blue-600">
                {formatYuzde((toplamDepodakiCiro / toplamTahminiCiro) * 100)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Ciro Verimliliği</span>
              <span className={`text-sm font-semibold ${toplamCiroFarki >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatYuzde(Math.abs(toplamCiroFarki) / toplamTahminiCiro * 100)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Risk Oranı</span>
              <span className="text-sm font-semibold text-orange-600">
                {formatYuzde((azalisUrunler.length / data.length) * 100)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CiroAnalizi; 