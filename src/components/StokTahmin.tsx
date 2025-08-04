// src/components/StokTahmin.tsx

import React from 'react';

// Gelen veri tiplerini tanımlayalım
interface UrunDetayi {
  product_name: string;
  mevcutStok: number;
  tahminiSatis: number;
  durum: 'Kritik' | 'Normal'; // 'Eksik' durumu kaldırıldı
  eksik_fazla: number;
  ciro_farki: number;
}

interface StokTahminVerisi {
  kritikStokSayisi: number;
  normalStokSayisi: number;
  // eksikStokSayisi kaldırıldı
  toplamCiroFarki: number;
  urunListesi: UrunDetayi[];
}

interface StokTahminProps {
  data?: StokTahminVerisi;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value);
};

const StokTahmin: React.FC<StokTahminProps> = ({ data }) => {
  if (!data) {
    return <div>Stok tahmin verileri yükleniyor...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Üst Kartlar - 3'e düşürüldü */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-red-50 border border-red-200 p-6 rounded-xl">
            <p className="text-sm font-medium text-red-700">Kritik Stok</p>
            <p className="text-3xl font-bold text-red-800">{data.kritikStokSayisi}</p>
            <p className="text-xs text-red-600">Ürün</p>
        </div>
        <div className="bg-green-50 border border-green-200 p-6 rounded-xl">
            <p className="text-sm font-medium text-green-700">Normal Stok</p>
            <p className="text-3xl font-bold text-green-800">{data.normalStokSayisi}</p>
            <p className="text-xs text-green-600">Ürün</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl">
            <p className="text-sm font-medium text-blue-700">Potansiyel Ciro Kaybı</p>
            <p className="text-3xl font-bold text-blue-800">{formatCurrency(data.toplamCiroFarki)}</p>
            <p className="text-xs text-blue-600">Kritik stoktan dolayı</p>
        </div>
      </div>
      
      {/* Detay Tablosu */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Stok Tahmin Detayları</h3>
        <div className="overflow-x-auto max-h-[600px]">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ürün</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mevcut Stok</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İdeal Stok</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Eksik/Fazla</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ciro Farkı</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.urunListesi.map((urun, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{urun.product_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{urun.mevcutStok}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{urun.tahminiSatis}</td>
                  <td className="px-6 py-4 text-sm font-semibold">
                    <span className={
                        urun.durum === 'Kritik' ? 'text-red-600' : 'text-green-600'
                    }>
                        {urun.durum}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-700">{urun.eksik_fazla}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{formatCurrency(urun.ciro_farki)}</td>
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