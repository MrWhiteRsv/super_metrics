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
          self.updateView();
          self.activeTag = monitorTab;
        });

    document.getElementById("proximity-tab-title").addEventListener(
        "click",
        function() {
          self.updateView();
          self.activeTag = proximityTab;
        });

    document.getElementById("distance-tab-title").addEventListener(
        "click",
        function() {
          self.updateView();
          self.activeTag = distanceTab;
        });

     document.getElementById("heading-tab-title").addEventListener(
         "click",
         function() {
           self.updateView();
           self.activeTag = headingTab;
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