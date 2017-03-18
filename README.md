
# A Virtual Sensor Application

  Generates sensor data traffic over MQTT and MQTT-TLS.

  Data is always sent to a topic like *sensors/__name of sensor__/data* where the name is set by the **-n** option.
```
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
Enable MQTT-TLS. This changes the port to 8883 and assumes

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
