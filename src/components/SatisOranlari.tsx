// src/components/SatisOranlari.tsx

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// Gelen veri tipini tanımlayalım
interface SatisOranlariData {
  kategori: string;
  miktar: number;
  yuzde: number;
}

interface SatisOranlariProps {
  data: SatisOranlariData[];
}

// Pasta grafiği için güzel bir renk paleti
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1953'];

// YENİ: Özel etiketleri oluşturacak fonksiyonumuz
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, payload }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 1.3; // Etiketi dilimin biraz dışına yerleştir
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const a = payload.kategori
  const p = (percent * 100).toFixed(0)

  return (
    <text x={x} y={y} fill="#666" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${a} ${p}%`}
    </text>
  );
};


const SatisOranlari: React.FC<SatisOranlariProps> = ({ data }) => {
  
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Satış oranı verisi bulunamadı.
      </div>
    );
  }

  // Tooltip'te yüzdeyi göstermek için özel formatlayıcı (Bu aynı kalıyor)
  const customTooltipFormatter = (value: number, name: string, props: any) => {
    const percentage = props.payload.yuzde.toFixed(2);
    return [`${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value)}`, `${name} (${percentage}%)`];
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Kategoriye Göre Satış Oranları</h3>
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={true} // DEĞİŞİKLİK: Etiket çizgilerini göster
              label={renderCustomizedLabel} // DEĞİŞİKLİK: Özel etiket fonksiyonumuzu kullan
              outerRadius={120} // Grafiği biraz küçülterek etiketlere yer açalım
              fill="#8884d8"
              dataKey="miktar"
              nameKey="kategori"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={customTooltipFormatter} />
            {/* DEĞİŞİKLİK: Legend (açıklama) kısmını kaldırıyoruz, çünkü etiketler artık grafiğin üzerinde */}
            {/* <Legend /> */}
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SatisOranlari;