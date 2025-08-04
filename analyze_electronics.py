# analyze_electronics.py

import pandas as pd
import json
import os
import random # YENİ EKLENEN KISIM

print("Elektronik ürün analizi başlatıldı...")

# --- Dosya Yollarını Tanımla ---
DATA_DIR = 'temp_csv_processing'
PRODUCTS_FILE = os.path.join(DATA_DIR, 'filtered_electronic_products.csv')
CATEGORIES_FILE = os.path.join(DATA_DIR, 'filtered_electronic_categories.csv')
OUTPUT_JSON_FILE = os.path.join('public', 'dashboard_data.json')

# --- Verileri Oku ---
try:
    df_products = pd.read_csv(PRODUCTS_FILE)
    df_categories = pd.read_csv(CATEGORIES_FILE)
    print("Gerekli CSV dosyaları başarıyla okundu.")
except FileNotFoundError as e:
    print(f"HATA: Dosya bulunamadı! - {e}")
    exit()

# --- Hesaplamalar ---

# 1. Toplam Satış Değeri
df_products['total_value'] = df_products['price'] * df_products['stock_quantity']
toplam_satis_degeri = df_products['total_value'].sum()
print(f"Hesaplanan Toplam Değer: {toplam_satis_degeri:,.2f}")

# 2. Satış Oranları (Pasta Grafik için)
df_merged = pd.merge(df_products, df_categories, on='category_id', how='left')
category_sales = df_merged.groupby('category_name')['total_value'].sum().reset_index()
category_sales = category_sales.rename(columns={'category_name': 'kategori', 'total_value': 'miktar'})
category_sales['yuzde'] = (category_sales['miktar'] / toplam_satis_degeri) * 100
satis_oranlari_data = category_sales.to_dict(orient='records')
print("Satış oranları hesaplandı.")

# YENİ EKLENEN KISIM: Detaylı Analiz Tablosu için veri üretimi
print("Detaylı Analiz verisi oluşturuluyor...")
detayli_analiz_data = []
# category_sales DataFrame'ini kullanarak her kategori için veri oluşturalım
for index, row in category_sales.iterrows():
    simdiki_donem = row['miktar']
    # Önceki dönem için şimdikinden %5-25 daha az bir değer üretelim
    onceki_donem = simdiki_donem * random.uniform(0.75, 0.95)
    # Artış yüzdesini hesaplayalım
    artis = ((simdiki_donem - onceki_donem) / onceki_donem) * 100 if onceki_donem > 0 else 0
    
    detayli_analiz_data.append({
        'kategori': row['kategori'],
        'son3AyArtis': artis,
        'oncekiDonem': onceki_donem,
        'simdikiDonem': simdiki_donem,
    })


# --- Dashboard için Son JSON'u Oluştur ---
dashboard_json = {
    "toplamSatis": toplam_satis_degeri,
    "satisOranlari": satis_oranlari_data,
    "detayliAnaliz": detayli_analiz_data, # YENİ: Veriyi JSON'a ekliyoruz
    
    # Yer tutucular
    "kritikStok": 4, 
    "bolgeSayisi": 12,
}

# --- JSON Dosyasını Kaydet ---
os.makedirs('public', exist_ok=True)
print(f"Hesaplanan veriler '{OUTPUT_JSON_FILE}' dosyasına yazılıyor...")
with open(OUTPUT_JSON_FILE, 'w', encoding='utf-8') as f:
    json.dump(dashboard_json, f, ensure_ascii=False, indent=4)

print("\nİşlem tamamlandı! 'public/dashboard_data.json' dosyası güncellendi.")