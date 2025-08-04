# filter_products.py

import pandas as pd

# --- Adım 1: Gerekli dosya isimlerini tanımla ---
categories_file = 'filtered_electronic_categories.csv'
products_file = 'products.csv'
output_file = 'filtered_electronic_products.csv'

print("Gerekli dosyalar okunuyor...")

# --- Adım 2: İki CSV dosyasını da oku ---
try:
    # Elektronik kategorilerini içeren DataFrame
    df_elektronic_kategoriler = pd.read_csv(categories_file)
    
    # Tüm ürünleri içeren DataFrame
    df_tum_urunler = pd.read_csv(products_file)
except FileNotFoundError as e:
    print(f"HATA: Dosya bulunamadı! - {e}")
    print("Lütfen 'filtered_electronic_categories.csv' ve 'products.csv' dosyalarının aynı klasörde olduğundan emin ol.")
    exit()

print("Dosyalar başarıyla okundu.")

# İşlemden önce küçük bir kontrol yapalım
print(f"Toplam ürün sayısı: {len(df_tum_urunler)}")
print(f"Filtrelenmiş elektronik kategori sayısı: {len(df_elektronic_kategoriler)}")


# --- Adım 3: Elektronik Kategorilerin ID'lerini bir liste olarak al ---
# df_elektronic_kategoriler tablosundaki 'category_id' sütununu alıyoruz.
# .unique() kullanarak tekrarlanan ID'ler varsa teke indiriyoruz (genelde gerekmez ama iyi bir pratiktir).
# .tolist() ile de bu ID'leri bir Python listesine çeviriyoruz.
elektronik_kategori_idler = df_elektronic_kategoriler['category_id'].unique().tolist()

print(f"\nElektronik kategorilere ait ID'ler bulundu: {elektronik_kategori_idler}")


# --- Adım 4: Ürünleri bu ID listesine göre filtrele ---
# 'isin()' metodu, bir sütundaki değerlerin bir liste içinde olup olmadığını kontrol eder.
# Yani: "df_tum_urunler içindeki 'category_id' sütununda, elektronik_kategori_idler listesindeki elemanlardan biri olan satırları getir."
print("Ürünler, elektronik kategori ID'lerine göre filtreleniyor...")

df_elektronik_urunler = df_tum_urunler[df_tum_urunler['category_id'].isin(elektronik_kategori_idler)]

print("Filtreleme tamamlandı.")
print(f"Filtrelenmiş elektronik ürün sayısı: {len(df_elektronik_urunler)}")


# --- Adım 5: Filtrelenmiş ürünleri yeni bir CSV dosyasına kaydet ---
df_elektronik_urunler.to_csv(output_file, index=False)

print(f"\nİşlem tamamlandı! Elektronik ürünler '{output_file}' dosyasına kaydedildi.")