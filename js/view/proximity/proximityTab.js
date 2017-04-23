var proximityTab = {

	cartImage : undefined,

	init : function() {
		this.cartImage = new Image();
		this.cartImage.src = 'css/cart.png';
		var plan = document.getElementById("proximity-plan");
		var canvas = document.getElementById("proximity-canvas");
		canvas.style.height = plan.offsetHeight + 'px';
		canvas.style.width = plan.offsetWidth + 'px';
    var self = this;
    document.getElementById("proximity-clear").addEventListener("click", function() {
      console.log('clear pressed');
    });
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
		data.addColumn('string', 'Avg RSSI');
		data.addColumn('string', 'Rcnt RSSI');
		data.addColumn('string', 'Min');
		data.addColumn('string', 'Max');

    for (var r = 0; r < allBeaconsMac.length; r++) {
      var row = [];
      row.push(allBeaconsMac[r]);
      row.push(controller.getBeacons().getBeaconAverageRssi(allBeaconsMac[r]));
      row.push(controller.getBeacons().getBeaconRecentRssi(allBeaconsMac[r]));
      row.push(controller.getBeaconMinThreshold(allBeaconsMac[r]));
      row.push(controller.getBeaconMaxThreshold(allBeaconsMac[r]));
      data.addRows([row]);
    }
    for (var r = 0; r <  allBeaconsMac.length; r++) {
      for (var c = 0; c < 5; c++) {
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