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
    //supermarketTab.updateView();
  },
  
  updateView : function(incremental) {
    monitorTab.updateView(incremental);
    //supermarketTab.updateView();
  },
  
}