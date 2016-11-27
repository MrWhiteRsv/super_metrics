var mqtt_listener = {
  
  client : undefined,

  init() {
    var wsbroker = "li1109-31.members.linode.com"; 
    clientId = "some_string";
    var wsport = 9001 // port for above
    client =  new Paho.MQTT.Client(wsbroker, wsport, clientId);
    console.log('client: '  + client);
    // set callback handlers.
    client.onConnectionLost = this.onConnectionLost;
    client.onMessageArrived = this.onMessageArrived; 
    // connect the client.
    client.connect({onSuccess:this.onConnect});
  },
  
  // called when the client connects.
  onConnect : function() {
    client.subscribe("cart/cartId/#");
  },

  // called when the client loses its connection.
  onConnectionLost : function(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log("onConnectionLost:" + responseObject.errorMessage);
    }
  },
  
  // called when a message arrives.
  onMessageArrived : function(message) {
    var topic = message.destinationName;
    var payload = message.payloadString;
    var type = topic.substring(topic.lastIndexOf('/') + 1);
    //console.log("topic:" + topic);
    //console.log("type:" + type);    
    //console.log("payload:" + payload);
    controller.treatMsg(type, payload);
  },
  
 /* sendMessage : function() {
    message = new Paho.MQTT.Message("Hello");
    message.destinationName = "cart/cartId/hall_reading";
    client.send(message);
  }, */

}