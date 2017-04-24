var Beacons = function(rawBeacons) {
  this.init(rawBeacons);
}

Beacons.prototype = {
  
  mapMacToBeaconData : undefined,

  init : function() {
   this.mapMacToBeaconData = {};
  },
  
  getAllBeaconsMac : function() {
    //return Array.from(this.mapMacToBeaconData.keys() )
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

  getNearbyThreshold : function(mac) {
    return this.mapMacToBeaconData[mac].nearbyManualThreshold;
    /*if (this.getAdaptiveBleThreshold()) {
      var average = this.getBeacons().getBeaconAverageRssi(mac);
      return average == undefined ? undefined : average + 10;
    } else {
      return -50;
    } */
  },

  getAwayThreshold : function(mac) {
    return this.mapMacToBeaconData[mac].awayManualThreshold;
    /*if (this.getAdaptiveBleThreshold()) {
      var average = this.getBeacons().getBeaconAverageRssi(mac);
      return average == undefined ? undefined : average + 10;
    } else {
      return -50;
    }*/
  },

  setNearbyManualThreshold(mac, value) {
    utils.assertIsString(mac, "");
    utils.assertIsInteger(value, "");
    utils.assert(this.mapMacToBeaconData[mac], "undefined: " + mac);
    this.mapMacToBeaconData[mac].nearbyManualThreshold = value;
  },

  setAwayManualThreshold(mac, value) {
    this.mapMacToBeaconData[mac].awayManualThreshold = value;
  },

  addBeacon(mac) {
    this.mapMacToBeaconData[mac] = {
      avgRssi : undefined,
      samples : 0,
      recentRssi : undefined,
      nearbyManualThreshold : -60,
      awayManualThreshold : -70,
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