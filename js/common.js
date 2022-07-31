
function addDropdown(rawdatadropdown,svg) {

    var countries_data = d3.nest() // nest function allows to group the calculation per level of a factor
        .key(function (d) {
            return d.location;
        })
        .entries(rawdatadropdown);

    var select = d3.select('#country_selection')
        .append('select')
        // .attr('class','select')
        .attr('class', 'box')
        .on('change', onchange)

    select
        .selectAll('option')
        .data(countries_data).enter()
        .append('option')
        .attr("selected", function (d) {
            return d === "India"
        })
        .text(function (d) {
            return d.key;
        });

    function onchange() {
        selectValue = d3.select('select').property('value')
        //console.log("before ",data);
      //  updateChartLoss(selectValue, rawdatadropdown,svg);
      //  updateChartDisruption(selectValue, rawdatadropdown,svg)
     //   updateChartLossLine(selectValue, rawdatadropdown,svg)
    //    updateChartICULine(selectValue, rawdatadropdown,svg)
    //    updateChartNewLine(selectValue, rawdatadropdown,svg)
     //   updateChartNewBar(selectValue, rawdatadropdown,svg)
        updateChartIcuBar(selectValue, rawdatadropdown,svg)
    }
}
