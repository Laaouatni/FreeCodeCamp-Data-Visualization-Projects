import "./style.css";
import "./dist/output.css";

import * as d3 from "d3";

const dataset = d3
  .json(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json",
  )
  .then((data) => data.data);

dataset.then((data) => {
  const w = 500;
  const h = 500;

  const padding = 60;

  const xScale = d3
    .scaleLinear()
    .domain([
      d3.min(data, (d) => d[0].split("-")[0]),
      d3.max(data, (d) => d[0].split("-")[0]),
    ])
    .range([padding, w - padding]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d[1])])
    .range([h - padding, padding]);

  const svg = d3
    .select("#chart-container")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  svg.selectAll("rect").data(data).enter().append("rect")
    .attr("class", "bar")
    .attr("width", (d, i) => xScale())
    .attr("height", (d, i) => yScale())
    .attr("x", (d, i) => xScale())
    .attr("y", (d, i) => yScale())
    .style("fill", "red")
    
  svg
    .append("g")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .call(xAxis);

  svg
    .append("g")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis);
});
