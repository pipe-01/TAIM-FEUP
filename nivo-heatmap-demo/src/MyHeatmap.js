// install (please try to align the version of installed @nivo packages)
// yarn add @nivo/heatmap
import { ResponsiveHeatMap } from '@nivo/heatmap'

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
export const MyHeatMap = ({ data }) => {
    let minValue, maxValue;
    if (data.length === 0) {
        return <p>Loading data...</p>;
    }

    if(data.length === 1){
        minValue = Math.min(...data[0].data.map(item => item.y));
        maxValue = Math.max(...data[0].data.map(item => item.y));
    }
    else{
        minValue = Math.min(...data.map(stock => Math.min(...stock.data.map(item => item.y))));
        maxValue = Math.max(...data.map(stock => Math.max(...stock.data.map(item => item.y))));
    }

    return <ResponsiveHeatMap
        data={data}
        margin={{ top: 60, right: 90, bottom: 60, left: 90 }}
        valueFormat=">-.2s"
        axisTop={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -90,
            legend: 'Volume',
            legendOffset: 46
        }}
        axisRight={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Stock',
            legendPosition: 'middle',
            legendOffset: 70
        }}
        axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Stock',
            legendPosition: 'middle',
            legendOffset: -72
        }}
        colors={{
            type: 'diverging',
            scheme: 'purple_blue_green',
            divergeAt: 0.5,
            minValue: minValue,
            maxValue: maxValue
        }}
        emptyColor="#555555"
        enableLabels={false}
        legends={[
            {
                anchor: 'bottom',
                translateX: 0,
                translateY: 30,
                length: 400,
                thickness: 8,
                direction: 'row',
                tickPosition: 'after',
                tickSize: 3,
                tickSpacing: 4,
                tickOverlap: false,
                tickFormat: '>-.2s',
                title: 'Volume →',
                titleAlign: 'start',
                titleOffset: 4
            }
        ]}
    />
}