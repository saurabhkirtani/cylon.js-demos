"use strict";

var Cylon = require("cylon");
var Protocol = require('azure-iot-device-http').Http;
var Client = require('azure-iot-device').Client;
var Message = require("azure-iot-device").Message;

var connectionString = '<device connection string>';
var client = Client.fromConnectionString(connectionString, Protocol);
var i=0;

Cylon.robot({
  connections: {
    raspi: { adaptor: "raspi" }
  },

  devices: {
    button: { driver: "button", pin: 7 }
  },

  work: function(my) {
      my.button.on('push', function() {
      console.log("Button pushed!" + ++i);
       var data = JSON.stringify({
         Received: 1
          });   
    var message = new Message(data);
    message.properties.add('myproperty', 'myvalue');
    console.log('Sending the number of clicks to the hub: ' + message.getData());
    client.sendEvent(message, printResultFor('send'));    
    });
  }
}).start();

function printResultFor(op) {
  return function printResult(err, res) {
    if (err) console.log(op + ' error: ' + err.toString());
    if (res) console.log(op + ' status: ' + res.constructor.name);
  };
    }