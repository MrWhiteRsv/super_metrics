function testBeacons() {
  return testAddBeacon();
      //testRevolutionPath2();
}

/**
 * Adding a beacon, and check that the mac was added.
 */
function testAddBeacon() {
  var beacons = new Beacons();
  beacons.addBeacon('34:b1:f7:d3:91:c8',
      {markerType : 'RED_MARKER', location : undefined, samples : 0});
  console.log(beacons.toString());
  console.log(beacons.getAllBeaconsMac());
  return (beacons.getAllBeaconsMac().indexOf('34:b1:f7:d3:91:c8') >= 0);
}
