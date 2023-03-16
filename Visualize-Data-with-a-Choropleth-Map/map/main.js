import * as d3 from "d3";
import * as topojson from "topojson-client";

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

  svg.attr("width", w).attr("height", h);

  const geoJson = topojson.feature(
    UScountiesMapData,
    UScountiesMapData.objects.counties,
  );

  const countriesJsonGenerated = geoJson.features;

  const projection = d3.geoIdentity().fitSize([w, h], geoJson);

  const paths = svg
    .selectAll("path")
    .data(countriesJsonGenerated)
    .enter()
    .append("path")
    .attr("d", d3.geoPath().projection(projection));

  paths
    .attr("data-fips", (d) => d.id)
    .attr("data-education", (d) => {
      const id = d.id;

      const educationObj = USeducationData.find(
        (obj) => obj.fips === id,
      );

      return educationObj.bachelorsOrHigher;
    })
    .classed("county", true)
    .classed("hover:fill-yellow-400", true);

  const tooltip = d3.select("#tooltip");

  paths.on("mouseover", (e, d) => {
    const educationObj = USeducationData.find(
      (obj) => obj.fips === d.id,
    );

    const additionalDistance = 10;

    tooltip.classed("opacity-0", false);

    tooltip.style(
      "transform",
      `translate(
        ${
          e.pageX > window.innerWidth * 0.5
            ? e.pageX -
              additionalDistance -
              tooltip.node().getBoundingClientRect().width
            : e.pageX + additionalDistance
        }px, 
        ${e.pageY + additionalDistance}px)
      `,
    );

    tooltip.html(() => {
      const arrSpans = Object.keys(educationObj)
        .map((key) => {
          return `
          <div class="grid grid-cols-2 gap-4">
            <span class="flex justify-between font-bold capitalize gap-2">
              <span>${key.replace("_", " ")}</span>
              <span>:</span>
            </span>
            <span>${educationObj[key]}</span>
          </div>
        `;
        })
        .join("");

      return `
        <div class="text-lg">
          ${arrSpans}
        </div>
      `;
    });

    tooltip.attr("data-education", () => {
      const id = d.id;
  
      const educationObj = USeducationData.find(
        (obj) => obj.fips === id,
      );
  
      return educationObj.bachelorsOrHigher;
    });
  });

  paths.on("mouseleave", () => {
    tooltip.classed("opacity-0", true);
  });

  const twColorObj = {
    "fill-green-100": {
      max: 12,
      needToBeApplied: (percentage) => percentage < 12,
    },
    "fill-green-200": {
      min: 12,
      max: 21,
      needToBeApplied: (percentage) =>
        percentage >= 12 && percentage < 21,
    },
    "fill-green-300": {
      min: 21,
      max: 30,
      needToBeApplied: (percentage) =>
        percentage >= 21 && percentage < 30,
    },
    "fill-green-400": {
      min: 30,
      max: 39,
      needToBeApplied: (percentage) =>
        percentage >= 30 && percentage < 39,
    },
    "fill-green-500": {
      min: 39,
      max: 48,
      needToBeApplied: (percentage) =>
        percentage >= 39 && percentage < 48,
    },
    "fill-green-600": {
      min: 48,
      max: 66,
      needToBeApplied: (percentage) =>
        percentage >= 48 && percentage < 66,
    },
    "fill-green-700": {
      min: 66,
      needToBeApplied: (percentage) => percentage >= 66,
    },
  };

  const legend = d3.select("#legend");

  legend.classed("flex gap-4 flex-wrap justify-center rounded", true);

  const legendChilds = legend
    .selectAll("div")
    .data(Object.keys(twColorObj))
    .enter()
    .append("div");

  legendChilds
    .classed(
      "border p-4 flex items-center gap-4 rounded-lg hover:shadow transition",
      true,
    )
    .html((d) => {
      const bg = d.replace("fill", "bg");
      const value = twColorObj[d];

      return `
        <div class="h-4 w-4 ${bg}"></div>
        <div>
          ${value.min ? `${value.min}%` : "<"}
          ${value.min && value.max ? "-" : ""} 
          ${value.max ? `${value.max}%` : ">"}
        </div>
      `;
    });

  Object.keys(twColorObj).forEach((key) => {
    const value = twColorObj[key];

    paths.classed(key, (d) => {
      const id = d.id;
      const educationObj = USeducationData.find(
        (obj) => obj.fips === id,
      );

      return value.needToBeApplied(educationObj.bachelorsOrHigher);
    });
  });
});
