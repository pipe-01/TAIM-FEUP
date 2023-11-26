import pandas as pd
import os
import json

# Folder containing the CSV files
folder_path = 'dataset'

# Function to convert weekday number to weekday name
# Function to convert weekday number to weekday name
def convert_weekday(num):
    weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    return weekdays[num]

# Function to convert month number to month name
def convert_month(num):
    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    return months[num - 1]

# Initialize a list to store the results
result = []
result_month = []

# Explicitly define the order of weekdays and months
weekday_order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
month_order = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

# Iterate through each file in the folder
for filename in os.listdir(folder_path):
    if filename.endswith(".csv"):
        # Read the CSV file
        df = pd.read_csv(os.path.join(folder_path, filename))
        
        # Convert the 'Weekday' column to weekday names
        df['Weekday'] = df['Weekday'].apply(convert_weekday)

        # Extract month from 'Date' and convert to month name
        df['Month'] = pd.to_datetime(df['Date']).dt.month.apply(convert_month)
        
        # Calculate the average volume for each weekday
        avg_volume_weekday = df.groupby('Weekday')['Volume'].mean().reindex(weekday_order).reset_index()

        # Calculate the average volume for each weekday in each month
        avg_volume_month = df.groupby(['Month', 'Weekday'])['Volume'].mean().reset_index()
        avg_volume_month = avg_volume_month.pivot(index='Month', columns='Weekday', values='Volume').reindex(month_order).reindex(columns=weekday_order).stack().reset_index()
        avg_volume_month.columns = ['Month', 'Weekday', 'Volume']
        
        # Transform the data to the desired format
        data_weekday = [{"x": row['Weekday'], "y": row['Volume']} for index, row in avg_volume_weekday.iterrows()]
        data_month = [{"x": f"{row['Month']}-{row['Weekday']}", "y": row['Volume']} for index, row in avg_volume_month.iterrows()]
        
        # Append the result to the list
        result.append({"id": filename.replace('.csv', ''), "data": data_weekday})
        result_month.append({"id": filename.replace('.csv', ''), "data": data_month})

# Convert the result to JSON
result_json = json.dumps(result, indent=2)
result_month_json = json.dumps(result_month, indent=2)

# Save the result to a file
with open('result.json', 'w') as f:
    f.write(result_json)

with open('result-month.json', 'w') as f:
    f.write(result_month_json)
