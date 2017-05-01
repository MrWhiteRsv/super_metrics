var LocationWizard = function(graph) {
  this.allSegments = [];
  this.graph = graph;
}

LocationWizard.prototype = {
  
  graph : undefined,
  allSegments : undefined,

  // Add cart near beacon event.
  addProximityEvent : function(nodeId, ts) {
    if (this.allSegments.length > 0) {
      this.allSegments[this.allSegments.length - 1].setEndProximityEvent(nodeId, ts);
    }
    var segmentData = new SegmentData();
    segmentData.setBeginProximityEvent(nodeId, ts);
    this.allSegments.push(segmentData);
  },

  addRevolutionEvent : function(forward, ts) {
    if (this.allSegments.length == 0) {
      return;
    }
    this.allSegments[this.allSegments.length - 1].addRevolutionEvent(forward, ts);
  },

  addHeadingEvent : function(direction, ts) {
    if (this.allSegments.length == 0) {
      return;
    }
    this.allSegments[this.allSegments.length - 1].addHeadingEvent(direction, ts);
  },

  getAllHeadingAngles : function() {
    var result = [];
    for (var i = this.allSegments.length - 1; i >= 0; i--) {
      this.allSegments[i].pushAllHeadings(result);
    }
    return result;
  },

  getLatestHeading : function() {
    for (var i = this.allSegments.length - 1; i >= 0; i--) {
      var heading = this.allSegments[i].getLastHeading();
      if (heading != undefined) {
       return heading;
      }
    }
    return undefined;
  },

  // Return the cart's estimated pixel {px :..., py :...}.
  // Both coordinates are in the [0.0, 1.0] range.
  getCartLocation : function() {
    var currentNodeId =  this.findLatestNearbyNodeId();
  	if (!currentNodeId) {
  		return undefined;
  	}
  	var prevNodeId = this.findPrevNearbyNodeId();
  	var expectedNextNodeId = this.guessNextNode(currentNodeId, prevNodeId);
  	var currentNodeLocation = this.graph.getNodeLocation(currentNodeId);
  	var dist = this.graph.getEdgeLength(currentNodeId, expectedNextNodeId);
    if (!dist) {
  		return currentNodeLocation;
  	}
  	var nextNodeLovation = this.graph.getNodeLocation(expectedNextNodeId);
  	var alpha = this.getRevolutionsInLastSegment() / dist * 1.0;
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

  getRevolutionsInLastSegment : function() {
    return this.allSegments[this.allSegments.length - 1].getRevolutionsCount();
  },

  // Internals.

  findLatestNearbyNodeId : function() {
    if (this.allSegments.length == 0) {
      return undefined;
    }
    return this.allSegments[this.allSegments.length - 1].getBeginProximityEvent().nodeId;
  },

  findPrevNearbyNodeId : function() {
    if (this.allSegments.length < 2) {
      return undefined;
    }
    return this.allSegments[this.allSegments.length - 2].getBeginProximityEvent().nodeId;
   },

  toString : function() {
    return JSON.stringify(this.beacons) + '\n\n' +
       JSON.stringify(this.sortedEvents) + '\n';
  },

  guessNextNode : function(currentNodeId, prevNodeId) {
    var expectedPath = [
      common.arrToNodeId([1, 0]),
      common.arrToNodeId([1, 1]),
      common.arrToNodeId([1, 2]),
      common.arrToNodeId([0, 2]),
      common.arrToNodeId([0, 1]),
      common.arrToNodeId([0, 0])
    ];

    if (currentNodeId && prevNodeId) {
      var cornerMap = new Map();
      cornerMap.set("0,1->0,2", "1,2");
      cornerMap.set("0,2->1,2", "1,1");
      cornerMap.set("1,1->1,0", "0,0");
      cornerMap.set("1,0->0,0", "0,1");
      cornerMap.set("1,2->0,2", "0,1");
      cornerMap.set("1,1->1,2", "0,2");
      cornerMap.set("0,0->1,0", "1,1");
      cornerMap.set("0,1->0,0", "1,0");
      var next = cornerMap.get(prevNodeId + "->" + currentNodeId);
      if (next) {
        return next;
      }
    }

    var currentIndex = expectedPath.indexOf(currentNodeId);
    if (!currentIndex && currentIndex != 0) {
      return undefined;
    }

    var res =  expectedPath[(currentIndex + 1) % expectedPath.length];
    return res;
  },
}