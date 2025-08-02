export interface SatisVerisi {
  kategori: string;
  miktar: number;
  yuzde: number;
  renk: string;
}

export interface AylikTahmin {
  ay: string;
  tahminiSatis: number;
  potansiyelKayip: number;
  stokDurumu: number;
  gelecekAyIhtiyac: number;
}

export interface KategorikGidisat {
  kategori: string;
  son3AyArtis: number;
  oncekiDonem: number;
  simdikiDonem: number;
}

export interface CografiBolge {
  bolgeAdi: string;
  sehirler: string[];
  depoTavsiyesi: string;
  onerilenDepoSehri: string;
  ekonomikHacim: number;
  lojistikGideri: number;
}

// Yeni tip tanımları
export interface TeknolojiUrunu {
  id: string;
  urunAdi: string;
  kategori: string;
  fiyat: number;
  mevcutStok: number;
  tahminiSatis: number;
  minimumStok: number;
  maksimumStok: number;
  tedarikci: string;
  sonGuncelleme: string;
}

export interface StokTahmin {
  urunId: string;
  urunAdi: string;
  mevcutStok: number;
  tahminiSatis: number;
  stokDurumu: 'kritik' | 'normal' | 'fazla';
  eksikStok: number;
  fazlaStok: number;
  tahminiCiro: number;
  depodakiCiro: number;
  ciroFarki: number;
  oneri: string;
}

export interface CiroAnalizi {
  urunId: string;
  urunAdi: string;
  tahminiCiro: number;
  depodakiCiro: number;
  ciroFarki: number;
  yuzdeFark: number;
  durum: 'artis' | 'azalis' | 'sabit';
}

export interface User {
  id: number;
  username: string;
  password: string;
  name: string;
  role: 'admin' | 'manager' | 'analyst';
  email: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface DashboardVerileri {
  satisOranlari: SatisVerisi[];
  aylikTahminler: AylikTahmin[];
  kategorikGidisat: KategorikGidisat[];
  cografiAnaliz: CografiBolge[];
  teknolojiUrunleri: TeknolojiUrunu[];
  stokTahminleri: StokTahmin[];
  ciroAnalizi: CiroAnalizi[];
} 