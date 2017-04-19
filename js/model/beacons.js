var Beacons = function(rawBeacons) {
  this.init(rawBeacons);
}

Beacons.prototype = {
  
  mapMacToBeaconData : undefined,

  init : function() {
   this.mapMacToBeaconData = {};
  },
  
  getAllBeaconsMac : function() {
    return Object.keys(this.mapMacToBeaconData);
  },
  
  getBeaconAverageRssi : function(mac) {
  	result = undefined;
  	if (mac in this.mapMacToBeaconData) {
      result = this.mapMacToBeaconData[mac].avgRssi;
    }
    return result;
  },
  
  getBeaconRecentRssi : function(mac) {
    return this.mapMacToBeaconData[mac].recentRssi;
  },
    
  addBeacon(mac) {
    this.mapMacToBeaconData[mac] = {
      avgRssi : undefined,
      samples : 0,
      recentRssi : undefined,
    };
  },

  removeBeacon(mac) {
    delete this.mapMacToBeaconData[mac];
  },
 
  addBeaconSample : function(mac, rssi) {
    var numberOfSamples = this.mapMacToBeaconData[mac].samples + 1;
    this.mapMacToBeaconData[mac].samples = numberOfSamples;
    this.mapMacToBeaconData[mac].recentRssi = rssi;
    if (numberOfSamples == 1) {
      this.mapMacToBeaconData[mac].avgRssi = rssi;
    } else {
      this.mapMacToBeaconData[mac].avgRssi =
          (this.mapMacToBeaconData[mac].avgRssi * (numberOfSamples - 1) + rssi) * 1.0 /
           numberOfSamples;
    }
  },
  
  toString : function() {
    return JSON.stringify(this);
  },
    
  // Internals.

}