import React, { useState } from 'react';
import { Bot, Send, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { DashboardVerileri } from '../types/index.ts';

interface GeminiAIProps {
  dashboardData: DashboardVerileri;
  onAnalysis: (analysis: string) => void;
}

const GeminiAI: React.FC<GeminiAIProps> = ({ dashboardData, onAnalysis }) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestions] = useState([
    'Stok tahminlerini analiz et',
    'Ciro performansını değerlendir',
    'Satış trendlerini yorumla',
    'Risk faktörlerini belirle',
    'Optimizasyon önerileri ver'
  ]);

  const analyzeDataWithGemini = async (query: string): Promise<string> => {
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      throw new Error('Gemini API anahtarı bulunamadı. Lütfen .env dosyasında REACT_APP_GEMINI_API_KEY değerini ayarlayın.');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "/gemini-2.0-flash" });

    // Dashboard verilerini JSON formatında hazırla
    const dataContext = `
    Dashboard Verileri:
    
    Satış Oranları: ${JSON.stringify(dashboardData.satisOranlari, null, 2)}
    
    Aylık Tahminler: ${JSON.stringify(dashboardData.aylikTahminler, null, 2)}
    
    Kategorik Gidişat: ${JSON.stringify(dashboardData.kategorikGidisat, null, 2)}
    
    Coğrafi Analiz: ${JSON.stringify(dashboardData.cografiAnaliz, null, 2)}
    
    Teknoloji Ürünleri: ${JSON.stringify(dashboardData.teknolojiUrunleri, null, 2)}
    
    Stok Tahminleri: ${JSON.stringify(dashboardData.stokTahminleri, null, 2)}
    
    Ciro Analizi: ${JSON.stringify(dashboardData.ciroAnalizi, null, 2)}
    `;

    const prompt = `
    Sen bir teknoloji şirketinin satış ve stok analiz uzmanısın. Aşağıdaki dashboard verilerini analiz ederek sorulan soruya Türkçe olarak cevap ver.
    
    ${dataContext}
    
    Kullanıcı Sorusu: ${query}
    
    Lütfen sadece verilen veriler üzerinden analiz yap. Genel bilgiler verme, sadece dashboard verilerine odaklan.
    Cevabını Türkçe olarak ver ve detaylı analiz yap.
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API Hatası:', error);
      throw new Error('AI analizi sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsLoading(true);
    setError('');
    
    try {
      const analysis = await analyzeDataWithGemini(message);
      onAnalysis(analysis);
      setMessage('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center mb-4">
        <div className="h-10 w-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
          <Bot className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Gemini AI Asistan</h3>
          <p className="text-sm text-gray-500">Dashboard verilerini analiz eder</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Dashboard verilerini analiz et..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !message.trim()}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
      </form>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Hızlı Analizler:</h4>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => setMessage(suggestion)}
              className="px-3 py-1 text-xs bg-purple-50 text-purple-700 rounded-full hover:bg-purple-100 transition-colors flex items-center"
            >
              <Sparkles className="h-3 w-3 mr-1" />
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Analiz Kategorileri:</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Stok tahmin analizi</li>
          <li>• Ciro performans değerlendirmesi</li>
          <li>• Risk faktörü analizi</li>
          <li>• Optimizasyon önerileri</li>
          <li>• Trend analizi</li>
          <li>• Coğrafi satış analizi</li>
        </ul>
      </div>
    </div>
  );
};

export default GeminiAI; 