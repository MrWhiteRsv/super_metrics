var controller = {
  beacons : undefined,
  revolutionPath : undefined,
  beaconsGraph : undefined,
  hardCodedBeaconDistance : true,
  firstInvalidBeaconWarningIssued : false,
  googleChartsLoaded : false,
  mqttConnected : false,
  singleSensorMode : true,
  hyperSentistiveBeacons : false,
  publishLocation : true,  
  adMode : false, 
  adaptiveBleThreshold : true,
  
  setHardCodedBeaconDistance: function(value) {
  	controller.hardCodedBeaconDistance = value;
  },
  
  setGoogleChartsLoadedTrue: function() {
  	controller.googleChartsLoaded = true;
  },
  
  setSingleSensorMode: function(value) {
  	this.singleSensorMode = value;
  },

  setHyperSentistiveBeacons: function(value) {
  	this.hyperSentistiveBeacons = value;
  },
  
  setAdaptiveBleThreshold: function(value) {
  	this.adaptiveBleThreshold = value;
  },
  
  setPublishLocation: function(value) {
  	this.publishLocation = value;
  },
  
  getPublishLocation : function() {
  	return this.publishLocation;
  },
  
  getHyperSentistiveBeacons : function() {
  	return this.hyperSentistiveBeacons;
  },

  getSingleSensorMode : function() {
  	return this.singleSensorMode;
  },
  
  getGoogleChartsLoaded : function() {
  	return this.googleChartsLoaded;
  },

  getAllBeaconsMac : function() {
    return this.beacons.getAllBeaconsMac();
  },

  getBeacons : function() {
  	return this.beacons;
  },
    
  getBeaconMarkerType : function(mac) {
    return this.beacons.getBeaconMarkerType(mac);
  },
  
  getBeaconsGraph : function() {
  	return this.beaconsGraph;
  },
  
  getBeaconAverageRssi : function(mac) {
    return this.mapMacToBeaconData[mac].avgRssi;
  },
  
  getAdaptiveBleThreshold: function() {
  	return this.adaptiveBleThreshold;
  },
  
  getNearestProductUuid : function(x, y) {
  	var allProducts = this.getAllProducts();
  	var minDist = undefined;
  	var minDistUuid = undefined;
  	for (var i = 0; i < allProducts.length; i++) {
  		var prd_x = allProducts[i].location_px.px;
  		var prd_y = allProducts[i].location_px.py;
  		var dist = Math.pow((prd_x - x), 2) + Math.pow((prd_y - y), 2);
  		if (minDist == undefined || dist < minDist) {
  			minDist = dist;
  			minDistUuid = allProducts[i].uuid;
  		}
  	}
  	return minDistUuid;
  },
  
  getProductDetails : function(uuid) {
  	var allProducts = this.getAllProducts();
    for (var i = 0; i < allProducts.length; i++) {
    	if (allProducts[i].uuid == uuid) {
    		return allProducts[i];
    	}
    }
    return undefined;
  },
  
  getBeaconProximityThreshold : function(mac) {
  	if (this.getAdaptiveBleThreshold()) {
  		var average = this.getBeacons().getBeaconAverageRssi(mac);
  	  return average == undefined ? undefined : average + 10;
  	} else {
      return -50;
    }
  },
  
  /**
   * Main Entry Point.
   * Called once map is loaded.
   */
  onMapLoaded : function() {
  	// One time actions.
  	mqtt_listener.init();
  	graph.build();
  	graph.mockEdgeTraficVolume();
    graph.mockEdgeTraficSpeed();
  	// testAll();
  	this.hardCodedBeaconDistance = false;
  	this.init();
    supermarketTab.updateView();
  },

  /**
   * Handle a change in the BLE threshold triggered by the UI.
   */  
  onBleThresholdMethodChange : function() {
  	this.publishBleProximityThresholds();
  },
  
  init : function() {
    mainPage.init();
  	this.beaconsGraph = new BeaconsGraph();
    this.beacons = new Beacons();
    this.revolutionPath = new RevolutionPath(this.beacons);
    this.firstInvalidBeaconWarningIssued = false;
    this.initBeacons();
    this.initBeaconsGraph();
    if (this.mqttConnected) {
      this.resetCartDetector();
    }
  },
  
  onMqttConnect : function() {
  	this.mqttConnected = true;
  	this.resetCartDetector();
  },
  
  resetCartDetector : function() {
  	topic = "monitor/cartId/command";
    var payload = JSON.stringify({reset: true});
    mqtt_listener.sendMessage(topic, payload);
 	},

  publishCurrentLocation : function() {
  	if (this.getPublishLocation()) {
	  	topic = "monitor/cartId/location";
	  	var latestPixel = controller.getCartPixel();
			if (latestPixel) {
	      var payload = JSON.stringify({px: latestPixel['px'], py : latestPixel['py']});
	      mqtt_listener.sendMessage(topic, payload);
	    }
	  }
 	},
 	
  toggleAdMode : function() {
  	topic = "monitor/cartId/command";
  	this.adMode = !this.adMode;
    var payload = JSON.stringify({publishAd: this.adMode});
    mqtt_listener.sendMessage(topic, payload);
 	},
 	
  captureImageWithCart : function(imageName) {
  	topic = "monitor/cartId/command";
    var payload = JSON.stringify({captureImageWithCart: true, image_name: imageName});
    mqtt_listener.sendMessage(topic, payload);
 	}, 	 
 	 
  initBeacons : function() {
    this.beacons.addBeacon('34:b1:f7:d3:91:f8',
      {color : '#B71C1C', markerType : 'RED_MARKER', location : undefined, samples : 0, px : 0.118, py : 0.78});
    this.beacons.addBeacon('34:b1:f7:d3:9c:cb',
      {color : '#1B5E20', markerType : 'GREEN_MARKER', location : undefined, samples : 0, px : 0.19, py : 0.78});
    this.beacons.addBeacon('34:b1:f7:d3:9e:2b',
      {color : '#1A237E', markerType : 'BLUE_MARKER', location : undefined, samples : 0, px : 0.19, py : 0.12}); //0.152,
    this.beacons.addBeacon('34:b1:f7:d3:9d:eb',
      {color : '#FFFF00', markerType : 'YELLOW_MARKER', location : undefined, samples : 0, px : 0.118, py : 0.12});
    /*this.beacons.addBeacon('34:b1:f7:d3:90:8e',
      {color : '#4A148C', markerType : 'PURPLE_MARKER', location : undefined, samples : 0, px : 0.195, py : 0.3}); */
  },
  
  initBeaconsGraph : function() {
  	this.beaconsGraph.init();
    if (this.hardCodedBeaconDistance) {
    	this.beaconsGraph.addEdgeLength('34:b1:f7:d3:91:f8', '34:b1:f7:d3:9c:cb', 10);
    	this.beaconsGraph.addEdgeLength('34:b1:f7:d3:9c:cb', '34:b1:f7:d3:9e:2b', 80);
    	this.beaconsGraph.addEdgeLength('34:b1:f7:d3:9e:2b', '34:b1:f7:d3:9d:eb', 10);
    	this.beaconsGraph.addEdgeLength('34:b1:f7:d3:9d:eb', '34:b1:f7:d3:91:f8', 80);
    }
    this.beaconsGraph.addEdgeLength('34:b1:f7:d3:91:f8', '34:b1:f7:d3:91:f8', 0);
    this.beaconsGraph.addEdgeLength('34:b1:f7:d3:9c:cb', '34:b1:f7:d3:9c:cb', 0);
    this.beaconsGraph.addEdgeLength('34:b1:f7:d3:9e:2b', '34:b1:f7:d3:9e:2b', 0);
    this.beaconsGraph.addEdgeLength('34:b1:f7:d3:9d:eb', '34:b1:f7:d3:9d:eb', 0);
  },
  
  treatMsg : function(type, jsonPayload) {
    var payload = JSON.parse(jsonPayload);
    switch (type) {
      case 'revolution':
        this.treatRevolutionMsg(payload);
        break;
      case 'ble':
        this.treatBleMsg(payload);
        break;
    }
  },
  
  getCartPixel : function() {
    var expectedNextBeacon = this.guessNextBeacon(
    	  this.revolutionPath.findLatestNearbyBeacon());
  	return this.revolutionPath.getCartPixel(this.beaconsGraph, expectedNextBeacon);
  },
  
  getRevolutionBasedLocationAtTime : function(ts) {
    return (this.revolutionPath.getCartLatLng(ts));
  },
  
  treatGpsMsg : function(payload) {
    gpsPath.pushPoint(payload);
    mainPage.updateView(/*clearMonitorTab*/ false);
  },
  
  getGraph : function() {
    return graph;
  },
  
  // Temp
  
  getAllProducts : function() {
  	res = [
      {"category": "asian", "location_str": "aisle 5", "uuid": "070844005073",
        "ingredients": "WATER, SUGAR, SOYBEAN PASTE (FERMENTED SOYBEANS, WHEAT FLOUR, SOY SAUCE, SUGAR), GARLIC, CORN STARCH, SALT, VINEGAR, SESAME OIL, CARAMEL COLOR, SPICES, XANTHAN GUM (FOR TEXTURE) AND CITRIC ACID (ACIDULANT).",
        "ndbno": "45042286", "nutrients": [
        {"unit": "kcal", "name": "Energy", "value": "156"},
        {"unit": "g", "name": "Protein", "value": "0.00"},
        {"unit": "g", "name": "Total lipid (fat)", "value": "0.00"},
        {"unit": "g", "name": "Carbohydrate, by difference", "value": "37.50"},
        {"unit": "g", "name": "Fiber, total dietary", "value": "0.0"},
        {"unit": "g", "name": "Sugars, total", "value": "18.75"},
        {"unit": "mg", "name": "Calcium, Ca", "value": "0"},
        {"unit": "mg", "name": "Iron, Fe", "value": "0.00"},
        {"unit": "mg", "name": "Sodium, Na", "value": "3062"},
        {"unit": "mg", "name": "Vitamin C, total ascorbic acid", "value": "0.0"},
        {"unit": "IU", "name": "Vitamin A, IU", "value": "0"},
        {"unit": "g", "name": "Fatty acids, total saturated", "value": "0.00"},
        {"unit": "g", "name": "Fatty acids, total trans", "value": "0.00"},
        {"unit": "mg", "name": "Cholesterol", "value": "0"}],
         "price": "$2.29", "location_px": {"px": 0.181, "py": 0.3}, 
         "description": "KA-ME, HOISIN SAUCE, UPC: 070844005073", "discount_percent": 0,
         "images": ["hoisin.png"], "name": "Hoisin Sauce"},

      {"category": "asian", "location_str": "aisle 6", "uuid": "041390002847",
        "ingredients": "WATER, WHEAT, SOYBEANS, SALT, SODIUM BENZOATE; LESS THAN 1/10 OF 1% AS A PRESERVATIVE",
        "ndbno": "45135919", "nutrients": [
        {"unit": "kcal", "name": "Energy", "value": "67"},
        {"unit": "g", "name": "Protein", "value": "13.33"},
        {"unit": "g", "name": "Total lipid (fat)", "value": "0.00"},
        {"unit": "g", "name": "Carbohydrate, by difference", "value": "0.00"},
        {"unit": "mg", "name": "Sodium, Na", "value": "6133"}],
         "price": "$2.29", "location_px": {"px": 0.215, "py": 0.45},
         "description": "KIKKOMAN, SOY SAUCE, UPC: 041390002847",
         "discount_percent": 0, "images": ["soy_sauce.png"],
         "name": "Soy Sauce"},
           	{"category": "discount", "location_str": "aisle 2", "images": ["836093010028.png"],
  	 "uuid": "836093010028", "ndbno": "45243227", "nutrients":
  	 [{"unit": "kcal", "name": "Energy", "value": "3"}, {"unit": "g", "name": "Protein", "value": "0.00"},
  	 {"unit": "g", "name": "Total lipid (fat)", "value": "0.00"},
  	 {"unit": "g", "name": "Carbohydrate, by difference", "value": "0.56"},
  	 {"unit": "g", "name": "Sugars, total", "value": "0.56"},
  	 {"unit": "mg", "name": "Sodium, Na", "value": "3"}],
  	 "price": "$7.99", "location_px": {"px": 0.094, "py": 0.3},
  	 "ingredients": "CARBONATED WATER, ORGANIC CANE SUGAR, CERTIFIED ORGANIC NATURAL FLAVORS, CITRIC ACID",
  	 "description": "IZZE, SPARKLING WATER BEVERAGE, RASPBERRY WATERMELON, UPC: 836093010028",
  	 "discount_percent": 20, "name": "IZZE"},
  	 
    {"category": "gourmet", "location_str": "aisle 16", "images": ["merlot.png"], "uuid": "14602", "ndbno": 14602,
     "nutrients": [{"unit": "g", "name": "Water", "value": "86.59"},
     {"unit": "kcal", "name": "Energy", "value": "83"},
     {"unit": "g", "name": "Protein", "value": "0.07"},
     {"unit": "g", "name": "Total lipid (fat)", "value": "0.00"},
     {"unit": "g", "name": "Carbohydrate, by difference", "value": "2.51"},
     {"unit": "g", "name": "Fiber, total dietary", "value": "0.0"},
     {"unit": "g", "name": "Sugars, total", "value": "0.62"},
     {"unit": "mg", "name": "Calcium, Ca", "value": "8"},
     {"unit": "mg", "name": "Iron, Fe", "value": "0.46"},
     {"unit": "mg", "name": "Magnesium, Mg", "value": "12"},
     {"unit": "mg", "name": "Phosphorus, P", "value": "23"},
     {"unit": "mg", "name": "Potassium, K", "value": "127"},
     {"unit": "mg", "name": "Sodium, Na", "value": "4"},
     {"unit": "mg", "name": "Zinc, Zn", "value": "0.14"},
     {"unit": "mg", "name": "Vitamin C, total ascorbic acid", "value": "0.0"},
     {"unit": "mg", "name": "Thiamin", "value": "0.005"},
     {"unit": "mg", "name": "Riboflavin", "value": "0.031"},
     {"unit": "mg", "name": "Niacin", "value": "0.224"},
     {"unit": "mg", "name": "Vitamin B-6", "value": "0.057"},
     {"unit": "\u00b5g", "name": "Vitamin B-12", "value": "0.00"},
     {"unit": "g", "name": "Fatty acids, total trans", "value": "0.000"}],
     "price": "$43.99", "location_px": {"px": 0.575, "py": 0.3},
     "description": "Alcoholic Beverage, wine, table, red, Merlot",
     "discount_percent": 20,
     "name": "Miolo Reserva Merlot 2009"}
       ];
    return res;
  },
  

  
  // Implementation
  
  guessNextBeacon : function(currentMac) {
  	var expectedPath = ['34:b1:f7:d3:91:f8', '34:b1:f7:d3:9c:cb', '34:b1:f7:d3:9e:2b', '34:b1:f7:d3:9d:eb'];
  	var index = expectedPath.indexOf(currentMac);
  	if (!index && index != 0) {
  		return undefined;
  	}
  	return expectedPath[(index + 1) % expectedPath.length];
  },
  
  // Returns true if beacon is one of pre configured beacons.
  isValidBeacon : function(mac) {
  	return this.beacons.getAllBeaconsMac().indexOf(mac) != -1;
  },
  
  // Issued only once.
  issueBeaconDoesNotExistWarning : function() {
  	if (!this.firstInvalidBeaconWarningIssued) {
  	  this.firstInvalidBeaconWarningIssued = true;
  	  mainPage.displayBeaconDoesNotExistWarning();
  	}
  },
  
  treatRevolutionMsg : function(payload) {
    // {"start_time": 1487295518.0, "forward_counter": 7, "backward_counter": 0, "forward_revolution": true}
    this.revolutionPath.addRevolutionEvent(payload.forward_revolution, payload.start_time);
    this.publishCurrentLocation();
    mainPage.updateView(/*clearMonitorTab*/ false);
  },
  
  treatBleMsg : function(payload) {
    var mac = payload["mac"];
    var rssi = payload["nearest_rssi"];
    if (!this.isValidBeacon(mac)) {
    	this.issueBeaconDoesNotExistWarning();
      return;    	
    }
    var prevMac = this.revolutionPath.findLatestNearbyBeacon();
    var nearestTime = payload['nearest_time'];
    if (!this.hardCodedBeaconDistance) {  // Learn beacons distance.
    	if (prevMac) {
	    	var dist = prevMac === mac ?
	    	    0 : this.revolutionPath.countRevolutionsSinceLatestProximityEvent();
	    	if (dist >= 0) {
	    	  this.beaconsGraph.addEdgeLength(prevMac, mac, dist);
	    	}
	    }
    }
    this.beacons.addBeaconSample(mac, rssi)
    this.revolutionPath.addProximityEvent(mac, nearestTime);
    this.publishCurrentLocation();
    mainPage.updateView(/*clearMonitorTab*/ true);
  },
  
  publishBleProximityThresholds : function() {
  	var topic = "monitor/cartId/command";
  	var allBeaconsMac = controller.getAllBeaconsMac();
    for (var i = 0; i < allBeaconsMac.length; i++) {
    	var mac = allBeaconsMac[i];
    	var threshold = this.getBeaconProximityThreshold(mac);
    	if (threshold != undefined) {
    	  var payload = JSON.stringify({changeThreshold: true, mac: mac, threshold: threshold});
    	  mqtt_listener.sendMessage(topic, payload);
    	}
    }
  },
  
}