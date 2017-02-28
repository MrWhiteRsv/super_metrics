function testLearnDistance() {
	controller.setHardCodedBeaconDistance(false);
	controller.init();
  var beaconsGraph = controller.getBeaconsGraph();
  var redMac = '34:b1:f7:d3:91:f8';
  var greenMac = '34:b1:f7:d3:9c:cb';
  console.log('beaconsGraph: ' + beaconsGraph);
  if (beaconsGraph.getEdgeLength(redMac, greenMac) != undefined) {
    return false;
  }
  fakeBleProximityEvent(redMac);
  for (var forwardCounter = 0; forwardCounter < 30; forwardCounter++) {
    fakeRevolutionEvent(/*forwardCounter*/ forwardCounter,
        /*backwardCounter*/0, true);
  } 
     return true;
	fakeBleProximityEvent(greenMac);
  if (beaconsGraph.getEdgeLength(redMac, greenMac) != 30) {
    return false;
  }

  for (forwardCounter = 0; forwardCounter < 40; forwardCounter++) {
    fakeRevolutionEvent(/*forwardCounter*/ forwardCounter,
        /*backwardCounter*/0, true);
  }
  fakeBleProximityEvent(redMac);
  if (beaconsGraph.getEdgeLength(redMac, greenMac) != 35) {
    return false;
  }
  return true;
}

function fakeRevolutionEvent(forwardCounter, backwardCounter, forwardRevolution) {
	//{"start_time": 1487295518.0, "forward_counter": 7, "backward_counter": 0, "forward_revolution": true}
  timeInSec = (new Date).getTime() / 1000.0;
  payload = {
   	start_time: timeInSec,
   	backward_counter: backwardCounter,
   	forward_counter: forwardCounter,
    forward_revolution: forwardRevolution,
  };
  controller.treatMsg(/*type*/ 'revolution', JSON.stringify(payload));	
}

function fakeBleProximityEvent(mac) {
  //{nearest_rssi: -63, start_time: 1487806925.385415, mac: "34:b1:f7:d3:9c:cb",
  // nearest_time: 1487806925.385415, end_time: 1487806967.589564}
  var timeInSec = (new Date).getTime() / 1000.0;
  var payload = {
   	nearest_rssi: -60,
   	start_time: timeInSec,
   	mac: mac,
    nearest_time: timeInSec,
    end_time: timeInSec
  };
  controller.treatMsg(/*type*/ 'ble', JSON.stringify(payload));	
}
