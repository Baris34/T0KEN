import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { SatisVerisi } from '../types/index.ts';
import { formatPara, formatYuzde } from '../utils/formatters.ts';

interface SatisOranlariProps {
  data: SatisVerisi[];
}

const SatisOranlari: React.FC<SatisOranlariProps> = ({ data }) => {


  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Satış Oranları</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ kategori, yuzde }) => `${kategori} ${yuzde}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="miktar"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.renk} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SatisOranlari; 