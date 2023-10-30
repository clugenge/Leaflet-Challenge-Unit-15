//Store our API endpoint as Query URL.
let queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson"

// Once we get a response, send the data.features object to the createFeatures function.
d3.json(queryUrl).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
  });
  // Function to determine marker colour by scale
 
  function getColor(size) {
    if (size <= 10) {
        return 'yellow'; 
    } else if (size <= 30) {
        return 'green'; 
    } else if (size <= 50) {
        return 'orange'; 
    } else if (size <= 70) {
        return 'red'; 
    } else if (size <= 90) {
        return 'violet'; 
    } else {
        return 'black'; 
    }
  }

  function createFeatures(earthquakeData) {


  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);

  }

  
  // Run the onEachFeature function once for each piece of data in the array.
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    // to alter the markers 
    pointToLayer: function(feature, latlng) {

      // Determine the style of markers 
      var markers = {
        radius: feature.properties.mag * 20000,
        fillColor: chooseColor(feature.geometry.coordinates[2]),
        fillOpacity: 0.75,
        color: "white",
        weight: 1
      }
      return L.circle(latlng,markers);
    }
  });

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}


function createMap(earthquakes) {
  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };
// Create an overlay object to hold our overlay.
let overlayMaps = {
  Earthquakes: earthquakes
};

// Create our map, giving it the streetmap and earthquakes layers to display on load.
let myMap = L.map("map", {
  center: [
    37.09, -95.71
  ],
  zoom: 5,
  layers: [street, earthquakes]
});

// Create a layer control.
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap)

let legend = L.control({
    position: "bottomright"
  });
  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");
    let grades = [-10, 10, 30, 50, 70, 90];
    let colors = [
      "yellow",
      "green",
      "orange",
      "red",
      "violet",
      "black"];
   
    for (let i = 0; i < grades.length; i++) {
      div.innerHTML += "<i style='background: "
        + colors[i]
        + "'></i> "
        + grades[i]
        + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };
  // We add our legend to the map.
  legend.addTo(myMap)
  };