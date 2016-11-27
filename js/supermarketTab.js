var supermarketTab = {
  
  init : function() {
    mapRenderer.init();
  },
  
  updateView : function() {
    console.log('length: ' + controller.path.length);
    var currentPos = controller.path[controller.path.length - 1];
    
    console.log('last: ' + currentPos.lat + ', ' + currentPos.lon);
    mapRenderer.addMarker(currentPos.lat, currentPos.lon);
  },

}