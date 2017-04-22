var mainPage = {

  init : function() {
    monitorTab.init();
    adManagementTab.init();
    proximityTab.init();
    headingTab.init();
    distanceTab.init();

    document.getElementById("ad-management-tab-title").addEventListener(
        "click",
        function() {
          adManagementTab.updateView();
        });
        
    document.getElementById("monitor-tab-title").addEventListener(
        "click",
        function() {
          monitorTab.updateView();
        });

    document.getElementById("proximity-tab-title").addEventListener(
        "click",
        function() {
          proximityTab.updateView();
        });

    document.getElementById("distance-tab-title").addEventListener(
        "click",
        function() {
          distanceTab.updateView();
        });

     document.getElementById("heading-tab-title").addEventListener(
         "click",
         function() {
           headingTab.updateView();
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
    monitorTab.updateView();
    adManagementTab.updateView();
  },
  
  displayBeaconDoesNotExistWarning : function () {
  	document.getElementById("warning-card").style.visibility = "visible";
  },
}