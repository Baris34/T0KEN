# Satış Analizi Dashboard

Modern ve kapsamlı bir satış analizi dashboard'u. React, TypeScript ve Tailwind CSS kullanılarak geliştirilmiştir.

## Özellikler

### 📊 Satış Oranları
- Pasta grafik ile kategori bazlı satış dağılımı
- Veritabanından çekilen dinamik veriler
- Detaylı tooltip'ler ve legend

### 📈 Aylık Tahminler
- Aylık tahmini satış miktarları
- Potansiyel kayıp ciro analizi
- Stok durumu takibi
- Gelecek ay ihtiyaç tahminleri

### 📋 Kategorik Gidişat
- Son 3 aya göre kategori bazlı artış yüzdeleri
- Bar grafik ile görsel analiz
- Detaylı tablo görünümü
- Trend göstergeleri

### 🗺️ Coğrafi Satış Analizi
- Bölgesel satış analizi
- Minimum lojistik gideri hesaplamaları
- Depo kurulum önerileri
- Ekonomik hacim grafikleri

### 🤖 Gemini AI Asistan
- Dashboard verilerini analiz eden AI
- Stok tahmin analizi
- Ciro performans değerlendirmesi
- Risk faktörü analizi
- Optimizasyon önerileri

## Teknolojiler

- **React 18** - Modern UI framework
- **TypeScript** - Tip güvenliği
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - React grafik kütüphanesi
- **Lucide React** - Modern ikonlar
- **@google/generative-ai** - Gemini AI entegrasyonu

## Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. Gemini AI API anahtarını ayarlayın:
   - [Google AI Studio](https://makersuite.google.com/app/apikey) adresinden API anahtarı alın
   - Proje kök dizinindeki `.env` dosyasını düzenleyin:
   ```
   REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. Geliştirme sunucusunu başlatın:
```bash
npm start
```

4. Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## Proje Yapısı

```
src/
├── components/          # React bileşenleri
│   ├── SatisOranlari.tsx
│   ├── AylikTahminler.tsx
│   ├── KategorikGidisat.tsx
│   └── CografiAnaliz.tsx
├── data/               # Mock veriler
│   └── mockData.ts
├── types/              # TypeScript tip tanımları
│   └── index.ts
├── utils/              # Yardımcı fonksiyonlar
│   └── formatters.ts
├── App.tsx            # Ana uygulama bileşeni
└── index.tsx          # Uygulama giriş noktası
```

## Veri Yapısı

### Satış Oranları
```typescript
interface SatisVerisi {
  kategori: string;
  miktar: number;
  yuzde: number;
  renk: string;
}
```

### Aylık Tahminler
```typescript
interface AylikTahmin {
  ay: string;
  tahminiSatis: number;
  potansiyelKayip: number;
  stokDurumu: number;
  gelecekAyIhtiyac: number;
}
```

### Kategorik Gidişat
```typescript
interface KategorikGidisat {
  kategori: string;
  son3AyArtis: number;
  oncekiDonem: number;
  simdikiDonem: number;
}
```

### Coğrafi Analiz
```typescript
interface CografiBolge {
  bolgeAdi: string;
  sehirler: string[];
  depoTavsiyesi: string;
  onerilenDepoSehri: string;
  ekonomikHacim: number;
  lojistikGideri: number;
}
```

## Özellikler

- **Responsive Tasarım**: Tüm cihazlarda mükemmel görünüm
- **Modern UI**: Tailwind CSS ile şık arayüz
- **İnteraktif Grafikler**: Recharts ile etkileşimli grafikler
- **Tip Güvenliği**: TypeScript ile güvenli kod
- **Performans**: Optimize edilmiş React bileşenleri

## Geliştirme

### Yeni Bileşen Ekleme
1. `src/components/` klasöründe yeni bileşen oluşturun
2. `src/types/index.ts` dosyasına tip tanımları ekleyin
3. `src/data/mockData.ts` dosyasına mock veriler ekleyin
4. `src/App.tsx` dosyasında bileşeni import edin

### Veri Bağlama
Gerçek veritabanı bağlantısı için:
1. API servisleri oluşturun
2. Mock verileri gerçek API çağrıları ile değiştirin
3. Error handling ekleyin
4. Loading state'leri ekleyin

## Lisans

MIT License 