#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <time.h>
#include <Preferences.h>
#include <WebServer.h>

WebServer server(80);
Preferences preferences;

void handleSaveWiFi();
void handleSaveControllerName();
void handleStatus();

const int STATUS_LED = 2;
void saveControllerName(String name);
void blinkStatusLED();

// const char* ssid = "rudrx";
// const char* password = "rudddyyy@123";
String wifiSSID;
String wifiPassword;

String controllerName = "Main Controller";

void saveWiFiCredentials(
    String ssid,
    String password);

void handleSaveWiFi()
{

    String body = server.arg("plain");

    DynamicJsonDocument doc(512);

    DeserializationError error =
        deserializeJson(doc, body);

    if (error)
    {

        server.send(
            400,
            "application/json",
            "{\"success\":false}");

        return;
    }

    String ssid =
        doc["ssid"].as<String>();

    String password =
        doc["password"].as<String>();

    if (
        ssid.length() == 0 ||
        password.length() == 0)
    {

        server.send(
            400,
            "application/json",
            "{\"success\":false}");

        return;
    }

    Serial.println();
    Serial.println("=== WIFI CONFIG RECEIVED ===");

    Serial.print("SSID: ");
    Serial.println(ssid);

    Serial.print("Password: ");
    Serial.println(password);

    Serial.println("============================");

    saveWiFiCredentials(
        ssid,
        password);

    server.send(
        200,
        "application/json",
        "{\"success\":true}");

    delay(2000);

    ESP.restart();
}

void handleSaveControllerName()
{

    String body = server.arg("plain");

    DynamicJsonDocument doc(256);

    DeserializationError error =
        deserializeJson(doc, body);

    if (error)
    {

        server.send(
            400,
            "application/json",
            "{\"success\":false}");

        return;
    }

    String name =
        doc["name"].as<String>();

    if (name.length() == 0)
    {

        server.send(
            400,
            "application/json",
            "{\"success\":false}");

        return;
    }

    saveControllerName(name);

    server.send(
        200,
        "application/json",
        "{\"success\":true}");
}

bool setupMode = false;

void startSetupMode()
{

    digitalWrite(STATUS_LED, LOW);

    setupMode = true;

    WiFi.disconnect(true);

    WiFi.mode(WIFI_AP);

    Serial.println();
    Serial.println("Starting Setup Mode...");

    WiFi.softAP(
        "SmartSwitch_Setup",
        "devnoxauto");

    Serial.println("Setup AP Started");

    Serial.print("AP IP: ");
    Serial.println(WiFi.softAPIP());
}

void loadWiFiCredentials()
{

    preferences.begin("wifi", true);

    wifiSSID =
        preferences.getString(
            "ssid",
            "");

    wifiPassword =
        preferences.getString(
            "password",
            "");

    controllerName =
        preferences.getString(
            "controllerName",
            "Main Controller");

    preferences.end();

    Serial.println();
    Serial.println("WiFi Credentials Loaded");

    Serial.print("SSID: ");
    Serial.println(wifiSSID);
}

const int relayPins[8] = {
    23, // relay_1
    22, // relay_2
    21, // relay_3
    19, // relay_4
    18, // relay_5
    5,  // relay_6
    17, // relay_7
    16  // relay_8
};

unsigned long lastHeartbeat = 0;
const unsigned long HEARTBEAT_INTERVAL = 15000;

String databaseURL =
    "https://smart-switch-1baf4-default-rtdb.asia-southeast1.firebasedatabase.app/";

String relaysURL =
    databaseURL +
    "/controllers/controller_1/relays.json";

String getCurrentTimestamp()
{

    struct tm timeinfo;

    if (!getLocalTime(&timeinfo))
    {
        return "";
    }

    char buffer[30];

    strftime(
        buffer,
        sizeof(buffer),
        "%Y-%m-%dT%H:%M:%SZ",
        &timeinfo);

    return String(buffer);
}

void saveControllerName(
    String name)
{

    preferences.begin("wifi", false);

    preferences.putString(
        "controllerName",
        name);

    preferences.end();

    controllerName = name;
}

void updateControllerStatus()
{ // Firebase

    HTTPClient http;

    String url =
        databaseURL +
        "/controllers/controller_1.json";

    http.begin(url);

    http.addHeader(
        "Content-Type",
        "application/json");

    // String body =
    // "{"
    // "\"isOnline\":true,"
    // "\"wifiConnected\":true,"
    // "\"lastSeen\":" +
    // String(time(nullptr) * 1000) +
    // ","
    // "\"ipAddress\":\"" +
    // WiFi.localIP().toString() +
    // "\""
    // "}";
    String body =
        "{"
        "\"name\":\"" +
        controllerName + "\","
                         "\"isOnline\":true,"
                         "\"wifiConnected\":true,"
                         "\"wifiSSID\":\"" +
        WiFi.SSID() + "\","
                      "\"lastSeen\":" +
        String(time(nullptr) * 1000) +
        ","
        "\"ipAddress\":\"" +
        WiFi.localIP().toString() +
        "\""
        "}";

    int httpCode = http.PATCH(body);

    if (httpCode <= 0)
    {
        Serial.print("Heartbeat Error: ");
        Serial.println(http.errorToString(httpCode));
    }

    Serial.println();
    Serial.println("===== HEARTBEAT =====");

    Serial.print("HTTP: ");
    Serial.println(httpCode);

    Serial.println("=====================");

    http.end();
}

void updateRelayOnlineStatus(bool status)
{ // Firebase

    for (int i = 1; i <= 8; i++)
    {

        HTTPClient http;

        String url =
            databaseURL +
            "/controllers/controller_1/relays/relay_" +
            String(i) +
            ".json";

        http.begin(url);

        http.addHeader(
            "Content-Type",
            "application/json");

        String body =
            "{"
            "\"isOnline\":" +
            String(status ? "true" : "false") +
            "}";

        int httpCode = http.PATCH(body);

        Serial.print("Relay ");
        Serial.print(i);
        Serial.print(": ");
        Serial.println(httpCode);

        http.end();
    }
}

void startWebServer()
{

    server.on(
        "/status",
        HTTP_GET,
        handleStatus);

    server.on(
        "/wifi",
        HTTP_POST,
        handleSaveWiFi);

    server.on(
        "/controller-name",
        HTTP_POST,
        handleSaveControllerName);

    server.begin();

    Serial.println("HTTP Server Started");
}

void setup()
{

    // Comment these 3 lines out for setting up on a New Wifi or Every Boot

    // preferences.begin("wifi", false);
    // preferences.clear();
    // preferences.end();

    Serial.begin(115200);

    pinMode(STATUS_LED, OUTPUT);
    digitalWrite(STATUS_LED, LOW);

    for (int i = 0; i < 8; i++)
    {

        pinMode(relayPins[i], OUTPUT);

        digitalWrite(relayPins[i], LOW);
    }

    loadWiFiCredentials();

    if (
        wifiSSID.length() == 0 ||
        wifiPassword.length() == 0)
    {

        startSetupMode();

        startWebServer();

        return;
    }
    else
    {

        WiFi.begin(
            wifiSSID.c_str(),
            wifiPassword.c_str());

        startWebServer();
    }

    Serial.print("Connecting to WiFi");

    unsigned long startAttemptTime =
        millis();

    while (
        WiFi.status() != WL_CONNECTED &&
        millis() - startAttemptTime < 15000)
    {

        digitalWrite(STATUS_LED, !digitalRead(STATUS_LED));

        delay(250);

        Serial.print(".");
    }

    if (WiFi.status() != WL_CONNECTED)
    {

        Serial.println();
        Serial.println(
            "WiFi Failed. Entering Setup Mode.");

        startSetupMode();

        startWebServer();

        return;
    }

    Serial.println();
    Serial.println("WiFi Connected");

    digitalWrite(
        STATUS_LED,
        HIGH);

    Serial.print("Connected SSID: ");
    Serial.println(WiFi.SSID());

    configTime(
        0,
        0,
        "pool.ntp.org",
        "time.nist.gov");
    updateControllerStatus();

    updateRelayOnlineStatus(true);

    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());

    Serial.println("Time Synced");
}

void saveWiFiCredentials(
    String ssid,
    String password)
{

    preferences.begin("wifi", false);

    preferences.putString(
        "ssid",
        ssid);

    preferences.putString(
        "password",
        password);

    preferences.end();

    Serial.println(
        "WiFi Credentials Saved");
}

void handleStatus()
{

    String json =
        "{\"status\":\"ready\"}";

    server.send(
        200,
        "application/json",
        json);
}

void blinkStatusLED()
{

    static unsigned long lastBlink = 0;
    static bool ledState = false;

    if (millis() - lastBlink >= 500)
    {

        ledState = !ledState;

        digitalWrite(
            STATUS_LED,
            ledState);

        lastBlink = millis();
    }
}

void loop()
{
    if (!setupMode && WiFi.status() == WL_CONNECTED)
    {
        digitalWrite(STATUS_LED, HIGH);
    }
    server.handleClient();

    if (setupMode)
    {
        blinkStatusLED();
        delay(10);
        return;
    }
    if (WiFi.status() != WL_CONNECTED)
    {

        digitalWrite(
            STATUS_LED,
            !digitalRead(STATUS_LED));

        Serial.println("WiFi Disconnected");

        delay(3000);

        return;
    }

    if (millis() - lastHeartbeat > HEARTBEAT_INTERVAL)
    {

        updateControllerStatus();

        lastHeartbeat = millis();
    }

    HTTPClient http;

    http.begin(relaysURL);

    int httpCode = http.GET();

    if (httpCode > 0)
    {

        String payload = http.getString();

        DynamicJsonDocument doc(20000);

        DeserializationError error =
            deserializeJson(doc, payload);

        if (!error)
        {

            Serial.println();
            Serial.println("========== RELAYS ==========");

            for (int i = 1; i <= 8; i++)
            {

                String relayName =
                    "relay_" + String(i);

                if (!doc.containsKey(relayName))
                {
                    continue;
                }

                bool relayState =
                    doc[relayName]["state"];

                digitalWrite(
                    relayPins[i - 1],
                    relayState ? HIGH : LOW);

                Serial.print("Relay ");
                Serial.print(i);
                Serial.print(" -> ");

                Serial.println(
                    relayState ? "ON" : "OFF");
            }

            Serial.println("============================");
        }
    }
    else
    {

        Serial.print("HTTP Error: ");
        Serial.println(httpCode);
    }

    http.end();

    delay(1000);
}