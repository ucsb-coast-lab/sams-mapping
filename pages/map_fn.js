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

function createLayer(features, style){
  return new ol.layer.Vector({
    source: new ol.source.Vector({
        features: features
    }),
    name: 'Data',
    style: style
  });
}

function addMinMaxGradient(color1, color2, features, depths){
  var numberOfItems = (math.max(depths) - math.min(depths));
  var rainbow = new Rainbow(); 
  rainbow.setNumberRange(1, numberOfItems);
  rainbow.setSpectrum(color1, color2);
  var gradient = [];
  for (var i = 1; i <= numberOfItems; i++) {
      var hexColour = rainbow.colourAt(i);
      gradient.push('#' + hexColour);
  }
  features.forEach(feature => {
    if(parseInt(feature.properties.depth) === Math.min(...depths)){
      feature.properties.label = "Min: " + feature.properties.depth;
    }else if(parseInt(feature.properties.depth) === Math.max(...depths)){
      feature.properties.label = "Max: " + feature.properties.depth;
    }
    feature.properties.color = gradient[feature.properties.depth - math.min(depths)];
  });
}