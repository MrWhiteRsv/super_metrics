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

  // Return the cart's estimated pixel {px :..., py :...} getCartPixel.
  // Both coordinates are in the [0.0, 1.0] range.
  getCartPixel : function(beaconsGraph, nextBeacon) {
  	var currentBeacon =  this.findLatestNearbyBeacon();
  	if (!currentBeacon) {
  		return undefined;
  	}
  	var currentBeaconPix = this.beacons.getBeaconPixLocation(currentBeacon);
  	if (!nextBeacon) {
  		return currentBeaconPix;
  	}
  	var dist = beaconsGraph.getEdgeLength(currentBeacon, nextBeacon);
  	var nextBeaconPix = this.beacons.getBeaconPixLocation(nextBeacon);
  	var revSinceLastBeacon = this.countRevolutionsSinceLatestProximityEvent();
  	var alpha = revSinceLastBeacon/ dist * 1.0;
    if (alpha < 0.0) {
  		return currentBeaconPix;
  	}
    if (alpha > 1.0) {
  		return nextBeaconPix;
  	}
  	var res = {px : (1 - alpha) * currentBeaconPix.px + alpha * nextBeaconPix.px,
  	    py : (1 - alpha) * currentBeaconPix.py + alpha * nextBeaconPix.py}
  	return res
  },

  // Compute cart's estimated location {lat:..., lng:...} at a given timesrtamp.
  getCartLatLng : function(ts) {
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
  
  findLatestNearbyBeacon : function() {
    for (var i = this.sortedEvents.length - 1; i >= 0 ; i--) {
    	if (this.sortedEvents[i].type == 'proximity') {
    		return this.sortedEvents[i].mac;
    	}
    }
    return undefined;
  },
  
  // Internals.
  
  countRevolutionsSinceLatestProximityEvent : function() {
    var result = 0;
    for (var i = this.sortedEvents.length - 1; i >= 0 ; i--) {
      if (this.sortedEvents[i].type == 'revolution') {
        result += this.sortedEvents[i].forward ? 1 : -1;
      }
			if (this.sortedEvents[i].type == 'proximity') {
    		break;
    	}
    }
    return result;
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

