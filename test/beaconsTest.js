function testBeacons() {
  //return testAddBeacon() &&
   //   testConstructor();
   return testConstructor();
}

/**
 * Adding a beacon, and check that the mac was added.
 */
function testAddBeacon() {
  var beacons = new Beacons();
  beacons.addBeacon('34:b1:f7:d3:91:c8',
      {markerType : 'RED_MARKER', location : undefined, samples : 0});
  console.log(beacons.getAllBeaconsMac());
  if (beacons.getAllBeaconsMac().indexOf('34:b1:f7:d3:91:c8') < 0) {
    return false;
  }
  if (beacons.getBeaconMarkerType() != 'RED_MARKER') {
    return false;
  }  
}

/**
 * Test passing raw beacons via constructor.
 */
function testConstructor() {
  var rawBeacons = {
    '34:b1:f7:d3:91:c8' : {markerType : 'RED_MARKER', location : undefined, samples : 0},
    '34:b1:f7:d3:9c:cb' : {markerType : 'GREEN_MARKER', location : undefined, samples : 0},
    '34:b1:f7:d3:91:e4' : {markerType : 'BLUE_MARKER', location : undefined, samples : 0},
    '34:b1:f7:d3:9d:eb' : {markerType : 'YELLOW_MARKER', location : undefined, samples : 0},
    '34:b1:f7:d3:90:8e' : {markerType : 'PURPLE_MARKER', location : undefined, samples : 0},
  };
  var beacons = new Beacons(rawBeacons);
  return beacons.getAllBeaconsMac().length == 5;
}
