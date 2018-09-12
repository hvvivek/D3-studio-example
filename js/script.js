var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
var svg = d3.select("#map");
var path = d3.geoPath();


d3.json("us_geo.json").then(function(us) {

var projection = d3.geoAlbersUsa()
				//    .translate([width/2, height/2])    // translate to center of screen
                   .scale([1000]);
                   
var path = d3.geoPath().projection(projection);

svg.selectAll("path")
	.data(us.geometries)
	.enter()
	.append("path")
	.attr("d", path)
    .style("stroke", "#666")
    .style("fill", "none")
    .style("stroke-width", "1")
                                      


});

var d = 1
var h = 0
var total_acc = 0
var accident_data;
var moon_data;

d3.csv("data.csv").then(function(data){
    

    console.log(data)
    accident_data = data;
    

})

d3.csv("data_moon.csv").then(function(data){
        moon_data = data;
})


var projection = d3.geoAlbersUsa()
				//    .translate([width/2, height/2])    // translate to center of screen
                   .scale([1000]);


var graph = d3.select("#graph")
width = 1000;
height = 400;

xScale = d3.scaleLinear().domain([0, 366]).range([0, width])
yScale = d3.scaleLinear().domain([150, 40]).range([0, height])
yScaleAcc = d3.scaleLinear().domain([20, 150]).range([1, 5])

yAxis = d3.axisLeft(yScale).tickValues([]);
xAxis = d3.axisBottom(xScale).tickValues([]);

var colorScale = d3.scaleSequential(d3.interpolateInferno)
    .domain([0, 1])

graph.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    // .selectAll("text").remove()
.append("text")
    .attr("class", "label")
    .attr("x", height/2)
    .attr("y", 40)
    // .style("text-anchor", "end")
    .attr("stroke", "#aaa")
    .style("font-size", "25px")
    .style("fill", "#aaa")
    .attr("transform", "rotate(90)")
    .text("Accidents");

graph.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0, 400)")
    .attr("stroke", "#fff")
    .call(xAxis)
    // .selectAll("text").remove()
.append("text")
    .attr("class", "label")
    .attr("x", width/2)
    .attr("y", 30)
    .style("font-size", "25px")
    .style("fill", "#aaa")
    .attr("stroke", "#aaa")
    // .style("text-anchor", "end")
    .text("Time of Year");

setInterval(function(){

    if(accident_data)
    {   
        var x;
        var y;

        var filtered_data = accident_data.filter(function(a){ return parseInt(a.date_num)-42369 == d && parseInt(a.hour) == h})
        total_acc = accident_data.filter(function(a){ return parseInt(a.date_num)-42369 == d}).length

        for(var i=0; i<filtered_data.length; i++)
        {
            a = filtered_data[i]
            svg.append("circle")
            .attr("r",5)
            .attr("transform", "translate(" + projection([a.long,a.lat]) + ")")
            .attr("fill", "red");

            if(typeof parseInt(a.day) !='undefined')
            {
                x = parseInt(a.day) - 1
            }

            if(typeof parseInt(a.month) !='undefined')
            {
                y = parseInt(a.month)   
            }         
        }

        // console.log(x)
        // console.log(y)

        
        if(typeof x != 'undefined' & typeof y != 'undefined')
        {
            d3.select("#moon").selectAll("path").remove()

            console.log(moon_data[x][months[y-1]] + " " + x + " " + y)
            var arc = d3.arc()
            .innerRadius(0)
            .outerRadius(200)
            .startAngle(360 * parseFloat(moon_data[x][months[y-1]]) * (Math.PI/180)) //converting from degs to radians
            .endAngle(0) //just radians



            d3.select("#moon").append("path")
            .attr("d", arc)
            .attr("transform", "translate(200,200)")
            .attr("fill", "white")
        }

        if(y+1)
        {
            d3.select("#month").text(months[y-1] + " " + (x+1))
            d3.select("#acc").text("Accidents: "+ (total_acc))
            d3.select("#lum").text("Luminance: "+ moon_data[x][months[y-1]])

            graph.append("circle").attr("r",yScaleAcc(total_acc))
            .attr("transform", "translate(" + xScale(d) + " " + yScale(total_acc) + ")")
            .attr("fill", colorScale(moon_data[x][months[y-1]]));
        }
        // else
        // {
            // console.log(y)
        // }
        // d3.select("#date").text(x + 1)

        

        

    h = h+1
    
    if(h == 24)
    {
        svg.selectAll("circle").remove()
        total_acc = 0
        h = 0
        d = d+1
    }

    if(d == 366)
    {
        d = 0
    }


    // console.log(d + " " + h)
}
}, 100)




// setup x 
// var xValue = function(d) { return d.Calories;}, // data -> value
//     xScale = d3.scale.linear().range([0, width]), // value -> display
//     xMap = function(d) { return xScale(xValue(d));}, // data -> display
//     xAxis = d3.svg.axis().scale(xScale).orient("bottom");

// // setup y
// var yValue = function(d) { return d["Protein (g)"];}, // data -> value
//     yScale = d3.scale.linear().range([height, 0]), // value -> display
//     yMap = function(d) { return yScale(yValue(d));}, // data -> display
//     yAxis = d3.svg.axis().scale(yScale).orient("left");

// // don't want dots overlapping axis, so add in buffer to data domain
// xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
// yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

// // x-axis
// svg.append("g")
//     .attr("class", "x axis")
//     .attr("transform", "translate(0," + height + ")")
//     .call(xAxis)
//   .append("text")
//     .attr("class", "label")
//     .attr("x", width)
//     .attr("y", -6)
//     .style("text-anchor", "end")
//     .text("Calories");

// // y-axis


// // draw dots
// svg.selectAll(".dot")
//     .data(data)
//   .enter().append("circle")
//     .attr("class", "dot")
//     .attr("r", 3.5)
//     .attr("cx", xMap)
//     .attr("cy", yMap)
//     .style("fill", function(d) { return color(cValue(d));}) 
//     .on("mouseover", function(d) {
//         tooltip.transition()
//              .duration(200)
//              .style("opacity", .9);
//         tooltip.html(d["Cereal Name"] + "<br/> (" + xValue(d) 
//           + ", " + yValue(d) + ")")
//              .style("left", (d3.event.pageX + 5) + "px")
//              .style("top", (d3.event.pageY - 28) + "px");
//     })
//     .on("mouseout", function(d) {
//         tooltip.transition()
//              .duration(500)
//              .style("opacity", 0);
//     });