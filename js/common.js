
function addDropdown() {
    //Read the data
    d3.csv("data/owid-covid-data_test.csv", function(dropdowndata) {

    rawdatadropdown=  dropdowndata;
    var countries_data = d3.nest() // nest function allows to group the calculation per level of a factor
        .key(function (d) {
            return d.location;
        })
        .entries(dropdowndata);

    var select = d3.select('#country_selection')
        .append('select')
        // .attr('class','select')
        .attr('class', 'box')
        .on('change', onchange)


/*    select.append('option')
            .text("Default");*/
    var optionGroup = select
        .selectAll('option')
        .data(countries_data).enter();

    var selected = optionGroup.append('option')
        .text(function (d) {
            return d.key;
        });

        selected.property("selected", function (d) {
            //return false;
            return d.key==="India"
        })

        selectValue = d3.select('select').property('value');
        document.getElementById("dropdown_country").value = selectValue;
     //   alert(document.getElementById("dropdown_country").value);
    });
    function onchange() {

        d3.csv("data/owid-covid-data_test.csv", function (rawdatadropdown) {

            selectValue = d3.select('select').property('value');
            document.getElementById("dropdown_country").value = selectValue;
            var chart_selected = document.getElementById("chart_selected").value;
            var chart_type = document.getElementById("chart_type").value;

           // var svg = document.getElementById("svg_value").value
            console.log("update triggered and country is "+ selectValue);
            console.log(running_svg);
            // alert(document.getElementById("dropdown_country").value);
            // console.log("before ",data);
            //  updateChartLossBar(selectValue, rawdatadropdown,svg);
            //  updateChartLossLine(selectValue, rawdatadropdown,svg)
            //  updateChartDisruption(selectValue, rawdatadropdown,svg)
            //  updateChartLossLine(selectValue, rawdatadropdown,svg)
            //  updateChartICULine(selectValue, rawdatadropdown,svg)
            //  updateChartNewLine(selectValue, rawdatadropdown,svg)
            //  updateChartNewBar(selectValue, rawdatadropdown,svg)
            if (chart_selected === "cases-per-day") {
                if (chart_type === "bar") {
                    updateChartNewBar(selectValue, rawdatadropdown, running_svg);
                }
                if (chart_type === "line") {
                    updateChartNewLine(selectValue, rawdatadropdown, running_svg);
                }
            }

            if (chart_selected === "loss-of-life") {
                if (chart_type === "bar") {
                    updateChartLossBar(selectValue, rawdatadropdown, running_svg);
                }
                if (chart_type === "line") {
                    updateChartLossLine(selectValue, rawdatadropdown, running_svg);
                }
            }

            if (chart_selected === "icu-patient") {
                if (chart_type === "bar") {
                    updateChartIcuBar(selectValue, rawdatadropdown, running_svg);
                }
                if (chart_type === "line") {
                    updateChartICULine(selectValue, rawdatadropdown, running_svg);
                }
            }
            if (chart_selected === "daily-life-disruption") {
                updateChartDisruption(selectValue, rawdatadropdown, running_svg);
            }
        })
    }
}
