import os
import pandas as pd

def process_csv(file_path):
    # Load CSV data
    data = pd.read_csv(file_path)

    # Ensure that the 'Date' column is in datetime format
    data['Date'] = pd.to_datetime(data['Date'])

    # Add a new column 'Weekday'
    data['Weekday'] = data['Date'].apply(lambda x: x.weekday())

    # Ensure that 'High' and 'Low' columns are float type
    data['High'] = data['High'].astype(float)
    data['Low'] = data['Low'].astype(float)
    
    # Add a new column 'VarPercentage' and avoid division by zero
    data['VarPercentage'] = (data['High'] / (data['Low'] + 1e-10)) * 100 - 100

    # Save the dataframe back to CSV
    data.to_csv(file_path, index=False)

def main():
    dir_path = 'dataset'
    csv_files = [f for f in os.listdir(dir_path) if f.endswith('.csv')]
    
    for file_name in csv_files:
        file_path = os.path.join(dir_path, file_name)
        process_csv(file_path)

if __name__ == "__main__":
    main()
