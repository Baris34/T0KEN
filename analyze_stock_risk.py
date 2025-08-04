# analyze_stock_risk_final.py (Doğru Stok Mantığı Versiyonu)

import pandas as pd
import json
import os
from datetime import datetime, timedelta

print("Gelişmiş Stok, Coğrafi ve Detaylı Kategori Analizi Başlatıldı...")

# --- Dosya Yolları ve Parametreler ---
ORDERS_FILE = 'birlesik_siparis_urun_verisi_processed.xlsx'
GEO_FILE = 'public/geographic_orders.csv'
CATEGORIES_FILE = 'temp_csv_processing/filtered_electronic_categories.csv' 
OUTPUT_JSON_FILE = os.path.join('public', 'dashboard_data.json')

# --- Veri Okuma ---
try:
    print("Veri dosyaları okunuyor...")
    df_orders = pd.read_excel(ORDERS_FILE)
    df_geo = pd.read_csv(GEO_FILE)
    df_categories = pd.read_csv(CATEGORIES_FILE)
    print("Tüm veri dosyaları başarıyla okundu.")
except FileNotFoundError as e:
    raise

# --- 1. Stok Risk Analizi (Stok Tahmin Sayfası İçin) ---
# ** BURASI SADELEŞTİRİLDİ **
print("\n--- 1. Stok Risk Analizi ---")
required_columns = ['product_name', 'stock_quantity', 'price', 'brand', 'category_id']
if not all(col in df_orders.columns for col in required_columns):
    raise Exception("Stok analizi için gerekli sütunlar bulunamadı!")

aggregation_rules = {'stock_quantity': 'sum', 'price': 'mean', 'brand': 'first', 'category_id': 'first'}
df_analysis = df_orders.groupby('product_name').agg(aggregation_rules).reset_index()

print("İdeal stok seviyeleri ve durumlar hesaplanıyor...")

# Adım 1: Popülerlik Skoru
df_analysis['popularity_score'] = df_analysis['price'] / df_analysis['price'].max()

# Adım 2: Varsayımsal "İdeal Stok" seviyesi
IDEAL_STOCK_MAX = 150 
df_analysis['ideal_stok'] = (df_analysis['popularity_score'] * IDEAL_STOCK_MAX).round()

# Adım 3: Eksik/Fazla miktarını hesapla
df_analysis['eksik_fazla'] = df_analysis['stock_quantity'] - df_analysis['ideal_stok']

# Adım 4: Ciro Farkını (Potansiyel Kaybı) hesapla
df_analysis['ciro_farki'] = 0.0
df_analysis.loc[df_analysis['eksik_fazla'] < 0, 'ciro_farki'] = -df_analysis['eksik_fazla'] * df_analysis['price']

# Adım 5: Durum etiketini EN BASİT VE KESİN mantıkla belirle
def get_status(row):
    # Mevcut stok, ideal stoktan DÜŞÜKSE "Kritik"
    if row['eksik_fazla'] < 0:
        return 'Kritik'
    # Geri kalan tüm durumlar "Normal"
    else:
        return 'Normal'
df_analysis['durum'] = df_analysis.apply(get_status, axis=1)


# Sonuçları Hesapla
kritik_urun_sayisi = len(df_analysis[df_analysis['durum'] == 'Kritik'])
normal_stok_sayisi = len(df_analysis[df_analysis['durum'] == 'Normal'])
# eksik_stok_sayisi artık SIFIR olacak, çünkü bu durumu kaldırdık.
eksik_stok_sayisi = 0 
toplam_ciro_farki = df_analysis['ciro_farki'].sum()

# Stok tahmin sayfası için JSON verisini hazırla
stok_tahmin_detaylari_json = {
    'kritikStokSayisi': kritik_urun_sayisi,
    'normalStokSayisi': normal_stok_sayisi,
    'eksikStokSayisi': eksik_stok_sayisi, # Arayüzde hata olmaması için bunu 0 olarak gönderiyoruz
    'toplamCiroFarki': toplam_ciro_farki,
    'urunListesi': df_analysis.rename(columns={'stock_quantity': 'mevcutStok', 'ideal_stok': 'tahminiSatis'}).to_dict(orient='records')
}
print("Stok analizi tamamlandı.")

print("\n--- 2. Coğrafi Analiz ---")

# Toplam Bölge Sayısı
bolge_sayisi = df_geo['region'].nunique()
print(f"Hesaplanan benzersiz bölge (eyalet) sayısı: {bolge_sayisi}")

# Toplam Hacim (Ciro)
toplam_hacim = df_geo['total_amount'].sum()
print(f"Hesaplanan toplam coğrafi hacim: {toplam_hacim:,.2f}")

# Bölge Bazında Hacim
bolge_bazinda_hacim = df_geo.groupby('region')['total_amount'].sum().reset_index()
bolge_bazinda_hacim.rename(columns={'region': 'bolge', 'total_amount': 'hacim'}, inplace=True)

# Bölge Bazında Lojistik Gideri (shipping_cost'ları toplayarak)
bolge_bazinda_lojistik = df_geo.groupby('region')['shipping_cost'].sum().reset_index()
bolge_bazinda_lojistik.rename(columns={'region': 'bolge', 'shipping_cost': 'lojistikGideri'}, inplace=True)

# Bölge Bazında Şehirler
bolge_bazinda_sehirler = df_geo.groupby('region')['city'].unique().apply(list).reset_index()
bolge_bazinda_sehirler.rename(columns={'region': 'bolge', 'city': 'sehirler'}, inplace=True)

# Üç tabloyu tek bir final tabloda birleştir
df_final_geo = pd.merge(bolge_bazinda_hacim, bolge_bazinda_sehirler, on='bolge', how='left')
df_final_geo = pd.merge(df_final_geo, bolge_bazinda_lojistik, on='bolge', how='left')

# Yüzdelik dağılımı ekle
df_final_geo['yuzde'] = (df_final_geo['hacim'] / toplam_hacim) * 100
print("Bölge bazında tüm detaylar hesaplandı ve birleştirildi.")

# Tüm coğrafi verileri tek bir dictionary'de topla
cografi_analiz_json = {
    'toplamBolge': bolge_sayisi,
    'toplamHacim': toplam_hacim,
    'bolgeDetaylari': df_final_geo.to_dict(orient='records') # Tek ve temiz bir liste
}


# --- 3. Detaylı Kategori Analizi (Ana Dashboard İçin) ---
print("\n--- 3. Detaylı Kategori Analizi ---")

# Adım 3a: Gerekli sütunların varlığını KESİNLİKLE kontrol et
required_columns_detail = ['category_id', 'created_at', 'line_total']
if not all(col in df_orders.columns for col in required_columns_detail):
    print(f"HATA: Detaylı analiz için gerekli sütunlar 'birlesik_siparis_urun_verisi_processed.xlsx' dosyasında bulunamadı!")
    print(f"Beklenen Sütunlar: {required_columns_detail}")
    # Bu bölümü atla ama programı durdurma
    detayli_analiz_json = []
else:
    # Adım 3b: Sadece ihtiyacımız olan sütunlarla geçici tablolar oluştur.
    # Bu, 'merge' işlemindeki tüm sütun adı çakışmalarını önler.
    df_temp_orders = df_orders[['category_id', 'created_at', 'line_total']].copy()
    df_temp_categories = df_categories[['category_id', 'category_name']].copy()

    # Adım 3c: Temiz tabloları birleştir. Artık 'created_at' kaybolmayacak.
    df_merged_for_analysis = pd.merge(df_temp_orders, df_temp_categories, on='category_id', how='left')

    # Adım 3d: 'created_at' sütununu tarih formatına çevir.
    df_merged_for_analysis['created_at'] = pd.to_datetime(df_merged_for_analysis['created_at'])

    # Adım 3e: Her kategori için TOPLAM ciro hesapla.
    total_revenue_by_category = df_merged_for_analysis.groupby('category_name')['line_total'].sum().reset_index()
    total_revenue_by_category.rename(columns={'line_total': 'toplam_ciro'}, inplace=True)
    print("Kategori bazında toplam ciro hesaplandı.")

    # Adım 3f: Her kategori için SON 3 AYDAKİ ciro hesapla.
    three_months_ago = datetime.now() - timedelta(days=90)
    df_last_3_months = df_merged_for_analysis[df_merged_for_analysis['created_at'] >= three_months_ago]
    revenue_last_3_months = df_last_3_months.groupby('category_name')['line_total'].sum().reset_index()
    revenue_last_3_months.rename(columns={'line_total': 'son_3_ay_ciro'}, inplace=True)
    print("Kategori bazında son 3 aylık ciro hesaplandı.")

    # Adım 3g: İki sonucu birleştir.
    df_final_analysis = pd.merge(total_revenue_by_category, revenue_last_3_months, on='category_name', how='left')
    df_final_analysis['son_3_ay_ciro'].fillna(0, inplace=True)

    # Adım 3h: Büyüme oranını hesapla.
    total_months = (df_merged_for_analysis['created_at'].max() - df_merged_for_analysis['created_at'].min()).days / 30.0
    if total_months < 1: total_months = 1
    df_final_analysis['aylik_ortalama_ciro'] = df_final_analysis['toplam_ciro'] / total_months
    df_final_analysis['ortalama_3_aylik_ciro'] = df_final_analysis['aylik_ortalama_ciro'] * 3
    df_final_analysis['son_3_ay_artis'] = 0.0
    non_zero_mask = df_final_analysis['ortalama_3_aylik_ciro'] > 0
    df_final_analysis.loc[non_zero_mask, 'son_3_ay_artis'] = ((df_final_analysis.loc[non_zero_mask, 'son_3_ay_ciro'] / df_final_analysis.loc[non_zero_mask, 'ortalama_3_aylik_ciro']) - 1) * 100
    df_final_analysis['son_3_ay_artis'].fillna(0, inplace=True)
    print("Büyüme oranları hesaplandı.")

    # Adım 3i: JSON formatına çevir.
    df_final_analysis.rename(columns={
        'category_name': 'kategori', 'toplam_ciro': 'oncekiDonem', 'son_3_ay_ciro': 'simdikiDonem'
    }, inplace=True)
    detayli_analiz_json = df_final_analysis[['kategori', 'son_3_ay_artis', 'oncekiDonem', 'simdikiDonem']].to_dict(orient='records')


print("\n--- 4. Sidebar Kategori Sayıları Analizi ---")
# Benzersiz ürün listemizi (df_grouped) kategori isimleriyle birleştirelim
df_merged_sidebar = pd.merge(df_orders, df_categories, on='category_id', how='left')

# Adım 4b: Kategori ismine göre grupla ve her gruptaki BENZERSİZ 'product_name' sayısını say.
# .nunique() fonksiyonu bu işi yapar ve bize her kategoride kaç farklı ürün olduğunu verir.
sidebar_category_counts = df_merged_sidebar.groupby('category_name')['product_name'].nunique().reset_index(name='sayi')
sidebar_category_counts.rename(columns={'category_name': 'kategori'}, inplace=True)
sidebar_kategori_sayilari_json = sidebar_category_counts.to_dict(orient='records')

print("Sidebar için kategori sayıları hesaplandı.")


print("\n--- 5. Sonuçları Kaydetme ---")
try:
    output_directory = 'public'
    os.makedirs(output_directory, exist_ok=True)
    json_path = os.path.join(output_directory, 'dashboard_data.json')
    
    # YENİ EKLENDİ: SatisOranlari (pasta grafik) için veriyi burada hesapla
    print("Ana dashboard için Satış Oranları verisi hesaplanıyor...")
    satis_oranlari_merged = pd.merge(df_orders, df_categories, on='category_id', how='left')
    satis_oranlari_by_category = satis_oranlari_merged.groupby('category_name')['line_total'].sum().reset_index()
    satis_oranlari_by_category.rename(columns={'category_name': 'kategori', 'line_total': 'miktar'}, inplace=True)
    total_revenue_for_pie = satis_oranlari_by_category['miktar'].sum()
    if total_revenue_for_pie > 0:
        satis_oranlari_by_category['yuzde'] = (satis_oranlari_by_category['miktar'] / total_revenue_for_pie) * 100
    else:
        satis_oranlari_by_category['yuzde'] = 0
    satis_oranlari_json = satis_oranlari_by_category.to_dict(orient='records')

    
    # Tüm verileri tek bir yerde topla
    dashboard_data = {
        'kritikStok': kritik_urun_sayisi,
        'bolgeSayisi': bolge_sayisi,
        'detayliAnaliz': detayli_analiz_json,
        'toplamSatis': df_orders['line_total'].sum(),
        'satisOranlari': satis_oranlari_json, # ARTIK BU VERİ DE EKLENDİ
        'stokTahminDetaylari': stok_tahmin_detaylari_json,
        'cografiAnalizDetaylari': cografi_analiz_json,
        'sidebarKategoriSayilari': sidebar_kategori_sayilari_json
    }
    
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(dashboard_data, f, ensure_ascii=False, indent=4)
        
    print(f"JSON dosyası '{json_path}' başarıyla güncellendi.")

except Exception as e:
    raise