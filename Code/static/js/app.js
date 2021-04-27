function demographics(sample) {
    d3.json("samples.json").then((data) => {
 
      var demographics= data.metadata;
      var resultsarray= demographics.filter(sampleobject => sampleobject.id == sample);
      var result= resultsarray[0]

      var demographicPanel = d3.select("#sample-metadata");
      demographicPanel.html("");

      Object.entries(result).forEach(([key, value]) => {
        demographicPanel.append("h4").text(`${key}: ${value}`);
      });
    });
}

function plots(sample) {

    d3.json("samples.json").then((data) => {
    var samples= data.samples;
    var resultsarray= samples.filter(sampleobject => sampleobject.id == sample);
    var result= resultsarray[0]

    var ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;

    var Data_Bubble = [
      {
        x: ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          color: ids,
          size: sample_values,
          }
      }
    ];

    var Layout_Bubble = {
      margin: { t: 0 },
      xaxis: { title: "OTU ID" },
    };

    Plotly.plot("bubble", Data_Bubble, Layout_Bubble);

    var bar_data =[
      {
        y:ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
        x:sample_values.slice(0,10).reverse(),
        text:otu_labels.slice(0,10).reverse(),
        type:"bar",
        orientation:"h"

      }
    ];

    var bar_Layout = {
      margin: { t: 20, l: 100 }
    };

    Plotly.newPlot("bar", bar_data, bar_Layout);
  });
}
 
function init() {
    var selector = d3.select("#selDataset");

  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    const firstSample = sampleNames[0];
    plots(firstSample);
    demographics(firstSample);
  });
}

function optionChanged(newSample) {
  plots(newSample);
  demographics(newSample);
}

init();