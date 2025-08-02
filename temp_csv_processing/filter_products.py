import pandas as pd

# CSV dosyasını oku
df = pd.read_csv('../products.csv')

print(f"Orijinal veri seti boyutu: {df.shape}")
print(f"product_id sütunundaki benzersiz değerler: {sorted(df['product_id'].unique())}")

# product_id değeri 1, 2, 3, 4, 5, 6 olan satırları filtrele
filtered_df = df[df['product_id'].isin([1, 2, 3, 4, 5, 6])]

print(f"Filtrelenmiş veri seti boyutu: {filtered_df.shape}")
print(f"Filtrelenmiş product_id değerleri: {sorted(filtered_df['product_id'].unique())}")

# Filtrelenmiş veriyi kaydet
filtered_df.to_csv('filtered_products.csv', index=False)

print("Filtrelenmiş veri 'filtered_products.csv' dosyasına kaydedildi.") 