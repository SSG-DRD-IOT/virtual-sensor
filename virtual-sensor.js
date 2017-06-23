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

'use strict';

// A library to colorize console output
var chalk = require('chalk');

// Require MQTT and setup the connection to the broker
var mqtt = require('mqtt');

// Libary to parse command line arguments
const commandLineArgs = require('command-line-args')
const getUsage = require('command-line-usage');

// Command line argument definitions
const cmdLineArgsDefinitions = require('./optionDefinitions')
const optionDefinitions = cmdLineArgsDefinitions.optionDefinitions
const sections = cmdLineArgsDefinitions.sections

// Parse the command line arguments
const options = commandLineArgs(optionDefinitions);
// Print the help text
if (options.main.help) {
    info(getUsage(sections))
    process.exit();
}

// Print the options use if in debug mode
if (options.main.debug) {
    info(options);
}

// The default max and min values are set for digital sensors
var min = 0;
var max = 1;

// If the --analog option is used or no --digital option is present
// Set the max and min to their default values
if (options.sensor.digital != true) {
    min = options.analog.min;
    max = options.analog.max;
}

// Set the default port number
var port = 1883;
if (options.encryption.tls != undefined) {
  port = 8883;
}
if (options.connection.port != undefined){
  port = options.connection.port;
}


if (options.encryption.tls != undefined) {
    // NodeJS Library to interact with a filesystem
    var fs = require('fs');

    var KEY = fs.readFileSync(options.encryption.key);
    var CERT = fs.readFileSync(options.encryption.cert);
    var TRUSTED_CA_LIST = [fs.readFileSync(options.encryption.ca)];

    var HOST = 'localhost';
    if (options.connection.hostname != undefined) {
      var HOST = options.connection.hostname;
    }

    // Setup MQTT-TLS options
    var mqttOptions = {
        port: port,
        host: HOST,
        protocol: 'mqtts', // also add this
        protocolId: 'MQIsdp',
        keyPath: KEY,
        certPath: CERT,
        rejectUnauthorized: false,
        //The CA list will be used to determine if server is authorized
        ca: TRUSTED_CA_LIST,
        secureProtocol: 'TLSv1_method',
        protocolVersion: 3
    };

    // Log virtual-sensor as started
    info("Connecting to MQTT-TLS broker at mqtts://" + mqttOptions.host + ":" + port + "/");

    // Create an MQTT-TLS client
    var client = mqtt.connect(mqttOptions);
} else {
    // Log virtual-sensor as started
    info("Connecting to MQTT broker at mqtt://" + options.connection.hostname + ":" + port + "/");

    // Create an MQTT client
    var client = mqtt.connect("mqtt://" + options.connection.hostname + ":" + port + "/");
}

// Create variables for the sensor name and topic
var topic = "sensors/" + options.sensor.name + "/data";

// On the client connect event run a function
// to log the event to the console
client.on('connect', function() {
    info("Connected to MQTT server at " + "mqtt://" + options.connection.hostname + ":" + port + "/");
    info("Publishing sensors data on " + chalk.bold.white(topic));
    /*
      Runs a function to emit a temperature sensor value
      every *delay* milliseconds
    */
    setInterval(function() {
        // Get a random integer value between a min and a max
        var value = randomIntBetween(min, max);

        // Get the current time
        var current_time = (new Date).getTime();

        /*
          This JSON structure is extremely important
          future labs will assume that every temperature
          reading has a "sensor_id", "value" and "timestamp"
        */
        var json = {
            sensor_id: options.sensor.name,
            value: value,
            timestamp: current_time
        };

        // Convert the JSON object to a string
        var str = JSON.stringify(json);

        // Log the string to the console
        console.log(str);

        // Publish the sensor reading string on the MQTT topic
        client.publish(topic, str);
    }, options.main.delay);

    // If the timeout options is defined then emit sensor data for timeout
    // number of milliseconds

    if (options.main.timeout != undefined) {
        info("Timeout set for " + options.main.timeout + "ms")
        setInterval(function() {
            process.exit();
        }, options.main.timeout)
    }
});

// MQTT error function - Client unable to connect
client.on('error', function() {
    info("Unable to connect to MQTT server");
    process.exit();
});

/*
  randomIntBetween: returns a random integer between min and max
*/
function randomIntBetween(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function info(str) {
    // Log virtual-sensor as started
    if (options.main.silent != true) {
        console.log(chalk.bold.yellow(str));
    }
}
