function testRevolutionPath() {
  return testRevolutionPath0();
}

function testRevolutionPath0() {
  var beacons = {
    'a' : {location : {lat : 10, lon : 0}},
    'b' : {location : {lat : 10, lon : 10}},
  };
  var revolutionPath = new RevolutionPath(beacons);
  revolutionPath.init(beacons);
  revolutionPath.addProximityEvent('a', 0);
  revolutionPath.addProximityEvent('b', 1);
  revolutionPath.addRevolutionEvent(true, 0.5);
  if (revolutionPath.getCartLatLng(0.25).lon != 0.0) {
    return false;
  }
  if (revolutionPath.getCartLatLng(0.75).lon != 10.0) {
    return false;
  }
  return true;
}

function testRevolutionPath1() {
  var beacons = {
    'a' : {location : {lat : 10, lon : 0}},
    'b' : {location : {lat : 10, lon : 10}},
    'c' : {location : {lat : 10, lon : 20}},
  };
  var revolutionPath = new RevolutionPath(beacons);
  revolutionPath.init(beacons);
  revolutionPath.addProximityEvent('a', 0);
  revolutionPath.addProximityEvent('b', 1);
  revolutionPath.addProximityEvent('c', 2);
  revolutionPath.addRevolutionEvent(true, 1.25);
  revolutionPath.addRevolutionEvent(true, 1.75);
  revolutionPath.addRevolutionEvent(true, 1.5);
  console.log(revolutionPath.toString());
  return true;
}