let someData;

//d3.json("https://api.myjson.com/bins/9hdjn", function(error, data) {
d3.json("data/9hdjn.json", function(error, data) {

  let reduceMpg = (arr) => {
    let acc = {avgMpg: 0, numCars: 1};
    //console.log(arr[0]["model year"]);
    return arr.reduce((acc, curr) => {
      acc.avgMpg = (acc.avgMpg + curr["miles"]["gallon"]) / (acc.numCars);
      acc.numCars = 2;
      //console.log(acc.avgMpg);
      return acc;
    }, acc);
  };

  someData = d3.nest()
    .key((d) => d["model year"])
    .entries(data);

  let pieGenerator = d3.pie()
    .value((d, i) => reduceMpg(d.values).avgMpg)
    .sort((a, b) => a.key - b.key);

  var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .text("Avg MPG");

  let arcData = pieGenerator(someData);

  var arcGenerator = d3.arc()
    .innerRadius(20)
    .outerRadius(100);

  console.log(arcData);

  d3.select('svg#pie g')
    .selectAll('path')
    .data(arcData)
    .enter()
    .append('path')
    .style('fill', 'orange')
    .style('stroke', 'white')
    .attr('d', arcGenerator)
    .on("mouseover", function(){return tooltip.style("visibility", "visible");})
    .on("mousemove", function(d){
      return tooltip
        .style("top", (event.pageY-10)+"px")
        .style("left",(event.pageX+10)+"px")
        .text(`Year: ${d.data.key}, MPG: ${d.value.toFixed(2)}`);
    })
    .on("mouseout", function(){return tooltip.style("visibility", "hidden");});
});
