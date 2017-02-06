var monitorTab = {
  
  init : function() {
    mapRenderer.init();
    
    var self = this;
    document.getElementById("indoor-button").addEventListener(
      "click",
      function() {
      	controller.setIndoor(true);
        self.updateView();
      });
    document.getElementById("outdoor-button").addEventListener(
      "click",
      function() {
      	controller.setIndoor(false);
        self.updateView();
      });
  },
  
  updateView : function() {
  	if (controller.getIndoor()) {
  		document.getElementById('map-div').style.display = "none";
  		document.getElementById('monitor-bg').style.display = "initial";
  	} else { // Outdoor
  		document.getElementById('monitor-bg').style.display = "none";
  		document.getElementById('map-div').style.display = "initial";
  		var currentPos = controller.getLocationAtTime(gpsPath.getEndTimeSec());
      if (currentPos) {
      	mapRenderer.addDot(currentPos.lat, currentPos.lon, 'PURPLE_DOT');
    	}
  	}
  },
  
  clearAndUpdateView : function() {
    document.getElementById('map-div').style.visibility = "visible";
    mapRenderer.removeAllMarkers();
    mapRenderer.removeAllDots();
    mapRenderer.removeAllSegments();
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
    var distSum = 0; 
    var n = 0;
    if (!gpsPath.isEmpty()) {
      var startTime = gpsPath.getStartTimeSec();
      var stopTime = gpsPath.getEndTimeSec();
      for (var ts = startTime; ts < stopTime; ts = ts + 1) {
        var location = gpsPath.estimateLocation(ts);
        mapRenderer.addDot(location.lat, location.lon, 'PURPLE_DOT');
        var revLocation = controller.getRevolutionBasedLocationAtTime(ts);
        if (revLocation) {
          n = n + 1;
          distSum = distSum + utils.getDistanceFromLatLonInMeter(revLocation.lat, revLocation.lon, location.lat, location.lon);
          mapRenderer.addDot(revLocation.lat, revLocation.lon, 'BLUE_DOT');
          mapRenderer.drawSegment(location, revLocation);
        }
      }
    }
    console.log('distSum: ' + distSum + ', n:' + n);
  },
}