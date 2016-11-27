var mainPage = {


  init : function() {
    var mapDiv = document.getElementById('map-div');
    mapDiv.style.height = '500px';
    mapDiv.style.width = '500px';  
    supermarketTab.init()
    document.getElementById("#supermarket-tab").addEventListener(
        "click",
        function() {
          supermarketTab.updateView();
        });
  },
  
  updateView : function() {
    
  },

}