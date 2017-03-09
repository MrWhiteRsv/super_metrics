var Beacons = function(rawBeacons) {
  this.init(rawBeacons);
}

Beacons.prototype = {
  
  mapMacToBeaconData : undefined,
  
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
  
  getBeaconMarkerType : function(mac) {
    return this.mapMacToBeaconData[mac].markerType;
  },
  
  getBeaconColor : function(mac) {
  	return this.mapMacToBeaconData[mac].color;
  },

  getBeaconPixLocation : function(mac) {
  	utils.assert(mac, 'undefined mac: ' + mac);
    return {px : this.mapMacToBeaconData[mac].px, py : this.mapMacToBeaconData[mac].py};
  },
  
  getBeaconRecentRssi : function(mac) {
    return this.mapMacToBeaconData[mac].recentRssi;
  },
    
  addBeacon(mac, beaconData) {
    this.mapMacToBeaconData[mac] = beaconData;
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
  
  init : function(rawBeacons) {
    this.mapMacToBeaconData = rawBeacons ? rawBeacons : {};
  },
}