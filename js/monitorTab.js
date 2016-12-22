var monitorTab = {
  
  init : function() {
    mapRenderer.init();
  },
  
  updateView : function() {
    document.getElementById('map-div').style.visibility = "visible";   
    var currentPos = controller.getLocationAtTime(gpsPath.getEndTimeSec());
    if (currentPos) {
      mapRenderer.addDot(currentPos.lat, currentPos.lon, 'PURPLE_DOT');
    }    
  },
  
  clearAndUpdateView : function() {
    document.getElementById('map-div').style.visibility = "visible";
    mapRenderer.removeAllMarkers();
    mapRenderer.removeAllDots();
    // Redraw all ble markers.
    var allBeaconsMac = controller.getAllBeaconsMac();
    for (var i in allBeaconsMac) {
      var location = controller.getBeaconLocation(allBeaconsMac[i]);
      var marker_type = controller.getBeaconMarkerType(allBeaconsMac[i]);
      // Redraw all gps markers.
      if (location && marker_type) {
        mapRenderer.addMarker(location.lat, location.lon, marker_type);
      } 
    }
    // Redraw GPS path
    var startTime = gpsPath.getStartTimeSec();
    var stopTime = gpsPath.getEndTimeSec();
    for (var ts = startTime; ts < stopTime; ts = ts + 1) {
      var location = gpsPath.estimateLocation(ts);
      mapRenderer.addDot(location.lat, location.lon, 'PURPLE_DOT');
      var revLocation = controller.getRevolutionBasedLocationAtTime(ts);
      if (revLocation) {
        //console.log('JJJ ts:' + ts + ', lat:' + revLocation.lat +', lon:' + revLocation.lon);
        //controller.getRevolutionBasedLocationAtTime(ts);
        mapRenderer.addDot(revLocation.lat, revLocation.lon, 'BLUE_DOT');
      }
    }
    // Redraw BLE path  
  },
}