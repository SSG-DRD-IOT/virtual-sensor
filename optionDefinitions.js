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

// Command line argument definitions
const optionDefinitions = [{
        name: 'help',
        description: 'Display this usage guide.',
        alias: 'h',
        type: Boolean,
        group: 'main'
    },
    {
        name: 'silent',
        description: 'Suppresses extra information',
        alias: 's',
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
    }
];


var ex = {
  optionDefinitions: optionDefinitions,
  sections: sections
}

module.exports = ex;
