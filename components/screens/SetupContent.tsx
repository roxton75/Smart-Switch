import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS, RADIUS, SPACING } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import SmartModal from "components/ui/SmartModal";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { subscribeToController } from "services/controllerService";

export default function SetupContent() {
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<
    "loading" | "success" | "error" | "confirm"
  >("loading");
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const [waitingForController, setWaitingForController] = useState(false);
  const connectionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const [controllerLoading, setControllerLoading] = useState(true);

  const [controllerOnline, setControllerOnline] = useState(false);

  const [controllerData, setControllerData] = useState<any>(null);

  const [resettingController, setResettingController] = useState(false);

  const controllerConfigured = controllerData?.controllerConfigured ?? false;

  const [showForgetModal, setShowForgetModal] = useState(false);

  const [lastSeen, setLastSeen] = useState<Date | null>(null);

  // useEffect(() => {
  //   const unsubscribe = subscribeToController((controller) => {
  //     // console.log("FIREBASE:", controller);

  //     setControllerData(controller);

  //     setControllerOnline(controller?.isOnline ?? false);

  //     setControllerLoading(false);
  //   });

  //   return unsubscribe;
  // }, []);
  useEffect(() => {
    const unsubscribe = subscribeToController((controller) => {
      setControllerData(controller);

      if (!controller?.lastSeen) {
        setControllerOnline(false);
        setControllerLoading(false);
        return;
      }

      setLastSeen(new Date(controller.lastSeen));
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!lastSeen) {
      setControllerOnline(false);
      setControllerLoading(false);
      return;
    }

    const diff = Date.now() - lastSeen.getTime();

    setControllerOnline(diff < 20000);

    setControllerLoading(false);

    const interval = setInterval(() => {
      const diff = Date.now() - lastSeen.getTime();

      setControllerOnline(diff < 20000);
    }, 1000);

    return () => clearInterval(interval);
  }, [lastSeen]);

  useEffect(() => {
    if (waitingForController && controllerOnline) {
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
        connectionTimeoutRef.current = null;
      }

      setWaitingForController(false);

      setModalType("success");

      setModalTitle("Controller Connected");

      setModalMessage("Controller connected successfully.");

      setShowModal(true);
    }
  }, [controllerOnline, waitingForController]);

  useEffect(() => {
    if (showModal && modalType === "success") {
      const timer = setTimeout(() => {
        setShowModal(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showModal, modalType]);

  useEffect(() => {
    return () => {
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (resettingController && !controllerOnline && !controllerConfigured) {
      const timer = setTimeout(() => {
        setResettingController(false);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [resettingController, controllerOnline, controllerConfigured]);

  useEffect(() => {
    if (!controllerConfigured && !controllerOnline && showModal) {
      const timer = setTimeout(() => {
        setShowModal(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [controllerConfigured, controllerOnline, showModal]);

  const routerImageSource = controllerOnline
    ? require("@/assets/images/router-on.png")
    : require("@/assets/images/router-off.png");

  const confirmForgetController = async () => {
    try {
      setShowForgetModal(false);

      // SHOW MODAL IMMEDIATELY
      setModalType("loading");

      setModalTitle("Controller Resetting");

      setModalMessage(
        "Please wait while the controller returns to setup mode.",
      );

      setShowModal(true);

      if (!controllerData?.ipAddress) {
        setShowModal(false);

        setModalType("error");
        setModalTitle("Controller Offline");
        setModalMessage("Controller must be online to reset.");
        setShowModal(true);

        return;
      }

      const response = await fetch(
        `http://${controllerData.ipAddress}/factory-reset`,
        {
          method: "POST",
        },
      );

      if (response.ok) {
        //setControllerOnline(false);

        setControllerData((prev: any) => ({
          ...prev,
          controllerConfigured: false,
          wifiConnected: false,
          wifiSSID: "",
          isOnline: false,
          lastSeen: null,
        }));
      }
    } catch (error) {
      console.log(error);

      setModalType("error");

      setModalTitle("Reset Failed");

      setModalMessage("Failed to communicate with controller.");

      setShowModal(true);
    }
  };

  return (
    <SafeAreaView edges={["left", "right"]} style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollContent}
        contentContainerStyle={{
          paddingBottom: 140,
        }}
      >
        {/* HEADER */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.heading}>Controller</Text>

            <Text style={styles.subheading}>
              Configure and manage controller
            </Text>
          </View>

          {/* {controllerOnline && controllerData?.controllerConfigured && ( */}
          {controllerOnline && controllerConfigured && (
            <Pressable
              style={styles.forgetButton}
              // onPress={handleForgetController}
              onPress={() => setShowForgetModal(true)}
            >
              <Ionicons name="trash-outline" size={20} color="#88B04B" />

              <Text style={styles.forgetText}>Forget</Text>
            </Pressable>
          )}
        </View>

        {/* HERO */}

        <View style={styles.heroCard}>
          <Image
            source={require("@/assets/images/theme.png")}
            resizeMode="cover"
            style={styles.heroBackground}
          />

          <Image
            resizeMode="contain"
            source={routerImageSource}
            style={styles.routerImage}
          />

          <View style={styles.heroContent}>
            <Text style={styles.controllerTitle}>
              {controllerOnline ? controllerData?.wifiSSID : "Smart Switch"}
            </Text>

            <Text style={styles.controllerSubtitle}>
              {controllerData?.totalRelays || 0} Channels
            </Text>

            {controllerLoading ? (
              <View style={styles.loadingBadge}>
                <Text style={styles.loadingBadgeText}>•••</Text>
              </View>
            ) : (
              <View
                style={[
                  styles.statusPill,
                  controllerOnline ? styles.onlinePill : styles.offlinePill,
                ]}
              >
                <View
                  style={[
                    styles.statusDot,
                    !controllerOnline && styles.offlineDot,
                  ]}
                />

                <Text
                  style={[
                    styles.statusText,
                    !controllerOnline && styles.offlineText,
                  ]}
                >
                  {controllerOnline ? "Connected" : "Offline"}
                </Text>
              </View>
            )}

            <View style={styles.infoSection}>
              <Text style={styles.infoLabel}>Controller Name</Text>

              <Text style={styles.infoValue}>
                {controllerOnline
                  ? controllerData?.name || "Main Controller"
                  : "Not Connected"}
              </Text>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.infoLabel}>IP Address</Text>

              <Text style={styles.infoValue}>
                {controllerOnline
                  ? controllerData?.ipAddress || "192.168.1.2"
                  : "Unavailable"}
              </Text>
            </View>
          </View>
        </View>

        {/* Channels UI List */}

        {controllerLoading ? null : !controllerConfigured ? (
          waitingForController ? (
            <View style={styles.loaderCard}>
              <Ionicons name="wifi" size={48} color={COLORS.primary} />

              <Text style={styles.loaderTitle}>Connecting Controller</Text>

              <Text style={styles.loaderText}>
                This may take up to 20 seconds.
              </Text>
            </View>
          ) : (
            // Not Configured State
            <View style={styles.emptyStateContainer}>
              <Ionicons
                name="hardware-chip-outline"
                size={64}
                color={COLORS.primary}
              />

              <Text style={styles.emptyStateTitle}>
                Controller Not Configured
              </Text>

              <Text style={styles.emptyStateText}>
                Connect your controller to WiFi and complete the setup process
                to start controlling your smart devices.
              </Text>

              <Pressable
                style={styles.emptyStateButton}
                onPress={() => {
                  router.push("/wifi-config");
                }}
              >
                <Ionicons name="wifi-outline" size={18} color="#FFFFFF" />

                <Text style={styles.emptyStateButtonText}>Configure WiFi</Text>
              </Pressable>
            </View>
          )
        ) : !controllerOnline ? (
          <View style={styles.emptyStateContainer}>
            <Ionicons
              name="cloud-offline-outline"
              size={64}
              color={COLORS.inactive}
            />

            <Text style={styles.emptyStateTitle}>Controller Offline</Text>

            <Text style={styles.emptyStateText}>
              Your controller is configured but currently unreachable. Check the
              power supply and WiFi connection.
            </Text>
          </View>
        ) : null}

        {/* CHANNEL LIST */}
      </ScrollView>
      <SmartModal
        visible={showModal}
        type={modalType}
        title={modalTitle}
        message={modalMessage}
      />
      <SmartModal
        visible={showForgetModal}
        type="confirm"
        title="Forget Controller"
        message="This will remove the WiFi configuration and return the controller to setup mode."
        confirmText="Forget"
        cancelText="Cancel"
        onConfirm={confirmForgetController}
        onCancel={() => setShowForgetModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.surface,
  },

  scrollContent: {
    paddingTop: 14,
  },

  headerRow: {
    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    marginBottom: 20,
  },

  heading: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.primary,
    // marginTop: SPACING.md,
  },

  subheading: {
    fontSize: 16,
    fontWeight: "100",
    color: COLORS.grey,
    marginBottom: -4,
  },

  forgetButton: {
    flexDirection: "row",

    alignItems: "center",

    gap: 4,

    backgroundColor: COLORS.background,

    borderWidth: 1.5,

    borderColor: "#E3E3E3",

    paddingHorizontal: 14,

    paddingVertical: 10,

    marginTop: 6,
    borderRadius: RADIUS.xs,
    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 1,
    },

    marginRight: 1,
    shadowOpacity: 0.06,

    shadowRadius: 2,

    elevation: 2,
  },

  forgetText: {
    color: COLORS.navy,

    fontSize: 14,

    fontWeight: "600",
  },

  heroCard: {
    width: "100%",
    height: 220,

    borderRadius: RADIUS.lg,

    borderWidth: 2.5,
    borderColor: COLORS.lightBorder,

    backgroundColor: "#F7F7F7",

    overflow: "hidden",

    marginBottom: SPACING.md,

    flexDirection: "row",
  },

  heroBackground: {
    position: "absolute",

    width: "100%",
    height: "100%",
  },

  routerImage: {
    position: "absolute",
    zIndex: 999,
    right: -10,
    bottom: -34,

    width: 250,
    height: 250,

    elevation: 12,

    opacity: 0.95,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },

  heroContent: {
    flex: 1,

    paddingLeft: SPACING.lg,
    paddingTop: 16,
    paddingBottom: 24,
    justifyContent: "space-between",
  },

  controllerTitle: {
    fontSize: 24,

    fontWeight: "800",

    color: COLORS.navy,
  },

  controllerSubtitle: {
    fontSize: 14,

    color: COLORS.inactive,

    //marginTop: -4,
  },

  statusPill: {
    alignSelf: "flex-start",
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1.5,
    borderRadius: 999,
  },

  onlinePill: {
    backgroundColor: "#EDF6DE",
    borderColor: "#8585852c",
  },

  offlinePill: {
    backgroundColor: "#ffffff3b",
    borderColor: "#8585852c",
  },

  statusDot: {
    width: 5,
    height: 5,

    borderRadius: 999,

    backgroundColor: COLORS.primary,

    marginRight: 5,
  },

  offlineDot: {
    backgroundColor: COLORS.inactive,
  },

  statusText: {
    fontSize: 15,
    fontWeight: "600",

    color: COLORS.primary,
  },

  offlineText: {
    color: COLORS.inactive,
  },

  infoSection: {
    marginTop: 8,
  },

  infoLabel: {
    fontSize: 12,

    fontWeight: "600",

    color: COLORS.inactive,
  },

  infoValue: {
    fontSize: 15,

    fontWeight: "700",

    color: COLORS.navy,
  },

  wifiName: {
    fontSize: 28,

    fontWeight: "800",

    color: COLORS.navy,

    marginTop: 6,
  },

  subText: {
    fontSize: 14,

    fontWeight: "600",

    color: "#9E9E9E",

    marginTop: 4,
  },

  sectionTitle: {
    fontSize: 28,

    fontWeight: "800",

    color: COLORS.navy,
  },

  subtitle: {
    fontSize: 15,

    color: COLORS.grey,
    marginBottom: SPACING.md,
  },

  listContainer: {
    gap: 12,
  },

  channelCard: {
    width: "100%",

    minHeight: 92,

    borderRadius: 20,

    backgroundColor: "#F4F4F4",

    borderWidth: 1.5,

    borderColor: "#D6D6D6",

    paddingHorizontal: 16,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",
  },

  assignedCard: {
    borderColor: COLORS.primary,
  },

  leftContent: {
    flexDirection: "row",

    alignItems: "center",

    gap: 14,
  },

  iconWrapper: {
    width: 44,
    height: 44,

    borderRadius: 999,

    backgroundColor: "#ECECEC",

    alignItems: "center",

    justifyContent: "center",
  },

  activeIconWrapper: {
    backgroundColor: "#EDF6DE",
  },

  channelTitle: {
    fontSize: 17,

    fontWeight: "700",

    color: COLORS.navy,
  },

  channelSubtitle: {
    fontSize: 13,

    fontWeight: "600",

    color: "#9E9E9E",

    marginTop: 3,
  },

  rightContent: {
    alignItems: "center",

    gap: 10,
  },

  badge: {
    width: 56,

    height: 28,

    borderRadius: 999,

    alignItems: "center",

    justifyContent: "center",
  },

  onBadge: {
    backgroundColor: COLORS.primary,
  },

  offBadge: {
    backgroundColor: "#ECECEC",

    borderWidth: 1,

    borderColor: "#D6D6D6",
  },

  badgeText: {
    fontSize: 13,

    fontWeight: "700",
  },

  formContainer: {
    marginBottom: 24,
  },

  input: {
    height: 54,

    borderWidth: 1.5,
    borderColor: "#D8D8D8",

    borderRadius: 14,

    backgroundColor: "#F7F7F7",

    paddingHorizontal: 16,

    marginBottom: 12,

    color: COLORS.navy,
  },
  passwordContainer: {
    height: 54,

    borderWidth: 1.5,
    borderColor: "#D8D8D8",

    borderRadius: 14,

    backgroundColor: "#F7F7F7",

    paddingHorizontal: 16,

    marginBottom: 12,

    flexDirection: "row",

    alignItems: "center",
  },

  passwordInput: {
    flex: 1,

    color: COLORS.navy,
  },
  connectButton: {
    height: 54,

    borderRadius: 14,

    backgroundColor: COLORS.primary,

    justifyContent: "center",
    alignItems: "center",
  },

  connectButtonText: {
    color: "#FFFFFF",

    fontSize: 16,
    fontWeight: "700",
  },

  header: {
    marginBottom: 20,
  },

  onlineContainer: {
    marginTop: SPACING.lg,
  },

  infoCard: {
    padding: 16,

    borderRadius: 14,

    backgroundColor: "#F5F5F5",

    borderWidth: 2.5,

    borderColor: "#E0E0E0",

    marginBottom: 12,
  },

  wifiRow: {
    flexDirection: "row",

    alignItems: "center",

    gap: 10,

    marginTop: 12,
  },

  infoRow: {
    marginTop: 12,
  },

  loadingPill: {
    backgroundColor: "#ECECEC",
  },

  loadingBadge: {
    marginTop: 8,

    height: 30,

    paddingHorizontal: 16,

    borderRadius: 999,

    backgroundColor: "#ECECEC",

    justifyContent: "center",

    alignItems: "center",

    alignSelf: "flex-start",

    borderWidth: 1,

    borderColor: "#DCDCDC",
  },

  loadingBadgeText: {
    fontSize: 15,

    fontWeight: "700",

    color: COLORS.inactive,

    letterSpacing: 2,
  },

  loadingDot: {
    backgroundColor: "#BDBDBD",
  },

  onlineDot: {
    backgroundColor: COLORS.primary,
  },

  loadingText: {
    color: "#9E9E9E",
  },

  onlineText: {
    color: COLORS.primary,
  },

  loaderCard: {
    alignItems: "center",
    justifyContent: "center",

    paddingVertical: 40,
  },

  loaderTitle: {
    fontSize: 22,
    fontWeight: "800",

    color: COLORS.navy,

    marginTop: 12,
  },

  loaderText: {
    fontSize: 15,

    color: COLORS.grey,

    marginTop: 6,

    textAlign: "center",
  },

  emptyStateContainer: {
    alignItems: "center",

    justifyContent: "center",

    paddingVertical: 50,

    paddingHorizontal: 20,
  },

  emptyStateTitle: {
    fontSize: 22,

    fontWeight: "800",

    color: COLORS.navy,

    marginTop: 16,

    marginBottom: 8,
  },

  emptyStateText: {
    fontSize: 15,

    textAlign: "center",

    color: COLORS.grey,

    lineHeight: 22,

    marginBottom: 24,
  },

  emptyStateButton: {
    flexDirection: "row",

    alignItems: "center",

    gap: 8,

    backgroundColor: COLORS.primary,

    paddingHorizontal: 18,

    paddingVertical: 12,

    borderRadius: 999,
  },

  emptyStateButtonText: {
    color: "#FFFFFF",

    fontWeight: "700",

    fontSize: 15,
  },
});
