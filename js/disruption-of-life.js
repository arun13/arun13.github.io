
function lifeDisruption(country) {
    document.getElementById("chart-container").innerHTML = "";
    var parseDate = d3.timeParse("%m/%d/%Y");

    var svg = d3.select("#chart-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //Read the data
    d3.csv("data/owid-covid-data_test.csv", function(data) {
    addDropdown(data,svg);
    initChartDisruption(svg,data);

    });
}



function format_data_sti(tobeformatdata)
{
    tobeformatdata.forEach(function (d) {
        d.parsed_date = parseDate(d.date);
        d.sti_index = +d.stringency_index;
        //  console.log(d.location+" "+d.parsed_date+" "+d.sti_index+" "+d.new_cases);
    });
    return tobeformatdata;
}
function transition(path) {
    path.transition()
        .duration(7500)
        .attrTween("stroke-dasharray", tweenDash)
        .on("end", () => { d3.select(this).call(transition); });
}

function tweenDash() {
    const l = this.getTotalLength(),
        i = d3.interpolateString("0," + l, l + "," + l);
    return function(t) { return i(t) };
}
function initChartDisruption(svg,rawdata)
{
    var counry_data = rawdata.filter(function(d){
        return d.location == "France";
    });
    var formatted_data=format_data_sti(counry_data);

    var max_sti = formatted_data.reduce(function (prev, current) {
        return (prev.sti_index > current.sti_index) ? prev : current
    })
    //  console.log(max_new_cases.new_cases);
    //  console.log(max_sti.sti_index);
    var x = d3.scaleTime()
        .domain(d3.extent(formatted_data, function(d) {
            return d.parsed_date }))
        .range([ 0, width ]);

    var y = d3.scaleLinear()
        .domain([0, max_sti.sti_index])
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


    var path_sti = svg.append("path")
        .datum(formatted_data)
        .attr("fill", "none")
        .attr("stroke", '#0d4277')
        .attr("stroke-width", 1.5)
        .attr("class", "sti")
        .attr("d", d3.line()
            .defined(d => !isNaN(d.sti_index))
            .x(function(d) {
                // console.log(d.date);
                // console.log(d.parsed_date);
                // console.log("x",x(d.parsed_date));
                return x(d.parsed_date) })
            .y(function(d) {
                // console.log("y",y_left(+d.new_cases));
                return y(+d.sti_index)
            })
        )
        .call(transition);
}

function updateChartDisruption(country,rawdata,svg){
    var counry_data = rawdata.filter(function(d){
        return d.location == country;
    });
    //     console.log("update ",counry_data);
    var formatted_data=format_data_sti(counry_data);

    var max_sti = formatted_data.reduce(function (prev, current) {
        return (prev.sti_index > current.sti_index) ? prev : current
    })

    var x = d3.scaleTime()
        .domain(d3.extent(formatted_data, function(d) {
            return d.parsed_date }))
        .range([ 0, width ]);


    var y = d3.scaleLinear()
        .domain([0, max_sti.sti_index])
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

    var path_sti_u = svg.select("path.sti")
        .datum(formatted_data)
        .transition() // <---- Here is the transition
        .duration(2000) // 2 seconds
        .attr("fill", "none")
        .attr("stroke", '#0d4277')
        .attr("stroke-width", 1.5)
        .attr("class", "sti")
        .attr("d", d3.line()
            .defined(d => !isNaN(d.sti_index))
            .x(function(d) {

                return x(d.parsed_date) })
            .y(function(d) {
                // console.log("y",y_left(+d.new_cases));
                return y(+d.sti_index)
            })
        );

}

