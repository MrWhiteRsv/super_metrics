var controller = {

  beaconsGraph : undefined,
  
  beacons : {
    '34:b1:f7:d3:91:c8' : {markerType : 'RED_MARKER', location : undefined, samples : 0},
    '34:b1:f7:d3:9c:cb' : {markerType : 'GREEN_MARKER', location : undefined, samples : 0},
    '34:b1:f7:d3:91:e4' : {markerType : 'BLUE_MARKER', location : undefined, samples : 0},
    '34:b1:f7:d3:9d:eb' : {markerType : 'YELLOW_MARKER', location : undefined, samples : 0},
    '34:b1:f7:d3:90:8e' : {markerType : 'PURPLE_MARKER', location : undefined, samples : 0},
  },
  
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
    this.beaconsGraph = new BeaconsGraph();
    this.revolutionPath = new RevolutionPath(this.beacons);
    this.test();
  },
  
  test : function() {
    // utils.assert(this.beaconsGraph.test()); 
    utils.assert(testBeacons()); 
    //utils.assert(testRevolutionPath()); 
  },
  
  getAllBeaconsMac : function() {
    return Object.keys(this.beacons);
  },
  
  getBeaconMarkerType : function(mac) {
    return this.beacons[mac].markerType;
  },
  
  getBeaconLocation : function(mac) {
    return this.beacons[mac].location;
  },
  
  treatMsg : function(type, jsonPayload) {
    var payload = JSON.parse(jsonPayload);
    switch (type) {
      case 'gps':
        this.treatGpsMsg_(payload);
        break;
      case 'ble':
        this.treatBleMsg_(payload);
        break;
    }
    if (type == 'gps') {
    }
  },
  
  getLocationAtTime(time_sec) {
    if (gpsPath.isEmpty() || time_sec == undefined) {
      return undefined;
    }
    return gpsPath.estimateLocation(time_sec);
  },
  
  treatGpsMsg_ : function(payload) {
    gpsPath.pushPoint(payload);
    //console.log('gps: ' + JSON.stringify(payload));
    mainPage.updateView(/*incremental*/ true);
  },
  
  treatBleMsg_ : function(payload) {
    //console.log('ble: ' + JSON.stringify(payload));
    var mac = payload["mac"];
    var nearestTime = payload['nearest_time'];
    var numberOfSamples = this.beacons[mac].samples + 1;
    this.beacons[mac].samples = numberOfSamples;
    if (numberOfSamples == 1) {
      this.beacons[mac].location = this.getLocationAtTime(nearestTime);
    } else {
      this.beacons[mac].location.lat = (this.beacons[mac].location.lat * (numberOfSamples - 1) +
       this.getLocationAtTime(nearestTime).lat) * 1.0 / numberOfSamples;
      this.beacons[mac].location.lon = (this.beacons[mac].location.lon * (numberOfSamples - 1) +
       this.getLocationAtTime(nearestTime).lon) * 1.0 / numberOfSamples;
    }
    mainPage.updateView(/*incremental*/ false);
    
    //mapRenderer.addMarker(this.beacons[mac].location.lat, this.beacons[mac].location.lon, this.beacons[mac].markerType);
  },
  
  getGraph : function() {
    return graph;
  },
  
}