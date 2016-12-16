var RevolutionPath = function() {
  this.init();
}

RevolutionPath.prototype = {
  
  segments : undefined, // [(starMac, endMac, startTs, endTs),...]
  revolutionEvents : undefined, //[[(direction, ts),...], ...]

  // Add cart near beacon event.
  addProximityEvent : function(mac, timestamp) {
    console.log('addProximityEvent mac: ' + mac + ', timestamp: ' + timestamp);
  },
  
  // Add cart revolution event.
  addRevolutionEvent : function(direction, timestamp) {
    console.log('addRevolutionEvent direction: ' + direction + ', timestamp: ' + timestamp);
  },
  
  // Set beacons location {lat:..., lng:...}.
  setBeaconLatLng : function(mac, location) {
    console.log('setBeaconLatLng mac: ' + mac + ', location: ' + location);
  },
  
  // Set beacons location {lat:..., lng:...}.
  setBeaconPixel : function(mac, pixel) {
    console.log('setBeaconPixel mac: ' + mac + ', pixel: ' + pixel);
  },

  // Return the cart's estimated pixel (x:..., y:...) in a given timesrtamp.
  getCartPixel : function(timestamp) {
  },

  // Return the cart's estimated location {lat:..., lng:...} in a given timesrtamp.
  getCartLatLng : function(timestamp) {
  },

  test : function() {
    return true;
  },
  
  // Internals.
  
  init : function() {
  },
}