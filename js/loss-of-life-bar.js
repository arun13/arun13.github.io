
// to get data formatted
function format_data_loss(tobeformatdata) {
    tobeformatdata.forEach(function (d) {
        d.month_year = parseDate(d.date);
        d.value = +d.new_deaths;
        //console.log(d.location+" "+d.date+" "+d.value)
    });
    tobeformatdata.forEach(function (d) {
        const formatMonthYear = d3.timeFormat("%b%y");
        d.month_year = formatMonthYear(d.month_year);
        d.value = parseInt(d.value);
        //console.log(d.location + " " + d.date + " " + d.value);
    });

    var formatted_data = [];
    tobeformatdata.reduce(function (outValue, inValue) {
        if (!outValue[inValue.month_year]) {
            outValue[inValue.month_year] = {
                month_year: inValue.month_year,
                location: inValue.location,
                value: inValue.value
            };
            formatted_data.push(outValue[inValue.month_year]);
        }
        outValue[inValue.month_year].value += inValue.value;
        return outValue;
    }, {});

    //    console.log(formatted_data);
    return formatted_data;
}
//Init Graph

function initChartLossBar(rawdata,svg) {
    var counry_data = rawdata.filter(function (d) {
        return d.location == "India";
    });
    var formatted_data = format_data_loss(counry_data);
    var max = formatted_data.reduce(function (prev, current) {
        return (prev.value > current.value) ? prev : current
    })
    var x = d3.scaleBand()
        .domain(d3.extent(formatted_data, function (d) {
            return d.month_year
        }))
        .rangeRound([0, width], .05).padding(0.1);

    var y = d3.scaleLinear()
        .domain([0, max.value])
        .range([height, 0]);

    var xAxis = d3.axisBottom(x)
        .scale(x);

    var yAxis = d3.axisLeft()
        .scale(y);

    console.log(max.value);
    var colors = d3.scaleLinear()
        .domain([0, max.value * .33, max.value * .66, max.value])
        .range(['#f1a129', '#de8917', '#dc5e1e', '#ee232c']);

    x.domain(formatted_data.map(function (d) {
        return d.month_year;
    }));
    y.domain([0, max.value]);

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .style("font", "7px sans-serif")
        .call(xAxis.ticks(null).tickSize(0));


    svg.append("g")
        .attr("class", "y-axis")
        .call(yAxis.ticks(null).tickSize(0));

    svg.selectAll("bar")
        .data(formatted_data)
        .enter().append("rect")
        .style("fill", function (d) {
            return colors(d.value)
        })
        .attr("x", function (d) {
            return x(d.month_year);
        })
        .attr("width", x.bandwidth())
        .attr("y", function (d) {
            return y(d.value);
        })
        .attr("height", function (d) {
            return height - y(d.value);
        });
}

//Function to update the data
function updateChartLossBar(country, rawdata,svg) {
    var counry_data = rawdata.filter(function (d) {
        return d.location == country;
    });
    //     console.log("update ",counry_data);
    var formatted_data = format_data(counry_data);
    var max = formatted_data.reduce(function (prev, current) {
        return (prev.value > current.value) ? prev : current
    })
    var x = d3.scaleBand()
        .domain(d3.extent(formatted_data, function (d) {
            return d.month_year;
        }))
        .rangeRound([0, width], .05).padding(0.1);

    var y = d3.scaleLinear()
        .domain([0, max.value])
        .range([height, 0]);

    var xAxis = d3.axisBottom(x)
        .scale(x);

    var yAxis = d3.axisLeft()
        .scale(y);


    console.log(max.value);
    var colors = d3.scaleLinear()
        .domain([0, max.value * .33, max.value * .66, max.value])
        .range(['#f1a129', '#de8917', '#dc5e1e', '#ee232c']);

    x.domain(formatted_data.map(function (d) {
        return d.month_year;
    }));
    y.domain([0, max.value]);


    svg.select("g.x-axis")
        .transition() // <---- Here is the transition
        .duration(2000) // 2 seconds
        .attr("transform", "translate(0," + height + ")")
        .style("font", "7px sans-serif")
        .call(xAxis.ticks(null).tickSize(0));


    svg.select("g.y-axis")
        .transition() // <---- Here is the transition
        .duration(2000) // 2 seconds
        .call(yAxis.ticks(null).tickSize(0));

    svg.selectAll("rect")
        .data(formatted_data)
        .transition() // <---- Here is the transition
        .duration(2000) // 2 seconds
        .style("fill", function (d) {
            return colors(d.value)
        })
        .attr("x", function (d) {
            return x(d.month_year);
        })
        .attr("width", x.bandwidth())
        .attr("y", function (d) {
            return y(d.value);
        })
        .attr("height", function (d) {
            return height - y(d.value);
        });

    //   console.log("after ",data);
}

function lossOfLifeBar(svg, country) {

 //   document.getElementById("chart-container").innerHTML = "";
/*
    var svg = d3.select("#chart-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
*/

//Read the data
    d3.csv("data/owid-covid-data_test.csv", function (data) {
        // Added dropdown
    //   addDropdown(data,svg);
        /////
        initChartLossBar(data,svg);
    });
}