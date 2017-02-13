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

  // Return the cart's estimated pixel {px :..., py :...} getLatestCartPixel.
  // Both coordinates are in the [0.0, 1.0] range.
  getLatestCartPixel : function() {
  	// Find the latest beacon.
  	// Find the next beacon.
  	// Find the distance between these.
  	// Find the pixel of both beacons.
  	return {px : 0.8 ,py : 0.4 }
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
    if (startBeaconIndex == undefined || endBeaconIndex == undefined) {
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

