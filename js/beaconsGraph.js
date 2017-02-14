var BeaconsGraph = function() {
  this.init();
}

BeaconsGraph.prototype = {
  
  allEdges : undefined,
  
  init : function() {
    this.allEdges = {}; 
  },
    
  addEdgeLength  : function(beaconId0, beaconId1, edgeLength) {
    var edgeId = this.edgeId(beaconId0, beaconId1);
    if (edgeId in this.allEdges) {
      var numOfValues = this.allEdges[edgeId].allValues.length;
      utils.assert (numOfValues > 0);
      this.allEdges[edgeId].edgeLength = 
          (this.allEdges[edgeId].edgeLength * numOfValues + edgeLength) / (numOfValues + 1.0);
      this.allEdges[edgeId].allValues.push(edgeLength);
    } else {
      this.allEdges[edgeId] = {edgeLength : edgeLength, allValues : [edgeLength]};
    }
  },
  
  getEdgeLength : function(beaconId0, beaconId1) {
    var edgeId = this.edgeId(beaconId0, beaconId1);
    if (edgeId in this.allEdges) {
      var result = this.allEdges[edgeId].edgeLength;
      utils.assert(result);
      utils.assert(result > 0);
      return result;
    } else {
      return undefined;
    }
  },
  
  toString : function() {
    return JSON.stringify(this);
  },
  
  test : function() {
    this.init();
    this.addEdgeLength('b0', 'b1', 2);
    var length = this.getEdgeLength('b0', 'b1');
    if (length != 2) {
      return false;
    }
    this.addEdgeLength('b0', 'b1', 4);
    length = this.getEdgeLength('b0', 'b1');
    if (length != 3) {
      return false;
    }
    return true;
  },
  
  // Implimantation.
  
  edgeId : function(beaconId0, beaconId1) {
  	return beaconId0 > beaconId1 ? beaconId0 + ',' + beaconId1 :
  	    beaconId0 + ',' + beaconId1;
  },
  
  updateGraph : function() {
  },
}