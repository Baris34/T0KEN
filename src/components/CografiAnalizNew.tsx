// src/components/CografiAnalizNew.tsx

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Gelen veri tiplerini tanımlayalım
interface BolgeDetayi {
  bolge: string;
  hacim: number;
  yuzde: number;
  sehirler: string[];
  lojistikGideri: number;
}

interface CografiAnalizVerisi {
  toplamBolge: number;
  toplamHacim: number;
  bolgeDetaylari: BolgeDetayi[];
}

interface CografiAnalizProps {
  data?: CografiAnalizVerisi;
}

const formatCurrency = (value: number) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value);
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1953'];

const CografiAnalizNew: React.FC<CografiAnalizProps> = ({ data }) => {
  if (!data || !data.bolgeDetaylari) {
    return <div>Coğrafi analiz verileri yükleniyor...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Üst Kartlar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl">
          <p className="text-sm font-medium text-blue-700">Toplam Bölge</p>
          <p className="text-3xl font-bold text-blue-800">{data.toplamBolge}</p>
        </div>
        <div className="bg-green-50 border border-green-200 p-6 rounded-xl">
          <p className="text-sm font-medium text-green-700">Toplam Hacim</p>
          <p className="text-3xl font-bold text-green-800">{formatCurrency(data.toplamHacim)}</p>
        </div>
      </div>

      {/* Grafikler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Ekonomik Hacim Dağılımı</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.bolgeDetaylari}>
              <XAxis dataKey="bolge" angle={-45} textAnchor="end" height={70} />
              <YAxis tickFormatter={(value) => new Intl.NumberFormat('tr-TR', { notation: 'compact' }).format(value)} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Bar dataKey="hacim" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Bölge Dağılımı</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={data.bolgeDetaylari} dataKey="hacim" nameKey="bolge" cx="50%" cy="50%" outerRadius={120} labelLine={false}>
                {data.bolgeDetaylari.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name, props) => `${props.payload.yuzde.toFixed(2)}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bölge Detayları - YENİ KART TASARIMI */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Bölge Detayları</h3>
        <div className="space-y-4">
          {data.bolgeDetaylari.map((bolge) => (
            <div key={bolge.bolge} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-semibold text-gray-800">{bolge.bolge} Bölgesi</h4>
                <span className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
                  {bolge.sehirler.length} Şehir
                </span>
              </div>
              <div className="mt-3 text-sm space-y-2">
                <p><span className="font-medium text-gray-600">Şehirler: </span>{bolge.sehirler.join(', ')}</p>
                <p><span className="font-medium text-gray-600">Ekonomik Hacim: </span>{formatCurrency(bolge.hacim)}</p>
                <p><span className="font-medium text-gray-600">Lojistik Gideri: </span>{formatCurrency(bolge.lojistikGideri)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CografiAnalizNew;