import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { KategorikGidisat as KategorikGidisatType } from '../types/index.ts';
import { formatPara, formatYuzde } from '../utils/formatters.ts';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KategorikGidisatProps {
  data: KategorikGidisatType[];
}

const KategorikGidisat: React.FC<KategorikGidisatProps> = ({ data }) => {


  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Kategorik Gidişat (Son 3 Ay)</h2>
      
      {/* Özet Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {data.slice(0, 3).map((item, index) => (
          <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{item.kategori}</p>
                <p className="text-lg font-semibold text-blue-600">{formatYuzde(item.son3AyArtis)}</p>
              </div>
              {item.son3AyArtis > 0 ? (
                <TrendingUp className="text-green-600 w-5 h-5" />
              ) : (
                <TrendingDown className="text-red-600 w-5 h-5" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Grafik */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="kategori" />
            <YAxis />
            <Tooltip />
            <Bar 
              dataKey="son3AyArtis" 
              fill="#3B82F6" 
              name="Son 3 Ay Artış (%)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detay Tablosu */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Detaylı Analiz</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Son 3 Ay Artış
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Önceki Dönem
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Şimdiki Dönem
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {item.kategori}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <span className={`font-semibold ${item.son3AyArtis > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatYuzde(item.son3AyArtis)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {formatPara(item.oncekiDonem)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {formatPara(item.simdikiDonem)}
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

export default KategorikGidisat; 