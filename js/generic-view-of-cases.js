
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
            if(graphtype==="new_cases"){
                format_data={date: d3.timeParse("%m/%d/%Y")(d.date), location: d.location, data_values: d.new_cases};
                svg.append("text")
                    .attr("x", width/2)
                    .attr("y", 15)
                    .attr("text-anchor", "middle")
                    .style("font-size", "16px")
                    .style("font-family", "Verdana")
                    .style("font-weight", "bold")
                    .text("New Infections");

            }
            if(graphtype==="new_deaths"){
                format_data={date: d3.timeParse("%m/%d/%Y")(d.date), location: d.location, data_values: d.new_deaths};
                svg.append("text")
                    .attr("x", width/2)
                    .attr("y", 15)
                    .attr("text-anchor", "middle")
                    .style("font-size", "16px")
                    .style("font-family", "Verdana")
                    .style("font-weight", "bold")
                    .text("Deceased Patients");

            }
            if(graphtype==="icu_patients"){
                format_data={date: d3.timeParse("%m/%d/%Y")(d.date), location: d.location, data_values: d.icu_patients};
                svg.append("text")
                    .attr("x", width/2)
                    .attr("y", 15)
                    .attr("text-anchor", "middle")
                    .style("font-size", "16px")
                    .style("font-family", "Verdana")
                    .style("font-weight", "bold")
                    .text("ICU Patients");

            }
            if(graphtype==="daily_life_disrupion"){
                format_data={date: d3.timeParse("%m/%d/%Y")(d.date), location: d.location, data_values: d.stringency_index};
                svg.append("text")
                    .attr("x", width/2)
                    .attr("y", 15)
                    .attr("text-anchor", "middle")
                    .style("font-size", "16px")
                    .style("font-family", "Verdana")
                    .style("font-weight", "bold")
                    .text("Stringency Index");
/*                svg.append("text")
                    .attr("transform", "translate(" + (width/2) + " ," + (height+30) + ")")
                    .style("text-anchor", "middle")
                    .text("Month Year");

                svg.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("x", -(height/2))
                    .attr("y", -50)
                    .style("text-anchor", "middle")
                    .text("Stringency Index Representing Closures of Business,schools etc");*/
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
                    .style("left", (d3.mouse(this)[0] + 290) + "px")
                    .style("top", (d3.mouse(this)[1]+150) + "px")
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
                .attr("cx", 776)
                .attr('cy', (d, i) => i * 30 + 20)
                .attr("r", 6)
                .style("fill", d => color(d.key))

            legend.append("text")
                .attr("x", 783)
                .attr("y", (d, i) => i * 30 + 25)
                .text(d => d.key)

            // Features of the annotation
            const new_cases_annotations = [
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
                    dy: -100,
                    dx: -100,
                    subject: {radius: 50, radiusPadding: 5},
                }
                ,

                {
                    note: {
                        label: "This is the spike related to Alpha strain",
                        title: "Alpha Strain",
                        align: "right"

                    },
                    color: ["black"],
                    type: d3.annotationCalloutCircle,
                    x: 310,
                    y: 390,
                    dy: -90,
                    dx: -150,
                    subject: {radius: 50, radiusPadding: 5},
                }
            ]

            const new_deaths_annotations = [
                {
                    note: {
                        label: "World Saw Maximum deaths in the beginning of 2021 year",
                        title: "Maximum Death Toll observed",
                        align: "right"

                    },
                    color: ["black"],
                    type: d3.annotationCalloutCircle,
                    x: 320,
                    y: 100,
                    dy: 70,
                    dx: -80,
                    subject: {radius: 80, radiusPadding: 5},
                }
            ]
            const icu_cases_annotations = [
                {
                    note: {
                        label: "In United States 1st wave of ICU patients",
                        title: "United States 1st Major covid wave",
                        align: "right"

                    },
                    color: ["black"],
                    type: d3.annotationCalloutCircle,
                    x: 320,
                    y: 60,
                    dy: 10,
                    dx: -80,
                    subject: {radius: 60, radiusPadding: 5},
                },

                {
                    note: {
                        label: "In United States 2nd wave of ICU patients",
                        title: "United States 2nd Major covid wave",
                        align: "right"

                    },
                    color: ["black"],
                    type: d3.annotationCalloutCircle,
                    x: 530,
                    y: 70,
                    dy: 70,
                    dx: -100,
                    subject: {radius: 50, radiusPadding: 5},
                },

                {
                    note: {
                        label: "In United States 3rd wave of ICU patients",
                        title: "United States 3rd Major covid wave",
                        align: "right"

                    },
                    color: ["black"],
                    type: d3.annotationCalloutCircle,
                    x: 650,
                    y: 70,
                    dy: 90,
                    dx: -50,
                    subject: {radius: 50, radiusPadding: 5},
                }
            ]

            const lockdown_annotations = [
                {
                    note: {
                        label: "Business started coming back to normal",
                        title: "Back to normal",
                        align: "right"

                    },
                    color: ["black"],
                    type: d3.annotationCalloutCircle,
                    x: 750,
                    y: 250,
                    dy: 30,
                    dx: -100,
                    subject: {radius: 80, radiusPadding: 5},
                },

                {
                    note: {
                        label: "when every country started shutting down business,schools, airports to contain virus",
                        title: "Starting of lockdowns",
                        align: "left"

                    },
                    color: ["black"],
                    type: d3.annotationCalloutCircle,
                    x: 60,
                    y: 390,
                    dy: -2,
                    dx: 130,
                    subject: {radius: 50, radiusPadding: 5},
                }
            ]
            // Add annotation to the chart
            if(graphtype==="new_cases") {
                const makeAnnotations = d3.annotation()
                    .annotations(new_cases_annotations)
                generic_svg
                    .append("g")
                    .call(makeAnnotations)
            }
            if(graphtype==="new_deaths") {
                const makeAnnotations = d3.annotation()
                    .annotations(new_deaths_annotations)
                generic_svg
                    .append("g")
                    .call(makeAnnotations)
            }

            if(graphtype==="icu_patients") {
                const makeAnnotations = d3.annotation()
                    .annotations(icu_cases_annotations)
                generic_svg
                    .append("g")
                    .call(makeAnnotations)
            }

            if(graphtype==="daily_life_disrupion") {
                const makeAnnotations = d3.annotation()
                    .annotations(lockdown_annotations)
                generic_svg
                    .append("g")
                    .call(makeAnnotations)
            }
        })
}