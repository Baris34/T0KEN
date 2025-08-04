import pandas as pd

# --- Adım 1: Gerekli dosya isimlerini tanımla ---
# Bu script'in ve categories.csv'nin aynı klasörde olduğunu varsayıyoruz.
input_csv_file = 'categories.csv'
output_csv_file = 'filtered_electronic_categories.csv'

print(f"'{input_csv_file}' dosyası okunuyor...")

# --- Adım 2: CSV dosyasını oku ---
# Dosyanın var olup olmadığını kontrol edelim.
try:
    # 'df' (DataFrame), Excel tablosu gibi düşünebileceğin bir veri yapısıdır.
    df = pd.read_csv(input_csv_file)
except FileNotFoundError:
    print(f"HATA: '{input_csv_file}' adında bir dosya bu klasörde bulunamadı!")
    print("Lütfen dosyayı doğru yere kopyaladığından emin ol.")
    exit() # Dosya yoksa programı sonlandır.

print("Dosya başarıyla okundu. Veri yapısı:")
print(df.head()) # İlk 5 satırı göstererek dosyanın doğru okunduğunu kontrol edelim.
print(f"\nToplam satır sayısı: {len(df)}")


# --- Adım 3: Filtreleme işlemini yap ---
# Sadece 'parent_category' sütunundaki değeri 'electronic' olan satırları seçeceğiz.
# NOT: Büyük/küçük harf duyarlılığını ortadan kaldırmak için .str.lower() kullanmak güvenli bir yöntemdir.
print("\n'parent_category' sütunu 'electronic' olanlar filtreleniyor...")

# Koşulumuz: df['parent_category']'nin küçük harfli hali 'electronic' kelimesine eşit mi?
condition = df['parent_category'] == 'Electronics'

# Bu koşulu sağlayan satırları yeni bir DataFrame'e ata.
filtered_df = df[condition]

print("Filtreleme tamamlandı.")
print(f"Filtrelemeden sonraki satır sayısı: {len(filtered_df)}")


# --- Adım 4: Filtrelenmiş veriyi yeni bir CSV dosyasına kaydet ---
# 'index=False' parametresi, DataFrame'in kendi index numarasını CSV'ye yazmasını engeller.
filtered_df.to_csv(output_csv_file, index=False)

print(f"\nİşlem tamamlandı! Elektronik kategorileri '{output_csv_file}' dosyasına kaydedildi.")