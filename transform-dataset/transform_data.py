import os
import pandas as pd
import json

# Define the input and output directories
input_directory = 'dataset'
output_directory = 'json_dataset'

# Create the output directory if it doesn't exist
os.makedirs(output_directory, exist_ok=True)

# Iterate through CSV files in the input directory
for csv_file in os.listdir(input_directory):
    if csv_file.endswith('.csv'):
        # Read the CSV file
        data = pd.read_csv(os.path.join(input_directory, csv_file))

        # Extract the stock name from the file name
        stock_name = os.path.splitext(csv_file)[0]

        # Keep only the required columns
        data = data[['Date', 'Weekday', 'Volume', 'High', 'Low']]
        
        #make new column for Year (Date is in format YYYY-MM-DD)
        data['Year'] = data['Date'].str[:4]

        # Add a "Stock" column
        data['Stock'] = stock_name

        # Convert the DataFrame to a JSON string
        json_data = data.to_json(orient='records')

        # Save the JSON data to a new file in the output directory
        output_filename = os.path.join(output_directory, f'{stock_name}.json')
        with open(output_filename, 'w') as json_file:
            json_file.write(json_data)

print("CSV to JSON conversion completed.")
