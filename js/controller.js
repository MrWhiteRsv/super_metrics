var controller = {

   path : undefined,
   
  /**
   * Main Entry Point.
   * Called once map is loaded.
   */
  initController : function() {
    this.path = [];
    mainPage.init();
    mqtt_listener.init();
  },
  
  treatMsg : function(type, jsonPayload) {
    var payload = JSON.parse(jsonPayload);
    switch (type) {
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
  
  treatGpsMsg : function(payload) {
    this.path.push(payload);
    console.log('gps: ' + JSON.stringify(payload));
    mainPage.updateView();
  },
  
  treatBleMsg : function(payload) {
    this.path.push(payload);
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