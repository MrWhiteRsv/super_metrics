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
		document.getElementById("monitor-clear").addEventListener("click", function() {
			controller.init();
		});
		document.getElementById("monitor-ad").addEventListener("click", function() {
			controller.toggleAdMode();
		});
		document.getElementById("monitor-take-photo").addEventListener("click", function() {
			controller.captureImageWithCart('test_image');
		});
		document.getElementById("monitor_single_sensor_switch").addEventListener("change", function() {
			controller.setSingleSensorMode(document.getElementById("monitor_single_sensor_switch").checked);
		});
		document.getElementById("monitor_hyper_sensetive_beacon_switch").addEventListener("change", function() {
			controller.setHyperSentistiveBeacons(document.getElementById("monitor_hyper_sensetive_beacon_switch").checked);
		});
		document.getElementById("monitor_publish_location_switch").addEventListener("change", function() {
			controller.setPublishLocation(document.getElementById("monitor_publish_location_switch").checked);
		});
		document.getElementById("monitor_adaptive_threshold_switch").addEventListener("change", function() {
			controller.setAdaptiveBleThreshold(document.getElementById("monitor_adaptive_threshold_switch").checked);
			self.updateView();
			controller.onBleThresholdMethodChange();
		});
	},

	updateView : function() {
		if (controller.getGoogleChartsLoaded()) {
			this.drawDistanceTable();
			this.drawSignalLevelTable();
		}
		common.drawPlanBackground(document.getElementById('monitor-canvas'));
		var cartLocation = controller.getCartLocation();
		if (cartLocation) {
			common.drawCart(
			    cartLocation['px'],
			    cartLocation['py'],
			    document.getElementById('monitor-canvas'),
			    document.getElementById('monitor-canvas'));
		}
		document.getElementById("monitor_single_sensor_switch").checked =
		    controller.getSingleSensorMode();
		document.getElementById("monitor_hyper_sensetive_beacon_switch").checked =
		    controller.getHyperSentistiveBeacons();
		document.getElementById("monitor_publish_location_switch").checked =
		    controller.getPublishLocation();
	},

	// Implementation.

	drawDistanceTable : function() {
		var graph = controller.getGraph();
		var data = new google.visualization.DataTable();
    var allNodes = controller.getGraph().getAlNodes();
		for (var c = 0; c < allNodes.length; c++) {
			data.addColumn('number', '' + (c + 1));
		}
		for (var r = 0; r < allNodes.length; r++) {
			var row = [];
			for (var c = 0; c < allNodes.length; c++) {
				var val = graph.getEdgeLength(allNodes[r], allNodes[c]);
				row.push(val);
			}
			data.addRows([row]);
		}
		for (var r = 0; r < allNodes.length; r++) {
			for (var c = 0; c < allNodes.length; c++) {
				data.setProperty(r, c, 'style', 'text-align: center');
			}
		}
		var table = new google.visualization.Table(document.getElementById(
		    'monitor-beacons-distance-table'));
		table.draw(data, {
			showRowNumber : true,
			allowHtml : true,
			width : '100%',
			height : '100%'
		});
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
		var table = new google.visualization.Table(document.getElementById('monitor-beacons-signal-level-table'));
		for (var r = 0; r < 3; r++) {
			for (var c = 1; c < 5; c++) {
				data.setProperty(r, c, 'style', 'text-align: center');
			}
		}
		table.draw(data, {
			showRowNumber : false,
			allowHtml : true,
			width : '100%',
			height : '100%'
		});
	}
}