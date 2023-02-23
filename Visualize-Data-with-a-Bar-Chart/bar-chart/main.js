import "./style.css";
import "./dist/output.css";

import * as d3 from "d3";

// const dataset = d3.json(
//   "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json",
// );

const dataset = [
  [34, 78],
  [109, 280],
  [310, 120],
  [79, 411],
  [420, 220],
  [233, 145],
  [333, 96],
  [222, 333],
  [78, 320],
  [21, 123],
];

const w = 500;
const h = 500;

const padding = 60;

const xScale = d3
  .scaleLinear()
  .domain([0, d3.max(dataset, (d) => d[0])])
  .range([padding, w - padding]);

const yScale = d3
  .scaleLinear()
  .domain([0, d3.max(dataset, (d) => d[1])])
  .range([h - padding, padding]);

const svg = d3
  .select("#chart-container")
  .append("svg")
  .attr("width", w)
  .attr("height", h);

const xAxis = d3.axisBottom(xScale);
const yAxis = d3.axisLeft(yScale);

svg
  .append("g")
  .attr("transform", "translate(0," + (h - padding) + ")")
  .call(xAxis);

svg
  .append("g")
  .attr("transform", "translate(" + padding + ",0)")
  .call(yAxis);
