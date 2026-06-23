import DeviceCard from "@/components/DeviceCard";
import { COLORS, RADIUS, SPACING } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { FONTS } from "@/constants/fonts";
import { subscribeToController } from "@/services/controllerService";
import { subscribeToDevices } from "@/services/relayService";
import { Device } from "@/types/device";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import DeviceCardSkeleton from "./DeviceCardSkeleton";

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [controllerLoading, setControllerLoading] = useState(true);
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToDevices((devices) => {
      setTimeout(() => {
        setDevices(devices as Device[]);
        setLoading(false);
        //setControllerLoading(false);
      }, 1500); // Delay for Skeleton loading effect
    });

    return unsubscribe;
  }, []);

  const date = new Date();
  const day = date.getDate();
  const month = date
    .toLocaleString("default", {
      month: "short",
    })
    .toUpperCase();

  const [controllerOnline, setControllerOnline] = useState(false);
  const [controllerData, setControllerData] = useState<any>(null);
  useEffect(() => {
    const unsubscribe = subscribeToController((controller) => {
      setControllerData(controller);
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

      setControllerOnline(diff < 20500);
    }, 1000);

    return () => clearInterval(interval);
  }, [lastSeen]);

  const activeDevices = controllerOnline
    ? devices.filter((device) => device.state).length
    : 0;

  const totalDevices = controllerOnline ? devices.length : 8;

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.welcomeSection}>
          <View>
            <Text style={styles.heading}>Welcome,</Text>

            <Text style={styles.subheading}>
              Here&apos;s your Smart Home status
            </Text>
          </View>

          <View style={styles.dateCard}>
            <Text style={styles.dateNumber}>{day}</Text>

            <Text style={styles.dateMonth}>{month}</Text>
          </View>
        </View>

        {/* HERO CARD */}
        <View style={styles.heroContainer}>
          <Image
            source={require("@/assets/images/hero.png")}
            resizeMode="cover"
            style={styles.heroImage}
          />

          <View style={styles.overlayContent}>
            <View>
              <Text style={styles.controllerTitle}>
                {controllerOnline
                  ? controllerData?.name || "Main Controller"
                  : "Smart Switch"}
              </Text>

              <Text style={styles.subtitle}>Your Smart Home is</Text>

              {controllerLoading ? (
                <View style={styles.loadingBadge}>
                  <Text style={styles.loadingBadgeText}>•••</Text>
                </View>
              ) : (
                <View
                  style={[
                    styles.onlineBadge,
                    !controllerOnline && styles.offlineBadge,
                  ]}
                >
                  <View
                    style={[
                      styles.onlineDot,
                      !controllerOnline && styles.offlineDot,
                    ]}
                  />

                  <Text
                    style={[
                      styles.onlineText,
                      !controllerOnline && styles.offlineText,
                    ]}
                  >
                    {controllerOnline ? "Online" : "Offline"}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.bottomStats}>
              <View style={styles.statBox}>
                {/* <Text style={styles.statNumber}>{activeDevices}</Text> */}
                <Text
                  style={[
                    styles.statNumber,
                    !controllerOnline && styles.offlineStatNumber,
                  ]}
                >
                  {activeDevices}
                </Text>
                <Text
                  style={[
                    styles.statLabel,
                    !controllerOnline && styles.offlineStatLabel,
                  ]}
                >
                  Active
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.statBox}>
                <Text
                  style={[
                    styles.statNumber,
                    !controllerOnline && styles.offlineStatNumber,
                  ]}
                >
                  {totalDevices}
                </Text>

                <Text
                  style={[
                    styles.statLabel,
                    !controllerOnline && styles.offlineStatLabel,
                  ]}
                >
                  Total
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.devicesTitle}>Devices</Text>
            <Text style={styles.deviceSubheading}>
              Your devices at a glance
            </Text>
          </View>

          <Pressable
            style={styles.addButton}
            onPress={() => router.push("/setup")}
          >
            <Ionicons name="add" size={28} color="#FFFFFF" />
          </Pressable>
        </View>

        {loading ? (
          <View style={styles.skeletonGrid}>
            <DeviceCardSkeleton />
            <DeviceCardSkeleton />
            <DeviceCardSkeleton />
            <DeviceCardSkeleton />
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
              Smart Switch controller is currently unavailable. Please check the
              power supply and WiFi connection.
            </Text>
          </View>
        ) : devices.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Ionicons
              name="hardware-chip-outline"
              size={64}
              color={COLORS.primary}
            />

            <Text style={styles.emptyStateTitle}>No Devices Configured</Text>

            <Text style={styles.emptyStateText}>
              Connect your first light, fan or socket to start controlling your
              smart home.
            </Text>

            <Pressable
              style={styles.emptyStateButton}
              onPress={() => router.push("/setup")}
            >
              <Ionicons name="add" size={18} color="#FFFFFF" />

              <Text style={styles.emptyStateButtonText}>Add First Device</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={devices}
            numColumns={2}
            scrollEnabled={false}
            keyExtractor={(item) => item.relayId}
            columnWrapperStyle={{
              justifyContent: "space-between",
              marginBottom: SPACING.sm,
            }}
            contentContainerStyle={{
              paddingBottom: 140,
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
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: COLORS.surface,

    paddingHorizontal: SPACING.lg,
    //paddingTop: -22,
  },

  scrollContent: {
    paddingTop: 10,
  },

  heading: {
    fontSize: 28,
    fontFamily: FONTS.heading,

    color: COLORS.primary,
  },

  subheading: {
    fontSize: 16,
    fontWeight: "100",
    fontFamily: FONTS.semiBold,
    color: COLORS.grey,

    //marginBottom: SPACING.md,
  },

  welcomeSection: {
    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",
    marginBottom: SPACING.md,
  },

  dateCard: {
    width: 48,
    height: 48,

    marginTop: 6,

    borderRadius: 10,

    backgroundColor: "#F5F5F5",

    borderWidth: 1.5,

    borderColor: "#E3E3E3",

    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.06,

    shadowRadius: 2,

    elevation: 2,
  },

  dateNumber: {
    fontSize: 24,

    fontFamily: FONTS.headingExtra,

    color: COLORS.primary,

    lineHeight: 24,
  },

  dateMonth: {
    fontSize: 13,

    fontFamily: FONTS.bold,

    color: COLORS.navy,

    letterSpacing: 0.5,
  },

  heroContainer: {
    width: "100%",
    height: 220,

    borderRadius: RADIUS.lg,

    overflow: "hidden",
    marginBottom: SPACING.md,
    borderWidth: 2.5,
    borderColor: COLORS.lightBorder,
    position: "relative",
  },

  heroImage: {
    width: "100%",
    height: "100%",

    position: "absolute",
  },

  overlayContent: {
    flex: 1,

    padding: SPACING.lg,
    paddingLeft: 20,

    justifyContent: "space-between",
  },

  controllerTitle: {
    fontSize: 20,
    fontFamily: FONTS.headingExtra,

    color: COLORS.navy,

    marginTop: 10,
  },

  subtitle: {
    fontSize: 15,
    fontFamily: FONTS.medium,
    color: COLORS.grey,
  },

  onlineBadge: {
    marginTop: 6,

    width: 80,
    height: 28,

    backgroundColor: "#e0e0e0a6",

    borderRadius: 999,

    flexDirection: "row",

    alignItems: "center",
    justifyContent: "center",

    gap: 4,
  },

  onlineDot: {
    width: 8,
    height: 8,

    borderRadius: 999,

    backgroundColor: COLORS.primary,
  },

  onlineText: {
    fontSize: 16,
    fontFamily: FONTS.semiBold,
    paddingBottom: 2,
    color: COLORS.navy,
  },

  bottomStats: {
    width: 125,
    height: 65,

    backgroundColor: "#f5f5f5bf",

    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e2e2",

    flexDirection: "row",

    alignItems: "center",
    justifyContent: "space-evenly",

    backdropFilter: "blur(10px)",
    shadowColor: "#a8a8a84b",

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.08,
    shadowRadius: 12,

    elevation: 6,
  },

  statBox: {
    alignItems: "center",
    justifyContent: "center",
  },

  statNumber: {
    fontSize: 26,
    fontFamily: FONTS.heading,

    color: COLORS.primary,
  },

  statLabel: {
    fontSize: 12,
    fontFamily: FONTS.semiBold,
    paddingBottom: 4,
    color: COLORS.navy,
  },

  divider: {
    width: 1,
    height: 20,

    backgroundColor: "#D0D0D0",
  },

  devicesTitle: {
    fontSize: 28,
    fontFamily: FONTS.heading,

    color: COLORS.navy,
  },

  deviceSubheading: {
    fontSize: 16,
    fontWeight: "100",
    fontFamily: FONTS.semiBold,
    color: COLORS.grey,

    marginBottom: SPACING.md,
  },
  sectionHeader: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",
  },

  addButton: {
    width: 44,
    height: 44,
    marginTop: 6,

    borderRadius: 999,

    backgroundColor: COLORS.primary,

    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.05,

    shadowRadius: 8,

    elevation: 2,
    marginBottom: SPACING.md,
  },

  addIcon: {
    fontSize: 28,

    color: "#FFFFFF",

    fontWeight: "400",

    marginTop: -2,
  },

  // scrollContent: {
  //   paddingBottom: 140,
  // },

  skeletonGrid: {
    flexDirection: "row",

    flexWrap: "wrap",

    justifyContent: "space-between",

    rowGap: SPACING.sm,

    paddingBottom: 140,
  },

  offlineBadge: {
    backgroundColor: "#ECECEC",
  },

  offlineDot: {
    backgroundColor: COLORS.inactive,
  },

  offlineText: {
    color: COLORS.inactive,
    paddingBottom: 2,
  },

  emptyStateContainer: {
    alignItems: "center",

    justifyContent: "center",

    paddingVertical: 60,

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
    textAlign: "center",

    color: COLORS.grey,

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
    color: "#FFFFFF",

    fontFamily: FONTS.bold,

    fontSize: 15,
  },
  offlineStatNumber: {
    color: COLORS.inactive,
  },
  offlineStatLabel: {
    color: COLORS.inactive,
  },
  loadingBadge: {
    marginTop: 6,

    width: 80,
    height: 28,

    borderRadius: 999,

    backgroundColor: "#ECECEC",

    justifyContent: "center",
    alignItems: "center",

    borderWidth: 1,

    borderColor: "#DCDCDC",
  },

  loadingBadgeText: {
    fontSize: 16,

    fontFamily: FONTS.bold,

    color: COLORS.inactive,

    letterSpacing: 2,
  },
});
