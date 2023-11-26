import json
from collections import defaultdict

# Load your JSON data
with open('transform-dataset/results-month.json', 'r') as file:
    data = json.load(file)

# Create a dictionary to store the cumulative y values for each month
monthly_totals = defaultdict(float)
monthly_counts = defaultdict(int)

# Process the data to calculate the sum of y values for each month
for entry in data:
    id = entry["id"]
    if id not in monthly_totals:
        monthly_totals[id] = defaultdict(float)
        monthly_counts[id] = defaultdict(int)
    for data_point in entry["data"]:
        x_parts = data_point["x"].split('-')
        if len(x_parts) == 2:  # Check if the x value has a month
            month = x_parts[0]
            y_value = data_point["y"]
            monthly_totals[id][month] += y_value
            monthly_counts[id][month] += 1

# Calculate the average for each month and restructure the data
average_data = []
for id, month_totals in monthly_totals.items():
    data_for_id = [{"x": month, "y": month_totals[month] / monthly_counts[id][month]} for month in month_totals]
    average_data.append({"id": id, "data": data_for_id})

# Write the result to a new JSON file
with open('result.json', 'w') as outfile:
    json.dump(average_data, outfile, indent=2)