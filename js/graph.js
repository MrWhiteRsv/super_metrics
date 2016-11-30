var graph = {
  nodes : undefined,
  allEdges : undefined,
  
  build : function() {
    this.allEdges = {};
    this.nodes = {};
    this.buildNodes();
    this.buildEdges();
  },
  
  getNodes : function() {
    return this.nodes;
  },
  
  getEdges : function() {
    return this.allEdges;
  },
    
  setEdgeTrafic : function(edgeId, trafic) {
    var edge = this.allEdges[edgeId];
    utils.assert(edge);
    edge.traficPplHr = trafic;
  },
  
  setEdgeResideTime : function(edgeId, resideTimeMnts) {
    var edge = this.allEdges[edgeId];
    utils.assert(edge);
    edge.resideTimeMnts = resideTimeMnts;
  },
  
  getEdgeTrafic : function(edgeId) {
    var edge = this.allEdges[edgeId];
    utils.assert(edge);
    return edge.traficPplHr;
  },
  
  getEdgeResideTime : function(edgeId) {
    var edge = this.allEdges[edgeId];
    utils.assert(edge);
    return edge.resideTimeMnts;
  },
  
  buildEdges : function() {
    this.addEdge('entrance00', 'aisleC0', 'v', 'h');
    this.addEdge('entrance00', 'aisleD0', 'v', 'v');
    this.addEdge('entrance00', 'registerA0', 'v', 'v');
    this.addEdge('toilet0', 'toilet1', 'v', 'v');
    this.addEdge('toilet0', 'toilet1', 'v', 'v');
    this.addEdge('toilet1', 'aisleA0', 'v', 'v');
    for (var a = 0; a < 7; a++) {
      this.addEdge('aisleA' + a, 'aisleA' + (a + 1), 'v', 'v');
    }
    for (var i = 0; i < 9; i++) {
      this.addEdge('aisleB' + i, 'aisleC' + i, 'h', 'h');
    }
    for (var i = 0; i < 8; i++) {
      this.addEdge('aisleA' + i, 'aisleB' + i, 'v', 'h');
      this.addEdge('aisleA' + i, 'aisleB' + (i + 1), 'v', 'h');
      this.addEdge('aisleD' + i, 'aisleC' + i, 'v', 'h');
      this.addEdge('aisleD' + i, 'aisleC' + (i + 1), 'v', 'h');
    }
    for (var a = 0; a < 7; a++) {
      this.addEdge('aisleD' + a, 'aisleD' + (a + 1), 'v', 'v');
    }
    for (var a = 0; a < 8; a++) {
      for (var r = 0; r < 5; r++) {
        this.addEdge('aisleD' + a, 'registerA' + r, 'h', 'h');
      }
    }
    for (var i = 0; i < 5; i++) {
      this.addEdge('registerA' + i, 'registerB' + i, 'h', 'h');
      this.addEdge('registerB' + i, 'exit0', 'h', 'h');
    }
    for (var i = 0; i < 4; i++) {
      this.addEdge('registerA' + i, 'registerA' + (i + 1), 'v', 'v');
    }    
    this.addEdge('entrance10', 'aisleC8', 'v', 'h');
    this.addEdge('entrance10', 'aisleD7', 'v', 'v');
    this.addEdge('entrance10', 'registerA4', 'v', 'v');
  },
  
  buildNodes : function() {
    this.addNodes(0.740, 0.740, 0.075, 0.075, 1, 'entrance0');
    this.addNodes(0.120, 0.120, 0.110, 0.200, 2, 'toilet');
    this.addNodes(0.120, 0.120, 0.342, 0.752, 8, 'aisleA');
    this.addNodes(0.140, 0.140, 0.315, 0.781, 9, 'aisleB');
    this.addNodes(0.610, 0.610, 0.315, 0.781, 9, 'aisleC');
    this.addNodes(0.635, 0.635, 0.342, 0.752, 8, 'aisleD');
    this.addNodes(0.740, 0.740, 0.315, 0.640, 5, 'registerA');
    this.addNodes(0.905, 0.905, 0.315, 0.640, 5, 'registerB');
    this.addNodes(0.960, 0.960, 0.480, 0.480, 1, 'exit');
    this.addNodes(0.740, 0.740, 0.920, 0.920, 1, 'entrance1');
  },
  
  addEdge : function(node0Id, node1Id, connector0, connector1) {
    var newEdge = {};
    newEdge.lineWidth = 1;
    newEdge.strokeStyle = '#CCCCCC';
    newEdge.node0Id = node0Id;
    newEdge.connector0 = connector0;
    newEdge.node1Id = node1Id;
    newEdge.connector1 = connector1;
    var edgeId = node0Id + '_' + node1Id;
    this.allEdges[edgeId] = newEdge;
  },
  
  addNodes : function(xStart, xEnd, yStart, yEnd, n, idPrefix) {
   for (var i = 0; i < n; ++i) {
      var newNode = {};
      newNode.x = xStart + ((n == 1) ? 0 : (xEnd - xStart) * i / (n - 1));
      newNode.y = yStart + ((n == 1) ? 0 : (yEnd - yStart) * i / (n - 1));
      this.nodes[idPrefix + i] = newNode;
    }
  },

  setEdgeTraficWithNoise : function(edgeId, trafic) {
    this.allEdges[edgeId].traficPplHr = trafic * Math.random();
  },
    
  mockEdgeTraficVolume : function() {
    var allEdges = this.getEdges();
    for (var edgeId in allEdges) {
      this.setEdgeTrafic(edgeId, 5);
    }
    
    this.setEdgeTraficWithNoise('entrance00_aisleC0', 300);
    this.setEdgeTraficWithNoise('entrance00_aisleD0', 250);
    this.setEdgeTraficWithNoise('entrance00_registerA0', 200);
    this.setEdgeTraficWithNoise('toilet0_toilet1', 200);

    for (var i = 1; i < 8; i++) {
      this.setEdgeTraficWithNoise('aisleB' + i + '_' + 'aisleC' + i, 250);
    }
   
    for (var a = 0; a < 8; a++) {
      for (var r = 0; r < 5; r++) {
        this.setEdgeTraficWithNoise('aisleD' + a + '_' + 'registerA' + r, 100);
      }
    }
    
    for (var i = 0; i < 5; i++) {
      this.setEdgeTraficWithNoise('registerA' + i + '_' + 'registerB' + i, 300);
    }
    
    for (var i = 0; i < 4; i++) {
      this.setEdgeTraficWithNoise('registerA' + i + '_' + 'registerA' + (i + 1), 50);
    }
    this.setEdgeTraficWithNoise('entrance10' + '_' + 'aisleC8', 200);
    this.setEdgeTraficWithNoise('entrance10' + '_' + 'aisleD7', 400);
    this.setEdgeTraficWithNoise('entrance10' + '_' + 'registerA4', 150);
    
    this.setEdgeTrafic('toilet1_aisleA0', this.getEdgeTrafic('toilet0_toilet1'));
    for (var a = 0; a < 7; a++) {
      var val = this.getEdgeTrafic('aisleB' + a + '_' + 'aisleC' + a);
      val = val + this.getEdgeTrafic('aisleB' + (a + 1) + '_' + 'aisleC' + (a + 1));
      val = val * 0.5;
      this.setEdgeTraficWithNoise('aisleA' + a + '_' + 'aisleA' + (a + 1), val);
      this.setEdgeTraficWithNoise('aisleD' + a + '_' + 'aisleD' + (a + 1), val);
    }
    
   this.setEdgeTrafic('aisleB0_aisleC0', this.getEdgeTrafic('entrance00_aisleC0'));
   this.setEdgeTrafic('aisleA0_aisleB0', this.getEdgeTrafic('entrance00_aisleC0'));
   
   this.setEdgeTrafic('aisleB8_aisleC8', this.getEdgeTrafic('entrance10_aisleC8'));
   this.setEdgeTrafic('aisleA7_aisleB8', this.getEdgeTrafic('entrance10_aisleC8'));
    for (var i = 1; i < 7; i++) {
      var val = 0.5 * this.getEdgeTrafic('aisleB' + i + '_' + 'aisleC' + i);
      this.setEdgeTrafic('aisleA' + (i - 1) + '_' + 'aisleB' + i, val);
      this.setEdgeTrafic('aisleA' + i + '_' + 'aisleB' + i, val);
      this.setEdgeTrafic('aisleD' + (i - 1) + '_' + 'aisleC' + i,  val);
      this.setEdgeTrafic('aisleD' + i + '_' + 'aisleC' + i, val);
    }
    for (var i = 0; i < 5; i++) {
      this.setEdgeTrafic(
          'registerB' + i + '_' + 'exit0',
          this.getEdgeTrafic('registerA' + i + '_' + 'registerB' + i));
    }
  },
  
  mockEdgeTraficSpeed : function() {
    var allEdges = this.getEdges();
    for (var edgeId in allEdges) {
      this.setEdgeResideTime(edgeId, 6 * Math.random());
    }
    for (var a = 0; a < 8; a++) {
      for (var r = 0; r < 5; r++) {
        this.setEdgeResideTime('aisleD' + a + '_' + 'registerA' + r, undefined);
      }
    }
    for (var i = 0; i < 5; i++) {
      this.setEdgeResideTime('registerB' + i + '_' + 'exit0', undefined);
    }
  },
}