import requests
import os

API_SOURCE = "WIKI"
API_FORMAT = "csv"
API_URL = f"https://data.nasdaq.com/api/v3/datasets/{API_SOURCE}/{{}}.{API_FORMAT}?api_key=y73DKMPsfs4UYTBYwV7V"

OUT_DIR = "dataset"
OUT_FORMAT = "csv"

api_symbols = [
    "FB", "AMZN", "INTC", "CSCO", "TSLA", "NFLX", "GOOGL", "MSFT",
    "AAPL", "PYPL", "ADBE", "ORCL", "BRK_A", "BRK_B", "KO", "JNJ",
    "WMT", "NVDA", "GM", "BA"
]

params = {
   "start_date": "2007-01-01", 
   "end_date": "2017-12-31",
   "order": "asc",
}

# Ensure OUT_DIR exists, if not, create it
if not os.path.exists(OUT_DIR):
    os.mkdir(OUT_DIR)

try:
    for api_symbol in api_symbols:
        print(f"Fetching data for symbol: {api_symbol}")
        response = requests.get(API_URL.format(api_symbol), params=params)

        if response.status_code == 200:
            # Since the API format is CSV, directly write the content to the file.
            with open(f"{OUT_DIR}/{api_symbol}.{OUT_FORMAT}", "w") as file:
                file.write(response.text)
        else:
            print(f"API request failed with status code {response.status_code}")
            print(response.text)
except Exception as e:
    print(f"An error occurred: {str(e)}")
