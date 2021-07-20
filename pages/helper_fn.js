function styleFunction(feature) {
    style.getText().setText(feature.get('label'));
    return style;
}  

function readSingleFile(evt) {
    var f = evt.target.files[0]; 
    if (f && f.type == "text/csv"){
      var r = new FileReader();
      r.onload = function(e) { 
          var contents = e.target.result;
          if(map){
            map.setTarget(null);
          }
          createMap(contents);
      }
      r.readAsText(f);
    } 
    else if (f){
      var r = new FileReader();
      r.onload = function(e) { 
        var contents = e.target.result;
        if(map){
          map.setTarget(null);
        }
        createMap2(contents); 
      }
      r.readAsText(f);
    }
    else { 
      alert("Failed to load file");
    }
  }
