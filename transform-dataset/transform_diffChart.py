import os
import json
import random
from datetime import datetime

input_dir = 'json_dataset'
output_filename = 'results-json-ytd.json'

# Generate a random hsl color
def generate_random_color():
    h = random.randint(0, 360)
    s = random.randint(40, 70)  # saturation between 40% and 70%
    l = random.randint(40, 60)  # lightness between 40% and 60%
    return f"hsl({h}, {s}%, {l}%)"

# Store all data in one list
all_stocks_data = []

# Read and process data
for filename in os.listdir(input_dir):
    if filename.endswith(".json"):
        input_filepath = os.path.join(input_dir, filename)
        with open(input_filepath, 'r') as f:
            data = json.load(f)

        stock_data = []
        for record in data:
            date = datetime.strptime(record['Date'], "%Y-%m-%d")
            high = record['High']
            low = record['Low']
            average = (high + low) / 2

            entry = {
                "x": date.strftime("%Y-%m-%d"),  # Converted to a string in the format 'YYYY-MM-DD'
                "y": average
            }

            stock_data.append(entry)

        all_stocks_data.append({
            "id": filename.replace('.json', ''),
            "color": generate_random_color(),
            "data": stock_data
        })

# Create a map for the first prices
first_price_map = {}
for stock in all_stocks_data:
    if stock['data']:
        first_price_map[stock['id']] = stock['data'][0]['y']

# Filter out any series that do not have a first price defined
all_stocks_data = [stock for stock in all_stocks_data if stock['id'] in first_price_map]

# Now perform the mapping on the filtered array
for stock in all_stocks_data:
    first_price = first_price_map[stock['id']]
    for point in stock['data']:
        point['y'] = ((point['y'] - first_price) / first_price) * 100

# Write all data to a single file
output_filepath = os.path.join(output_filename)
with open(output_filepath, 'w') as f:
    json.dump(all_stocks_data, f, indent=2)

print('Data conversion completed!')
