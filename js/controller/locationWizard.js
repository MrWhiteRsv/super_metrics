var LocationWizard = function(graph) {
  this.sortedEvents = [];
  this.graph = graph;
}

LocationWizard.prototype = {
  
  graph : undefined,
  sortedEvents : undefined,  // [{type : 'proximity', ts : , nodeId : }, {type : 'revolution', forward: true, ts :}, ...]

  getAllHeadingAngles : function() {
    var result = [];
    var counter = 0;
    for (var i = this.sortedEvents.length - 1; i >= 0 && counter < 500; i--) {
      if (this.sortedEvents[i].type == 'heading') {
        counter++;
        result.push(this.sortedEvents[i].direction);
      }
    }
    return result;
  },

  getLatestHeading : function() {
    for (var i = this.sortedEvents.length - 1; i >= 0 ; i--) {
      if (this.sortedEvents[i].type == 'heading') {
        return this.sortedEvents[i].direction;
      }
    }
    return undefined;
  },

  // Add cart near beacon event.
  addProximityEvent : function(nodeId, ts) {
    this.addEvent({
      type : 'proximity',
      nodeId : nodeId,
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

  addHeadingEvent : function(direction, ts) {
    this.addEvent({
      type : 'heading',
      direction : direction,
      ts : ts,
    });
  },

  // Return the cart's estimated pixel {px :..., py :...}.
  // Both coordinates are in the [0.0, 1.0] range.
  getCartLocation : function() {
    var currentNodeId =  this.findLatestNearbyNodeId();
  	if (!currentNodeId) {
  		return undefined;
  	}
  	var expectedNextNodeId = this.guessNextNode(currentNodeId);
  	var currentNodeLocation = this.graph.getNodeLocation(currentNodeId);
  	var dist = this.graph.getEdgeLength(currentNodeId, expectedNextNodeId);
    if (!dist) {
  		return currentNodeLocation;
  	}
  	var nextNodeLovation = this.graph.getNodeLocation(expectedNextNodeId);
  	var revSinceLastBeacon = this.countRevolutionsSinceLatestProximityEvent();
  	var alpha = revSinceLastBeacon/ dist * 1.0;
    if (alpha < 0.0) {
  		return currentNodeLocation;
  	}
    if (alpha > 1.0) {
  		return nextNodeLovation;
  	}
  	var res = {px : (1 - alpha) * currentNodeLocation.px + alpha * nextNodeLovation.px,
  	    py : (1 - alpha) * currentNodeLocation.py + alpha * nextNodeLovation.py}
  	return res
  },

  findLatestNearbyNodeId : function() {
    for (var i = this.sortedEvents.length - 1; i >= 0 ; i--) {
    	if (this.sortedEvents[i].type == 'proximity') {
    		return this.sortedEvents[i].nodeId;
    	}
    }
    return undefined;
  },

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

  // Internals.

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
    if (this.sortedEvents.length > 900) {
      this.sortedEvents.shift();
    }
  },

  compareEvents : function(e0, e1) {
    if (e0.ts < e1.ts)
      return -1;
    if (e0.ts > e1.ts)
      return 1;
    return 0;
  },

  guessNextNode : function(currentNodeId) {
    var expectedPath = [
      common.arrToNodeId([1, 0]),
      common.arrToNodeId([1, 1]),
      common.arrToNodeId([1, 2]),
      common.arrToNodeId([0, 2]),
      common.arrToNodeId([0, 1]),
      common.arrToNodeId([0, 0])
    ];

    var index = expectedPath.indexOf(currentNodeId);
    if (!index && index != 0) {
      return undefined;
    }
    var res =  expectedPath[(index + 1) % expectedPath.length];
    return res;
  },
}

