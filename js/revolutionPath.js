var RevolutionPath = function(beacons) {
  this.init(beacons);
}

RevolutionPath.prototype = {
  
  beacons : undefined,
  sortedEvents : undefined,  // [{type : 'proximity', ts : , mac : }, {type : 'revolution', forward: true, ts :}, ...]

  // Add cart near beacon event.
  addProximityEvent : function(mac, ts) {
    this.addEvent({
      type : 'proximity',
      mac : mac,
      ts : ts,
    });
  },
  
  addRevolutionEvent : function(forward, ts) {
    this.addEvent({
      type : 'revolution',
      forward : forward,
      ts : ts,
    });
  },


  // Return the cart's estimated pixel (x:..., y:...) in a given timesrtamp.
  getCartPixel : function(ts) {
  },

  // Compute cart's estimated location {lat:..., lng:...} at a given timesrtamp.
  getCartLatLng : function(ts) {
    // find startBeaconIndex
    // find endBeaconIndex
    // if both undefined return undefined
    // if only one is defined return the one
    // find the revolutions between the beacons
    // find the revolutions between first beacon and desired ts
    // calculate the result
    
    var endBeaconIndex = this.findFirstProximityEventIndexAfterTs(ts);
    var startBeaconIndex = this.findLastProximityEventIndexBeforeTs(ts);
    if (startBeaconIndex == undefined && endBeaconIndex == undefined) {
      return undefined;
    }
    var startBeaconMac = (startBeaconIndex == undefined) ? undefined :
        this.sortedEvents[startBeaconIndex].mac;
    var endBeaconMac = (endBeaconIndex == undefined) ? undefined :
        this.sortedEvents[endBeaconIndex].mac;
    var startBeaconLocation = (startBeaconIndex == undefined) ? undefined : 
          this.beacons.getBeaconLocation(startBeaconMac);
    var endBeaconLocation = (endBeaconIndex == undefined) ? undefined : 
        this.beacons.getBeaconLocation(endBeaconMac);      
    if (startBeaconIndex == undefined) {
      return {
        lat : endBeaconLocation.lat,
        lon : endBeaconLocation.lon,
      };
    }
    if (endBeaconIndex == undefined) {
      return {
        lat : startBeaconLocation.lat,
        lon : startBeaconLocation.lon,
      };
    }
    var segmentRevolutions = this.countRevolutionsBetweenIndices(startBeaconIndex,
        endBeaconIndex);
    if (segmentRevolutions == 0) {
      return {
        lat : startBeaconLocation.lat,
        lon : startBeaconLocation.lon,
      };
    } else {
      var segmentPrefixRevolutions = this.countRevolutionsBetweenIndexAndTs(startBeaconIndex,
          ts);    
      var alpha = segmentPrefixRevolutions * 1.0 / segmentRevolutions;
      return {
        lat : (1 - alpha) * startBeaconLocation.lat + alpha * endBeaconLocation.lat,
        lon : (1 - alpha) * startBeaconLocation.lon + alpha * endBeaconLocation.lon,
      };
    }
    
  },
  
  countRevolutionsBetweenIndices : function(indx0, indx1) {
    var result = 0;
    for (var i = indx0 + 1; i < indx1; i++) {
      if (this.sortedEvents[i].type == 'revolution') {
        result += this.sortedEvents[i].forward ? 1 : -1;
      }
    }
    return result;
  },
  
  countRevolutionsBetweenIndexAndTs : function(indx, ts) {
    var result = 0;
    for (var i = indx + 1; this.sortedEvents[i].ts < ts; i++) {
      if (this.sortedEvents[i].type == 'revolution') {
        result += this.sortedEvents[i].forward ? 1 : -1;
      }
    }
    return result;
  },
  
  findFirstProximityEventIndexAfterTs : function(ts) {
    var result = undefined;
    for (var i =  this.sortedEvents.length - 1; i >= 0; i--) {
      if ( this.sortedEvents[i].ts > ts) {
        if (this.sortedEvents[i].type == 'proximity') {
          result = i;
        }
        continue;
      }
      break;
    }
    return result;
  },
  
  findLastProximityEventIndexBeforeTs : function(ts) {
    var result = undefined;
    for (var i = 0; i < this.sortedEvents.length; i++) {
      if (this.sortedEvents[i].ts < ts) {
        if (this.sortedEvents[i].type == 'proximity') {
          result = i;
        }
        continue;
      }
      break;
    }
    return result;
  },

  toString : function() {
    return JSON.stringify(this.beacons) + '\n\n' +  
       JSON.stringify(this.sortedEvents) + '\n';
  },
    
  // Internals.
  
  init : function(beacons) {
    this.sortedEvents = [];
    this.beacons = beacons;
  },
  
  addEvent(event) {
    var sort = false;
    if (this.sortedEvents.length > 0) {
      var lastEvent = this.sortedEvents[this.sortedEvents.length - 1];
      if (event.ts < lastEvent.ts) {
        sort = true;
      }
    }
    this.sortedEvents.push(event);
    if (sort) {
      this.sortedEvents.sort(this.compareEvents);
    }    
  },
  
  compareEvents : function(e0, e1) {
    if (e0.ts < e1.ts)
      return -1;
    if (e0.ts > e1.ts)
      return 1;
    return 0;
  },
}



/*var RevolutionPath = function(beacons) {
  this.init(beacons);
}

RevolutionPath.prototype = {
  
  beacons : undefined,
  segments : undefined, // [(startMac, endMac, startTs, endTs),...]
  revolutionEvents : undefined, //[[(forward, ts),...], ...]

  // Add cart near beacon event.
  addProximityEvent : function(mac, ts) {
    // if last segment does not have a ble beacon and split 
    utils.assert(this.segments);
    utils.assert(mac);
    utils.assert(ts >= 0);
    utils.assert(this.beacons.getAllBeaconsMac().indexOf(mac) >= 0);
    var numberOfExistingSegments = this.segments.length;
    if (numberOfExistingSegments > 0) {
      var lastSegment = this.segments[numberOfExistingSegments - 1];
      if (lastSegment.ble == undefined && )
      lastSegment.endMac = mac;
      lastSegment.endTs = ts;
    }
    this.pushNewSegment(mac, ts);
  },
  
  pushNewSegment : function(mac, ts) {
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
    utils.assert(utils.isNumeric(ts));
    utils.assert(this.segments);
    utils.assert(this.revolutionEvents);
    utils.assert(this.revolutionEvents.length == this.revolutionEvents.length);    
    // if there is no first segment create first segment and restart addRevolutionEvent.
    // if exceeds last segment and last seggment does have an endMac create last segment and restart
    //     addRevolutionEvent.
    // find segmentIndex and add at end of segment.
    // if needed sort last segment.
    
    if (this.segments.length == 0) {
      this.pushNewSegment(undefined, ts);
      this.addRevolutionEvent(forward, ts);
      return;
    }
    utils.assert(this.segments.length > 0);
    var lastSegment = this.segments[this.segments.length - 1];
    if (lastSegment.endMac != undefined && ts > lastSegment.endTs) {
      this.pushNewSegment(undefined, ts);
      this.addRevolutionEvent(forward, ts);
      return;
    } 
    

    var segmentIndex = this.getContainingSegmentIndex(ts);
    if (segmentIndex == undefined) {
      return;
    }
    var maxTsInSegment = undefined;
    console.log('segmentIndex: ' + segmentIndex);
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

  // Compute cart's estimated location {lat:..., lng:...} at a given timesrtamp.

  getCartLatLng : function(ts) {
    utils.assert(this.segments);
    var segmentIndex = this.getContainingSegmentIndex(ts);
    if (segmentIndex == undefined) {
      return undefined;
    }
    var startBeacon = this.beacons[this.segments[segmentIndex].startMac];
    var segmentLength = this.getSegmentLength(segmentIndex);
    var startBeaconLocation = this.beacons.getBeaconLocation(this.segments[segmentIndex].startMac);
    if (segmentLength == 0) {
      return {
        lat : startBeaconLocation.lat,
        lon : startBeaconLocation.lon,
      };
    } else {
      var revolutionsUpToTs = this.countRevolutions(segmentIndex, ts);
      var alpah = undefined;
      var endBeaconLocation = this.beacons.getBeaconLocation(this.segments[segmentIndex].endMac);
      var alpha = revolutionsUpToTs * 1.0 / segmentLength;
      return {
        lat : (1 - alpha) * startBeaconLocation.lat + alpha * endBeaconLocation.lat,
        lon : (1 - alpha) * startBeaconLocation.lon + alpha * endBeaconLocation.lon,
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
    if (this.segments.length == 0) {
      return undefined;
    }
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
  
  getStartTimeSec : function() {
    utils.assert(this.segments);
    if (this.segments.length == 0) {
      return undefined;
    } 
    return this.segments[0].startTs;
  },
  
  getEndTimeSec : function() {
    utils.assert(this.segments);
    if (this.segments.length == 0) {
      return undefined;
    } 
    return this.segments[this.segments.length - 1].endTs;
  },
}*/