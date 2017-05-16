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
		//if (controller.getGoogleChartsLoaded()) {
		//}
		document.getElementById("monitor_single_sensor_switch").checked =
		    controller.getSingleSensorMode();
		document.getElementById("monitor_hyper_sensetive_beacon_switch").checked =
		    controller.getHyperSentistiveBeacons();
		document.getElementById("monitor_publish_location_switch").checked =
		    controller.getPublishLocation();
	},

	// Implementation.


}