var controller = {
  
  client : undefined,

  testController : function() {
    this.testMqtt();
  },
  
  testMqtt : function() {
    console.log('testing');
    this.initMqtt();
  },
  
  initMqtt() {
    var wsbroker = "li1109-31.members.linode.com"; 
    clientId = "some_string";
    var wsport = 9001 // port for above
    client =  new Paho.MQTT.Client(wsbroker, wsport, clientId);
    console.log('client: '  + client);
    // set callback handlers
    client.onConnectionLost = this.onConnectionLost;
    client.onMessageArrived = this.onMessageArrived; 
    // connect the client
    client.connect({onSuccess:this.onConnect});
  },
  
  // called when the client connects
  onConnect : function() {
    // Once a connection has been made, make a subscription and send a message.
    console.log("onConnect");
    client.subscribe("cart/cartId/#");
  },
  
 /* sendMessage : function() {
    message = new Paho.MQTT.Message("Hello");
    message.destinationName = "cart/cartId/hall_reading";
    client.send(message);
  }, */

  // called when the client loses its connection
  onConnectionLost : function(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log("onConnectionLost:" + responseObject.errorMessage);
    }
  },
  
  // called when a message arrives
  onMessageArrived : function(message) {
    console.log("onMessageArrived:" + message.payloadString);
  },
  
}