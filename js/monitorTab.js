var monitorTab = {
  
  init : function() {
    mapRenderer.init();
  },
  
  updateView : function(incremental) {
    document.getElementById('map-div').style.visibility = "visible";
    if (!incremental) {
      mapRenderer.removeAllMarkers();
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
    }
    else {    
      var currentPos = controller.getLocationAtTime(gpsPath.getEndTimeSec());
      if (currentPos) {
        mapRenderer.addDot(currentPos.lat, currentPos.lon, 'GREEN_DOT');
      }
    }
    
  },
}