import os
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.dates as mdates

def load_stock_data(stock_name):
    try:
        return pd.read_csv(f'dataset/{stock_name}.csv', parse_dates=['Date'])
    except FileNotFoundError:
        print("Stock data not found.")
        return None

def get_available_stocks():
    stock_files = [f for f in os.listdir('dataset') if f.endswith('.csv')]
    return [os.path.splitext(f)[0] for f in stock_files]

def get_available_years(df):
    return sorted(df['Date'].dt.year.unique())

def select_option(options, prompt="Select an option: "):
    for i, option in enumerate(options, start=1):
        print(f"{i}. {option}")
    selection = int(input(prompt)) - 1
    return options[selection]

def get_date_range(year):
    start_date = f"{year}-01-01"
    end_date_input = input(f"Enter end date for {year} (YYYY-MM-DD) or press Enter for the entire year: ")
    end_date = end_date_input if end_date_input else f"{year}-12-31"
    return pd.to_datetime(start_date), pd.to_datetime(end_date)

def plot_stock_data(df, title):
    fig, ax = plt.subplots(figsize=(10, 5))
    ax.plot(df['High'], label='High', color='green')
    ax.plot(df['Low'], label='Low', color='red')
    ax.fill_between(df.index, df['High'], df['Low'], color='grey', alpha=0.5)
    
    ax.set_title(title)
    ax.set_ylabel('Price')
    ax.set_xlabel('Date')
    ax.legend()
    ax.grid(True)
    ax.xaxis.set_major_locator(mdates.MonthLocator())
    ax.xaxis.set_major_formatter(mdates.DateFormatter('%b %d'))
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.show()

if __name__ == "__main__":
    stock_names = get_available_stocks()
    if not stock_names:
        print("No stock data available.")
    else:
        print("Available stocks:")
        selected_stock = select_option(stock_names, "Select a stock: ")
        
        df = load_stock_data(selected_stock)
        if df is not None:
            print("\nAvailable years:")
            available_years = get_available_years(df)
            selected_year = select_option(available_years, "Select a year: ")
            
            start_date, end_date = get_date_range(selected_year)
            df = df[(df['Date'] >= start_date) & (df['Date'] <= end_date)]
            
            if df.empty:
                print(f"No data available for {selected_stock} in the selected date range.")
            else:
                title = f'{selected_stock} High and Low Prices from {start_date.date()} to {end_date.date()}'
                plot_stock_data(df, title)
