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
    utils.assert(nodeId, "missing nodeId");
    var nodeinfo = this.mapNodeIdToNodeInfo.get(nodeId);
    return {
      px : nodeinfo.px, py : nodeinfo.py
    };
  },

  getBeaconsNode : function(beaconId) {
    return this.mapBeaconIdToNodeId.get(beaconId);
  },

  getAllNodes : function() {
    return Array.from(this.mapNodeIdToNodeInfo.keys());
  },

  // TODO(oded): fix this hard coded ASAP
  getAllNeighbors : function(nodeId) {
    switch (nodeId) {
      case '0,0':
        return ['0,1', '1,0'];
      case '0,1':
        return ['0,0', '1,1', '0,2'];
      case '0,2':
        return ['0,1', '1,2'];
      case '1,0':
        return ['1,1', '0,0'];
      case '1,1':
        return ['1,0', '0,1', '1,2'];
      case '1,2':
        return ['1,1', '0,2'];
    }
    utils.assert(false, "");
  },

  toString : function() {
    return JSON.stringify(this);	
  },

  addEdge : function(n0, n1) {
    var edgeId = common.edgeId(n0, n1);
    utils.assert(!(edgeId in this.allEdges), "");
    this.allEdges[edgeId] = {edgeLength : undefined, allValues : []};
  },

  addEdgeLength : function(n0, n1, edgeLength) {
    var edgeId = common.edgeId(n0, n1);
    utils.assert(edgeId in this.allEdges, "");
    var numOfValues = this.allEdges[edgeId].allValues.length;
    this.allEdges[edgeId].edgeLength = (numOfValues) == 0 ? edgeLength :
        (this.allEdges[edgeId].edgeLength * numOfValues + edgeLength) / (numOfValues + 1.0);
    this.allEdges[edgeId].allValues.push(edgeLength);
  },
  
  getEdgeLength : function(n0, n1) {
    var edgeId = common.edgeId(n0, n1);
    return (edgeId in this.allEdges) ? this.allEdges[edgeId].edgeLength : undefined;
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

  // Implementation.

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