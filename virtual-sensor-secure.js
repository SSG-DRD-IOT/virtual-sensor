/*
 * Author: Daniel Holmlund <daniel.w.holmlund@Intel.com>
 * Copyright (c) 2015 Intel Corporation.
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
var config = require("./config.json");
var _ = require('lodash');

var mqtt = require('mqtt');
var fs = require('fs');
var KEY = fs.readFileSync('/etc/mosquitto/certs/server.key');
var CERT = fs.readFileSync('/etc/mosquitto/certs/server.crt');
var TRUSTED_CA_LIST = [fs.readFileSync('/etc/mosquitto/ca_certificates/ca.crt')];
 
var PORT = 8883;
var HOST = 'localhost';
 
var options = {
  port: PORT,
  host: HOST,
  protocol: 'mqtts',    //also add this
  protocolId: 'MQIsdp',
  keyPath: KEY,
  certPath: CERT,
  rejectUnauthorized : false, 
  //The CA list will be used to determine if server is authorized
  ca: TRUSTED_CA_LIST,
  secureProtocol: 'TLSv1_method',
  protocolVersion: 3
};
 
//var client  = mqtt.connect(config.mqtt.url);
//var client = mqtt.createSecureClient(options);
var client = mqtt.connect(options);

var tempSensorName = "temperature";
var tempSensorTopic = "sensors/" + tempSensorName + "/data";

var lightSensorName = "light";
var lightSensorTopic = "sensors/" + lightSensorName + "/data";

client.on('connect', function () {
    console.log("Connected to the MQTT server on " + config.mqtt.url);
});

function getRandomTemp(min, max) {
    // Returns a random number between min (inclusive) and max (exclusive)
  return Math.round(Math.random() * (max - min) + min);
}

setInterval(function() {
    var temp = getRandomTemp(17, 30);

    var lightTemp = getRandomTemp(200, 1000);
    var current_time = (new Date).getTime();

    var str = '{"sensor_id": "'
            + tempSensorName
            + '", "value": '
            + temp
            + ', "timestamp": '
            + current_time +'}';

    console.log(str);


    client.publish(tempSensorTopic, str);

    var str = '{"sensor_id": "'
            + lightSensorName
            + '", "value": "'
            + lightTemp
            + '", "timestamp":"'
            + current_time +'"}';

//    console.log(str);
//    client.publish(lightSensorTopic, str);


}, config.interval);
