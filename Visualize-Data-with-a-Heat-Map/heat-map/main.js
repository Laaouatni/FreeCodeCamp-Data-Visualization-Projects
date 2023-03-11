import * as d3 from "d3";

const json = d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json",
);

json.then((data) => {
  const dataset = data.monthlyVariance;

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
    .attr("data-month", (d) => d.month - 1)
    .attr("data-year", (d) => d.year)
    .attr("data-temp", (d) => data.baseTemperature + d.variance)
    .classed("hover:fill-yellow-200", true);

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

      tooltip.attr("data-year", thisRect.attr("data-year"));

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

  const twColorObj = {
    "fill-blue-600": {
      maxTemp: 3.9,
      needToBeApplied: (t) => t < 3.9,
    },
    "fill-blue-500": {
      minTemp: 3.9,
      maxTemp: 5,
      needToBeApplied: (t) => t >= 3.9 && t < 5,
    },
    "fill-blue-400": {
      minTemp: 5,
      maxTemp: 6.1,
      needToBeApplied: (t) => t >= 5 && t < 6.1,
    },
    "fill-blue-300": {
      minTemp: 6.1,
      maxTemp: 7.2,
      needToBeApplied: (t) => t >= 6.1 && t < 7.2,
    },
    "fill-red-200": {
      minTemp: 7.2,
      maxTemp: 8.3,
      needToBeApplied: (t) => t >= 7.2 && t < 8.3,
    },
    "fill-red-300": {
      minTemp: 8.3,
      maxTemp: 9.5,
      needToBeApplied: (t) => t >= 8.3 && t < 9.5,
    },
    "fill-red-400": {
      minTemp: 9.5,
      maxTemp: 10.6,
      needToBeApplied: (t) => t >= 9.5 && t < 10.6,
    },
    "fill-red-500": {
      minTemp: 10.6,
      maxTemp: 11.7,
      needToBeApplied: (t) => t >= 10.6 && t < 11.7,
    },
    "fill-red-600": {
      minTemp: 11.7,
      needToBeApplied: (t) => t >= 11.7,
    },
  };

  Object.keys(twColorObj).forEach((key) => {
    const value = twColorObj[key];
    rects.classed(key, (d) => {
      const temperature = data.baseTemperature + d.variance;
      return value.needToBeApplied(temperature);
    });
  });

  // legend
  const legend = d3.select("#legend").append("rect");

  legend.classed("flex", true).classed("justify-evenly", true).classed("flex-wrap", true).classed("gap-4", true);

  const legendDivs = legend
    .selectAll("div")
    .data(Object.keys(twColorObj))
    .enter()
    .append("div");

  legendDivs
    .attr("data-index", (d, i) => i)
    .attr("data-tw-color", (d) => d)
    .attr("min-temp", (d) => twColorObj[d].minTemp)
    .attr("max-temp", (d) => twColorObj[d].maxTemp);

  legendDivs.html((d) => {
    return `<div class="border p-2 grid gap-2 place-items-center rounded-xl hover:shadow-lg transition">
      <div class="w-10 h-10 ${d.replace(
        "fill",
        "bg",
      )} rounded-lg"></div>
      <div class="text-center flex gap-4">
        <span>${twColorObj[d].minTemp || "<"}</span>
        <span>${twColorObj[d].maxTemp || ">"}</span>
      </div>
    </div>`;
  });

  legendDivs.selectAll(".putTwColorHere");

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
