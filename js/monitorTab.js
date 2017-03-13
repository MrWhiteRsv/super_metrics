var monitorTab = {

	cartImage : undefined,
  
  init : function() {
    this.cartImage = new Image();
    this.cartImage.src = 'css/cart.png';
    var plan = document.getElementById("monitor-plan");
    var canvas = document.getElementById("monitor-canvas");
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
      	controller.toggleAdMode();
      });
     document.getElementById("monitor-take-photo").addEventListener(
          "click", function() {
      	    controller.captureImageWithCart('test_image');
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
     document.getElementById("monitor_adaptive_threshold_switch").addEventListener(
         "change", function() {
      	   controller.setAdaptiveBleThreshold(document.getElementById(
      	       "monitor_adaptive_threshold_switch").checked);
      	   self.updateView();
      	   controller.onBleThresholdMethodChange();
         });
  },
  
  updateView : function() {
  	if (controller.getGoogleChartsLoaded()) {
      this.drawDistanceTable();
      this.drawSignalLevelTable();
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
  	var canvas = document.getElementById('monitor-canvas');
    var ctx = canvas.getContext("2d");
    var width = canvas.width;
    var height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    

         
    var allBeaconsMac = controller.getAllBeaconsMac();
    for (var i in allBeaconsMac) {
      var beaconPix = controller.getBeacons().getBeaconPixLocation(allBeaconsMac[i]);
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
      var beaconPix = controller.getBeacons().getBeaconPixLocation(allBeaconsMac[0]);
      ctx.moveTo(width * beaconPix['px'], height * beaconPix['py']);
      for (var i in allBeaconsMac) {
        beaconPix = controller.getBeacons().getBeaconPixLocation(allBeaconsMac[i]);
        ctx.lineTo(width * beaconPix['px'], height * beaconPix['py']);
      }
      beaconPix = controller.getBeacons().getBeaconPixLocation(allBeaconsMac[0]);
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
  	var canvas = document.getElementById('monitor-canvas');
    var ctx = canvas.getContext("2d");
    var width = canvas.width;
    var height = canvas.height;
    ctx.drawImage(this.cartImage, x * width - 10, y * height - 17);
  	/*color = '#B71C1C';
    ctx.beginPath();
    ctx.arc(x * width, y * height, 2, 0, 2 * Math.PI);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 1;
    ctx.stroke();*/
  },
  
  drawDistanceTable : function() {
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
    	  row.push(val);
    	}
    	data.addRows([row]);
    }
    for (var r = 0; r < beacons.length; r++) {
      for (var c = 0; c < beacons.length; c++) {
        data.setProperty(r, c, 'style', 'text-align: center');
      }
    }
    var table = new google.visualization.Table(document.getElementById('monitor-beacons-distance-table'));
    table.draw(data, {showRowNumber: true, allowHtml: true, width: '100%', height: '100%'});
	},
	
	drawSignalLevelTable : function() {
  	var allBeaconsMac = controller.getAllBeaconsMac();
    var data = new google.visualization.DataTable();
    data.addColumn('string', '');
    for (var c = 0; c < allBeaconsMac.length; c++) {
    	data.addColumn('number', '' + (c + 1));
    }
    var row = ['Avg RSSI'];
    for (var i = 0; i < allBeaconsMac.length; i++) {
	    row.push(controller.getBeacons().getBeaconAverageRssi(allBeaconsMac[i]));
    }
    data.addRows([row]);
    var row = ['Recent'];
    for (var i = 0; i < allBeaconsMac.length; i++) {
	    row.push(controller.getBeacons().getBeaconRecentRssi(allBeaconsMac[i]));
    }
    data.addRows([row]);
    var row = ['Threshold'];
    for (var i = 0; i < allBeaconsMac.length; i++) {
	    //row.push(controller.getBeaconThRssi(allBeaconsMac[i]));
      row.push(controller.getBeaconProximityThreshold(allBeaconsMac[i]));
    }
    data.addRows([row]);
    var table = new google.visualization.Table(
    	  document.getElementById('monitor-beacons-signal-level-table'));
    for (var r = 0; r < 3; r++) {
	    for (var c = 1; c < 5; c++) {
	      data.setProperty(r, c, 'style', 'text-align: center');
	    }
	  }
    table.draw(data, {showRowNumber: false, allowHtml: true,  width: '100%', height: '100%'});
	}
}