'use strict';
var Cylon = require('cylon');
var Protocol = require('azure-iot-device-http').Http;
var Client = require('azure-iot-device').Client;
var Message = require("azure-iot-device").Message;

var connectionString = '<device connection string>';
var client = Client.fromConnectionString(connectionString, Protocol);
var searchItem=0, increment=0, r=0;    
var connectCallback = function (err) {
  if (err) {
    console.error('Could not connect: ' + err.message);
  } else {
    console.log('Client connected');

Cylon.robot({
connections: {
    raspi: { adaptor: 'raspi' }
  },

  devices: {
    servo: { driver: 'servo', pin: 11 }
  },
work: function(my) {
    var angle = 20;

    client.on('message', function (msg) {
          console.log(msg.data);
          r = JSON.parse(msg.data);
          searchItem=r.action, increment=0;
          if(searchItem==="stop")
          {
              increment=0;           
          }
          else if(searchItem==="start")
            {    
              increment=10;
            }
            
    client.complete(msg, printResultFor('completed'));     
       });

    every((1).seconds(), function() {
                angle += increment;
                my.servo.angle(angle);
                console.log("Current Angle: " + (my.servo.currentAngle()));

                if ((angle === 20) || (angle === 140)) { increment = -increment; }
            });
}
    }).start();
  }
      
    client.on('error', function (err) {
      console.error(err.message);
    });

    client.on('disconnect', function () {
      clearInterval(sendInterval);
      client.removeAllListeners();
      client.connect(connectCallback);
    });
};

function printResultFor(op) {
  return function printResult(err, res) {
    if (err) console.log(op + ' error: ' + err.toString());
    if (res) console.log(op + ' status: ' + res.constructor.name);
  };
    }

client.open(connectCallback); 