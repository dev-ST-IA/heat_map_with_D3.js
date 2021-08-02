//https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json

const svgHeight = 1000;
const height = 700;
const width = 1500;
const padding = 70;
const barHeight = 700 / 12;
var colour = d3.scaleSequential(d3.interpolateRdBu);
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const svg = d3
  .select("#chart")
  .append("svg")
  .attr("id", "svg")
  .attr("height", svgHeight)
  .attr("width", width);

const legend = svg
  .append("g")
  .attr("id", "legend")
  .attr("transform", "translate(450,0)");
const tooltip = d3
  .select("#chart")
  .append("div")
  .attr("id", "tooltip")
  .style("opacity", 0);
fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
)
  .then((response) => response.json())
  .then((data) => {
    const datas = data;
    const monthlyVar = datas.monthlyVariance;
    const baseTemp = datas.baseTemperature;
    const yearSet = Array.from(new Set(monthlyVar.map((e) => e.year)));
    const monthSet = Array.from(new Set(monthlyVar.map((e) => e.month)));
    const barWidth = width / monthlyVar.filter((e) => e.month == 5).length;
    const temp = monthlyVar.map((e) => data.baseTemperature + e.variance);
    const tempMax = Math.floor(d3.max(temp)) + 1;
    const tempMin = Math.floor(d3.min(temp)) - 1;
    const tempAvg = 1 / (tempMin + tempMax + 1);
    const heatLevel = new Map([
      [0, 0],
      [1, (tempAvg * 1).toPrecision(3)],
      [2, (tempAvg * 2).toPrecision(3)],
      [3, (tempAvg * 3).toPrecision(3)],
      [4, (tempAvg * 4).toPrecision(3)],
      [5, (tempAvg * 5).toPrecision(3)],
      [6, (tempAvg * 6).toPrecision(3)],
      [7, (tempAvg * 7).toPrecision(3)],
      [8, (tempAvg * 8).toPrecision(3)],
      [9, (tempAvg * 9).toPrecision(3)],
      [10, (tempAvg * 10).toPrecision(3)],
      [11, (tempAvg * 11).toPrecision(3)],
      [12, (tempAvg * 12).toPrecision(3)],
      [13, (tempAvg * 13).toPrecision(3)],
      [14, (tempAvg * 14).toPrecision(3)],
      [15, (tempAvg * 15).toPrecision(3)],
    ]);

    xScale = d3
      .scaleLinear()
      .domain([d3.min(yearSet), d3.max(yearSet) + 1])
      .range([padding, width - padding]);
    yScale = d3
      .scaleTime()
      .domain([new Date(0, 0, 0, 0, 0, 0, 0), new Date(0, 12, 0, 0, 0, 0, 0)])
      .range([150, 850]);

    function mouseover(e, d) {
      tooltip
        .style("opacity", 1)
        .style("left", e.layerX + "px")
        .style("top", e.layerY + "px")
        .style("fill", "black")
        .html(
          `<p>${monthNames[d.month - 1]} ${d.year}</p>
              <p>Temperature(Celsius)<br>${(d.variance + baseTemp).toPrecision(
                3
              )}</p>
        `
        )
        .attr("data-year", d.year);

      svg.select(e.target.className.baseVal).style("fill", "black");
    }

    function mouseout() {
      tooltip.style("opacity", 0);
    }

    svg
      .selectAll("rect")
      .data(monthlyVar)
      .enter()
      .append("rect")
      .attr("x", (d, i) => xScale(d.year))
      .attr("y", (d, i) => yScale(new Date(0, d.month - 1, 0, 0, 0, 0, 0)))
      .attr("width", (d, i) => barWidth)
      .attr("height", (d, i) => barHeight)
      .style("fill", (d, i) =>
        colour(heatLevel.get(16 - Math.trunc(baseTemp + d.variance)))
      )
      .attr("class", "cell")
      .attr("data-month", (d) => d.month - 1)
      .attr("data-year", (d) => d.year)
      .attr("data-temp", (d) => d.variance + baseTemp)
      .on("mouseover", (e, d) => mouseover(e, d))
      .on("mouseout", () => mouseout());

    legend
      .selectAll("rect")
      .data(heatLevel.values())
      .enter()
      .append("rect")
      .attr("y", svgHeight - 80)
      .attr("x", (d, i) => i * 30 + padding)
      .attr("width", 30)
      .attr("height", 30)
      .style("fill", (d) => colour(d));
    console.log(d3.max(temp));

    legend
      .append("text")
      .attr("x", (heatLevel.size * 30) / 2)
      .attr("y", svgHeight - 10)
      .text("Temperature Variance Level Colour Code")
      .attr("transform", `translate(-100,0)`)
      .attr("class", "legendCode");

    const legendXScale = d3
      .scaleLinear()
      .domain([tempMax + 2, tempMin])
      .range([padding, heatLevel.size * 30 + padding]);

    const legendxAxis = d3.axisBottom(legendXScale).ticks(heatLevel.size);
    xAxis = d3
      .axisBottom(xScale)
      .tickFormat(d3.format("d"))
      .ticks((d3.max(yearSet) - d3.min(yearSet) + 2) / 10);
    yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%B"));

    svg
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", "translate(0," + 850 + ")")
      .call(xAxis);

    svg
      .append("g")
      .attr("id", "y-axis")
      .attr("transform", "translate(" + padding + ",0)")
      .call(yAxis);

    svg
      .append("g")
      .attr("transform", "translate( 450," + (svgHeight - 50) + ")")
      .call(legendxAxis);
  });
