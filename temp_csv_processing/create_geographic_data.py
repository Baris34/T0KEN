import pandas as pd
import random

# ABD eyaletleri ve şehirleri
states_and_cities = {
    'California': ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento'],
    'Texas': ['Houston', 'Dallas', 'Austin', 'San Antonio'],
    'Florida': ['Miami', 'Orlando', 'Tampa', 'Jacksonville'],
    'New York': ['New York City', 'Buffalo', 'Rochester', 'Albany'],
    'Illinois': ['Chicago', 'Springfield', 'Peoria', 'Rockford'],
    'Pennsylvania': ['Philadelphia', 'Pittsburgh', 'Harrisburg', 'Allentown'],
    'Ohio': ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo'],
    'Georgia': ['Atlanta', 'Savannah', 'Athens', 'Macon'],
    'North Carolina': ['Charlotte', 'Raleigh', 'Greensboro', 'Durham'],
    'Michigan': ['Detroit', 'Grand Rapids', 'Lansing', 'Ann Arbor'],
    'New Jersey': ['Newark', 'Jersey City', 'Paterson', 'Elizabeth'],
    'Virginia': ['Richmond', 'Virginia Beach', 'Norfolk', 'Arlington'],
    'Washington': ['Seattle', 'Spokane', 'Tacoma', 'Vancouver'],
    'Arizona': ['Phoenix', 'Tucson', 'Mesa', 'Scottsdale'],
    'Massachusetts': ['Boston', 'Worcester', 'Springfield', 'Cambridge'],
    'Tennessee': ['Nashville', 'Memphis', 'Knoxville', 'Chattanooga'],
    'Indiana': ['Indianapolis', 'Fort Wayne', 'Evansville', 'South Bend'],
    'Missouri': ['Kansas City', 'St. Louis', 'Springfield', 'Columbia'],
    'Maryland': ['Baltimore', 'Annapolis', 'Frederick', 'Rockville'],
    'Colorado': ['Denver', 'Colorado Springs', 'Aurora', 'Fort Collins']
}

# Sipariş verisi oluştur
orders_data = []

for state, cities in states_and_cities.items():
    for city in cities:
        # Her şehir için 5-15 sipariş oluştur
        num_orders = random.randint(5, 15)
        
        for i in range(num_orders):
            # Rastgele sipariş tutarı (100-5000 arası)
            total_amount = round(random.uniform(100, 5000), 2)
            
            # Rastgele kargo ücreti (5-50 arası)
            shipping_cost = round(random.uniform(5, 50), 2)
            
            # Rastgele tarih (son 6 ay içinde)
            random_days = random.randint(0, 180)
            order_date = pd.Timestamp.now() - pd.Timedelta(days=random_days)
            
            # Adres formatı
            address = f"{random.randint(100, 9999)} {random.choice(['Main St', 'Oak Ave', 'Pine Rd', 'Elm St'])}, {city}, {state}"
            
            order = {
                'order_id': len(orders_data) + 1,
                'customer_id': random.randint(1, 1000),
                'order_date': order_date.strftime('%Y-%m-%d'),
                'total_amount': total_amount,
                'shipping_cost': shipping_cost,
                'shipping_address': address,
                'status': random.choice(['completed', 'pending', 'shipped']),
                'payment_method': random.choice(['credit_card', 'paypal', 'bank_transfer']),
                'region': state,
                'city': city
            }
            
            orders_data.append(order)

# DataFrame oluştur
df = pd.DataFrame(orders_data)

# CSV olarak kaydet
df.to_csv('../public/geographic_orders.csv', index=False)

print(f"Toplam {len(orders_data)} sipariş oluşturuldu")
print(f"Kullanılan eyaletler: {list(states_and_cities.keys())}")
print(f"Toplam şehir sayısı: {sum(len(cities) for cities in states_and_cities.values())}")

# İstatistikler
print("\nEyalet bazında sipariş sayıları:")
state_counts = df['region'].value_counts()
for state, count in state_counts.items():
    print(f"{state}: {count} sipariş")

print(f"\nDosya 'public/geographic_orders.csv' olarak kaydedildi") 