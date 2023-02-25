import "./style.css";
import "./dist/output.css";

import * as d3 from "d3";

const dataset = d3
  .json(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json",
  )
  .then((data) => data.data);

dataset.then((data) => {
  const w = window.innerWidth * 0.85;
  const h = window.innerHeight * 0.6;

  const padding = 60;

  const xScale = d3
    .scaleLinear()
    .domain([
      d3.min(data, (d) => getYear(d[0])),
      d3.max(data, (d) => getYear(d[0])),
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

  const graphHeight = h - padding;
  const graphWidth = w - padding * 2;

  const widthPerBar = graphWidth / data.length;

  svg
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("width", () => widthPerBar)
    .attr("height", (d, i) => graphHeight - yScale(d[1]))
    .attr("x", (d, i) => i * widthPerBar + padding)
    .attr("y", (d) => yScale(d[1]))
    .attr("data-date", (d) => d[0])
    .attr("data-gdp", (d) => d[1])
    .on("mouseover", (mouseData, d) => {
      const tooltip = document.querySelector("#tooltip");
      const tooltipDate = document.querySelector("#tooltip-date");
      const tooltipGDP = document.querySelector("#tooltip-gdp");
      // center tooltip
      tooltip.style.left = mouseData.pageX - tooltip.offsetWidth + "px";
      tooltipDate.textContent = d[0];
      tooltipGDP.textContent = `$${d[1]} Billion`;
      tooltip.classList.remove("opactiy-0");
      tooltip.style.opacity = 1;
    });

  svg
    .append("g")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .call(xAxis);

  svg
    .append("g")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis);
});

function getYear(str) {
  return str.split("-")[0];
}
