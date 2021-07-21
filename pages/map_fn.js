function createMap(zoom, center){
  return new ol.Map({
    target: 'map',
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ],
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
    style: style
  });
}