// basemap defined so we can know which layer not to clear
const basemap = new ol.layer.Tile({ source: new ol.source.OSM() })
// const basemap = new ol.layer.Tile({
//   source: new ol.source.OSM({
//     url: 'maps/map_3.png'
//     //url: 'maps/{z}/{x}/{y}.png'
//   })
// });

// create initial openlayers map at a certain center and zoom
function createMap(zoom, center){
  return new ol.Map({
    target: 'map',
    layers: [ basemap ],
    view: new ol.View({
      center: center,
      zoom: zoom
    })
  });
}

// create openlayers layer 
function createLayer(name, features, style){
  return new ol.layer.Vector({
    source: new ol.source.Vector({
        features: features
    }),
    name: name,
    style: style
  });
}

// Uses rainbowvis.js to make a two color gradient
// Also adds the min, max labels, and corresponding colors to the features
function addMinMaxGradient(color1, color2, features, mainFeatures, mainFeature){
  // Creating gradient array with a color hex for each integer value in the mainFeatures range
  var numberOfItems = (math.max(mainFeatures) - math.min(mainFeatures));
  var rainbow = new Rainbow(); 
  rainbow.setNumberRange(1, numberOfItems);
  rainbow.setSpectrum(color1, color2);
  var gradient = [];
  for (var i = 1; i <= numberOfItems; i++) {
      var hexColour = rainbow.colourAt(i);
      gradient.push('#' + hexColour);
  }

  // Assign the color hex values for each feature accordingly
  // Assign correct min and max labels for data
  features.forEach(feature => {
    feature.properties.label = undefined;
    if(mainFeature === "time"){
      let time = new Date(feature.properties[mainFeature]);
      if(time.getTime() === Math.min(...mainFeatures)){
        feature.properties.label = "Min: " + time;
      }else if(time.getTime() === Math.max(...mainFeatures)){
        feature.properties.label = "Max: " + time;
      }
      feature.properties.color = gradient[time.getTime() - math.min(mainFeatures) - 1]
    }
    else{
      if(parseInt(feature.properties[mainFeature]) === Math.min(...mainFeatures)){
        feature.properties.label = "Min: " + feature.properties[mainFeature];
      }else if(parseInt(feature.properties[mainFeature]) === Math.max(...mainFeatures)){
        feature.properties.label = "Max: " + feature.properties[mainFeature];
      }
      feature.properties.color = gradient[feature.properties[mainFeature] - math.min(mainFeatures) - 1];
    }
  });
}