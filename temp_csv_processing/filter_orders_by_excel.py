import pandas as pd
import os

# Excel dosyasını oku
excel_file = '../birlesik_siparis_urun_verisi_processed.xlsx'
excel_df = pd.read_excel(excel_file)

print(f"Excel dosyası boyutu: {excel_df.shape}")
print(f"Excel dosyası sütunları: {list(excel_df.columns)}")

# Excel'deki order_id değerlerini al
if 'order_id' in excel_df.columns:
    excel_order_ids = set(excel_df['order_id'].unique())
    print(f"Excel'deki benzersiz order_id sayısı: {len(excel_order_ids)}")
    print(f"İlk 10 order_id: {list(excel_order_ids)[:10]}")
else:
    print("Excel dosyasında 'order_id' sütunu bulunamadı!")
    print("Mevcut sütunlar:", list(excel_df.columns))
    exit()

# CSV dosyalarını işle
csv_files = [
    '../orders_part_001.csv',
    '../orders_part_002.csv', 
    '../orders_part_003.csv',
    '../orders_part_004.csv',
    '../orders.csv'
]

all_filtered_data = []

for csv_file in csv_files:
    if os.path.exists(csv_file):
        print(f"\nİşleniyor: {csv_file}")
        
        # CSV dosyasını oku
        csv_df = pd.read_csv(csv_file)
        print(f"CSV boyutu: {csv_df.shape}")
        
        # order_id sütunu var mı kontrol et
        if 'order_id' in csv_df.columns:
            # Excel'deki order_id'lerle eşleşen satırları filtrele
            filtered_df = csv_df[csv_df['order_id'].isin(excel_order_ids)]
            print(f"Eşleşen satır sayısı: {len(filtered_df)}")
            
            if len(filtered_df) > 0:
                all_filtered_data.append(filtered_df)
        else:
            print(f"'{csv_file}' dosyasında 'order_id' sütunu bulunamadı!")
    else:
        print(f"Dosya bulunamadı: {csv_file}")

# Tüm filtrelenmiş verileri birleştir
if all_filtered_data:
    final_df = pd.concat(all_filtered_data, ignore_index=True)
    print(f"\nToplam filtrelenmiş satır sayısı: {len(final_df)}")
    
    # Sonucu kaydet
    output_file = 'filtered_orders_by_excel.csv'
    final_df.to_csv(output_file, index=False)
    print(f"Filtrelenmiş veriler '{output_file}' dosyasına kaydedildi.")
    
    # Özet bilgiler
    print(f"\nÖzet:")
    print(f"- Excel'deki order_id sayısı: {len(excel_order_ids)}")
    print(f"- Filtrelenmiş satır sayısı: {len(final_df)}")
    print(f"- Benzersiz order_id sayısı (filtrelenmiş): {len(final_df['order_id'].unique())}")
else:
    print("Hiçbir eşleşen veri bulunamadı!") 