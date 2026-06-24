/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  FlatList,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import DeviceCard from "@/components/DeviceCard";

import { COLORS, RADIUS, SPACING } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";

import { FONTS } from "@/constants/fonts";
import { subscribeToController } from "@/services/controllerService";
import { subscribeToDevices } from "@/services/relayService";
import { Device } from "@/types/device";
import DeviceCardSkeleton from "./DeviceCardSkeleton";
export default function DevicesContent() {
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToDevices((devices) => {
      setTimeout(() => {
        setDevices(devices as Device[]);
        setLoading(false);
      }, 1500); // Delay for Skeleton loading effect
    });

    return unsubscribe;
  }, []);

  const locations = [...new Set(devices.map((device) => device.location))];

  const activeDevices = devices.filter((d) => d.state).length;

  const totalDevices = devices.length;

  const onlineDevices = devices.filter((d) => d.isOnline).length;

  const [controllerLoading, setControllerLoading] = useState(true);
  const [controllerOnline, setControllerOnline] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToController((controller) => {
      setTimeout(() => {
        if (!controller?.lastSeen) {
          setControllerOnline(false);
          setControllerLoading(false);
          return;
        }

        const controllerLastSeen = new Date(controller.lastSeen);

        const diff = Date.now() - controllerLastSeen.getTime();

        setControllerOnline(diff < 20500);

        setLastSeen(controllerLastSeen);

        setControllerLoading(false);
      }, 1500);
    });

    return unsubscribe;
  }, []);

  const [lastSeen, setLastSeen] = useState<Date | null>(null);
  useEffect(() => {
    const interval = setInterval(() => {
      if (!lastSeen) {
        setControllerOnline(false);
        return;
      }

      const diff = Date.now() - lastSeen.getTime();

      // if (diff > 20000) {
      //   setControllerOnline(false);
      // } else {
      //   setControllerOnline(true);
      // }
      setControllerOnline(diff < 20500);
    }, 1000);

    return () => clearInterval(interval);
  }, [lastSeen]);

  return (
    <SafeAreaView edges={["left", "right"]} style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.heading}>Manage</Text>
            <Text style={styles.subheading}>
              View and control all your devices
            </Text>
          </View>

          <Pressable
            style={styles.addButton}
            onPress={() => router.push("/setup")}
          >
            <Ionicons
              name="settings-outline"
              size={26}
              color={COLORS.primary}
            />
          </Pressable>
        </View>

        <ImageBackground
          style={styles.statsStrip}
          source={require("@/assets/images/theme.png")}
          resizeMode="cover"
          imageStyle={{
            // borderRadius: 12
            height: "200%",
          }}
        >
          <View style={styles.statItem}>
            <Text
              style={[
                styles.statValue,
                !controllerOnline && styles.offlineStat,
              ]}
            >
              {controllerOnline ? activeDevices : 0}
            </Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <View style={styles.wifiStatusContainer}>
              <Text
                style={[
                  styles.statValue,
                  controllerLoading
                    ? styles.loadingText
                    : controllerOnline
                      ? styles.onlineText
                      : styles.offlineText,
                ]}
              >
                {controllerLoading
                  ? "•••"
                  : controllerOnline
                    ? "Connected"
                    : "Offline"}
              </Text>
            </View>

            <Text style={styles.statLabel}>WiFi</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text
              style={[
                styles.statValue,
                !controllerOnline && styles.offlineStat,
              ]}
            >
              {controllerOnline ? totalDevices : 8}
            </Text>

            <Text style={styles.statLabel}>Devices</Text>
          </View>
        </ImageBackground>

        {/* ROOM SECTION */}
        {loading ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Loading Devices</Text>

            <View style={styles.skeletonGrid}>
              <DeviceCardSkeleton />
              <DeviceCardSkeleton />
              <DeviceCardSkeleton />
              <DeviceCardSkeleton />
              <DeviceCardSkeleton />
              <DeviceCardSkeleton />
            </View>
          </View>
        ) : !controllerOnline ? (
          <View style={styles.emptyStateContainer}>
            <Ionicons
              name="cloud-offline-outline"
              size={62}
              color={COLORS.inactive}
            />

            <Text style={styles.emptyStateTitle}>Controller Offline</Text>

            <Text style={styles.emptyStateText}>
              Smart Switch controller is currently unavailable. Check power and
              WiFi connection.
            </Text>
          </View>
        ) : devices.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Ionicons
              name="hardware-chip-outline"
              size={62}
              color={COLORS.primary}
            />

            <Text style={styles.emptyStateTitle}>No Devices Configured</Text>

            <Text style={styles.emptyStateText}>
              Assign relay channels and create your first smart device.
            </Text>

            <Pressable
              style={styles.emptyStateButton}
              onPress={() => router.push("/setup")}
            >
              <Ionicons
                name="settings-outline"
                size={26}
                color={COLORS.primary}
              />

              <Text style={styles.emptyStateButtonText}>Add Device</Text>
            </Pressable>
          </View>
        ) : (
          locations.map((location) => {
            const roomDevices = devices.filter(
              (device) => device.location === location,
            );

            return (
              <View key={location} style={styles.section}>
                <Text style={styles.sectionTitle}>{location}</Text>

                <FlatList
                  data={roomDevices}
                  numColumns={2}
                  scrollEnabled={false}
                  keyExtractor={(item) => item.relayId}
                  columnWrapperStyle={{
                    justifyContent: "space-between",
                    marginBottom: SPACING.sm,
                  }}
                  renderItem={({ item }) => (
                    <DeviceCard
                      relayId={item.relayId}
                      name={item.name}
                      type={item.type}
                      state={item.state}
                    />
                  )}
                />
              </View>
            );
          })
        )}

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //paddingTop: 0,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.surface,
  },

  scrollContent: {
    paddingTop: 10,
  },

  sectionHeader: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",
  },

  addButton: {
    width: 42,
    height: 42,
    marginTop: 6,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: "#DCDCDC",

    backgroundColor: COLORS.background,

    justifyContent: "center",
    alignItems: "center",

    elevation: 4,
    marginBottom: SPACING.md,
    marginRight: 4,
  },

  heading: {
    fontSize: 28,
    fontFamily: FONTS.heading,

    color: COLORS.primary,
  },

  subheading: {
    fontFamily: FONTS.semiBold,
    fontSize: 16,
    fontWeight: "100",
    color: COLORS.grey,
    marginBottom: SPACING.md,
  },

  statsStrip: {
    height: 78,

    borderRadius: RADIUS.lg,

    marginBottom: 18,

    //backgroundColor: "#F5F5F5",

    borderWidth: 2,

    borderColor: COLORS.lightBorder,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-evenly",

    overflow: "hidden",

    elevation: 1,
  },

  statItem: {
    alignItems: "center",
  },

  statValue: {
    fontSize: 22,

    fontFamily: FONTS.heading,

    color: COLORS.primary,
  },

  connectedText: {
    fontSize: 22,

    fontFamily: FONTS.heading,

    color: COLORS.primary,
  },

  statLabel: {
    fontSize: 13,

    fontFamily: FONTS.bold,

    color: COLORS.navy,
  },

  statDivider: {
    width: 1.5,

    height: 26,

    backgroundColor: "#D8D8D8",
  },

  section: {
    //marginBottom: SPACING.xs,
  },

  sectionTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,

    color: COLORS.navy,

    marginBottom: SPACING.xs,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",

    justifyContent: "space-between",

    gap: SPACING.md,
  },

  skeletonGrid: {
    flexDirection: "row",

    flexWrap: "wrap",

    justifyContent: "space-between",

    rowGap: SPACING.sm,

    paddingBottom: 140,
  },

  offlineStat: {
    color: COLORS.inactive,
  },
  emptyStateContainer: {
    alignItems: "center",

    justifyContent: "center",

    paddingVertical: 80,

    paddingHorizontal: 20,
  },

  emptyStateTitle: {
    fontSize: 22,

    fontFamily: FONTS.heading,

    color: COLORS.navy,

    marginTop: 16,

    marginBottom: 8,
  },

  emptyStateText: {
    fontSize: 15,

    fontFamily: FONTS.regular,

    color: COLORS.grey,

    textAlign: "center",

    lineHeight: 22,

    marginBottom: 24,
  },

  emptyStateButton: {
    flexDirection: "row",
    fontFamily: FONTS.semiBold,
    alignItems: "center",

    gap: 8,

    backgroundColor: COLORS.primary,

    paddingHorizontal: 18,

    paddingVertical: 12,

    borderRadius: 999,
  },

  emptyStateButtonText: {
    color: "#FFF",

    fontFamily: FONTS.bold,
  },

  wifiStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    color: COLORS.lightBorder,
  },

  onlineText: {
    color: COLORS.primary,
  },

  offlineText: {
    color: COLORS.inactive,
  },
});
