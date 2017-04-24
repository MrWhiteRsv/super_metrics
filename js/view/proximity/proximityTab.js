var proximityTab = {

	cartImage : undefined,
	table : undefined,
	tableData : undefined,

	init : function() {
		this.cartImage = new Image();
		this.cartImage.src = 'css/cart.png';
		var plan = document.getElementById("proximity-plan");
		var canvas = document.getElementById("proximity-canvas");
		canvas.style.height = plan.offsetHeight + 'px';
		canvas.style.width = plan.offsetWidth + 'px';
    var self = this;
    var nearbyRangeInput = document.getElementById("proximity-slider-nearby-threshold");
    var nearbyListener = function() {
      window.requestAnimationFrame(function() {
        controller.getBeacons().setNearbyManualThreshold(self.getFocusedBeacon(),
            nearbyRangeInput.value);
        self.drawSignalLevelTable();
      });
    };
    nearbyRangeInput.addEventListener("mousedown", function() {;
      nearbyListener();
      nearbyRangeInput.addEventListener("mousemove", nearbyListener);
    });
    nearbyRangeInput.addEventListener("mouseup", function() {
      nearbyRangeInput.removeEventListener("mousemove", nearbyListener);
    });

    var awayRangeInput = document.getElementById("proximity-slider-away-threshold");
    var awayListener = function() {
      window.requestAnimationFrame(function() {
        controller.getBeacons().setAwayManualThreshold(self.getFocusedBeacon(),
            awayRangeInput.value);
        self.drawSignalLevelTable();
      });
    };
    awayRangeInput.addEventListener("mousedown", function() {;
      awayListener();
      awayRangeInput.addEventListener("mousemove", awayListener);
    });
    awayRangeInput.addEventListener("mouseup", function() {
      awayRangeInput.removeEventListener("mousemove", awayListener);
    });

    document.getElementById("proximity-clear").addEventListener("click", function() {
      console.log("JJJ0");
    });

    document.getElementById("proximity-update-cart").addEventListener("click", function() {
      console.log("JJJ1");
    });

    document.getElementById("proximity_adaptive_threshold_switch").addEventListener("change", function() {
      /*controller.setAdaptiveBleThreshold(document.getElementById("proximity_adaptive_threshold_switch").checked);
      self.updateView();
      controller.onBleThresholdMethodChange();*/
      console.log("JJJ2");
    });
	},

	updateView : function() {
		if (controller.getGoogleChartsLoaded()) {
		  if (this.table == undefined) {
		    this.table = new google.visualization.Table(document.getElementById(
            'proximity-beacons-signal-level-table'));
        this.setFocusedBeadon(controller.getAllBeaconsMac()[0]);
      }
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
		this.tableData = new google.visualization.DataTable();
		this.tableData.addColumn('string', '');
		this.tableData.addColumn('string', 'Avg RSSI');
		this.tableData.addColumn('string', 'Rcnt RSSI');
		this.tableData.addColumn('string', 'Nearby');
		this.tableData.addColumn('string', 'Away');
    for (var r = 0; r < allBeaconsMac.length; r++) {
      var row = [];
      row.push(allBeaconsMac[r]);
      var average = controller.getBeacons().getBeaconAverageRssi(allBeaconsMac[r]);
      average = average == undefined ? undefined : average.toString();
      row.push(average);
      var recent = controller.getBeacons().getBeaconRecentRssi(allBeaconsMac[r]);
      recent = recent == undefined ? undefined : recent.toString();
      row.push(recent);
      row.push(controller.getBeacons().getNearbyThreshold(allBeaconsMac[r]).toString());
      row.push(controller.getBeacons().getAwayThreshold(allBeaconsMac[r]).toString());
      this.tableData.addRows([row]);
    }
    for (var r = 0; r <  allBeaconsMac.length; r++) {
      for (var c = 0; c < 5; c++) {
        this.tableData.setProperty(r, c, 'style', 'text-align: center');
      }
    }
		this.table.draw(this.tableData, {
			showRowNumber : false,
			allowHtml : true,
			width : '100%',
			height : '100%'
		});
		google.visualization.events.addListener(this.table, 'select', this.selectHandler.bind(this));
	},

  selectHandler : function() {
    var selection = this.table.getSelection();
    if (selection.length > 1) {
      alert('Select only 1 line at a time, in order to adjust thresholds.');
      return;
    }
    if (selection.length == 1) {
      if (selection[0].row != null) {
        this.setFocusedBeadon(this.tableData.getFormattedValue(selection[0].row, 0));
       }
     }
	},

	setFocusedBeadon : function(mac) {
	  var item = document.getElementById("proximity-selected-beacon");
    while (item.hasChildNodes()) {
      item.removeChild(item.lastChild);
    }
    var textNode = document.createElement('b');
    textNode.innerHTML = mac;
    item.appendChild(textNode);
    var nearbyRangeInput = document.getElementById("proximity-slider-nearby-threshold");
    nearbyRangeInput.value = controller.getBeacons().getNearbyThreshold(mac);
    var awayRangeInput = document.getElementById("proximity-slider-away-threshold");
    awayRangeInput.value = controller.getBeacons().getAwayThreshold(mac);
	},

	getFocusedBeacon : function() {
	  var item = document.getElementById("proximity-selected-beacon");
	  return item.hasChildNodes() ? item.children[0].innerText : undefined;
	}
}