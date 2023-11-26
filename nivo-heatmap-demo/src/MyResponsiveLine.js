// install (please try to align the version of installed @nivo packages)
// yarn add @nivo/line
import { ResponsiveLine } from '@nivo/line'

export const MyResponsiveLine = ({ data , date}) => {
    if(data.length === 0) {
        return <p>Loading data...</p>;
    }

    // Extrai o ano da data selecionada
    const selectedYear = new Date(date).getFullYear();

    // Cria uma data que representa o início do ano selecionado
    const startOfYear = new Date(selectedYear, 0, 1);

    // Filtra os dados para incluir somente pontos desde o início do ano até a data selecionada
    const filteredData = data.map(serie => ({
        ...serie,
        data: serie.data.filter(point => {
            const pointDate = new Date(point.x);
            return pointDate >= startOfYear && pointDate <= date;
        })
    }));

    //make it so that the data is the % change from the start of the year (ex: 0% = no change, 100% = doubled in price, -50% = halved in price, also filtered data contains various stocks, so you need to find the first  value of the  every stock. Skip and remove stocks that don't have data for the start of the year)
    const firstPriceMap = new Map();
    filteredData.forEach(serie => {
        const firstPrice = serie.data[0];
        firstPriceMap.set(serie.id, firstPrice);
    });

    filteredData.forEach(serie => {
        const fp = firstPriceMap.get(serie.id);
        //check if the first price is undefined
        if (fp === undefined) {
            filteredData.splice(filteredData.indexOf(serie), 1);
            return;
        }
        const firstPrice = fp.y;
        serie.data = serie.data.map(point => ({
            ...point,
            y: ((point.y - firstPrice) / firstPrice) * 100
        }));
    }
    );


    //console.log("filtered data",filteredData);

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
            format: '%b %d',
            legend: 'Date',
            legendOffset: -4,
            tickValues: 'every 7 days'
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