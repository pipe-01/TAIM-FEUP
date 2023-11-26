import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { MyHeatMap } from './MyHeatmap';
import './App.css';
import {MyResponsiveLine} from "./MyResponsiveLine";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


const stockNames = ['AAPL', 'ADBE', 'AMZN', 'BA', 'BRK_A', `BRK_B`, `CSCO`, `FB`, `GM`, `GOOGL`, `INTC`, `JNJ`, 'KO', `MSFT`, `NFLX`, `NVDA`, `ORCL`, `PYPL`, `TSLA`, `WMT`];

const normalizeOptions = [
  { value: "min-max", label: "Min-Max" },
  { value: "z-score", label: "Z-Score" },
  { value: "log", label: "Log" },
  { value: "no normalization", label: "No Normalization" },
  { value: "max abs scaler", label: "Max Abs Scaler" },
  { value: "robust scaler", label: "Robust Scaler" },
];

const timeFrameOptions = [
  { value: "weekday", label: "Weekday" },
  { value: "month-weekday", label: "Month-Weekday" },
  { value: "YTD", label: "YTD" },
];

const stockOptions = stockNames.map(stock => ({ value: stock, label: stock }));

const yearOptions = [];
for (let year = 2007; year <= 2017; year++) {
  yearOptions.push({ value: year, label: year.toString() });
}
yearOptions.push({value: 10, label: "2007-2017"})

function App() {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [selectedNormalization, setSelectedNormalization] = useState(normalizeOptions[3]); // "No Normalization" as default
  const [selectedStocks, setSelectedStocks] = useState(stockOptions); // All stocks selected by default
  const [aggregateStocks, setAggregateStocks] = useState(false);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState(timeFrameOptions[0]); // "Weekday" as default
  const [startDate, setStartDate] = useState(new Date('2010-10-10'));
  const minDate = new Date('2007-01-01');
  const [selectedYear, setSelectedYear] = useState({ value: 2007, label: '2007' });



  const aggregateByDayOfWeek = (data) => {
    // Inicializar um objeto para armazenar as somas e contagens para cada dia da semana
    const sums = {
      'Monday': { sum: 0, count: 0 },
      'Tuesday': { sum: 0, count: 0 },
      'Wednesday': { sum: 0, count: 0 },
      'Thursday': { sum: 0, count: 0 },
      'Friday': { sum: 0, count: 0 },
    };

    // Iterar sobre cada conjunto de dados de ações
    data.forEach(stock => {
      stock.data.forEach(dayData => {
        // Somar os valores de 'y' para cada dia da semana
        sums[dayData.x].sum += dayData.y;
        sums[dayData.x].count += 1;
      });
    });

    // Calcular a média para cada dia da semana
    const averages = Object.keys(sums).map(day => {
      const average = sums[day].sum / sums[day].count;
      return {
        x: day,
        y: average
      };
    });

    // Retorna um novo array com os dados agregados
    return [{ id: 'allStocks', data: averages }];
  };


  function aggregateByDayOfWeekMonth(data) {
    const sums = {
      'January-Monday': { sum: 0, count: 0 },
      'January-Tuesday': { sum: 0, count: 0 },
      'January-Wednesday': { sum: 0, count: 0 },
      'January-Thursday': { sum: 0, count: 0 },
      'January-Friday': { sum: 0, count: 0 },
      'February-Monday': { sum: 0, count: 0 },
      'February-Tuesday': { sum: 0, count: 0 },
      'February-Wednesday': { sum: 0, count: 0 },
      'February-Thursday': { sum: 0, count: 0 },
      'February-Friday': { sum: 0, count: 0 },
      'March-Monday': { sum: 0, count: 0 },
      'March-Tuesday': { sum: 0, count: 0 },
      'March-Wednesday': { sum: 0, count: 0 },
      'March-Thursday': { sum: 0, count: 0 },
      'March-Friday': { sum: 0, count: 0 },
      'April-Monday': { sum: 0, count: 0 },
      'April-Tuesday': { sum: 0, count: 0 },
      'April-Wednesday': { sum: 0, count: 0 },
      'April-Thursday': { sum: 0, count: 0 },
      'April-Friday': { sum: 0, count: 0 },
      'May-Monday': { sum: 0, count: 0 },
      'May-Tuesday': { sum: 0, count: 0 },
      'May-Wednesday': { sum: 0, count: 0 },
      'May-Thursday': { sum: 0, count: 0 },
      'May-Friday': { sum: 0, count: 0 },
      'June-Monday': { sum: 0, count: 0 },
      'June-Tuesday': { sum: 0, count: 0 },
      'June-Wednesday': { sum: 0, count: 0 },
      'June-Thursday': { sum: 0, count: 0 },
      'June-Friday': { sum: 0, count: 0 },
      'July-Monday': { sum: 0, count: 0 },
      'July-Tuesday': { sum: 0, count: 0 },
      'July-Wednesday': { sum: 0, count: 0 },
      'July-Thursday': { sum: 0, count: 0 },
      'July-Friday': { sum: 0, count: 0 },
      'August-Monday': { sum: 0, count: 0 },
      'August-Tuesday': { sum: 0, count: 0 },
      'August-Wednesday': { sum: 0, count: 0 },
      'August-Thursday': { sum: 0, count: 0 },
      'August-Friday': { sum: 0, count: 0 },
      'September-Monday': { sum: 0, count: 0 },
      'September-Tuesday': { sum: 0, count: 0 },
      'September-Wednesday': { sum: 0, count: 0 },
      'September-Thursday': { sum: 0, count: 0 },
      'September-Friday': { sum: 0, count: 0 },
      'October-Monday': { sum: 0, count: 0 },
      'October-Tuesday': { sum: 0, count: 0 },
      'October-Wednesday': { sum: 0, count: 0 },
      'October-Thursday': { sum: 0, count: 0 },
      'October-Friday': { sum: 0, count: 0 },
      'November-Monday': { sum: 0, count: 0 },
      'November-Tuesday': { sum: 0, count: 0 },
      'November-Wednesday': { sum: 0, count: 0 },
      'November-Thursday': { sum: 0, count: 0 },
      'November-Friday': { sum: 0, count: 0 },
      'December-Monday': { sum: 0, count: 0 },
      'December-Tuesday': { sum: 0, count: 0 },
      'December-Wednesday': { sum: 0, count: 0 },
      'December-Thursday': { sum: 0, count: 0 },
      'December-Friday': { sum: 0, count: 0 },
    };

    // Iterar sobre cada conjunto de dados de ações
    data.forEach(stock => {
      stock.data.forEach(dayData => {
        // Somar os valores de 'y' para cada dia da semana
        sums[dayData.x].sum += dayData.y;
        sums[dayData.x].count += 1;
      });
    });

    // Calcular a média para cada dia da semana
    const averages = Object.keys(sums).map(day => {
      const average = sums[day].sum / sums[day].count;
      return {
        x: day,
        y: average
      };
    });

    // Retorna um novo array com os dados agregados
    return [{ id: 'allStocks', data: averages }];
  }

  useEffect(() => {
    // Define a function to fetch data based on the selected time frame
    const fetchDataByTimeFrame = async () => {
      try {
        let fetchedData;
        if (selectedTimeFrame.value === 'weekday') {
          if(selectedYear.value === 10){
            fetchedData = require(`./results.json`);
          }
          else{
            fetchedData = require(`./dataset/result_${selectedYear.value}.json`);
          }
          if(aggregateStocks) {
            fetchedData = aggregateByDayOfWeek(fetchedData);
          }
        } else if (selectedTimeFrame.value === 'month-weekday') {
          if(selectedYear.value === 10){
            fetchedData = require(`./results-month.json`);
          }
          else{
            fetchedData = require(`./dataset/result-month_${selectedYear.value}.json`);
          }
          if(aggregateStocks) {
            fetchedData = aggregateByDayOfWeekMonth(fetchedData);
          }
        } else if (selectedTimeFrame.value === 'YTD') {
          fetchedData = require('./results-ytd.json'); // Replace with the actual YTD data source.
          // Apply selectedStocks filter for YTD
          if (!aggregateStocks && selectedStocks.length) {
            const selectedStockNames = selectedStocks.map(stock => stock.value);
            fetchedData = fetchedData.filter(stock => selectedStockNames.includes(stock.id));
          }
        }
        setOriginalData(JSON.parse(JSON.stringify(fetchedData))); // Store a deep copy of the original data
        setData(fetchedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchDataByTimeFrame(); // Fetch data when the selected time frame changes.
  }, [selectedTimeFrame, aggregateStocks, selectedStocks, selectedYear]); // Add selectedStocks to the dependency array



  useEffect(() => {
      if (!originalData.length) return; // Ensure there is data to normalize
      
      let filteredData = JSON.parse(JSON.stringify(originalData)); // Create a deep copy of the original data
    
      // Apply filtering only when not aggregating
      if (!aggregateStocks && selectedStocks.length) {
        const selectedStockNames = selectedStocks.map(stock => stock.value);
        filteredData = filteredData.filter(stock => selectedStockNames.includes(stock.id));
      }
    
      
      //const maxVolume = Math.max(...filteredData.map(stock => Math.max(...stock.data.map(item => item.y))));
      //const minVolume = Math.min(...filteredData.map(stock => Math.min(...stock.data.map(item => item.y))));
      
      const normalizationType = selectedNormalization.value;
        
      if (normalizationType === "min-max") {
        const rangeDivision = 1 / filteredData.length; // Divide the [0,1] interval by the number of companies.
        let cumulativeOffset = 0; // Initialize an offset to sum the normalized values.
      
        filteredData.forEach((stock, index) => {
          // Calculate min and max for each stock.
          const stockMax = Math.max(...stock.data.map(item => item.y));
          const stockMin = Math.min(...stock.data.map(item => item.y));
          // Normalize each stock's data to the [0, rangeDivision] interval.
          stock.data = stock.data.map(item => ({
            x: item.x,
            y: ((item.y - stockMin) / (stockMax - stockMin)) * rangeDivision
          }));
          // Offset each stock's normalized data to ensure the full range [0,1] is used cumulatively.
          stock.data = stock.data.map(item => ({
            x: item.x,
            y: item.y + cumulativeOffset
          }));
          cumulativeOffset += rangeDivision; // Increase the offset for the next company.
        });
      } else if (normalizationType === "z-score") {
        filteredData.forEach(stock => {
          const mean = stock.data.reduce((acc, item) => acc + item.y, 0) / stock.data.length;
          const stdDev = Math.sqrt(stock.data.reduce((acc, item) => acc + Math.pow(item.y - mean, 2), 0) / stock.data.length);
          stock.data = stock.data.map(item => ({
            x: item.x,
            y: (item.y - mean) / stdDev
          }));
        });
      } else if (normalizationType === "log") {
        filteredData.forEach(stock => {
          stock.data = stock.data.map(item => ({
            x: item.x,
            y: Math.log(item.y)
          }));
        });
      } else if (normalizationType === "max abs scaler") {
        filteredData.forEach(stock => {
          const maxAbsValue = Math.max(...stock.data.map(item => Math.abs(item.y)));
          if (maxAbsValue === 0) {
            console.error('Maximum absolute value is zero, resulting in a divide by zero error for stock:', stock);
            return;
          }
          stock.data = stock.data.map(item => ({
            x: item.x,
            y: item.y / maxAbsValue
          }));
        });
      } else if (normalizationType === "robust scaler") {
        filteredData.forEach(stock => {
          const values = stock.data.map(item => item.y).sort((a, b) => a - b);
          const median = values.length % 2 === 0 ? (values[values.length / 2 - 1] + values[values.length / 2]) / 2 : values[Math.floor(values.length / 2)];
          const q1 = values[Math.floor(values.length / 4)];
          const q3 = values[Math.floor(3 * values.length / 4)];
          const iqr = q3 - q1;
          if (iqr === 0) {
            console.error('Interquartile range is zero, potentially leading to divide by zero errors for stock:', stock);
            return;
          }
          stock.data = stock.data.map(item => ({
            x: item.x,
            y: (item.y - median) / iqr
          }));
        });
      }
  
      setData(filteredData);
    }, [selectedNormalization, originalData, selectedStocks], aggregateStocks);

    const handleNormalizationChange = selectedOption => {
      setSelectedNormalization(selectedOption);
    }

    const handleStockChange = selectedOptions => {
      setSelectedStocks(selectedOptions);
    }

  const handleTimeFrameChange = selectedOption => {
    setSelectedTimeFrame(selectedOption);
  }

  const handleAggregateCheckbox = event => {
    setAggregateStocks(event.target.checked);
  }

  const handleYearChange = selectedOption => {
    setSelectedYear(selectedOption);
  };



    return (
      <div className="App">
        <h1 style={{textAlign: 'center', fontSize: '2.5em'}}>HeatMap</h1>
        <div id="heatmapdiv" style={{ height: "100vh" }}>
          <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
            <div className="dropdownHeader">
              <label htmlFor="normalizeDropdown" style={{ marginRight: '10px' }}>Normalize Type:</label>
              <Select
                id="normalizeDropdown"
                value={selectedNormalization}
                onChange={handleNormalizationChange}
                options={normalizeOptions}
                isSearchable={false}
                style={{ width: '200px', marginRight: '20px' }}
              />
            </div>
            <div className="dropdownHeader">
              <label htmlFor="stocksDropdown" style={{ marginRight: '10px' }}>Select Stocks:</label>
              <Select
                id="stocksDropdown"
                value={selectedStocks}
                onChange={handleStockChange}
                options={stockOptions}
                isMulti
                closeMenuOnSelect={false}
                style={{ width: '300px' }}
              />
            </div>
            <label htmlFor="timeFrameDropdown" style={{ marginRight: '10px' }}>Time Frame:</label>
            <Select
                id="timeFrameDropdown"
                value={selectedTimeFrame}
                onChange={handleTimeFrameChange}
                options={timeFrameOptions}
                isSearchable={false}
                style={{ width: '300px' }}
            />

            <label htmlFor="aggregateCheckbox">Aggregate Stocks:</label>
            <input
                id="aggregateCheckbox"
                type="checkbox"
                checked={aggregateStocks}
                onChange={handleAggregateCheckbox}
                style={{ marginLeft: '10px' }}
            />

          </div>
          {selectedTimeFrame.value === 'YTD' ? (
              <>
                <DatePicker
                    selected={startDate}
                    onChange={date => setStartDate(date)}
                    minDate={minDate}
                    maxDate={new Date()}
                />
              <MyResponsiveLine data={data} date={startDate}/>
              </>
          ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center'}}>
                  <div className="dropdownHeader" style={{ marginRight: '10px' }}>
                    <label htmlFor="yearDropdown">Select Year:</label>
                  </div>
                  <Select
                      id="yearDropdown"
                      value={selectedYear}
                      onChange={handleYearChange}
                      options={yearOptions}
                      isSearchable={false}
                      style={{ width: '100px' }}
                  />
                </div>
              <MyHeatMap data={data} />
              </>
          )}
        </div>
      </div>
    );
}

export default App;
