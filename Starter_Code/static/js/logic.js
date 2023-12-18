// Define the map
var myMap = L.map("map", {
    center: [37.7749, -122.4194], // Set the initial map center to San Francisco
    zoom: 3, // Set the initial zoom level
  });
  
  // Add a tile layer to the map
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(myMap);
  
  // URL for the earthquake data
  var earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
  
  // Function to determine the color based on depth
  function getColor(depth) {
    return depth > 90
      ? "red"
      : depth > 70
      ? "orange"
      : depth > 50
      ? "yellow"
      : depth > 30
      ? "green"
      : depth > 10
      ? "lightgreen"
      : "darkgreen";
  }
  
  // Function to create markers and bind popups
  function createMarkers(response) {
    // Access the features in the GeoJSON response
    var earthquakes = response.features;
  
    // Loop through each feature
    earthquakes.forEach((earthquake) => {
      // Extract relevant information
      var magnitude = earthquake.properties.mag;
      var depth = earthquake.geometry.coordinates[2];
      var location = earthquake.properties.place;
  
      // Create a marker with a popup
      var marker = L.circleMarker([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]], {
        radius: magnitude * 5, // Adjust the factor as needed
        fillColor: getColor(depth),
        color: "black", // Outline color
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
      }).bindPopup(`<h3>${location}</h3><hr><p>Magnitude: ${magnitude}<br>Depth: ${depth}</p>`);
  
      // Add the marker to the map
      marker.addTo(myMap);
    });
  }
  
  // Perform a GET request to the earthquakeURL
  d3.json(earthquakeURL).then(createMarkers);
  
  // Create a legend
  var legend = L.control({ position: "bottomright" });
  
  legend.onAdd = function () {
    var div = L.DomUtil.create("div", "info legend");
    var depthRanges = [-10, 10, 30, 50, 70, 90];
    var labels = [];
  
    for (var i = 0; i < depthRanges.length; i++) {
      var from = depthRanges[i];
      var to = depthRanges[i + 1];
  
      labels.push(
        '<div class="legend-item" style="background:' +
          getColor(from + 1) +
          '"></div> ' +
          from +
          (to ? "&ndash;" + to : "+")
      );
    }
  
    div.innerHTML = '<div class="legend-title">Depth (km)</div>' + labels.join("<br>");
  
    return div;
  };
  
  // Add legend to the map
  legend.addTo(myMap);
  