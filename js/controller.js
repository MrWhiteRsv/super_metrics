var controller = {

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
    if (gpsPath.isEmpty()) {
      return undefined;
    }
    return gpsPath.estimateLocation(time_sec);
  },
  
  treatGpsMsg_ : function(payload) {
    gpsPath.pushPoint(payload);
    console.log('gps: ' + JSON.stringify(payload));
    mainPage.updateView();
  },
  
  treatBleMsg_ : function(payload) {
    console.log('ble: ' + JSON.stringify(payload));
  },
  
  getGraph : function() {
    return graph;
  },
  
}