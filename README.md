
# A Virtual Sensor Application

The virtual sensor application is a handy utility to generate sensor data in JSON format and publish it over MQTT or MQTT-TLS. This is practical when you don't have physical sensors available or if you'd like to simulate a variety of data for testing purposes.

During the rest of these labs, you may continue to use your physical sensors, or if you like you can use this virtual sensor program. The labs in the rest of this workshop are compatible with both approaches. 

## Download and Install 

The source code can be found on Github in the SSG-DRD-IOT organization.  You may need to install **git** first.
```bash
sudo apt-get install git
```

```bash
git clone https://github.com/SSG-DRD-IOT/virtual-sensor
```

```bash
cd virtual-sensor
```

Here is the help text of the virtual sensor program.
```

  Generates sensor data traffic over MQTT and MQTT-TLS.

  Data is always sent to a topic like *sensors/__name of sensor__/data* where the name is set by the **-n** option.

 Main options

   -h, --help           Display this usage guide.                                            
   -s, --silent         Supress extra information                                            
   -d, --debug          Display debugging information                                        
   -l, --delay number   the delay between sensor readings in milliseconds. Default is 1000ms
   -t, --timeout ms     Stop emitting sensors readings after timeout number of milliseconds  

Connection options

  -i, --hostname string   the hostname or IP address of the MQTT broker
  -p, --port number       the port number to connect of the MQTT broker

Encryption options

  --tls           Use MQTT-TLS. MQTT encryption over TLS.
  --key string    the client key file                     
  --cert string   the client certificate file             
  --ca string     the client ca file                      

Sensor Options

  -n, --name string   the id of the sensor                      
  --digital           Specifies that the sensor will be digital
  --analog            Specifies that the sensor will be analog  

Analog Sensor Options

  --min number   the minimum value emitted
  --max number   the maximun value emitted
```

## Setup
First you must install the dependencies
```shell
npm install
```
Now you can continue with the examples

## Examples

### Default parameters

If you don't specify any parameters an analog sensor named *"temperature"* will a minimum of 17 and maximum value of 30 will be created. The MQTT traffic will be sent to a MQTT broker on the *sensors/temperature/data* topic on the localhost machine and data will be echoed to the console every 2 seconds.
```bash
$ node virtual-sensor.js
Connected to MQTT server at mqtt://localhost:1883/
Publishing sensors data on sensors/temperature/data
{"sensor_id":"temperature","value":18,"timestamp":1489862667655}
{"sensor_id":"temperature","value":23,"timestamp":1489862668658}
{"sensor_id":"temperature","value":26,"timestamp":1489862669660}
```

### Subscribing  

If you want to see the data going into your MQTT topic you can use mosquitto to subscribe to that topic and see the data that is coming in. 

```
mosquitto_sub -h localhost -p 1883 -t "sensors/temperature/data"
```

You can also subscribe to ALL topics by using #:

```
mosquitto_sub -h localhost -p 1883 -t "#"

```



### Analog and Digital Data Sources
Create a Analog data source named "light-sensor" with a minimum output value of 300 and a maximum of 500
```bash
node virtual-sensor.js --name "light-sensor" --min=300 --max=500
```

Create a digital GPIO data source named "relay"
```bash
node virtual-sensor.js --name "relay" --digital
```

### Hostname and Port Options
Create a digital GPIO data source named "relay"
```bash
node virtual-sensor.js --name "relay" --digital
```

### Encryption Options
Enable MQTT-TLS. This changes the port to 8883 and assumes the certificates and key files to be stored in the /etc/mosquitto directory.

```bash
node virtual-sensor.js --tls
```

### Delay and Timeout options
Put a 5 second delay between sensor readings.
```bash
node virtual-sensor.js --delay 5000
```

Stop virtual sensor after 10 seconds.
```bash
node virtual-sensor.js --timeout 10000
```
