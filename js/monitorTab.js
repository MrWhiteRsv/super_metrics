var monitorTab = {

	cartImage : undefined,
  
  init : function() {

    this.cartImage = new Image();
    this.cartImage.src = 'css/cart.png';
    if (false) {
    	this.cartImage.onload = function () {
	  	  var canvas = document.getElementById('monitor-bg');
	      var ctx = canvas.getContext("2d");
	      ctx.drawImage(this, 30, 15);
	      ctx.drawImage(this, 88, 110);
	      ctx.drawImage(this, 150, 200);
	      ctx.drawImage(this, 150, 220);
	      ctx.drawImage(this, 318, 57);
	      ctx.drawImage(this, 525, 210);
	      ctx.drawImage(this, 480, 40);
	      ctx.drawImage(this, 535, 60);
	      ctx.drawImage(this, 555, 70);
	    }
		}
    var plan = document.getElementById("monitor-plan");
    var canvas = document.getElementById("monitor-bg");
    canvas.style.height = plan.offsetHeight + 'px';
    canvas.style.width = plan.offsetWidth + 'px';
    var self = this;
    document.getElementById("monitor-clear").addEventListener(
      "click",
      function() {
      	controller.init();
        self.updateView();
        //mqtt_listener.sendMessage();
      });      
      
  },
  
  updateView : function() {
  	if (controller.getGoogleChartsLoaded()) {
      this.drawTable();
  	}
		document.getElementById('map-div').style.display = "none";
		document.getElementById('monitor-plan').style.display = "initial";
 		document.getElementById('monitor-bg').style.display = "initial";
		this.drawPlanBackground();
		var latestPixel = controller.getCartPixel();
		if (latestPixel) {
		  this.drawCart(latestPixel['px'], latestPixel['py']);
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
    
    ctx.clearRect(0, 0, width, height);
    
    /*this.drawBeacon(ctx, width, height, 0.575, 0.3, '#B71C1C');
    this.drawBeacon(ctx, width, height, 0.595, 0.6, '#B71C1C');
    this.drawBeacon(ctx, width, height, 0.61, 0.4, '#B71C1C');
    this.drawBeacon(ctx, width, height, 0.63, 0.7, '#B71C1C');
    this.drawBeacon(ctx, width, height, 0.790, 0.4, '#B71C1C');
    this.drawBeacon(ctx, width, height, 0.395, 0.2, '#B71C1C');
    this.drawBeacon(ctx, width, height, 0.4175, 0.2, '#B71C1C');
    this.drawBeacon(ctx, width, height, 0.454, 0.6, '#B71C1C');
    this.drawBeacon(ctx, width, height, 0.5, 0.5, '#B71C1C');
    this.drawBeacon(ctx, width, height, 0.525, 0.55, '#B71C1C'); */

    /*this.drawBeacon(ctx, width, height, 0.682, 0.3, '#B71C1C'); // 19 L 
    this.drawBeacon(ctx, width, height, 0.755, 0.3, '#B71C1C'); // 21 L*/

    /*this.drawBeacon(ctx, width, height, 0.107, 0.16, '#B71C1C'); // 3 L 
    this.drawBeacon(ctx, width, height, 0.128, 0.3, '#B71C1C'); // 3 R
    this.drawBeacon(ctx, width, height, 0.141, 0.3, '#B71C1C'); // 4 L 
    this.drawBeacon(ctx, width, height, 0.160, 0.3, '#B71C1C'); // 4 R
    this.drawBeacon(ctx, width, height, 0.181, 0.3, '#B71C1C'); // 5 L 
    this.drawBeacon(ctx, width, height, 0.201, 0.3, '#B71C1C'); // 5 R
    this.drawBeacon(ctx, width, height, 0.215, 0.3, '#B71C1C'); // 6 L
    this.drawBeacon(ctx, width, height, 0.235, 0.75, '#B71C1C'); // 6 R*/
  
         
   var allBeaconsMac = controller.getAllBeaconsMac();
    for (var i in allBeaconsMac) {
      var beaconPix = controller.getBeaconPixLocation(allBeaconsMac[i]);
      var color = controller.getBeacons().getBeaconColor(allBeaconsMac[i]);
      this.drawBeacon(ctx, width, height, beaconPix['px'], beaconPix['py'], color);
    }
  },
  
  clearAndUpdateView : function() {
		this.clearAndUpdateViewIndoor();
  },
  
  // Implementation.

  clearAndUpdateViewIndoor : function() {
  	this.updateView();
  },
    
  /* clearAndUpdateViewOutdoor : function() {
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
  },*/
  
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
    ctx.drawImage(this.cartImage, x * width - 10, y * height - 17);
  	color = '#B71C1C';
    ctx.beginPath();
    ctx.arc(x * width, y * height, 2, 0, 2 * Math.PI);
    //ctx.arc(75.5, 75.5, 3, 0, 2 * Math.PI);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 1;
    // ctx.fill();
    ctx.stroke();
  },
  
  drawTable : function() {
  	var beacons = controller.getBeacons().getAllBeaconsMac();
  	var beaconsGreaph = controller.getBeaconsGraph();
    var data = new google.visualization.DataTable();
    for (var c = 0; c < beacons.length; c++) {
    	data.addColumn('number', '' + (c + 1));
    }
    var allBeacons = controller.getAllBeaconsMac();
    for (var r = 0; r < beacons.length; r++) {
    	var row = [];
    	for (var c = 0; c < beacons.length; c++) {
    		var val = beaconsGreaph.getEdgeLength(allBeacons[r], allBeacons[c]);
    		val = (val == undefined) ? -1 : val;
    	  row.push(val);
    	}
    	data.addRows([row]);
    }
    var table = new google.visualization.Table(document.getElementById('beacons-table'));
    table.draw(data, {showRowNumber: true, width: '100%', height: '100%'});
	}
}