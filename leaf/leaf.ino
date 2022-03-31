#include <WiFiNINA.h>
#include <WiFiUdp.h>
#include <Arduino_LSM6DS3.h>
#include <OSCMessage.h>
#include "arduino_secrets.h"

struct Point3D {
    float x;
    float y;
    float z;
};

struct AccelerometerState {
    struct Point3D raw;
    struct Point3D gravity;
    struct Point3D linear;
};

unsigned int FREQUENCY = 10;
unsigned int MESSAGE_DELAY_TIME = 1000 / FREQUENCY;
float gravityCoeff = 0.8f;

char wifiSSID[] = SECRET_WIFI_SSID;
char wifiPassword[] = SECRET_WIFI_PASSWORD;

IPAddress oscServerIP = IPAddress(192, 168, 1, 100);
unsigned int oscServerPort = 57121;
unsigned int localPort = oscServerPort;

const char oscAddress[] = "/accel";
String macAddress;

WiFiUDP udp;

struct AccelerometerState accelState = {
    .raw = {
        .x = 0.0f,
        .y = 0.0f,
        .z = 0.0f
    },

    .gravity = {
        .x = 0.0f,
        .y = 0.0f,
        .z = 0.0f
    },

    .linear = {
        .x = 0.0f,
        .y = 0.0f,
        .z = 0.0f
    }
};

float gravity(float raw, float previousGravity, float coeff) {
    return coeff * previousGravity + (1.0f - coeff) * raw;
}

void extractGravities(struct AccelerometerState* state, float coeff) {
    state->gravity.x = gravity(state->raw.x, state->gravity.x, coeff);
    state->gravity.y = gravity(state->raw.y, state->gravity.y, coeff);
    state->gravity.z = gravity(state->raw.z, state->gravity.z, coeff);
}

void linearize(struct AccelerometerState* state, float coeff) {
    // This is essentially a simple DC blocking highpass filter:
    //   - Run a low pass filter on the signal to isolate gravity on each axis
    //   - Subtract gravity from the signal to obtain only
    //     the high frequency changes (i.e. the acceleration)
    // See: https://www.earlevel.com/main/2012/12/15/a-one-pole-filter/
    extractGravities(state, coeff);
    state->linear.x = state->raw.x - state->gravity.x;
    state->linear.y = state->raw.y - state->gravity.y;
    state->linear.z = state->raw.z - state->gravity.z;
}

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

float normalize(float value) {
  // Nano 33 IoT IMU reports accelerometer values between -4 and 4g.
  // Scale it to between -1.0 and 1.0.
  return value * 0.25;
}

void loop() {
    if (IMU.accelerationAvailable()) {
        IMU.readAcceleration(accelState.raw.x, accelState.raw.y,
            accelState.raw.z);

        linearize(&accelState, gravityCoeff);
    }

    // Serial.print(accelState.linear.x);
    // Serial.print(", ");
    // Serial.print(accelState.linear.y);
    // Serial.print(", ");
    // Serial.println(accelState.linear.z);

    OSCMessage msg(oscAddress);
    msg.add(macAddress.c_str())
        .add(normalize(accelState.linear.x))
        .add(normalize(accelState.linear.y))
        .add(normalize(accelState.linear.z));

    udp.beginPacket(oscServerIP, oscServerPort);
    msg.send(udp);
    udp.endPacket();

    delay(MESSAGE_DELAY_TIME);
}
