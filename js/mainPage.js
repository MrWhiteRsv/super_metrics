var mainPage = {

  activeTag : undefined,

  init : function() {
    monitorTab.init();
    adManagementTab.init();
    proximityTab.init();
    headingTab.init();
    distanceTab.init();

    this.activeTag = adManagementTab;
    var self = this;
    document.getElementById("ad-management-tab-title").addEventListener(
        "click",
        function() {
          self.updateView();
          self.activeTag = adManagementTab;
        });
        
    document.getElementById("monitor-tab-title").addEventListener(
        "click",
        function() {
          self.activeTag = monitorTab;
          self.updateView();
        });

    document.getElementById("proximity-tab-title").addEventListener(
        "click",
        function() {
          self.activeTag = proximityTab;
          self.updateView();
        });

    document.getElementById("distance-tab-title").addEventListener(
        "click",
        function() {
          self.activeTag = distanceTab;
          self.updateView();
        });

     document.getElementById("heading-tab-title").addEventListener(
         "click",
         function() {
           self.activeTag = headingTab;
           self.updateView();
         });

        
    document.getElementById("warning-button").addEventListener(
        "click",
        function() {
        	document.getElementById("warning-card").style.visibility = "hidden";
        });
    google.charts.setOnLoadCallback(controller.setGoogleChartsLoadedTrue);
    google.charts.load('current', {packages: ['table']}); //"corechart"
    
  },
  
  updateView : function() {
    if (this.activeTag) {
      this.activeTag.updateView();
    }
  },
  
  displayBeaconDoesNotExistWarning : function () {
  	document.getElementById("warning-card").style.visibility = "visible";
  },
}