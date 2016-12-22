var controller = {
  
  newBeacons : undefined,
  revolutionPath : undefined,
  
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
    //this.beaconsGraph = new BeaconsGraph();
    this.newBeacons = new Beacons();
    this.initBeacons();
    this.revolutionPath = new RevolutionPath(this.newBeacons);
    this.test();
  },
  
  initBeacons : function() {
    this.newBeacons.addBeacon('34:b1:f7:d3:91:c8',
      {markerType : 'RED_MARKER', location : undefined, samples : 0});
    this.newBeacons.addBeacon('34:b1:f7:d3:9c:cb',
      {markerType : 'GREEN_MARKER', location : undefined, samples : 0});
    this.newBeacons.addBeacon('34:b1:f7:d3:91:e4',
      {markerType : 'BLUE_MARKER', location : undefined, samples : 0});
    this.newBeacons.addBeacon('34:b1:f7:d3:9d:eb',
      {markerType : 'YELLOW_MARKER', location : undefined, samples : 0});
    this.newBeacons.addBeacon('34:b1:f7:d3:90:8e',
      {markerType : 'PURPLE_MARKER', location : undefined, samples : 0});
  },
  
  test : function() {
    // utils.assert(this.beaconsGraph.test()); 
    utils.assert(testBeacons()); 
    utils.assert(testRevolutionPath()); 
  },

  getAllBeaconsMac : function() {
    return this.newBeacons.getAllBeaconsMac();
  },
  
  getBeaconMarkerType : function(mac) {
    return this.newBeacons.getBeaconMarkerType(mac);
  },
  
  getBeaconLocation : function(mac) {
    return this.newBeacons.getBeaconLocation(mac);
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
    var nearestTime = payload['nearest_time'];
    var nearestLocation = this.getLocationAtTime(nearestTime);
    this.newBeacons.addBeaconSample(mac, nearestTime, nearestLocation); 
    this.revolutionPath.addProximityEvent(mac, nearestTime);
    mainPage.updateView(/*clearMonitorTab*/ true);
    //mapRenderer.addMarker(this.beacons[mac].location.lat, this.beacons[mac].location.lon, this.beacons[mac].markerType);
  },
  
  getGraph : function() {
    return graph;
  },
  
  dev : function() {
    console.log('revolutionPath: ' + this.revolutionPath.toString());
  },
  
}