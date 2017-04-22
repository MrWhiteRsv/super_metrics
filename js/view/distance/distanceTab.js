var distanceTab = {

	cartImage : undefined,

	init : function() {
		this.cartImage = new Image();
		this.cartImage.src = 'css/cart.png';
		var plan = document.getElementById("distance-plan");
		var canvas = document.getElementById("distance-canvas");
		canvas.style.height = plan.offsetHeight + 'px';
		canvas.style.width = plan.offsetWidth + 'px';
	},

	updateView : function() {
		if (controller.getGoogleChartsLoaded()) {
			this.drawDistanceTable();
		}
		common.drawPlanBackground(document.getElementById('distance-canvas'));
		var cartLocation = controller.getCartLocation();
		if (cartLocation) {
			common.drawCart(
			    cartLocation['px'],
			    cartLocation['py'],
			    document.getElementById('distance-canvas'),
			    document.getElementById('distance-canvas'));
		}
	},

	// Implementation.

	drawDistanceTable : function() {
		var graph = controller.getGraph();
		var data = new google.visualization.DataTable();
    var allNodes = controller.getGraph().getAlNodes();
		console.log("allNodes.length: " + allNodes.length);

		for (var c = 0; c < allNodes.length; c++) {
			data.addColumn('number', '' + (c + 1));
		}

		for (var r = 0; r < allNodes.length; r++) {
			var row = [];
			for (var c = 0; c < allNodes.length; c++) {
				var val = graph.getEdgeLength(allNodes[r], allNodes[c]);
				console.log('val: ' + val);
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
		    'distance-table'));
		table.draw(data, {
			showRowNumber : true,
			allowHtml : true,
			width : '100%',
			height : '100%'
		});
	},
}