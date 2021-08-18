function deleteFile(name){
    map.getLayers().getArray()
        .filter(layer => layer.get('name') === name)
        .forEach(layer => map.removeLayer(layer))
    var file = document.getElementById(name);
    file.parentNode.removeChild(file);
}

function hideFile(name){
    var file = document.getElementById(name);
    var radio = file.childNodes[2];
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
            alert("All points have the same value for " + newFeature + "\nMin value being displayed is incorrect");
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
      var file = document.getElementById(name);
      file.childNodes[12].innerHTML = "Min: " + Math.min(...mainFeatures);
      file.childNodes[13].innerHTML = "Max: " + Math.max(...mainFeatures);
      file.childNodes[14].innerHTML = "Mean: " + Math.round(mainFeatures.reduce((a, b) => parseInt(a) + parseInt(b), 0) / mainFeatures.length);
      if(newFeature === "time"){
        var ampm = (new Date(Math.min(...mainFeatures)).toLocaleTimeString()).substring(9,11);
        file.childNodes[12].innerHTML = "Min: " + (new Date(Math.min(...mainFeatures)).toLocaleTimeString()).substring(0,5);
        file.childNodes[13].innerHTML = "Max: " + (new Date(Math.max(...mainFeatures)).toLocaleTimeString()).substring(0,5);
        file.childNodes[14].innerHTML = "Mean: " + (new Date(Math.round(mainFeatures.reduce((a, b) => parseInt(a) + parseInt(b), 0) / mainFeatures.length)).toLocaleTimeString()).substring(0,5);
      }
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
        });
    }
}

function addFileRow(inputName, features, mainFeatures){
    var dataColumn = document.getElementById("dataColumn");
    var newDataFile = document.createElement("div");
    newDataFile.setAttribute("id", inputName);
    newDataFile.setAttribute("class", "dataFile");

    var fileName = document.createElement("h4");
    let displayName = inputName;
    // if(displayName.length > 25){
    //   displayName = inputName.substring(0, 20) + "..." + inputName.substring(inputName.length - 4);
    // }
    fileName.innerHTML = displayName;
    newDataFile.appendChild(fileName);

    var hideLabel = document.createElement("label");
    hideLabel.innerHTML = "Hide: ";
    newDataFile.appendChild(hideLabel);
    var hideButton = document.createElement("input");
    hideButton.setAttribute("type", "checkbox");
    hideButton.setAttribute("checked", "checked");
    hideButton.onclick = function() {hideFile(inputName)};
    newDataFile.appendChild(hideButton);

    var deleteLabel = document.createElement("label");
    deleteLabel.innerHTML = "Delete: ";
    newDataFile.appendChild(deleteLabel);
    var deleteButton = document.createElement("button");
    deleteButton.innerHTML = " X ";
    deleteButton.onclick = function() {deleteFile(inputName)};
    newDataFile.appendChild(deleteButton);


    var featureLabel = document.createElement("label");
    featureLabel.innerHTML = "Features: ";
    newDataFile.appendChild(featureLabel);
    var featureSelector = document.createElement("select");
    for(x in features[0].properties){
        var option = document.createElement("option");
        option.text = x;
        featureSelector.add(option);
    }
    featureSelector.onchange = function() {changeGradientOrFeature(inputName, gradientSelector.value, featureSelector.value, minMaxSelector.value)}
    newDataFile.appendChild(featureSelector);

    var gradientLabel = document.createElement("label");
    gradientLabel.innerHTML = "Data Color Gradient: ";
    newDataFile.appendChild(gradientLabel);
    var gradientSelector = document.createElement("select");
    var gradientColors = ["blue,orange", "red,green", "yellow,indigo", "red,blue", "purple,green", "lightsteelblue,darkblue", "lightpink,darkred", "palegreen,darkgreen", "plum,indigo"];
    for(x in gradientColors){
        var option = document.createElement("option");
        option.text = gradientColors[x];
        gradientSelector.add(option);
    }
    gradientSelector.selectedIndex = dataColumn.childNodes.length;
    gradientSelector.onchange = function() {changeGradientOrFeature(inputName, gradientSelector.value, featureSelector.value, minMaxSelector.value)}
    newDataFile.appendChild(gradientSelector);

    var minMaxColorLabel = document.createElement("label");
    minMaxColorLabel.innerHTML = "Min Max Color: ";
    newDataFile.appendChild(minMaxColorLabel);
    var minMaxColors = ["white", "black", "red", "green", "blue", "orange", "purple", "yellow"];
    var minMaxSelector = document.createElement("select");
    for(x in minMaxColors){
        var option = document.createElement("option");
        option.text = minMaxColors[x];
        minMaxSelector.add(option);
    }
    minMaxSelector.onchange = function() {changeMinMaxColor(inputName, minMaxSelector.value)}
    newDataFile.appendChild(minMaxSelector);

    var lineBreak = document.createElement("br");
    newDataFile.appendChild(lineBreak);
    var min = document.createElement("p");
    min.innerHTML = "Min: " + Math.min(...mainFeatures);
    newDataFile.appendChild(min);

    var max = document.createElement("p");
    max.innerHTML = "Max: " + Math.max(...mainFeatures);
    newDataFile.appendChild(max);

    var mean = document.createElement("p");
    mean.innerHTML = "Mean: " + Math.round(mainFeatures.reduce((a, b) => parseInt(a) + parseInt(b), 0) / mainFeatures.length);
    newDataFile.appendChild(mean);

    var dataColumn = document.getElementById("dataColumn");
    dataColumn.appendChild(newDataFile);

    if(featureSelector.value === "time"){
      var ampm = (new Date(Math.min(...mainFeatures)).toLocaleTimeString()).substring(9,11);
      min.innerHTML = "Min: " + (new Date(Math.min(...mainFeatures)).toLocaleTimeString()).substring(0,5);
      max.innerHTML = "Max: " + (new Date(Math.max(...mainFeatures)).toLocaleTimeString()).substring(0,5);
      mean.innerHTML = "Mean: " + (new Date(Math.round(mainFeatures.reduce((a, b) => parseInt(a) + parseInt(b), 0) / mainFeatures.length)).toLocaleTimeString()).substring(0,5);
    }
}