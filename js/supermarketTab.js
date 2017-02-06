var supermarketTab = {
  
  DispalyType :
    {
      TRAFFIC : 1,
      SPEED : 2
    },

  diplayType : undefined,
  
  init : function() {
    this.diplayType = supermarketTab.DispalyType.TRAFFIC;
    this.updateDimensions();
    var self = this;
    document.getElementById("traffic-button").addEventListener(
      "click",
      function() {
        self.diplayType = supermarketTab.DispalyType.TRAFFIC;
        self.updateView();
      });
    document.getElementById("speed-button").addEventListener(
      "click",
      function() {
        self.diplayType = supermarketTab.DispalyType.SPEED;
        self.updateView();
      });
      
    document.getElementById("analytics-link").addEventListener(
      "click",
      function() {
        controller.dev();
        //window.open("https://analytics.google.com/analytics/web/#report/app-trafficsources-overview/a82136126w130951643p134821943/%3F_u.date00%3D20161205%26_u.date01%3D20161205%26overview-graphOptions.selected%3Danalytics.nthHour/");
      });
      
    google.charts.load("current", {packages:["corechart"]});
    google.charts.setOnLoadCallback(self.drawSupermarketStayHistogram);
  },

  drawSupermarketStayHistogram : function() {
    var user_time = [['User', 'Stay']];
    for (var i = 0; i < 250; i++) {
      var rand = 0;
      for (var j = 0; j < 6; j += 1) {
        rand += Math.random();
      }
      user_time.push(['shopper' + i, rand * 35 / 6]);
    }
    var data = google.visualization.arrayToDataTable(user_time);
    var options = {
      title: 'Overall Shopping time, min.',
      fontSize: 12,
      histogram : {
        maxNumBuckets: 8,
      },
      hAxis : {
        textStyle : {
          fontSize: 6,
        } , 
      },
      vAxis : {
        textStyle : {
          fontSize: 6,
        } , 
      },

      legend: { position: 'none' },
    };
    var chart = new google.visualization.Histogram(document.getElementById('supermarket-histogram'));
    chart.draw(data, options);
    
          var data = google.visualization.arrayToDataTable([
        ["Wait Time", "Customers%", { role: "style" } ],
        ["<2", 10, "#ffeb3b"],
        ["2-6", 75, "#4caf50"],
        [">6", 15, "#d32f2f"],
      ]);

      var view = new google.visualization.DataView(data);
      view.setColumns([0, 1,
                       { calc: "stringify",
                         sourceColumn: 1,
                         type: "string",
                         role: "annotation" },
                       2]);
      var options = {
        title: "Register Wait Time, min.",
        fontSize: 12,
        legend: { position: "none" },
      };
      var chart1 = new google.visualization.ColumnChart(document.getElementById("supermarket-line-time"));
      chart1.draw(view, options);

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
      var resideTime = controller.getGraph().getEdgeResideTime(edgeId);
      var strokeStyle = undefined;
      var lineWidth = undefined;
      if (this.diplayType == supermarketTab.DispalyType.TRAFFIC) {
        strokeStyle == '#4051B5';
        lineWidth = controller.getGraph().getEdgeTrafic(edgeId) / 50.;
      } else {
        //#R D32F2F G #4CAF50 Y #FFEB3B, BL #4051B5  G #DEDEDE
        if (!resideTime) {
          strokeStyle = '#DEDEDE';
        } else if (resideTime < 2) {
          strokeStyle = '#FFEB3B';
        } else if (resideTime < 4) {
          strokeStyle = '#4CAF50';
        } else {
          lineWidth = 3;
          strokeStyle = '#D32F2F';
        }
      }
      this.drawEdge(ctx, width, height, allNodes, allEdges[edgeId], lineWidth, strokeStyle);
    }
  },
  
  drawEdge(ctx, width, height, allNodes, edge, lineWidth, strokeStyle) {
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