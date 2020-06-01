// leaflet-challenge homework
// Using USGS earthquake data - all earthquakes from the last 7 days

var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
d3.json(queryURL, function(data) {
 
   createFeatures(data.features);
});

function createFeatures(earthquakeData) {

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Call the onEachFeature function below - once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: function (feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
            "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
            "<p> Magnitude: " + feature.properties.mag + "</p>")
        },
         pointToLayer: function (feature, latlng) {
             return new L.circle(latlng, 
                {radius: getSize(feature.properties.mag),
                 fillColor: getColor(feature.properties.mag),
                 fillOpacity: 1,
                 stroke: false,   
            })
        }    
    });

    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
}

function createMap(earthquakes) {

    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "streets-v9",
        accessToken: API_KEY
    });

    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "dark-v10",
        accessToken: API_KEY    
        });

    // Define a baseMaps object to hold our base layers
    var baseMaps = {
        "Street Map": streetmap,
        "Dark Map": darkmap
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
     center: [37.09, -95.71],
     zoom: 5,
    layers: [streetmap, earthquakes]
    });

    // Create a layer control; Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    // Create a legend to display information about the map
    var legend = L.control({position: "bottomright"});

    legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'info legend'),
        magnitudes = [0, 1, 2, 3, 4, 5];

        for (var i = 0; i < magnitudes.length; i++) {
            div.innerHTML += 
              '<i style="background:' + getColor(magnitudes[i]) + '"></i> ' +  
              + magnitudes[i] + (magnitudes[i + 1] ? ' - ' + magnitudes[i + 1] + '<br>' : ' +');
        }
    
        return div;
    };

    legend.addTo(myMap);
}

/* This function controls the color of the data points */ 
function getColor(mag) {
    return mag >= 5 ? "red" :
        mag >= 4 ? "brown" :
        mag >= 3 ? "orange" :
        mag >= 2 ? "yellow" :
        mag >= 1 ? "LightGreen" :
        mag >= 0 ? "aqua" :
        "white";
}
/* This function increases the radius of the data points so they are easier to see */ 
function getSize(mag) {
    return mag * 10000;
}
