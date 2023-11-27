// install (please try to align the version of installed @nivo packages)
// yarn add @nivo/line
import { ResponsiveLine } from '@nivo/line'

export const MyResponsiveLine = ({ data , date , agg, combinedYTD}) => {
    if(data.length === 0) {
        return <p>Loading data...</p>;
    }

    if(!combinedYTD){
        // Extrai o ano da data selecionada
        const selectedYear = new Date(date).getFullYear();

        // Cria uma data que representa o início do ano selecionado
        const startOfYear = new Date(selectedYear, 0, 1);

        // Filtra os dados para incluir somente pontos desde o início do ano até a data selecionada
        var filteredData = data.map(serie => ({
            ...serie,
            data: serie.data.filter(point => {
                const pointDate = new Date(point.x);
                return pointDate >= startOfYear && pointDate <= date;
            })
        }));

        const firstPriceMap = new Map();
        filteredData.forEach(serie => {
            const firstPrice = serie.data[0];
            firstPriceMap.set(serie.id, firstPrice);
        });

        // Filter out any series that do not have a first price defined
        filteredData = filteredData.filter(serie => {
            const fp = firstPriceMap.get(serie.id);

            return fp !== undefined; // Only include series where first price is defined
        });
        
        // Now perform the mapping on the filtered array
        filteredData.forEach(serie => {
            const fp = firstPriceMap.get(serie.id);
            const firstPrice = fp.y;
            serie.data = serie.data.map(point => ({
            ...point,
            y: ((point.y - firstPrice) / firstPrice) * 100
            }));
        });
    }
    else{
        var filteredData = data;
    }
    //make it so that the data is the % change from the start of the year (ex: 0% = no change, 100% = doubled in price, -50% = halved in price, also filtered data contains various stocks, so you need to find the first  value of the  every stock. Skip and remove stocks that don't have data for the start of the year

    if(agg){
        // Aggregation: join all series into one by averaging the values for that date
        const dateMap = new Map();
        filteredData.forEach(serie => {
            serie.data.forEach(point => {
                const date = point.x;
                if (!dateMap.has(date)) {
                    dateMap.set(date, []);
                }
                dateMap.get(date).push(point.y);
            });
        });

        const aggregatedData = [];
        dateMap.forEach((values, date) => {
            const avg = values.reduce((a, b) => a + b, 0) / values.length;
            aggregatedData.push({ x: date, y: avg });
        });

        filteredData = [
            {
                id: 'Aggregated',
                data: aggregatedData
            }
        ];
    }

    console.log("LATSTS:", filteredData);

    return <ResponsiveLine
        data={filteredData}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: false,
            reverse: false
        }}
        yFormat=" >-.2f"
        axisTop={null}
        axisRight={null}
        axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 90,
            format: combinedYTD? "%b %y" : '%b %d',
            legend: 'Date',
            legendOffset: -4,
            tickValues: combinedYTD ? 'every 1 month' : 'every 7 days',
        }}          
        axisLeft={{
            // tickSize: 5,
            // tickPadding: 5,
            // tickRotation: 0,
            legend: '% Change',
            legendOffset: -40,
            legendPosition: 'middle'
        }}
        xFormat="time:%Y-%m-%d"
        xScale={{
            format: '%Y-%m-%d',
            precision: 'day',
            type: 'time',
            useUTC: false
        }}
        pointSize={1}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabelYOffset={-12}
        useMesh={true}
        legends={[
            {
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemBackground: 'rgba(0, 0, 0, .03)',
                            itemOpacity: 1
                        }
                    }
                ]
            }
        ]}
    />
}