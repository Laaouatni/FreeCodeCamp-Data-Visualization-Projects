import * as d3 from "d3";

const json = d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json",
);

json.then((data) => {
  const dataset = data.monthlyVariance;

  const w = (window.innerWidth / 100) * 60;
  const h = (window.innerHeight / 100) * 60;
  const p = 150;

  const svg = d3.select("svg");

  svg.attr("width", w).attr("height", h);

  const rects = svg
    .append("g")
    .style("transform", `translate(${p / 2}px, ${p / 2}px)`)
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect");

  const xScale = d3
    .scaleTime()
    .range([0, w - p])
    .domain([
      returnYear(d3.min(dataset, (d) => d.year)),
      returnYear(d3.max(dataset, (d) => d.year)),
    ]);

  svg
    .append("g")
    .style("transform", `translate(${p / 2}px,${h - p / 2}px)`)
    .call(d3.axisBottom(xScale));

  const yScale = d3
    .scaleBand()
    .range([0, h - p])
    .domain(d3.range(1, 12 + 1));

  svg
    .append("g")
    .style(
      "transform",
      `translate(${p / 2}px, ${p / 2}px
      )`,
    )
    .call(d3.axisLeft(yScale).tickFormat((d) => {
      const date = new Date();
      date.setMonth(d - 1);
      return d3.timeFormat("%B")(date);
    }));
  
  const allLengths = returnAllLengthsMonths(dataset);

  rects
    .attr("fill", (d) => randomColor())
    .attr("x", (d) => xScale(returnYear(d.year)))
    .attr("y", (d) => yScale(d.month))
    .attr("width", (d) => {
      const month = d.month;
      const totalItemsPerMonth = allLengths.find((item) => item.monthNumber === month);
      return w / totalItemsPerMonth.length;
    })
    .attr("height", yScale.bandwidth());
});

function returnYear(year) {
  const date = new Date();
  date.setFullYear(year);
  return date;
}

function randomColor() {
  return `rgb(${n()},${n()},${n()})`;

  function n() {
    return Math.floor(Math.random() * 255);
  }
}

function returnAllLengthsMonths(dataset) {
  return d3.range(1, 12 + 1).map((monthNumber) => {
    const filtered = dataset.filter(
      (dataItem) => dataItem.month === monthNumber,
    );
    const length = filtered.length;

    return {
      monthNumber,
      length,
    };
  });
}
