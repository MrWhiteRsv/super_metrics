var Beacons = function() {
  this.init();
}

Beacons.prototype = {
  
  mapMacToBeaconData : undefined,
  
  getAllBeaconsMac : function() {
    return Object.keys(this.mapMacToBeaconData);
  },
  
  getBeaconMarkerType : function(mac) {
  //  return this.beacons[mac].markerType;
  },
  
  getBeaconLocation : function(mac) {
  //  return this.beacons[mac].location;
  },
  
  getBeacon : function(mac) {
  },
  
  addBeacon(mac, beaconData) {
    this.mapMacToBeaconData[mac] = beaconData;
  },
  
  toString : function() {
    return JSON.stringify(this);
  },
    
  // Internals.
  
  init : function() {
    this.mapMacToBeaconData = {};
  },
}