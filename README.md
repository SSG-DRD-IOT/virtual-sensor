
A Virtual Sensor Application

  Generates sensor data traffic over MQTT and MQTT-TLS

Main options

  -h, --help           Display this usage guide.                                            
  -v, --verbose        Display extra information                                            
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

Digital Sensor Options
