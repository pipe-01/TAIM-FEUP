import os
import numpy as np
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle
from numpy import meshgrid, zeros_like

MONTH_ORDER = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'
]

WEEKDAY_ORDER = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'
]

def get_user_input(prompt, options):
    print(prompt)
    for i, option in enumerate(options, start=1):
        print(f"{i}. {option}")
    while True:
        choice = input("Choose an option: ")
        if choice.isdigit() and 1 <= int(choice) <= len(options):
            return options[int(choice) - 1]
        print("Invalid input. Please choose a valid option.")

def aggregate_file(file_path, aggregation_type, normalize_type):
    data = pd.read_csv(file_path)
    data['Date'] = pd.to_datetime(data['Date'])
    data['Weekday'] = data['Date'].dt.day_name()

    if normalize_type == "min-max":
        data['Volume'] = (data['Volume'] - data['Volume'].min()) / (data['Volume'].max() - data['Volume'].min())
    elif normalize_type == "z-score":
        data['Volume'] = (data['Volume'] - data['Volume'].mean()) / data['Volume'].std()
    elif normalize_type == "log":
        data['Volume'] = np.log(data['Volume'])
    elif normalize_type == "log and min-max":
        data['Volume'] = (np.log(data['Volume']) - np.log(data['Volume'].min())) / (np.log(data['Volume'].max()) - np.log(data['Volume'].min()))
    elif normalize_type == "log and z-score":
        data['Volume'] = (np.log(data['Volume']) - np.log(data['Volume'].mean())) / np.log(data['Volume'].std())
    elif normalize_type == "no normalization":
        pass  # No normalization needed

    if aggregation_type == "weekday":
        avg_var = data.groupby(['Weekday'])['Volume'].mean().reset_index()
        column_labels = WEEKDAY_ORDER
    else:  # Default to "month and weekday"
        data['Month'] = data['Date'].dt.month_name()
        data['MonthWeekday'] = data['Month'] + ' ' + data['Weekday']
        avg_var = data.groupby(['MonthWeekday'])['Volume'].mean().reset_index()
        column_labels = [f"{month} {weekday}" for month in MONTH_ORDER for weekday in WEEKDAY_ORDER]

    avg_var['Stock'] = os.path.splitext(os.path.basename(file_path))[0]
    return avg_var, column_labels

def load_and_aggregate_data(dir_path, aggregation_type, normalize_type):
    csv_files = [os.path.join(dir_path, f) for f in os.listdir(dir_path) if f.endswith('.csv')]
    agg_data_list = []
    column_labels = None

    for file in csv_files:
        agg_data, columns = aggregate_file(file, aggregation_type, normalize_type)
        agg_data_list.append(agg_data)

        if column_labels is None:
            column_labels = columns

    agg_data = pd.concat(agg_data_list, ignore_index=True)
    return agg_data, column_labels

def prepare_pivot_data(agg_data, aggregation_type):
    if aggregation_type == "weekday":
        pivot_data = agg_data.pivot_table(values="Volume", index="Stock", columns="Weekday").reset_index()
    else:  # Default to "month and weekday"
        pivot_data = agg_data.pivot_table(values="Volume", index="Stock", columns="MonthWeekday").reset_index()
    return pivot_data

def heatmap_visualization(ax, pivot_data, column_labels, aggregation_type, cmap="coolwarm"):
    sns.heatmap(pivot_data.set_index('Stock'), cmap=cmap, linewidths=0.5, ax=ax)
    title = 'Average Volume by Stock and Weekday' if aggregation_type == "weekday" else 'Average Volume by Stock, Month, and Weekday'
    plt.title(title)
    ax.set_xticks(np.arange(len(column_labels)) + 0.5)
    ax.set_xticklabels(column_labels, rotation=90)
    plt.yticks(rotation=0, horizontalalignment='right')

def visualize_3d(agg_data, column_labels, chart_type):
    fig = plt.figure(figsize=(20, 8))
    ax = fig.add_subplot(111, projection='3d')
    
    pivot_data = prepare_pivot_data(agg_data, "weekday")
    xlabels = WEEKDAY_ORDER
    ylabels = pivot_data['Stock']
    xpos = np.arange(pivot_data.shape[1]-1)
    ypos = np.arange(pivot_data.shape[0])
    xpos, ypos = np.meshgrid(xpos, ypos, indexing="ij")

    xpos = xpos.flatten()
    ypos = ypos.flatten()
    zpos = zeros_like(xpos)
    dz = pivot_data.drop(columns='Stock').values.flatten().astype(float)

    if chart_type == "bar":
        ax.bar3d(xpos, ypos, zpos, 0.75, 0.75, dz, shade=True)
        plt.title('3D Bar Chart of Volume by Stock and Weekday')
    elif chart_type == "line":
        for index, row in pivot_data.iterrows():
            ax.plot(np.arange(pivot_data.shape[1] - 1), [index] * (pivot_data.shape[1] - 1), row[1:].values.astype(float))
        plt.title('3D Line Graph of Volume by Stock and Weekday')

    ax.set_xticks(np.arange(len(xlabels)))
    ax.set_yticks(np.arange(len(ylabels)))
    ax.set_xticklabels(xlabels, rotation=45)
    ax.set_yticklabels(ylabels)
    ax.set_xlabel('Weekday')
    ax.set_ylabel('Stock')
    ax.set_zlabel('Volume')
    plt.show()

def main():
    heatmap_type_options = ["3D visualization", "Heatmap"]
    heatmap_type = get_user_input("Select heatmap type:", heatmap_type_options)

    aggregation_type_options = ["weekday", "month and weekday"]
    aggregation_type = get_user_input("Select aggregation type:", aggregation_type_options)

    normalize_type_options = ["no normalization", "min-max", "z-score", "log", "log and min-max", "log and z-score"]
    normalize_type = get_user_input("Select normalization type:", normalize_type_options)

    agg_data, column_labels = load_and_aggregate_data('../project/dataset', aggregation_type, normalize_type)

    if heatmap_type == "3D visualization":
        chart_type_options = ["bar", "line"]
        chart_type = get_user_input("Select chart type for 3D visualization:", chart_type_options)
        visualize_3d(agg_data, column_labels, chart_type)  # 3D visualization
    else:
        fig, ax = plt.subplots(figsize=(20, 8))
        pivot_data = prepare_pivot_data(agg_data, aggregation_type)
        heatmap_visualization(ax, pivot_data, column_labels, aggregation_type)
        plt.show()

if __name__ == "__main__":
    main()
