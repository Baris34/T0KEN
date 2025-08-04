// src/components/KategorikGidisat.tsx

import React from 'react';

// Gelen veri objesinin yapısını tanımlayalım (TypeScript için önemlidir)
interface DetayliAnalizVeri {
  kategori: string;
  son_3_ay_artis: number;
  oncekiDonem: number;
  simdikiDonem: number;
}

interface KategorikGidisatProps {
  data: DetayliAnalizVeri[];
}

// Para birimini formatlamak için yardımcı fonksiyon
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
  }).format(value);
};

// Yüzdeyi formatlamak için yardımcı fonksiyon
const formatPercentage = (value: number) => {
  return `${value.toFixed(1)}%`; // Değeri bir ondalık basamakla göster
};


const KategorikGidisat: React.FC<KategorikGidisatProps> = ({ data }) => {
  // Veri boşsa veya gelmediyse, boş bir tablo göster
  if (!data || data.length === 0) {
    return (
        <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Detaylı Analiz</h3>
            <p className="text-gray-500">Analiz edilecek veri bulunamadı.</p>
        </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Detaylı Analiz</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kategori
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Son 3 Ay Artış
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Toplam Ciro
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Son 3 Ay Ciro
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((item) => (
              <tr key={item.kategori} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.kategori}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                  {/* Yüzde değerini renklendirme mantığı */}
                  <span className={item.son_3_ay_artis >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {formatPercentage(item.son_3_ay_artis)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {formatCurrency(item.oncekiDonem)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {formatCurrency(item.simdikiDonem)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KategorikGidisat;