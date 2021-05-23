// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
console.log(queryUrl)
// Perform a GET request to the query URL
d3.json(queryUrl).then(function (data) {
    console.log("before call creatFeature");
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
    console.log("after call createFeature");
});

function createFeatures(earthquakeData) {
    //createMap(earthquakes);
    console.log("beginning of createFeatures");

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
        console.log("beginnning onEachFeature");
        layer.bindPopup("<h3>" + feature.properties.place +
            "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
        console.log("end on EachFeature");
    }

    function pointFunction(feature, layer) {
        console.log("beginning of pointFunction")
        // console.log(feature)
        //return L.circleMarker(layer);
        return L.circleMarker(layer, { radius: feature.properties.mag * 10 });
        console.log("end on pointFunction");
    }
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
        //console.log("beginning geoJson");
        onEachFeature: onEachFeature, //add popups
        pointToLayer: pointFunction, // add circles
        style: dotColor
        // console.log("end geoJson");

    });

    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
}

function createMap(earthquakes) {

    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
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
        center: [
            37.09, -95.71
        ],
        zoom: 5,
        layers: [streetmap, earthquakes]
    });

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

}

function getQuakeColor(quake) {
    if (quake > -10 && quake <= 10) {
        return '#008000';
    } else if (quake > 10 && quake <= 30) {
        return '#00FF00';
    } else if (quake > 30 && quake <= 50) {
        return '#FFFF00 ';
    } else if (quake > 50 && quake <= 70) {
        return '#FF4500';
    } else if (quake > 70 && quake <= 90) {
        return '#FFA500';
    } else {
        quake > 90
        return '#8B0000';
    }
}

function dotColor(feature) {
    return {
        fillColor: getQuakeColor(feature.properties.mag)
    };
}



var legend = L.control({
    position: 'bottomright'
});
// legend.onAdd = function createLegend(legend) {
//     var className = 'leaflet-legend';
//     var items = [
//         {color: "green", label: "-10 to 10" },
//         { color: "light green", label: "10 to 30" },
//         { color: "yellow", label: "50 to 70" },
//         { color: "orange", label: "70 to 90" },
//         { color: "light orange", label: "70 to 90" },
//         { color: "red", label: "90 +" }
//     ];
//     var list = L.DomUtil.create('div', className + '-list');
//     items.forEach(function (item) {
//         var div = L.DomUtil.create('div', className + '-item', list);
//         var colorbox = L.DomUtil.create('div', className + '-color', div);
//         colorbox.innerHTML = '&nbsp;';
//         colorbox.style.backgroundColor = item.color;
//         L.DomUtil.create('div', className + '-text', div).innerHTML = item['label'];
//     });
//     return list;
// }

legend.onAdd = function () {
    var div = L.DomUtil.create('div', 'legend');
    var mag = [0, 1, 2, 3, 4, 5];
    var color = ['#008000', '#00FF00', '#FFFF00', '#FF4500', '#FFA500', '#8B0000'];

    for (var k = 0; k < 6; k++) {
        div.innerHTML += "<k style = 'background:" + color[k] + "'></k>" + mag[k] + (mag[k + 1] ? "&ndash;" + mag[k + 1] + "<br>" : "+");

    }
    return div;
};
  
legend.addTo(myMap);