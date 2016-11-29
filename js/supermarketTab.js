var supermarketTab = {
  
  init : function() {
    this.updateDimensions();
  },
  
  updateDimensions : function() {
    var background = document.getElementById("supermarketTabBackground");
    var canvas = document.getElementById("supermarketTabCanvas");
    canvas.width = background.offsetWidth;
    canvas.height = background.offsetHeight;
  },
  
  updateView : function() {
    //this.updateDimensions();
    var canvas = document.getElementById("supermarketTabCanvas");
    var width = canvas.width;
    var height =  canvas.height;
    var ctx = document.getElementById("supermarketTabCanvas").getContext("2d");
    ctx.clearRect(0, 0, width, height);
    var allNodes = this.makeNodes(); 
    for (var id in allNodes) {
      this.drawNode(ctx, width, height, allNodes[id]);
    }
    var allEdges = this.makeEdges();
    for (var edgeId in allEdges) {
      this.drawEdge(ctx, width, height, allNodes, allEdges[edgeId]);
    }
  },
  
  makeEdges : function() {
    var allEdges = {};
    
    this.addEdge(allEdges, 'entrance00', 'aisleC0', 'v', 'h');
    this.addEdge(allEdges, 'entrance00', 'aisleD0', 'v', 'v');
    this.addEdge(allEdges, 'entrance00', 'registerA0', 'v', 'v');
    
    this.addEdge(allEdges, 'toilet0', 'toilet1', 'v', 'v');
    this.addEdge(allEdges, 'toilet0', 'toilet1', 'v', 'v');
    this.addEdge(allEdges, 'toilet1', 'aisleA0', 'v', 'v');
    for (var a = 0; a < 7; a++) {
      this.addEdge(allEdges, 'aisleA' + a, 'aisleA' + (a+1), 'v', 'v');
    }
    for (var i = 0; i < 9; i++) {
      this.addEdge(allEdges, 'aisleB' + i, 'aisleC' + i, 'h', 'h');
    }
    for (var i = 0; i < 8; i++) {
      this.addEdge(allEdges, 'aisleA' + i, 'aisleB' + i, 'v', 'h');
      this.addEdge(allEdges, 'aisleA' + i, 'aisleB' + (i + 1), 'v', 'h');
      this.addEdge(allEdges, 'aisleD' + i, 'aisleC' + i, 'v', 'h');
      this.addEdge(allEdges, 'aisleD' + i, 'aisleC' + (i + 1), 'v', 'h');
    }
    for (var a = 0; a < 7; a++) {
      this.addEdge(allEdges, 'aisleD' + a, 'aisleD' + (a+1), 'v', 'v');
    }
    for (var a = 0; a < 8; a++) {
      for (var r = 0; r < 5; r++) {
        this.addEdge(allEdges, 'aisleD' + a, 'registerA' + r, 'h', 'h');
      }
    }
    for (var i = 0; i < 5; i++) {
      this.addEdge(allEdges, 'registerA' + i, 'registerB' + i, 'h', 'h');
      this.addEdge(allEdges, 'registerB' + i, 'exit0', 'h', 'h');
    }
    for (var i = 0; i < 4; i++) {
      this.addEdge(allEdges, 'registerA' + i, 'registerA' + (i + 1), 'v', 'v');
    }    
    this.addEdge(allEdges, 'entrance10', 'aisleC8', 'v', 'h');
    this.addEdge(allEdges, 'entrance10', 'aisleD7', 'v', 'v');
    this.addEdge(allEdges, 'entrance10', 'registerA4', 'v', 'v');
    return allEdges;
  },
  
  makeNodes : function() {
    var nodes = {};
    this.addNodes(0.740, 0.740, 0.075, 0.075, 1, nodes, 'entrance0');
    this.addNodes(0.120, 0.120, 0.110, 0.200, 2, nodes, 'toilet');
    this.addNodes(0.120, 0.120, 0.342, 0.752, 8, nodes, 'aisleA');
    this.addNodes(0.140, 0.140, 0.315, 0.781, 9, nodes, 'aisleB');
    this.addNodes(0.610, 0.610, 0.315, 0.781, 9, nodes, 'aisleC');
    this.addNodes(0.635, 0.635, 0.342, 0.752, 8, nodes, 'aisleD');
    this.addNodes(0.740, 0.740, 0.315, 0.640, 5, nodes, 'registerA');
    this.addNodes(0.905, 0.905, 0.315, 0.640, 5, nodes, 'registerB');
    this.addNodes(0.960, 0.960, 0.480, 0.480, 1, nodes, 'exit');
    this.addNodes(0.740, 0.740, 0.920, 0.920, 1, nodes, 'entrance1');
    return nodes;
  },
  
  addEdge : function(allEdges, node0Id, node1Id, connector0, connector1) {
    var newEdge = {};
    newEdge.lineWidth = 1;
    newEdge.strokeStyle = '#CCCCCC';
    newEdge.node0Id = node0Id;
    newEdge.connector0 = connector0;
    newEdge.node1Id = node1Id;
    newEdge.connector1 = connector1;
    var edgeId = node0Id + '_' + node1Id;
    allEdges[edgeId] = newEdge;
  },
    
  drawEdge(ctx, width, height, allNodes, edge) {
    var node0 = allNodes[edge.node0Id];
    var node1 = allNodes[edge.node1Id]; 
    var p0 = {x : node0.x * width, y : node0.y * height};
    var p1 = {x : node1.x * width, y : node1.y * height};
    var a = 0.8
    c0 = {}
    c0.x = (edge.connector0 == 'h') ? (1 - a) * p0.x + a * p1.x : p0.x;
    c0.y = (edge.connector0 == 'h') ? p0.y : (1 - a) * p0.y + a * p1.y;
    c1 = {}
    c1.x = (edge.connector1 == 'h') ? (1 - a) * p1.x + a * p0.x : p1.x;
    c1.y = (edge.connector1 == 'h') ? p1.y : (1 - a) * p1.y + a * p0.y;
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.bezierCurveTo(c0.x, c0.y, c1.x, c1.y, p1.x, p1.y);
    ctx.strokeStyle = edge.strokeStyle;
    ctx.lineWidth = edge.lineWidth;
    ctx.stroke();
  },
  

  
  addNodes : function(xStart, xEnd, yStart, yEnd, n, nodes, idPrefix) {
   for (var i = 0; i < n; ++i) {
      var newNode = {};
      newNode.x = xStart + ((n == 1) ? 0 : (xEnd - xStart) * i / (n - 1));
      newNode.y = yStart + ((n == 1) ? 0 : (yEnd - yStart) * i / (n - 1));
      nodes[idPrefix + i] = newNode;
    }
  },
  
  drawNode : function(ctx, width, height, node) {
    ctx.beginPath();
    ctx.arc(node.x * width, node.y * height, 2, 0, 2 * Math.PI);
    // ctx.fillStyle = 'green';
    // ctx.fill();
    ctx.strokeStyle = '#707070';
    ctx.lineWidth = 1;
    ctx.stroke();
  },

}