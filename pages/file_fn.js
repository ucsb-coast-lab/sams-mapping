function deleteFile(name){
    map.getLayers().getArray()
        .filter(layer => layer.get('name') === name)
        .forEach(layer => map.removeLayer(layer))
    var row = document.getElementById(name);
    row.parentNode.removeChild(row);
}

function hideFile(name){
    var row = document.getElementById(name);
    var radio = row.cells[1].childNodes[0];
    if (radio.getAttribute("checked") === "checked")
    {
        radio.setAttribute("checked", "unchecked");
        map.getLayers().getArray()
        .filter(layer => layer.get('name') === name)
        .forEach(layer => layer.setVisible(false));
    }
    else{
        radio.setAttribute("checked", "checked");
        map.getLayers().getArray()
        .filter(layer => layer.get('name') === name)
        .forEach(layer => layer.setVisible(true));
    }
}

function changeGradientOrFeature(name, colors, newFeature, minMaxColor){
    let layers = map.getLayers().getArray()
        .filter(layer => layer.get('name') === name);
    if(layers.length > 1){
      alert("Two layers are named " + name)
    }else if(layers.length === 0){
      alert("No layers found with the name: " + name)
    }else{
      let color1 = colors.substring(0,colors.indexOf(","));
      let color2 = colors.substring(colors.indexOf(",")+1);
      var writer = new ol.format.GeoJSON();
      let source = layers[0].getSource();
      let feats = source.getFeatures();
      let geojson = writer.writeFeatures(feats);
      let features = JSON.parse(geojson).features;
      let mainFeatures = [];
      features.forEach(feature => {
        mainFeatures.push(feature.properties[newFeature]);
      })
      //work around to make a second value for confidence feature array 
      //also stops error when all values are the same 
      for(i in mainFeatures){
        if(mainFeatures[i] !== mainFeatures[0]){
            break;
        }else if(parseInt(i) === mainFeatures.length-1){
            mainFeatures.push(mainFeatures[0]-2);
            alert("All points have the same value for " + newFeature + "\n Min value being displayed is incorrect");
        }
      }
      //work around to format time and confidence features 
      if(newFeature === "time"){
        for(i in mainFeatures){
            let time = new Date(mainFeatures[i]);
            mainFeatures[i] = time.getTime();
        }
      }
      addMinMaxGradient(color1, color2, features, mainFeatures, newFeature);
      for(f in feats){
        if(features[f].properties.label !== undefined){
          features[f].properties.color = minMaxColor;
        }
        feats[f].setStyle(
          new ol.style.Style({
            image: new ol.style.Circle({
              radius: 2,
              fill: new ol.style.Fill({color: features[f].properties.color}),
            }),
            text: new ol.style.Text({
              text: features[f].properties.label,
              offsetY: -10,
              scale: 1,
              fill: new ol.style.Fill({
                color: minMaxColor,
              })
            })
          }),
        );
        feats[f].set("color", features[f].properties.color);
        feats[f].set("label", features[f].properties.label);
      }
      var row = document.getElementById(name);
      row.cells[5].innerHTML = Math.min(...mainFeatures);
      row.cells[6].innerHTML = Math.max(...mainFeatures);
      row.cells[8].innerHTML = Math.round(mainFeatures.reduce((a, b) => parseInt(a) + parseInt(b), 0) / mainFeatures.length);
    }
}

function changeMinMaxColor(name, color){
    let layers = map.getLayers().getArray()
        .filter(layer => layer.get('name') === name);
    if(layers.length > 1){
      alert("Two layers are named " + name)
    }else if(layers.length === 0){
      alert("No layers found with the name: " + name)
    }else{
      layers[0].getSource().getFeatures().forEach(f => {
          if(f.get("label") !== undefined){
            f.setStyle(
                new ol.style.Style({
                  image: new ol.style.Circle({
                    radius: 2,
                    fill: new ol.style.Fill({color: color}),
                  }),
                  text: new ol.style.Text({
                    text: f.get("label"),
                    offsetY: -10,
                    scale: 1,
                    fill: new ol.style.Fill({
                      color: color,
                    })
                  })
                }),
              )
          }
        })

    }
}

function addFileRow(inputName, features, mainFeatures){
    var table = document.getElementById("inputTable");
        var row = table.insertRow();
        row.setAttribute("id", inputName);
        var remove = row.insertCell(0);
        var hide = row.insertCell(1)
        var fileName = row.insertCell(2);
        var featureSelector = row.insertCell(3);
        var gradientSelector = row.insertCell(4);
        var min = row.insertCell(5);
        var max = row.insertCell(6);
        var minMaxColorSelector = row.insertCell(7);
        var mean = row.insertCell(8);
        hideButton = document.createElement("input");
        hideButton.setAttribute("type", "checkbox");
        hideButton.setAttribute("checked", "checked");
        hideButton.onclick = function() {hideFile(inputName)};
        hide.appendChild(hideButton);
        deleteButton = document.createElement("button");
        deleteButton.innerHTML = " X ";
        deleteButton.onclick = function() {deleteFile(inputName)};
        remove.appendChild(deleteButton);
        fileName.innerHTML = inputName;
        var fselector = document.createElement("select");
        for(x in features[0].properties){
          var option = document.createElement("option");
          option.text = x;
          fselector.add(option);
        }
        fselector.onchange = function() {changeGradientOrFeature(inputName, gselector.value, fselector.value, minMaxSelector.value)}
        featureSelector.appendChild(fselector);
        var gselector = document.createElement("select");
        var gradientColors = ["blue,orange", "red,green", "yellow,indigo", "red,blue", "purple,green", "lightsteelblue,darkblue", "lightpink,darkred", "palegreen,darkgreen", "plum,indigo"];
        for(x in gradientColors){
          var option = document.createElement("option");
          option.text = gradientColors[x];
          gselector.add(option);
        }
        gselector.selectedIndex = row.rowIndex;
        gselector.onchange = function() {changeGradientOrFeature(inputName, gselector.value, fselector.value, minMaxSelector.value)}
        gradientSelector.appendChild(gselector);
        min.innerHTML = Math.min(...mainFeatures);
        max.innerHTML = Math.max(...mainFeatures);
        var minMaxColors = ["white", "black", "red", "green", "blue", "orange", "purple", "yellow"];
        var minMaxSelector = document.createElement("select");
        for(x in minMaxColors){
          var option = document.createElement("option");
          option.text = minMaxColors[x];
          minMaxSelector.add(option);
        }
        minMaxSelector.onchange = function() {changeMinMaxColor(inputName, minMaxSelector.value)}
        minMaxColorSelector.appendChild(minMaxSelector);
        mean.innerHTML = Math.round(mainFeatures.reduce((a, b) => parseInt(a) + parseInt(b), 0) / mainFeatures.length);
}