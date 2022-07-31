
function genericView(graphtype) {
    document.getElementById("chart-container").innerHTML = "";
    var svg = d3.select("#chart-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

//Read the data
    d3.csv("data/owid-covid-data_test.csv",
        // When reading the csv, I must format variables:
        function (d) {
            var format_data;
            if(graphtype=="new_cases"){
                format_data={date: d3.timeParse("%m/%d/%Y")(d.date), location: d.location, data_values: d.new_cases};
            }
            if(graphtype=="new_deaths"){
                format_data={date: d3.timeParse("%m/%d/%Y")(d.date), location: d.location, data_values: d.new_deaths};
            }
            if(graphtype=="icu_patients"){
                format_data={date: d3.timeParse("%m/%d/%Y")(d.date), location: d.location, data_values: d.icu_patients};
            }
            if(graphtype=="daily_life_disrupion"){
                format_data={date: d3.timeParse("%m/%d/%Y")(d.date), location: d.location, data_values: d.stringency_index};
            }
            return format_data
        },
        // Now I can use this dataset:
        function (data) {
            // group the data: I want to draw one line per group
            var nested_data = d3.nest() // nest function allows to group the calculation per level of a factor
                .key(function (d) {
                    return d.location;
                })
                .entries(data);

            // Add X axis --> it is a date format
            var x = d3.scaleTime()
                .domain(d3.extent(data, function (d) {
                    return d.date
                }))
                .range([0, width]);
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b%y")).ticks(17));

            // Add Y axis
            var y = d3.scaleLinear()
                .domain([0, d3.max(data, function (d) {
                    return +d.data_values;
                })])
                .range([height, 0]);
            svg.append("g")
                .call(d3.axisLeft(y));

            // color palette
            var res = nested_data.map(function (d) {
                return d.key
            }) // list of group names
            var color = d3.scaleOrdinal()
                .domain(res)
                .range(d3['schemeCategory10'])
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
                tooltip
                    .text(d.key)
                    .style("left", (d3.mouse(this)[0] + 70) + "px")
                    .style("top", (d3.mouse(this)[1]) + "px")
            }
            var mouseleave = function (d) {
                tooltip
                    .style("opacity", 0)
            }


            // add the squares
            svg.selectAll()
                .data(data, function (d) {
                    return d.group + ':' + d.variable;
                })

            // Draw the line
            var generic_svg = svg.selectAll(".line")
                .data(nested_data)
                .enter();

            generic_svg.append("path")
                .attr("fill", "none")
                .attr("stroke", function (d) {
                    return color(d.key)
                })
                .attr("stroke-width", 1.5)
                .attr("d", function (d) {
                    return d3.line()
                        .x(function (d) {
                            return x(d.date);
                        })
                        .y(function (d) {
                            return y(+d.data_values);
                        })
                        (d.values)
                })
                ///mouse over
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave);

            //  Legends
            var legend = generic_svg
                .append("g")
                .attr("class", "legend");

            legend.append("circle")
                .attr("cx", 50)
                .attr('cy', (d, i) => i * 30 + 20)
                .attr("r", 6)
                .style("fill", d => color(d.key))

            legend.append("text")
                .attr("x", 70)
                .attr("y", (d, i) => i * 30 + 25)
                .text(d => d.key)

            // Features of the annotation
            const annotations = [
                {
                    note: {
                        label: "This is the spike related to Omnicron strain",
                        title: "Omnicron Strain",
                        align: "right"

                    },
                    color: ["black"],
                    type: d3.annotationCalloutCircle,
                    x: 650,
                    y: 300,
                    dy: -90,
                    dx: -100,
                    subject: {radius: 50, radiusPadding: 5},
                },

                {
                    note: {
                        label: "This is the spike related to Delta strain",
                        title: "Delta Strain",
                        align: "right"

                    },
                    color: ["black"],
                    type: d3.annotationCalloutCircle,
                    x: 420,
                    y: 390,
                    dy: -90,
                    dx: -100,
                    subject: {radius: 50, radiusPadding: 5},
                }
            ]

            // Add annotation to the chart
            const makeAnnotations = d3.annotation()
                .annotations(annotations)
            generic_svg
                .append("g")
                .call(makeAnnotations)
        })
}