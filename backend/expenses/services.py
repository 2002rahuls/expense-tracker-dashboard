import requests

def get_usd_to_inr_rate():
    url = "https://api.exchangerate-api.com/v4/latest/USD"
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        return data["rates"]["INR"]
    
    return None