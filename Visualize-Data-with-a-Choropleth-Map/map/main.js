import * as d3 from "d3";

const multipleFetch = Promise.all([
  d3.json(
    "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json",
  ),
  d3.json(
    "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json",
  ),
]);

// EDUCATION DATA is the real data
// COUNTIES DATA is the map data
multipleFetch.then(([USeducationData, UScountiesMapData]) => {
  const svg = d3.select("svg");

  const w = (window.innerWidth / 100) * 60;
  const h = (window.innerHeight / 100) * 60;
  const p = 60;

  svg.attr("width", w).attr("height", h);

  const xScale = d3
    .scaleLinear()
    .domain([0, 100])
    .range([0, w - p]);

  svg
    .append("g")
    .style("transform", `translate(${p / 2}px, ${h - p / 2}px)`)
    .call(d3.axisBottom(xScale));

  const yScale = d3
    .scaleLinear()
    .domain([0, 100])
    .range([h-p, 0]);

  svg
    .append("g")
    .style("transform", `translate(${p / 2}px, ${p / 2}px)`)
    .call(d3.axisLeft(yScale));
});
