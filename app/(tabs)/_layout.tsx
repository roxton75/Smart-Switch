import { Tabs } from "expo-router";

import SmartToast from "@/components/ui/SmartToast";
import { COLORS } from "@/constants/theme";
import useWeather from "@/hooks/use-weather";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { subscribeToController } from "services/controllerService";

const getWeatherIcon = (code: number) => {
  if (code === 0) return "sunny-outline";

  if (code <= 3) return "partly-sunny-outline";

  if (code >= 51 && code <= 67) return "rainy-outline";

  if (code >= 71 && code <= 77) return "snow-outline";

  if (code >= 95) return "thunderstorm-outline";

  return "cloud-outline";
};

export default function TabsLayout() {
  const { temperature, weatherCode } = useWeather();
  const [controllerOnline, setControllerOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState<Date | null>(null);
  const previousStatus = useRef<boolean | null>(null);
  const [showToast, setShowToast] = useState(false);

  const [toastType, setToastType] = useState<"success" | "error">("success");

  const [toastTitle, setToastTitle] = useState("");

  const [toastMessage, setToastMessage] = useState("");

  //Firebase Subscription
  useEffect(() => {
    const unsubscribe = subscribeToController((controller) => {
      if (!controller?.lastSeen) {
        setControllerOnline(false);
        return;
      }

      setLastSeen(new Date(controller.lastSeen));
    });

    return unsubscribe;
  }, []);

  // Online/Offline Effect
  useEffect(() => {
    if (!lastSeen) {
      setControllerOnline(false);
      return;
    }

    const interval = setInterval(() => {
      const diff = Date.now() - lastSeen.getTime();

      setControllerOnline(diff < 30000);
    }, 1000);

    return () => clearInterval(interval);
  }, [lastSeen]);

  useEffect(() => {
    if (previousStatus.current === null) {
      previousStatus.current = controllerOnline;
      return;
    }

    if (previousStatus.current && !controllerOnline) {
      setToastType("error");

      setToastTitle("Controller Offline");

      setToastMessage("Power or WiFi connection lost");

      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }

    if (!previousStatus.current && controllerOnline) {
      setToastType("success");

      setToastTitle("Controller Online");

      setToastMessage("Controller reconnected");

      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }

    previousStatus.current = controllerOnline;
  }, [controllerOnline]);

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: true,

          headerShadowVisible: true,

          headerStyle: {
            backgroundColor: COLORS.background,
            height: 100,
          },

          headerTitleStyle: {
            fontSize: 36,

            fontWeight: "800",

            color: COLORS.navy,
            marginLeft: 5,
            //marginBottom: 6,
          },

          headerTitleAlign: "left",

          tabBarShowLabel: false,

          tabBarStyle: styles.tabBar,
        }}
      >
        {/* HOME */}
        <Tabs.Screen
          name="index"
          options={{
            headerTitle: () => (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Ionicons
                  name="home"
                  size={30}
                  color={COLORS.navy}
                  style={styles.titleIcons}
                />

                <Text
                  style={{
                    fontSize: 33,
                    fontWeight: "600",
                    color: COLORS.navy,
                  }}
                >
                  Home
                </Text>
              </View>
            ),
            headerRight: () => (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginRight: 23,
                  gap: 5,
                }}
              >
                <Ionicons
                  name={getWeatherIcon(weatherCode) as any}
                  size={22}
                  color={COLORS.primary}
                />

                <Text
                  style={{
                    fontSize: 28,

                    fontWeight: "700",

                    color: COLORS.navy,
                  }}
                >
                  {temperature}°
                </Text>
              </View>
            ),
            tabBarIcon: ({ focused }) => (
              <ImageBackground
                source={
                  focused ? require("@/assets/images/theme.png") : undefined
                }
                resizeMode="cover"
                imageStyle={{
                  borderRadius: 20,
                }}
                style={[styles.tabItem, focused && styles.activeTab]}
              >
                <Ionicons
                  name="home-outline"
                  size={24}
                  color={focused ? COLORS.primary : COLORS.navy}
                />

                <Text
                  style={[
                    styles.label,

                    {
                      color: focused ? COLORS.primary : COLORS.navy,
                    },
                  ]}
                >
                  Home
                </Text>
              </ImageBackground>
            ),
          }}
        />
        {/* DEVICES */}
        <Tabs.Screen
          name="devices"
          options={{
            headerTitle: () => (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Ionicons
                  name="grid"
                  size={30}
                  color={COLORS.navy}
                  style={styles.titleIcons}
                />

                <Text
                  style={{
                    fontSize: 33,
                    fontWeight: "600",
                    color: COLORS.navy,
                  }}
                >
                  Devices
                </Text>
              </View>
            ),
            headerRight: () => (
              <View
                style={{
                  flexDirection: "row",

                  alignItems: "center",

                  marginRight: 23,

                  gap: 5,
                }}
              >
                <Ionicons
                  name={getWeatherIcon(weatherCode) as any}
                  size={22}
                  color={COLORS.primary}
                />

                <Text
                  style={{
                    fontSize: 28,

                    fontWeight: "700",

                    color: COLORS.navy,
                  }}
                >
                  {temperature}°
                </Text>
              </View>
            ),
            tabBarIcon: ({ focused }) => (
              <ImageBackground
                source={
                  focused ? require("@/assets/images/theme.png") : undefined
                }
                resizeMode="cover"
                imageStyle={{
                  borderRadius: 20,
                }}
                style={[styles.tabItem, focused && styles.activeTab]}
              >
                <Ionicons
                  name="grid-outline"
                  size={22}
                  color={focused ? COLORS.primary : COLORS.navy}
                />

                <Text
                  style={[
                    styles.label,

                    {
                      color: focused ? COLORS.primary : COLORS.navy,
                    },
                  ]}
                >
                  Devices
                </Text>
              </ImageBackground>
            ),
          }}
        />
        {/* SET UP */}
        <Tabs.Screen
          name="setup"
          options={{
            headerTitle: () => (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Ionicons
                  name="wifi"
                  size={30}
                  color={COLORS.navy}
                  style={styles.titleIcons}
                />

                <Text
                  style={{
                    fontSize: 33,
                    fontWeight: "600",
                    color: COLORS.navy,
                  }}
                >
                  Set Up
                </Text>
              </View>
            ),
            headerRight: () => (
              <View
                style={{
                  flexDirection: "row",

                  alignItems: "center",

                  marginRight: 23,

                  gap: 5,
                }}
              >
                <Ionicons
                  name={getWeatherIcon(weatherCode) as any}
                  size={22}
                  color={COLORS.primary}
                />

                <Text
                  style={{
                    fontSize: 28,

                    fontWeight: "700",

                    color: COLORS.navy,
                  }}
                >
                  {temperature}°
                </Text>
              </View>
            ),
            tabBarIcon: ({ focused }) => (
              <ImageBackground
                source={
                  focused ? require("@/assets/images/theme.png") : undefined
                }
                resizeMode="cover"
                imageStyle={{
                  borderRadius: 20,
                }}
                style={[styles.tabItem, focused && styles.activeTab]}
              >
                <Ionicons
                  name="wifi-outline"
                  size={22}
                  color={focused ? COLORS.primary : COLORS.navy}
                />

                <Text
                  style={[
                    styles.label,

                    {
                      color: focused ? COLORS.primary : COLORS.navy,
                    },
                  ]}
                >
                  Set-Up
                </Text>
              </ImageBackground>
            ),
          }}
        />
      </Tabs>
      <SmartToast
        visible={showToast}
        type={toastType}
        title={toastTitle}
        message={toastMessage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 82,

    backgroundColor: COLORS.background,

    borderTopWidth: 0.5,

    elevation: 12,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 8,
    },

    shadowOpacity: 0.12,
    shadowRadius: 16,

    paddingHorizontal: 23,

    paddingTop: 18,
  },

  tabItem: {
    width: 120,
    height: 60,

    borderRadius: 20,

    justifyContent: "center",
    alignItems: "center",

    gap: 1,

    overflow: "hidden",
  },

  activeTab: {
    borderWidth: 2,

    borderColor: COLORS.primary,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.08,
    shadowRadius: 8,

    elevation: 4,
  },

  label: {
    fontSize: 12,
    fontWeight: "700",
  },
  titleIcons: {
    marginVertical: 8,
  },
});
