//Store our API endpoint as Query URL.
let queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson"


d3.json(queryURL).then(function (data) {
  
  createFeatures(data.features);
});
// Function to determine marker colour by scale

function chooseColor(scale){
if (scale < 10) return "#98EE00";
else if (scale < 30) return "#D4EE00";
else if (scale < 50) return "#EECC00";
else if (scale < 70) return "#EE9C00";
else if (scale < 90) return "#EA2C2C";
else return "#FF0000";
}

function createFeatures(earthquakeData) {

// Define a function that we want to run once for each feature in the features array.
// Give each feature a popup that describes the place and time of the earthquake.
function onEachFeature(feature, layer) {
  layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);

}

// Create a GeoJSON layer that contains the features array on the earthquakeData object.
// Run the onEachFeature function once for each piece of data in the array.
let earthquakes = L.geoJSON(earthquakeData, {
  onEachFeature: onEachFeature,
 
  pointToLayer: function(feature, latlng) {

    // Determine the style of markers based on properties
    var markers = {
      radius: feature.properties.mag * 20000,
      fillColor: chooseColor(feature.geometry.coordinates[2]),
      fillOpacity: 1,
      color: "white",
      weight: 1
    }
    return L.circle(latlng,markers);
  }
});


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
// Pass it our baseMaps and overlayMaps.
// Add the layer control to the map.
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
    "#98EE00",
    "#D4EE00",
    "#EECC00",
    "#EE9C00",
    "#EA822C",
    "#EA2C2C"];
  // Loop through our intervals and generate a label with a colored square for each interval.
  for (let i = 0; i < grades.length; i++) {
    div.innerHTML += "<i style='background: "
      + colors[i]
      + "'></i> "
      + grades[i]
      + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
  }
  return div;
};
// Add our legend to the map.
legend.addTo(myMap)
};
