var adManagementTab = {
  
  EDIT_MODE : {
    VIEW: 0,
    ADD: 1,
    REMOVE: 2
  },
  
	adMarker : undefined,
	editMode : undefined,
  

  init : function() {
    this.adMarker = new Image();
    this.adMarker.src = 'css/markers/marker.png';
    this.editMode = this.EDIT_MODE.REMOVE;
    var plan = document.getElementById("ad-management-plan");
    var canvas = document.getElementById("ad-management-canvas");
    canvas.style.height = plan.offsetHeight + 'px';
    canvas.style.width = plan.offsetWidth + 'px';
    var self = this;
    canvas.addEventListener("mousedown", function(event) {
					self.treatCanvasMouseDown(canvas, event);
			  }, false);
  	var button = document.getElementById("ad-mannagement-button");
  	button.addEventListener("click", function(event) {
  		console.log('bla');
  		switch (self.editMode) {
	  		case self.EDIT_MODE.ADD:
	  		  self.editMode = self.EDIT_MODE.REMOVE;
	  		  break;
	  	  case self.EDIT_MODE.REMOVE:
	  	    self.editMode = self.EDIT_MODE.VIEW;
	  		  break;
	  		case self.EDIT_MODE.VIEW:
	  		  self.editMode = self.EDIT_MODE.ADD;
	  		  break;
	  	} 
	  	self.updateView.bind(self);
	  	self.updateView();
  	}, false);
  },
  
  updateView : function() {  
  	var button = document.getElementById("ad-mannagement-button");
  	switch (this.editMode) {
  		case this.EDIT_MODE.ADD:
  		  button.children[0].childNodes[0].data = "add";
  		  break;
  	  case this.EDIT_MODE.REMOVE:
  		  button.children[0].childNodes[0].data = "remove";
  		  break;
  		case this.EDIT_MODE.VIEW:
  		  button.children[0].childNodes[0].data = "create";
  		  break;
  	}  	  	
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
    this.addTextToNode(card, "Discount: %" + content.discount_percent);
    this.addTextToNode(card, "ingredients: " + content.ingredients);
    
    var product_card = document.getElementById("product-card");
    var children = product_card.childNodes;
    var title_child = undefined;
		for (child in children) {
			var childClassName = children[child].className;
			if (childClassName && childClassName.includes('mdl-card__title')) {
				title_child = children[child];
			}
		}
		if (title_child) {
			var path = "url('css/products/" + content.images[0] + "')";
			title_child.style.backgroundImage = path;
		}
		this.addTextToNode(card, "Advertise: " + (true ? 'on' : 'off'));
  },
  
  addTextToNode : function(node, str) {
    var para = document.createElement("p");
    var textNode = document.createTextNode(str);
    para.appendChild(textNode);
    node.appendChild(para); 	
  },
  
 }