var monitorTab = {

	cartImage : undefined,
  
  init : function() {
    this.cartImage = new Image();
    this.cartImage.src = 'css/cart.png';
    var plan = document.getElementById("monitor-plan");
    var canvas = document.getElementById("monitor-bg");
    canvas.style.height = plan.offsetHeight + 'px';
    canvas.style.width = plan.offsetWidth + 'px';
    var self = this;
    document.getElementById("monitor-clear").addEventListener(
      "click",
      function() {
      	controller.init();
        //self.updateView();
      });
    document.getElementById("monitor-ad").addEventListener(
      "click",
      function() {
      	controller.publishAd();
      });
     document.getElementById("monitor-take-photo").addEventListener(
          "click", function() {
      	    controller.takePhotoOnCart();
          });
     document.getElementById("monitor_single_sensor_switch").addEventListener(
         "change", function() {
      	   controller.setSingleSensorMode(document.getElementById(
      	       "monitor_single_sensor_switch").checked);
         });
     document.getElementById("monitor_hyper_sensetive_beacon_switch").addEventListener(
         "change", function() {
      	   controller.setHyperSentistiveBeacons(document.getElementById(
      	       "monitor_hyper_sensetive_beacon_switch").checked);
         });
     document.getElementById("monitor_publish_location_switch").addEventListener(
         "change", function() {
      	   controller.setPublishLocation(document.getElementById(
      	       "monitor_publish_location_switch").checked);
         });
  },
  
  updateView : function() {
  	if (controller.getGoogleChartsLoaded()) {
      this.drawTable();
  	}
		this.drawPlanBackground();
		var latestPixel = controller.getCartPixel();
		if (latestPixel) {
		  this.drawCart(latestPixel['px'], latestPixel['py']);
		}
		document.getElementById("monitor_single_sensor_switch").checked =
		    controller.getSingleSensorMode();
	  document.getElementById("monitor_hyper_sensetive_beacon_switch").checked =
		    controller.getHyperSentistiveBeacons();
			  document.getElementById("monitor_publish_location_switch").checked =
		    controller.getPublishLocation();
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
      color = "#303030";
      this.drawBeacon(ctx, width, height, beaconPix['px'], beaconPix['py'], color);
    }
    if (allBeaconsMac.length > 1) {
      ctx.lineWidth = 1.0;
      ctx.strokeStyle = "#303030";
      ctx.beginPath();
      var width = canvas.width;
      var height = canvas.height;
      var beaconPix = controller.getBeaconPixLocation(allBeaconsMac[0]);
      ctx.moveTo(width * beaconPix['px'], height * beaconPix['py']);
      for (var i in allBeaconsMac) {
        beaconPix = controller.getBeaconPixLocation(allBeaconsMac[i]);
        ctx.lineTo(width * beaconPix['px'], height * beaconPix['py']);
      }
      beaconPix = controller.getBeaconPixLocation(allBeaconsMac[0]);
      ctx.lineTo(width * beaconPix['px'], height * beaconPix['py']);
      ctx.stroke();
    }
  },
  
  clearAndUpdateView : function() {
		this.clearAndUpdateViewIndoor();
  },
  
  // Implementation.

  clearAndUpdateViewIndoor : function() {
  	this.updateView();
  },
   
  /**
   * Draw marker on background canvas.
   * @param {Integer} beacons. The beacons to be displayed on plan.
   */
  drawBeacon : function(ctx, width, height, x, y, color) {
    ctx.beginPath();
    ctx.arc(x * width, y * height, 1, 0, 2 * Math.PI);
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
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 1;
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
    var table = new google.visualization.Table(document.getElementById('beacons-distance-table'));
    table.draw(data, {showRowNumber: true, width: '100%', height: '100%'});
	}
}