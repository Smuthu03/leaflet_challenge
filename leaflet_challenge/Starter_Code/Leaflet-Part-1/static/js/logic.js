 // Create the base layers.
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})
let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});
   
// Use this link to get the earthquake data.
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(url).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
 // magImpact(data.features);
 return createMap(data)
  //console.log("inside d3 : ", data);
});

function createMap(earthquakes) {
  console.log("inside d3 line14: ", earthquakes);
 d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data1) { 
   
  // console.log("inside create map: ", earthquakes);
  // console.log("inside d3 create map: ", data1);
  // console.log("inside d3 features: ", data1.features);
  // const featurProp = data1.features.properties;
  let latlon = [];
  let depth = [];
  let place1 = [];
  let mag1 = [];
     
         // Loop through the array of ratings
    for (let i =0; i < data1.features.length; i++) {
        
           dep = data1.features[i].geometry.coordinates[2];
           ll = [data1.features[i].geometry.coordinates[1],data1.features[i].geometry.coordinates[0]];
           pl = data1.features[i].properties.place;
           mg = data1.features[i].properties.mag;
       
           latlon.push(ll);
           depth.push(dep);
           place1.push(pl);
           mag1.push(mg);
         }
 
  console.log("depth:", depth);
  console.log("lat:", latlon);
  console.log("place:", place1);
  console.log("MAg:", mag1);
    
  const geojsonMarkerOptions = L.marker( {
    latlng: latlon,
    size : depth,
    fillColor: "#0000FF",
    color:"#0000",
    weight:5,
    opacity: 1,
    fillOpacity:depth,
  } ); 

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.

  var mapdata = L.geoJSON(earthquakes, {
               pointToLayer: function(feature, latlng) {
                console.log("innerll:", latlng);
                    return L.circleMarker(latlng); // Change the marker type here
                        },
                copyright: "USGS Earthquakes",
                marker:geojsonMarkerOptions,
                style: function(feature) {
                //  console.log("mag1 : ", feature.properties.mag);
                  return {
                    radius: Math.sqrt(feature.properties.mag)*10,
                    color: "white",
                    fillColor:"green", // getColor(feature.properties.mag),  
                    fillOpacity: 0.5,                                              
                    weight: 1.5                          
                }
              },
                onEachFeature: onEachFeature
                  });
         
// Binding a popup to each layer
function onEachFeature(feature, layer) {
  layer.bindPopup("<strong>" + feature.properties.place + "</strong><br /><br />Magnituted of eathquake: " +
    feature.properties.mag + "<br /><br />Depth of eathquake magnitude: " + feature.geometry.coordinates[2]);
  };
   // Create a baseMaps object.
   let baseMaps = {
   "Street Map": street,
   "Topographic Map": topo
 };

 // Create an overlay object to hold our overlay.
 let overlayMaps = {
   Earthquakes: mapdata
 };

 let map = L.map("map", {
  center: [ 38.8213348,-122.8069992],
  zoom: 5,
  layers: [street,mapdata]
});
  // Create a layer control. Pass baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);

  // Adding legend to the map.
  var legend = L.control({position: "bottomright"});

  legend.onAdd = function() {
                    var div = L.DomUtil.create('div', 'info legend');
                    var grades = [-10,10,30,50,70,90];
                    var colors = ["#07f616","#06dd14","#05c412","#04ab10","#03920e","#275621"];

                  for (var i = 0; i < grades.length; i++) {
                    div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
                      + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
                  }
                  return div;
                };
  legend.addTo(map);

});
};
