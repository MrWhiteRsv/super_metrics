var adManagementTab = {

	adImage : undefined,
  
  init : function() {
    this.adImage = new Image();
    this.adImage.src = 'css/ic_blue_dot.png';
    if (false) {
    	this.adImage.onload = function () {
	  	  var canvas = document.getElementById('ad-management-bg');
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
    canvas.addEventListener("mousedown", function(event) {
					self.getCursorPosition(canvas, event);
			  }, false);
  },
  
  getCursorPosition : function(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    var height = canvas.height;
    var width = canvas.width;
    var x = (event.clientX - rect.left) / width;
    var y = (event.clientY - rect.top) / height;
    this.drawAdMarker(x, y);
    console.log("x: " + x);
  },
  
  updateView : function() {
  	console.log('updateView');
  	this.drawAdMarker(0.1, 0.3);
  },
  
  /**
   * Draw ad marker on background canvas.
   * both x and y are given in the [0.0, 1.0] range.
   */
  drawAdMarker : function(x, y) {
  	var canvas = document.getElementById('ad-management-bg');
    var ctx = canvas.getContext("2d");
    var width = canvas.width;
    var height = canvas.height;
//    ctx.drawImage(this.adImage, 30, 15);
    ctx.drawImage(this.adImage, x * width, y * height);
  },
  
  
 }