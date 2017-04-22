var proximityTab = {

	cartImage : undefined,

	init : function() {
		this.cartImage = new Image();
		this.cartImage.src = 'css/cart.png';
		var plan = document.getElementById("proximity-plan");
		var canvas = document.getElementById("proximity-canvas");
		canvas.style.height = plan.offsetHeight + 'px';
		canvas.style.width = plan.offsetWidth + 'px';
	},

	updateView : function() {
		if (controller.getGoogleChartsLoaded()) {
			this.drawSignalLevelTable();
		}
		common.drawPlanBackground(document.getElementById('proximity-canvas'));
		var cartLocation = controller.getCartLocation();
		if (cartLocation) {
			common.drawCart(
			    cartLocation['px'],
			    cartLocation['py'],
			    document.getElementById('proximity-canvas'),
			    document.getElementById('proximity-canvas'));
		}
	},

	// Implementation.

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
		var table = new google.visualization.Table(document.getElementById('proximity-beacons-signal-level-table'));
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