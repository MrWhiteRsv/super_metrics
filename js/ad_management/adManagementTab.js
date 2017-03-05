var adManagementTab = {

	cartImage : undefined,
  
  init : function() {
   
    this.cartImage = new Image();
    this.cartImage.src = 'css/cart.png';
    if (false) {
    	this.cartImage.onload = function () {
	  	  var canvas = document.getElementById('monitor-bg');
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
    var canvas = document.getElementById("ad-management-bg");
    canvas.style.height = plan.offsetHeight + 'px';
    canvas.style.width = plan.offsetWidth + 'px';
    var self = this;
  },
 }