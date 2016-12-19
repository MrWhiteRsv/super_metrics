var RevolutionPath = function(beacons) {
  this.init(beacons);
}

RevolutionPath.prototype = {
  
  beacons : undefined,
  segments : undefined, // [(startMac, endMac, startTs, endTs),...]
  revolutionEvents : undefined, //[[(forward, ts),...], ...]

  // Add cart near beacon event.
  addProximityEvent : function(mac, ts) {
    utils.assert(this.segments);
    utils.assert(mac);
    utils.assert(ts >= 0);
    utils.assert(mac in this.beacons);
    console.log('addProximityEvent mac: ' + mac + ', ts: ' + ts);
    var numberOfExistingSegments = this.segments.length;
    if (numberOfExistingSegments > 0) {
      var lastSegment = this.segments[numberOfExistingSegments - 1];
      lastSegment.endMac = mac;
      lastSegment.endTs = ts;
    }
    var newSegment = {
        startMac : mac,
        endMac : undefined,
        startTs : ts,
        endTs : undefined
      };
    this.segments.push(newSegment);
    this.revolutionEvents.push([]);
  },
  
  // Add cart revolution event.
  addRevolutionEvent : function(forward, ts) {
    utils.assert(this.segments);
    utils.assert(this.revolutionEvents);
    utils.assert(this.revolutionEvents.length == this.revolutionEvents.length);
    console.log('addRevolutionEvent forward: ' + forward + ', ts: ' + ts);
    var segmentIndex = this.getContainingSegmentIndex(ts);
    var maxTsInSegment = undefined;
    var revolutionsInSegment = this.revolutionEvents[segmentIndex].length;
    if (revolutionsInSegment > 0) {
      maxTsInSegment = this.revolutionEvents[segmentIndex][revolutionsInSegment - 1].ts;
    }
    this.revolutionEvents[segmentIndex].push({forward : forward, ts : ts});
    if (maxTsInSegment && maxTsInSegment > ts) {
      this.revolutionEvents[segmentIndex].sort(this.compareRevolutionEvents);
    }
  },

  // Return the cart's estimated pixel (x:..., y:...) in a given timesrtamp.
  getCartPixel : function(ts) {
    utils.assert(this.segments);
  },

  /**
   * Compute cart's estimated location {lat:..., lng:...} at a given timesrtamp.
   */
  getCartLatLng : function(ts) {
    utils.assert(this.segments);
    var segmentIndex = this.getContainingSegmentIndex(ts);
    if (segmentIndex == undefined) {
      return undefined;
    }
    var startBeacon = this.beacons[this.segments[segmentIndex].startMac];
    var segmentLength = this.getSegmentLength(segmentIndex);
    var startBeacon = this.beacons[this.segments[segmentIndex].startMac];
    if (segmentLength == 0) {
      return {
        lat : startBeacon.location.lat,
        lon : startBeacon.location.lon,
      };
    } else {
      var revolutionsUpToTs = this.countRevolutions(segmentIndex, ts);
      var alpah = undefined;
      var endBeacon = this.beacons[this.segments[segmentIndex].endMac];
      var alpha = revolutionsUpToTs * 1.0 / segmentLength;
      return {
        lat : (1 - alpha) * startBeacon.location.lat + alpha * endBeacon.location.lat,
        lon : (1 - alpha) * startBeacon.location.lon + alpha * endBeacon.location.lon,
      };
    }
  },

  toString : function() {
    return JSON.stringify(this.beacons) + '\n\n' +  
       JSON.stringify(this.segments) + '\n' +
       JSON.stringify(this.revolutionEvents);
  },
    
  // Internals.
  
  init : function(beacons) {
    utils.assert(beacons);
    this.beacons = beacons;
    this.segments = [];
    this.revolutionEvents = [];
  },
  
  getContainingSegmentIndex : function(ts) {
    if (ts < this.segments[0].startTs) {
      return undefined;
    }
    for (var i = 0; i < this.segments.length; i++) {
      if (this.segments[i].startTs <= ts && this.segments[i].endTs >= ts) {
        return i;
      }
    }
    this.segments.length - 1;
  },

  countRevolutions : function(segmentIndex, maxTs) {
    var result = 0;
    var segmentRevolutions = this.revolutionEvents[segmentIndex];
    for (var i = 0; i < segmentRevolutions.length && segmentRevolutions[i].ts <= maxTs; i++) {
      result = result + (segmentRevolutions[i].forward ? 1 : -1);
    }
    return result;
  }, 
  
  getSegmentLength : function(segmentIndex) {
    utils.assert(segmentIndex != undefined);
    var result = 0;
    var segmentRevolutions = this.revolutionEvents[segmentIndex];
    for (var i = 0; i < segmentRevolutions.length; i++) {
      result = result + (segmentRevolutions[i].forward ? 1 : -1);
    }
    return result;
  },
  
  compareRevolutionEvents : function(a, b) {
    if (a.ts < b.ts)
      return -1;
    if (a.ts > b.ts)
      return 1;
    return 0;
  },
}