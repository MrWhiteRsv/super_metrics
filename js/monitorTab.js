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
  		document.getElementById('monitor-plan').style.display = "initial";
   		document.getElementById('monitor-bg').style.display = "initial";
  		this.drawPlanBackground();
  		var latestPixel = controller.getLatestCartPixel();
  		this.drawCart(latestPixel['px'], latestPixel['py']);
  	} else { // Outdoor
  		document.getElementById('monitor-plan').style.display = "none";
  		document.getElementById('monitor-bg').style.display = "none";
  		document.getElementById('map-div').style.display = "initial";
  		var currentPos = controller.getLocationAtTime(gpsPath.getEndTimeSec());
      if (currentPos) {
      	mapRenderer.addDot(currentPos.lat, currentPos.lon, 'PURPLE_DOT');
    	}
  	}
  },
  
  /**
   * Draw plan, including beacons and backkground.
   * @param {Beacons} beacons. The beacons to be displayed on plan.
   */
   drawPlanBackground : function () {
  	var canvas = document.getElementById('monitor-bg');
    var ctx = canvas.getContext("2d");
    var width = canvas.width;
    var height = canvas.height;
    var allBeaconsMac = controller.getAllBeaconsMac();
    for (var i in allBeaconsMac) {
      var beaconPix = controller.getBeaconPixLocation(allBeaconsMac[i]);
      var color = controller.getBeacons().getBeaconColor(allBeaconsMac[i]);
      this.drawBeacon(ctx, width, height, beaconPix['px'], beaconPix['py'], color);
    } 
  },
  
  clearAndUpdateView : function() {
  	if (controller.getIndoor()) {
  		clearAndUpdateViewIndoor();
  	} else {
  		clearAndUpdateViewOutdoor();
  	}
  },
  
  // Implementation.

  /*drawBeaconsOnPlan : function() {
    var allBeaconsMac = controller.getAllBeaconsMac();
  },*/

  clearAndUpdateViewIndoor : function() {
  	
  },
    
  clearAndUpdateViewOutdoor : function() {
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
  },
  
   /**
   * Draw marker on background canvas.
   * @param {Integer} beacons. The beacons to be displayed on plan.
   */
  drawBeacon : function(ctx, width, height, x, y, color) {
    ctx.beginPath();
    ctx.arc(x * width, y * height, 2, 0, 2 * Math.PI);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.stroke();
  },
  
  /**
   * Draw cart on background canvas.
   * both x and y are given in the [0.0, 1.0] range.
   */
  drawCart : function(x, y) {
  	var canvas = document.getElementById('monitor-bg');
    var ctx = canvas.getContext("2d");
    var width = canvas.width;
    var height = canvas.height;
  	color = '#B71C1C';
    ctx.beginPath();
    ctx.arc(x * width, y * height, 3, 0, 2 * Math.PI);
    //ctx.arc(75.5, 75.5, 3, 0, 2 * Math.PI);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 1;
    ctx.fill();
    ctx.stroke();
  },
}