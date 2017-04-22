var Graph = function() {
  this.init();
}

Graph.prototype = {
  allEdges : undefined,
  mapBeaconIdToNodeId : undefined,
  mapNodeIdToBeaconId : undefined,
  mapNodeIdToNodeInfo : undefined,
  
  init : function() {
    this.allEdges = new Map();
    this.mapBeaconIdToNodeId = new Map();
    this.mapNodeIdToBeaconId = new Map();
    this.mapNodeIdToNodeInfo = new Map();
  },

  upsertNode : function(nodeId, px, py) {
    var nodeInfo = {
      px : px,
      py : py
    };
    this.mapNodeIdToNodeInfo.set(nodeId, nodeInfo);
    console.log("allNodes.length: " + this.getAlNodes().length);
  },

  bindNodeAndBeacon : function(nodeId, beaconId) {
    utils.assert(nodeId, "missing nodeId");
    utils.assert(beaconId, "missing beaconId")
    utils.assert(!this.mapNodeIdToBeaconId.has(nodeId), "binding a bound node.");
    utils.assert(!this.mapBeaconIdToNodeId.has(beaconId), "binding a bound beacon.");
    this.mapNodeIdToBeaconId.set(nodeId, beaconId);
    this.mapBeaconIdToNodeId.set(beaconId, nodeId);
  },

  unbindBeacon : function(beaconId) {
    this.unbindNodeAndBeacon(tnis.getNodesBeacon(beaconId), beaconId);
  },

  getNodeLocation : function(nodeId) {
    var nodeinfo = this.mapNodeIdToNodeInfo.get(nodeId);
    return {
      px : nodeinfo.px, py : nodeinfo.py
    };
  },

  getBeaconsNode : function(beaconId) {
    return this.mapBeaconIdToNodeId.get(beaconId);
  },

  getAlNodes : function() {
    return Array.from(this.mapNodeIdToNodeInfo.keys() )
  },

  toString : function() {
    return JSON.stringify(this);	
  },
  
  addEdgeLength  : function(n0, n1, edgeLength) {
    var edgeId = this.edgeId(n0, n1);
    if (edgeId in this.allEdges) {
      var numOfValues = this.allEdges[edgeId].allValues.length;
      utils.assert(numOfValues > 0);
      this.allEdges[edgeId].edgeLength = 
          (this.allEdges[edgeId].edgeLength * numOfValues + edgeLength) / (numOfValues + 1.0);
      this.allEdges[edgeId].allValues.push(edgeLength);
    } else {
      this.allEdges[edgeId] = {edgeLength : edgeLength, allValues : [edgeLength]};
    }
  },
  
  getEdgeLength : function(n0, n1) {
    var edgeId = this.edgeId(n0, n1);
    if (edgeId in this.allEdges) {
      var result = this.allEdges[edgeId].edgeLength;
      utils.assert(result >= 0);
      return result;
    } else {
      return undefined;
    }
  },
  
  toString : function() {
  	return JSON.stringify(this);
  },

  log : function() {
    console.log("allEdges:");
    console.log(this.allEdges);
    console.log("mapBeaconIdToNodeId:");
    console.log(this.mapBeaconIdToNodeId);
    console.log("mapNodeIdToBeaconId:");
    console.log(this.mapNodeIdToBeaconId);
    console.log("mapNodeIdToNodeInfo;");
    console.log(this.mapNodeIdToNodeInfo);
  },

  // Implimantation.
  
  edgeId : function(n0, n1) {
  	return n0 > n1 ? n0 + ',' + n1 : n1 + ',' + n0;
  },
  
  updateGraph : function() {
  },

  unbindNodeAndBeacon : function(nodeId, beaconId) {
    utils.assert(nodeId, "missing nodeId");
    utils.assert(beaconId, "missing beaconId")
    utils.assert(this.mapNodeIdToBeaconId.has(nodeId), "unbinding an unbound node.");
    utils.assert(this.mapBeaconIdToNodeId.has(beaconId), "unbinding an unbound beacon.");
    utils.assert(this.mapNodeIdToBeaconId.get(nodeId).equals(beaconId), "");
    utils.assert(this.mapBeaconIdToNodeId.get(beaconId).equals(nodeId), "");
    this.mapNodeIdToBeaconId.delete(nodeId);
    this.mapBeaconIdToNodeId.delete(beaconId);
  },
}