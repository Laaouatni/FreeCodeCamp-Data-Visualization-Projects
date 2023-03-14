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
  const start = performance.now();

  const svg = d3.select("svg");

  const w = (window.innerWidth / 100) * 60;
  const h = (window.innerHeight / 100) * 60;

  svg.attr("width", w).attr("height", h);

  const geoJson = topojson.feature(
    UScountiesMapData,
    UScountiesMapData.objects.counties,
  );

  const countriesJsonGenerated = geoJson.features;

  console.log(USeducationData);

  const projection = d3.geoIdentity().fitSize([w, h], geoJson);

  const paths = svg
    .selectAll("path")
    .data(countriesJsonGenerated)
    .enter()
    .append("path")
    .attr("d", d3.geoPath().projection(projection));

  paths.attr("data-fips", (d) => d.id);

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
    .classed("border p-4 flex items-center gap-4 rounded-lg hover:shadow transition", true)
    .html((d) => {
      const bg = d.replace("fill", "bg");
      const value = twColorObj[d];

      return `
        <div class="h-4 w-4 ${bg}"></div>
        <div>
          ${value.min ? `${value.min}%` : "<"}
          ${value.min && `${value.max}%` ? "-" : ""} 
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

  const finish = performance.now();

  console.log("time needed:" + (finish - start) + "ms");
});
