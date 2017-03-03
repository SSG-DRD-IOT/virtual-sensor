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

// Libary to parse command line arguments
const commandLineArgs = require('command-line-args')
const getUsage = require('command-line-usage');

// Command line argument definitions
const optionDefinitions = [{
        name: 'help',
        description: 'Display this usage guide.',
        alias: 'h',
        type: Boolean,
        group: 'main'
    },
    {
        name: 'verbose',
        description: 'Display extra information',
        alias: 'v',
        type: Boolean,
        group: 'main'
    },
    {
        name: 'debug',
        description: 'Display debugging information',
        alias: 'd',
        type: Boolean,
        group: 'main'
    },
    {
        name: 'tls',
        description: 'Use MQTT-TLS. MQTT encryption over TLS.',
        type: Boolean,
        group: 'encryption'
    },
    {
        name: 'key',
        description: 'the client key file',
        type: String,
        defaultValue: "certs/server.key",
        group: 'encryption'
    },
    {
        name: 'cert',
        description: 'the client certificate file',
        type: String,
        defaultValue: "certs/server.crt",
        group: 'encryption'
    },
    {
        name: 'ca',
        description: 'the client ca file',
        type: String,
        defaultValue: "certs/ca.crt",
        group: 'encryption'
    },
    {
        name: 'delay',
        description: 'the delay between sensor readings in milliseconds. Default is 1000ms',
        type: Number,
        alias: 'l',
        defaultValue: 1000,
        group: 'main'
    },
    {
        name: 'hostname',
        description: 'the hostname or IP address of the MQTT broker',
        type: String,
        alias: 'i',
        defaultValue: "localhost",
        group: 'connection'
    },
    {
        name: 'name',
        description: 'the id of the sensor',
        type: String,
        alias: 'n',
        defaultValue: "temperature",
        group: 'sensor'
    },
    {
        name: 'port',
        description: 'the port number to connect of the MQTT broker',
        type: Number,
        alias: 'p',
        group: 'connection'
    },
    {
        name: 'timeout',
        description: 'Stop emitting sensors readings after timeout number of milliseconds',
        alias: 't',
        type: Number,
        typeLabel: '[underline]{ms}',
        group: 'main'
    },
    {
        name: 'digital',
        description: 'Specifies that the sensor will be digital',
        type: Boolean,
        group: 'sensor'
    },
    {
        name: 'analog',
        description: 'Specifies that the sensor will be analog',
        type: Boolean,
        defaultValue: true,
        group: 'sensor'
    },
    {
        name: 'min',
        description: 'the minimum value emitted',
        type: Number,
        defaultValue: 17,
        group: 'analog'
    },
    {
        name: 'max',
        description: 'the maximun value emitted',
        type: Number,
        defaultValue: 30,
        group: 'analog'
    }
]

const sections = [{
        header: 'A Virtual Sensor Application',
        content: 'Generates sensor data traffic over MQTT and MQTT-TLS'
    },
    {
        header: 'Main options',
        optionList: optionDefinitions,
        group: ['main', 'input']
    },
    {
        header: 'Connection options',
        optionList: optionDefinitions,
        group: ['connection']
    },
    {
        header: 'Encryption options',
        optionList: optionDefinitions,
        group: ['encryption']
    },
    {
        header: 'Sensor Options',
        optionList: optionDefinitions,
        group: 'sensor'
    },
    {
        header: 'Analog Sensor Options',
        optionList: optionDefinitions,
        group: 'analog'
    },
    {
        header: 'Digital Sensor Options',
        optionList: optionDefinitions,
        group: 'digital'
    }
];

// Parse the command line arguments
const options = commandLineArgs(optionDefinitions);
// Print the help text
if (options.main.help) {
    console.log(getUsage(sections))
    process.exit();
}

// Print the options use if in debug mode
if (options.main.debug) {
    console.log(options);
}

// The default max and min values are set for digital sensors
var min = 0;
var max = 1;

// If the --analog option is used or no --digital option is present
// Set the max and min to their default values
if (options.sensor.analog != undefined) {
    min = options.analog.min;
    max = options.analog.max;
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

    // Set the default port number
    var port = 1883;
    if (options.encryption.tls != undefined) {
      port = 8883;
    }
    if (options.connection.port != undefined){
      port = options.connection.port;
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

    // Create an MQTT-TLS client named client that is
    // conncect to the *config.mqtt.url* value
    var client = mqtt.connect(mqttOptions);
} else {
    // Log virtual-sensor as started
    info("Connecting to MQTT broker at mqtt://" + options.connection.hostname + ":" + port + "/");

    // Create an MQTT client named client that is
    // conncect to the *config.mqtt.url* value
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
      every *config.interval* milliseconds
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
    if (options.main.verbose == true) {
        console.log(chalk.bold.yellow(str));
    }
}
