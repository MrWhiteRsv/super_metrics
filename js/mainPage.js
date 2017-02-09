var mainPage = {

  init : function() {
    monitorTab.init();
    supermarketTab.init();
    document.getElementById("#supermarket-tab").addEventListener(
        "click",
        function() {
          supermarketTab.updateView();
        });
    document.getElementById("#monitor-tab").addEventListener(
        "click",
        function() {
          monitorTab.updateView();
        });
    document.getElementById("warning-button").addEventListener(
        "click",
        function() {
        	document.getElementById("warning-card").style.visibility = "hidden";
        });
  },
  
  updateView : function(clearMonitorTab) {
    if (clearMonitorTab) {
      monitorTab.clearAndUpdateView();
    } else {
      monitorTab.updateView();
    }
  },
  
  displayBeaconDoesNotExistWarning : function () {
  	document.getElementById("warning-card").style.visibility = "visible";
  },
}