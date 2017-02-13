var controller = {
  
  beacons : undefined,
  revolutionPath : undefined,
  beaconsGraph : undefined,
  hardCodedBeaconDistance : true,
  indoor : true,
  firstInvalidBeaconWarningIssued : false,
  
  /**
   * Main Entry Point.
   * Called once map is loaded.
   */
  initController : function() {
    mainPage.init();
    gpsPath.init();
    mqtt_listener.init();
    graph.build();
    graph.mockEdgeTraficVolume();
    graph.mockEdgeTraficSpeed();
    supermarketTab.updateView();
    this.beaconsGraph = new BeaconsGraph();
    this.beacons = new Beacons();
    this.initBeacons();
    this.revolutionPath = new RevolutionPath(this.beacons);
    this.test();
  },
  
  initBeacons : function() {
    this.beacons.addBeacon('34:b1:f7:d3:91:c8',
      {color : '#B71C1C', markerType : 'RED_MARKER', location : undefined, samples : 0, px : 0.118, py : 0.78});
    this.beacons.addBeacon('34:b1:f7:d3:9c:cb',
      {color : '#1B5E20', markerType : 'GREEN_MARKER', location : undefined, samples : 0, px : 0.152, py : 0.78});
    this.beacons.addBeacon('34:b1:f7:d3:91:e4',
      {color : '#1A237E', markerType : 'BLUE_MARKER', location : undefined, samples : 0, px : 0.118, py : 0.12});
    this.beacons.addBeacon('34:b1:f7:d3:9d:eb',
      {color : '#FFFF00', markerType : 'YELLOW_MARKER', location : undefined, samples : 0, px : 0.152, py : 0.12});
    this.beacons.addBeacon('34:b1:f7:d3:90:8e',
      {color : '#4A148C', markerType : 'PURPLE_MARKER', location : undefined, samples : 0, px : 0, py : 0});
    if (this.hardCodedBeaconDistance) {
    	this.beaconsGraph.addEdgeLength('34:b1:f7:d3:91:c8', '34:b1:f7:d3:9c:cb', 20);
    	this.beaconsGraph.addEdgeLength('34:b1:f7:d3:9c:cb', '34:b1:f7:d3:91:e4', 200);
    	this.beaconsGraph.addEdgeLength('34:b1:f7:d3:91:e4', '34:b1:f7:d3:9d:eb', 20);
    	this.beaconsGraph.addEdgeLength('34:b1:f7:d3:9d:eb', '34:b1:f7:d3:91:c8', 200);
    }
  },
  
  test : function() {
    // utils.assert(this.beaconsGraph.test()); 
    utils.assert(testBeacons()); 
    utils.assert(testRevolutionPath()); 
  },
  
  setIndoor: function(value) {
  	this.indoor = value;
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
  
  treatMsg : function(type, jsonPayload) {
    //console.log('type :' + type + ' ,jsonPayload: ' + jsonPayload);
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
    if (type == 'gps') {
    }
  },
  
  getLocationAtTime : function(time_sec) {
    if (gpsPath.isEmpty() || time_sec == undefined) {
      return undefined;
    }
    return gpsPath.estimateLocation(time_sec);
  },
  
  getLatestCartPixel : function() {
  	return (this.revolutionPath.getLatestCartPixel());
  },
  
  getRevolutionBasedLocationAtTime : function(ts) {
    return (this.revolutionPath.getCartLatLng(ts));
  },
  
  treatGpsMsg : function(payload) {
    gpsPath.pushPoint(payload);
    mainPage.updateView(/*clearMonitorTab*/ false);
  },
  
  treatRevolutionMsg : function(payload) {
    this.revolutionPath.addRevolutionEvent(true, payload.start_time);
    //mainPage.updateView(/*clearMonitorTab*/ false);
  },
  
  treatBleMsg : function(payload) {
    var mac = payload["mac"];
    if (!this.isValidBeacon(mac)) {
    	this.issueBeaconDoesNotExistWarning();
      return;    	
    }
    var nearestTime = payload['nearest_time'];
    var nearestLocation = this.getLocationAtTime(nearestTime);
    this.beacons.addBeaconSample(mac, nearestTime, nearestLocation); 
    this.revolutionPath.addProximityEvent(mac, nearestTime);
    mainPage.updateView(/*clearMonitorTab*/ true);
  },
  
  getGraph : function() {
    return graph;
  },
  
  dev : function() {
    console.log('revolutionPath: ' + this.revolutionPath.toString());
  },
  
  // Implementation
  
  
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
  
}