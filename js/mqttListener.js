var mqtt_listener = {
  
  client : undefined,

  init() {
    //var wsbroker = "li1109-31.members.linode.com"; 
    //clientId = "some_string";
    //var wsport = 9001;
    
    var wsbroker = "m13.cloudmqtt.com"; 
    clientId = "some_string";
    var wsport = 31714;
    
    client =  new Paho.MQTT.Client(wsbroker, wsport, clientId);
    // set callback handlers.
    client.onConnectionLost = this.onConnectionLost;
    client.onMessageArrived = this.onMessageArrived; 
    // connect the client.
    client.connect({
        onSuccess : this.onConnect,
        onFailure: this.onFailureCallback,
        useSSL: true,
        userName: 'oujibpyy',
        password: '-mKBDKwYQ1CC'});
  },
  
  // called when the client connects.
  onFailureCallback : function(response) {
    console.log("onFailureCallback: " + JSON.stringify(response));
  },
  
  // called when the client connects.
  onConnect : function() {
    client.subscribe("cart/cartId/#");
    controller.onMqttConnect();
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
    controller.treatMsg(type, payload);
  },
  
 sendMessage : function(topic, payload) {
   var message = new Paho.MQTT.Message(payload); 
   message.destinationName = topic;
   client.send(message);
 },

}