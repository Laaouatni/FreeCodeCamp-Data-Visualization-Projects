import * as d3 from "d3";

const json = d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json",
);

json.then((data) => {
  const dataset = data.monthlyVariance;
  console.log(dataset);

  const w = (window.innerWidth / 100) * 80;
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
    .attr("id", "x-axis")
    .style("transform", `translate(${p / 2}px,${h - p / 2}px)`)
    .call(d3.axisBottom(xScale));

  const yScale = d3
    .scaleBand()
    .range([0, h - p])
    .domain(d3.range(1, 12 + 1));

  svg
    .append("g")
    .attr("id", "y-axis")
    .style(
      "transform",
      `translate(${p / 2}px, ${p / 2}px
      )`,
    )
    .call(
      d3.axisLeft(yScale).tickFormat((d) => {
        const date = new Date();
        date.setMonth(d - 1);
        return d3.timeFormat("%B")(date);
      }),
    );

  const allLengths = returnAllLengthsMonths(dataset);

  rects
    .attr("class", "cell")
    .attr("x", (d) => xScale(returnYear(d.year)))
    .attr("y", (d) => yScale(d.month))
    .attr("width", (d) => {
      const month = d.month;
      const totalItemsPerMonth = allLengths.find(
        (item) => item.monthNumber === month,
      );
      return w / totalItemsPerMonth.length;
    })
    .attr("height", yScale.bandwidth())
    .attr("data-month", (d) => d.month)
    .attr("data-year", (d) => d.year)
    .attr("data-temp", (d) => data.baseTemperature + d.variance);

  rects
    .on("mouseover", (e, d, n) => {
      const thisRect = d3.select(e.target);

      const dataToShow = {
        month: thisRect.attr("data-month"),
        year: thisRect.attr("data-year"),
        temp: Number(thisRect.attr("data-temp")).toFixed(3),
        variance: d.variance,
      };

      const tooltip = d3.select("#tooltip");

      tooltip.classed("backdrop-blur-md", true);

      tooltip.style("transform", () => {
        const x = xScale(returnYear(d.year));
        const y = yScale(d.month);
        return `translate(${x}px, ${y}px)`;
      });

      tooltip.classed("opacity-0", false);

      tooltip.html(() => {
        return Object.keys(dataToShow)
          .map((key) => {
            return `
            <div class="grid grid-cols-2 gap-4">
              <span class="font-bold flex justify-between gap-2">
                <span>${key}</span>
                <span>:</span>
              </span>
              <span class="text-right">${dataToShow[key]}</span>
            </div>
          `;
          })
          .join("");
      });
    })
    .on("mouseout", () => {
      const tooltip = d3.select("#tooltip");

      tooltip.classed("opacity-0", true);
    });

  rects
    .classed("fill-blue-600", (d) => {
      const temperature = data.baseTemperature + d.variance;
      return temperature < 3.9;
    })
    .classed("fill-blue-500", (d) => {
      const temperature = data.baseTemperature + d.variance;
      return temperature >= 3.9 && temperature < 5;
    })
    .classed("fill-blue-400", (d) => {
      const temperature = data.baseTemperature + d.variance;
      return temperature >= 5 && temperature < 6.1;
    })
    .classed("fill-blue-300", (d) => {
      const temperature = data.baseTemperature + d.variance;
      return temperature >= 6.1 && temperature < 7.2;
    })
    .classed("fill-red-200", (d) => {
      const temperature = data.baseTemperature + d.variance;
      return temperature >= 7.2 && temperature < 8.3;
    })
    .classed("fill-red-300", (d) => {
      const temperature = data.baseTemperature + d.variance;
      return temperature >= 8.3 && temperature < 9.5;
    })
    .classed("fill-red-400", (d) => {
      const temperature = data.baseTemperature + d.variance;
      return temperature >= 9.5 && temperature < 10.6;
    })
    .classed("fill-red-500", (d) => {
      const temperature = data.baseTemperature + d.variance;
      return temperature >= 10.6 && temperature < 11.7;
    })
    .classed("fill-red-600", (d) => {
      const temperature = data.baseTemperature + d.variance;
      return temperature >= 11.7;
    });

  // description
  d3.select("#description").text(() => {
    const minYear = d3.min(dataset, (d) => d.year);
    const maxYear = d3.max(dataset, (d) => d.year);
    const baseTemperature = data.baseTemperature;
    return `${minYear} - ${maxYear}: base temperature ${baseTemperature}℃`;
  });
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
