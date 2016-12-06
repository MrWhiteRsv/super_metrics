var mapRenderer = {

  itemMarkers : undefined,
  map : undefined,
  
  init : function() {
    this.itemMarkers = [];
    var mapDiv = document.getElementById('map-div');
    mapDiv.style.height = '500px';
    mapDiv.style.width = '500px';
    var mapCanvas = document.getElementById('map-div');
    var mapOptions = {
        center: new google.maps.LatLng(37.318215925, -122.011804918),
        zoom: 19,
        mapTypeControl : false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(mapCanvas, mapOptions);
  },
  
  /**
   * Compute a marker for every entry in trip, and set map accordiangly.
   * Returns the computed itemMarkers.
   */
  addMarker : function(latitude, longitude, type) {
    utils.assert(type);
    var latLng = new google.maps.LatLng(latitude, longitude);
    var marker = new google.maps.Marker({
      position : latLng,
      map : this.map,
    });
    this.setMarkerIcon(marker, type);
    this.itemMarkers.push(marker);
  },
  
  removeAllMarkers_ : function() {
    var length = this.itemMarkers.length;
    for (var i = 0; i < length; i++) {
      this.itemMarkers[i].setMap(null);
    }
    this.itemMarkers.length = 0;
  }, 

  setMarkerIcon : function(marker, type) {
    var iconUrl = config[type];
    marker.setIcon({
      scaledSize : new google.maps.Size(16, 16),
      anchor : new google.maps.Point(8, 16),
      url : iconUrl,
    });
  },
  
  /**
   * Pan map to a given latitude,longitude pair.
   */
  panTo : function(latitude, longitude) {
    this.map.panTo(new google.maps.LatLng(latitude, longitude));
  },

}