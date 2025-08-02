import { DashboardVerileri } from '../types/index.ts';

export const mockDashboardVerileri: DashboardVerileri = {
  satisOranlari: [
    { kategori: 'Laptop', miktar: 450000, yuzde: 35, renk: '#3B82F6' },
    { kategori: 'Telefon', miktar: 320000, yuzde: 25, renk: '#10B981' },
    { kategori: 'Tablet', miktar: 280000, yuzde: 22, renk: '#F59E0B' },
    { kategori: 'Aksesuar', miktar: 180000, yuzde: 14, renk: '#EF4444' },
    { kategori: 'Yazıcı', miktar: 60000, yuzde: 4, renk: '#8B5CF6' }
  ],
  
  aylikTahminler: [
    {
      ay: 'Ocak 2024',
      tahminiSatis: 1250000,
      potansiyelKayip: 180000,
      stokDurumu: 850000,
      gelecekAyIhtiyac: 950000
    },
    {
      ay: 'Şubat 2024',
      tahminiSatis: 1350000,
      potansiyelKayip: 220000,
      stokDurumu: 720000,
      gelecekAyIhtiyac: 1100000
    },
    {
      ay: 'Mart 2024',
      tahminiSatis: 1450000,
      potansiyelKayip: 150000,
      stokDurumu: 680000,
      gelecekAyIhtiyac: 1200000
    }
  ],
  
  kategorikGidisat: [
    { kategori: 'Laptop', son3AyArtis: 15.5, oncekiDonem: 380000, simdikiDonem: 450000 },
    { kategori: 'Telefon', son3AyArtis: 8.2, oncekiDonem: 295000, simdikiDonem: 320000 },
    { kategori: 'Tablet', son3AyArtis: 12.8, oncekiDonem: 248000, simdikiDonem: 280000 },
    { kategori: 'Aksesuar', son3AyArtis: 22.1, oncekiDonem: 147000, simdikiDonem: 180000 },
    { kategori: 'Yazıcı', son3AyArtis: 5.3, oncekiDonem: 57000, simdikiDonem: 60000 }
  ],
  
  cografiAnaliz: [
    {
      bolgeAdi: 'Marmara Bölgesi',
      sehirler: ['İstanbul', 'Bursa', 'Kocaeli', 'Sakarya'],
      depoTavsiyesi: 'Merkezi depo kurulması önerilir',
      onerilenDepoSehri: 'İstanbul',
      ekonomikHacim: 650000,
      lojistikGideri: 85000
    },
    {
      bolgeAdi: 'Ege Bölgesi',
      sehirler: ['İzmir', 'Aydın', 'Manisa', 'Denizli'],
      depoTavsiyesi: 'Bölgesel depo kurulması önerilir',
      onerilenDepoSehri: 'İzmir',
      ekonomikHacim: 420000,
      lojistikGideri: 65000
    },
    {
      bolgeAdi: 'Akdeniz Bölgesi',
      sehirler: ['Antalya', 'Mersin', 'Adana', 'Hatay'],
      depoTavsiyesi: 'Küçük depo kurulması önerilir',
      onerilenDepoSehri: 'Antalya',
      ekonomikHacim: 380000,
      lojistikGideri: 72000
    },
    {
      bolgeAdi: 'İç Anadolu Bölgesi',
      sehirler: ['Ankara', 'Konya', 'Kayseri', 'Eskişehir'],
      depoTavsiyesi: 'Merkezi depo kurulması önerilir',
      onerilenDepoSehri: 'Ankara',
      ekonomikHacim: 520000,
      lojistikGideri: 58000
    }
  ],

  teknolojiUrunleri: [
    {
      id: '1',
      urunAdi: 'MacBook Pro 14" M3',
      kategori: 'Laptop',
      fiyat: 45000,
      mevcutStok: 25,
      tahminiSatis: 35,
      minimumStok: 10,
      maksimumStok: 50,
      tedarikci: 'Apple',
      sonGuncelleme: '2024-01-15'
    },
    {
      id: '2',
      urunAdi: 'iPhone 15 Pro Max',
      kategori: 'Telefon',
      fiyat: 35000,
      mevcutStok: 45,
      tahminiSatis: 60,
      minimumStok: 20,
      maksimumStok: 80,
      tedarikci: 'Apple',
      sonGuncelleme: '2024-01-15'
    },
    {
      id: '3',
      urunAdi: 'iPad Pro 12.9"',
      kategori: 'Tablet',
      fiyat: 28000,
      mevcutStok: 30,
      tahminiSatis: 25,
      minimumStok: 15,
      maksimumStok: 40,
      tedarikci: 'Apple',
      sonGuncelleme: '2024-01-15'
    },
    {
      id: '4',
      urunAdi: 'Samsung Galaxy S24 Ultra',
      kategori: 'Telefon',
      fiyat: 32000,
      mevcutStok: 15,
      tahminiSatis: 40,
      minimumStok: 15,
      maksimumStok: 60,
      tedarikci: 'Samsung',
      sonGuncelleme: '2024-01-15'
    },
    {
      id: '5',
      urunAdi: 'Dell XPS 13',
      kategori: 'Laptop',
      fiyat: 38000,
      mevcutStok: 20,
      tahminiSatis: 30,
      minimumStok: 12,
      maksimumStok: 45,
      tedarikci: 'Dell',
      sonGuncelleme: '2024-01-15'
    }
  ],

  stokTahminleri: [
    {
      urunId: '1',
      urunAdi: 'MacBook Pro 14" M3',
      mevcutStok: 25,
      tahminiSatis: 35,
      stokDurumu: 'kritik',
      eksikStok: 10,
      fazlaStok: 0,
      tahminiCiro: 1575000,
      depodakiCiro: 1125000,
      ciroFarki: -450000,
      oneri: 'Acil sipariş verilmeli'
    },
    {
      urunId: '2',
      urunAdi: 'iPhone 15 Pro Max',
      mevcutStok: 45,
      tahminiSatis: 60,
      stokDurumu: 'kritik',
      eksikStok: 15,
      fazlaStok: 0,
      tahminiCiro: 2100000,
      depodakiCiro: 1575000,
      ciroFarki: -525000,
      oneri: 'Stok artırılmalı'
    },
    {
      urunId: '3',
      urunAdi: 'iPad Pro 12.9"',
      mevcutStok: 30,
      tahminiSatis: 25,
      stokDurumu: 'normal',
      eksikStok: 0,
      fazlaStok: 5,
      tahminiCiro: 700000,
      depodakiCiro: 840000,
      ciroFarki: 140000,
      oneri: 'Stok yeterli'
    },
    {
      urunId: '4',
      urunAdi: 'Samsung Galaxy S24 Ultra',
      mevcutStok: 15,
      tahminiSatis: 40,
      stokDurumu: 'kritik',
      eksikStok: 25,
      fazlaStok: 0,
      tahminiCiro: 1280000,
      depodakiCiro: 480000,
      ciroFarki: -800000,
      oneri: 'Acil sipariş gerekli'
    },
    {
      urunId: '5',
      urunAdi: 'Dell XPS 13',
      mevcutStok: 20,
      tahminiSatis: 30,
      stokDurumu: 'kritik',
      eksikStok: 10,
      fazlaStok: 0,
      tahminiCiro: 1140000,
      depodakiCiro: 760000,
      ciroFarki: -380000,
      oneri: 'Stok artırılmalı'
    }
  ],

  ciroAnalizi: [
    {
      urunId: '1',
      urunAdi: 'MacBook Pro 14" M3',
      tahminiCiro: 1575000,
      depodakiCiro: 1125000,
      ciroFarki: -450000,
      yuzdeFark: -28.6,
      durum: 'azalis'
    },
    {
      urunId: '2',
      urunAdi: 'iPhone 15 Pro Max',
      tahminiCiro: 2100000,
      depodakiCiro: 1575000,
      ciroFarki: -525000,
      yuzdeFark: -25.0,
      durum: 'azalis'
    },
    {
      urunId: '3',
      urunAdi: 'iPad Pro 12.9"',
      tahminiCiro: 700000,
      depodakiCiro: 840000,
      ciroFarki: 140000,
      yuzdeFark: 20.0,
      durum: 'artis'
    },
    {
      urunId: '4',
      urunAdi: 'Samsung Galaxy S24 Ultra',
      tahminiCiro: 1280000,
      depodakiCiro: 480000,
      ciroFarki: -800000,
      yuzdeFark: -62.5,
      durum: 'azalis'
    },
    {
      urunId: '5',
      urunAdi: 'Dell XPS 13',
      tahminiCiro: 1140000,
      depodakiCiro: 760000,
      ciroFarki: -380000,
      yuzdeFark: -33.3,
      durum: 'azalis'
    }
  ]
}; 