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
    var allNodes = controller.getGraph().getNodes();
    utils.assert(allNodes);
    for (var id in allNodes) {
      this.drawNode(ctx, width, height, allNodes[id]);
    }
    var allEdges = controller.getGraph().getEdges();
    utils.assert(allEdges);
    for (var edgeId in allEdges) {
      this.drawEdge(ctx, width, height, allNodes, allEdges[edgeId], controller.getGraph().getEdgeTrafic(edgeId) / 50.);
    }
  },
  
  drawEdge(ctx, width, height, allNodes, edge, lineWidth) {
    
    var strokeStyle = edge.strokeStyle;
    if (lineWidth < 1) {
      lineWidth = 1;
      strokeStyle = '#EEEEEE';
    }
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
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  },
  
  drawNode : function(ctx, width, height, node) {
    ctx.beginPath();
    ctx.arc(node.x * width, node.y * height, 2, 0, 2 * Math.PI);
    ctx.strokeStyle = '#707070';
    ctx.lineWidth = 1;
    ctx.stroke();
  },

}