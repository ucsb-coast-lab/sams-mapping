// const basemap = new ol.layer.Tile({
//   source: new ol.source.OSM({
//           url: 'maps/map.osm'
//           //url: 'maps/{z}/{x}/{y}.png'
//   })
// });
const basemap = new ol.layer.Tile({ source: new ol.source.OSM() })

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

function createLayer(name, features, style){
  return new ol.layer.Vector({
    source: new ol.source.Vector({
        features: features
    }),
    name: name,
    style: style
  });
}

function addMinMaxGradient(color1, color2, features, mainFeatures, mainFeature){
  var numberOfItems = (math.max(mainFeatures) - math.min(mainFeatures));
  var rainbow = new Rainbow(); 
  rainbow.setNumberRange(1, numberOfItems);
  rainbow.setSpectrum(color1, color2);
  var gradient = [];
  for (var i = 1; i <= numberOfItems; i++) {
      var hexColour = rainbow.colourAt(i);
      gradient.push('#' + hexColour);
  }
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