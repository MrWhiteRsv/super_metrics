var mainPage = {


  init : function() {
    supermarketTab.init();
    document.getElementById("#supermarket-tab").addEventListener(
        "click",
        function() {
          supermarketTab.updateView();
        });
  },
  
  updateView : function() {
    supermarketTab.updateView();
  },

}