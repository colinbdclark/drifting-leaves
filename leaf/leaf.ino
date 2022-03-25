#include <WiFiNINA.h>
#include <WiFiUdp.h>
#include <Arduino_LSM6DS3.h>
#include <OSCMessage.h>
#include "arduino_secrets.h"

unsigned int FREQUENCY = 10;
unsigned int MESSAGE_DELAY_TIME = 1000 / FREQUENCY;

char wifiSSID[] = SECRET_WIFI_SSID;
char wifiPassword[] = SECRET_WIFI_PASSWORD;

IPAddress oscServerIP = IPAddress(192, 168, 1, 116);
unsigned int oscServerPort = 57121;
unsigned int localPort = oscServerPort;

const char oscAddress[] = "/accel";
String macAddress;

WiFiUDP udp;

void printWiFiStatus() {
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());

  IPAddress ip = WiFi.localIP();
  Serial.print("Local IP Address: ");
  Serial.println(ip);

  long rssi = WiFi.RSSI();
  Serial.print("Signal strength: ");
  Serial.print(rssi);
  Serial.println(" dBm");
}

void failureLoop() {
    Serial.println("Error occurred, intentionally looping infinitely.");
    while(true);
}

void setup() {
    int status = WL_IDLE_STATUS;

    Serial.begin(9600);

    if (WiFi.status() == WL_NO_MODULE) {
        Serial.println("Communication with WiFi module failed!");
        failureLoop();
    }

    unsigned char macAddressBytes[6];
    WiFi.macAddress(macAddressBytes);
    macAddress = macAddressToCString(macAddressBytes);

    if (!IMU.begin()) {
        Serial.println("Failed to initialize IMU!");
        failureLoop();
    }

    Serial.print("Accelerometer sample rate: ");
    Serial.println(IMU.accelerationSampleRate());

    while (status != WL_CONNECTED) {
        Serial.print("Attempting to connect to SSID: ");
        Serial.println(wifiSSID);
        status = WiFi.begin(wifiSSID, wifiPassword);
        delay(10000);
    }

    Serial.println("Connected to WiFi.");
    printWiFiStatus();

    Serial.println("Connecting to OSC server...");
    udp.begin(localPort);
}

String macAddressToCString(unsigned char* macAddress) {
    return String(macAddress[5], HEX) +
        String(macAddress[4], HEX) +
        String(macAddress[3], HEX) +
        String(macAddress[2], HEX) +
        String(macAddress[1], HEX) +
        String(macAddress[0], HEX);
}

float normalizeAccelerationValue(float value) {
  // Nano 33 IoT IMU reports accelerometer values between -4 and 4g.
  // Scale it to between -1.0 and 1.0.
  return value * 0.25;
}

void loop() {
    float accelX = 0.0f;
    float accelY = 0.0f;
    float accelZ = 0.0f;

    if (IMU.accelerationAvailable()) {
        IMU.readAcceleration(accelX, accelY, accelZ);
        accelX = normalizeAccelerationValue(accelX);
        accelY = normalizeAccelerationValue(accelY);
        accelZ = normalizeAccelerationValue(accelZ);
    }

    Serial.print(accelX);
    Serial.print(", ");
    Serial.print(accelY);
    Serial.print(", ");
    Serial.println(accelZ);

    OSCMessage msg(oscAddress);
    msg.add(macAddress.c_str()).add(accelX).add(accelY).add(accelZ);

    udp.beginPacket(oscServerIP, oscServerPort);
    msg.send(udp);
    udp.endPacket();

    delay(MESSAGE_DELAY_TIME);
}
