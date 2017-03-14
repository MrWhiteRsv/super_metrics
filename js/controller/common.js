/* name space for common functionality. */
var common = {

	cartImage : undefined,
		
	getCartImage : function() {
		if (!this.cartImage) {
		  this.cartImage = new Image();
		  this.cartImage.src = 'css/cart.png';
		}
		return this.cartImage;
	},
		
	/**
	 * Draw cart on background canvas.
	 * both x and y are given in the [0.0, 1.0] range.
	 */
	drawCart : function(x, y, canvas) {
		//var canvas = document.getElementById('monitor-canvas');
		var ctx = canvas.getContext("2d");
		var width = canvas.width;
		var height = canvas.height;
		ctx.drawImage(this.getCartImage(), x * width - 10, y * height - 17);
	},

  clearCanvas : function(canvas) {
		var ctx = canvas.getContext("2d");
		var width = canvas.width;
		var height = canvas.height;
		ctx.clearRect(0, 0, width, height);  	
  },
  
	/**
	 * Draw plan, including beacons and backkground.
	 * @param {Beacons} beacons. The beacons to be displayed on plan.
	 */
	drawPlanBackground : function(canvas) {
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
	
};