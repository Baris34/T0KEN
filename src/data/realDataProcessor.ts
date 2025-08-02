import { 
  SatisVerisi, 
  AylikTahmin, 
  KategorikGidisat, 
  CografiBolge, 
  TeknolojiUrunu, 
  StokTahmin, 
  CiroAnalizi,
  DashboardVerileri 
} from '../types/index.ts';

// Kategori isimleri
const KATEGORI_ISIMLERI: { [key: number]: string } = {
  1: 'Smartphones',
  2: 'Laptops', 
  3: 'Tablets',
  4: 'Cameras',
  5: 'Televisions',
  6: 'Headphones'
};

// Veri okuma fonksiyonları
export const loadExcelData = async (): Promise<any[]> => {
  try {
    console.log('Excel verisi yükleniyor...');
    const timestamp = Date.now();
    const response = await fetch(`/birlesik_siparis_urun_verisi_processed.xlsx?t=${timestamp}`);
    
    if (!response.ok) {
      throw new Error(`Excel dosyası bulunamadı: ${response.status} ${response.statusText}`);
    }
    
    // Excel dosyasını okuyup JSON'a çevir
    // Bu kısım için backend API gerekebilir
    console.log('Excel dosyası bulundu ama parse edilemiyor (backend gerekli)');
    return [];
  } catch (error) {
    console.error('Excel verisi yüklenemedi:', error);
    throw new Error('Excel verisi yüklenemedi. Dosya mevcut değil veya erişilemiyor.');
  }
};

export const loadOrdersData = async (): Promise<any[]> => {
  try {
    console.log('Sipariş verisi yükleniyor...');
    const timestamp = Date.now();
    const response = await fetch(`/geographic_orders.csv?t=${timestamp}`);
    
    if (!response.ok) {
      throw new Error(`Sipariş dosyası bulunamadı: ${response.status} ${response.statusText}`);
    }
    
    const csvText = await response.text();
    const data = parseCSV(csvText);
    console.log('Sipariş verisi yüklendi:', data.length, 'satır');
    return data;
  } catch (error) {
    console.error('Sipariş verisi yüklenemedi:', error);
    throw new Error('Sipariş verisi yüklenemedi. Dosya mevcut değil veya erişilemiyor.');
  }
};

export const loadProductsData = async (): Promise<any[]> => {
  try {
    console.log('Ürün verisi yükleniyor...');
    const timestamp = Date.now();
    const response = await fetch(`/filtered_products.csv?t=${timestamp}`);
    
    if (!response.ok) {
      throw new Error(`Ürün dosyası bulunamadı: ${response.status} ${response.statusText}`);
    }
    
    const csvText = await response.text();
    const data = parseCSV(csvText);
    console.log('Ürün verisi yüklendi:', data.length, 'satır');
    return data;
  } catch (error) {
    console.error('Ürün verisi yüklenemedi:', error);
    throw new Error('Ürün verisi yüklenemedi. Dosya mevcut değil veya erişilemiyor.');
  }
};

// CSV parse fonksiyonu
const parseCSV = (csvText: string): any[] => {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',');
  const data = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim()) {
      const values = lines[i].split(',');
      const row: any = {};
      headers.forEach((header, index) => {
        row[header.trim()] = values[index]?.trim() || '';
      });
      data.push(row);
    }
  }
  
  return data;
};

// Satış oranları hesaplama
export const calculateSalesRates = (data: any[]): SatisVerisi[] => {
  const categorySales: { [key: number]: number } = {};
  
  data.forEach(item => {
    const categoryId = parseInt(item.category_id);
    const lineTotal = parseFloat(item.line_total) || 0;
    
    if (categoryId >= 1 && categoryId <= 6) {
      categorySales[categoryId] = (categorySales[categoryId] || 0) + lineTotal;
    }
  });
  
  const totalSales = Object.values(categorySales).reduce((sum, val) => sum + val, 0);
  
  return Object.entries(categorySales).map(([categoryId, sales]) => ({
    kategori: KATEGORI_ISIMLERI[parseInt(categoryId)],
    miktar: sales,
    yuzde: totalSales > 0 ? (sales / totalSales) * 100 : 0,
    renk: `#${Math.floor(Math.random()*16777215).toString(16)}`
  }));
};

// Aylık tahminler hesaplama
export const calculateMonthlyForecasts = (ordersData: any[]): AylikTahmin[] => {
  const monthlyData: { [key: string]: any } = {};
  
  ordersData.forEach(order => {
    const date = new Date(order.order_date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = {
        ay: monthKey,
        tahminiSatis: 0,
        potansiyelKayip: 0,
        stokDurumu: 0,
        gelecekAyIhtiyac: 0
      };
    }
    
    const amount = parseFloat(order.total_amount) || 0;
    monthlyData[monthKey].tahminiSatis += amount;
    
    if (order.status === 'cancelled') {
      monthlyData[monthKey].potansiyelKayip += amount;
    }
  });
  
  return Object.values(monthlyData);
};

// Kategorik gidişat hesaplama
export const calculateCategoryTrends = (data: any[]): KategorikGidisat[] => {
  const categoryTrends: { [key: number]: any } = {};
  
  data.forEach(item => {
    const categoryId = parseInt(item.category_id);
    
    if (!categoryTrends[categoryId]) {
      categoryTrends[categoryId] = {
        kategori: KATEGORI_ISIMLERI[categoryId],
        son3Ay: 0,
        onceki3Ay: 0,
        yuzdeDegisim: 0
      };
    }
    
    const amount = parseFloat(item.line_total) || 0;
    
    // Mock veri için basit hesaplama
    if (categoryId % 2 === 0) {
      categoryTrends[categoryId].son3Ay += amount;
    } else {
      categoryTrends[categoryId].onceki3Ay += amount;
    }
  });
  
  return Object.values(categoryTrends).map(trend => ({
    kategori: trend.kategori,
    son3AyArtis: trend.onceki3Ay > 0 ? ((trend.son3Ay - trend.onceki3Ay) / trend.onceki3Ay) * 100 : 0,
    oncekiDonem: trend.onceki3Ay,
    simdikiDonem: trend.son3Ay
  }));
};

// Coğrafi analiz hesaplama
export const calculateGeographicAnalysis = (ordersData: any[]): CografiBolge[] => {
  console.log('Coğrafi analiz hesaplanıyor, sipariş sayısı:', ordersData.length);
  
  // İlk 5 siparişi detaylı göster
  console.log('İlk 5 sipariş detayı:');
  ordersData.slice(0, 5).forEach((order, index) => {
    console.log(`Sipariş ${index + 1}:`, {
      order_id: order.order_id,
      region: order.region,
      city: order.city,
      total_amount: order.total_amount,
      shipping_cost: order.shipping_cost,
      status: order.status
    });
  });
  
  const stateSales: { [key: string]: { sales: number, orders: number, shippingCost: number, cities: Set<string> } } = {};
  
  ordersData.forEach((order) => {
    // CSV'deki region sütununu kullan
    const state = order.region;
    const city = order.city;
    const amount = parseFloat(order.total_amount) || 0;
    const shippingCost = parseFloat(order.shipping_cost) || 0;
    
    // Tüm eyaletleri kabul et (filtreleme kaldırıldı)
    if (state && state.trim() !== '') {
      if (!stateSales[state]) {
        stateSales[state] = { sales: 0, orders: 0, shippingCost: 0, cities: new Set() };
      }
      stateSales[state].sales += amount;
      stateSales[state].orders += 1;
      stateSales[state].shippingCost += shippingCost;
      if (city) {
        stateSales[state].cities.add(city);
      }
    }
  });
  
  console.log('Bulunan eyaletler:', Object.keys(stateSales));
  console.log('Eyalet sayısı:', Object.keys(stateSales).length);
  
  // Toplam satışı hesapla
  const totalSales = Object.values(stateSales).reduce((sum, data) => sum + data.sales, 0);
  
  // En yüksek satış yapan eyaletleri al ve CografiBolge formatına çevir
  const topStates = Object.entries(stateSales)
    .sort(([,a], [,b]) => b.sales - a.sales)
    .slice(0, 8);
  
  console.log('İşlenecek eyaletler:', topStates.map(([state]) => state));
  
  return topStates.map(([state, data]) => {
    const stateFullName = getStateFullName(state);
    return {
      bolgeAdi: `${stateFullName} Bölgesi`,
      sehirler: Array.from(data.cities),
      toplamSatis: data.sales,
      lojistikMaliyet: data.shippingCost,
      depoOnerisi: stateFullName,
      ekonomikHacim: totalSales > 0 ? data.sales / totalSales : 0,
      sehirSayisi: data.cities.size
    };
  });
};

// Şehir adı çıkarma
const extractCityFromAddress = (address: string): string => {
  if (!address) return '';
  const parts = address.split(',');
  return parts[parts.length - 1]?.trim() || '';
};

// Eyalet adı çıkarma (ABD eyaletleri için)
const extractStateFromAddress = (address: string): string => {
  if (!address) return '';
  
  // Yeni CSV'de region sütunu var, direkt kullan
  if (address.region) {
    return address.region;
  }
  
  // Eyalet kısaltmalarını ara (2 harfli)
  const stateMatch = address.match(/, ([A-Z]{2})/);
  if (stateMatch) {
    return stateMatch[1];
  }
  
  // Eyalet adlarını ara
  const stateNames = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
    'Wisconsin', 'Wyoming'
  ];
  
  for (const stateName of stateNames) {
    if (address.includes(stateName)) {
      return stateName;
    }
  }
  
  return '';
};

// Eyalet kısaltmasını tam adına çevir
const getStateFullName = (abbreviation: string): string => {
  const stateMap: { [key: string]: string } = {
    'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
    'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
    'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
    'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
    'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi',
    'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire',
    'NJ': 'New Jersey', 'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina',
    'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania',
    'RI': 'Rhode Island', 'SC': 'South Carolina', 'SD': 'South Dakota', 'TN': 'Tennessee',
    'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington',
    'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming'
  };
  
  return stateMap[abbreviation] || abbreviation;
};

// Teknoloji ürünleri stok tahmini
export const calculateStockPredictions = (data: any[]): StokTahmin[] => {
  const productStock: { [key: string]: any } = {};
  
  data.forEach(item => {
    const productId = item.product_id;
    const productName = item.product_name;
    const stockQuantity = parseInt(item.stock_quantity) || 0;
    const price = parseFloat(item.price) || 0;
    const cost = parseFloat(item.cost) || 0;
    
    // Tüm ürünleri kabul et (category_id kontrolü kaldırıldı)
    if (!productStock[productId]) {
      productStock[productId] = {
        urunAdi: productName,
        mevcutStok: stockQuantity,
        tahminiSatis: Math.floor(stockQuantity * 0.8), // %80 satış tahmini
        stokDurumu: 'normal',
        eksikStok: 0,
        fazlaStok: 0,
        ciroFarki: 0,
        oneri: 'Normal'
      };
    }
  });
  
  return Object.values(productStock).map(product => {
    const eksikStok = Math.max(0, product.tahminiSatis - product.mevcutStok);
    const fazlaStok = Math.max(0, product.mevcutStok - product.tahminiSatis);
    const ciroFarki = (product.mevcutStok * product.price) - (product.tahminiSatis * product.cost);
    
    let stokDurumu = 'normal';
    let oneri = 'Normal';
    
    if (eksikStok > 0) {
      stokDurumu = 'kritik';
      oneri = 'Acil sipariş ver';
    } else if (fazlaStok > product.mevcutStok * 0.5) {
      stokDurumu = 'fazla';
      oneri = 'İndirim yap';
    }
    
    return {
      ...product,
      eksikStok,
      fazlaStok,
      ciroFarki,
      stokDurumu,
      oneri
    };
  });
};

// Ciro analizi
export const calculateRevenueAnalysis = (data: any[]): CiroAnalizi[] => {
  const revenueData: { [key: string]: any } = {};
  
  data.forEach(item => {
    const productId = item.product_id;
    const productName = item.product_name;
    const price = parseFloat(item.price) || 0;
    const cost = parseFloat(item.cost) || 0;
    const stockQuantity = parseInt(item.stock_quantity) || 0;
    
    if (!revenueData[productId]) {
      revenueData[productId] = {
        urunAdi: productName,
        tahminiCiro: 0,
        depodakiCiro: 0,
        ciroFarki: 0,
        yuzdeFark: 0,
        durum: 'sabit'
      };
    }
    
    const tahminiSatis = Math.floor(stockQuantity * 0.8);
    const tahminiCiro = tahminiSatis * price;
    const depodakiCiro = stockQuantity * price;
    const ciroFarki = tahminiCiro - depodakiCiro;
    const yuzdeFark = depodakiCiro > 0 ? ((tahminiCiro - depodakiCiro) / depodakiCiro) * 100 : 0;
    
    let durum = 'sabit';
    if (ciroFarki > 0) durum = 'artis';
    else if (ciroFarki < 0) durum = 'azalis';
    
    revenueData[productId] = {
      urunAdi: productName,
      tahminiCiro,
      depodakiCiro,
      ciroFarki,
      yuzdeFark,
      durum
    };
  });
  
  return Object.values(revenueData);
};

// Ana dashboard verisi oluşturma
export const createDashboardData = async (): Promise<DashboardVerileri> => {
  try {
    console.log('Dashboard verisi oluşturuluyor...');
    
    // Gerçek verileri yükle
    const ordersData = await loadOrdersData();
    const productsData = await loadProductsData();
    
    console.log('Yüklenen veriler:', {
      ordersDataLength: ordersData.length,
      productsDataLength: productsData.length
    });
    
    // Sipariş verisi kontrolü
    if (ordersData.length === 0) {
      throw new Error('Sipariş verisi bulunamadı. geographic_orders.csv dosyası boş veya mevcut değil.');
    }
    
    // Ürün verisi kontrolü
    if (productsData.length === 0) {
      throw new Error('Ürün verisi bulunamadı. filtered_products.csv dosyası boş veya mevcut değil.');
    }
    
    // Excel verisi olmadığı için mock veri kullan
    const mockExcelData = [
      { category_id: '1', line_total: '15000', created_at: '2024-01-15' },
      { category_id: '2', line_total: '25000', created_at: '2024-01-20' },
      { category_id: '3', line_total: '12000', created_at: '2024-02-10' },
      { category_id: '4', line_total: '18000', created_at: '2024-02-15' },
      { category_id: '5', line_total: '22000', created_at: '2024-03-05' },
      { category_id: '6', line_total: '8000', created_at: '2024-03-10' }
    ];
    
    console.log('Dashboard verisi başarıyla oluşturuldu');
    
    return {
      satisOranlari: calculateSalesRates(mockExcelData),
      aylikTahminler: calculateMonthlyForecasts(ordersData),
      kategorikGidisat: calculateCategoryTrends(mockExcelData),
      cografiAnaliz: calculateGeographicAnalysis(ordersData),
      teknolojiUrunleri: calculateStockPredictions(productsData),
      stokTahminleri: calculateStockPredictions(productsData),
      ciroAnalizi: calculateRevenueAnalysis(productsData)
    };
    
  } catch (error) {
    console.error('Dashboard verisi oluşturulamadı:', error);
    throw error; // Hatayı yukarı fırlat
  }
}; 