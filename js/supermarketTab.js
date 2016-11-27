var supermarketTab = {
  
    init : function() {
    var mapCanvas = document.getElementById('map-div');
    var mapOptions = {
        center: new google.maps.LatLng(44.5403, -78.5463),
        zoom: 5,
        mapTypeControl : false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    var map = new google.maps.Map(mapCanvas, mapOptions);
    setTimeout(function () {
        google.maps.event.trigger(map, 'resize');
        map.setCenter(mapOptions.center);
    }, 500);
  },
  
  updateView : function() {
    console.log('updateView');
  },

}