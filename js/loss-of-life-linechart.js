
function lossOfLifeLineChart(svg,country) {
 //   document.getElementById("chart-container").innerHTML = "";
    var parseDate = d3.timeParse("%m/%d/%Y");

/*
    var svg = d3.select("#chart-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
*/

    //Read the data
    d3.csv("data/owid-covid-data_test.csv", function(data) {
  //  addDropdown(data,svg);
        svg.append("text")
            .attr("x", width/2)
            .attr("y", 15)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-family", "Verdana")
            .style("font-weight", "bold")
            .text("Deceased Patients");
        svg.append("text")
            .attr("transform", "translate(" + (width/2) + " ," + (height+30) + ")")
            .style("text-anchor", "middle")
            .text("Month Year");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -(height/2))
            .attr("y", -50)
            .style("text-anchor", "middle")
            .text("Number of People Lost their lives");
    initChartLossLine(country,svg,data);

    });
}



function format_data_loss_line(tobeformatdata)
{
    tobeformatdata.forEach(function (d) {
        d.parsed_date = parseDate(d.date);
        d.new_deaths_index = +d.new_deaths;
        //  console.log(d.location+" "+d.parsed_date+" "+d.sti_index+" "+d.new_cases);
    });
    return tobeformatdata;
}
function transition(path) {
    path.transition()
        .duration(3000)
        .attrTween("stroke-dasharray", tweenDash)
        .on("end", () => { d3.select(this).call(transition); });
}

function tweenDash() {
    const l = this.getTotalLength(),
        i = d3.interpolateString("0," + l, l + "," + l);
    return function(t) { return i(t) };
}
function initChartLossLine(country,svg,rawdata)
{
    var counry_data = rawdata.filter(function(d){
        return d.location === country;
    });
    var formatted_data=format_data_loss_line(counry_data);

    var max_new_deaths = formatted_data.reduce(function (prev, current) {
        return (prev.new_deaths_index > current.new_deaths_index) ? prev : current
    })
    //  console.log(max_new_cases.new_cases);
    //  console.log(max_sti.sti_index);
    var x = d3.scaleTime()
        .domain(d3.extent(formatted_data, function(d) {
            return d.parsed_date }))
        .range([ 0, width ]);

    var y = d3.scaleLinear()
        .domain([0, max_new_deaths.new_deaths_index])
        .range([height, 0]);

    var xAxis = d3.axisBottom(x)
        .scale(x);


    var yAxis = d3.axisLeft()
        .scale(y);

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis.tickFormat(d3.timeFormat("%b%y")).ticks(17));


    svg.append("g")
        .attr("class", "y-axis")
        //      .attr("stroke",'#ee232c')
        .attr("stroke-width", 1.5)
        .call(yAxis);
//tootip
    var tooltip = d3.select("#chart-container")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "visible");
//.text("");
// Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function (d) {
        tooltip
            .style("opacity", 1)
    }
    var mousemove = function (d) {
        //    console.log(d);
        var coordinates = d3.mouse(this);
        // var x = coordinates[0];
        //var y = coordinates[1];
        const hoveredData = y.invert(coordinates[1]);
        // console.log(hoveredDate);
        tooltip
            .text(parseInt(hoveredData))
            .style("left", (d3.mouse(this)[0] + 290) + "px")
            .style("top", (d3.mouse(this)[1]+150) + "px")
    }
    var mouseleave = function (d) {
        tooltip
            .style("opacity", 0)
    }

    svg.append("path")
        .datum(formatted_data)
        .attr("fill", "none")
        .attr("stroke", '#0d4277')
        .attr("stroke-width", 1.5)
        .attr("class", "loss_line")
        .attr("d", d3.line()
            .defined(d => !isNaN(d.new_deaths_index))
            .x(function(d) {
                // console.log(d.date);
                // console.log(d.parsed_date);
                // console.log("x",x(d.parsed_date));
                return x(d.parsed_date) })
            .y(function(d) {
                // console.log("y",y_left(+d.new_cases));
                return y(+d.new_deaths_index)
            })
        )
        .call(transition)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);
}

function updateChartLossLine(country,rawdata,svg){
    var counry_data = rawdata.filter(function(d){
        return d.location == country;
    });
    //     console.log("update ",counry_data);
    var formatted_data=format_data_loss_line(counry_data);

    var max_new_deaths_index = formatted_data.reduce(function (prev, current) {
        return (prev.new_deaths_index > current.new_deaths_index) ? prev : current
    })

    var x = d3.scaleTime()
        .domain(d3.extent(formatted_data, function(d) {
            return d.parsed_date }))
        .range([ 0, width ]);


    var y = d3.scaleLinear()
        .domain([0, max_new_deaths_index.new_deaths_index])
        .range([height, 0]);

    var xAxis = d3.axisBottom(x)
        .scale(x);

    var yAxis = d3.axisLeft()
        .scale(y);


    svg.select("g.x-axis")
        .transition() // <---- Here is the transition
        .duration(2000) // 2 seconds
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis.tickFormat(d3.timeFormat("%b%y")).ticks(17));


    svg.select("g.y-axis")
        .transition() // <---- Here is the transition
        .duration(2000) // 2 seconds
        .call(yAxis);

    var path_loss_line_u = svg.select("path.loss_line")
        .datum(formatted_data)
        .transition() // <---- Here is the transition
        .duration(2000) // 2 seconds
        .attr("fill", "none")
        .attr("stroke", '#0d4277')
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .defined(d => !isNaN(d.new_deaths_index))
            .x(function(d) {

                return x(d.parsed_date) })
            .y(function(d) {
                // console.log("y",y_left(+d.new_cases));
                return y(+d.new_deaths_index)
            })
        );

}

