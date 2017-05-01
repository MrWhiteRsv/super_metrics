SegmentData = function(graph) {
  this.revolutionEvents = [];
  this.headingEvents = [];
}

SegmentData.prototype = {
  beginProximityEvent : undefined,
  endProximityEvent : undefined,
  headingEvents : undefined,
  revolutionEvents : undefined,
  revolutionsCounter : 0,
  headingsSum : 0,

  setBeginProximityEvent : function(nodeId, ts) {
    this.beginProximityEvent = {
      nodeId : nodeId,
      ts : ts,
    };
  },

  setEndProximityEvent : function(nodeId, ts) {
    this.endProximityEvent = {
      nodeId : nodeId,
      ts : ts,
    };
  },

  addRevolutionEvent : function(forward, ts) {
    this.addEvent(this.revolutionEvents, {
      type : 'revolution',
      forward : forward,
      ts : ts,
    });
    this.revolutionsCounter += forward ? 1 : -1;
  },

  addHeadingEvent : function(direction, ts) {
    this.addEvent(this.headingEvents, {
      type : 'heading',
      direction : direction,
      ts : ts,
    });
    this.headingsSum += direction;
  },

  getBeginProximityEvent : function() {
    return this.beginProximityEvent;
  },

  getEndProximityEvent : function() {
    return this.endProximityEvent;
  },

  getRevolutionsCount : function() {
    return this.revolutionsCounter;
  },

  getAverageHeading : function() {
    if (this.headingsSum == 0) {
      return 0;
    }
    return this.headingsSum / this.headingEvents.length;
  },

  getLastHeading : function() {
    return this.headingEvents.length > 0 ?
        this.headingEvents[this.headingEvents.length - 1].direction : undefined;
  },

  pushAllHeadings : function(res) {
    for (var i = 0; i < this.headingEvents.length; i++) {
      res.push(this.headingEvents[i].direction);
    }
  },

  toString : function() {
    return JSON.stringify(this.beginProximityEvent) + '\n\n' +
       JSON.stringify(this.endProximityEvent) + '\n\n' +
       JSON.stringify(this.revolutionEvents) + '\n\n' +
       JSON.stringify(this.sortedEvents) + '\n';
  },

  /* Implementation */
  addEvent : function(container, event) {
    var sort = false;
    if (container.length > 0) {
      var lastEvent = container[container.length - 1];
      if (event.ts < lastEvent.ts) {
        sort = true;
      }
    }
    container.push(event);
    if (sort) {
      container.sort(this.compareEvents);
    }
  },

  compareEvents : function(e0, e1) {
    if (e0.ts < e1.ts)
      return -1;
    if (e0.ts > e1.ts)
      return 1;
    return 0;
  },
}