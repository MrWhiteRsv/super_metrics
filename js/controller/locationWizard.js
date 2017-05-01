var LocationWizard = function(graph) {
  this.allSegments = [];
  this.graph = graph;
  this.cornerMap = new Map();
  this.cornerMap.set("0,1->0,2", "1,2");
  this.cornerMap.set("0,2->1,2", "1,1");
  this.cornerMap.set("1,1->1,0", "0,0");
  this.cornerMap.set("1,0->0,0", "0,1");
  this.cornerMap.set("1,2->0,2", "0,1");
  this.cornerMap.set("1,1->1,2", "0,2");
  this.cornerMap.set("0,0->1,0", "1,1");
  this.cornerMap.set("0,1->0,0", "1,0");
}

LocationWizard.prototype = {
  proximityCounter : 0,
  graph : undefined,
  allSegments : undefined,
  cornerMap : undefined,

  // Add cart near beacon event.
  addProximityEvent : function(nodeId, ts) {
    this.proximityCounter++;
    if (this.allSegments.length > 1) {
      var prevAvg = this.allSegments[this.allSegments.length - 2].getAverageHeading();
      var avg = this.allSegments[this.allSegments.length - 1].getAverageHeading();
      console.log("avg: " + avg);
      console.log("(" + this.proximityCounter + ", " + (this.proximityCounter + 1) + ") Delta: " +
             (avg-prevAvg));
    }
    if (this.allSegments.length > 0) {
      this.allSegments[this.allSegments.length - 1].setEndProximityEvent(nodeId, ts);
    }
    var segmentData = new SegmentData();
    segmentData.setBeginProximityEvent(nodeId, ts);
    this.allSegments.push(segmentData);
    if (this.allSegments.length > 5) {
      this.allSegments.push();
    }
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
    if (prevNodeId == undefined) {
      return undefined;
    }
    // If the fan out is only 1, just return it.
    /*if (currentNodeId && prevNodeId) {
      var next = this.cornerMap.get(prevNodeId + "->" + currentNodeId);
      if (next) {
        return next;
      }
    }*/
    var candidates = this.getPossibleNextNode(currentNodeId, prevNodeId);
    if (candidates.length == 1) {
      return candidates[0];
    }
    // if current path length is m.t. 2x of first edge and l.t. 1.5x of second choose second.
    console.log("candidates: " + JSON.stringify(candidates));
    if (candidates.length == 2) {
      var currentLength = this.getRevolutionsInLastSegment();
      console.log('candidates[0]: ' + candidates[0]);
      var len0 = this.graph.getEdgeLength(currentNodeId, candidates[0]);
      var len1 = this.graph.getEdgeLength(currentNodeId, candidates[1]);
      console.log("c,0,1: " + currentLength + ", " + len0 + ", " + len1);
      if ((currentLength > 2 * len0) && (len1 > 1.3 * len0 || (len1 == undefined))) {
        return candidates[1];
      }
      if ((currentLength > 2 * len1) && (len0 > 1.3 * len1 || (len0 == undefined))) {
        return candidates[0];
      }
    }

    var expectedPath = [
      common.arrToNodeId([1, 0]),
      common.arrToNodeId([1, 1]),
      common.arrToNodeId([1, 2]),
      common.arrToNodeId([0, 2]),
      common.arrToNodeId([0, 1]),
      common.arrToNodeId([0, 0])
    ];
    var currentIndex = expectedPath.indexOf(currentNodeId);
    if (!currentIndex && currentIndex != 0) {
      return undefined;
    }
    var res =  expectedPath[(currentIndex + 1) % expectedPath.length];
    if ((candidates.indexOf(res) == -1) && (candidates.length > 0)) {
      return candidates[0];
    }
    return res;
  },

  getPossibleNextNode : function (currentNodeId, prevNodeId) {
    utils.assert(currentNodeId != undefined, "");
    var res = controller.getGraph().getAllNeighbors(currentNodeId);
    var index = res.indexOf(prevNodeId);
    if (index > -1) {
      res.splice(index, 1);
    }
    return res;
  }
}