function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];
        console.log(result);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var top10otu_ids = otu_ids.slice(0,10);
    console.log(top10otu_ids);

    var top10otu_labels = otu_labels.slice(0,10);
    console.log(top10otu_labels);

    var top10sample_values = sample_values.slice(0,10);
    console.log(top10sample_values);

    var yticks_string = top10otu_ids.map(String);

    var yticks = yticks_string.map(i => 'OTU ' + i);
    console.log(yticks); 

    var xticks = top10sample_values.reverse();

    // 8. Create the trace for the bar chart. 
    var trace = {
        x: xticks,
        y: yticks.reverse(),
        type: "bar",
        orientation: 'h'
    };

    var data = [trace];
    // 9. Create the layout for the bar chart. 
     var layout = {
         title: "Top 10 Bacteria Found",
         xaxis: { title: "Count of Bacteria in your Belly Button" },
         yaxis: { title: "Bacteria ID" }
     };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar-plot", data, layout);

    // Use d3.json to load and retrieve the samples.json file 
    // d3.json("samples.json").then((data) => {

    // 1. Create the trace for the bubble chart.
    var bubbleData = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
            size: sample_values,
            sizeref: .05,
            color: otu_ids,
            sizemode: 'area'
        }
    
    };

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
        title: 'Bacteria Cultures Per Sample',
        xaxis: {
            title: {
                text: "OTU IDs",
            }
        },
        showlegend: false,
        height: 400,
        width: 800
    };

    //// Deliverable 3 ////

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        console.log(metadata);
        var metadataArray = metadata.filter(metadataObj => metadataObj.id == sample);
        // 2. Create a variable that holds the first sample in the metadata array.
        var firstResult = metadataArray[0];
            console.log(firstResult);
   
        // Create variables that hold the otu_ids, otu_labels, and sample_values.

        // 3. Create a variable that holds the washing frequency.
        var wfreq = firstResult.wfreq;
            console.log(wfreq);    
        
        // 4. Create the trace for the gauge chart.
        var gaugeData = [
            {
                domain: { x: [0,1], y: [0,1] },
                value: wfreq,
                title: { text: "Belly Button Washing Frequency/Week" },
                type: "indicator",
                mode: "gauge+number",
                gauge: {
                     axis: { range: [0,10], tickwidth: 1 },
                     steps: [
                        { range: [0,2], color: "red" },
                        { range: [2,4], color: "orange"},
                        { range: [4,6], color: "yellow"},
                        { range: [6,8], color: "lightgreen"},
                        { range: [8,10], color: "green"},
                     ],
                     threshold: {
                         line: { color: "black", width: 4 },
                         thickness: 0.75,
                         value: 200
                     }
                    }
            }
        ];
        // 5. Create the layout for the gauge chart.
        var gaugeLayout = {
            value: {
                tickmode: "linear",
                tick0: 0,
                dtick: 2,
            },
            width: 400,
            height: 300,
            margin: { t: 30, r: 50, l: 50, b: 30 },
            paper_bgcolor: "white",
            font: { color: "black", family: "Arial" }
          };

        // 6. Use Plotly to plot the gauge data and layout.
        Plotly.newPlot("gauge", gaugeData, gaugeLayout);
        Plotly.newPlot("bubble-plot", [bubbleData], bubbleLayout); 

    });
});
    

}
