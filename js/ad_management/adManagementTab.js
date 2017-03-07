var adManagementTab = {

	adMarker : undefined,
  
  init : function() {
    this.adMarker = new Image();
    //this.adMarker.src = 'css/ic_blue_dot.png';
    this.adMarker.src = 'css/marker.png';
    if (false) {
    	this.adMarker.onload = function () {
	  	  var canvas = document.getElementById('ad-management-canvas');
	      var ctx = canvas.getContext("2d");
	      ctx.drawImage(this, 30, 15);
	      ctx.drawImage(this, 88, 110);
	      ctx.drawImage(this, 150, 200);
	      ctx.drawImage(this, 150, 220);
	      ctx.drawImage(this, 318, 57);
	      ctx.drawImage(this, 525, 210);
	      ctx.drawImage(this, 480, 40);
	      ctx.drawImage(this, 535, 60);
	      ctx.drawImage(this, 555, 70);
	    }
		}
    var plan = document.getElementById("ad-management-plan");
    var canvas = document.getElementById("ad-management-canvas");
    canvas.style.height = plan.offsetHeight + 'px';
    canvas.style.width = plan.offsetWidth + 'px';
    var self = this;
    canvas.addEventListener("mousedown", function(event) {
					self.treatCanvasMouseDown(canvas, event);
			  }, false);
  },
  
  updateView : function() {
  	var allProducts = controller.getAllProducts();
  	for (var i = 0; i < allProducts.length; i++) {
  		this.drawAdMarker(allProducts[i].location_px.px, allProducts[i].location_px.py);
  	}
  },
  
  /* Implementation */
 
  /**
   * display details of the product corresponding to the clicked marker.
   */
  treatCanvasMouseDown : function(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    var height = canvas.height;
    var width = canvas.width;
    var x = (event.clientX - rect.left) / width;
    var y = (event.clientY - rect.top) / height;
    var uuid = controller.getNearestProductUuid(x, y);
    if (uuid) {
    	var productDetails = controller.getProductDetails(uuid);
    	if (productDetails) {
    	  this.renderProductCard(document.getElementById("product-card-details"), productDetails);
    	}
    }
  },
  
  /**
   * Draw ad marker on background canvas.
   * both x and y are given in the [0.0, 1.0] range.
   */
  drawAdMarker : function(x, y) {
  	var canvas = document.getElementById('ad-management-canvas');
    var ctx = canvas.getContext("2d");
    var width = canvas.width;
    var height = canvas.height;
    ctx.drawImage(this.adMarker, x * width - 10, y * height - 30, 20, 30);
  },
  
  /**
   * Render the content of the card on the card itself.
   */
  renderProductCard : function(card, content) {
		while (card.hasChildNodes()) {
      card.removeChild(card.lastChild);
    }
    this.addTextToNode(card, "Name: " + content.name);
    this.addTextToNode(card, "Description: " + content.description);
    this.addTextToNode(card, "Price: " + content.price);
    this.addTextToNode(card, "Ingridiants: " + content.ingridiants);
  },
  
  addTextToNode : function(node, str) {
    var para = document.createElement("p");
    var textNode = document.createTextNode(str);
    para.appendChild(textNode);
    node.appendChild(para); 	
  	
  }
 }