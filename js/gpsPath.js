var gpsPath = {
  
  path : undefined,
  
  init : function() {
     this.path = [];
  },
  
  /**
   * @param {Object} point with lat, lon, and start_time fields.
   */
  pushPoint : function(point) {
    utils.assert(this.path);
    this.path.push(point);
  },
  
  estimateLocation : function(time_sec) {
    utils.assert(this.path);
    utils.assert(!this.isEmpty());
    var length = this.path.length;
    if (time_sec <= this.getStartTimeSec()) {
      return this.path[0];
    }
    if (time_sec >= this.getEndTimeSec()) {
      return this.path[length - 1];
    }
    var i, t1, t0;
    for (i = 0; i < length - 1; i++) {
      var t0 = this.getTimeSec(i);
      var t1 = this.getTimeSec(i + 1);
      utils.assert(t1 > t0);
      if (t0 <= time_sec && t1 >= time_sec) {
        break;
      }
    }
    utils.assert(i < (length - 1));
    var lat0 = this.path[i].lat;
    var lat1 = this.path[i + 1].lat;
    var lon0 = this.path[i].lon;
    var lon1 = this.path[i + 1].lon;
    var alpha = (time_sec - t0) / (t1 - t0); 
    res = {};
    res.lat = (1 - alpha) * lat0 + alpha * lat1;
    res.lon = (1 - alpha) * lon0 + alpha * lon1;
    res.time_sec = time_sec;
    return res;
  },
  
  getTimeSec : function(index) {
    utils.assert(this.path);
    utils.assert(!this.isEmpty());
    utils.assert(index >= 0);
    utils.assert(index < this.path.length);
    return this.path[index].start_time;
  },
  
  getStartTimeSec : function() {
    utils.assert(this.path);
    utils.assert(!this.isEmpty());
    return this.path[0].start_time;
  },
  
  getEndTimeSec : function() {
    utils.assert(this.path);
    utils.assert(!this.isEmpty());
    return this.path[this.path.length - 1].start_time;
  },
  
  isEmpty : function() {
    utils.assert(this.path); 
    return this.path.length == 0; 
  },
  
}
