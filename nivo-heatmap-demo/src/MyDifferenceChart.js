import React, { Component } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';

class MyDifferenceChart extends Component {
  static propTypes = {
    data: PropTypes.arrayOf(
      PropTypes.shape({
        date: PropTypes.instanceOf(Date).isRequired,
        valueA: PropTypes.number.isRequired,
        valueB: PropTypes.number.isRequired
      })
    ).isRequired
  };

  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }

  componentDidMount() {
    this.drawChart();
  }

  componentDidUpdate() {
    this.drawChart();
  }

  drawChart() {
    const { data } = this.props;

    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const container = d3.select(this.myRef.current);

    // Clear any previous SVG content
    container.select("svg").remove();

    const svg = container.append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    const lineA = d3.line()
      .x(d => x(d.date))
      .y(d => y(d.valueA));

    const lineB = d3.line()
      .x(d => x(d.date))
      .y(d => y(d.valueB));

    x.domain(d3.extent(data, d => d.date));
    y.domain([0, d3.max(data, d => Math.max(d.valueA, d.valueB))]);

    svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", lineA)
      .attr("stroke", "blue")
      .attr("fill", "none");

    svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", lineB)
      .attr("stroke", "red")
      .attr("fill", "none");

    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    svg.append("g")
      .call(d3.axisLeft(y));
  }

  render() {
    return (
      <div>
        <h3>Difference Chart</h3>
        <div ref={this.myRef}></div>
      </div>
    );
  }
}

export default MyDifferenceChart;
