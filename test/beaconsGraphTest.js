function testBeaconsGraph() {
  return testBeaconsGraphGetEdgeLengthIsSymetric &&
      testBeaconsGraphAddEdgeTwice() && 
      testBeaconsGraphAddEdgeSymetric();
}

function testBeaconsGraphGetEdgeLengthIsSymetric() {
	var beaconsGraph = new BeaconsGraph();
  beaconsGraph.addEdgeLength('b0', 'b1', 2);
  if (beaconsGraph.getEdgeLength('b0', 'b1') != 2) {
    return false;
  }
  if (beaconsGraph.getEdgeLength('b1', 'b0') != 2) {
    return false;
  }
  return true;
}

function testBeaconsGraphAddEdgeTwice() {
	var beaconsGraph = new BeaconsGraph();
  beaconsGraph.addEdgeLength('b0', 'b1', 2);
  if (beaconsGraph.getEdgeLength('b0', 'b1') != 2) {
    return false;
  }
  beaconsGraph.addEdgeLength('b0', 'b1', 4);
  if (beaconsGraph.getEdgeLength('b0', 'b1') != 3) {
    return false;
  }
  return true;
}

function testBeaconsGraphAddEdgeSymetric() {
	var beaconsGraph = new BeaconsGraph();
  beaconsGraph.addEdgeLength('b0', 'b1', 2);
  var length = beaconsGraph.getEdgeLength('b0', 'b1');
  if (length != 2) {
    return false;
  }
  beaconsGraph.addEdgeLength('b1', 'b0', 4);
  if (beaconsGraph.getEdgeLength('b0', 'b1') != 3) {
    return false;
  }
  if (beaconsGraph.getEdgeLength('b1', 'b0') != 3) {
    return false;
  }
  return true;
}
