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
  },
  
  updateView : function(clearMonitorTab) {
    if (clearMonitorTab) {
      monitorTab.clearAndUpdateView();
    } else {
      monitorTab.updateView();
    }
  },
}