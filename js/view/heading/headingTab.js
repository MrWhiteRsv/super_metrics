var headingTab = {

	cartImage : undefined,
	options : undefined,

	init : function() {
		this.cartImage = new Image();
		this.cartImage.src = 'css/cart.png';
    this.options = {
      width : 150,
      height : 150,
      chartArea:{ width:"100%", height:"100%"},
      hAxis: {minValue: -1.0, maxValue: 1.0},
      vAxis: {minValue: -1.0, maxValue: 1.0},
      legend: 'none',
      series: {
            0: { pointShape: 'diamond', color: '#9E9E9E', pointSize: 3}, // Grid.
            1: { pointShape: 'circle', color: '#FF9800', pointSize: 5},// Samples.
            2: { pointShape: 'circle', color: '#E91E63', pointSize: 8},// Most recent.
      }
    };
		var plan = document.getElementById("heading-plan");
		var canvas = document.getElementById("heading-canvas");
		canvas.style.height = plan.offsetHeight + 'px';
		canvas.style.width = plan.offsetWidth + 'px';
		var self = this;
	},

	updateView : function() {
    if (controller.getGoogleChartsLoaded()) {
      this.updateRawHeading();
      this.updateFixedHeading();
    }
		common.drawPlanBackground(document.getElementById('heading-canvas'));
		var cartLocation = controller.getCartLocation();
		if (cartLocation) {
			common.drawCart(
			    cartLocation['px'],
			    cartLocation['py'],
			    document.getElementById('heading-canvas'),
			    document.getElementById('heading-canvas'));
		}
	},

	// Implementation.

	updateRawHeading : function() {
    var data = new google.visualization.DataTable();
    data.addColumn('number', 'x');
    data.addColumn('number', 'y_grid');
    data.addColumn('number', 'y_samples');
    data.addColumn('number', 'y_recent');
    var rows = [];
    rows.push.apply(rows, this.createDataRows(Array(12).fill().map((e,i) => i * 360 / 12), 0.95, 0));
    rows.push.apply(rows, this.createDataRows(controller.getAllHeadingAngles(), 0.85, 1));
    rows.push.apply(rows, this.createDataRows([controller.getHeading()], 0.85, 2));
    data.addRows(rows);
    var table = new google.visualization.
        ScatterChart(document.getElementById('heading-raw-heading'));
    table.draw(data, this.options);
	},

  updateFixedHeading : function() {
    var data = new google.visualization.DataTable();
    data.addColumn('number', 'x');
    data.addColumn('number', 'y_grid');
    data.addColumn('number', 'y_samples');
    data.addColumn('number', 'y_recent');
    var rows = [];
    rows.push.apply(rows, this.createDataRows(Array(12).fill().map((e,i) => i * 360 / 12), 0.95, 0));
    data.addRows(rows);
 		var table = new google.visualization.
 		    ScatterChart(document.getElementById('heading-fixed-heading'));
    table.draw(data, this.options);
  },

  /* Implementation. */
  createDataRows : function(angleList, r, series) {
  	var rows = [];
  	for (var i = 0; i < angleList.length; ++i) {
  	  	  if (!angleList[i]) {
      	    continue;
      	  }
  	  var x = r * Math.cos(angleList[i] * Math.PI / 180);
  	  var y = r * Math.sin(angleList[i] * Math.PI / 180);
  	  switch (series) {
  	    case 0:
  	      rows.push([x, y, null, null]);
  	      break;
  	    case 1:
  	      rows.push([x, null, y, null]);
  	      break;
   	    case 2:
   	      rows.push([x, null, null, y]);
   	      break;
      }
  	}
  	return rows;
  },
}