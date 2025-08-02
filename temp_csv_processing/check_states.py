import pandas as pd

# CSV dosyasını oku
df = pd.read_csv('../public/filtered_orders_by_excel.csv')

print(f"Toplam satır sayısı: {len(df)}")
print(f"Sütun isimleri: {list(df.columns)}")

# Adres sütununu kontrol et
if 'shipping_address' in df.columns:
    print("\nİlk 10 adres:")
    for i, address in enumerate(df['shipping_address'].head(10)):
        print(f"{i+1}. {address}")
    
    # Eyalet kısaltmalarını ara
    import re
    states_found = set()
    for address in df['shipping_address']:
        if pd.notna(address):
            # Eyalet kısaltmalarını ara (2 harfli)
            state_matches = re.findall(r', ([A-Z]{2}) ', str(address))
            states_found.update(state_matches)
    
    print(f"\nBulunan eyalet kısaltmaları: {sorted(states_found)}")
    
    # Eyalet adlarını ara
    state_names = [
        'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
        'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
        'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
        'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
        'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
        'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
        'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
        'Wisconsin', 'Wyoming'
    ]
    
    full_states_found = set()
    for address in df['shipping_address']:
        if pd.notna(address):
            address_str = str(address)
            for state_name in state_names:
                if state_name in address_str:
                    full_states_found.add(state_name)
    
    print(f"Bulunan eyalet adları: {sorted(full_states_found)}")

else:
    print("shipping_address sütunu bulunamadı!")
    print("Mevcut sütunlar:", list(df.columns)) 