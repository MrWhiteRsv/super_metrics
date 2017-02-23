function testLearnDistance() {
	controller.clear();
	
	controller.firstInvalidBeaconWarningIssued = true;
  controller.learnBeaconDistance = true;
    
  mac = '34:b1:f7:d3:91:f8';
  fakeBleProximityEvent(mac);
  for (forwardCounter = 0; forwardCounter < 30; forwardCounter++) {
    fakeRevolutionEvent(/*forwardCounter*/ forwardCounter,
        /*backwardCounter*/0, true);
  }
	mac = '34:b1:f7:d3:9c:cb';
	fakeBleProximityEvent(mac);
  for (forwardCounter = 0; forwardCounter < 40; forwardCounter++) {
    fakeRevolutionEvent(/*forwardCounter*/ forwardCounter,
        /*backwardCounter*/0, true);
  }
  var graph = controller.getBeaconsGraph();
  console.log('graph:\n_____\n' + graph.toString());
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
