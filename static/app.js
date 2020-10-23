//Use the D3 library to read in samples.json

// Generate the data for the dropdown menu

function buildCharts(id) {


    d3.json("samples.json").then(function (bacteriaData) {
        let data = bacteriaData;
        let demoData = data.metadata.filter(metaData => metaData.id == id);

        let body = d3.select("#sample-metadata");
        body.html('')


        Object.entries(demoData[0]).forEach(
            ([key, value]) => d3.select("#sample-metadata")
                .append("p").text(`${key}: ${value}`)
        );

        let filterData = bacteriaData.samples.filter(sample => sample.id === id);


        let sampleValues = filterData[0].sample_values.slice(0, 10).reverse();
        let topTenOTU = filterData[0].otu_ids.slice(0, 10).reverse();
        let topTenOTULabels = filterData[0].otu_labels.slice(0, 10).reverse();

        let labelArray = []


        for (let i = 0; i < 10; i++) {
            labelArray.push("OTU " + filterData[0].otu_ids[i])
        }


        let barTrace = {

            x: sampleValues,
            y: labelArray,
            mode: 'markers',
            marker: { size: 16, color: 'green' },
            text: topTenOTULabels,
            type: 'bar',
            orientation: 'h'
        };

        let barData = [barTrace];


        let barLayout = {
            title: "OTU vs Sample Values",
            xaxis: { title: "Sample Values" },
            yaxis: { title: "OTU IDs" },
            showlegend: false,
        };


        Plotly.newPlot("bar", barData, barLayout);


        let bubbleTrace = {

            x: topTenOTU,

            y: sampleValues,
            mode: 'markers',
            marker: {

                size: sampleValues,
                color: topTenOTU,
                opacity: [.5],
            },

            text: topTenOTULabels
        };

        let bubbleData = [bubbleTrace];

        let bubbleLayout = {
            title: 'Marker Size',
            xaxis: { title: "Top 10 OTU" },
            yaxis: { title: "Top 10 OTU Values" },
            showlegend: false,
            height: 600,
            width: 1200
        };

        Plotly.newPlot('bubble', bubbleData, bubbleLayout);
    })
}


function optionChanged(dropDownValue) {
    buildCharts(dropDownValue);
    gauge_chart(dropDownValue)
}

function init() {
    let dropDownButton = d3.select("#selDataset");
    d3.json("samples.json")
        .then(function (bacteriaData) {
            let names = bacteriaData.names

            names.forEach(name => {
                dropDownButton.append("option")
                    .text(name)
                    .attr("value", name)

            })

            bacteriaData.samples.forEach(sampleValues => console.log(sampleValues));


            let demo = bacteriaData.metadata.filter(sample => sample.id)[0];
            console.log(demo);

            Object.entries(demo).forEach(
                ([key, value]) => d3.select("#sample-metadata")
                    .append("p").text(`${key}: ${value}`)
            );

            buildCharts(names[0]);
            gaugeChart(names[0]);

        });
}
init();