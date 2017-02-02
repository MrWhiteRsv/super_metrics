var mapRenderer = {

  dots : undefined,
  markers : undefined,
  map : undefined,
  segments : undefined,
  
  init : function() {
    this.dots = [];
    this.markers = [];
    this.segments = [];
    var mapDiv = document.getElementById('map-div');
    mapDiv.style.height = '700px';
    mapDiv.style.width = '1000px';
    var mapCanvas = document.getElementById('map-div');
    var mapOptions = {
        center: new google.maps.LatLng(37.318215925, -122.011804918),
        zoom: 19,
        mapTypeControl : false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(mapCanvas, mapOptions);
  },
  
  addMarker : function(latitude, longitude, type) {
    utils.assert(type);
    var latLng = new google.maps.LatLng(latitude, longitude);
    var marker = new google.maps.Marker({
      position : latLng,
      map : this.map,
    });
    this.setMarkerIcon(marker, type);
    this.markers.push(marker);
  },
  
  removeAllMarkers : function() {
    var length = this.markers.length;
    for (var i = 0; i < length; i++) {
      this.markers[i].setMap(null);
    }
    this.markers.length = 0;
  },
  
  setMarkerIcon : function(marker, type) {
    var iconUrl = config[type];
    marker.setIcon({
      scaledSize : new google.maps.Size(24, 24),
      anchor : new google.maps.Point(12, 24),
      url : iconUrl,
    });
  },
  
  addDot : function(latitude, longitude, type) {
    utils.assert(type);
    var latLng = new google.maps.LatLng(latitude, longitude);
    var marker = new google.maps.Marker({
      position : latLng,
      map : this.map,
    });
    this.setDotIcon(marker, type);
    this.dots.push(marker);
  },
  
  setDotIcon : function(dot, type) {
    var iconUrl = config[type];
    dot.setIcon({
      scaledSize : new google.maps.Size(8, 8),
      anchor : new google.maps.Point(4, 4),
      url : iconUrl,
    });
  },
  
  removeAllDots : function() {
    var length = this.dots.length;
    for (var i = 0; i < length; i++) {
      this.dots[i].setMap(null);
    }
    this.dots.length = 0;
  }, 
  
  removeAllSegments : function() {
    var length = this.segments.length;
    for (var i = 0; i < length; i++) {
      this.segments[i].setMap(null);
    }
    this.segments.length = 0;
  }, 
  
  /**
   * Pan map to a given latitude,longitude pair.
   */
  panTo : function(latitude, longitude) {
    this.map.panTo(new google.maps.LatLng(latitude, longitude));
  },

  drawSegment : function(p0, p1) {
    var coordinates = [
      {lat: p0.lat, lng: p0.lon},
      {lat: p1.lat, lng: p1.lon}
    ];
    var singleSegment = new google.maps.Polyline(
        {
          path: coordinates,
          geodesic: true,
          strokeColor: '#3030303',
          strokeOpacity: 1.0,
          strokeWeight: 1
        });
   singleSegment.setMap(this.map);
   this.segments.push(singleSegment);
  },
}