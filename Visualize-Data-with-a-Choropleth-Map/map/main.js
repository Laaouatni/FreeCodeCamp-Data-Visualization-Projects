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

  const width = window.innerWidth / 100 * 60;
  const height = window.innerHeight / 100 * 60;
  
  svg.attr("width", width).attr("height", height);
});

