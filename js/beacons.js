var Beacons = function(rawBeacons) {
  this.init(rawBeacons);
}

Beacons.prototype = {
  
  mapMacToBeaconData : undefined,
  
  getAllBeaconsMac : function() {
    return Object.keys(this.mapMacToBeaconData);
  },
  
  getBeaconMarkerType : function(mac) {
    return this.mapMacToBeaconData[mac].markerType;
  },
  
  getBeaconLocation : function(mac) {
    return this.mapMacToBeaconData[mac].location;
  },
  
   getBeaconColor : function(mac) {
  	return this.mapMacToBeaconData[mac].color;
  },

  getBeaconPixLocation : function(mac) {
  	utils.assert(mac, 'undefined mac: ' + mac);
    return {px : this.mapMacToBeaconData[mac].px, py : this.mapMacToBeaconData[mac].py};
  },
    
  addBeacon(mac, beaconData) {
    this.mapMacToBeaconData[mac] = beaconData;
  },
  
  addBeaconSample : function(mac, nearestTime, nearestLocation) {
    var numberOfSamples = this.mapMacToBeaconData[mac].samples + 1;
    this.mapMacToBeaconData[mac].samples = numberOfSamples;
    if (numberOfSamples == 1) {
      this.mapMacToBeaconData[mac].location = nearestLocation;
    } else {
      this.mapMacToBeaconData[mac].location.lat =
          (this.mapMacToBeaconData[mac].location.lat * (numberOfSamples - 1) +
          nearestLocation.lat) * 1.0 / numberOfSamples;
      this.mapMacToBeaconData[mac].location.lon =
          (this.mapMacToBeaconData[mac].location.lon * (numberOfSamples - 1) +
          nearestLocation.lon) * 1.0 / numberOfSamples;
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