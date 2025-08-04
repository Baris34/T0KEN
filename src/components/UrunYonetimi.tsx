// src/components/UrunYonetimi.tsx

import React, { useState } from 'react';
import { Bot, Loader, ServerCrash, Sparkles, Send } from 'lucide-react';

// Hızlı analiz seçeneklerini güncelleyelim ve yenilerini ekleyelim
const quickAnalysisOptions = [
  { id: 'laptop_sales_last_3_months', text: 'Son 3 aydaki laptop satışları' },
  { id: 'top_revenue_category', text: 'En çok ciro yapan kategori hangisi?' },
  { id: 'top_5_orders', text: 'En yüksek değerli 5 siparişi analiz et' },
  { id: 'top_region_analysis', text: 'En çok sipariş veren bölgeyi incele' },
];

const UrunYonetimi: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>(''); // Input alanı için state

  const handleAnalysisRequest = async (queryId: string) => {
    setIsLoading(true);
    setError('');
    setAnalysisResult('');

    try {
      const response = await fetch('http://127.0.0.1:5000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query_id: queryId }),
      });

      if (!response.ok) throw new Error('Sunucudan hatalı bir yanıt alındı.');
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setAnalysisResult(data.result);
    } catch (err: any) {
      setError(err.message || 'Analiz sırasında bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* --- YENİ TASARIM BAŞLANGICI --- */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-purple-100 p-3 rounded-lg">
            <Bot className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Gemini AI Asistan</h2>
            <p className="text-sm text-gray-500">Dashboard verilerini analiz eder</p>
          </div>
        </div>

        {/* Input Alanı (Şimdilik işlevsiz, sadece görsel) */}
        <div className="relative mb-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Dashboard verilerini analiz et..."
            className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled // Kullanıcı yazamasın diye şimdilik kapalı
          />
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-500 text-white p-2 rounded-md hover:bg-purple-600 disabled:bg-purple-300" disabled>
            <Send className="h-5 w-5" />
          </button>
        </div>

        {/* Hızlı Analizler */}
        <div className="mb-6">
            <p className="text-sm font-medium text-gray-600 mb-2">Hızlı Analizler:</p>
            <div className="flex flex-wrap gap-2">
            {quickAnalysisOptions.map(option => (
                <button
                key={option.id}
                onClick={() => handleAnalysisRequest(option.id)}
                disabled={isLoading}
                className="flex items-center gap-1.5 bg-purple-50 text-purple-700 text-xs font-semibold py-1.5 px-3 rounded-full hover:bg-purple-100 disabled:opacity-50 transition-colors"
                >
                <Sparkles className="h-3 w-3" />
                {option.text}
                </button>
            ))}
            </div>
        </div>
        
        {/* Analiz Kategorileri (Bilgilendirme amaçlı) */}
        <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Analiz Kategorileri:</h4>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            <li>Stok tahmin analizi</li>
            <li>Ciro performans değerlendirmesi</li>
            <li>Risk faktörü analizi</li>
            <li>Optimizasyon önerileri</li>
            <li>Trend analizi</li>
            <li>Coğrafi satış analizi</li>
          </ul>
        </div>
      </div>
      {/* --- YENİ TASARIM BİTİŞİ --- */}


      {/* Analiz Sonucu Kartı (Bu kısım aynı kalıyor) */}
      <div className="bg-white rounded-xl shadow-lg p-6 min-h-[200px] flex items-center justify-center">
        {isLoading && (
          <div className="text-center text-gray-500">
            <Loader className="animate-spin h-8 w-8 mx-auto mb-2" />
            <p>Analiz yapılıyor, lütfen bekleyin...</p>
          </div>
        )}
        {error && (
          <div className="text-center text-red-600">
            <ServerCrash className="h-8 w-8 mx-auto mb-2" />
            <p><strong>Hata:</strong> {error}</p>
          </div>
        )}
        {analysisResult && (
          <div className="w-full space-y-4">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Bot className="text-blue-500" /> Analiz Sonucu
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-gray-700 prose prose-sm max-w-none">
                {analysisResult.split('\n').map((line, index) => (
                    <p key={index} className="mb-2">{line.replace(/\*/g, '')}</p>
                ))}
            </div>
          </div>
        )}
        {!isLoading && !error && !analysisResult && (
          <p className="text-gray-400">Analiz sonucunu görmek için bir seçenek seçin.</p>
        )}
      </div>
    </div>
  );
};

export default UrunYonetimi;