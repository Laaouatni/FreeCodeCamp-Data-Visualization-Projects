import * as d3 from "d3";

d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json",
).then((data) => {
  console.log(data);

  const container = document.querySelector("#container");

  const w = window.innerWidth - container.offsetLeft;
  const h = window.innerHeight - container.offsetTop;
  const padding = 50;

  const svg = d3.select("svg");

  // x
  const xScale = d3
    .scaleLinear()
    .range([padding, w - padding])
    .domain([
      d3.min(data, (d) => d.Year),
      d3.max(data, (d) => d.Year),
    ]);
  const xAxis = d3.axisBottom(xScale);

  svg
    .append("g")
    .attr("transform", `translate(0, ${h - padding})`)
    .attr("id", "x-axis")
    .call(xAxis);

  // y
  const yScale = d3
    .scaleTime()
    .range([padding, h - padding])
    .domain([
      d3.min(data, (d) => returnMinSecDate(d.Time)),
      d3.max(data, (d) => returnMinSecDate(d.Time)),
    ]);

  const yAxis = d3
    .axisLeft(yScale)
    .tickFormat(d3.timeFormat("%M:%S"));

  svg
    .append("g")
    .attr("transform", `translate(${padding}, 0)`)
    .attr("id", "y-axis")
    .call(yAxis);

  // svg
  svg.attr("width", w).attr("height", h);

  // circles
  svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("data-xvalue", (d) => d.Year)
    .attr("data-yvalue", (d) => d.Time)
    .attr("cx", (d) => xScale(d.Year))
    .attr("cy", (d) => yScale(returnMinSecDate(d.Time)))
    .attr("r", 5)
    .attr("fill", (d) => (d.Doping ? "red" : "green"))
    .style("opacity", 0.6)
    .attr("stroke", "black")
    .style("transition", "all 0.4s")
    .on("mouseover", (a, d) => {
      d3.select(a.target)
        .style("opacity", 1)
        .attr("r", 10)
        .attr("stroke-width", 3);
      
      console.log(d)
      // tooltip.text(`${d}`)
      })
      .on("mouseout", (d) => {
        d3.select(d.target)
        .style("opacity", 0.5)
        .attr("r", 5)
        .attr("stroke-width", 1);
      });
  
  // tooltip
  const tooltip = d3.select("#tooltip");
});

function returnMinSecDate(input) {
  const arr = input.split(":");
  const date = new Date();
  date.setMinutes(arr[0]);
  date.setSeconds(arr[1]);
  return date;
}
