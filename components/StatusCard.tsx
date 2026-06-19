import { View, Text, StyleSheet } from "react-native";
import { COLORS, RADIUS, SPACING } from "@/constants/theme";

type StatusCardProps = {
  controllerName: string;
  isOnline: boolean;
  activeDevices: number;
  totalRelays: number;
};

export default function StatusCard({
  controllerName,
  isOnline,
  activeDevices,
  totalRelays,
}: StatusCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{controllerName}</Text>

      <View style={styles.statusRow}>
        <View
          style={[
            styles.statusDot,
            {
              backgroundColor: isOnline ? COLORS.success : COLORS.inactive,
            },
          ]}
        />

        <Text style={styles.statusText}>{isOnline ? "Online" : "Offline"}</Text>
      </View>

      <Text style={styles.deviceText}>
        {activeDevices} / {totalRelays} Devices Active
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    height: 180,

    backgroundColor: COLORS.surface,

    borderRadius: RADIUS.xl,

    padding: SPACING.lg,

    justifyContent: "space-between",
    
  },

  title: {
    fontSize: 24,
    fontWeight: "700",

    color: COLORS.navy,
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  statusDot: {
    width: 12,
    height: 12,

    borderRadius: 999,
  },

  statusText: {
    fontSize: 16,
    fontWeight: "600",

    color: COLORS.navy,
  },

  deviceText: {
    fontSize: 18,
    fontWeight: "600",

    color: COLORS.navy,
  },
});
