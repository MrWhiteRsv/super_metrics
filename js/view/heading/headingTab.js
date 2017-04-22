var headingTab = {

	cartImage : undefined,

	init : function() {
		this.cartImage = new Image();
		this.cartImage.src = 'css/cart.png';
		var plan = document.getElementById("heading-plan");
		var canvas = document.getElementById("heading-canvas");
		canvas.style.height = plan.offsetHeight + 'px';
		canvas.style.width = plan.offsetWidth + 'px';
		var self = this;
	},

	updateView : function() {
		common.drawPlanBackground(document.getElementById('heading-canvas'));
		var cartLocation = controller.getCartLocation();
		if (cartLocation) {
			common.drawCart(
			    cartLocation['px'],
			    cartLocation['py'],
			    document.getElementById('heading-canvas'),
			    document.getElementById('heading-canvas'));
		}
	},

	// Implementation.
}