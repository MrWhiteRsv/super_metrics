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
    for (var c = 0; c < 3; c++) {
      this.drawEdge(ctx, width, height, this.arrToNodeId([0, c]), this.arrToNodeId([1, c]));
    }
    for (var r = 0; r < 2; r++) {
      for (var c = 0; c < 2; c++) {
        this.drawEdge(ctx, width, height, this.arrToNodeId([r, c]),
            this.arrToNodeId([r, c + 1]));
      }
    }
  },

  /**
   * Draw edge between two nodes
   * @param {Integer} beacons. The beacons to be displayed on plan.
   */
  drawEdge : function(ctx, width, height, n0, n1) {
    ctx.lineWidth = 1.0;
    ctx.strokeStyle = "#303030";
    ctx.beginPath();
    var n0Px = controller.getGraph().getNodeLocation(n0);
    var n1Px = controller.getGraph().getNodeLocation(n1);
    ctx.moveTo(width * n0Px.px, height * n0Px.py);
    ctx.lineTo(width * n1Px.px, height * n1Px.py);
    ctx.stroke();
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

	arrToNodeId : function(arr) {
	  return arr.join(',');
	},

  edgeId : function(n0, n1) {
    return n0 > n1 ? n0 + ',' + n1 : n1 + ',' + n0;
  },
	
};