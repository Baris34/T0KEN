import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AylikTahmin } from '../types/index.ts';
import { formatPara } from '../utils/formatters.ts';
import { TrendingUp, TrendingDown, Package, AlertTriangle } from 'lucide-react';

interface AylikTahminlerProps {
  data: AylikTahmin[];
}

const AylikTahminler: React.FC<AylikTahminlerProps> = ({ data }) => {


  const sonVeri = data[data.length - 1];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Aylık Tahminler ve Stok Durumu</h2>
      
      {/* Özet Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <TrendingUp className="text-blue-600 w-5 h-5 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Tahmini Satış</p>
              <p className="text-lg font-semibold text-blue-600">{formatPara(sonVeri.tahminiSatis)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center">
            <TrendingDown className="text-red-600 w-5 h-5 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Potansiyel Kayıp</p>
              <p className="text-lg font-semibold text-red-600">{formatPara(sonVeri.potansiyelKayip)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Package className="text-green-600 w-5 h-5 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Stok Durumu</p>
              <p className="text-lg font-semibold text-green-600">{formatPara(sonVeri.stokDurumu)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="text-yellow-600 w-5 h-5 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Gelecek Ay İhtiyaç</p>
              <p className="text-lg font-semibold text-yellow-600">{formatPara(sonVeri.gelecekAyIhtiyac)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grafik */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="ay" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="tahminiSatis" fill="#3B82F6" name="Tahmini Satış" />
            <Bar dataKey="potansiyelKayip" fill="#EF4444" name="Potansiyel Kayıp" />
            <Bar dataKey="stokDurumu" fill="#10B981" name="Stok Durumu" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AylikTahminler; 