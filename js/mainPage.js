var mainPage = {


  init : function() {
    monitorTab.init();
    document.getElementById("#supermarket-tab").addEventListener(
        "click",
        function() {
          monitorTab.updateView();
        });
  },
  
  updateView : function() {
    monitorTab.updateView();
  },

}