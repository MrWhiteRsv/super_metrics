var controller = {
  beacons : undefined,
  revolutionPath : undefined,
  beaconsGraph : undefined,
  hardCodedBeaconDistance : true,
  indoor : true,
  firstInvalidBeaconWarningIssued : false,
  learnBeaconDistance : undefined,
  
  /**
   * Main Entry Point.
   * Called once map is loaded.
   */
  start : function() {
  	this.init();
  	this.clear();
  	testAll();
  	this.clear();
    this.initBeacons();
    this.initBeaconsGraph();
    graph.mockEdgeTraficVolume();
    graph.mockEdgeTraficSpeed();
    supermarketTab.updateView();
  },
  
  /* One time only */
  init : function() {
    mqtt_listener.init();
    this.clear();
  },
  
  clear : function() {
    mainPage.init();
    gpsPath.init();
  	this.beaconsGraph = new BeaconsGraph();
    this.beacons = new Beacons();
    this.revolutionPath = new RevolutionPath(this.beacons);
    graph.build();
    this.hardCodedBeaconDistance = true;
    this.indoor = true;
    this.firstInvalidBeaconWarningIssued = false;
    this.setLearnBeaconDistance(false);
  },
  
  initBeacons : function() {
    this.beacons.addBeacon('34:b1:f7:d3:91:f8',
      {color : '#B71C1C', markerType : 'RED_MARKER', location : undefined, samples : 0, px : 0.118, py : 0.78});
    this.beacons.addBeacon('34:b1:f7:d3:9c:cb',
      {color : '#1B5E20', markerType : 'GREEN_MARKER', location : undefined, samples : 0, px : 0.152, py : 0.78});
    this.beacons.addBeacon('34:b1:f7:d3:91:e4',
      {color : '#1A237E', markerType : 'BLUE_MARKER', location : undefined, samples : 0, px : 0.152, py : 0.12});
    this.beacons.addBeacon('34:b1:f7:d3:9d:eb',
      {color : '#FFFF00', markerType : 'YELLOW_MARKER', location : undefined, samples : 0, px : 0.118, py : 0.12});
    this.beacons.addBeacon('34:b1:f7:d3:90:8e',
      {color : '#4A148C', markerType : 'PURPLE_MARKER', location : undefined, samples : 0, px : 0.094, py : 0.3});
  },
  
  initBeaconsGraph : function() {
    if (this.hardCodedBeaconDistance) {
    	this.beaconsGraph.addEdgeLength('34:b1:f7:d3:91:f8', '34:b1:f7:d3:9c:cb', 10);
    	this.beaconsGraph.addEdgeLength('34:b1:f7:d3:9c:cb', '34:b1:f7:d3:91:e4', 80);
    	this.beaconsGraph.addEdgeLength('34:b1:f7:d3:91:e4', '34:b1:f7:d3:9d:eb', 10);
    	this.beaconsGraph.addEdgeLength('34:b1:f7:d3:9d:eb', '34:b1:f7:d3:91:f8', 80);
    }  	
  },

  
  setIndoor: function(value) {
  	this.indoor = value;
  },
  
  setLearnBeaconDistance:function(value) {
  	this.learnBeaconDistance = value;
  },
  
  getIndoor : function() {
  	return this.indoor;
  },

  getAllBeaconsMac : function() {
    return this.beacons.getAllBeaconsMac();
  },

  getBeacons : function() {
  	return this.beacons;
  },
  
  getBeaconPixLocation : function(mac) {
    return this.beacons.getBeaconPixLocation(mac);
  },
    
  getBeaconMarkerType : function(mac) {
    return this.beacons.getBeaconMarkerType(mac);
  },
  
  getBeaconLocation : function(mac) {
    return this.beacons.getBeaconLocation(mac);
  },
  
  getBeaconsGraph : function() {
  	return this.beaconsGraph;
  },
  
  treatMsg : function(type, jsonPayload) {
    var payload = JSON.parse(jsonPayload);
    switch (type) {
      case 'revolution':
        this.treatRevolutionMsg(payload);
        break;
      case 'gps':
        this.treatGpsMsg(payload);
        break;
      case 'ble':
        this.treatBleMsg(payload);
        break;
    }
  },
  
  getLocationAtTime : function(time_sec) {
    if (gpsPath.isEmpty() || time_sec == undefined) {
      return undefined;
    }
    return gpsPath.estimateLocation(time_sec);
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
  
  dev : function() {
    console.log('revolutionPath: ' + this.revolutionPath.toString());
  },
  
  // Implementation
  
  guessNextBeacon : function(currentMac) {
  	var expectedPath = ['34:b1:f7:d3:91:f8', '34:b1:f7:d3:9c:cb', '34:b1:f7:d3:91:e4', '34:b1:f7:d3:9d:eb'];
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
    mainPage.updateView(/*clearMonitorTab*/ false);
  },
  
  treatBleMsg : function(payload) {
    var mac = payload["mac"];
    if (!this.isValidBeacon(mac)) {
    	this.issueBeaconDoesNotExistWarning();
      return;    	
    }
    var nearestTime = payload['nearest_time'];
    var nearestLocation = this.getLocationAtTime(nearestTime);
    if (nearestLocation) {
      this.beacons.addBeaconSample(mac, nearestTime, nearestLocation);
    }
    if (this.learnBeaconDistance) {
    	var prevMac = this.revolutionPath.findLatestNearbyBeacon();
    	if (prevMac) {
	    	var dist = this.revolutionPath.countRevolutionsSinceLatestProximityEvent();
	    	this.beaconsGraph.addEdgeLength(prevMac, mac, dist);
	    }
    }
    this.revolutionPath.addProximityEvent(mac, nearestTime);
    mainPage.updateView(/*clearMonitorTab*/ true);
  },
  
}