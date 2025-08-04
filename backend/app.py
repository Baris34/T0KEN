# backend/app.py

import os
import json
import pandas as pd
from datetime import datetime, timedelta
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Gemini API'ı yapılandır
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY bulunamadı! Lütfen .env dosyasını kontrol edin.")
genai.configure(api_key=GEMINI_API_KEY)

app = Flask(__name__)
CORS(app)

# Veri dosyalarının yollarını tanımla
# Script'in backend klasöründe, dosyaların bir üst dizinde olduğunu varsayıyoruz.
ORDERS_FILE = '../birlesik_siparis_urun_verisi_processed.xlsx'
CATEGORIES_FILE = '../temp_csv_processing/filtered_electronic_categories.csv' 
CACHE_FILE = 'cache.json'
GEO_FILE = '../public/geographic_orders.csv'
def load_cache():
    if os.path.exists(CACHE_FILE):
        with open(CACHE_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}

def save_cache(cache_data):
    with open(CACHE_FILE, 'w', encoding='utf-8') as f:
        json.dump(cache_data, f, ensure_ascii=False, indent=4)

@app.route('/analyze', methods=['POST'])
def analyze_data():
    data = request.json
    query_id = data.get('query_id')

    if not query_id:
        return jsonify({"error": "query_id eksik"}), 400

    cache = load_cache()
    if query_id in cache:
        print(f"'{query_id}' için cevap önbellekte bulundu!")
        return jsonify({"result": cache[query_id]})

    print(f"'{query_id}' için cevap önbellekte bulunamadı. Gemini'ye sorulacak.")

    try:
        # Veri dosyalarını oku
        print("Veri dosyaları okunuyor...")
        df_orders = pd.read_excel(ORDERS_FILE)
        df_categories = pd.read_csv(CATEGORIES_FILE)
        df_geo = pd.read_csv(GEO_FILE) # Coğrafi analiz için eklendi

        context_data = ""
        prompt = ""

        if query_id == 'laptop_sales_last_3_months':
            print("Sorgu: 'laptop_sales_last_3_months'")
            df_orders['created_at'] = pd.to_datetime(df_orders['created_at'])
            
            # Adım 1: "Laptop" kategorisinin ID'sini bul
            try:
                laptop_category = df_categories[df_categories['category_name'].str.contains("Laptops", case=False, na=False)]
                if laptop_category.empty:
                    raise ValueError("'Laptops' kategorisi bulunamadı.")
                laptop_category_id = laptop_category['category_id'].iloc[0]
            except Exception as e:
                 return jsonify({"result": f"Kategori dosyasında 'Laptops' kategorisi bulunamadı. Lütfen CSV dosyasını kontrol edin. Hata: {e}"})

            # Adım 2: Siparişleri bu kategori ID'sine ve tarihe göre filtrele
            three_months_ago = datetime.now() - timedelta(days=90)
            laptop_sales = df_orders[
                (df_orders['category_id'] == laptop_category_id) &
                (df_orders['created_at'] >= three_months_ago)
            ]
            
            if laptop_sales.empty:
                result_text = "Veri setinde son 3 ay içinde 'Laptops' kategorisine ait bir satış bulunamadı."
                return jsonify({"result": result_text})

            # Adım 3: Cevabı doğrudan Python'da oluştur (Gemini'ye gerek yok)
            total_quantity = laptop_sales['quantity'].sum()
            total_revenue = laptop_sales['line_total'].sum()
            
            result_text = f"Son 3 ay içinde toplam {total_quantity} adet laptop satılmıştır. Bu satışlardan elde edilen toplam ciro {total_revenue:,.2f} TL'dir."
            
            # Cevabı önbelleğe kaydet ve direkt döndür
            cache[query_id] = result_text
            save_cache(cache)
            print("Cevap doğrudan Python'da oluşturuldu ve önbelleğe eklendi.")
            return jsonify({"result": result_text})
        elif query_id == 'top_revenue_category':
            print("Sorgu: 'top_revenue_category'")
            df_merged = pd.merge(df_orders, df_categories, on='category_id')
            category_revenue = df_merged.groupby('category_name')['line_total'].sum()
            top_category_name = category_revenue.idxmax()
            top_category_revenue = category_revenue.max()
            
            # Bu sorgu için Gemini'ye veri göndermemize bile gerek yok!
            # Cevabı doğrudan biz oluşturabiliriz. Bu en hızlı ve en ucuz yöntem.
            result_text = f"En çok ciro yapan kategori '{top_category_name}' kategorisidir. Bu kategoriden elde edilen toplam ciro {top_category_revenue:,.2f} TL'dir."
            
            # Cevabı önbelleğe kaydet ve direkt döndür
            cache = load_cache()
            cache[query_id] = result_text
            save_cache(cache)
            print("Cevap doğrudan Python'da oluşturuldu ve önbelleğe eklendi.")
            return jsonify({"result": result_text})

        elif query_id == 'top_5_orders':
            print("Sorgu: 'top_5_orders'")
            top_orders = df_orders.sort_values(by='line_total', ascending=False).head(5)
            context_data = top_orders[['product_name', 'brand', 'line_total']].to_csv(index=False)
            
            # YENİ PROMPT
            prompt = """
            Aşağıdaki CSV verisi, en yüksek değerli 5 siparişi gösteriyor. 
            Bu veriye dayanarak, aşağıdaki sorulara MADDE İŞARETLERİYLE ve ÇOK KISA cevap ver:
            - En çok hangi marka öne çıkıyor?
            - Bu siparişlerin ortalama değeri yaklaşık ne kadar?
            
            Cevabın sadece bu iki madde işaretinden oluşsun, başka hiçbir açıklama ekleme.
            """

        elif query_id == 'top_region_analysis':
            print("Sorgu: 'top_region_analysis'")
            top_region = df_geo['region'].mode()[0]
            top_region_orders = df_geo[df_geo['region'] == top_region]
            
            # YENİ PROMPT (Veriyi Gemini'ye göndermeden kendimiz hesaplayabiliriz)
            total_orders_in_region = len(top_region_orders)
            total_revenue_in_region = top_region_orders['total_amount'].sum()
            avg_order_value_in_region = total_revenue_in_region / total_orders_in_region
            
            result_text = (
                f"En çok siparişin geldiği bölge: **{top_region}**.\n"
                f"- Bu bölgeden toplam **{total_orders_in_region}** adet sipariş verilmiştir.\n"
                f"- Bu siparişlerin toplam cirosu **{total_revenue_in_region:,.2f} TL**'dir.\n"
                f"- Ortalama sipariş tutarı yaklaşık **{avg_order_value_in_region:,.2f} TL**'dir."
            )

            # Cevabı önbelleğe kaydet ve direkt döndür
            cache = load_cache()
            cache[query_id] = result_text
            save_cache(cache)
            print("Cevap doğrudan Python'da oluşturuldu ve önbelleğe eklendi.")
            return jsonify({"result": result_text})
            
        else:
            return jsonify({"error": "Geçersiz query_id"}), 400

        # Sadece Gemini'ye ihtiyaç duyan sorgular bu noktaya gelecek
        model = genai.GenerativeModel('gemini-2.0-flash')
        full_prompt = f"{prompt}\n\nİşte analiz edilecek veri:\n```csv\n{context_data}\n```"
        response = model.generate_content(full_prompt)
        result_text = response.text.strip() # Baştaki ve sondaki boşlukları temizle

        cache[query_id] = result_text
        save_cache(cache)
        
        return jsonify({"result": result_text})

    except Exception as e:
        print(f"Bir hata oluştu: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)