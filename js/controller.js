var controller = {

   // path : undefined,
   
  /**
   * Main Entry Point.
   * Called once map is loaded.
   */
  initController : function() {
    // this.path = [];
    mainPage.init();
    gpsPath.init();
    mqtt_listener.init();
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
  
  
  
  
  
  
  /*testController : function() {
    this.testMqtt();
  },
  
  testMqtt : function() {
    console.log('testing');
    //this.initMqtt();
  },*/
  
}