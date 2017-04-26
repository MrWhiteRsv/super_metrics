var Beacons = function(rawBeacons) {
  this.init(rawBeacons);
}

Beacons.prototype = {
  mapMacToBeaconData : undefined,
  adaptiveBleThreshold : true,
  nearby_hard_coded_threshold : -48,
  away_hard_coded_threshold : -53,

  init : function() {
   this.mapMacToBeaconData = {};
   adaptiveBleThreshold = false;
  },
  
  getAllBeaconsMac : function() {
    return Object.keys(this.mapMacToBeaconData);
  },

  getAdaptiveBleThreshold: function() {
    return this.adaptiveBleThreshold;
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
    if (this.adaptiveBleThreshold) {
      var samples = this.mapMacToBeaconData[mac].samples;
      if (samples < 2) {
        return this.mapMacToBeaconData[mac].nearbyManualThreshold;
      } else {
        return this.getBeaconAverageRssi(mac) + 5;
      }
    }
    return this.mapMacToBeaconData[mac].nearbyManualThreshold;
  },

  getAwayThreshold : function(mac) {
    if (this.adaptiveBleThreshold) {
      var samples = this.mapMacToBeaconData[mac].samples;
      if (samples < 2) {
        return this.mapMacToBeaconData[mac].awayManualThreshold;
      } else {
        return this.getBeaconAverageRssi(mac) - 5;
      }
    }
    return this.mapMacToBeaconData[mac].awayManualThreshold;
  },

  setAdaptiveBleThreshold: function(value) {
  	this.adaptiveBleThreshold = value;
  },

  setAwayManualThreshold(mac, value) {
    utils.assertIsString(mac, "");
    utils.assertIsInteger(value, "");
    utils.assert(this.mapMacToBeaconData[mac], "undefined: " + mac);
    this.mapMacToBeaconData[mac].awayManualThreshold = value;
  },

  setNearbyManualThreshold(mac, value) {
    utils.assertIsString(mac, "");
    utils.assertIsInteger(value, "");
    utils.assert(this.mapMacToBeaconData[mac], "undefined: " + mac);
    this.mapMacToBeaconData[mac].nearbyManualThreshold = value;
  },


  addBeacon(mac) {
    this.mapMacToBeaconData[mac] = {
      avgRssi : undefined,
      samples : 0,
      recentRssi : undefined,
      nearbyManualThreshold : this.nearby_hard_coded_threshold,
      awayManualThreshold : this.away_hard_coded_threshold,
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

  resetThresholds : function() {
    var allBeacons = this.getAllBeaconsMac();
    for (var i = 0; i < allBeacons.length; ++i) {
      this.mapMacToBeaconData[allBeacons[i]].nearbyManualThreshold =
          this.nearby_hard_coded_threshold;
      this.mapMacToBeaconData[allBeacons[i]].awayManualThreshold =
          this.away_hard_coded_threshold;
    }
    return Object.keys(this.mapMacToBeaconData);
  },

  toString : function() {
    return JSON.stringify(this);
  },
    
  // Internals.

}