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

// Load the application configuration file
var config = require("./config.json")

// A library to colorize console output
var chalk = require('chalk');

// Require MQTT and setup the connection to the broker
var mqtt = require('mqtt');

// NodeJS Library to interact with a filesystem
var fs = require('fs');

var KEY = fs.readFileSync(config.KEY_FILE);
var CERT = fs.readFileSync(config.CERT_FILE);
var TRUSTED_CA_LIST = [fs.readFileSync(config.TRUSTED_CA_LIST_FILE)];
var PORT = 8883;
var HOST = 'localhost';

// Setup MQTT-TLS options
var options = {
  port: PORT,
  host: HOST,
  protocol: 'mqtts',    // also add this
  protocolId: 'MQIsdp',
  keyPath: KEY,
  certPath: CERT,
  rejectUnauthorized : false,
  //The CA list will be used to determine if server is authorized
  ca: TRUSTED_CA_LIST,
  secureProtocol: 'TLSv1_method',
  protocolVersion: 3
};

// Create an MQTT-TLS client named client that is
// conncect to the *config.mqtt.url* value
var client = mqtt.connect(options);

// Log virtual-sensor as started
console.log(chalk.bold.yellow("Virtual Sensor is started and attempting to connect to an MQTT broker"));

// Create variables for the sensor name and topic
var tempSensorName = "temperature";
var tempSensorTopic = "sensors/" + tempSensorName + "/data";

// On the client connect event run a function
// to log the event to the console
client.on('connect', function () {
    console.log(chalk.bold.yellow("Connected to the MQTT server on " + config.mqtt.url));

    /*
      Runs a function to emit a temperature sensor value
      every *config.interval* milliseconds
    */
    setInterval(function() {
        // Get a random temperature integer
        var temp = getRandomTemp(17, 30);

        // Get the current time
        var current_time = (new Date).getTime();

        /*
          This JSON structure is extremely important
          future labs will assume that every temperature
          reading has a "sensor_id", "value" and "timestamp"
        */
        var json = {
          sensor_id : tempSensorName,
          value : temp,
          timestamp : current_time
        };

        // Convert the JSON object to a string
        var str = JSON.stringify(json);

        // Log the string to the console
        console.log(str);

        // Publish the temperature reading string on the MQTT topic
        client.publish(tempSensorTopic, str);

    }, config.interval);
});

// MQTT error function - Client unable to connect
client.on('error', function () {
    console.log(chalk.bold.yellow("Unable to connect to MQTT server"));
    process.exit();
});

/*
  getRandomTemp: returns a random integer between min and max
*/
function getRandomTemp(min, max) {
    // Returns a random number between min (inclusive) and max (exclusive)
  return Math.round(Math.random() * (max - min) + min);
}
