var monitorTab = {
  
  init : function() {
    mapRenderer.init();
  },
  
  
  updateView : function(incremental) {
    document.getElementById('map-div').style.visibility = "visible";
    if (!incremental) {
      mapRenderer.removeAllMarkers();
      // Redraw all ble markers.
      var all_beacons_mac = controller.getBeacons();
      for (var i in all_beacons_mac) {
        var location = controller.getBeaconLocation(all_beacons_mac[i]);
        var marker_type = controller.getBeaconMarkerType(all_beacons_mac[i]);
        // Redraw all gps markers.
        if (location && marker_type) {
          mapRenderer.addMarker(location.lat, location.lon, marker_type);
        } 
      }
    }
    else {    
      var currentPos = controller.getLocationAtTime(gpsPath.getEndTimeSec());
      if (currentPos) {
        //console.log('last: ' + currentPos.lat + ', ' + currentPos.lon);
        mapRenderer.addDot(currentPos.lat, currentPos.lon, 'GREEN_DOT');
      }
    }
    
  },
}