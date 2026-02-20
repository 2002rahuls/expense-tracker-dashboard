import requests
import os

def get_usd_to_inr_rate():
    url = "https://api.exchangerate-api.com/v4/latest/USD"
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        return data["rates"]["INR"]
    
    return None


def get_top_headlines():
    api_key = os.getenv("NEWS_API_KEY")

    url = "https://newsdata.io/api/1/latest"

    params = {
        "apikey": api_key,
        "q": "technology,finance",
        "country": "in",
        "language": "en,hi",
        "category": "technology",
    }

    response = requests.get(url, params=params)

    if response.status_code == 200:
        data = response.json()
        return data.get("results", [])[:5]  # Limit to 5 headlines
    
    return []