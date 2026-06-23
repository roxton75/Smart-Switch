import { useEffect, useRef, useState, type ComponentProps } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import SmartModal from "@/components/ui/SmartModal";
import { FONTS } from "@/constants/fonts";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, RADIUS, SPACING } from "constants/theme";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { subscribeToController } from "services/controllerService";

export default function WifiSetupContent() {
  const [wifiSSID, setWifiSSID] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [connecting, setConnecting] = useState(false);

  const [setupSuccess, setSetupSuccess] = useState(false);

  const [controllerData, setControllerData] = useState<any>(null);
  const [controllerOnline, setControllerOnline] = useState(false);
  const [waitingForController, setWaitingForController] = useState(false);
  const [lastSeen, setLastSeen] = useState<Date | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [showErrorModal, setShowErrorModal] = useState(false);

  const [errorTitle, setErrorTitle] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const unsubscribe = subscribeToController((controller) => {
      setControllerData(controller);

      if (controller?.lastSeen) {
        setLastSeen(new Date(controller.lastSeen));
      }
    });

    return unsubscribe;
  }, []);

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

  useEffect(() => {
    if (waitingForController && controllerOnline && controllerData?.wifiSSID) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      setConnecting(false);
      setWaitingForController(false);

      setSetupSuccess(true);
    }
  }, [waitingForController, controllerOnline, controllerData?.wifiSSID]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const configureESP = async () => {
    if (controllerData?.controllerConfigured) {
      setErrorTitle("Already Configured");

      setErrorMessage(
        "This controller is already connected to a WiFi network.",
      );

      setShowErrorModal(true);

      return;
    }
    if (!wifiSSID.trim()) {
      setErrorTitle("WiFi Name Required");

      setErrorMessage("Please enter your WiFi network name.");

      setShowErrorModal(true);

      return;
    }

    if (wifiPassword.length < 8) {
      setErrorTitle("Invalid Password");

      setErrorMessage("WiFi password must be at least 8 characters.");

      setShowErrorModal(true);

      return;
    }

    try {
      setConnecting(true);

      const controllerRequest = fetch("http://192.168.4.1/wifi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ssid: wifiSSID,
          password: wifiPassword,
        }),
      });

      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Controller unreachable")), 5000),
      );

      const response: any = await Promise.race([controllerRequest, timeout]);

      if (response.ok) {
        setWaitingForController(true);
        setConnecting(true);

        timeoutRef.current = setTimeout(() => {
          if (!controllerOnline) {
            setConnecting(false);
            setWaitingForController(false);

            setErrorTitle("Connection Failed");

            setErrorMessage(
              "Please connect your phone to SmartSwitch_Setup and try again.",
            );

            setShowErrorModal(true);
          }
        }, 35000);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // console.log(error);

      setConnecting(false);

      setErrorTitle("Controller Not Found");

      setErrorMessage("Your phone is not connected to SmartSwitch_Setup WiFi.");

      setShowErrorModal(true);
    }
  };

  const steps: {
    icon: ComponentProps<typeof Ionicons>["name"];
    title: string;
    description: string;
  }[] = [
    {
      icon: "power-outline",
      title: "Power on your controller",
      description:
        "Make sure your Smart Switch controller is connected to power.",
    },
    {
      icon: "wifi-outline",
      title: "Connect to SmartSwitch_Setup",
      description: "Open WiFi settings and connect to SmartSwitch_Setup.",
    },
    {
      icon: "phone-portrait-outline",
      title: "Return to Smart Switch",
      description: "Come back to the app after connecting to setup WiFi.",
    },
    {
      icon: "lock-closed-outline",
      title: "Enter WiFi credentials",
      description: "Provide your home WiFi name and password.",
    },
    {
      icon: "paper-plane-outline",
      title: "Tap Connect Controller",
      description: "The app will send your WiFi details to the controller.",
    },
    {
      icon: "sync-outline",
      title: "Wait up to 20 seconds",
      description: "Please wait while the controller connects to your network.",
    },
  ];
  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 120,
        }}
      >
        {/* Header */}

        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#243554" />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.title}>WiFi Setup</Text>

            <Text style={styles.subtitle}>
              Connect your Smart Switch Controller
            </Text>
          </View>
        </View>

        {/* Hero */}
        <View style={styles.heroContainer}>
          <Image
            source={require("@/assets/images/config-hero.png")}
            resizeMode="cover"
            style={styles.heroImage}
          />
        </View>

        {!setupSuccess ? (
          <>
            {/* Form Card */}

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>WiFi Configuration</Text>

              <Text style={styles.sectionSubtitle}>
                Enter your home network details
              </Text>
            </View>

            <TextInput
              placeholder="Wifi SSID"
              value={wifiSSID}
              onChangeText={setWifiSSID}
              style={styles.input}
            />

            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Wifi Password"
                value={wifiPassword}
                onChangeText={setWifiPassword}
                secureTextEntry={!showPassword}
                style={styles.passwordInput}
              />

              <Pressable onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color={COLORS.grey}
                />
              </Pressable>
            </View>

            <View style={styles.infoStrip}>
              <Ionicons name="information-circle" size={22} color="#88B04B" />

              <Text style={styles.infoStripText}>
                Make sure your phone is connected to{" "}
                <Text style={styles.infoStripBold}>SmartSwitch_Setup</Text> WiFi
                before continuing, or Read the instruction Below.
              </Text>
            </View>

            <View style={styles.separator}></View>

            <Pressable
              style={styles.connectButton}
              onPress={configureESP}
              disabled={connecting}
            >
              <Ionicons name="wifi-sharp" size={18} color="#FFF" />

              <Text style={styles.connectButtonText}>
                {connecting ? "Connecting..." : "Connect Controller"}
              </Text>
            </Pressable>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Setup Instructions</Text>

              <Text style={styles.sectionSubtitle}>
                Follow these steps to connect your controller
              </Text>
            </View>

            {/* Instruction Card */}

            <View style={styles.instructionsCard}>
              {steps.map((step, index) => (
                <View
                  key={index}
                  style={[
                    styles.stepItem,

                    index !== steps.length - 1 && styles.stepDivider,
                  ]}
                >
                  <View style={styles.iconBox}>
                    <Ionicons
                      name={step.icon}
                      size={22}
                      color={COLORS.primary}
                    />
                  </View>

                  <View style={styles.stepContent}>
                    <View style={styles.stepHeader}>
                      <View style={styles.stepBadge}>
                        <Text style={styles.stepNumber}>{index + 1}</Text>
                      </View>

                      <Text style={styles.stepTitle}>{step.title}</Text>
                    </View>

                    <Text style={styles.stepDescription}>
                      {step.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        ) : (
          <View style={styles.successCard}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark" size={42} color="#FFFFFF" />
            </View>

            <Text style={styles.successTitle}>Controller Connected</Text>

            <Text style={styles.successSubtitle}>
              Your Smart Switch Controller has been successfully connected.
            </Text>

            <View style={styles.successInfo}>
              <Text style={styles.successLabel}>Connected Network</Text>

              <Text style={styles.successValue}>
                {controllerData?.wifiSSID}
              </Text>
            </View>

            <View style={styles.successInfo}>
              <Text style={styles.successLabel}>IP Address</Text>

              <Text style={styles.successValue}>
                {controllerData?.ipAddress}
              </Text>
            </View>

            <Pressable
              style={styles.successButton}
              onPress={() => router.back()}
            >
              <Text style={styles.successButtonText}>Return To Setup</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
      <SmartModal
        visible={connecting}
        type="loading"
        title="Connecting Controller"
        message="Please wait while the controller is connecting"
      />
      <SmartModal
        visible={showErrorModal}
        type="error"
        title={errorTitle}
        message={errorMessage}
        onClose={() => setShowErrorModal(false)}
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
    paddingBottom: 40,
  },

  // HEADER

  header: {
    flexDirection: "row",
    alignItems: "center",

    paddingTop: 12,

    marginBottom: 18,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 12,

    backgroundColor: COLORS.card,

    justifyContent: "center",
    alignItems: "center",

    borderWidth: 1,
    borderColor: COLORS.lightBorder,
  },

  headerText: {
    flex: 1,

    alignItems: "center",

    marginRight: 42,
  },

  title: {
    fontSize: 26,
    fontFamily: FONTS.headingExtra,

    color: COLORS.primary,
  },

  subtitle: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.grey,

    marginTop: 2,
  },

  // HERO IMAGE
  heroContainer: {
    width: "100%",
    height: 200,

    borderRadius: RADIUS.lg,
    //
    overflow: "hidden",
    borderWidth: 2.5,
    borderColor: COLORS.lightBorder,
    position: "relative",
  },

  heroImage: {
    width: "100%",
    height: 200,
  },

  // CARD COMMON

  wifiCard: {
    //marginTop: SPACING.md,

    padding: 18,

    backgroundColor: "#F7F7F7",

    borderRadius: 20,

    borderWidth: 2,
    borderColor: COLORS.lightBorder,
  },

  cardTitle: {
    fontSize: 20,
    fontFamily: FONTS.heading,

    color: COLORS.navy,

    marginBottom: 14,
  },

  // INSTRUCTIONS

  sectionHeader: {
    marginTop: SPACING.md,
    marginBottom: SPACING.md,
  },

  sectionTitle: {
    fontSize: 24,
    fontFamily: FONTS.heading,
    color: COLORS.navy,
  },

  sectionSubtitle: {
    fontSize: 15,
    color: COLORS.grey,
    fontFamily: FONTS.medium,
    marginTop: 2,
  },

  instructionsCard: {
    backgroundColor: COLORS.card,

    borderRadius: RADIUS.lg,

    borderWidth: 2,
    borderColor: COLORS.lightBorder,

    overflow: "hidden",
  },

  stepItem: {
    flexDirection: "row",

    padding: 16,
  },

  stepDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
  },

  iconBox: {
    width: 52,
    height: 52,

    borderRadius: 14,

    backgroundColor: "#EDF6DE",

    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    marginRight: 14,
  },

  stepContent: {
    flex: 1,
  },

  stepHeader: {
    flexDirection: "row",
    alignItems: "center",

    marginBottom: 4,
  },

  stepBadge: {
    width: 20,
    height: 20,

    borderRadius: 999,

    backgroundColor: COLORS.primary,

    justifyContent: "center",
    alignItems: "center",

    marginRight: 8,
  },

  stepNumber: {
    color: "#FFFFFF",
    fontSize: 11,
    fontFamily: FONTS.bold,
  },

  stepTitle: {
    flex: 1,

    fontSize: 16,
    fontFamily: FONTS.bold,

    color: COLORS.navy,
  },

  stepDescription: {
    fontSize: 13,

    lineHeight: 18,

    color: COLORS.grey,
  },

  instructionCard: {
    backgroundColor: "#F7F7F7",

    borderWidth: 2.5,
    borderColor: COLORS.lightBorder,

    borderRadius: RADIUS.lg,

    padding: SPACING.lg,

    marginTop: SPACING.md,

    marginBottom: SPACING.md,
  },

  instructionTitle: {
    fontSize: 22,

    fontFamily: FONTS.heading,

    color: COLORS.navy,

    marginBottom: 18,
  },

  stepRow: {
    flexDirection: "row",

    alignItems: "flex-start",

    gap: 12,

    marginBottom: 16,
  },

  stepText: {
    flex: 1,

    fontSize: 15,

    fontWeight: "500",

    color: COLORS.navy,

    lineHeight: 22,
  },

  instructionRow: {
    flexDirection: "row",

    alignItems: "flex-start",

    marginBottom: 14,
  },

  // FORM

  input: {
    height: 54,

    borderWidth: 2,
    borderColor: COLORS.lightBorder,

    borderRadius: 14,

    backgroundColor: COLORS.card,

    paddingHorizontal: 16,

    marginBottom: 12,

    color: COLORS.navy,
  },

  passwordContainer: {
    height: 54,

    borderWidth: 2,
    borderColor: "#D8D8D8",

    borderRadius: 14,

    backgroundColor: "#FFFFFF",

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
    height: 56,
    borderWidth: 2,
    borderColor: COLORS.buttonBorder,
    borderRadius: 14,
    fontFamily: FONTS.semiBold,
    backgroundColor: COLORS.primary,

    justifyContent: "center",
    alignItems: "center",
  },

  formCard: {
    backgroundColor: COLORS.card,

    borderRadius: RADIUS.lg,

    borderWidth: 2,
    borderColor: COLORS.lightBorder,

    padding: SPACING.lg,

    marginBottom: 30,
  },

  fieldLabel: {
    fontSize: 14,

    fontFamily: FONTS.bold,

    color: COLORS.navy,

    marginBottom: 8,
  },

  separator: {
    height: 2,

    backgroundColor: "#E7E7E7",
    marginHorizontal: 10,
    marginVertical: SPACING.sm,
  },

  connectButtonText: {
    color: "#FFFFFF",

    fontSize: 16,

    fontFamily: FONTS.bold,
  },

  infoStrip: {
    flexDirection: "row",

    alignItems: "flex-start",

    padding: 12,

    borderRadius: 16,

    backgroundColor: "#F4F8EE",

    borderWidth: 1.5,

    borderColor: "#DCE8C8",

    gap: 10,
  },

  infoStripText: {
    flex: 1,

    fontSize: 12,

    lineHeight: 18,

    color: COLORS.navy,

    fontWeight: "500",
  },

  infoStripBold: {
    fontFamily: FONTS.bold,

    color: COLORS.primary,
  },

  // LOADER CARD

  loaderCard: {
    marginTop: SPACING.md,

    paddingVertical: 40,

    alignItems: "center",

    backgroundColor: "#F7F7F7",

    borderRadius: 20,

    borderWidth: 2,
    borderColor: COLORS.lightBorder,
  },

  loaderTitle: {
    marginTop: 14,

    fontSize: 20,

    fontFamily: FONTS.heading,

    color: COLORS.navy,
  },

  loaderText: {
    marginTop: 6,

    textAlign: "center",

    color: COLORS.grey,

    fontSize: 15,
  },

  successCard: {
    backgroundColor: COLORS.card,

    borderRadius: RADIUS.lg,
    marginTop: SPACING.sm,
    borderWidth: 2,
    borderColor: COLORS.lightBorder,

    padding: 24,

    alignItems: "center",
  },

  successIcon: {
    width: 72,
    height: 72,

    borderRadius: 999,

    backgroundColor: COLORS.primary,

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 18,
  },

  successTitle: {
    fontSize: 24,

    fontFamily: FONTS.heading,

    color: COLORS.navy,

    marginBottom: 8,
  },

  successSubtitle: {
    textAlign: "center",
    fontFamily: FONTS.medium,
    color: COLORS.grey,

    lineHeight: 22,

    marginBottom: 20,
  },

  successInfo: {
    width: "100%",

    marginBottom: 18,
  },

  successLabel: {
    fontSize: 12,

    fontFamily: FONTS.semiBold,

    color: COLORS.inactive,
  },

  successValue: {
    fontSize: 16,

    fontFamily: FONTS.bold,

    color: COLORS.navy,

    marginTop: 2,
  },

  successButton: {
    width: "100%",
    fontFamily: FONTS.semiBold,
    height: 56,

    borderRadius: 14,

    borderWidth: 2,

    borderColor: COLORS.buttonBorder,

    backgroundColor: COLORS.primary,

    justifyContent: "center",
    alignItems: "center",

    marginTop: 10,
  },

  successButtonText: {
    color: "#FFFFFF",

    fontSize: 16,

    fontFamily: FONTS.bold,
  },
});
